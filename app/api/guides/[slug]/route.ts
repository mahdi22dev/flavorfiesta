import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

const ASSETS_CDN = "https://assets.shortinx.xyz";

function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

async function fetchJsonFromCdn(slug: string): Promise<any> {
  // Strip any existing prefixes (like recipes/ or pillar/) from the slug before building the CDN path
  const baseSlug = slug.replace(/^(recipes\/|pillar\/)/, "").replace(/^\//, "");
  const fileName = baseSlug.endsWith(".json") ? baseSlug : `${baseSlug}.json`;
  const url = `${ASSETS_CDN}/pillar/${fileName}`;
  console.log("[CDN] Fetching Guide JSON (Slug-based):", url);

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
    console.log(slug);

    const baseSlug = slug
      .replace(/^(recipes\/|pillar\/|guides\/)/, "")
      .replace(/^\//, "");

    // 1. Fetch metadata from D1 for the pillar/guide
    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      coverImage: string;
      category: string;
      s3_key: string;
      tags: string[];
      heroWide: string | null;
      createdAt: string | null;
    }>(
      `SELECT p.id, p.title, p.slug, p.description, p.cover_image as coverImage, p.category, p.s3_key, p.tags,
              ri.hero_wide as heroWide, p.created_at as createdAt
       FROM pillars p
       LEFT JOIN recipe_images ri ON p.id = ri.pillar_id AND ri.recipe_id IS NULL
       WHERE p.slug = ? OR p.slug = ? LIMIT 1`,
      [slug, baseSlug],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const guide = rows[0];

    // 2. Resolve cover image from CDN (priority: recipe_images.hero_wide > pillars.cover_image)
    const coverImageUrl = cdnUrl(guide.heroWide || guide.coverImage);

    // 3. Fetch all associated recipes and their hero images to populate guide.images
    const recipesRows = await queryD1<{
      slug: string;
      heroWide: string | null;
    }>(
      `SELECT r.slug, ri.hero_wide as heroWide
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       WHERE r.pillar_id = ? OR r.pillar_slug = ?`,
      [guide.id, baseSlug],
    );

    const recipeImagesMap = recipesRows.reduce(
      (acc, row) => {
        if (row.heroWide) {
          acc[row.slug] = cdnUrl(row.heroWide);
        }
        return acc;
      },
      {} as Record<string, string | null>,
    );

    // 4. Fetch full guide content (JSON) from CDN using slug
    try {
      const data = await fetchJsonFromCdn(slug);

      // Merge metadata, CDN content, and resolved images
      return NextResponse.json({
        ...guide,
        ...data,
        coverImage: coverImageUrl,
        images: {
          ...(data.images || {}),
          ...recipeImagesMap,
          hero_wide: coverImageUrl,
        },
      });
    } catch (cdnErr) {
      console.error("[CDN] Failed to fetch guide JSON:", cdnErr);
      return NextResponse.json(
        {
          ...guide,
          coverImage: coverImageUrl,
          images: {
            ...recipeImagesMap,
            hero_wide: coverImageUrl,
          },
          content: [],
          sections: [],
          error: `Content fetch failed: ${(cdnErr as Error).message}`,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Single Guide API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
