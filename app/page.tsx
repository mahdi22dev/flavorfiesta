import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedRecipes from "../components/FeaturedRecipes";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import fs from "fs/promises";
import path from "path";

async function getLatestRecipes() {
  const articlesDir = path.join(process.cwd(), "articles");
  let files;
  try {
    files = await fs.readdir(articlesDir);
  } catch (error) {
    return [];
  }

  const recipes = [];
  for (const file of files.slice(0, 3)) { // Just grab first 3 for featured
    if (file.endsWith(".json")) {
      try {
        const fileContent = await fs.readFile(path.join(articlesDir, file), "utf8");
        const data = JSON.parse(fileContent);
        recipes.push({
          ...data,
          slug: file.replace(".json", ""),
          image: data.images?.image_1 || data.images?.image_7 || "",
          time: data.recipe?.total_time?.replace("PT", "").replace("M", "m").replace("H", "h ") || "N/A"
        });
      } catch (e) {}
    }
  }
  return recipes;
}

export default async function Home() {
  const latestRecipes = await getLatestRecipes();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories />
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
