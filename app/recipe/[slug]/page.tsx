import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Clock, Users, Timer, AlertCircle, Lightbulb } from "lucide-react";
import Link from "next/link";
import PrintButton from "../../../components/PrintButton";
import ResponsiveImage from "../../../components/ResponsiveImage";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

export default async function RecipePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    const filePath = path.join(process.cwd(), "articles", `${slug}.json`);
    const fileContent = await fs.readFile(filePath, "utf8");
    post = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading recipe file:", error);
    return notFound();
  }

  // Simple duration formatter for ISO 8601 (e.g. PT15M -> 15 mins)
  // Simple duration formatter for ISO 8601 (e.g. PT15M -> 15 mins)
  const formatDuration = (d: string) =>
    d?.replace("PT", "").replace("M", " mins").replace("H", " hours ") || "N/A";

  return (
    <div className="min-h-screen flex flex-col">
      <Header bgColor="bg-stone-50/90" />
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="pt-16 pb-12 bg-stone-50 border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Category & Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-10">
              <Link
                href="/"
                className="hover:text-orange-600 transition-colors"
              >
                Home
              </Link>
              <span className="text-stone-300">/</span>
              <Link
                href="/recipes"
                className="hover:text-orange-600 transition-colors"
              >
                Recipes
              </Link>
              <span className="text-stone-300">/</span>
              <span className="text-orange-600">
                {post.category || "General"}
              </span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              {post.description}
            </p>

            {post.recipe && (
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-stone-600 mt-12 border-t border-stone-100 pt-10">
                <div className="flex flex-col items-center">
                  <Timer className="text-orange-600 mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                    Prep Time
                  </span>
                  <span className="font-medium text-stone-900">
                    {formatDuration(post.recipe.prep_time)}
                  </span>
                </div>
                <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
                <div className="flex flex-col items-center">
                  <Clock className="text-orange-600 mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                    Cook Time
                  </span>
                  <span className="font-medium text-stone-900">
                    {formatDuration(post.recipe.cook_time)}
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
            )}
          </div>
        </section>

        {/* Cover Image */}
        {post.images.image_1 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 -mb-8">
            <ResponsiveImage
              src={post.images.image_1}
              alt={post.title}
              aspectRatio="aspect-[16/9]"
              maxHeight="600px"
              minHeight="300px"
            />
          </div>
        )}
        {post.recipe && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 rounded-2xl">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-900">
                  Ingredients You'll Need
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {post.recipe.ingredients.map(
                  (ingredient: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start text-stone-700 pb-3 border-b border-stone-200/50"
                    >
                      <div className="min-w-2 h-2 rounded-full bg-orange-600 mt-2.5 mr-4 flex-shrink-0 shadow-sm"></div>
                      <span className="leading-relaxed text-lg">
                        {ingredient}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </section>
        )}

        {/* Blog Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-stone lg:prose-lg prose-img:rounded-3xl prose-img:shadow-xl prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900 text-stone-800">
          {post.content.map((block: any, index: number) => {
            if (block.type === "paragraph") {
              return (
                <p key={index} className="leading-relaxed mb-6 text-lg">
                  {block.text}
                </p>
              );
            }
            if (block.type === "paragraph_inline") {
              return (
                <p key={index} className="leading-relaxed mb-6 text-lg">
                  {block.chunks.map((chunk: any, c: number) => {
                    if (chunk.type === "link") {
                      return (
                        <Link
                          key={c}
                          href={chunk.url}
                          className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-4 transition-colors font-bold "
                        >
                          {chunk.text}
                        </Link>
                      );
                    }
                    if (chunk.type === "strong") {
                      return (
                        <strong key={c} className="font-bold text-stone-900">
                          {chunk.text}
                        </strong>
                      );
                    }
                    return <span key={c}>{chunk.text}</span>;
                  })}
                </p>
              );
            }
            if (block.type === "heading") {
              const level = block.level || "h2";
              const Tag = level as any;

              const sizeClasses = {
                h2: "text-3xl mt-12 mb-6",
                h3: "text-2xl mt-10 mb-4",
                h4: "text-xl mt-8 mb-4",
              };

              const HeadingContent = block.url ? (
                <Link
                  href={block.url}
                  className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-8 transition-colors inline-flex items-center gap-2 group"
                >
                  {block.text}
                  <span className="text-blue-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
              ) : (
                block.text
              );

              return (
                <Tag
                  key={index}
                  className={`${sizeClasses[level as keyof typeof sizeClasses] || sizeClasses.h2} font-serif font-bold text-stone-900 leading-tight`}
                >
                  {HeadingContent}
                </Tag>
              );
            }
            if (block.type === "list") {
              const Tag = block.style === "numbered" ? "ol" : "ul";
              return (
                <Tag
                  key={index}
                  className={`space-y-4 mb-10 text-lg text-stone-700 ${block.style === "numbered" ? "list-decimal pl-6" : "list-none"}`}
                >
                  {block.items.map((item: any, i: number) => (
                    <li key={i} className="flex items-start">
                      {block.style !== "numbered" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2.5 mr-4 flex-shrink-0" />
                      )}
                      <span className="leading-relaxed">
                        {typeof item === "string"
                          ? item
                          : item.map((chunk: any, c: number) => {
                              if (chunk.type === "link") {
                                return (
                                  <Link
                                    key={c}
                                    href={chunk.url}
                                    className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-4 font-bold"
                                  >
                                    {chunk.text}
                                  </Link>
                                );
                              }
                              if (chunk.type === "strong") {
                                return (
                                  <strong
                                    key={c}
                                    className="font-bold text-stone-900"
                                  >
                                    {chunk.text}
                                  </strong>
                                );
                              }
                              return <span key={c}>{chunk.text}</span>;
                            })}
                      </span>
                    </li>
                  ))}
                </Tag>
              );
            }
            if (block.type === "blockquote") {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-orange-600 pl-8 pt-2 pb-2 my-12 italic text-2xl font-serif text-stone-700 leading-relaxed bg-stone-50/50 pr-8 rounded-r-3xl"
                >
                  {block.text}
                </blockquote>
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
                    <ResponsiveImage
                      src={src}
                      alt="Recipe Content"
                      aspectRatio="aspect-auto"
                    />
                  </div>
                );
              }
            }
            if (block.type === "callout") {
              const variant = (block as any).variant;
              const isWarning = variant === "warning";
              const bgColor = isWarning
                ? "bg-red-50 border-red-200"
                : "bg-orange-50 border-orange-200";
              const titleColor = isWarning ? "text-red-900" : "text-orange-900";
              const Icon = isWarning ? (
                <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-0.5 flex-shrink-0" />
              ) : (
                <Lightbulb className="w-6 h-6 text-orange-600 mr-4 mt-0.5 flex-shrink-0" />
              );

              return (
                <div
                  key={index}
                  className={`my-10 p-6 md:p-8 rounded-3xl border ${bgColor} flex items-start shadow-sm`}
                >
                  {Icon}
                  <div className="flex-grow">
                    <h4
                      className={`font-bold uppercase tracking-widest text-sm mb-4 ${titleColor}`}
                    >
                      {(block as any).title}
                    </h4>
                    {block.content ? (
                      block.content.map((item: any, i: number) => {
                        if (item.type === "paragraph") {
                          return (
                            <p
                              key={`p-${i}`}
                              className="text-stone-800 mb-4 leading-relaxed text-base last:mb-0"
                            >
                              {item.text}
                            </p>
                          );
                        }
                        if (item.type === "paragraph_inline") {
                          return (
                            <p
                              key={`p-inl-${i}`}
                              className="text-stone-800 mb-4 leading-relaxed text-base last:mb-0"
                            >
                              {item.chunks.map((chunk: any, c: number) => {
                                if (chunk.type === "link") {
                                  return (
                                    <Link
                                      key={c}
                                      href={chunk.url}
                                      className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-4 transition-colors font-bold "
                                    >
                                      {chunk.text}
                                    </Link>
                                  );
                                }
                                if (chunk.type === "strong") {
                                  return (
                                    <strong
                                      key={c}
                                      className="font-bold text-stone-900"
                                    >
                                      {chunk.text}
                                    </strong>
                                  );
                                }
                                return <span key={c}>{chunk.text}</span>;
                              })}
                            </p>
                          );
                        }
                        if (item.type === "heading" && item.url) {
                          const Tag = (item.level || "h3") as any;
                          return (
                            <Tag key={`h-${i}`} className="mb-4">
                              <Link
                                href={item.url}
                                className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-8 transition-colors inline-flex items-center gap-2 group text-lg font-bold font-serif"
                              >
                                {item.text}
                                <span className="text-blue-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                                  →
                                </span>
                              </Link>
                            </Tag>
                          );
                        }
                        if (item.type === "list") {
                          const Tag = item.style === "numbered" ? "ol" : "ul";
                          return (
                            <Tag
                              key={`l-${i}`}
                              className={`space-y-3 mb-4 text-base text-stone-800 ${item.style === "numbered" ? "list-decimal pl-6" : "list-none"}`}
                            >
                              {item.items.map((listItem: any, j: number) => (
                                <li key={j} className="flex items-start">
                                  {item.style !== "numbered" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2.5 mr-3 flex-shrink-0" />
                                  )}
                                  <span className="leading-relaxed">
                                    {typeof listItem === "string"
                                      ? listItem
                                      : listItem.map(
                                          (chunk: any, c: number) => {
                                            if (chunk.type === "link") {
                                              return (
                                                <Link
                                                  key={c}
                                                  href={chunk.url}
                                                  className="text-blue-600 hover:text-blue-700 underline decoration-blue-600/30 underline-offset-4 font-bold"
                                                >
                                                  {chunk.text}
                                                </Link>
                                              );
                                            }
                                            if (chunk.type === "strong") {
                                              return (
                                                <strong
                                                  key={c}
                                                  className="font-bold text-stone-900"
                                                >
                                                  {chunk.text}
                                                </strong>
                                              );
                                            }
                                            return (
                                              <span key={c}>{chunk.text}</span>
                                            );
                                          },
                                        )}
                                  </span>
                                </li>
                              ))}
                            </Tag>
                          );
                        }
                        return null;
                      })
                    ) : block.items ? (
                      block.items.map((item: any, i: number) => {
                        // Fallback for previous scrapes that temporarily used 'items'
                        if (item.type === "paragraph")
                          return (
                            <p
                              key={`p-${i}`}
                              className="text-stone-800 mb-3 leading-relaxed text-lg last:mb-0"
                            >
                              {item.text}
                            </p>
                          );
                        return null;
                      })
                    ) : (
                      <p className="text-stone-800 m-0 leading-relaxed text-lg">
                        {(block as any).text}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </article>

        {/* Recipe Card / Ingredients & Instructions */}
        {post.recipe && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
            <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-14 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 text-stone-900"></div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-stone-200 pb-6">
                  <h2 className="text-4xl font-serif font-bold text-stone-900">
                    The Recipe
                  </h2>
                  <PrintButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-stone-900 mb-8 uppercase tracking-widest text-orange-600">
                      Instructions
                    </h3>
                    <ol className="space-y-10">
                      {post.recipe.instructions.map(
                        (instruction: string, i: number) => (
                          <li key={i} className="flex group max-w-4xl">
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
        )}
      </main>
      <Footer />
    </div>
  );
}
