"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "lucide-react";

interface Props {
  targetId: string;
}

export default function FloatingJumpButton({ targetId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const heroButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // We look for the INITIAL button in the hero section
    const heroButton = document.getElementById("hero-jump-button");
    
    if (!heroButton) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the hero button is NOT intersecting (out of view), show floating button
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(heroButton);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className={`fixed bottom-10 right-10 z-50 transition-all duration-500 ease-in-out pointer-events-none hidden md:block ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"
      }`}
    >
      <a
        href={`#${targetId}`}
        className={`inline-flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-2xl shadow-orange-200/50 transition-all duration-300 hover:scale-105 pointer-events-auto text-xs uppercase tracking-widest`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        Jump to Recipe
      </a>
    </div>
  );
}
