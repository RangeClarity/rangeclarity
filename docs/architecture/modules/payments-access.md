# Module: Payments / Access

> Living architecture doc — **documentation only**. **Do not touch payment/Lemon** (hard guardrail).
> Index: [system-map](../system-map.md) · [registry](../module-registry.md).

## Purpose
Provider-agnostic checkout + beta signup/grant + access state. Money and access live here, isolated from
everything else.

## Public interface
`lib/payments/index.ts` (provider selector) → `lib/payments/providers/{manual,lemonsqueezy,paddle,stripe,whop}.ts`;
`lib/payments/plans.ts` · `lib/payments/types.ts`; the `app/beta/**` flow; `lib/betaStore.ts` ·
`lib/betaSupabaseAdmin.ts` · `lib/freeAccessStore.ts`; Supabase migrations under `supabase/migrations/`.

## Hidden complexity
The provider abstraction; env-driven provider selection (`manual` default; `LEMONSQUEEZY_*` if enabled);
beta signup capture + admin grant; Supabase access state; the access-granted email; **live links live in
env / Vercel, never committed**.

## Owns
Checkout providers · beta signup/grant · access state.

## Must not own
Scoring · research · Pine.

## Subfunctions
Provider modules · `betaStore` (`normalizeEmail` / `normalizeTvUsername`) · `betaSupabaseAdmin`
(`list` / `get` / `grant` / `recordGrantEmail`) · `notifyAdminEmail`.

## Dependencies
Supabase · env config · `lib/analytics.ts`. Web UI renders this module's flow.

## Dependent modules
Web UI (the beta pages).

## Current leaks
Provider files are broad but **isolated** under `lib/payments` (good). The only discipline point: every
pricing / CTA / compliance block must carry the *"structure & context tools only — no signals, not financial
advice"* line.

## Risk level
**MEDIUM.** Money + access; isolated, but a mistake is costly. Frozen by guardrail this task.

## Tests required
Typecheck / lint · `betaStore` unit tests (`normalizeEmail` / `normalizeTvUsername`) · never commit live links.

## Agent / skill to use
`/module-awareness Payments` · `/grill-me` before any payment idea — "touch payment/Lemon?" answers **No**.

## Next approved task
**NONE** (do-not-touch this task). Founder action only: confirm live checkout links are set in env / Vercel
(see `founder-decision-queue`).

## Blocked work
All payment/Lemon behavior changes — blocked per guardrails. Stripe **live mode** — needs explicit founder approval.
