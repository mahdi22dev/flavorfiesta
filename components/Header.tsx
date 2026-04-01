"use client";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function Header({
  bgColor = "bg-white/80",
}: { bgColor?: string } = {}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 ${bgColor} backdrop-blur-md border-b border-stone-200 print:hidden`}
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
                href="/"
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
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-500 hover:text-orange-600 transition-colors"
            >
              <Search size={20} />
            </button>
            <button className="md:hidden p-2 text-stone-500">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-3xl bg-amber-400 rounded-3xl p-8 md:p-14 relative shadow-2xl"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-6 right-6 p-3 text-amber-900 hover:text-stone-900 hover:rotate-90 transition-all duration-300 bg-amber-300/50 hover:bg-amber-300 rounded-full"
              >
                <X size={24} strokeWidth={2} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                <Search
                  size={48}
                  className="text-amber-900 mb-8"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="What are you craving?"
                  autoFocus
                  className="w-full text-3xl md:text-5xl font-serif font-bold bg-transparent border-b-4 border-amber-900/20 focus:border-stone-900 outline-none py-4 placeholder:text-amber-900/40 text-stone-900 transition-colors text-center"
                />
                <p className="text-amber-900 mt-8 text-base md:text-lg font-medium tracking-wider">
                  Press{" "}
                  <span className="text-stone-900 font-bold bg-amber-300 px-3 py-1.5 rounded-lg mx-1">
                    Enter
                  </span>{" "}
                  to search our recipes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
