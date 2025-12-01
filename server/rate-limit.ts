import rateLimit from "express-rate-limit";

// Rate limiter pour les routes d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite à 5 tentatives par fenêtre
  message: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Rate limiter pour les routes générales de l'API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par fenêtre
  message: "Trop de requêtes. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter strict pour la création de comptes
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Limite à 3 comptes par heure
  message: "Trop de comptes créés. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
