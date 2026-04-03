import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

// Public CDN base URL — all R2 assets are served from here
const ASSETS_CDN = "https://assets.shortinx.xyz";

function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

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

    // 1. Fetch metadata from D1
    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      cover_image: string;
      category: string;
      servings: number;
      prep_time: string;
      cook_time: string;
      total_time: string;
      s3_key: string;
      old_title: string;
      scraped_url: string;
      transformed_cover_image: string;
    }>("SELECT * FROM recipes WHERE slug = ? LIMIT 1", [slug]);

    if (!rows.length) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = rows[0];

    // 2. Resolve cover image: prefer transformed (CDN), fall back to original scraped URL
    const coverImage =
      cdnUrl(recipe.transformed_cover_image) || recipe.cover_image;

    console.log("coverImage", coverImage);

    // 3. Fetch full recipe content (JSON) from CDN
    try {
      const data = await fetchJsonFromCdn(recipe.s3_key);

      return NextResponse.json({
        ...recipe,
        ...data,
        coverImage,
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        totalTime: recipe.total_time,
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
