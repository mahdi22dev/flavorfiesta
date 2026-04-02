import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/recipes_shema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { env } = getCloudflareContext();

    if (!env || !env.DB_RECIPES) {
      return NextResponse.json({ error: "DB binding missing" }, { status: 500 });
    }

    const db = drizzle(env.DB_RECIPES, { schema });
    
    // 1. Fetch metadata from D1
    const recipe = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.slug, slug))
      .get();

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // 2. Fetch full content from R2
    if (!env.WEB_SCRAPING_BLOG) {
      console.warn("R2 binding missing, returning partial data");
      return NextResponse.json({ ...recipe, recipe: null, content: [] });
    }

    const object = await env.WEB_SCRAPING_BLOG.get(recipe.s3Key);
    
    if (!object) {
      return NextResponse.json({ ...recipe, recipe: null, content: [], error: "R2 object not found" });
    }

    const data = await object.json();

    return NextResponse.json({
      ...recipe,
      ...data, // This should contains content, images, recipe (ingredients/instructions)
    });
  } catch (error) {
    console.error("Single Recipe API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
