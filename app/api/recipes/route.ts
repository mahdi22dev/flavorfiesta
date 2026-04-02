import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/recipes_shema";
import { count, like, or } from "drizzle-orm";

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

    const { env } = getCloudflareContext();

    // Check if DB binding exists
    if (!env || !env.DB_RECIPES) {
      console.error("DB_RECIPES binding is missing in the environment");
      return NextResponse.json(
        { error: "Database binding not found" },
        { status: 500 },
      );
    }

    const db = drizzle(env.DB_RECIPES, { schema });

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(schema.recipes.title, `%${search}%`),
          like(schema.recipes.description, `%${search}%`),
        ),
      );
    }
    if (category) {
      conditions.push(like(schema.recipes.category, `%${category}%`));
    }

    const whereClause =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : conditions.reduce((acc, curr) => (acc as any).and(curr))
        : undefined;

    // Get total count
    const totalCountQuery = db.select({ value: count() }).from(schema.recipes);
    if (whereClause) totalCountQuery.where(whereClause);
    const [{ value: totalCount }] = await totalCountQuery;

    // Get recipes with limited columns for faster listing
    const recipesQuery = db
      .select({
        id: schema.recipes.id,
        title: schema.recipes.title,
        slug: schema.recipes.slug,
        description: schema.recipes.description,
        coverImage: schema.recipes.coverImage,
        category: schema.recipes.category,
        servings: schema.recipes.servings,
        prepTime: schema.recipes.prepTime,
        totalTime: schema.recipes.totalTime,
      })
      .from(schema.recipes);

    if (whereClause) recipesQuery.where(whereClause);

    const recipes = await recipesQuery.limit(limit).offset(offset);

    return NextResponse.json({
      data: recipes,
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
