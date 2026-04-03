import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client pointing at Cloudflare R2
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Disable checksum feature — R2 doesn't support x-amz-checksum-mode
  requestChecksumCalculation: "WHEN_REQUIRED" as const,
  responseChecksumValidation: "WHEN_REQUIRED" as const,
});

/**
 * Generates a pre-signed URL (auth in query params, not headers)
 * then uses plain fetch — avoids AWS SDK header signing issues with R2.
 */
async function fetchFromR2(key: string): Promise<any> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  // Sign a temporary URL (valid for 60s) — put credentials in query params, not headers
  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
  console.log("[R2] Pre-signed URL generated for key:", key);

  const res = await fetch(signedUrl);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 fetch error ${res.status}: ${text}`);
  }

  const text = await res.text();
  return JSON.parse(text);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // 1. Fetch metadata from D1 via REST API
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

    // 2. Fetch full content from R2 via pre-signed URL
    try {
      const data = await fetchFromR2(recipe.s3_key);

      return NextResponse.json({
        ...recipe,
        // Normalize snake_case fields to camelCase for the UI
        coverImage: recipe.cover_image,
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        totalTime: recipe.total_time,
        ...data, // contains content, images, recipe (ingredients/instructions)
      });
    } catch (r2Err) {
      console.error("[R2] Failed:", r2Err);
      return NextResponse.json(
        {
          ...recipe,
          coverImage: recipe.cover_image,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          totalTime: recipe.total_time,
          recipe: null,
          content: [],
          error: `R2 fetch failed: ${(r2Err as Error).message}`,
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
