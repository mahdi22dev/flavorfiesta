CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_slug` text NOT NULL,
	`recipe_id` integer,
	`author_name` text NOT NULL,
	`author_email` text,
	`body` text NOT NULL,
	`approved` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
