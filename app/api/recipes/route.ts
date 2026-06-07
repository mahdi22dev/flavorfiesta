import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";
import { cdnUrl } from "@/lib/constante";

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
    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      hero_wide: string | null;
      category: string;
      servings: number;
      prepTime: string;
      cookTime: string;
      totalTime: string;
      created_at: string;
    }>(
      `SELECT r.id, r.title, r.slug, r.description, MAX(ri.hero_wide) as hero_wide, r.category, r.servings, r.prep_time as prepTime, r.cook_time as cookTime, r.total_time as totalTime, r.created_at
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       ${where} 
       GROUP BY r.id
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    const normalized = rows.map((r) => ({
      ...r,
      coverImage: cdnUrl(r.hero_wide),
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
