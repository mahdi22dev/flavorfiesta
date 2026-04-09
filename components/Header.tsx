"use client";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header({
  bgColor = "bg-white/80",
}: { bgColor?: string } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? `${bgColor} backdrop-blur-md border-b border-stone-200 shadow-sm`
          : "bg-white border-b border-transparent shadow-none"
      } print:hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-900 cursor-pointer">
                SAVORY<span className="text-orange-600">BITES</span>
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wider text-stone-600">
              <Link
                href="/recipes"
                className="hover:text-orange-600 transition-colors"
              >
                Recipes
              </Link>
              <Link
                href="/guides"
                className="hover:text-orange-600 transition-colors"
              >
                Guides
              </Link>
              {/* <Link
                href="/#categories"
                className="hover:text-orange-600 transition-colors"
              >
                Categories
              </Link> */}
              <Link
                href="/about"
                className="hover:text-orange-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-orange-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/recipes"
              className="p-2 text-stone-500 hover:text-orange-600 transition-colors"
            >
              <Search size={20} />
            </Link>
            <button 
              className="md:hidden p-2 text-stone-500 hover:text-orange-600 transition-colors z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-8 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold tracking-tight text-stone-900">
            Menu
          </h2>
          <button 
            className="p-2 text-stone-500 hover:text-orange-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col p-8 space-y-8 text-2xl font-serif font-bold text-stone-900">
          <Link
            href="/recipes"
            className="hover:text-orange-600 transition-colors flex items-center justify-between"
            onClick={() => setIsMenuOpen(false)}
          >
            Recipes
            <span className="text-stone-200">→</span>
          </Link>
          <Link
            href="/guides"
            className="hover:text-orange-600 transition-colors flex items-center justify-between"
            onClick={() => setIsMenuOpen(false)}
          >
            Guides
            <span className="text-stone-200">→</span>
          </Link>
          <Link
            href="/about"
            className="hover:text-orange-600 transition-colors flex items-center justify-between"
            onClick={() => setIsMenuOpen(false)}
          >
            About
            <span className="text-stone-200">→</span>
          </Link>
          <Link
            href="/contact"
            className="hover:text-orange-600 transition-colors flex items-center justify-between"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
            <span className="text-stone-200">→</span>
          </Link>
        </nav>

        <div className="mt-auto p-8 border-t border-stone-100 bg-stone-50">
          <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">
            Follow Us
          </p>
          <div className="flex gap-4 text-stone-600 font-serif italic text-lg hover:text-orange-600">
            @savorybites
          </div>
        </div>
      </div>
    </header>
  );
}
