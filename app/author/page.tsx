import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AuthorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header bgColor="bg-white/90" />

      <main className="grow py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-stone-100 flex flex-col md:flex-row gap-12 items-center md:items-start group">
          <div className="shrink-0 relative overflow-hidden rounded-full w-48 h-48 md:w-64 md:h-64 shadow-2xl border-4 border-white z-10">
            <img 
              src="/author_elena_rossi.png" 
              alt="Elena Rossi" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-full" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-4">
              Elena Rossi
            </h1>
            <p className="text-orange-600 font-bold uppercase tracking-[0.2em] text-sm mb-8">
              Executive Culinary Director
            </p>

            <div className="prose prose-lg text-stone-600 prose-p:leading-relaxed">
              <p>
                Hello! I'm Elena Rossi, the heart and soul behind the recipes here at Flavor Fiesta. With over 15 years of experience in professional kitchens from Milan to Malibu, my mission is to demystify complex gourmet techniques for the home cook.
              </p>
              <p>
                Whether bringing a modern twist to classic Mediterranean comfort foods, or perfecting the science behind a flawlessly juicy air-fryer chicken breast, my goal is simple: to make every meal you cook feel exactly like a special occasion without the unnecessary stress.
              </p>
              <p>
                When I'm not developing new recipes in our culinary studio, you can find me exploring local farmers' markets, tending to my ever-expanding urban herb garden, or simply enjoying a robust espresso.
              </p>
            </div>
            
            <div className="mt-10 flex gap-4 justify-center md:justify-start">
               <Link href="/recipes" className="px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-600/30">
                  Explore My Recipes
               </Link>
               <Link href="/guides" className="px-6 py-3 bg-stone-100 text-stone-700 border border-stone-200 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors">
                  Read My Guides
               </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
