"use client";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
}

export default function PrintButton({ slug }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/recipes/${slug}/print`)}
      className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors bg-white px-5 py-3 rounded-full border border-stone-200 shadow-sm font-bold tracking-widest uppercase text-xs"
    >
      <Printer size={16} />
      <span>Print Recipe</span>
    </button>
  );
}
