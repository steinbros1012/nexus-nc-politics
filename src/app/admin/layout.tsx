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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Opinions", href: "/admin/opinions", icon: MessageSquare },
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
      <aside className="w-56 bg-gray-900 text-white shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">
            Admin Panel
          </h2>
        </div>
        <nav className="p-2">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded text-sm no-underline transition-colors",
                  active
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2.5 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-800 w-full mt-4"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</div>
    </div>
  );
}
