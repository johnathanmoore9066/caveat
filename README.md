# Caveat

A plain-English contract reader. Paste a contract or upload a PDF and get a
friendly breakdown of who it benefits, what you're signing, and the red flags
worth a second look. Works for leases, employment offers, freelance agreements,
NDAs, phone plans, financing, terms of service, and more.

Built with Next.js (App Router) + TypeScript + Tailwind, using the Anthropic API
(`claude-opus-4-8`).

## Quick start

```bash
npm install
cp .env.example .env.local      # then paste your ANTHROPIC_API_KEY into it
npm run dev                      # http://localhost:3000
```

## How it works

- **`app/page.tsx`** — landing page with the company search + the analyzer.
- **`components/Analyzer.tsx`** — paste/upload UI; reads files in the browser and
  posts to the API.
- **`app/api/analyze/route.ts`** — server endpoint; calls the AI and saves any
  red flags to the searchable store.
- **`lib/anthropic.ts`** — the prompt + structured-output call to Claude.
- **`lib/db.ts`** — file-backed store for the searchable red-flag database.
- **`config/site.ts`** — brand, pricing, and contact in one place.

## Selling / handing this off

Everything that changes on sale is documented in **[TRANSFER.md](./TRANSFER.md)**.
Short version: edit `config/site.ts` for branding, swap the `ANTHROPIC_API_KEY`
environment variable, and point your domain at the host.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com). Set
`ANTHROPIC_API_KEY` and `DATABASE_URL` in the project's environment variables.

> **Database:** the red-flag store uses hosted Postgres (Neon) when `DATABASE_URL`
> is set, and a local JSON file when it isn't. Local dev needs no database;
> production needs `DATABASE_URL`. The table is created automatically. See
> TRANSFER.md §5.

## Disclaimer

Caveat produces plain-English summaries to help people understand documents. It
is **not legal advice** and not a substitute for a lawyer.
