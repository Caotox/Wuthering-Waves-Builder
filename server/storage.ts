import {
  users,
  characters,
  userFavorites,
  characterBuilds,
  type User,
  type UpsertUser,
  type Character,
  type InsertCharacter,
  type UserFavorite,
  type InsertUserFavorite,
  type CharacterBuild,
  type InsertCharacterBuild,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
  // Character operations
  getAllCharacters(): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: InsertCharacter): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<void>;
  
  // Favorites operations
  getUserFavorites(userId: string): Promise<{ characterId: string }[]>;
  getUserFavoritesWithDetails(userId: string): Promise<{ characterId: string; character: Character }[]>;
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: string, characterId: string): Promise<void>;
  isFavorite(userId: string, characterId: string): Promise<boolean>;
  
  // Build operations
  getUserBuilds(userId: string): Promise<CharacterBuild[]>;
  getCharacterBuilds(characterId: string, userId: string): Promise<CharacterBuild[]>;
  getBuild(id: string): Promise<CharacterBuild | undefined>;
  createBuild(build: InsertCharacterBuild): Promise<CharacterBuild>;
  updateBuild(id: string, build: Partial<InsertCharacterBuild>): Promise<CharacterBuild | undefined>;
  deleteBuild(id: string): Promise<void>;
  getAllBuilds(): Promise<CharacterBuild[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    // D'abord supprimer les favoris de l'utilisateur
    await db.delete(userFavorites).where(eq(userFavorites.userId, id));
    // Puis supprimer l'utilisateur
    await db.delete(users).where(eq(users.id, id));
  }

  // Character operations
  async getAllCharacters(): Promise<Character[]> {
    return await db.select().from(characters);
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async createCharacter(characterData: InsertCharacter): Promise<Character> {
    const [character] = await db
      .insert(characters)
      .values(characterData)
      .returning();
    return character;
  }

  async updateCharacter(id: string, characterData: InsertCharacter): Promise<Character | undefined> {
    const [character] = await db
      .update(characters)
      .set({ ...characterData, updatedAt: new Date() })
      .where(eq(characters.id, id))
      .returning();
    return character;
  }

  async deleteCharacter(id: string): Promise<void> {
    await db.delete(characters).where(eq(characters.id, id));
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<{ characterId: string }[]> {
    const favorites = await db
      .select({ characterId: userFavorites.characterId })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));
    return favorites;
  }

  async getUserFavoritesWithDetails(userId: string): Promise<{ characterId: string; character: Character }[]> {
    const favorites = await db
      .select({
        characterId: userFavorites.characterId,
        character: characters,
      })
      .from(userFavorites)
      .innerJoin(characters, eq(userFavorites.characterId, characters.id))
      .where(eq(userFavorites.userId, userId));
    return favorites;
  }

  async addFavorite(favoriteData: InsertUserFavorite): Promise<UserFavorite> {
    const [favorite] = await db
      .insert(userFavorites)
      .values(favoriteData)
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, characterId: string): Promise<void> {
    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.characterId, characterId)
        )
      );
  }

  async isFavorite(userId: string, characterId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.characterId, characterId)
        )
      );
    return !!favorite;
  }

  // Build operations
  async getUserBuilds(userId: string): Promise<CharacterBuild[]> {
    return await db
      .select()
      .from(characterBuilds)
      .where(eq(characterBuilds.userId, userId));
  }

  async getCharacterBuilds(characterId: string, userId: string): Promise<CharacterBuild[]> {
    return await db
      .select()
      .from(characterBuilds)
      .where(
        and(
          eq(characterBuilds.characterId, characterId),
          eq(characterBuilds.userId, userId)
        )
      );
  }

  async getBuild(id: string): Promise<CharacterBuild | undefined> {
    const [build] = await db
      .select()
      .from(characterBuilds)
      .where(eq(characterBuilds.id, id));
    return build;
  }

  async createBuild(buildData: InsertCharacterBuild): Promise<CharacterBuild> {
    const [build] = await db
      .insert(characterBuilds)
      .values(buildData)
      .returning();
    return build;
  }

  async updateBuild(id: string, buildData: Partial<InsertCharacterBuild>): Promise<CharacterBuild | undefined> {
    const [build] = await db
      .update(characterBuilds)
      .set({ ...buildData, updatedAt: new Date() })
      .where(eq(characterBuilds.id, id))
      .returning();
    return build;
  }

  async deleteBuild(id: string): Promise<void> {
    await db.delete(characterBuilds).where(eq(characterBuilds.id, id));
  }

  async getAllBuilds(): Promise<CharacterBuild[]> {
    return db.select().from(characterBuilds).orderBy(characterBuilds.createdAt);
  }
}

export const storage = new DatabaseStorage();
