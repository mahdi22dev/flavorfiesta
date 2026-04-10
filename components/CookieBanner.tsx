"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-white p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-stone-300 text-center md:text-left">
          We use cookies to enhance your experience and show personalized ads. By using our site, you agree to our 
          <Link href="/cookies-policy" className="text-orange-500 hover:underline mx-1">Cookie Policy</Link> 
          and 
          <Link href="/privacy-policy" className="text-orange-500 hover:underline mx-1">Privacy Policy</Link>.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={acceptCookies}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
