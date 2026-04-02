import Link from "next/link";

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
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
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={`/recipes?category=${cat.name}`}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
