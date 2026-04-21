"use server";

import { queryD1 } from "@/db/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Comment = {
  id: number;
  recipeSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type SubmitCommentResult =
  | { success: true; comment: Comment }
  | { error: string };

export type GetCommentsResult =
  | { success: true; comments: Comment[] }
  | { error: string };

// ---------------------------------------------------------------------------
// submitComment — called from the client via a <form> action or direct call
// ---------------------------------------------------------------------------

export async function submitComment(
  formData: FormData,
): Promise<SubmitCommentResult> {
  const recipeSlug = formData.get("recipeSlug");
  const authorName = formData.get("authorName");
  const authorEmail = formData.get("authorEmail"); // optional
  const body = formData.get("body");

  // --- Validation ---
  if (!recipeSlug || typeof recipeSlug !== "string" || !recipeSlug.trim()) {
    return { error: "Recipe slug is required." };
  }
  if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
    return { error: "Name is required." };
  }
  if (authorName.trim().length > 80) {
    return { error: "Name must be 80 characters or fewer." };
  }
  if (!body || typeof body !== "string" || !body.trim()) {
    return { error: "Comment body cannot be empty." };
  }
  if (body.trim().length > 2000) {
    return { error: "Comment must be 2 000 characters or fewer." };
  }
  if (authorEmail && typeof authorEmail === "string" && authorEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail.trim())) {
      return { error: "Invalid email address." };
    }
  }

  try {
    // Look up the recipe id from the slug so we can store the FK as well
    const recipeRows = await queryD1<{ id: number }>(
      "SELECT id FROM recipes WHERE slug = ? LIMIT 1",
      [recipeSlug.trim()],
    );

    const recipeId = recipeRows[0]?.id ?? null;

    // Insert — comments start as approved = 0 (pending moderation)
    await queryD1(
      `INSERT INTO comments (recipe_slug, recipe_id, author_name, author_email, body, approved)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        recipeSlug.trim(),
        recipeId,
        authorName.trim(),
        authorEmail && typeof authorEmail === "string"
          ? authorEmail.trim() || null
          : null,
        body.trim(),
      ],
    );

    // Fetch the newly created row to return it
    const newRows = await queryD1<{
      id: number;
      recipe_slug: string;
      author_name: string;
      body: string;
      created_at: string;
    }>(
      `SELECT id, recipe_slug, author_name, body, created_at
       FROM comments
       WHERE recipe_slug = ? AND author_name = ? AND body = ?
       ORDER BY id DESC LIMIT 1`,
      [recipeSlug.trim(), authorName.trim(), body.trim()],
    );

    const row = newRows[0];

    return {
      success: true,
      comment: {
        id: row.id,
        recipeSlug: row.recipe_slug,
        authorName: row.author_name,
        body: row.body,
        createdAt: row.created_at,
      },
    };
  } catch (error) {
    console.error("submitComment error:", error);
    return { error: "Failed to submit comment. Please try again later." };
  }
}

// ---------------------------------------------------------------------------
// getComments — fetch approved comments for a recipe slug
// ---------------------------------------------------------------------------

export async function getComments(
  recipeSlug: string,
): Promise<GetCommentsResult> {
  if (!recipeSlug || !recipeSlug.trim()) {
    return { error: "Recipe slug is required." };
  }

  try {
    const rows = await queryD1<{
      id: number;
      recipe_slug: string;
      author_name: string;
      body: string;
      created_at: string;
    }>(
      `SELECT id, recipe_slug, author_name, body, created_at
       FROM comments
       WHERE recipe_slug = ? AND approved = 1
       ORDER BY created_at DESC`,
      [recipeSlug.trim()],
    );

    return {
      success: true,
      comments: rows.map((r) => ({
        id: r.id,
        recipeSlug: r.recipe_slug,
        authorName: r.author_name,
        body: r.body,
        createdAt: r.created_at,
      })),
    };
  } catch (error) {
    console.error("getComments error:", error);
    return { error: "Failed to load comments." };
  }
}
