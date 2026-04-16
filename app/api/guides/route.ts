import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const ASSETS_CDN = "https://assets.shortinx.xyz";
    const cdnUrl = (key: string | null | undefined) => {
      if (!key) return null;
      return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
    };

    let query = `
      SELECT p.id, p.title, p.slug, p.description, p.cover_image as cover_image, p.category, 
             p.created_at, ri.hero_wide as hero_wide
      FROM pillars p
      LEFT JOIN recipe_images ri ON p.id = ri.pillar_id AND ri.recipe_id IS NULL
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += " AND (p.title LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== "Categories") {
      query += " AND p.category = ?";
      params.push(category);
    }

    query += " GROUP BY p.id ORDER BY p.created_at DESC";

    const rawData = await queryD1<any>(query, params);

    const data = rawData.map((row) => ({
      ...row,
      coverImage: cdnUrl(row.cover_image || row.hero_wide),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Guides API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
