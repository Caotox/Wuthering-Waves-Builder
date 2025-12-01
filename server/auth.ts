import bcrypt from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { logger } from "./logger";

export const registerSchema = z.object({
  email: z.string().email("Format d'email invalide").max(255, "Email trop long"),
  password: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  firstName: z.string().min(1, "Le prénom est requis").max(100),
  lastName: z.string().min(1, "Le nom est requis").max(100),
  consent: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  })
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide").max(255, "Email trop long"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Non authentifié. Veuillez vous connecter." });
  }
  next();
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const user = await storage.getUserById(req.session.userId);
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès refusé. Droits administrateur requis." });
    }
    next();
  } catch (error) {
    logger.error("Error checking admin role:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
