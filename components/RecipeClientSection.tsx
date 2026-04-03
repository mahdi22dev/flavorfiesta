"use client";

import { useState } from "react";
import {
  Clock,
  Users,
  Timer,
  AlertCircle,
  Lightbulb,
  Info,
  CheckCircle,
} from "lucide-react";
import IngredientChecklist from "./IngredientChecklist";
import PrintButton from "./PrintButton";
import Link from "next/link";

interface Props {
  slug: string;
  recipe: {
    prep_time: string;
    cook_time: string;
    total_time: string;
    servings: number;
    ingredients: string[];
    instructions: string[];
  };
  content: any[];
  callouts: any[];
  images: Record<string, string>;
  suggested?: Array<{
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    category: string;
    total_time: string;
  }>;
}

function renderCallout(block: any, index: string | number) {
  const variant = block.variant || block.variant_type || "tip";

  let bgColor = "bg-orange-50 border-orange-200";
  let titleColor = "text-orange-900";
  let Icon = (
    <Lightbulb className="w-6 h-6 text-orange-600 mr-4 mt-0.5 flex-shrink-0" />
  );
  let defaultTitle = "Tip";

  if (variant === "warning" || variant === "alert") {
    bgColor = "bg-red-50 border-red-200";
    titleColor = "text-red-900";
    Icon = (
      <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-0.5 flex-shrink-0" />
    );
    defaultTitle = "Note";
  } else if (variant === "info") {
    bgColor = "bg-blue-50 border-blue-200";
    titleColor = "text-blue-900";
    Icon = (
      <Info className="w-6 h-6 text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
    );
    defaultTitle = "Info";
  } else if (variant === "success") {
    bgColor = "bg-emerald-50 border-emerald-200";
    titleColor = "text-emerald-900";
    Icon = (
      <CheckCircle className="w-6 h-6 text-emerald-600 mr-4 mt-0.5 flex-shrink-0" />
    );
    defaultTitle = "Success";
  }

  return (
    <div
      key={index}
      className={`not-prose my-10 p-6 md:p-8 rounded-3xl border ${bgColor} flex items-start shadow-sm`}
    >
      {Icon}
      <div>
        <h4
          className={`font-bold uppercase tracking-widest text-sm mb-2 ${titleColor}`}
        >
          {block.title || defaultTitle}
        </h4>
        <p className="text-stone-800 m-0 leading-relaxed text-lg">
          {block.text}
        </p>
      </div>
    </div>
  );
}

export default function RecipeClientSection({
  slug,
  recipe,
  content,
  callouts,
  images,
  suggested = [],
}: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = recipe.ingredients.length;

  return (
    <>
      {/* ── Ingredients card (top) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-white rounded-2xl p-5 md:p-8 border border-stone-100 shadow-md shadow-stone-200/40 relative overflow-hidden ring-1 ring-stone-900/5">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-0" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-100 rounded-full blur-[40px] translate-y-1/4 -translate-x-1/4 -z-0" />

          <div className="lg:col-span-1 space-y-6 relative z-10 border-b lg:border-b-0 lg:border-r border-stone-100 pb-6 lg:pb-0">
            <div>
              <h3 className="text-stone-400 font-bold uppercase tracking-[0.2em] text-[9px] mb-4">
                Recipe Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <Timer size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-0.5">
                      Total Time
                    </p>
                    <p className="font-semibold text-sm text-stone-900">
                      {recipe.total_time || "45 mins"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-0.5">
                      Servings
                    </p>
                    <p className="font-semibold text-sm text-stone-900">
                      {recipe.servings} people
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Ingredients
              </h2>
              <span className="px-3 py-1 bg-stone-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                Ready to roll
              </span>
            </div>
            <IngredientChecklist
              ingredients={recipe.ingredients}
              checked={checked}
              toggle={toggle}
            />
          </div>
        </div>
      </section>

      {/* ── Blog Content ── */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 prose prose-stone prose-img:rounded-2xl prose-img:shadow-lg prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900 text-stone-700">
        {content.map((block: any, index: number) => {
          if (block.type === "paragraph") {
            return (
              <p
                key={index}
                className="leading-relaxed mb-4 text-base"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }
          if (block.type === "heading") {
            return (
              <h2
                key={index}
                className="text-2xl font-serif font-bold text-stone-900 mt-10 mb-5"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "image") {
            const blockId = (block as any).id;
            const src = blockId
              ? images[blockId as keyof typeof images]
              : (block as any).src;

            if (src) {
              return (
                <div key={index} className="my-12">
                  <img
                    src={src}
                    alt="Recipe Image"
                    className="w-full h-auto rounded-3xl shadow-xl object-cover border border-stone-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
              );
            }
          }
          if (block.type === "callout") {
            return renderCallout(block, index);
          }
          return null;
        })}

        {callouts && callouts.length > 0 && (
          <div className="mt-12 space-y-4">
            {callouts.map((callout: any, index: number) =>
              renderCallout(callout, `extra-${index}`),
            )}
          </div>
        )}
      </article>

      {/* ── Instructions + compact ingredients sidebar ── */}
      <section id="recipe-card" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-4">
        <div className="bg-stone-50 rounded-2xl p-6 md:p-10 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-10">
            {/* Instructions (left / main) */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-stone-200 pb-5">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Instructions
                </h2>
                <PrintButton slug={slug} />
              </div>

              <ol className="space-y-7">
                {recipe.instructions.map((instruction: string, i: number) => (
                  <li key={i} className="flex group">
                    <div className="flex-shrink-0 mr-5">
                      <div className="relative">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300 font-bold text-sm shadow-sm">
                          {i + 1}
                        </span>
                        <div className="absolute top-1/2 left-full w-3 h-px bg-stone-200 ml-2" />
                      </div>
                    </div>
                    <span className="text-stone-700 leading-relaxed pt-1 text-sm">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Compact ingredients sidebar (right) */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="sticky top-20 bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-serif font-bold text-stone-900">
                    Ingredients
                  </h3>
                  {/* Progress indicator */}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {checkedCount}/{total}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-stone-100 rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{
                      width: total > 0 ? `${(checkedCount / total) * 100}%` : "0%",
                    }}
                  />
                </div>

                <IngredientChecklist
                  ingredients={recipe.ingredients}
                  checked={checked}
                  toggle={toggle}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── You May Also Like (bottom, large) ── */}
      {suggested.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-stone-100" />
            <h2 className="text-lg font-serif font-bold text-stone-900 whitespace-nowrap">
              You May Also Like
            </h2>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {suggested.map((r) => (
              <Link
                key={r.slug}
                href={`/recipes/${r.slug}`}
                className="group flex flex-col bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                  {r.coverImage ? (
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="p-4 flex flex-col flex-1">
                  {r.category && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-orange-500 mb-1">
                      {r.category}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-stone-900 text-base leading-snug mb-2 group-hover:text-orange-700 transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 flex-1">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    {r.total_time && (
                      <span className="text-[10px] text-stone-400 font-medium">⏱ {r.total_time}</span>
                    )}
                    <span className="text-[10px] font-bold text-orange-600 group-hover:underline ml-auto">
                      View Recipe →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
