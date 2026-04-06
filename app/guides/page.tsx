import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidesList from "@/components/GuidesList";

export default async function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow pt-24 pb-32">
        {/* Guides Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 leading-tight mb-8">
              Culinary <span className="italic font-light text-orange-600">Guides</span>
            </h1>
            <p className="max-w-2xl text-lg text-stone-500 font-medium leading-relaxed">
              Master the foundational scientific principles of high-performance cooking. 
              Our guides break down complex culinary processes into clear, actionable frameworks.
            </p>
          </div>
        </div>

        <GuidesList />
      </main>
      <Footer />
    </div>
  );
}
