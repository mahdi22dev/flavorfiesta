"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";
import { useSearchParams } from "next/navigation";
import { PaginationData, Recipe } from "@/lib/types";
import CategoryDropdown from "./CategoryDropdown";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Categories";
  const initialSearch = searchParams.get("search") || "";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchRecipes = useCallback(
    async (pageValue: number, searchVal: string, catVal: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageValue.toString(),
          limit: "12",
          search: searchVal,
          category: catVal === "Categories" ? "" : catVal,
        });

        const response = await fetch(`/api/recipes?${params.toString()}`);
        const result = await response.json();

        if (result.data) {
          setRecipes(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial fetch and dependency-based fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes(1, searchQuery, category);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, category, fetchRecipes]);

  // Fetch dynamic categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();
        if (result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchRecipes(newPage, searchQuery, category);
    }
  };

  const formatDuration = (d: string) => {
    if (!d || d === "N/A") return "N/A";
    let formatted = d.replace("PT", "").replace("H", " hrs ").replace("M", " mins").trim();
    if (formatted === "0 mins" || formatted === "0 hrs" || !formatted) return "0 mins";
    return formatted;
  };

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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-orange-500 ring-2 ring-orange-500/10 outline-none transition-all text-stone-800 placeholder:text-stone-300 text-sm focus:ring-orange-500/20"
              />
            </div>
          </div>

          <CategoryDropdown
            value={category}
            options={categories}
            placeholder="All Categories"
            onChange={(val) => setCategory(val === "All Categories" ? "Categories" : val)}
          />
        </div>
      </div>

      {/* Status Info */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-stone-500 font-medium">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Searching...
            </span>
          ) : (
            `Showing ${recipes.length} of ${pagination.total} recipes`
          )}
        </p>
      </div>

      {/* Results Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
      >
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.slug}`}
            className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ResponsiveImage
                src={recipe.coverImage || "/placeholder-recipe.jpg"}
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
              <div className="flex flex-col gap-3 pt-6 border-t border-stone-50">
                <div className="flex items-center justify-between text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-300">Prep:</span>
                      <span className="text-stone-600">
                        {recipe.prepTime ? formatDuration(recipe.prepTime) : "15m"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-stone-100 pl-4">
                      <span className="text-stone-300">Cook:</span>
                      <span className="text-stone-600">
                        {recipe.cookTime && formatDuration(recipe.cookTime) !== "0 mins" 
                          ? formatDuration(recipe.cookTime) 
                          : "No-cook"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-stone-900">
                      {recipe.totalTime ? formatDuration(recipe.totalTime) : "35 mins"}
                    </span>
                  </div>
                  <span className="text-orange-600 text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Recipe →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {!loading && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="p-6 bg-stone-50 rounded-full mb-6">
            <SearchIcon size={48} className="text-stone-300" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            No results found
          </h3>
          <p className="text-stone-500">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="p-4 rounded-xl border border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => {
                // Simple pagination logic to show first 3, last 3 and current if many pages
                if (
                  pagination.totalPages > 7 &&
                  p !== 1 &&
                  p !== pagination.totalPages &&
                  Math.abs(p - pagination.page) > 2
                ) {
                  if (p === 2 || p === pagination.totalPages - 1)
                    return (
                      <span key={p} className="px-2 text-stone-400">
                        ...
                      </span>
                    );
                  return null;
                }

                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                      pagination.page === p
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                        : "text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              },
            )}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="p-4 rounded-xl border border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchClient({
  initialRecipes = [],
}: {
  initialRecipes?: any[];
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-orange-600" size={48} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
