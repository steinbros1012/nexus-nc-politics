"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Rss,
  Activity,
  LogOut,
  Mail,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Opinions", href: "/admin/opinions", icon: MessageSquare },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Sources", href: "/admin/sources", icon: Rss },
  { label: "Ingestion", href: "/admin/ingestion", icon: Activity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: "#0a0f1e" }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#b91c1c] flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-black tracking-tight">NC</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">NC Politics Now</p>
              <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm no-underline transition-all group",
                  active
                    ? "bg-white/10 text-white font-semibold"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={cn("w-4 h-4", active ? "text-white" : "text-white/30 group-hover:text-white/60")} />
                  {item.label}
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/5 no-underline transition-colors mb-1"
          >
            <Newspaper className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400 hover:bg-white/5 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-[#f4f6f9] p-8 overflow-auto min-h-0">{children}</div>
    </div>
  );
}
