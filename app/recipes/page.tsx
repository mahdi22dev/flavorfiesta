import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchClient from "../../components/SearchClient";
import fs from "fs/promises";
import path from "path";

async function getArticles() {
  const articlesDir = path.join(process.cwd(), "articles");
  let files;
  try {
    files = await fs.readdir(articlesDir);
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }

  const recipes = [];
  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        const filePath = path.join(articlesDir, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(fileContent);
        // Add slug and any other necessary search metadata
        recipes.push({
          ...data,
          slug: file.replace(".json", ""),
          image: data.images?.image_1 || data.images?.image_7 || "", // Simplified image selection for search
        });
      } catch (error) {
        console.error(`Error reading article file: ${file}`, error);
      }
    }
  }
  return recipes;
}

export default async function SearchPage() {
  const initialRecipes = await getArticles();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20 pb-32">
        <SearchClient initialRecipes={initialRecipes} />
      </main>
      <Footer />
    </div>
  );
}
