# Module: Web UI

> Living architecture doc — **documentation only**. No behavior/scoring/Pine/payment change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md).

## Purpose
Explain and sell RangeClarity clearly. The website is **marketing + access**; it never originates a verdict.

## Public interface
- **Target:** `displayVerdict(verdict)` + static marketing pages + the beta / free-access flow.
- **Public routes:** `app/page.tsx` (Fox homepage) · `app/beta/**` · `app/privacy` · `app/terms` ·
  `app/indicator-guide` · `app/tradingview-setup`.
- **Gated / experimental (must 404 in production):** `app/designs` · `app/range-command-premium` ·
  `app/variant-codex-section` · `app/linear-board` · `app/project-plan` · `app/command-center` · `app/ops`.

## Hidden complexity
Next.js app router; CSS modules; the analytics wrapper (`lib/analytics.ts`: Vercel + Clarity); sticky mobile
CTA; the mobile fox brand band; `notFound()` gating of internal/experimental routes; copy-compliance.

## Owns
Landing · mobile UI · CTAs · product copy · public pages · internal ops/command-center pages.

## Must not own
Scoring internals · research · raw labels · Pine logic.

## Subfunctions
Page components · `app/_components/*` · `StickyCtaBar` · analytics events · `BetaSignupForm` ·
`FreeAccessForm` · `GrantConsole`.

## Dependencies
Payments / Access (checkout config, beta store) · `lib/analytics.ts` · `lib/affiliate.ts`.

## Dependent modules
None above it — Web UI is a **top consumer** (a verdict comes in; nothing depends on the web layer).

## Current leaks
Verdict wording is **re-authored** in copy (and in Pine) with no shared schema — there is no
`displayVerdict` contract yet, so the same concept is phrased independently in three places.

## Risk level
**LOW–MEDIUM.** Brand/compliance risk lives in copy; structurally the web is cleanly decoupled from the
Python scoring core (good — keep it that way).

## Tests required
Copy guardrail (`npm run test`: no `buy/sell/entry/exit/profit/prediction` directive language on public
pages) · Playwright smoke (`test:e2e`: public pages load + key copy + no console errors; gated routes 404).

## Agent / skill to use
The `landing-page-qa` prompt · `/module-awareness Web UI`.

## Next approved task
None new — **web QA and web commits are paused** until branch/workspace drift is resolved (see project
memory). Keep the copy guardrail green.

## Blocked work
Web commits paused until workspace drift resolved · homepage / beta redesign is **do-not-touch** during ops work.
