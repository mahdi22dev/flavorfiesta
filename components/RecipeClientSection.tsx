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
  tableOfContents?: string[];
}

// Helper to turn slugs into readable titles
function formatSectionTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ImagePlaceholder({
  alt,
  className = "",
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full aspect-video rounded-4xl bg-stone-50 border border-dashed border-stone-200 flex flex-col items-center justify-center gap-4 text-stone-300 p-8 ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center">
        <Clock size={32} className="opacity-20" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1">
          Coming Soon
        </p>
        <p className="text-[10px] font-medium opacity-60 max-w-[200px] leading-relaxed">
          The visual for "{alt}" is currently in our culinary studio.
        </p>
      </div>
    </div>
  );
}

function renderCallout(block: any, index: string | number) {
  const variant = block.variant || block.variant_type || "tip";

  let bgColor = "bg-orange-50 border-orange-200";
  let titleColor = "text-orange-900";
  let Icon = (
    <Lightbulb className="w-6 h-6 text-orange-600 mr-4 mt-0.5 shrink-0" />
  );
  let defaultTitle = "Tip";

  if (variant === "warning" || variant === "alert") {
    bgColor = "bg-red-50 border-red-200";
    titleColor = "text-red-900";
    Icon = (
      <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-0.5 shrink-0" />
    );
    defaultTitle = "Note";
  } else if (variant === "info") {
    bgColor = "bg-blue-50 border-blue-200";
    titleColor = "text-blue-900";
    Icon = <Info className="w-6 h-6 text-blue-600 mr-4 mt-0.5 shrink-0" />;
    defaultTitle = "Info";
  } else if (variant === "success") {
    bgColor = "bg-emerald-50 border-emerald-200";
    titleColor = "text-emerald-900";
    Icon = (
      <CheckCircle className="w-6 h-6 text-emerald-600 mr-4 mt-0.5 shrink-0" />
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
  tableOfContents = [],
}: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = recipe.ingredients.length;

  return (
    <>
      {/* ── Main Layout: Sidebar + Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 py-10">
        {/* Left Sidebar: TOC + Stats */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-8">
            {/* Recipe Stats Sidebar (Compact) */}
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-6 font-sans">
                Quick Stats
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Timer size={18} className="text-orange-600" />
                  <span className="text-sm font-bold text-stone-900">
                    {recipe.total_time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-orange-600" />
                  <span className="text-sm font-bold text-stone-900">
                    {recipe.servings} Servings
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[9px] font-bold uppercase tracking-widest">
                    {recipe.ingredients.length} Ingredients
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents (Editorial style) */}
            {tableOfContents && tableOfContents.length > 0 && (
              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-6">
                  In This Article
                </h3>
                <nav>
                  <ul className="space-y-4">
                    {tableOfContents.map((slug, i) => (
                      <li key={i}>
                        <a
                          href={`#${slug}`}
                          className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors block leading-tight"
                        >
                          {formatSectionTitle(slug)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Newsletter Promo */}
            <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-lg font-serif font-bold mb-3">
                Join the Club
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed mb-6">
                Weekly gourmet techniques delivered to your inbox.
              </p>
              <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-lg shadow-orange-950/20">
                Subscribe
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content: Blog Content + Recipe Card */}
        <div className="flex-1 min-w-0">
          {/* ── Ingredients Top Card ── */}
          <section className="mb-12">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden ring-1 ring-stone-900/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-3">
                    Ingredients
                  </h2>
                  <span className="px-3 py-1 bg-stone-900 text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em]">
                    {total} Total
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
          <article className="prose prose-stone lg:prose-lg max-w-none prose-img:rounded-3xl prose-img:shadow-2xl prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900 text-stone-700 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
            {content.map((block: any, index: number) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={index}
                    className="leading-relaxed mb-8 text-lg font-medium text-stone-600"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                );
              }
              if (block.type === "heading") {
                const sectionId = tableOfContents.indexOf(block.text);
                const finalId =
                  block.anchor ||
                  (sectionId !== -1
                    ? tableOfContents[sectionId]
                    : `section-${index}`);

                return (
                  <h2
                    key={index}
                    id={finalId}
                    className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-16 mb-8 scroll-mt-28 leading-tight"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "image") {
                // Support both direct ID/src and reference-based images from storyboard
                const blockId = block.id || block.reference;
                const src = blockId ? images[blockId] : block.src;

                if (src) {
                  return (
                    <div key={index} className="my-16 relative group">
                      <img
                        src={src}
                        alt={block.alt || "Recipe Illustration"}
                        className="w-full h-auto rounded-[3rem] shadow-2xl border border-stone-100 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {block.caption && (
                        <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          {block.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                // If no image, show placeholder
                return (
                  <div key={index} className="my-16">
                    <ImagePlaceholder
                      alt={block.alt || block.reference || "Illustration"}
                    />
                    {block.caption && (
                      <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {block.caption}
                      </p>
                    )}
                  </div>
                );
              }
              if (block.type === "callout") {
                return renderCallout(block, index);
              }
              if (block.type === "list") {
                const ListTag = block.style === "ordered" ? "ol" : "ul";
                return (
                  <ListTag
                    key={index}
                    className={`my-10 space-y-4 ${block.style === "ordered" ? "list-decimal pl-8" : "list-disc pl-8"} text-stone-600 font-medium`}
                  >
                    {block.items.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="pl-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ListTag>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="my-16 border-l-4 border-orange-500 pl-10 py-4 italic font-serif text-3xl text-stone-500 leading-relaxed bg-stone-50/50 rounded-r-3xl"
                  >
                    "{block.text}"
                    {block.author && (
                      <footer className="mt-6 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-stone-400 not-italic">
                        — {block.author}
                      </footer>
                    )}
                  </blockquote>
                );
              }
              if (block.type === "divider") {
                return (
                  <div
                    key={index}
                    className="my-20 flex items-center justify-center gap-6"
                  >
                    <div className="h-px w-16 bg-stone-200" />
                    <div className="w-2 h-2 rounded-full bg-orange-200 shadow-inner" />
                    <div className="h-px w-16 bg-stone-200" />
                  </div>
                );
              }
              return null;
            })}

            {callouts && callouts.length > 0 && (
              <div className="mt-20 space-y-6">
                {callouts.map((callout: any, index: number) =>
                  renderCallout(callout, `extra-${index}`),
                )}
              </div>
            )}
          </article>

          {/* ── Recipe Card: Instructions + Sidebar ── */}
          <section id="recipe-card" className="pb-16 mt-24">
            <div className="bg-stone-50 rounded-[3rem] p-8 md:p-14 border border-stone-200 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3" />

              <div className="relative z-10 flex flex-col xl:flex-row gap-16">
                {/* Instructions (left / main) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-12 border-b border-stone-200 pb-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-900">
                      Method
                    </h2>
                    <PrintButton slug={slug} />
                  </div>

                  <ol className="space-y-10">
                    {recipe.instructions.map(
                      (instruction: string, i: number) => (
                        <li key={i} className="flex group">
                          <div className="shrink-0 mr-8">
                            <div className="relative">
                              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-stone-200 text-stone-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-500 font-bold text-base shadow-sm ring-4 ring-transparent group-hover:ring-orange-100">
                                {i + 1}
                              </span>
                            </div>
                          </div>
                          <span className="text-stone-600 leading-relaxed pt-1 text-lg font-medium">
                            {instruction}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>

                {/* Compact ingredients sidebar (right) */}
                <div className="xl:w-64 shrink-0">
                  <div className="sticky top-28 bg-white rounded-3xl border border-stone-100 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900">
                        Checklist
                      </h3>
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                        {checkedCount}/{total}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-stone-100 rounded-full mb-8 overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width:
                            total > 0
                              ? `${(checkedCount / total) * 100}%`
                              : "0%",
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
        </div>
      </div>

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
                <div className="aspect-4/3 overflow-hidden bg-stone-100">
                  {r.coverImage ? (
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-orange-100 to-amber-200 flex items-center justify-center text-4xl">
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
                      <span className="text-[10px] text-stone-400 font-medium">
                        ⏱ {r.total_time}
                      </span>
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
