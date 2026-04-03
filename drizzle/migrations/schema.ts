import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const recipes = sqliteTable("recipes", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	transformedCoverImage: text("transformed_cover_image"),
	angle: text(),
	coverImage: text("cover_image"),
	title: text().notNull(),
	slug: text().notNull(),
	description: text(),
	category: text().default("General"),
	prepTime: text("prep_time"),
	cookTime: text("cook_time"),
	totalTime: text("total_time"),
	servings: integer(),
	s3Key: text("s3_key").notNull(),
	oldTitle: text("old_title"),
	scrapedUrl: text("scraped_url"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
},
(table) => [
	uniqueIndex("recipes_scraped_url_unique").on(table.scrapedUrl),
	uniqueIndex("recipes_slug_unique").on(table.slug),
]);

