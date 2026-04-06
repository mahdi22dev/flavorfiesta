"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  ChevronDown,
  Loader2,
  ArrowRight,
} from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";
import { useSearchParams } from "next/navigation";

interface Guide {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage: string;
}

function GuidesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Categories";
  const initialSearch = searchParams.get("search") || "";

  const [guides, setGuides] = useState<Guide[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchGuides = useCallback(async (searchVal: string, catVal: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchVal,
        category: catVal === "Categories" ? "" : catVal,
      });

      const response = await fetch(`/api/guides?${params.toString()}`);
      const result = await response.json();

      if (result.data) {
        setGuides(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch guides:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGuides(searchQuery, category);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category, fetchGuides]);

  useEffect(() => {
    // Basic categories for guides
    setCategories([
      "Cooking Basics",
      "Ingredient Spotlights",
      "Advanced Techniques",
      "Kitchen Gear",
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mb-12 border-b border-stone-100 pb-12">
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="flex-1 w-full max-w-2xl">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-600 mb-6 px-1">
              Refine Search
            </h2>
            <div className="relative group">
              <SearchIcon
                className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-orange-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search culinary guides..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-stone-50 border-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all text-stone-900"
              />
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none bg-stone-50 border-none rounded-2xl px-6 py-4 pr-12 focus:bg-white focus:ring-4 focus:ring-orange-500/10 text-stone-600 font-medium cursor-pointer shadow-sm transition-all"
            >
              <option>Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-orange-600" size={40} />
        </div>
      ) : guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-stone-100 hover:shadow-2xl hover:shadow-stone-900/5 transition-all duration-500"
            >
              <div className="w-full sm:w-64 aspect-square shrink-0 overflow-hidden bg-stone-100">
                <ResponsiveImage
                  src={guide.coverImage || "/placeholder-guide.jpg"}
                  alt={guide.title}
                  aspectRatio="aspect-auto h-full w-full"
                  containerClassName="rounded-none border-none shadow-none"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-3 block">
                  {guide.category || "Masterclass"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3 leading-tight group-hover:text-orange-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-6">
                  {guide.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 group-hover:gap-4 transition-all">
                  Get Started{" "}
                  <ArrowRight size={14} className="text-orange-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
          <p className="text-stone-400 font-serif italic text-xl">
            No guides found. Try another search.
          </p>
        </div>
      )}
    </div>
  );
}

export default function GuidesList() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-orange-600" size={48} />
        </div>
      }
    >
      <GuidesContent />
    </Suspense>
  );
}
