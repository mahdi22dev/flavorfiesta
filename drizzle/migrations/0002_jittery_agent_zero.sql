CREATE TABLE `recipe_variation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_scraped_url` text NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`source_scraped_url`) REFERENCES `recipes`(`scraped_url`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `recipes` ADD `transformed_cover_image` text;--> statement-breakpoint
ALTER TABLE `recipes` ADD `angle` text;--> statement-breakpoint
ALTER TABLE `recipes` ADD `scraped_url` text;--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_scraped_url_unique` ON `recipes` (`scraped_url`);