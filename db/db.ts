/**
 * Query the Cloudflare D1 REST API directly.
 * Works in both local `next dev` and in production Cloudflare Workers.
 */
export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (!accountId || !databaseId || !token) {
    throw new Error("Missing Cloudflare D1 environment variables");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      // Don't cache DB queries
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 REST API error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    result: { results: T[]; success: boolean }[];
    success: boolean;
  };

  if (!json.success) {
    throw new Error("D1 REST API returned success: false");
  }

  return json.result?.[0]?.results ?? [];
}
