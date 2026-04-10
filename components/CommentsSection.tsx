"use client";
import { useState } from "react";

interface Comment {
  id: number;
  name: string;
  date: string;
  text: string;
}

// Seed with a couple of sample comments so the section never looks empty
const SEED_COMMENTS: Comment[] = [
  { id: 1, name: "Sarah M.", date: "March 2025", text: "Absolutely loved this! Made it last weekend for a dinner party and everyone asked for the recipe. The tips really made the difference." },
  { id: 2, name: "James T.", date: "February 2025", text: "Clear instructions, great results. I added a pinch more seasoning and it was perfect for us." },
];

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        text: text.trim(),
      },
    ]);
    setName("");
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="mt-20 pt-12 border-t border-stone-100">
      {/* Header */}
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-10">
        Comments <span className="text-stone-300 font-light">({comments.length})</span>
      </h2>

      {/* Existing comments */}
      <div className="space-y-6 mb-12">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm uppercase">
              {c.name[0]}
            </div>
            <div className="flex-1 bg-stone-50 rounded-2xl px-5 py-4">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="font-bold text-stone-900 text-sm">{c.name}</span>
                <span className="text-[10px] text-stone-400 font-medium shrink-0">{c.date}</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Submit form */}
      <div className="bg-stone-50 rounded-3xl p-8">
        <h3 className="text-base font-bold text-stone-900 mb-6">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-sm text-stone-800 placeholder:text-stone-300 transition-all"
          />
          <textarea
            placeholder="Share your thoughts or tips…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none text-sm text-stone-800 placeholder:text-stone-300 transition-all resize-none"
          />
          <div className="flex items-center justify-between gap-4">
            {submitted && (
              <p className="text-sm text-orange-600 font-medium">✓ Comment added!</p>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
