import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

const ASSETS_CDN = "https://assets.shortinx.xyz";
function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "12")),
    );
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("category LIKE ?");
      params.push(`%${category}%`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countRows = await queryD1<{ total: number }>(
      `SELECT COUNT(*) as total FROM recipes ${where}`,
      params,
    );
    const totalCount = countRows[0]?.total ?? 0;

    // Get paginated recipes
    const recipes = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      cover_image: string;
      transformed_cover_image: string;
      category: string;
      servings: number;
      prep_time: string;
      total_time: string;
    }>(
      `SELECT id, title, slug, description, cover_image, transformed_cover_image, category, servings, prep_time, total_time
       FROM recipes ${where} LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    // Normalize snake_case to camelCase, prefer CDN image over original
    const normalized = recipes.map((r) => ({
      ...r,
      coverImage: cdnUrl(r.transformed_cover_image) || r.cover_image,
      prepTime: r.prep_time,
      totalTime: r.total_time,
    }));

    return NextResponse.json({
      data: normalized,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
