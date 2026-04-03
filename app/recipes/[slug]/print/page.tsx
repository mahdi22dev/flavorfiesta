import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PrintPageButton from "../../../../components/PrintPageButton";

export default async function RecipePrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const response = await fetch(`${protocol}://${host}/api/recipes/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();

  const recipe = {
    title: data.title,
    description: data.description,
    prepTime: data.prepTime || data.prep_time,
    cookTime: data.cookTime || data.cook_time,
    totalTime: data.totalTime || data.total_time,
    servings: data.recipe?.servings || data.servings,
    ingredients: data.recipe?.ingredients || [],
    instructions: data.recipe?.instructions || [],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print action bar — hidden when printing */}
      <div className="print:hidden bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <a
          href={`/recipes/${slug}`}
          className="text-sm text-stone-500 hover:text-stone-800 transition-colors font-medium"
        >
          ← Back to recipe
        </a>
        <PrintPageButton />
      </div>

      {/* Printable content */}
      <div className="max-w-3xl mx-auto px-8 py-12 print:py-4 print:px-4">

        {/* Header */}
        <div className="mb-10 pb-8 border-b-2 border-stone-900 print:mb-6 print:pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 border border-orange-300 px-2 py-0.5 rounded-full">
              FlavorFiesta
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3 leading-tight print:text-3xl">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="text-stone-500 text-base leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            {recipe.prepTime && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">
                  Prep
                </span>
                <span className="font-semibold text-stone-800">{recipe.prepTime}</span>
              </div>
            )}
            {recipe.cookTime && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">
                  Cook
                </span>
                <span className="font-semibold text-stone-800">{recipe.cookTime}</span>
              </div>
            )}
            {recipe.totalTime && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">
                  Total
                </span>
                <span className="font-semibold text-stone-800">{recipe.totalTime}</span>
              </div>
            )}
            {recipe.servings && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-0.5">
                  Servings
                </span>
                <span className="font-semibold text-stone-800">{recipe.servings}</span>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout: Ingredients + Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 print:gap-8">

          {/* Ingredients */}
          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-5 pb-3 border-b border-stone-200">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 flex-shrink-0 w-3.5 h-3.5 rounded border border-stone-400 print:border-stone-600" />
                  <span className="text-stone-700 leading-relaxed">{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-5 pb-3 border-b border-stone-200">
              Instructions
            </h2>
            <ol className="space-y-6 print:space-y-4">
              {recipe.instructions.map((step: string, i: number) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 print:bg-stone-900">
                    {i + 1}
                  </span>
                  <p className="text-stone-700 leading-relaxed text-sm pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-stone-200 text-center print:mt-8">
          <p className="text-xs text-stone-400">
            Printed from <strong>FlavorFiesta.com</strong> · {recipe.title}
          </p>
        </div>
      </div>
    </div>
  );
}
