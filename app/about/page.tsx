import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-10">
            About <span className="text-orange-600">Our Journey</span>
          </h1>
          <div className="mx-auto text-lg md:text-xl text-stone-600 leading-relaxed space-y-8 bg-white p-10 md:p-16 rounded-3xl border border-stone-100 shadow-sm text-left">
            <p>
              Welcome to <strong>Savory Bites</strong>, a culinary journey dedicated to finding and sharing the absolute best flavors from around the world. We believe that cooking should be an adventure, a way to connect with the people we love and to experience cultures we admire.
            </p>
            <p>
              Founded by passionate home cooks and culinary adventurers, this blog started as a small personal space to document unique recipes. Today, it has grown into a community of food lovers everywhere.
            </p>
            <p>
              We test every recipe to strictly ensure it meets our standards of simplicity, deep flavor profiles, and accessibility. Whether you are craving a 20-minute weeknight dinner or preparing a feast for a holiday, Savory Bites is your trusted kitchen companion.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
