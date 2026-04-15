"use server";

import { queryD1 } from "@/db/db";
import { MetadataRoute } from "next";

export async function getDynamicSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const recipes = await queryD1<{ slug: string; createdAt: string }>(
      "SELECT slug, created_at as createdAt FROM recipes",
    );

    const guides = await queryD1<{ slug: string; createdAt: string }>(
      "SELECT slug, created_at as createdAt FROM pillars",
    );

    const recipeEntries = recipes.map((r) => ({
      url: `https://cutandsear.com/recipes/${r.slug}`,
      lastModified: r.createdAt ? new Date(r.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const guideEntries = guides.map((g) => ({
      url: `https://cutandsear.com/guides/${g.slug}`,
      lastModified: g.createdAt ? new Date(g.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...recipeEntries, ...guideEntries];
  } catch (error) {
    console.error("Failed to fetch sitemap data:", error);
    return [];
  }
}
