import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RecipeClientSection from "../../../components/RecipeClientSection";
import { notFound } from "next/navigation";
import { Clock, Users, Timer } from "lucide-react";
import { headers } from "next/headers";
import { queryD1 } from "@/db/db";
import Link from "next/link";
import FloatingJumpButton from "../../../components/FloatingJumpButton";

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
      hero_wide: string;
      category: string;
      total_time: string;
    }>(
      `SELECT r.title, r.slug, r.description, ri.hero_wide, r.category, r.total_time
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       WHERE r.slug != ? ORDER BY RANDOM() LIMIT 3`,
      [slug],
    ).catch(() => []),
  ]);

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();

  // Defensive parsing for JSON strings from D1
  const safeTags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string"
      ? JSON.parse(data.tags)
      : [];

  const post = {
    title: data.title,
    description: data.description,
    cover_image: data.coverImage,
    category: data.category,
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
    table_of_contents: data.table_of_contents || [],
  };

  const suggested = (suggestedRows as any[]).map((r) => ({
    ...r,
    coverImage: cdnUrl(r.hero_wide),
    category: r.category || "General",
  }));

  const parseDuration = (d?: string) => {
    if (!d) return undefined;
    let pt = "PT";
    const hMatch = d.match(/(\d+)\s*(h)/i);
    const mMatch = d.match(/(\d+)\s*(m)/i);
    if (hMatch) pt += hMatch[1] + "H";
    if (mMatch) pt += mMatch[1] + "M";
    return pt === "PT" ? "PT0M" : pt;
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": post.title,
    "image": post.cover_image ? [post.cover_image] : [],
    "author": {
      "@type": "Person",
      "name": "The Savory Bites Culinary Team"
    },
    "datePublished": new Date().toISOString().split('T')[0],
    "description": post.description,
    "prepTime": parseDuration(post.recipe.prep_time),
    "cookTime": parseDuration(post.recipe.cook_time),
    "totalTime": parseDuration(post.recipe.total_time),
    "keywords": Array.isArray(safeTags) ? safeTags.join(", ") : "",
    "recipeYield": post.recipe.servings ? String(post.recipe.servings) : "1 serving",
    "recipeCategory": post.category || "Main Course",
    "recipeIngredient": Array.isArray(post.recipe.ingredients) 
      ? post.recipe.ingredients.map((i: any) => typeof i === "string" ? i : JSON.stringify(i))
      : [],
    "recipeInstructions": Array.isArray(post.recipe.instructions)
      ? post.recipe.instructions.map((step: any) => ({
          "@type": "HowToStep",
          "text": typeof step === "string" ? step : step.text || JSON.stringify(step)
        }))
      : []
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header bgColor="bg-stone-50/90" />
      <main className="grow bg-white">
        {/* Hero Section */}
        <section className="pt-14 pb-8 bg-stone-50 border-b border-stone-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {post.category}
              </span>
              {Array.isArray(safeTags) && safeTags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-6 leading-tight">
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

            {/* Jump to Recipe button (Primary Hero Button) */}
            <a
              id="hero-jump-button"
              href="#recipe-card"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-md shadow-orange-200 transition-all duration-200 hover:scale-105 text-xs uppercase tracking-widest mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Jump to Recipe
            </a>
          </div>
        </section>

        {/* Floating Scroll Triggered Button */}
        <FloatingJumpButton targetId="recipe-card" />

        {/* ── You May Also Like ── */}
        {suggested.length > 0 && (
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
        )}

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-center">
            <div className="rounded-[3rem] overflow-hidden group shadow-sm bg-stone-50 border border-stone-100 relative">
              <img
                src={post.cover_image}
                alt={post.title}
                className="max-h-[85vh] w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
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
          tableOfContents={post.table_of_contents}
        />
      </main>
      <Footer />
    </div>
  );
}
