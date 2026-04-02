import RecipeCard from "./RecipeCard";

export default function FeaturedRecipes({ recipes = [] }: { recipes?: any[] }) {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              image={recipe.image}
              category={recipe.category}
              time={recipe.time}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
