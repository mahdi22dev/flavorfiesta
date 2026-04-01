import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 pt-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6">Contact Us</h1>
            <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto">We'd love to hear from you. Drop us a line below or reach out directly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                  <input type="text" id="name" className="w-full px-5 py-4 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-white shadow-sm" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <input type="email" id="email" className="w-full px-5 py-4 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-white shadow-sm" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                  <textarea id="message" rows={5} className="w-full px-5 py-4 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-white shadow-sm" placeholder="How can we help?"></textarea>
                </div>
                <button type="button" className="w-full bg-orange-600 text-white font-bold tracking-widest uppercase py-4 rounded-full hover:bg-orange-700 hover:shadow-lg transition-all">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="space-y-8 md:pl-8">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Contact Information</h2>
              <div className="space-y-10">
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-6 group-hover:bg-orange-600 transition-colors duration-300">
                    <Mail className="text-orange-600 group-hover:text-white transition-colors duration-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 mb-1">Email Connect</h3>
                    <p className="text-stone-500">hello@savorybites.com</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-6 group-hover:bg-orange-600 transition-colors duration-300">
                    <Phone className="text-orange-600 group-hover:text-white transition-colors duration-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 mb-1">Call Us</h3>
                    <p className="text-stone-500">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-6 group-hover:bg-orange-600 transition-colors duration-300">
                    <MapPin className="text-orange-600 group-hover:text-white transition-colors duration-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 mb-1">Visit Us</h3>
                    <p className="text-stone-500 leading-relaxed">123 Culinary Lane<br/>Flavor Town, CA 90210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
