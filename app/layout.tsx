import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Ambient aurora lights + fading grid, fixed behind everything. */}
        <div aria-hidden className="fx">
          <div className="fx-grid" />
          <div className="fx-blob fx-1" />
          <div className="fx-blob fx-2" />
          <div className="fx-blob fx-3" />
        </div>

        <header className="sticky top-0 z-40 border-b border-white/5 bg-paper/60 backdrop-blur-xl">
          <div className="wrap flex items-center justify-between py-4">
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              {siteConfig.name}
              <span className="text-aurora">✦</span>
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

        <footer className="mt-20 border-t border-white/5">
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
