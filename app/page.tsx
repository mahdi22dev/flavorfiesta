import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedRecipes from "../components/FeaturedRecipes";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/recipes_shema";
import { count, desc, eq, sql } from "drizzle-orm";

async function getHomePageData() {
  const { env } = getCloudflareContext();
  
  if (!env || !env.DB_RECIPES) {
    return { latestRecipes: [], categories: [], featuredRecipe: null };
  }

  const db = drizzle(env.DB_RECIPES, { schema });

  // Get Latest Recipes
  const latestRecipes = await db
    .select()
    .from(schema.recipes)
    .orderBy(desc(schema.recipes.createdAt))
    .limit(6);

  // Get Categories with Counts
  const categoriesRaw = await db
    .select({ 
      name: schema.recipes.category, 
      count: count() 
    })
    .from(schema.recipes)
    .groupBy(schema.recipes.category);

  const categoryIcons: Record<string, string> = {
    "Breakfast": "🍳",
    "Lunch": "🥗",
    "Dinner": "🍝",
    "Dessert": "🍰",
    "Drinks": "🍹",
    "Vegan": "🌿",
    "Seafood": "🐟",
    "Main Course": "🍗",
  };

  const categories = categoriesRaw.map(cat => ({
    name: cat.name || "General",
    count: cat.count,
    icon: categoryIcons[cat.name || ""] || "🍴"
  }));

  // Get a Random Featured Recipe (using order by random)
  const featuredRecipe = await db
    .select()
    .from(schema.recipes)
    .orderBy(sql`RANDOM()`)
    .limit(1)
    .then(rows => rows[0] || null);

  return { latestRecipes, categories, featuredRecipe };
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
