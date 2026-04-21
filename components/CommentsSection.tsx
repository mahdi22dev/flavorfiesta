"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

interface Props {
  slug: string;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function CommentsSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  // ── Fetch approved comments on mount ──────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}&limit=50`)
      .then((r) => r.json())
      .then((json) => {
        setComments(json.data ?? []);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeSlug: slug,
          authorName: name.trim(),
          body: text.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setName("");
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-20 pt-12 border-t border-stone-100">
      {/* Header */}
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-10">
        Comments{" "}
        {!loading && (
          <span className="text-stone-300 font-light">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      <div className="space-y-6 mb-12">
        {loading ? (
          // Skeleton placeholders
          [1, 2].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="shrink-0 w-10 h-10 rounded-full bg-stone-100" />
              <div className="flex-1 bg-stone-50 rounded-2xl px-5 py-4 space-y-2">
                <div className="h-3 w-24 bg-stone-200 rounded" />
                <div className="h-3 w-full bg-stone-100 rounded" />
                <div className="h-3 w-3/4 bg-stone-100 rounded" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-stone-400 italic">
            No comments yet — be the first to share your thoughts!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm uppercase">
                {c.authorName[0]}
              </div>
              <div className="flex-1 bg-stone-50 rounded-2xl px-5 py-4">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="font-bold text-stone-900 text-sm">
                    {c.authorName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium shrink-0">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit form */}
      <div className="bg-stone-50 rounded-3xl p-8">
        <h3 className="text-base font-bold text-stone-900 mb-6">
          Leave a Comment
        </h3>

        {submitted ? (
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
            <span className="text-orange-500 text-lg leading-none mt-0.5">✓</span>
            <div>
              <p className="text-sm font-bold text-orange-800">
                Thanks for your comment!
              </p>
              <p className="text-xs text-orange-600 mt-0.5">
                It's pending approval and will appear here once reviewed.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-sm text-stone-800 placeholder:text-stone-300 transition-all"
            />
            <textarea
              placeholder="Share your thoughts or tips…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-sm text-stone-800 placeholder:text-stone-300 transition-all resize-none"
            />

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-stone-900 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {submitting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
