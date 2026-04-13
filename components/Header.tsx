"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/guides", label: "Guides" },
  { href: "/author", label: "Author" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ bgColor = "bg-white/80" }: { bgColor?: string } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? `${bgColor} backdrop-blur-md border-b border-stone-200 shadow-sm`
            : "bg-white border-b border-transparent shadow-none"
        } print:hidden`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-stone-900">
                CUT<span className="text-orange-600">&</span>SEAR
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-medium uppercase tracking-wider text-stone-600">
              {NAV_LINKS.filter(l => l.href !== "/").map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-orange-600 transition-colors ${pathname === href ? "text-orange-600" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link href="/recipes" className="p-2 text-stone-500 hover:text-orange-600 transition-colors" aria-label="Search">
                <Search size={20} />
              </Link>
              <button
                className="md:hidden p-2 text-stone-500 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu — rendered as sibling to avoid stacking context issues */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar inside the overlay */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-stone-100 shrink-0">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <span className="text-2xl font-serif font-bold text-stone-900">
              CUT<span className="text-orange-600">&</span>SEAR
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-stone-500 hover:text-orange-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav links — centered, large */}
        <nav className="flex-1 flex flex-col justify-center px-8 space-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between py-4 text-2xl font-serif font-bold border-b border-stone-50 transition-colors ${
                pathname === href ? "text-orange-600" : "text-stone-900 hover:text-orange-600"
              }`}
            >
              {label}
              <span className="text-stone-200 text-lg">→</span>
            </Link>
          ))}
        </nav>

        {/* Footer block */}
        <div className="shrink-0 px-8 py-8 border-t border-stone-100 bg-stone-50">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4">Our Author</p>
          <Link
            href="/author"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <img
              src="/author_elena_rossi.png"
              alt="Elena Rossi"
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
            <div>
              <p className="text-sm font-bold text-stone-900 font-serif italic group-hover:text-orange-600 transition-colors">Elena Rossi</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Culinary Director</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
