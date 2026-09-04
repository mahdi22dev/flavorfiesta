"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Images, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/admin/media", label: "Media", icon: Images },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-border flex flex-col min-h-screen sticky top-0 h-screen">
      <div className="px-5 pt-7 pb-5 border-b border-border">
        <Link href="/admin">
          <span className="font-serif font-bold text-stone-900 text-xl">
            CUT<span className="text-orange-600">&</span>SEAR
          </span>
        </Link>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3.5 py-3 rounded-lg text-[15px] font-medium transition-colors",
              isActive(href)
                ? "bg-orange-600/10 text-orange-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon size={19} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-5 border-t border-border space-y-2">
        <Button className="w-full" render={<Link href="/admin/recipes/new" />}>
            <Plus size={16} />
            New Recipe
          </Button>
      </div>
    </aside>
  );
}