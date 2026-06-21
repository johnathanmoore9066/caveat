# Transfer Checklist — selling / handing off this project

This file is the single source of truth for everything that must change when the
site changes hands. Work top to bottom. Nothing secret lives in the codebase —
secrets are all environment variables.

## 1. Branding & copy — `config/site.ts`

Open `config/site.ts` and update:

- `name` — the brand name shown everywhere.
- `tagline`, `description` — hero copy.
- `domain` — your domain (no `https://`).
- `contactEmail` — where support and disclosure emails go.
- `operator` — the person or company operating the site (shown on the About page).
- `pricing.readPrice` / `pricing.searchPrice` — what you charge. Set `readPrice`
  to `0` to run everything free.
- `documentTypes` — the dropdown options, if you want to add/remove any.

That one file drives the entire UI. No other code edits are needed to rebrand.

## 2. Secrets — environment variables (NEVER in code)

Set these in `.env.local` for local dev, and in your host's dashboard
(e.g. Vercel → Project → Settings → Environment Variables) for production:

| Variable | Required? | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Your Anthropic key. The previous owner's key must be removed; add your own. |
| `DATABASE_URL` | Production | Your own Neon (or any Postgres) connection string. The seller's must be removed; create your own free project at neon.tech. |
| `STRIPE_SECRET_KEY` | Only for paid reads | From your own Stripe account. |
| `STRIPE_WEBHOOK_SECRET` | Only for paid reads | From your own Stripe webhook. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Only for paid reads | From your own Stripe account. |

**When you take over:** the seller rotates/deletes their `ANTHROPIC_API_KEY`,
you generate a brand-new one in your own Anthropic account and paste it in. The
key is never stored in the repo, so there is nothing to scrub from the code.

## 3. Domain

- Buy a domain at any registrar. Point it at your host (Vercel makes this a
  couple of clicks).
- Update `domain` in `config/site.ts`.
- Note: a freshly registered domain has a 60-day ICANN transfer lock before it
  can move to another registrar — fine for normal use, just relevant if you plan
  to resell.

## 4. Payments (turning on paid reads)

Payments are **off by default** so the app runs out of the box. To charge:

1. Create a Stripe account and add the three Stripe env vars above.
2. Implement the gate marked `── PAYMENT GATE ──` in
   `app/api/analyze/route.ts` (verify the payment, return HTTP 402 if unpaid).
3. Add a Stripe Checkout flow on the front end. The price comes from
   `siteConfig.pricing`.

## 5. The red-flag database

`lib/db.ts` uses **hosted Postgres (Neon) when `DATABASE_URL` is set**, and
falls back to a local JSON file (`data/flags.json`) when it isn't — so local dev
needs no setup, and production just needs the env var.

To set up production storage:

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string (it looks like `postgresql://user:pass@host/db`).
3. Put it in `DATABASE_URL` locally (`.env.local`) and in your host's env vars.

The table (`flag_records`) is created automatically on first use — no manual
migration. Any standard Postgres works (Supabase, Vercel Postgres, RDS, etc.);
only the connection string changes. The app depends solely on the two exported
functions `saveFlags()` / `searchFlags()`.

## 6. Legal

- Review the About / disclosures page (`app/about/page.tsx`) and make sure the
  "not legal advice" language fits your jurisdiction.
- Consider having a lawyer review your Terms of Service and Privacy Policy
  before charging money.
