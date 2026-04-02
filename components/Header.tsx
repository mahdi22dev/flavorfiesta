"use client";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function Header({
  bgColor = "bg-white/80",
}: { bgColor?: string } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
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
                href="/#categories"
                className="hover:text-orange-600 transition-colors"
              >
                Categories
              </Link>
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
            <button className="md:hidden p-2 text-stone-500">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
