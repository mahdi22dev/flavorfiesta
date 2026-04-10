"use client";
import { useState } from "react";

const SHARE_BUTTONS = [
  {
    label: "Facebook",
    color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    color: "bg-pink-50 text-pink-600 border-pink-100 hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] hover:text-white hover:border-transparent",
    getUrl: (url: string) =>
      `https://www.instagram.com/`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    color: "bg-red-50 text-[#E60023] border-red-100 hover:bg-[#E60023] hover:text-white hover:border-[#E60023]",
    getUrl: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    label: "Copy Link",
    color: "bg-stone-100 text-stone-600 border-stone-200 hover:bg-orange-600 hover:text-white hover:border-orange-600",
    getUrl: () => "",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    isCopy: true,
  },
];

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = (btn: (typeof SHARE_BUTTONS)[number]) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (btn.isCopy) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }
    window.open(btn.getUrl(url, title), "_blank", "width=600,height=450,noopener");
  };

  return (
    <div className="w-full bg-stone-50 rounded-2xl px-6 py-5 border border-stone-100">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-4">
        Enjoyed this? Share it!
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        {SHARE_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleShare(btn)}
            title={btn.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-200 ${btn.color}`}
          >
            {btn.icon}
            <span>{btn.isCopy && copied ? "Copied!" : btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
