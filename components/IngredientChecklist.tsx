"use client";
import { CheckSquare, Square } from "lucide-react";

interface Props {
  ingredients: string[];
  checked: Record<number, boolean>;
  toggle: (i: number) => void;
  compact?: boolean; // compact mode for the sidebar near instructions
}

export default function IngredientChecklist({
  ingredients,
  checked,
  toggle,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <ul className="space-y-2">
        {ingredients.map((ingredient, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex items-start gap-3 group text-left cursor-pointer w-full"
            >
              <div className="mt-0.5 flex-shrink-0 transition-colors">
                {checked[i] ? (
                  <CheckSquare className="w-4 h-4 text-orange-500" />
                ) : (
                  <Square className="w-4 h-4 text-stone-300 group-hover:text-orange-400 transition-colors" />
                )}
              </div>
              <span
                className={`text-sm leading-relaxed transition-colors ${
                  checked[i]
                    ? "line-through text-stone-400"
                    : "text-stone-600 group-hover:text-stone-900"
                }`}
              >
                {ingredient}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

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
