import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RecipeClientSection from "../../../components/RecipeClientSection";
import { notFound } from "next/navigation";
import { Clock, Users, Timer } from "lucide-react";
import { headers } from "next/headers";
import { queryD1 } from "@/db/db";
import Link from "next/link";
import FloatingJumpButton from "../../../components/FloatingJumpButton";
import { SuggestedPosts } from "@/components/SuggestedPosts";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";

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
    // Fetch the 3 latest recipes from the same pillar (excluding current recipe)
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
       WHERE r.pillar_id = (SELECT pillar_id FROM recipes WHERE slug = ?) 
         AND r.slug != ? 
       ORDER BY r.created_at DESC 
       LIMIT 3`,
      [slug, slug],
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
    name: post.title,
    image: post.cover_image ? [post.cover_image] : [],
    author: {
      "@type": "Person",
      name: "Elena Rossi",
      url: `${protocol}://${host}/author`,
    },
    datePublished: new Date().toISOString().split("T")[0],
    description: post.description,
    prepTime: parseDuration(post.recipe.prep_time),
    cookTime: parseDuration(post.recipe.cook_time),
    totalTime: parseDuration(post.recipe.total_time),
    keywords: Array.isArray(safeTags) ? safeTags.join(", ") : "",
    recipeYield: post.recipe.servings
      ? String(post.recipe.servings)
      : "1 serving",
    recipeCategory: post.category || "Main Course",
    recipeIngredient: Array.isArray(post.recipe.ingredients)
      ? post.recipe.ingredients.map((i: any) =>
          typeof i === "string" ? i : JSON.stringify(i),
        )
      : [],
    recipeInstructions: Array.isArray(post.recipe.instructions)
      ? post.recipe.instructions.map((step: any) => ({
          "@type": "HowToStep",
          text:
            typeof step === "string" ? step : step.text || JSON.stringify(step),
        }))
      : [],
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
        <section className="pt-14 pb-8 bg-stone-50 border-b border-stone-300">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {post.category}
              </span>
              {Array.isArray(safeTags) &&
                safeTags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full"
                  >
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

            <div className="flex items-center justify-center gap-3 mb-8">
              <img
                src="/author_elena_rossi_64x64px.png"
                alt="Elena Rossi"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900 leading-tight mb-0.5">
                  Recipe by{" "}
                  <Link
                    href="/author"
                    className="hover:text-orange-600 transition-colors"
                  >
                    Elena Rossi
                  </Link>
                </p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400 leading-none cursor-default">
                  Culinary Director
                </p>
              </div>
            </div>

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
              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105 text-[10px] uppercase tracking-[0.2em] mt-8 group"
            >
              Jump to Recipe
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </section>

        {/* Share bar — prominent, right under hero */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-b border-stone-200 pb-8">
          <ShareButtons title={post.title} />
        </div>

        {/* Floating Scroll Triggered Button */}
        <FloatingJumpButton targetId="recipe-card" />

        {/* ── You May Also Like ── */}
        {suggested.length > 0 && <SuggestedPosts suggested={suggested} />}
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

        {/* Comments */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <CommentsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
