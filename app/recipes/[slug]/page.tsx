import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RecipeSlugPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            {/* Empty page for now as requested */}
            <h1 className="text-4xl font-playfair font-bold text-stone-900 mb-6">
              Recipe Details Coming Soon
            </h1>
            <p className="text-lg text-stone-600">
              We're currently working on this recipe. Check back later!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
