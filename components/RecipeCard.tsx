"use client";
import { Clock } from "lucide-react";
import Link from "next/link";

interface RecipeCardProps {
  title: string;
  image: string;
  category: string;
  time: string;
  key?: any;
}

export default function RecipeCard({
  title,
  image,
  category,
  time,
}: RecipeCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return (
    <Link href={`/recipe/${slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-stone-900 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-stone-500">
          <div className="flex items-center gap-1.5 text-xs">
            <Clock size={14} />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
