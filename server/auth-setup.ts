import "dotenv/config";
import session from "express-session";
import type { Express } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { registerSchema, loginSchema, hashPassword, verifyPassword } from "./auth";
import { authLimiter, createAccountLimiter } from "./rate-limit";
import { logger } from "./logger";
import { z } from "zod";

export function getSession() {
  const sessionTtl = 30 * 60 * 1000; // 30 minutes (conforme aux exigences)
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl / 1000, // en secondes
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Protection XSS
      secure: process.env.NODE_ENV === 'production' || process.env.HTTPS === 'true', // HTTPS en production ou si configuré
      maxAge: sessionTtl,
      sameSite: 'strict', // Protection CSRF
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  logger.info("Local authentication system initialized");

  // POST /api/register - Inscription
  app.post("/api/register", createAccountLimiter, async (req, res) => {
    try {
      // Validation des données
      const validatedData = registerSchema.parse(req.body);

      // Vérifier si l'email existe déjà
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Un compte existe déjà avec cet email" 
        });
      }

      // Hasher le mot de passe avec bcrypt
      const hashedPassword = await hashPassword(validatedData.password);

      // Créer l'utilisateur
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        consentGiven: validatedData.consent,
        role: "USER",
      });

      // Créer la session
      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors.map(e => e.message)
        });
      }
      logger.error("Error during registration:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });

  // POST /api/login - Connexion
  app.post("/api/login", authLimiter, async (req, res) => {
    try {
      // Validation des données
      const validatedData = loginSchema.parse(req.body);

      // Récupérer l'utilisateur
      const user = await storage.getUserByEmail(validatedData.email);
      
      // Message générique pour ne pas révéler si l'email existe
      if (!user) {
        return res.status(401).json({ 
          message: "Identifiants invalides" 
        });
      }

      // Vérifier le mot de passe
      const isValid = await verifyPassword(validatedData.password, user.password);
      if (!isValid) {
        return res.status(401).json({ 
          message: "Identifiants invalides" 
        });
      }

      // Créer la session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides" 
        });
      }
      logger.error("Error during login:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  // GET /api/auth/user - Récupérer l'utilisateur connecté
  app.get("/api/auth/user", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      logger.error("Error fetching user:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // POST /api/logout - Déconnexion
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error("Error destroying session:", err);
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Déconnecté avec succès" });
    });
  });
}
