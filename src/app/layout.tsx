import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";
const PUBLICATION_TAGLINE =
  process.env.NEXT_PUBLIC_PUBLICATION_TAGLINE || "North Carolina Political News";

export const metadata: Metadata = {
  title: {
    default: `${PUBLICATION_NAME} - ${PUBLICATION_TAGLINE}`,
    template: `%s | ${PUBLICATION_NAME}`,
  },
  description: `${PUBLICATION_NAME} aggregates and curates political news from across North Carolina. Stay informed on elections, legislation, government, and policy.`,
  openGraph: {
    type: "website",
    siteName: PUBLICATION_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
