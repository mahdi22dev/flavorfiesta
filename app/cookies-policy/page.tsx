import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header bgColor="bg-white/90" />
      <main className="grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8 text-center">Cookie Policy</h1>
          <div className="prose prose-stone max-w-none text-stone-600">
            <p className="lead">Last Updated: April 10, 2026</p>
            
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. What are cookies?</h2>
            <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. How Savory Bites uses cookies</h2>
            <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
            <ul>
              <li>To enable certain functions of the Service</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>To enable advertisements delivery, including behavioral advertising</li>
            </ul>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Third-party cookies</h2>
            <p>In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. This includes cookies from Google AdSense and Google Analytics.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. What are your choices regarding cookies?</h2>
            <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
