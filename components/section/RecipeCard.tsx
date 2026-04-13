import Link from "next/link";

interface RecipeCardProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  category: string;
  date: string;
}

export default function RecipeCard({ title, slug, description, coverImage, category, date }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${slug}`} className="group flex flex-col">
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-stone-200 shadow-sm">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center text-3xl">🍲</div>
        )}
      </div>
      <h4 className="text-lg font-bold text-stone-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
        {title}
      </h4>
      <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">
        {description}
      </p>
      <div className="mt-auto flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-stone-400">
        <span className="text-orange-600 uppercase tracking-[0.2em]">{category}</span>
        <span>{date}</span>
      </div>
    </Link>
  );
}
