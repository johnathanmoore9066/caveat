import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Newsreader } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <body>
        <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/75 backdrop-blur-md">
          <div className="wrap flex items-center justify-between py-4">
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              {siteConfig.name}
              <span className="text-flag">.</span>
            </Link>
            <nav className="flex items-center gap-7 font-sans text-sm text-muted">
              <Link href="/" className="navlink">
                Analyze
              </Link>
              <Link href="/about" className="navlink">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-12 sm:py-16">{children}</main>

        <footer className="mt-20 border-t border-line">
          <div className="wrap py-10">
            <div className="rule-mark mb-7" />
            <div className="flex flex-col gap-2 font-sans text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {siteConfig.name}. A plain-English
                summary tool —{" "}
                <span className="text-ink/70">not legal advice.</span>
              </p>
              <Link href="/about" className="navlink">
                Disclosures
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
