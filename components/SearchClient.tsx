"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, ChevronDown, Clock } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

export default function SearchClient({ initialRecipes }: { initialRecipes: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Categories");

  const filteredRecipes = initialRecipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "Categories" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(initialRecipes.map((r) => r.category || "General")));

  const formatDuration = (d: string) => d?.replace("PT", "").replace("M", " mins").replace("H", " hours ") || "N/A";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Heading */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative inline-block px-8 py-4">
          <div className="absolute inset-0 bg-stone-100/60 -z-10 rounded-lg"></div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
            Explore Our Recipes<br />
            <span className="font-sans font-normal text-stone-700">created by our </span>
            <span className="italic font-serif font-light text-orange-600">maestro</span>
          </h1>
        </div>
      </div>

      {/* Search Controls */}
      <div className="max-w-3xl mx-auto mb-20 space-y-6">
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors" size={22} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-16 pr-8 py-5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 shadow-sm text-xl transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-stone-200 rounded-2xl px-6 py-4.5 pr-12 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-stone-600 font-medium cursor-pointer shadow-sm">
              <option>Popular</option>
              <option>Newest</option>
              <option>Top Rated</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={20} />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-2xl px-6 py-4.5 pr-12 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-stone-600 font-medium cursor-pointer shadow-sm hover:border-stone-300 transition-colors"
            >
              <option>Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.slug}
            href={`/recipe/${recipe.slug}`}
            className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ResponsiveImage
                src={recipe.image}
                alt={recipe.title}
                aspectRatio="aspect-auto h-full w-full"
                containerClassName="rounded-none border-none shadow-none"
              >
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/95 backdrop-blur-md text-stone-900 rounded-full shadow-lg">
                    {recipe.category || "General"}
                  </span>
                </div>
              </ResponsiveImage>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                {recipe.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-6 flex-grow">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-stone-50 text-stone-400 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <span>{recipe.recipe?.prep_time || "15 mins"}</span>
                </div>
                <span className="text-orange-600 group-hover:translate-x-1 transition-transform">
                  View Recipe →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="p-6 bg-stone-50 rounded-full mb-6">
            <SearchIcon size={48} className="text-stone-300" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No results found</h3>
          <p className="text-stone-500">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
}
