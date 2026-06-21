# Deploying Caveat (free, on Vercel)

This stack (Next.js + API routes + Postgres) needs a host that runs a server —
so **GitHub Pages and shared cPanel hosting won't work**. Vercel's free Hobby
tier is the right fit: it runs the API routes, keeps your keys secret, and
connects a custom domain — all for $0. Total time: ~10 minutes.

> Note: Vercel Hobby is for non-commercial use. While Caveat is free-to-use
> ("free while in testing"), you're fine. When you start charging, upgrade to
> Pro ($20/mo).

## 1. Put the code on GitHub

A git repo is already initialized with a first commit. Create an empty repo on
GitHub (no README), then push:

```bash
cd C:\Users\johna\Projects\caveat
git remote add origin https://github.com/<your-username>/caveat.git
git push -u origin main
```

## 2. Create the database (Neon — free)

1. Sign up at https://neon.tech and create a project.
2. Copy the connection string (looks like `postgresql://user:pass@host/dbname`).
   Keep it handy for step 3. The table is created automatically on first use.

## 3. Deploy on Vercel

1. Sign up at https://vercel.com with your GitHub account.
2. **Add New → Project**, import the `caveat` repo. Vercel auto-detects Next.js —
   don't change the build settings.
3. Before clicking Deploy, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `DATABASE_URL` = the Neon connection string from step 2
4. Click **Deploy**. In ~2 minutes you'll get a live `*.vercel.app` URL. Open it
   and run a test document to confirm everything works end to end.

## 4. Point projectcaveat.org at it

1. In the Vercel project: **Settings → Domains → Add** `projectcaveat.org`
   (and `www.projectcaveat.org`).
2. Vercel shows you the DNS records to set. In your Namecheap dashboard:
   **Domain List → Manage → Advanced DNS**, and add the records Vercel gave you
   (typically an `A` record for the root and a `CNAME` for `www`).
3. DNS can take anywhere from a few minutes to a few hours. Vercel issues the
   HTTPS certificate automatically once it sees the records.

## 5. (Optional) Email forwarding

The disclosures page lists `hello@projectcaveat.org`. To actually receive mail
there, set up free email forwarding in Namecheap (**Domain List → Manage →
… → Redirect Email / free email forwarding**) pointing it to your inbox.

## Updating the site later

Any time you push to the `main` branch on GitHub, Vercel rebuilds and redeploys
automatically. No manual step.
