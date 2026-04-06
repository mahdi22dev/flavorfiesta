import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

const ASSETS_CDN = "https://assets.shortinx.xyz";

function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

async function fetchJsonFromCdn(key: string): Promise<any> {
  const url = `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
  console.log("[CDN] Fetching Guide JSON:", url);

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

    // 1. Fetch metadata from D1 for the pillar/guide
    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      coverImage: string;
      category: string;
      s3_key: string;
    }>(
      `SELECT id, title, slug, description, cover_image as coverImage, category, s3_key
       FROM pillars
       WHERE slug = ? LIMIT 1`,
      [slug],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const guide = rows[0];

    // 2. Resolve cover image from CDN (pillars table uses cover_image directly)
    const coverImageUrl = cdnUrl(guide.coverImage);

    // 3. Fetch full guide content (JSON) from CDN using s3_key
    if (!guide.s3_key) {
        return NextResponse.json({
            ...guide,
            coverImage: coverImageUrl,
            content: [],
            sections: [],
            message: "No detailed content available for this guide yet."
        });
    }

    try {
      const data = await fetchJsonFromCdn(guide.s3_key);

      return NextResponse.json({
        ...guide,
        ...data,
        coverImage: coverImageUrl,
      });
    } catch (cdnErr) {
      console.error("[CDN] Failed to fetch guide JSON:", cdnErr);
      return NextResponse.json(
        {
          ...guide,
          coverImage: coverImageUrl,
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
