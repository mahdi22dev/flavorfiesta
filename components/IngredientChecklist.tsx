"use client";
import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

interface Props {
  ingredients: string[];
}

export default function IngredientChecklist({ ingredients }: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
      {ingredients.map((ingredient, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className="flex items-start gap-4 group text-left cursor-pointer hover:translate-x-1 transition-transform"
        >
          <div className="mt-0.5 flex-shrink-0 transition-colors">
            {checked[i] ? (
              <CheckSquare className="w-5 h-5 text-orange-500" />
            ) : (
              <Square className="w-5 h-5 text-stone-300 group-hover:text-orange-400 transition-colors" />
            )}
          </div>
          <span
            className={`leading-relaxed font-medium transition-colors ${
              checked[i]
                ? "line-through text-stone-400"
                : "text-stone-700 group-hover:text-stone-900"
            }`}
          >
            {ingredient}
          </span>
        </button>
      ))}
    </div>
  );
}
