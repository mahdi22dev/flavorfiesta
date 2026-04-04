"use client";
import { Clock } from "lucide-react";
import Link from "next/link";
import ResponsiveImage from "./ResponsiveImage";

interface RecipeCardProps {
  title: string;
  coverImage: string | null;
  category: string | null;
  totalTime: string | null;
  slug: string;
}

export default function RecipeCard({
  title,
  coverImage,
  category,
  totalTime,
  slug,
}: RecipeCardProps) {
  const displayImage = coverImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800";
  
  return (
    <Link href={`/recipes/${slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300 h-full">
      <div className="relative h-64 overflow-hidden">
        <ResponsiveImage 
          src={displayImage} 
          alt={title} 
          aspectRatio="w-full h-full"
          containerClassName="rounded-none border-none shadow-none"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-stone-900 rounded-full">
            {category || "General"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-stone-500 mt-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <Clock size={14} />
            <span>{totalTime || "20m"}</span>
          </div>
          <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider group-hover:opacity-100 opacity-0 transition-opacity">
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
}
