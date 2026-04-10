import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header bgColor="bg-white/90" />
      <main className="grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8 text-center">Terms of Service</h1>
          <div className="prose prose-stone max-w-none text-stone-600">
            <p className="lead">Last Updated: April 10, 2026</p>
            
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Savory Bites, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Savory Bites' website for personal, non-commercial transitory viewing only.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Disclaimer</h2>
            <p>The materials on Savory Bites' website are provided on an 'as is' basis. Savory Bites makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Limitations</h2>
            <p>In no event shall Savory Bites or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Savory Bites' website.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
