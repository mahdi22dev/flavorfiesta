"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";

const CATEGORIES = [
  "Chicken",
  "Beef",
  "Pork",
  "Seafood",
  "Vegetarian",
  "Vegan",
  "Desserts",
  "Pasta",
  "Soups",
  "Salads",
  "General",
];

interface ImageSlot {
  label: string;
  key: string;
}

const IMAGE_SLOTS: ImageSlot[] = [
  { label: "Hero (wide)", key: "heroWide" },
  { label: "Macro / Texture", key: "macroTexture" },
  { label: "Ingredients Flatlay", key: "ingredientsFlatlay" },
  { label: "Whole Dish", key: "wholeDish" },
];

interface AIToggles {
  description: boolean;
  ingredients: boolean;
  instructions: boolean;
  images: boolean;
  metadata: boolean;
}

interface ImageAIState {
  heroWide: boolean;
  macroTexture: boolean;
  ingredientsFlatlay: boolean;
  wholeDish: boolean;
}

export default function NewRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [category, setCategory] = useState("General");
  const [servings, setServings] = useState("4");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [aiToggles, setAIToggles] = useState<AIToggles>({
    description: true,
    ingredients: true,
    instructions: true,
    images: true,
    metadata: true,
  });
  const [imageAI, setImageAI] = useState<ImageAIState>({
    heroWide: true,
    macroTexture: true,
    ingredientsFlatlay: true,
    wholeDish: true,
  });
  const [loading, setLoading] = useState(false);

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, value: string) {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  }

  function toggleAI(key: keyof AIToggles) {
    setAIToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "images") {
        setImageAI({
          heroWide: next.images,
          macroTexture: next.images,
          ingredientsFlatlay: next.images,
          wholeDish: next.images,
        });
      }
      return next;
    });
  }

  function toggleImageAI(key: keyof ImageAIState) {
    setImageAI((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Placeholder — would call server action to generate recipe via AI
    setTimeout(() => setLoading(false), 1500);
  }

  const enabledCount = Object.values(aiToggles).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 -ml-2" render={<Link href="/admin/recipes" />}>
            <ArrowLeft size={16} />
            Back to Recipes
          </Button>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Generate Recipe with AI
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Fill in the title and optionally a brief. Toggle which parts you want
            AI to generate.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Only the title is required.</span>{" "}
              Everything else is optional — leave fields blank and toggle AI on
              to fill them for you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title — always required */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Title
                <Badge variant="destructive" className="text-[10px] font-normal">
                  Required
                </Badge>
              </CardTitle>
              <CardDescription>
                The recipe name. This is always written by you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pan-Seared Ribeye with Herb Butter"
                className="text-base"
              />
            </CardContent>
          </Card>

          {/* AI Generation Brief */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                Generation Brief
                <Badge variant="secondary" className="text-[10px] font-normal">
                  Optional
                </Badge>
              </CardTitle>
              <CardDescription>
                A short description for the AI. The more detail, the better the
                result.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={3}
                placeholder="e.g. Classic American steakhouse recipe, medium-rare, served with roasted garlic compound butter and charred asparagus..."
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none resize-none"
              />
            </CardContent>
          </Card>

          {/* Category & Meta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Details
                <Badge variant="secondary" className="text-[10px] font-normal">
                  Optional
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time</Label>
                  <Input
                    id="prepTime"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 15 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cook Time</Label>
                  <Input
                    id="cookTime"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="e.g. 25 min"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Ingredients
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    Optional
                  </Badge>
                </span>
                {!aiToggles.ingredients && ingredients.length === 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    Add at least one
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {aiToggles.ingredients
                  ? "AI will generate a full ingredient list. You can add items now as guidance."
                  : "Add each ingredient manually."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {ingredients.map((ingredient, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    placeholder={`Ingredient ${i + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(i)}
                      className="shrink-0 h-8 w-8"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="mt-2"
              >
                <Plus size={14} />
                Add Ingredient
              </Button>
            </CardContent>
          </Card>

          {/* Image Placeholders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Images
                <Badge variant="secondary" className="text-[10px] font-normal">
                  Optional
                </Badge>
              </CardTitle>
              <CardDescription>
                Each image can be AI-generated or left for manual upload.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {IMAGE_SLOTS.map((slot) => (
                  <div
                    key={slot.key}
                    className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-2"
                  >
                    <div
                      className={`aspect-[4/3] rounded-md flex flex-col items-center justify-center gap-1 text-muted-foreground/50 ${
                        imageAI[slot.key as keyof ImageAIState]
                          ? "bg-orange-50/50"
                          : "bg-transparent"
                      }`}
                    >
                      {imageAI[slot.key as keyof ImageAIState] ? (
                        <Sparkles size={16} className="text-orange-400/70" />
                      ) : (
                        <Plus size={16} />
                      )}
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        {slot.label}
                      </span>
                    </div>
                    <label className="mt-2 flex items-center justify-between px-1 cursor-pointer select-none">
                      <span className="text-[10px] text-muted-foreground">
                        Generate with AI
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={imageAI[slot.key as keyof ImageAIState]}
                        onClick={() =>
                          toggleImageAI(slot.key as keyof ImageAIState)
                        }
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          imageAI[slot.key as keyof ImageAIState]
                            ? "bg-orange-600"
                            : "bg-muted"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-3 w-3 rounded-full bg-white shadow ring-0 transition-transform ${
                            imageAI[slot.key as keyof ImageAIState]
                              ? "translate-x-3"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" />
                AI Generation
              </CardTitle>
              <CardDescription>
                Choose what AI should generate.{" "}
                <span className="font-medium text-foreground">
                  {enabledCount} of 5 enabled
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(
                  [
                    ["description", "Description & summary"],
                    ["ingredients", "Full ingredient list"],
                    ["instructions", "Step-by-step instructions"],
                    ["images", "All 4 recipe images"],
                    ["metadata", "Prep time, cook time, servings"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer"
                  >
                    <span className="text-sm">{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={aiToggles[key]}
                      onClick={() => toggleAI(key)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        aiToggles[key] ? "bg-orange-600" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                          aiToggles[key]
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" render={<Link href="/admin/recipes" />}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={!title.trim() || loading}>
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate Recipe
                </>
              )}
            </Button>
          </div>
        </form>
    </div>
  );
}
