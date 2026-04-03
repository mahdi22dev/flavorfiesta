import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedRecipes from "../components/FeaturedRecipes";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

export const dynamic = "force-dynamic";

import { queryD1 } from "@/lib/db";

async function getHomePageData() {
  try {
    // Get Latest Recipes
    const latestRecipes = await queryD1<{
      id: number; title: string; slug: string; description: string;
      cover_image: string; category: string; servings: number;
      prep_time: string; total_time: string;
    }>(
      `SELECT id, title, slug, description, cover_image, category, servings, prep_time, total_time
       FROM recipes ORDER BY created_at DESC LIMIT 6`
    );

    // Get Categories with Counts
    const categoriesRaw = await queryD1<{ name: string; count: number }>(
      `SELECT category as name, COUNT(*) as count FROM recipes GROUP BY category`
    );

    const categoryIcons: Record<string, string> = {
      Breakfast: "🍳", Lunch: "🥗", Dinner: "🍝", Dessert: "🍰",
      Drinks: "🍹", Vegan: "🌿", Seafood: "🐟", "Main Course": "🍗",
    };

    const categories = categoriesRaw.map((cat) => ({
      name: cat.name || "General",
      count: cat.count,
      icon: categoryIcons[cat.name || ""] || "🍴",
    }));

    // Get a Random Featured Recipe
    const featuredRows = await queryD1<{
      id: number; title: string; slug: string; description: string;
      cover_image: string; category: string; servings: number; total_time: string;
    }>(
      `SELECT id, title, slug, description, cover_image, category, servings, total_time
       FROM recipes ORDER BY RANDOM() LIMIT 1`
    );
    const featuredRecipe = featuredRows[0] || null;

    // Normalize snake_case from DB to camelCase for UI
    const normalize = (r: any) => ({
      ...r,
      coverImage: r.cover_image,
      prepTime: r.prep_time,
      totalTime: r.total_time,
    });

    return {
      latestRecipes: latestRecipes.map(normalize),
      categories,
      featuredRecipe: featuredRecipe ? normalize(featuredRecipe) : null,
    };
  } catch (err) {
    console.error("getHomePageData error:", err);
    return { latestRecipes: [], categories: [], featuredRecipe: null };
  }
}

export default async function Home() {
  const { latestRecipes, categories, featuredRecipe } = await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero recipe={featuredRecipe} />
        <Categories categories={categories} />
        <FeaturedRecipes recipes={latestRecipes} />

        {/* Newsletter Section */}
        <section className="py-24 bg-orange-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-serif font-bold text-white mb-6">
              Join Our Culinary Community
            </h2>
            <p className="text-orange-100 mb-10 text-lg">
              Subscribe to get weekly recipe inspiration, kitchen tips, and
              exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-6 py-4 rounded-full bg-white text-stone-900 focus:outline-none focus:ring-4 focus:ring-orange-400/50"
                required
              />
              <button className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
