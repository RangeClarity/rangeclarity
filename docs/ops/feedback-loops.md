# RangeClarity Feedback Loops (local quality gates)

Fast local gates so problems are caught in seconds, before they reach git or users. These change **no
product behavior** — they only inspect. The point is to protect RangeClarity's #1 risk: shipping
**false confidence** (signal/prediction language, or invalid research labels).

## Commands

| command | what it checks | needs install? | speed |
|---|---|---|---|
| `npm run typecheck` | TypeScript types (`tsc --noEmit`) across the app. Catches type + import breakage. | no | ~seconds |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`). Catches style/rule issues. | no | ~seconds |
| `npm run test` | **Dependency-free gate** (`scripts/test/run-tests.mjs`): (1) **copy guardrail** — public pages must not use `buy/sell/entry/exit/profit/prediction` as directive (un-negated, non-educational) language, and no banned CTA phrases; (2) **label-schema guardrail** — every `founder_label` in the review CSVs is one of the 5 allowed values. | no | <1s |
| `npm run health` | `typecheck` → `lint` → `test`. **The fast local gate — run before small changes.** No build. | no | ~seconds |
| `npm run verify` | `health` → `build`. **The full gate — run before deploy / major handoff.** | no (build is slow) | ~1–3 min |
| `npm run test:unit` | Vitest unit tests (pure logic, e.g. `lib/betaStore` `normalizeEmail`/`normalizeTvUsername`). | **yes** (see setup) | ~seconds |
| `npm run test:e2e` | Playwright browser smoke: `/`, `/beta`, `/privacy`, `/terms` load + show key copy + no console errors; and the gated routes (`/designs`, `/range-command-premium`, `/variant-codex-section`) **404** in production. | **yes** (see setup) | ~30s–2min |

`test:unit` and `test:e2e` are **opt-in** and deliberately **not** wired into `health`/`verify`, so those
stay green without extra dependencies. Their test files live in `tests/` (excluded from `tsc`/ESLint).

## When to run which
- **Before each small change (fast):** `npm run health` (seconds — types + lint + the copy/label guardrails).
- **Before a deploy / major handoff (full):** `npm run verify` (adds the production `build`). Plus
  `npm run test:e2e` if you changed public web pages and have Playwright installed.
- **After editing pure logic in `lib/`:** `npm run test:unit` (once Vitest is installed).

## What failures mean
- **typecheck fails** → a type or import is broken; the app may not build. Fix the type.
- **lint fails** → a lint rule/style issue. Fix or justify.
- **test (copy) fails** → directive/signal language (`buy/sell/entry/exit/profit/prediction`, or a CTA
  like "buy now") leaked into a **public** page without a negation/disclaimer/educational context. This
  is the brand-safety + compliance line ("structure & context, not advice"). Reword to context-only.
- **test (label) fails** → a `founder_label` in a review CSV is not one of `true_broken /
  stale_zone_false_cap / normal_pullback_false_cap / genuinely_unclear / unsure` (typo or stray value).
  Protects the research-label integrity that feeds the Broken-Zone decision.
- **test:e2e fails** → a public page is broken, missing its key copy, throwing console errors, or a gated
  experimental route is **leaking** to the public (not 404). Fix before shipping.

## How this protects against false confidence
RangeClarity's core promise is *permission, not prediction* — calm structural context, never trade
signals. The two guardrails in `npm run test` are the automated expression of that promise: the **copy
guardrail** stops signal/advice language from reaching visitors, and the **label-schema guardrail** stops
invalid labels from corrupting the founder-review data that gates the scoring research. Types/lint/build
keep the app shippable; these two keep it *honest*.

## One-time setup for the optional gates (recommend before installing — not installed yet)
Vitest and Playwright are **not** in `package.json` yet. When you want them:
```bash
# unit tests
npm i -D vitest
npm run test:unit

# browser smoke
npm i -D @playwright/test
npx playwright install chromium
npm run test:e2e
```
Until then, `verify` and `health` run fully without them.

## Daily command (fast, before small changes)
```bash
npm run health
```
Before a deploy / major handoff, run the full gate: `npm run verify` (adds the production build).
