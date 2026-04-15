"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * queryD1 is a utility to execute SQL queries on Cloudflare D1.
 * It now uses the native D1 binding provided by OpenNext/Cloudflare context.
 */
export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  // getCloudflareContext() handles both local dev (via @opennextjs/cloudflare/dev)
  // and production environments.
  const { env } = await getCloudflareContext();
  const db = env.DB_RECIPES;

  if (!db) {
    // This usually happens if the binding name in wrangler.jsonc doesn't match
    // or if the local development environment is not correctly initialized.
    throw new Error(
      "D1 database binding 'DB_RECIPES' not found. " +
        "If running locally, ensure 'pnpm run dev' is used and wrangler.jsonc is correct.",
    );
  }

  try {
    const result = await db
      .prepare(sql)
      .bind(...params)
      .all();

    // The binding returns result.results as an array of objects
    return (result.results || []) as T[];
  } catch (error) {
    console.error("D1 Query Error:", { sql, params, error });
    throw error;
  }
}
