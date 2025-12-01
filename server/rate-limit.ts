import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Trop de comptes créés. Veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
