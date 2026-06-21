import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import "./globals.css";

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
    <html lang="en">
      <body>
        <header className="border-b border-line">
          <div className="wrap flex items-center justify-between py-5">
            <Link href="/" className="display text-xl font-semibold">
              {siteConfig.name}
              <span className="align-middle text-flag">.</span>
            </Link>
            <nav className="flex items-center gap-5 font-sans text-sm text-muted">
              <Link href="/" className="hover:text-ink">
                Analyze
              </Link>
              <Link href="/about" className="hover:text-ink">
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-10 sm:py-14">{children}</main>

        <footer className="mt-16 border-t border-line">
          <div className="wrap flex flex-col gap-2 py-8 font-sans text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. A plain-English
              summary tool — <span className="text-ink/70">not legal advice.</span>
            </p>
            <Link href="/about" className="hover:text-ink">
              Disclosures
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
