import Link from "next/link";
import RecipeCard from "./RecipeCard";
import type { ReactNode } from "react";

interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  category: string;
  date: string;
}

interface CategorySectionProps {
  title: string;
  category: string;
  icon: ReactNode;
  recipes: Recipe[];
}

export default function CategorySection({ title, category, icon, recipes }: CategorySectionProps) {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900 leading-tight">{title}</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Category</p>
          </div>
        </div>
        <Link
          href={`/recipes?category=${encodeURIComponent(category)}`}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 group"
        >
          View All
          <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
        </Link>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-stone-100 mb-8" />

      {/* Grid or Empty State */}
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-stone-200 bg-stone-50 text-center">
          <div className="w-12 h-12 rounded-full bg-white border border-stone-100 flex items-center justify-center mb-4 shadow-sm text-orange-300">
            {icon}
          </div>
          <p className="text-sm font-semibold text-stone-400">No recipes here yet</p>
          <p className="text-xs text-stone-300 mt-1">Check back soon — more {title.toLowerCase()} recipes are coming.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
