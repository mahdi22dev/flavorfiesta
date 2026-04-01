const CATEGORIES = [
  { name: "Breakfast", icon: "🍳", count: 24 },
  { name: "Lunch", icon: "🥗", count: 42 },
  { name: "Dinner", icon: "🍝", count: 56 },
  { name: "Desserts", icon: "🍰", count: 31 },
  { name: "Drinks", icon: "🍹", count: 18 },
  { name: "Vegan", icon: "🌿", count: 29 },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-stone-500">
            Find exactly what you're craving today.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, index) => (
            <button
              key={index}
              className="group p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 text-center"
            >
              <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform">
                {cat.icon}
              </span>
              <h4 className="font-bold text-stone-900 group-hover:text-white transition-colors mb-1">
                {cat.name}
              </h4>
              <p className="text-xs text-stone-500 group-hover:text-orange-100 transition-colors uppercase tracking-widest">
                {cat.count} Recipes
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
