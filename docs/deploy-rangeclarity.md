# Deploying RangeClarity to rangeclarity.com

This guide takes the existing landing page (unchanged) live on **https://rangeclarity.com**. The app is **Next.js 15 (App Router)** with one dynamic API route, so the recommended host is **Vercel** (zero-config for Next.js). Netlify/VPS notes are included at the end.

> Nothing here changes the design, copy, or which page is the homepage. It only adds SEO files, env documentation, and deployment steps.

---

## 1. Run locally

```bash
cd RangeClarity
npm install
npm run dev      # http://localhost:3000
```

Requires **Node 20+** (`.nvmrc` pins it; check with `node -v`).

## 2. Build (production)

```bash
npm run build    # next build — must finish with no errors
npm run start    # serves the production build at http://localhost:3000
```

Also useful:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

If `npm run build` fails, fix the reported file and re-run. Do **not** deploy a build that doesn't pass locally.

## 3. Deploy to Vercel (recommended)

Next.js + a dynamic API route = Vercel, zero config. No `vercel.json` is required; Vercel auto-detects the framework, build command (`next build`), and output.

**First-time setup (dashboard — easiest):**
1. Push the repo to GitHub/GitLab/Bitbucket (or use the Vercel CLI, below).
2. Go to vercel.com → **Add New… → Project** → import the RangeClarity repo.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`, install `npm install`, output auto. Leave defaults.
4. **Environment variables:** none required. (Add any from `.env.example` only if/when you wire a hosted waitlist store.)
5. Click **Deploy**. You'll get a `*.vercel.app` preview URL — verify it (see §6) **before** attaching the domain.

**Or via CLI:**
```bash
npm i -g vercel
vercel            # first run: links/creates the project, deploys a PREVIEW
# verify the preview URL, then when you approve:
vercel --prod     # promotes to production
```

> ⚠️ Do not run `vercel --prod` until you've reviewed the preview and approved. This guide stops short of the production deploy.

## 4. Connect rangeclarity.com

In **Vercel → Project → Settings → Domains**:
1. Add `rangeclarity.com`.
2. Add `www.rangeclarity.com`.
3. Set **`rangeclarity.com` as the primary domain** and let Vercel **redirect `www` → root** (Vercel offers this toggle automatically when you add both). Root-as-primary is the cleaner choice for a brand domain.

### DNS records to add at your domain registrar

Use **whichever Vercel shows you on the Domains screen** — values can vary by account. The standard Vercel records are:

| Host / Name | Type | Value | Purpose |
|---|---|---|---|
| `@` (root) | `A` | `76.76.21.21` | Points rangeclarity.com to Vercel |
| `www` | `CNAME` | `cname.vercel-dns.com` | Points www to Vercel |

Notes:
- If your registrar supports **ALIAS/ANAME at the root**, you may instead point `@` to `cname.vercel-dns.com` (better than an A record because Vercel can change IPs). Use this if offered.
- Remove any conflicting old `A`/`CNAME`/parking records for `@` and `www` (note them first so you can roll back).
- DNS propagation is usually minutes but can take up to 24–48h.

### Alternative: keep DNS at your registrar vs. use Vercel nameservers
- **Records only (recommended):** add the A/CNAME above; keep your registrar's nameservers.
- **Vercel nameservers:** point the domain's nameservers to Vercel's (shown in the dashboard) and Vercel manages everything. Simpler but moves all DNS to Vercel.

## 5. HTTPS / SSL checklist

- Vercel issues and renews **Let's Encrypt SSL automatically** once DNS resolves — no action needed.
- In Domains, confirm each shows **"Valid Configuration"** and a padlock.
- Confirm **HTTP → HTTPS** is automatic (Vercel forces HTTPS by default).
- Confirm **www → root** redirect works (or root → www if you chose that).
- After SSL is live, consider enabling **HSTS** (Vercel → Settings, optional).
- `metadataBase` is already set to `https://rangeclarity.com`, so OG/canonical URLs resolve correctly.

## 6. Verify the deployment

Open the production URL and check:
- `https://rangeclarity.com` loads the landing page (design intact, animations, responsive).
- `https://www.rangeclarity.com` redirects to the root (or your chosen primary).
- `http://rangeclarity.com` redirects to `https://`.
- `https://rangeclarity.com/robots.txt` returns rules + sitemap line.
- `https://rangeclarity.com/sitemap.xml` lists the homepage.
- `https://rangeclarity.com/opengraph-image` renders the share image; favicon shows in the tab.
- Paste the URL into a link-preview tester (e.g. social debuggers) to confirm OG title/description/image.
- DevTools console shows **no errors**; test on a phone for responsiveness.
- The waitlist form submits (see caveat below).

## 7. Waitlist persistence caveat (important)

The form at `/api/waitlist` writes to a local file (`.data/waitlist.jsonl`). **On Vercel this will not persist** — the serverless filesystem is ephemeral/read-only, so the endpoint will return a graceful error and signups won't be saved.

Before relying on signups, do one of:
1. Replace `addEntry()` in `lib/waitlist.ts` with a hosted store/ESP (Vercel KV or Postgres, Supabase, Airtable, ConvertKit, Mailchimp) — this is the single integration point; callers don't change.
2. Or host on a VPS with a writable disk and set `WAITLIST_FILE` to a persistent path.

Document any provider keys as placeholders in `.env.example` and set the real values in Vercel's Environment Variables (never in the repo).

## 8. Rollback plan

- **Vercel instant rollback:** Project → **Deployments** → pick the previous good deployment → **Promote to Production** (or "Rollback"). Traffic switches back immediately; the prior build is always retained.
- **Domain rollback:** if DNS was wrong, restore the previous records you noted in §4. Keep a copy of the old DNS zone before changing it.
- **Code rollback:** revert the commit and redeploy, or just promote the last-known-good deployment (faster).
- Because production is only promoted on `vercel --prod` (or a merge to the production branch), preview deploys never affect the live domain.

---

## Netlify / VPS (only if you are not using Vercel)

- **Netlify:** works via the official Next.js runtime. Build `next build`, and use the Netlify Next plugin (Netlify adds it automatically on import). DNS: `A`/`ALIAS` to Netlify's load balancer + `CNAME www → <site>.netlify.app` (use values Netlify shows). The waitlist caveat still applies (functions are ephemeral).
- **VPS (e.g. Node + Nginx):** `npm run build` then `npm run start` behind a reverse proxy; point `A`/`AAAA` records at the server IP, terminate SSL with Let's Encrypt (certbot). This is the only target where file-based `WAITLIST_FILE` persists.

---

## Pre-deploy checklist

- [ ] `npm run build` passes locally with no errors
- [ ] `npm run typecheck` and `npm run lint` clean
- [ ] No console errors in the browser
- [ ] Mobile responsive (test ~375px and tablet widths)
- [ ] All buttons / nav links work
- [ ] CTA / waitlist form submits (and you understand the persistence caveat, §7)
- [ ] Favicon appears in the browser tab
- [ ] SEO: title + meta description present (view source / share preview)
- [ ] `robots.txt` and `sitemap.xml` resolve
- [ ] OG image renders in a social link preview
- [ ] Preview deployment reviewed and approved
- [ ] Domain added in host; DNS records entered exactly as the host shows
- [ ] `www` ↔ root redirect works
- [ ] HTTPS works and is forced; certificate valid
- [ ] Rollback path confirmed (previous deployment available to promote)
