import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, index, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (local authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // bcrypt hashed
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("USER"), // USER or ADMIN
  consentGiven: boolean("consent_given").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users);
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Wuthering Waves Characters table
export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  imageUrl: varchar("image_url").notNull(),
  rarity: integer("rarity").notNull(), // 4 or 5 stars
  weaponType: varchar("weapon_type").notNull(), // Sword, Broadblade, Pistols, Gauntlets, Rectifier
  element: varchar("element").notNull(), // Glacio, Fusion, Electro, Aero, Spectro, Havoc
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// User favorites table
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: varchar("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// Character builds table
export const characterBuilds = pgTable("character_builds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: varchar("character_id").notNull().references(() => characters.id, { onDelete: 'cascade' }),
  buildName: varchar("build_name").notNull(),
  weapon: varchar("weapon"),
  echoSet1: varchar("echo_set_1"),
  echoSet2: varchar("echo_set_2"),
  mainEcho: varchar("main_echo"),
  subStats: text("sub_stats"),
  finalStats: text("final_stats"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCharacterBuildSchema = createInsertSchema(characterBuilds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCharacterBuild = z.infer<typeof insertCharacterBuildSchema>;
export type CharacterBuild = typeof characterBuilds.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
}));

export const charactersRelations = relations(characters, ({ many }) => ({
  favorites: many(userFavorites),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [userFavorites.characterId],
    references: [characters.id],
  }),
}));

export const characterBuildsRelations = relations(characterBuilds, ({ one }) => ({
  user: one(users, {
    fields: [characterBuilds.userId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [characterBuilds.characterId],
    references: [characters.id],
  }),
}));
