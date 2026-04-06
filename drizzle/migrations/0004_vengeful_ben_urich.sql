CREATE TABLE `pillars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cover_image` text,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`have_content` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`outline` text DEFAULT '[]',
	`s3_key` text
);
--> statement-breakpoint
CREATE TABLE `recipe_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`hero_wide` text,
	`macro_texture` text,
	`ingredients_flatlay` text,
	`whole_dish` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_images_recipe_id_unique` ON `recipe_images` (`recipe_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pillar_id` integer,
	`have_content` integer DEFAULT false,
	`pillar_slug` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`outline` text DEFAULT '[]',
	`s3_key` text,
	`prep_time` text,
	`cook_time` text,
	`total_time` text,
	`servings` integer,
	`quality_score` text DEFAULT 'pending',
	`is_indexed` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`pillar_id`) REFERENCES `pillars`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipes`("id", "pillar_id", "have_content", "pillar_slug", "title", "slug", "description", "outline", "s3_key", "prep_time", "cook_time", "total_time", "servings", "quality_score", "is_indexed", "created_at") SELECT "id", "pillar_id", "have_content", "pillar_slug", "title", "slug", "description", "outline", "s3_key", "prep_time", "cook_time", "total_time", "servings", "quality_score", "is_indexed", "created_at" FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_slug_unique` ON `recipes` (`slug`);