import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { queryD1 } from "@/db/db";
import { ChevronRight } from "lucide-react";
import CategorySection from "../components/section/CategorySection";

// Section icons as inline SVGs (unique per category)
function ChickenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2c-1.35 1.5-2 3-2 5a5 5 0 0 0 10 0c0-2-.65-3.5-2-5" />
      <path d="M9 10a5 5 0 0 0-5 5c0 2.5 2 4 5 4h7c1.7 0 3-.3 4-1" />
      <path d="M12 15v6" />
      <path d="M8 21h8" />
    </svg>
  );
}

function BeefIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-1.2 5.4-2 7.8-2 9 0 1.7 .9 3 2 3s2-1.3 2-3c0-1.2-.8-3.6-2-9" />
      <path d="M6.6 9.8c3.8 2 5.8 3.2 6.6 4 1.1 1.1.8 2.6-.4 3.3" />
      <path d="M17.4 9.8C13.6 11.8 11.6 13 10.8 13.8c-1.1 1.1-.8 2.6.4 3.3" />
    </svg>
  );
}

function PorkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l1-3h16l1 3" />
      <path d="M4 11v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
      <path d="M8 17v2" />
      <path d="M16 17v2" />
      <path d="M9 8V6" />
      <path d="M15 8V6" />
    </svg>
  );
}

function SalmonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8c0 0-1.5-2-6-2C6 6 2 10 2 12s4 6 10 6c4.5 0 6-2 6-2" />
      <path d="M18 8l4-4" />
      <path d="M18 16l4 4" />
      <path d="M12 12h.01" />
      <path d="M8 10c0 1.1.9 2 2 2" />
    </svg>
  );
}

export const dynamic = "force-dynamic";

const ASSETS_CDN = "https://assets.shortinx.xyz";
function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

const FEATURED_CATEGORIES = [
  { key: "Chicken", label: "Chicken Recipes", icon: <ChickenIcon /> },
  { key: "Beef", label: "Beef Recipes", icon: <BeefIcon /> },
  { key: "Pork", label: "Pork Recipes", icon: <PorkIcon /> },
  { key: "Seafood", label: "Salmon Recipes", icon: <SalmonIcon /> },
];

async function getHomePageData() {
  try {
    const featuredRows = await queryD1<{
      id: number;
      title: string;
      slug: string;
      description: string;
      hero_wide: string;
      category: string;
      created_at: string;
    }>(
      `SELECT r.id, r.title, r.slug, r.description, ri.hero_wide, r.category, r.created_at
       FROM recipes r
       LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
       ORDER BY RANDOM() LIMIT 1`,
    );
    const featured = featuredRows[0];

    const trending = await queryD1<{
      id: number;
      title: string;
      slug: string;
      created_at: string;
    }>(
      `SELECT id, title, slug, created_at FROM recipes WHERE id != ? ORDER BY RANDOM() LIMIT 5`,
      [featured?.id || -1],
    );

    // Fetch up to 4 recipes per featured category in parallel
    const categoryRecipes = await Promise.all(
      FEATURED_CATEGORIES.map(({ key }) =>
        queryD1<{
          id: number;
          title: string;
          slug: string;
          description: string;
          hero_wide: string;
          category: string;
          created_at: string;
        }>(
          `SELECT id, title, slug, description, hero_wide, category, created_at
           FROM (
             SELECT r.id, r.title, r.slug, r.description, ri.hero_wide, r.category, r.created_at,
                    ROW_NUMBER() OVER (PARTITION BY r.pillar_id ORDER BY RANDOM()) as rn
             FROM recipes r
             LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
             WHERE LOWER(r.category) LIKE LOWER(?)
           )
           ORDER BY rn, RANDOM() 
           LIMIT 4`,
          [`%${key}%`],
        ).catch(() => []),
      ),
    );


    const normalize = (r: any) => ({
      ...r,
      coverImage: cdnUrl(r.hero_wide),
      date: r.created_at
        ? new Date(r.created_at).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
          })
        : "Recently",
    });

    return {
      featured: featured ? normalize(featured) : null,
      trending: trending.map(normalize),
      categoryRecipes: categoryRecipes.map((rows) => rows.map(normalize)),
    };
  } catch (err) {
    console.error("Home data error:", err);
    return {
      featured: null,
      trending: [],
      categoryRecipes: FEATURED_CATEGORIES.map(() => []),
    };
  }
}

export default async function Home() {
  const { featured, trending, categoryRecipes } = await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      <Header bgColor="bg-white/90" />

      <main className="grow pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- TOP SECTION: FEATURED + SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Main Featured Post */}
          <div className="lg:col-span-8 flex flex-col group max-w-3xl">
            {featured && (
              <>
                <Link
                  href={`/recipes/${featured.slug}`}
                  className="block group"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        loading="eager"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-6xl">
                        🍲
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-stone-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                    {featured.title}
                  </h1>
                  <p className="text-base text-stone-500 leading-relaxed mb-8 max-w-xl line-clamp-3 font-medium">
                    {featured.description}
                  </p>
                </Link>
                <div className="flex items-center gap-3 text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                  <Link
                    href="/author"
                    className="text-stone-900 uppercase hover:text-orange-600 transition-colors"
                  >
                    Elena Rossi
                  </Link>
                  <span>•</span>
                  <span>{featured.date}</span>
                </div>
              </>
            )}
          </div>

          {/* Sidebar: Featured Posts */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-900 mb-4 pb-2 border-b-2 border-orange-600 inline-block w-fit">
              Featured Posts
            </h2>
            <div className="divide-y divide-stone-200">
              {trending.map((post) => (
                <Link
                  key={post.id}
                  href={`/recipes/${post.slug}`}
                  className="py-6 block group first:pt-4"
                >
                  <h3 className="text-base font-bold text-stone-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <span>Elena Rossi</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* --- CATEGORY SECTIONS --- */}
        {FEATURED_CATEGORIES.map(({ key, label, icon }, i) => (
          <CategorySection
            key={key}
            title={label}
            category={key}
            icon={icon}
            recipes={categoryRecipes[i] ?? []}
          />
        ))}

        {/* --- VIEW ALL BUTTON --- */}
        <div className="mt-8 text-center">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-10 py-4 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg"
          >
            Browse All Recipes
            <ChevronRight size={14} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
