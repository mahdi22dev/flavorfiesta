import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";
import { cdnUrl, ASSETS_CDN } from "@/lib/constante";

// Public CDN base URL — all R2 assets are served from here

async function fetchJsonFromCdn(key: string): Promise<any> {
  const url = `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
  console.log("[CDN] Fetching:", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CDN fetch error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // 1. Fetch metadata from D1 with join to images
    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      hero_wide: string;
      macro_texture: string;
      ingredients_flatlay: string;
      whole_dish: string;
      category: string;
      servings: number;
      prep_time: string;
      cook_time: string;
      total_time: string;
      s3_key: string;
      quality_score: string;
      tags: string[];
    }>(
      `SELECT 
        r.id, r.title, r.slug, r.description, 
        ri.hero_wide, ri.macro_texture, ri.ingredients_flatlay, ri.whole_dish,
        r.category, r.servings, r.prep_time, r.cook_time, r.total_time, r.s3_key, r.quality_score, r.tags
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       WHERE r.slug = ? LIMIT 1`,
      [slug],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = rows[0];

    // 2. Resolve cover image from CDN
    const coverImage = cdnUrl(recipe.hero_wide);

    console.log("coverImage", coverImage);

    // 3. Fetch full recipe content (JSON) from CDN
    try {
      const data = await fetchJsonFromCdn(recipe.s3_key);
      const legacyImages = data.images || {};
      
      const finalImages = { ...legacyImages };

      const resolvedCover = coverImage || legacyImages.hero_wide || legacyImages["hero-wide"] || null;
      if (resolvedCover) {
         finalImages.hero_wide = resolvedCover;
         finalImages["hero-wide"] = resolvedCover;
         finalImages.heroWide = resolvedCover;
         if (recipe.hero_wide) {
            finalImages[recipe.hero_wide] = resolvedCover;
            finalImages[recipe.hero_wide.replace(/^\/?(recipes\/|pillar\/|guides\/)/, "")] = resolvedCover;
         }
      }

      const macroTextureUrl = cdnUrl(recipe.macro_texture) || legacyImages.macro_texture || legacyImages["macro-texture"] || null;
      if (macroTextureUrl) {
         finalImages.macro_texture = macroTextureUrl;
         finalImages["macro-texture"] = macroTextureUrl;
         finalImages.macroTexture = macroTextureUrl;
         if (recipe.macro_texture) {
            finalImages[recipe.macro_texture] = macroTextureUrl;
            finalImages[recipe.macro_texture.replace(/^\/?(recipes\/|pillar\/|guides\/)/, "")] = macroTextureUrl;
         }
      }

      const ingredientsFlatlayUrl = cdnUrl(recipe.ingredients_flatlay) || legacyImages.ingredients_flatlay || legacyImages["ingredients-flatlay"] || null;
      if (ingredientsFlatlayUrl) {
         finalImages.ingredients_flatlay = ingredientsFlatlayUrl;
         finalImages["ingredients-flatlay"] = ingredientsFlatlayUrl;
         finalImages.ingredientsFlatlay = ingredientsFlatlayUrl;
         if (recipe.ingredients_flatlay) {
            finalImages[recipe.ingredients_flatlay] = ingredientsFlatlayUrl;
            finalImages[recipe.ingredients_flatlay.replace(/^\/?(recipes\/|pillar\/|guides\/)/, "")] = ingredientsFlatlayUrl;
         }
      }

      const wholeDishUrl = cdnUrl(recipe.whole_dish) || legacyImages.whole_dish || legacyImages["whole-dish"] || null;
      if (wholeDishUrl) {
         finalImages.whole_dish = wholeDishUrl;
         finalImages["whole-dish"] = wholeDishUrl;
         finalImages.wholeDish = wholeDishUrl;
         if (recipe.whole_dish) {
            finalImages[recipe.whole_dish] = wholeDishUrl;
            finalImages[recipe.whole_dish.replace(/^\/?(recipes\/|pillar\/|guides\/)/, "")] = wholeDishUrl;
         }
      }

      return NextResponse.json({
        ...recipe,
        ...data,
        coverImage: resolvedCover,
        images: finalImages,
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        totalTime: recipe.total_time,
        tags: recipe.tags || [],
      });
    } catch (cdnErr) {
      console.error("[CDN] Failed to fetch recipe JSON:", cdnErr);
      return NextResponse.json(
        {
          ...recipe,
          coverImage,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          totalTime: recipe.total_time,
          recipe: null,
          content: [],
          error: `CDN fetch failed: ${(cdnErr as Error).message}`,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Single Recipe API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
