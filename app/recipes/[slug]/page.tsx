import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { notFound } from "next/navigation";
import { Clock, Users, Timer, AlertCircle, Lightbulb, Info, CheckCircle, CheckSquare } from "lucide-react";
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
      prep_time: data.recipe?.prep_time || data.prepTime,
      cook_time: data.recipe?.cook_time || data.cookTime,
      total_time: data.recipe?.total_time || data.totalTime,
      servings: data.recipe?.servings || data.servings,
      ingredients: data.recipe?.ingredients || [],
      instructions: data.recipe?.instructions || [],
    },
    content: data.content || [],
    callouts: data.callouts || [],
    images: data.images || {},
  };

  const renderCallout = (block: any, index: string | number) => {
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-100 aspect-[16/9] relative group">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        )}

        {/* Ingredients Quick Access Section (Moved to the top) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden ring-1 ring-stone-900/5">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-stone-100 rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4 -z-0"></div>

                <div className="lg:col-span-1 space-y-10 relative z-10 border-b lg:border-b-0 lg:border-r border-stone-100 pb-10 lg:pb-0">
                    <div>
                        <h3 className="text-stone-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Recipe Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Timer size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-1">Total Time</p>
                                    <p className="font-bold text-stone-900">{post.recipe.total_time || "45 mins"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none mb-1">Servings</p>
                                    <p className="font-bold text-stone-900">{post.recipe.servings} people</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold text-stone-900">Ingredients</h2>
                        <span className="px-4 py-1.5 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Ready to roll</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                       {post.recipe.ingredients.map((ingredient: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                             <div className="mt-1 flex-shrink-0 w-5 h-5 rounded border-2 border-stone-200 group-hover:border-orange-500 group-hover:bg-orange-50 transition-colors flex items-center justify-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             </div>
                             <span className="text-stone-700 leading-relaxed group-hover:text-stone-900 transition-colors font-medium">
                                {ingredient}
                             </span>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

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
              return renderCallout(block, index);
            }
            return null;
          })}
          
          {/* Render Standalone Callouts if they exist */}
          {post.callouts && post.callouts.length > 0 && (
            <div className="mt-12 space-y-4">
              {post.callouts.map((callout: any, index: number) => renderCallout(callout, `extra-${index}`))}
            </div>
          )}
        </article>

        {/* Instructions Card */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 mt-12">
          <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-14 border border-stone-200 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 text-stone-900"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-stone-200 pb-6">
                <h2 className="text-4xl font-serif font-bold text-stone-900">
                  Instructions
                </h2>
                <PrintButton />
              </div>

              <div className="max-w-4xl">
                  <ol className="space-y-12">
                    {post.recipe.instructions.map(
                      (instruction: string, i: number) => (
                        <li key={i} className="flex group">
                          <div className="flex-shrink-0 mr-8">
                             <div className="relative">
                                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-stone-200 text-stone-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300 font-bold text-lg shadow-sm">
                                  {i + 1}
                                </span>
                                <div className="absolute top-1/2 left-full w-4 h-px bg-stone-200 ml-2"></div>
                             </div>
                          </div>
                          <span className="text-stone-700 leading-relaxed pt-2.5 text-xl font-medium">
                            {instruction}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
