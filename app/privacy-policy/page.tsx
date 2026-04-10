import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header bgColor="bg-white/90" />
      <main className="grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8 text-center">Privacy Policy</h1>
          <div className="prose prose-stone max-w-none text-stone-600">
            <p className="lead">Last Updated: April 10, 2026</p>
            
            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">1. Introduction</h2>
            <p>Welcome to Savory Bites. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul>
              <li><strong>Identity Data:</strong> includes first name, last name.</li>
              <li><strong>Contact Data:</strong> includes email address for newsletter subscriptions.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website.</li>
            </ul>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">3. Google AdSense</h2>
            <p>We use Google AdSense to serve ads when you visit our website. Google may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
            <p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">4. Cookies</h2>
            <p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. For detailed information on the cookies we use and the purposes for which we use them see our Cookie Policy.</p>

            <h2 className="text-xl font-bold text-stone-900 mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: privacy@savorybites.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
