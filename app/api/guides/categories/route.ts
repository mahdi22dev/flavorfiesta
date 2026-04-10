import { NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

export async function GET() {
  try {
    const rows = await queryD1<{ category: string }>(
      "SELECT DISTINCT category FROM pillars WHERE category IS NOT NULL AND category != '' ORDER BY category ASC"
    );

    const categories = rows.map((r) => r.category);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch guide categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
