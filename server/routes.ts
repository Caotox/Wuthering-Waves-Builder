import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth-setup";
import { isAuthenticated, isAdmin } from "./auth";
import { insertCharacterSchema, insertUserFavoriteSchema, insertCharacterBuildSchema } from "@shared/schema";
import { z } from "zod";
import { logger } from "./logger";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
}).strict();

const updateBuildSchema = z.object({
  buildName: z.string().min(1).optional(),
  weapon: z.string().optional(),
  echoSet1: z.string().optional(),
  echoSet2: z.string().optional(),
  mainEcho: z.string().optional(),
  subStats: z.string().optional(),
  notes: z.string().optional(),
}).strict();

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/characters', async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      logger.error("Error fetching characters:", error);
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get('/api/characters/:id', async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      logger.error("Error fetching character:", error);
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Admin routes for character management
  app.post('/api/admin/characters', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating character:", error);
      res.status(500).json({ message: "Failed to create character" });
    }
  });

  app.put('/api/admin/characters/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.updateCharacter(req.params.id, validatedData);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating character:", error);
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  app.delete('/api/admin/characters/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteCharacter(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting character:", error);
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  // Admin user management routes
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      // Ne pas renvoyer les mots de passe
      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      logger.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Empêcher la modification de son propre rôle
      if (userId === req.session!.userId && req.body.role) {
        return res.status(403).json({ message: "Vous ne pouvez pas modifier votre propre rôle" });
      }

      const validatedData = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUser(userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Empêcher la suppression de son propre compte
      if (userId === req.session!.userId) {
        return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
      }

      await storage.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin routes for builds
  app.get('/api/admin/builds', isAdmin, async (req, res) => {
    try {
      const builds = await storage.getAllBuilds();
      res.json(builds);
    } catch (error) {
      logger.error("Error fetching all builds:", error);
      res.status(500).json({ message: "Failed to fetch builds" });
    }
  });

  app.delete('/api/admin/builds/:id', isAdmin, async (req, res) => {
    try {
      const buildId = req.params.id;
      await storage.deleteBuild(buildId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting build:", error);
      res.status(500).json({ message: "Failed to delete build" });
    }
  });

  // Favorites routes (protected, user-specific)
  app.get('/api/favorites', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      logger.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.get('/api/favorites/details', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const favorites = await storage.getUserFavoritesWithDetails(userId);
      res.json(favorites);
    } catch (error) {
      logger.error("Error fetching favorites with details:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const validatedData = insertUserFavoriteSchema.parse({
        userId,
        characterId: req.body.characterId,
      });

      // Check if character exists
      const character = await storage.getCharacter(validatedData.characterId);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      // Check if already favorite
      const isFav = await storage.isFavorite(userId, validatedData.characterId);
      if (isFav) {
        return res.status(409).json({ message: "Already in favorites" });
      }

      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:characterId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const characterId = req.params.characterId;

      // IDOR protection: verify the favorite belongs to the authenticated user
      const isFav = await storage.isFavorite(userId, characterId);
      if (!isFav) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await storage.removeFavorite(userId, characterId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Build routes (protected, user-specific)
  app.get('/api/builds', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const builds = await storage.getUserBuilds(userId);
      res.json(builds);
    } catch (error) {
      logger.error("Error fetching builds:", error);
      res.status(500).json({ message: "Failed to fetch builds" });
    }
  });

  app.get('/api/characters/:characterId/builds', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const characterId = req.params.characterId;
      const builds = await storage.getCharacterBuilds(characterId, userId);
      res.json(builds);
    } catch (error) {
      logger.error("Error fetching character builds:", error);
      res.status(500).json({ message: "Failed to fetch character builds" });
    }
  });

  app.post('/api/builds', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const validatedData = insertCharacterBuildSchema.parse({
        ...req.body,
        userId,
      });

      const build = await storage.createBuild(validatedData);
      res.status(201).json(build);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating build:", error);
      res.status(500).json({ message: "Failed to create build" });
    }
  });

  app.put('/api/builds/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const buildId = req.params.id;

      // IDOR protection: verify the build belongs to the authenticated user
      const existingBuild = await storage.getBuild(buildId);
      if (!existingBuild || existingBuild.userId !== userId) {
        return res.status(404).json({ message: "Build not found" });
      }

      const validatedData = updateBuildSchema.parse(req.body);
      const updatedBuild = await storage.updateBuild(buildId, validatedData);
      res.json(updatedBuild);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating build:", error);
      res.status(500).json({ message: "Failed to update build" });
    }
  });

  app.delete('/api/builds/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const buildId = req.params.id;

      // IDOR protection: verify the build belongs to the authenticated user
      const existingBuild = await storage.getBuild(buildId);
      if (!existingBuild || existingBuild.userId !== userId) {
        return res.status(404).json({ message: "Build not found" });
      }

      await storage.deleteBuild(buildId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting build:", error);
      res.status(500).json({ message: "Failed to delete build" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
