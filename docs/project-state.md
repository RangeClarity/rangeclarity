# Project State — RangeClarity

Factual snapshot for planning. Evidence in `code/commit` form. Owned topics live elsewhere: tickets → `docs/kanban.md`; readiness → `docs/launch-readiness.md`; decisions → `docs/decisions.md`.

_Last verified: 2026-06-18 · HEAD `4297974` (origin/main)._

## Confirmed (with evidence)
- **Core indicator exists.** `RangeClarity_Core.pine` — 465 lines, `@version=6`, `indicator("RangeClarity Core - Market Map")`; 19 inputs, 19 visuals, no TODO/placeholder, no obvious lookahead/repaint in source. This is the deliverable customers would pay for.
- **Landing site builds and is type-clean.** Next.js 15 App Router + React 19 + TS 5; `npm run typecheck` passes (exit 0). Live homepage = `premium-hero-range-command-v2` ("Codex Premium Hero"); `app/page.tsx` re-exports it.
- **Design selector + routes present.** `app/designs/` with `previous-pro`, `premium-fintech`, `range-command-v2`, etc. (commit `f75aece`).
- **Deploy prep done (not deployed).** `app/icon.svg`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, `docs/deploy-rangeclarity.md`. Zero-config Vercel; no `vercel.json`.
- **Basic legal disclaimers present.** `app/terms/page.tsx` (Educational Use Only, risk), `app/privacy/page.tsx` (Financial Disclaimer) — but worded around "waitlist."
- **Linear bridge ready, read-only.** `scripts/hermes/linear/`; team `DEA` reachable; no RangeClarity project yet; no writes.

## Partial
- **Indicator validation:** the test plan `RANGECLARITY_PINE_TEST_PLAN.md` exists but its coverage matrix is **empty** — the indicator is built but **not validated/recorded** on real charts.
- **Pricing UI exists but is static** mockups only (`components/PricingSection.tsx`, design `data.ts`) — no real price wired to a checkout.
- **Build:** `next build` (full prod build) not yet run/verified; only `typecheck` is green.

## Missing
- **No payment path.** No Stripe/Whop integration anywhere (`grep` of `app/lib/components` finds only static pricing UI).
- **No authentication / accounts / entitlements.** None in the codebase.
- **No working conversion path on the live page.** The "Join Early Access" form submits to `action="#"` (the functional `WaitlistForm`→`/api/waitlist` is only wired on the archived `meme-fintech` design).
- **No analytics / customer-support path** wired.
- **No RangeClarity project in Linear** (only Taskoza / Hermes Agent OS / FolioVantage).

## Blocked / decisions-gated
- Final offer + price (O-002) blocks the CTA and Whop product.
- Paid Beta mechanics (O-001) gate whether any in-app payment/auth work is even in scope (recommended: not for the first 5).

## Known documentation conflicts (see review §4)
- `README.md` says "the TradingView Starter indicator and Pro product are not built yet" — **contradicted** by `RangeClarity_Core.pine` (built 2026-06-17).
- `RANGECLARITY_PINE_TEST_PLAN.md` validates `pine/rangeclarity_ultimate_core.pine`, but the root file is `RangeClarity_Core.pine` — **which Pine file is canonical is ambiguous.**
- `PROJECT_HANDOFF.md` (2026-06-14) says "No production code, no landing page" — stale; the landing page now exists.
- `docs/TASKS.md` still lists "Initialize git" as a to-do — stale (7 commits exist).
