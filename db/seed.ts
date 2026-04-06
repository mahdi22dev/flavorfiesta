// Import the REST API function you created
import { queryD1 } from "@/db/db";

async function runSeed() {
  console.log("🌱 Starting remote D1 database seeding via REST API...");

  try {
    // ---------------------------------------------------------
    // 1. SEED THE PILLAR (The Hub)
    // ---------------------------------------------------------
    console.log("Inserting Pillar...");

    // Using RETURNING id allows us to instantly grab the primary key
    const pillarResult = await queryD1<{ id: number }>(
      `INSERT INTO pillars (slug, title, description) 
       VALUES (?, ?, ?) 
       RETURNING id`,
      [
        "chicken-breasts",
        "The Ultimate Guide to Chicken Breasts",
        "Everything you need to know about cooking and mastering chicken breasts.",
      ],
    );

    const pillarId = pillarResult[0].id;
    console.log(`✅ Pillar inserted successfully. ID: ${pillarId}`);

    // ---------------------------------------------------------
    // 2. SEED THE RECIPE (The Spoke)
    // ---------------------------------------------------------
    console.log("Inserting Recipe...");

    const recipeResult = await queryD1<{ id: number }>(
      `INSERT INTO recipes (pillar_id, title, slug, description, s3_key, post_type, quality_score, is_indexed) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       RETURNING id`,
      [
        pillarId, // Relational mapping to the Hub
        "Juicy Air Fryer Chicken Breasts",
        "air-fryer-chicken-breasts",
        "Perfectly golden on the outside, incredibly juicy on the inside.",
        "recipes/air-fryer-chicken", // Matches your R2 folder structure
        "recipe",
        0,
        false,
      ],
    );

    const recipeId = recipeResult[0].id;
    console.log(`✅ Recipe inserted successfully. ID: ${recipeId}`);

    // ---------------------------------------------------------
    // 3. SEED THE IMAGES (1-to-1 Mapping)
    // ---------------------------------------------------------
    console.log("Linking Images...");

    await queryD1(
      `INSERT INTO recipe_images (recipe_id, hero_wide, macro_texture, ingredients_flatlay, whole_dish) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        recipeId, // Relational mapping to the Spoke
        "recipes/air-fryer-chicken/hero-wide.webp",
        "recipes/air-fryer-chicken/macro-texture.webp",
        "recipes/air-fryer-chicken/ingredients.webp",
        "recipes/air-fryer-chicken/whole-dish.webp",
      ],
    );

    console.log("✅ Images linked successfully.");
    console.log("🎉 Remote seeding complete! Your database is ready.");
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  }
}

// Execute the function
runSeed();
