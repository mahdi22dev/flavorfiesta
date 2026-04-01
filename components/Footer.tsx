"use client";
import { Mail } from "lucide-react";

const Facebook = ({ size = 24 }: { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Instagram = ({ size = 24 }: { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Twitter = ({ size = 24 }: { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">
              SAVORY<span className="text-orange-500">BITES</span>
            </h2>
            <p className="text-stone-400 max-w-sm mb-8">
              We believe that cooking should be an adventure. Join us as we
              explore flavors from around the world and share our favorite
              kitchen secrets.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Recipes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">
              Newsletter
            </h4>
            <p className="text-stone-400 text-sm mb-4">
              Get the latest recipes delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-stone-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-600 p-2 rounded-lg hover:bg-orange-700 transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-stone-500 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Savory Bites Blog. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
