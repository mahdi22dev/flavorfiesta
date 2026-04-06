import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { queryD1 } from "@/db/db";
import { Calendar, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const ASSETS_CDN = "https://assets.shortinx.xyz";
function cdnUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `${ASSETS_CDN}/${key.replace(/^\//, "")}`;
}

async function getHomePageData() {
  try {
    // 1. Featured Recipe (Top Large)
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

    // 2. Trending Side Posts (5 items)
    const trending = await queryD1<{
        id: number;
        title: string;
        slug: string;
        created_at: string;
    }>(
        `SELECT id, title, slug, created_at FROM recipes WHERE id != ? ORDER BY RANDOM() LIMIT 5`,
        [featured?.id || -1]
    );

    // 3. Bottom Grid Recipes (Latest 4)
    const latest = await queryD1<{
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
         WHERE r.id != ?
         ORDER BY r.created_at DESC LIMIT 4`,
         [featured?.id || -1]
      );

    const normalize = (r: any) => ({
      ...r,
      coverImage: cdnUrl(r.hero_wide),
      date: r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }) : "Recently",
    });

    return {
      featured: featured ? normalize(featured) : null,
      trending: trending.map(normalize),
      latest: latest.map(normalize),
    };
  } catch (err) {
    console.error("Home data error:", err);
    return { featured: null, trending: [], latest: [] };
  }
}

export default async function Home() {
  const { featured, trending, latest } = await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      <Header bgColor="bg-white/90" />
      
      <main className="grow pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- TOP SECTION: FEATURED + SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Main Featured Post */}
          <div className="lg:col-span-8 flex flex-col group max-w-3xl">
            {featured && (
              <Link href={`/recipes/${featured.slug}`} className="block">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
                   {featured.coverImage ? (
                     <img 
                        src={featured.coverImage} 
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                     />
                   ) : (
                     <div className="w-full h-full bg-orange-100 flex items-center justify-center text-6xl">🍲</div>
                   )}
                </div>
                <div>
                   <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-stone-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                     {featured.title}
                   </h1>
                   <p className="text-base text-stone-500 leading-relaxed mb-8 max-w-xl line-clamp-3 font-medium">
                     {featured.description}
                   </p>
                   <div className="flex items-center gap-3 text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                      <span className="text-stone-900 uppercase">FlavorFiesta Staff</span>
                      <span>•</span>
                      <span>{featured.date}</span>
                   </div>
                </div>
              </Link>
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
                      <span>FlavorFiesta</span>
                      <span>{post.date}</span>
                   </div>
                 </Link>
               ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: LATEST GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {latest.map((post) => (
             <Link key={post.id} href={`/recipes/${post.slug}`} className="group flex flex-col">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-stone-200 shadow-sm">
                   {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                   ) : (
                      <div className="w-full h-full bg-orange-50 flex items-center justify-center text-3xl">🍲</div>
                   )}
                </div>
                <h4 className="text-lg font-bold text-stone-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                   {post.title}
                </h4>
                <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">
                   {post.description}
                </p>
                <div className="mt-auto flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-stone-400">
                    <span className="text-orange-600 uppercase tracking-[0.2em]">{post.category}</span>
                    <span>{post.date}</span>
                </div>
             </Link>
           ))}
        </div>

        {/* --- VIEW ALL BUTTON --- */}
        <div className="mt-16 text-center">
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
