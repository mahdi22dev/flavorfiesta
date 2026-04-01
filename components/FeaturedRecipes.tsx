import RecipeCard from "./RecipeCard";

const FEATURED_RECIPES = [
  {
    title: "Slow-Roasted Garlic Herb Chicken",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=800",
    category: "Main Course",
    time: "1h 45m",
    servings: 4,
    rating: 4.9,
  },
  {
    title: "Wild Mushroom & Truffle Risotto",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800",
    category: "Vegetarian",
    time: "45m",
    servings: 2,
    rating: 4.8,
  },
  {
    title: "Zesty Lemon Blueberry Tart",
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=800",
    category: "Dessert",
    time: "1h 15m",
    servings: 8,
    rating: 5.0,
  },
];

export default function FeaturedRecipes() {
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
            href="#"
            className="text-orange-600 font-bold text-sm uppercase tracking-widest hover:underline underline-offset-8"
          >
            View All Recipes
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_RECIPES.map((recipe, index) => (
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
