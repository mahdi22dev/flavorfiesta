"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  recipe: {
    title: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
    category: string | null;
  } | null;
}

export default function Hero({ recipe }: HeroProps) {
  const displayTitle = recipe?.title || "The Art of Gourmet Cooking";
  const displayDesc =
    recipe?.description ||
    "Discover the secrets behind professional culinary techniques and authentic flavors from around the world.";
  const displayImage =
    recipe?.coverImage ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920";
  const displayTag = recipe?.category || "Featured Selection";

  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-stone-900">
      <div className="absolute inset-0 z-0 text-white">
        <img
          src={displayImage}
          alt={displayTitle}
          className="w-full h-full object-cover opacity-60 transition-all"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 rounded-full">
            {displayTag}
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
            {displayTitle.split(" ").map((word, i) =>
              i === 2 ? (
                <span key={i}>
                  <br />
                  <span className="italic text-orange-400">{word} </span>
                </span>
              ) : (
                word + " "
              ),
            )}
          </h2>
          <p className="text-lg text-stone-300 mb-8 max-w-lg line-clamp-3">
            {displayDesc}
          </p>
          <Link
            href={recipe ? `/recipes/${recipe.slug}` : "/recipes"}
            className="group inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105"
          >
            View Recipe
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
