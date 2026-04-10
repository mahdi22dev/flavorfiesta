import { Clock } from "lucide-react";
import Link from "next/link";

export async function SuggestedPosts({ suggested }: { suggested: any[] }) {
  return (
    <section className="hidden sm:block max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
          You may also like
        </span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {suggested.map((r) => (
          <Link
            key={r.slug}
            href={`/recipes/${r.slug}`}
            className="group flex gap-4 items-center bg-stone-50 hover:bg-white border border-stone-100 hover:border-stone-200 hover:shadow-md rounded-2xl p-3 transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-100">
              {r.coverImage ? (
                <img
                  src={r.coverImage}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-300 gap-1 px-1 text-center">
                  <Clock size={12} className="opacity-40" />
                  <span className="text-[7px] font-bold uppercase tracking-widest leading-none">
                    Image Coming Soon
                  </span>
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              {r.category && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-1 block">
                  {r.category}
                </span>
              )}
              <p className="font-serif font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors">
                {r.title}
              </p>
              {r.total_time && (
                <span className="text-[10px] text-stone-400 mt-1 block">
                  ⏱ {r.total_time}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
