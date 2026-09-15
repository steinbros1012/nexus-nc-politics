import Link from "next/link";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";

export default function Footer() {
  return (
    <footer className="bg-header-bg text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              {PUBLICATION_NAME}
            </h3>
            <p className="text-sm leading-relaxed">
              Comprehensive coverage of North Carolina politics, policy, and
              government. Aggregating news from across the state to keep you
              informed.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Sections
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/politics"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Politics
                </Link>
              </li>
              <li>
                <Link
                  href="/elections"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Elections
                </Link>
              </li>
              <li>
                <Link
                  href="/legislature"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Legislature
                </Link>
              </li>
              <li>
                <Link
                  href="/government"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Government
                </Link>
              </li>
              <li>
                <Link
                  href="/opinion"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              About
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-opinion"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Submit an Opinion
                </Link>
              </li>
              <li>
                <Link
                  href="/letters"
                  className="hover:text-white transition-colors no-underline text-gray-400"
                >
                  Letters to the Editor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Stay Informed
            </h4>
            <p className="text-sm mb-3">
              Get the latest NC political news delivered to your inbox.
            </p>
            <Link
              href="/search"
              className="text-sm hover:text-white transition-colors no-underline text-gray-400"
            >
              Search Articles
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} {PUBLICATION_NAME}. A product of
            Nexus Strategies. All rights reserved.
          </p>
          <p className="mt-2 text-gray-500">
            {PUBLICATION_NAME} aggregates news from multiple sources. Original
            content remains the property of its respective publishers.
          </p>
        </div>
      </div>
    </footer>
  );
}
