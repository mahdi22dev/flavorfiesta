import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import {
  Lightbulb,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";

export default async function GuidePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug recieved :", slug);
  // Get host for absolute URL requirement in Server Components fetch
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const response = await fetch(`${protocol}://${host}/api/guides/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound();
  }

  const guide = await response.json();

  // Defensive parsing for JSON strings from D1
  const safeTags = Array.isArray(guide.tags)
    ? guide.tags
    : typeof guide.tags === "string"
      ? JSON.parse(guide.tags)
      : [];

  function ImagePlaceholder({
    alt,
    className = "",
  }: {
    alt: string;
    className?: string;
  }) {
    return (
      <div
        className={`w-full aspect-video rounded-4xl bg-stone-50 border border-dashed border-stone-200 flex flex-col items-center justify-center gap-4 text-stone-300 p-8 ${className}`}
      >
        <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center">
          <Calendar size={32} className="opacity-20" />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1">
            Coming Soon
          </p>
          <p className="text-[10px] font-medium opacity-60 max-w-[200px] leading-relaxed">
            The visual for "{alt}" is currently in our culinary studio.
          </p>
        </div>
      </div>
    );
  }

  function renderCallout(block: any, index: string | number) {
    const variant = block.variant || block.variant_type || "tip";

    let bgColor = "bg-orange-50 border-orange-200";
    let titleColor = "text-orange-900";
    let Icon = (
      <Lightbulb className="w-6 h-6 text-orange-600 mr-4 mt-0.5 shrink-0" />
    );
    let defaultTitle = "Tip";

    if (variant === "warning" || variant === "alert") {
      bgColor = "bg-red-50 border-red-200";
      titleColor = "text-red-900";
      Icon = (
        <AlertCircle className="w-6 h-6 text-red-600 mr-4 mt-0.5 shrink-0" />
      );
      defaultTitle = "Note";
    } else if (variant === "info") {
      bgColor = "bg-blue-50 border-blue-200";
      titleColor = "text-blue-900";
      Icon = <Info className="w-6 h-6 text-blue-600 mr-4 mt-0.5 shrink-0" />;
      defaultTitle = "Info";
    } else if (variant === "success") {
      bgColor = "bg-emerald-50 border-emerald-200";
      titleColor = "text-emerald-900";
      Icon = (
        <CheckCircle className="w-6 h-6 text-emerald-600 mr-4 mt-0.5 shrink-0" />
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

  // Helper to turn slugs into readable titles
  function formatSectionTitle(slug: string) {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header bgColor="bg-white/90" />

      <main className="grow">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
          <ol className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <li>
              <Link
                href="/"
                className="hover:text-orange-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={10} />
            </li>
            <li>
              <Link
                href="/guides"
                className="hover:text-orange-600 transition-colors"
              >
                Guides
              </Link>
            </li>
            <li>
              <ChevronRight size={10} />
            </li>
            <li className="text-stone-900 truncate max-w-[150px]">
              {guide.title}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="pb-16 border-b border-stone-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest">
                {guide.category || "Culinary Guide"}
              </span>
              {Array.isArray(safeTags) && safeTags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  #{tag}
                </span>
              ))}
              <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-widest ml-auto">
                <Calendar size={12} />
                <span>Last Updated 2024</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">
              {guide.title}
            </h1>

            <p className="text-xl text-stone-500 font-medium leading-relaxed max-w-3xl">
              {guide.description}
            </p>
          </div>
        </section>

        {/* Cover Image */}
        {guide.coverImage ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <div className="rounded-4xl overflow-hidden shadow-2xl shadow-stone-200 border border-white">
              <img
                src={guide.coverImage}
                alt={guide.title}
                className="w-full h-auto max-h-[70vh] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <ImagePlaceholder alt={guide.title} />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 py-20">
          {/* Outline / Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-8">
              {(guide.table_of_contents || guide.outline) &&
                (guide.table_of_contents || guide.outline).length > 0 && (
                  <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-6">
                      In This Guide
                    </h3>
                    <nav>
                      <ul className="space-y-4">
                        {(guide.table_of_contents || guide.outline).map(
                          (item: any, i: number) => {
                            let displayTitle = "";
                            let targetId = "";

                            if (typeof item === "string") {
                              const isSlug = item.includes("-");
                              targetId = isSlug ? item : `section-${i}`;
                              displayTitle = isSlug
                                ? formatSectionTitle(item)
                                : item;
                            } else if (item && typeof item === "object") {
                              displayTitle = item.title || "";
                              targetId = item.anchor || `section-${i}`;
                            }

                            return (
                              <li key={i}>
                                <a
                                  href={`#${targetId}`}
                                  className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors block leading-tight"
                                >
                                  {displayTitle}
                                </a>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </nav>
                  </div>
                )}

              <div className="bg-orange-600 rounded-3xl p-8 text-white">
                <h3 className="text-lg font-serif font-bold mb-3">
                  Newsletter
                </h3>
                <p className="text-orange-100 text-xs leading-relaxed mb-6">
                  Master technical cooking with our weekly deep-dives.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-orange-700 border-none rounded-xl px-4 py-3 text-xs placeholder:text-orange-300 focus:ring-2 focus:ring-white/20"
                  />
                  <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Table of Contents / Outline Section */}
            <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900 prose-a:text-sky-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
              {guide.content && guide.content.length > 0 ? (
                guide.content.map((block: any, index: number) => {
                  if (block.type === "paragraph") {
                    return (
                      <p
                        key={index}
                        className="leading-relaxed mb-6 text-stone-700"
                        dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                    );
                  }
                  if (block.type === "heading") {
                    // Try to match the block text against table_of_contents or use anchor if provided
                    const toc = guide.table_of_contents || [];
                    const outline = guide.outline || [];
                    const sectionId = outline.indexOf(block.text);

                    // Priority: block.anchor -> table_of_contents match -> index-based section
                    let finalId = block.anchor;
                    if (!finalId && sectionId !== -1) {
                      const tocItem = toc[sectionId];
                      if (tocItem && typeof tocItem === "object") {
                        finalId = tocItem.anchor;
                      } else if (typeof tocItem === "string") {
                        finalId = tocItem;
                      } else {
                        finalId = `section-${sectionId}`;
                      }
                    }

                    return (
                      <h2
                        key={index}
                        id={finalId}
                        className="text-3xl font-serif font-bold text-stone-900 mt-16 mb-8 scroll-mt-28"
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "image") {
                    const src =
                      block.src ||
                      (block.reference && guide.images?.[block.reference]);
                    if (src) {
                      return (
                        <div key={index} className="my-14 relative group">
                          <img
                            src={src}
                            alt={block.alt || "Guide illustration"}
                            className="w-full h-auto rounded-4xl shadow-xl border border-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          {block.caption && (
                            <p className="mt-4 text-center text-xs text-stone-400 font-medium italic">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="my-14">
                        <ImagePlaceholder
                          alt={
                            block.alt || block.reference || "Guide illustration"
                          }
                        />
                        {block.caption && (
                          <p className="mt-4 text-center text-xs text-stone-400 font-medium italic">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  }
                  if (block.type === "callout") {
                    return renderCallout(block, index);
                  }
                  if (block.type === "list") {
                    const ListTag = block.style === "ordered" ? "ol" : "ul";
                    return (
                      <ListTag
                        key={index}
                        className={`my-10 space-y-4 ${block.style === "ordered" ? "list-decimal pl-8" : "list-disc pl-8"} text-stone-700 font-medium`}
                      >
                        {block.items.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="pl-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        ))}
                      </ListTag>
                    );
                  }
                  if (block.type === "divider") {
                    return (
                      <div
                        key={index}
                        className="my-20 flex items-center justify-center gap-6"
                      >
                        <div className="h-px w-16 bg-stone-100" />
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                        <div className="h-px w-16 bg-stone-100" />
                      </div>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={index}
                        className="my-16 border-l-4 border-orange-500 pl-10 py-4 italic font-serif text-3xl text-stone-500 leading-relaxed bg-stone-50/50 rounded-r-3xl"
                      >
                        "{block.text}"
                        {block.author && (
                          <footer className="mt-6 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-stone-400 not-italic">
                            — {block.author}
                          </footer>
                        )}
                      </blockquote>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="py-20 text-center">
                  <p className="text-xl text-stone-400 italic">
                    Detailed guide content is currently being processed. Check
                    back soon!
                  </p>
                </div>
              )}
            </div>

            {/* Guide footer info */}
            <div className="mt-20 pt-10 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                    Author
                  </h4>
                  <p className="text-sm font-bold text-stone-900 font-serif italic">
                    The Savory Bites Culinary Team
                  </p>
                </div>
                <div className="flex gap-4">
                  {/* Social buttons placeholder */}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
