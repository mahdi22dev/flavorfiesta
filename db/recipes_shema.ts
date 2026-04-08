import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const QUALITY_SCORES = [
  "excellent",
  "good",
  "moderate",
  "bad",
  "hallucination",
  "pending",
] as const;

export type QualityScore = (typeof QUALITY_SCORES)[number];

// 1. The Hub: Pillars Table
export const pillars = sqliteTable("pillars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coverImage: text("cover_image"),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  haveContent: integer("have_content", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  outline: text("outline", { mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  s3_key: text("s3_key"),
  category: text("category").default("General"),
  tags: text("tags", { mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
});

// 2. The Spoke: Recipes Table (Cleaned up, images moved to relational table)
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pillarId: integer("pillar_id").references(() => pillars.id),
  haveContent: integer("have_content", { mode: "boolean" }).default(false),
  pillarSlug: text("pillar_slug").notNull(),

  // Core Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  outline: text("outline", { mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  s3_key: text("s3_key"),
  category: text("category").default("General"),

  // Recipe Meta
  prepTime: text("prep_time"),
  cookTime: text("cook_time"),
  totalTime: text("total_time"),
  servings: integer("servings"),

  qualityScore: text("quality_score").$type<QualityScore>().default("pending"), // Classifies the quality of the generated recipe
  isIndexed: integer("is_indexed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  tags: text("tags", { mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
});

export const recipeImages = sqliteTable("recipe_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Make these optional so one table handles both
  recipeId: integer("recipe_id").references(() => recipes.id),
  pillarId: integer("pillar_id").references(() => pillars.id),

  // Image URLs
  heroWide: text("hero_wide"),
  macroTexture: text("macro_texture"),
  ingredientsFlatlay: text("ingredients_flatlay"),
  wholeDish: text("whole_dish"),

  // Prompts for AI tracking
  heroWidePrompt: text("hero_wide_prompt"),
  macroTexturePrompt: text("macro_texture_prompt"),
  ingredientsFlatlayPrompt: text("ingredients_flatlay_prompt"),

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// export const recipes = sqliteTable("recipes", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   transformedCoverImage: text("transformed_cover_image"),
//   angle: text("angle"),
//   coverImage: text("cover_image"),
//   title: text("title").notNull(),
//   slug: text("slug").notNull().unique(),
//   description: text("description"),
//   category: text("category").default("General"),
//   prepTime: text("prep_time"),
//   cookTime: text("cook_time"),
//   totalTime: text("total_time"),
//   servings: integer("servings"),
//   s3Key: text("s3_key").notNull(),
//   oldTitle: text("old_title"),
//   scrapedUrl: text("scraped_url"),
//   createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
// });
