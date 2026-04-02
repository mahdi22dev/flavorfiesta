import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { notFound } from "next/navigation";
import {
  Clock,
  Users,
  Timer,
  AlertCircle,
  Lightbulb,
  Info,
  CheckCircle,
} from "lucide-react";
import PrintButton from "../../../components/PrintButton";
import { headers } from "next/headers";

export default async function RecipePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get host for absolute URL requirement in Server Components fetch
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

  // Map the API response to the post object used by the UI
  const post = {
    title: data.title,
    description: data.description,
    cover_image: data.coverImage,
    recipe: {
      prep_time: data.prepTime,
      cook_time: data.cookTime,
      total_time: data.totalTime,
      servings: data.servings,
      ingredients: data.recipe?.ingredients || [],
      instructions: data.recipe?.instructions || [],
    },
    content: data.content || [],
    images: data.images || {},
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header bgColor="bg-stone-50/90" />
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-12 bg-stone-50 border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-stone-600">
              <div className="flex flex-col items-center">
                <Timer className="text-orange-600 mb-2" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                  Prep Time
                </span>
                <span className="font-medium text-stone-900">
                  {post.recipe.prep_time}
                </span>
              </div>
              <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
              <div className="flex flex-col items-center">
                <Clock className="text-orange-600 mb-2" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                  Cook Time
                </span>
                <span className="font-medium text-stone-900">
                  {post.recipe.cook_time}
                </span>
              </div>
              <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
              <div className="flex flex-col items-center">
                <Users className="text-orange-600 mb-2" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                  Servings
                </span>
                <span className="font-medium text-stone-900">
                  {post.recipe.servings} servings
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 -mb-8">
            <div className="rounded-[2rem] overflow-hidden shadow-xl border border-stone-100 aspect-[16/9]">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-stone lg:prose-xl prose-img:rounded-3xl prose-img:shadow-xl prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900 text-stone-700">
          {post.content.map((block: any, index: number) => {
            if (block.type === "paragraph") {
              return (
                <p key={index} className="leading-relaxed mb-6 text-xl">
                  {block.text}
                </p>
              );
            }
            if (block.type === "heading") {
              return (
                <h2
                  key={index}
                  className="text-4xl font-serif font-bold text-stone-900 mt-16 mb-8"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "image") {
              const blockId = (block as any).id;
              const src = blockId
                ? post.images[blockId as keyof typeof post.images]
                : (block as any).src;

              if (src) {
                return (
                  <div key={index} className="my-12">
                    <img
                      src={src}
                      alt="Recipe Image"
                      className="w-full h-auto rounded-3xl shadow-xl object-cover border border-stone-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                );
              }
            }
            if (block.type === "callout") {
              const variant = block.variant || block.variant_type || "tip";

              let bgColor = "bg-orange-50 border-orange-200";
              let titleColor = "text-orange-900";
              let Icon = (
                <Lightbulb className="w-6 h-6 text-orange-600 mr-4 mt-0.5 flex-shrink-0" />
              );
              let defaultTitle = "Tip";

              if (variant === "warning" || variant === "alert") {
                bgColor = "bg-red-50 border-red-200";
                titleColor = "text-red-900";
                Icon = (
                  <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-0.5 flex-shrink-0" />
                );
                defaultTitle = "Note";
              } else if (variant === "info") {
                bgColor = "bg-blue-50 border-blue-200";
                titleColor = "text-blue-900";
                Icon = (
                  <Info className="w-6 h-6 text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
                );
                defaultTitle = "Info";
              } else if (variant === "success") {
                bgColor = "bg-emerald-50 border-emerald-200";
                titleColor = "text-emerald-900";
                Icon = (
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-4 mt-0.5 flex-shrink-0" />
                );
                defaultTitle = "Success";
              }

              return (
                <div
                  key={index}
                  className={`not-prose my-10 p-6 md:p-8 rounded-3xl border ${bgColor} flex items-start shadow-sm`}
                >
                  {Icon}
                  <div>
                    <h4
                      className={`font-bold uppercase tracking-widest text-sm mb-2 ${titleColor}`}
                    >
                      {block.title || defaultTitle}
                    </h4>
                    <p className="text-stone-800 m-0 leading-relaxed text-lg">
                      {block.text}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </article>

        {/* Recipe Card / Ingredients & Instructions */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-14 border border-stone-200 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 text-stone-900"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-stone-200 pb-6">
                <h2 className="text-4xl font-serif font-bold text-stone-900">
                  The Recipe
                </h2>
                <PrintButton />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Ingredients List */}
                <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-stone-200 pb-10 lg:pb-0 lg:pr-10">
                  <h3 className="text-sm font-bold text-stone-900 mb-8 uppercase tracking-widest text-orange-600">
                    Ingredients
                  </h3>
                  <ul className="space-y-5">
                    {post.recipe.ingredients.map(
                      (ingredient: string, i: number) => (
                        <li key={i} className="flex items-start text-stone-700">
                          <div className="min-w-2 h-2 rounded-full bg-orange-600 mt-2.5 mr-4 flex-shrink-0 shadow-sm"></div>
                          <span className="leading-relaxed text-lg">
                            {ingredient}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Instructions List */}
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-bold text-stone-900 mb-8 uppercase tracking-widest text-orange-600">
                    Instructions
                  </h3>
                  <ol className="space-y-10">
                    {post.recipe.instructions.map(
                      (instruction: string, i: number) => (
                        <li key={i} className="flex group">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors font-bold mr-6 shadow-sm">
                            {i + 1}
                          </span>
                          <span className="text-stone-700 leading-relaxed pt-1.5 text-lg">
                            {instruction}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
