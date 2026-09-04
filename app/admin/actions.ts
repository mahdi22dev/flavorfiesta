"use server";

import { queryD1 } from "@/db/db";
import { cdnUrl } from "@/lib/constante";

export interface AdminRecipe {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  coverImage: string | null;
  quality_score: string | null;
  have_content: boolean | null;
  prep_time: string | null;
  cook_time: string | null;
  servings: number | null;
  created_at: string | null;
}

const PAGE_SIZE = 6;

export async function getRecipes(page = 1) {
  try {
    const current = Math.max(1, page);
    const offset = (current - 1) * PAGE_SIZE;

    const countRows = await queryD1<{ total: number }>(
      "SELECT COUNT(*) as total FROM recipes",
    );
    const total = countRows[0]?.total ?? 0;

    const rows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string | null;
      category: string | null;
      hero_wide: string | null;
      quality_score: string | null;
      have_content: boolean | null;
      prep_time: string | null;
      cook_time: string | null;
      servings: number | null;
      created_at: string | null;
    }>(
      `SELECT r.id, r.title, r.slug, r.description, r.category,
              MAX(ri.hero_wide) as hero_wide, r.quality_score, r.have_content,
              r.prep_time, r.cook_time, r.servings, r.created_at
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       GROUP BY r.id
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [PAGE_SIZE, offset],
    );

    const data = rows.map((r) => ({
      ...r,
      coverImage: cdnUrl(r.hero_wide),
    }));

    return {
      data,
      total,
      page: current,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: PAGE_SIZE,
      totalPages: 1,
      error: "Failed to load recipes. Is the database connected?",
    };
  }
}

export interface AdminStats {
  totalRecipes: number;
  ready: number;
  drafts: number;
  categories: number;
}

export async function getAdminStats() {
  try {
    const [totalRows, readyRows, draftRows, categoryRows] = await Promise.all([
      queryD1<{ total: number }>("SELECT COUNT(*) as total FROM recipes"),
      queryD1<{ total: number }>(
        "SELECT COUNT(*) as total FROM recipes WHERE have_content = 1",
      ),
      queryD1<{ total: number }>(
        "SELECT COUNT(*) as total FROM recipes WHERE have_content = 0",
      ),
      queryD1<{ total: number }>(
        "SELECT COUNT(DISTINCT category) as total FROM recipes",
      ),
    ]);

    return {
      data: {
        totalRecipes: totalRows[0]?.total ?? 0,
        ready: readyRows[0]?.total ?? 0,
        drafts: draftRows[0]?.total ?? 0,
        categories: categoryRows[0]?.total ?? 0,
      } satisfies AdminStats,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return {
      data: { totalRecipes: 0, ready: 0, drafts: 0, categories: 0 },
      error: "Failed to load stats. Is the database connected?",
    };
  }
}
