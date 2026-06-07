import { NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

export async function GET() {
  const pillars = await queryD1("SELECT id, slug FROM pillars LIMIT 10");
  const recipes = await queryD1("SELECT id, slug FROM recipes LIMIT 10");
  const images = await queryD1("SELECT * FROM recipe_images LIMIT 10");
  return NextResponse.json({ pillars, recipes, images });
}
