import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedRecipes from "../components/FeaturedRecipes";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <FeaturedRecipes />

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
