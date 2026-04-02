import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  category: text("category").default("General"),
  coverImage: text("cover_image"),
  prepTime: text("prep_time"),
  cookTime: text("cook_time"),
  totalTime: text("total_time"),
  servings: integer("servings"),
  s3Key: text("s3_key").notNull(),
  oldTitle: text("old_title"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
