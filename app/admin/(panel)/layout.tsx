import AdminSidebar from "./admin-sidebar";
import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-20 shrink-0 bg-white border-b border-border flex items-center justify-between px-8 lg:px-12 sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-3">
            <Button variant="ghost" render={<Link href="/" target="_blank" />}>
                <ExternalLink size={16} />
                View Site
              </Button>
            <form action={logout}>
              <Button type="submit" variant="ghost">
                <LogOut size={16} />
                Sign Out
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-8 lg:px-12 py-10">{children}</main>
      </div>
    </div>
  );
}