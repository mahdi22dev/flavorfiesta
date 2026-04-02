import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchClient from "@/components/SearchClient";

export default async function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20 pb-32">
        <SearchClient />
      </main>
      <Footer />
    </div>
  );
}
