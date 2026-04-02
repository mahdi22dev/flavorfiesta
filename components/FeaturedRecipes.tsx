import RecipeCard from "./RecipeCard";

export default function FeaturedRecipes({ recipes = [] }: { recipes?: any[] }) {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              Latest Recipes
            </h2>
            <p className="text-stone-500 max-w-md">
              Fresh from our kitchen, these are the recipes our community is
              loving right now.
            </p>
          </div>
          <a
            href="/recipes"
            className="text-orange-600 font-bold text-sm uppercase tracking-widest hover:underline underline-offset-8"
          >
            View All Recipes
          </a>
        </div>
        
        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300">
            <p className="text-stone-400 font-serif italic text-xl">No recipes found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                coverImage={recipe.coverImage}
                category={recipe.category}
                totalTime={recipe.totalTime}
                slug={recipe.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
