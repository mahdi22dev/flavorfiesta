"use client";
import { Printer } from "lucide-react";

export default function PrintPageButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm"
    >
      <Printer size={16} />
      Print
    </button>
  );
}
