import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    let query = "SELECT * FROM pillars WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== "Categories") {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY created_at DESC";

    const data = await queryD1(query, params);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Guides API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
