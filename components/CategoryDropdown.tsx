"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Props {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (val: string) => void;
}

export default function CategoryDropdown({
  value,
  options,
  placeholder = "All Categories",
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isDefault = value === placeholder || value === "Categories";
  const label = isDefault ? placeholder : value;

  return (
    <div ref={ref} className="relative w-full md:w-64 select-none">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-transparent border border-orange-500 ring-2 ring-orange-500/10 text-sm font-medium transition-all hover:ring-orange-500/20 focus:outline-none"
      >
        <span className={isDefault ? "text-stone-400" : "text-stone-800"}>
          {label}
        </span>
        <ChevronDown
          size={14}
          className={`text-orange-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-stone-100 rounded-2xl shadow-xl shadow-stone-900/10 overflow-hidden py-1.5">
          {/* All option */}
          <button
            type="button"
            onClick={() => { onChange(placeholder); setOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
              isDefault
                ? "text-orange-600 font-semibold bg-orange-50"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {placeholder}
            {isDefault && <Check size={13} className="text-orange-500" />}
          </button>

          <div className="my-1 border-t border-stone-50" />

          {options.map((opt) => {
            const selected = value === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  selected
                    ? "text-orange-600 font-semibold bg-orange-50"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {opt}
                {selected && <Check size={13} className="text-orange-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
