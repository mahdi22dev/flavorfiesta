"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, ChevronDown, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SearchClient({ initialRecipes = [] }: { initialRecipes?: any[] }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Categories");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchRecipes = useCallback(async (pageValue: number, searchVal: string, catVal: string) => {
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
  }, []);

  // Initial fetch and dependency-based fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes(1, searchQuery, category);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, category, fetchRecipes]);

  // Fetch categories (could be a separate API but we'll infer from results or have a static list)
  useEffect(() => {
    // In a real app, this would be a separate API call like /api/categories
    // For now, we use a sensible default or fetch all once
    setCategories(["Breakfast", "Lunch", "Dinner", "Dessert", "Vegetarian", "Healthy"]);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchRecipes(newPage, searchQuery, category);
    }
  };

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

      {/* Status Info */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-stone-500 font-medium">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Searching...</span>
          ) : (
            `Showing ${recipes.length} of ${pagination.total} recipes`
          )}
        </p>
      </div>

      {/* Results Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
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
              <div className="flex items-center justify-between pt-6 border-t border-stone-50 text-stone-400 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <span>{recipe.prepTime || "15 mins"}</span>
                </div>
                <span className="text-orange-600 group-hover:translate-x-1 transition-transform">
                  View Recipe →
                </span>
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
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No results found</h3>
          <p className="text-stone-500">Try adjusting your search or category filters.</p>
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
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
              // Simple pagination logic to show first 3, last 3 and current if many pages
              if (
                pagination.totalPages > 7 &&
                p !== 1 &&
                p !== pagination.totalPages &&
                Math.abs(p - pagination.page) > 2
              ) {
                if (p === 2 || p === pagination.totalPages - 1) return <span key={p} className="px-2 text-stone-400">...</span>;
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
            })}
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
