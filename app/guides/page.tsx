import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuidesList from "@/components/GuidesList";

export default async function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow pt-24 pb-32">

        <GuidesList />
      </main>
      <Footer />
    </div>
  );
}
