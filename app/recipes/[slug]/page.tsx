import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RecipeClientSection from "../../../components/RecipeClientSection";
import { notFound } from "next/navigation";
import { Clock, Users, Timer } from "lucide-react";
import { headers } from "next/headers";
import { queryD1 } from "@/db/db";
import Link from "next/link";

const ASSETS_CDN = "https://assets.shortinx.xyz";
function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

export default async function RecipePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get host for absolute URL requirement in Server Components fetch
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const [response, suggestedRows] = await Promise.all([
    fetch(`${protocol}://${host}/api/recipes/${slug}`, { cache: "no-store" }),
    // 3 random recipes, excluding the current one
    queryD1<{
      title: string;
      slug: string;
      description: string;
      cover_image: string;
      transformed_cover_image: string;
      category: string;
      total_time: string;
    }>(
      `SELECT title, slug, description, cover_image, transformed_cover_image, category, total_time
       FROM recipes WHERE slug != ? ORDER BY RANDOM() LIMIT 3`,
      [slug],
    ).catch(() => []),
  ]);

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();

  const post = {
    title: data.title,
    description: data.description,
    cover_image: data.coverImage,
    recipe: {
      prep_time: data.recipe?.prep_time || data.prepTime,
      cook_time: data.recipe?.cook_time || data.cookTime,
      total_time: data.recipe?.total_time || data.totalTime,
      servings: data.recipe?.servings || data.servings,
      ingredients: data.recipe?.ingredients || [],
      instructions: data.recipe?.instructions || [],
    },
    content: data.content || [],
    callouts: data.callouts || [],
    images: data.images || {},
  };

  const suggested = (suggestedRows as any[]).map((r) => ({
    ...r,
    coverImage: cdnUrl(r.transformed_cover_image) || r.cover_image,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header bgColor="bg-stone-50/90" />
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="pt-14 pb-8 bg-stone-50 border-b border-stone-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-base text-stone-500 max-w-xl mx-auto mb-6 leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-stone-600 mb-6">
              <div className="flex flex-col items-center">
                <Timer className="text-orange-600 mb-1" size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                  Prep Time
                </span>
                <span className="text-sm font-medium text-stone-900">
                  {post.recipe.prep_time}
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 hidden md:block" />
              <div className="flex flex-col items-center">
                <Clock className="text-orange-600 mb-1" size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                  Cook Time
                </span>
                <span className="text-sm font-medium text-stone-900">
                  {post.recipe.cook_time}
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 hidden md:block" />
              <div className="flex flex-col items-center">
                <Users className="text-orange-600 mb-1" size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                  Servings
                </span>
                <span className="text-sm font-medium text-stone-900">
                  {post.recipe.servings} servings
                </span>
              </div>
            </div>

            {/* Jump to Recipe button */}
            <a
              href="#recipe-card"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-md shadow-orange-200 transition-all duration-200 hover:scale-105 text-xs uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Jump to Recipe
            </a>
          </div>
        </section>

        {/* ── You May Also Like ── */}
        {suggested.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-stone-200">
                    {r.coverImage ? (
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl">
                        🍽️
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
        )}

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-100 aspect-[16/9] relative group">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}

        {/* Interactive client section */}
        <RecipeClientSection
          slug={slug}
          recipe={post.recipe}
          content={post.content}
          callouts={post.callouts}
          images={post.images}
          suggested={suggested}
        />
      </main>
      <Footer />
    </div>
  );
}
