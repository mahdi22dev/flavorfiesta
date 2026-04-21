import { NextRequest, NextResponse } from "next/server";
import { queryD1 } from "@/db/db";

// ---------------------------------------------------------------------------
// GET /api/comments?slug=<recipe-slug>[&page=1&limit=20]
// Returns approved comments for a recipe, newest first, with pagination.
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  if (!slug) {
    return NextResponse.json(
      { error: "Query parameter 'slug' is required." },
      { status: 400 },
    );
  }

  try {
    const countRows = await queryD1<{ total: number }>(
      "SELECT COUNT(*) as total FROM comments WHERE recipe_slug = ? AND approved = 1",
      [slug],
    );
    const total = countRows[0]?.total ?? 0;

    const rows = await queryD1<{
      id: number;
      author_name: string;
      body: string;
      created_at: string;
    }>(
      `SELECT id, author_name, body, created_at
       FROM comments
       WHERE recipe_slug = ? AND approved = 1
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [slug, limit, offset],
    );

    const comments = rows.map((r) => ({
      id: r.id,
      authorName: r.author_name,
      body: r.body,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[comments GET] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/comments
// Body (JSON): { recipeSlug, authorName, authorEmail?, body }
// Creates a new comment (pending approval).
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  let payload: {
    recipeSlug?: string;
    authorName?: string;
    authorEmail?: string;
    body?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { recipeSlug, authorName, authorEmail, body } = payload;

  // --- Validation ---
  if (!recipeSlug?.trim()) {
    return NextResponse.json(
      { error: "recipeSlug is required." },
      { status: 400 },
    );
  }
  if (!authorName?.trim()) {
    return NextResponse.json(
      { error: "authorName is required." },
      { status: 400 },
    );
  }
  if (authorName.trim().length > 80) {
    return NextResponse.json(
      { error: "authorName must be 80 characters or fewer." },
      { status: 400 },
    );
  }
  if (!body?.trim()) {
    return NextResponse.json(
      { error: "Comment body cannot be empty." },
      { status: 400 },
    );
  }
  if (body.trim().length > 2000) {
    return NextResponse.json(
      { error: "Comment must be 2 000 characters or fewer." },
      { status: 400 },
    );
  }
  if (authorEmail?.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail.trim())) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }
  }

  try {
    // Resolve recipe id from slug
    const recipeRows = await queryD1<{ id: number }>(
      "SELECT id FROM recipes WHERE slug = ? LIMIT 1",
      [recipeSlug.trim()],
    );

    if (!recipeRows.length) {
      return NextResponse.json(
        { error: "Recipe not found." },
        { status: 404 },
      );
    }

    const recipeId = recipeRows[0].id;

    await queryD1(
      `INSERT INTO comments (recipe_slug, recipe_id, author_name, author_email, body, approved)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        recipeSlug.trim(),
        recipeId,
        authorName.trim(),
        authorEmail?.trim() || null,
        body.trim(),
      ],
    );

    // Return the newly inserted row
    const newRows = await queryD1<{
      id: number;
      author_name: string;
      body: string;
      created_at: string;
    }>(
      `SELECT id, author_name, body, created_at
       FROM comments
       WHERE recipe_slug = ? AND author_name = ? AND body = ?
       ORDER BY id DESC LIMIT 1`,
      [recipeSlug.trim(), authorName.trim(), body.trim()],
    );

    const created = newRows[0];

    return NextResponse.json(
      {
        message: "Comment submitted and pending approval.",
        comment: {
          id: created.id,
          recipeSlug: recipeSlug.trim(),
          authorName: created.author_name,
          body: created.body,
          createdAt: created.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[comments POST] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/comments?id=<comment-id>
// Hard-deletes a comment by id (admin use — add auth middleware in production).
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Query parameter 'id' must be a valid number." },
      { status: 400 },
    );
  }

  try {
    const existing = await queryD1<{ id: number }>(
      "SELECT id FROM comments WHERE id = ? LIMIT 1",
      [Number(id)],
    );

    if (!existing.length) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 },
      );
    }

    await queryD1("DELETE FROM comments WHERE id = ?", [Number(id)]);

    return NextResponse.json({ message: "Comment deleted." });
  } catch (error) {
    console.error("[comments DELETE] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
