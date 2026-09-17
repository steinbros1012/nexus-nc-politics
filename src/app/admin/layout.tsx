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
      <aside className="w-56 bg-[#0f172a] text-white shrink-0">
        <div className="px-4 py-4 border-b border-white/10">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-500">
            Admin Panel
          </h2>
        </div>
        <nav className="p-2 space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm no-underline transition-colors",
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-gray-50/80 p-8 overflow-auto">{children}</div>
    </div>
  );
}
