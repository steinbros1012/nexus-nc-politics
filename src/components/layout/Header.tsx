"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, PenLine } from "lucide-react";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "Politics", href: "/politics" },
  { label: "Elections", href: "/elections" },
  { label: "Legislature", href: "/legislature" },
  { label: "Government", href: "/government" },
  { label: "Courts", href: "/courts" },
  { label: "Local", href: "/local" },
  { label: "Opinion", href: "/opinion" },
];

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-header-bg text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white no-underline">
          <h1 className="text-2xl font-bold tracking-tight">
            {PUBLICATION_NAME}
          </h1>
          <p className="text-xs text-gray-400 -mt-1">
            North Carolina Political News &amp; Analysis
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            href="/submit-opinion"
            className="hidden sm:inline-flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors no-underline"
          >
            <PenLine className="w-4 h-4" />
            Submit Opinion
          </Link>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:block border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-0 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors whitespace-nowrap no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-700 bg-header-bg">
          <ul className="divide-y divide-gray-700">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/submit-opinion"
                className="block px-4 py-3 text-sm text-accent font-medium no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Submit Opinion
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
