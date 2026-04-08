import { queryD1 } from "../db/db";
import * as dotenv from "dotenv";
dotenv.config();

async function run() {
  const pillars = await queryD1("SELECT id, slug, cover_image FROM pillars");
  console.log("PILLARS:", pillars);

  const images = await queryD1("SELECT * FROM recipe_images");
  console.log("RECIPE IMAGES:", images);
}

run().catch(console.error);
