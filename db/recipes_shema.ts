import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transformedCoverImage: text("transformed_cover_image"),
  angle: text("angle"),
  coverImage: text("cover_image"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category").default("General"),
  prepTime: text("prep_time"),
  cookTime: text("cook_time"),
  totalTime: text("total_time"),
  servings: integer("servings"),
  s3Key: text("s3_key").notNull(),
  oldTitle: text("old_title"),
  scrapedUrl: text("scraped_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
