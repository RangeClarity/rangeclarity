# RangeClarity Full Technical Review

QA date: 2026-06-20  
Mode: Review only  
Overall status: **FAIL**

## Executive Summary

The current RangeClarity app builds successfully and the public homepage nav cleanup is present: `Indicator Terminal` and `Bold Hero` are no longer in the public header, while `Premium Indicators` and `Join Early Access` remain.

However, the current codebase does **not** implement the stated live beta funnel:

```text
Landing page -> beta signup -> Lemon/manual checkout link -> admin manual payment verification -> manual TradingView access -> onboarding/feedback
```

The build route table does not include `/beta`, `/beta/admin`, onboarding routes, or beta payment routes. The app is currently closer to a landing page plus local-file waitlist, with beta/payment/access behavior documented but not implemented.

Because registration-before-checkout, paid-plan TradingView username capture, admin payment verification, and manual access state changes are absent from the app, the first manual beta users are **not safe to process through this web app yet**.

## Scope Inspected

- `app/page.tsx`
- `app/designs/premium-hero-range-command-v2/page.tsx`
- `app/designs/premium-hero-range-command-v2/RangeCommandV2LowerSections.tsx`
- `app/designs/range-command-v2/data.ts`
- `app/designs/range-command-v2/_components/PricingSectionV2.tsx`
- `app/designs/codex-premium-hero/page.tsx`
- `app/designs/page.tsx`
- `app/indicator-guide/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/api/waitlist/route.ts`
- `lib/waitlist.ts`
- `app/api/linear/issues/route.ts`
- `app/linear-board/page.tsx`
- `app/linear-board/DailyKanbanBoard.tsx`
- `lib/linear/client.ts`
- `lib/linear/types.ts`
- `components/WaitlistForm.tsx`
- `.env.example`
- `.gitignore`
- `README.md`
- beta/payment/access docs under `docs/`

## Commands Run

- `git status --short` - passed, dirty worktree present.
- `npm.cmd run lint` - passed.
- `npx.cmd eslint app lib components` - passed.
- `npx.cmd tsc --noEmit -p tsconfig.check.json` - failed because `tsconfig.check.json` does not exist.
- `npm.cmd run build` - passed.

Build route table included `/`, `/api/waitlist`, `/api/linear/issues`, `/linear-board`, `/designs/*`, `/indicator-guide`, `/privacy`, and `/terms`. It did not include `/beta` or `/beta/admin`.

## P0 Blockers

### 1. Beta signup flow is not implemented

Severity: P0  
File/path: `app/` route tree  
Problem: There is no `/beta` route, no `/beta?plan=free_preview`, no `/beta?plan=beta_29`, and no `/beta?plan=pro_beta_49` implementation. `Test-Path app\beta` returned `False`, and the production build route table has no beta route.  
Why it matters: The stated live goal requires registration before checkout, paid-plan TradingView username capture, and plan preservation before payment. None of that can be verified because the route does not exist.  
Suggested fix: Add a minimal beta signup route in a separate approved implementation pass. It should validate plan, collect name/email, require TradingView username for paid plans, save signup before showing checkout, and keep access pending.  
Risk level: High.

### 2. Admin/access flow is not implemented

Severity: P0  
File/path: `app/` route tree  
Problem: There is no `/beta/admin` route or admin API. There is no implemented `paymentStatus`, `accessStatus`, refund/revoke, expiry, or TradingView username access gate in code.  
Why it matters: Manual TradingView access depends on founder/admin verification. Without an admin workflow, paid users cannot be reliably marked paid, granted, revoked, or expired through the app.  
Suggested fix: Add a minimal admin-only workflow in a separate approved implementation pass. Gate it, avoid secrets in code, and keep TradingView access manual.  
Risk level: High.

### 3. Payment/checkout flow is not implemented

Severity: P0  
File/path: `.env.example`, `app/` route tree  
Problem: No `MANUAL_PAYMENT_LINK_29` or `MANUAL_PAYMENT_LINK_49` placeholders were found, and no checkout handoff route or button logic exists for beta plans. The current pricing CTAs link to `#join`, not beta signup or checkout.  
Why it matters: The required flow says signup must happen before checkout and that Lemon/manual hosted links should be used only after valid registration. The current app cannot enforce that.  
Suggested fix: Add safe public placeholders in `.env.example` and implement checkout display only after signup succeeds. Document shared Lemon link amount verification if one shared link is used.  
Risk level: High.

## P1 Important Issues

### 4. Homepage conversion CTA is currently non-functional for beta signup

Severity: P1  
File/path: `app/designs/premium-hero-range-command-v2/RangeCommandV2LowerSections.tsx`  
Problem: The final CTA form uses `action="#"`, an email input, and a `type="button"` submit control. It does not call `/api/waitlist` and does not navigate to `/beta`. Hero CTAs only jump to page sections.  
Why it matters: Users can click the visible early-access CTA without creating a durable signup or starting the beta flow.  
Suggested fix: In the next implementation pass, point CTAs to the approved signup path and make the final form either submit to `/api/waitlist` or route to `/beta` consistently.  
Risk level: Medium-high.

### 5. Public nav may now conflict with the latest stated review requirement

Severity: P1  
File/path: `app/designs/premium-hero-range-command-v2/page.tsx`, `app/designs/codex-premium-hero/page.tsx`  
Problem: The current public header shows only `Premium Indicators` plus `Join Early Access`. `Investor Research Lab` is hidden. This matches the previous cleanup decision, but the current review checklist says "Premium Indicators and Investor Research Lab remain."  
Why it matters: The intended public nav is ambiguous. If `Investor Research Lab` should remain public, it is currently missing from the header.  
Suggested fix: Decide whether `/indicator-guide` should be a public nav item or only an onboarding/reference route. Then update only the nav link list.  
Risk level: Medium.

### 6. Product copy still uses action-oriented trading language in live homepage data

Severity: P1  
File/path: `app/designs/range-command-v2/data.ts`, `app/designs/premium-hero-range-command-v2/page.tsx`  
Problem: Live homepage content includes phrases such as `Buy / wait / avoid context`, `before you click buy`, `Buy, wait, or avoid`, `Entry-quality context`, and `Wait for Pullback`. Some disclaimer usage is safe, but these action-oriented lines appear in value-prop/product copy.  
Why it matters: RangeClarity positioning says no buy/sell signals, no financial advice, and no prediction/profit claims. Action-style language can make the product feel like a signal or recommendation tool.  
Suggested fix: In a copy-only pass, replace action language with structure-reading language such as "review context", "range location", "extended context", and "chart structure summary."  
Risk level: Medium-high.

### 7. Local file waitlist storage is fragile for production/serverless

Severity: P1  
File/path: `lib/waitlist.ts`, `.env.example`, `README.md`  
Problem: Waitlist signups are written to `.data/waitlist.jsonl` by default. The code and docs correctly warn that serverless filesystems may be ephemeral/read-only, but no durable production provider is implemented.  
Why it matters: If paid traffic or real beta interest goes to the current site, signups may fail or disappear depending on host behavior.  
Suggested fix: Before sending meaningful traffic, replace `addEntry` with a durable provider or use a hosted form. Do not add a large backend yet.  
Risk level: Medium-high.

### 8. Public Linear board/API are present in the local app tree without route auth

Severity: P1  
File/path: `app/linear-board/page.tsx`, `app/api/linear/issues/route.ts`, `lib/linear/client.ts`  
Problem: The local app tree includes `/linear-board` and `/api/linear/issues`. The API requires `LINEAR_API_KEY`, and writes require `LINEAR_WRITE_ENABLED=true`, but the route itself has no user auth or admin gate.  
Why it matters: If deployed with Linear env vars, public visitors could potentially view Linear issues, and if writes are enabled they could update due dates. This is unrelated to the current public beta funnel and should not be exposed casually.  
Suggested fix: Keep this route local-only, remove it from deploy, or gate it behind admin auth before publishing. Do not enable writes in production without auth.  
Risk level: High if deployed with Linear env vars.

### 9. Pricing model is inconsistent across docs and homepage

Severity: P1  
File/path: `app/designs/range-command-v2/data.ts`, `docs/beta-business-decisions.md`, `docs/payment-provider-options.md`  
Problem: Homepage pricing shows `$0`, `$29/mo billed annually`, and `$49/mo`; beta docs recently define Founding Beta Access as `$79 for 90 days`.  
Why it matters: Users and the founder/admin may see different offers depending on page/doc. This can create payment reconciliation and trust issues.  
Suggested fix: Pick one beta offer for the next public test and align homepage, docs, checkout link labels, and admin records.  
Risk level: Medium-high.

## P2 Polish / Cleanup

### 10. `tsconfig.check.json` is referenced by QA instructions but missing

Severity: P2  
File/path: `tsconfig.check.json`  
Problem: `npx.cmd tsc --noEmit -p tsconfig.check.json` fails with `TS5058: The specified path does not exist`.  
Why it matters: QA commands are inconsistent. The normal `npm run typecheck` script exists and uses `tsconfig.json`, but the requested stricter config cannot run.  
Suggested fix: Either create `tsconfig.check.json` in a separate tooling pass or update QA instructions to use `npm run typecheck`.  
Risk level: Low.

### 11. Experimental design routes remain publicly reachable by direct URL

Severity: P2  
File/path: `app/designs/*`, `app/variant-codex-section/page.tsx`, `app/range-command-premium/page.tsx`  
Problem: Duplicate/experimental design routes still build and are reachable by direct URL. `/designs` is marked `noindex`, but direct access still works.  
Why it matters: This is acceptable for internal comparison, but it can confuse users if links leak or are indexed elsewhere.  
Suggested fix: Leave routes intact for now, but decide later whether to redirect archived variants or keep them noindex/internal.  
Risk level: Low-medium.

### 12. Current worktree contains unrelated uncommitted changes

Severity: P2  
File/path: repository root  
Problem: `git status --short` shows modified prompt/package files and untracked Linear/docs/scripts files.  
Why it matters: Audits and releases are harder to reason about when unrelated changes are present. It also increases accidental deploy risk.  
Suggested fix: Split operational docs, Linear tooling, and product-site work into separate commits/branches after review.  
Risk level: Low-medium.

### 13. Homepage implementation is composed from design routes

Severity: P2  
File/path: `app/page.tsx`, `app/designs/premium-hero-range-command-v2/page.tsx`  
Problem: `app/page.tsx` re-exports a page under `app/designs/`. This works, but keeps production homepage coupled to design-comparison files and naming.  
Why it matters: It can confuse future maintainers and increases the chance that design experiment changes affect production.  
Suggested fix: Later, after the homepage direction is stable, move the live homepage into a dedicated production component and keep design variants separate.  
Risk level: Low.

## Security Risks

- No committed `.env` file was found in the checked status output; `.gitignore` excludes `.env` and `.env*.local`.
- `.env.example` contains placeholders only in the inspected output.
- The largest security concern is the local uncommitted Linear board/API route, which has no route auth. It should not be deployed with active Linear credentials unless gated.
- There is no `/beta/admin` route to review, so admin token behavior could not be verified.

## Payment / Access Risks

- `MANUAL_PAYMENT_LINK_29` and `MANUAL_PAYMENT_LINK_49` are not present in `.env.example`.
- No Lemon/manual checkout route or button logic exists in code.
- Signup-before-checkout cannot be enforced because `/beta` is missing.
- Free preview vs paid access cannot be enforced because there is no beta access model in code.
- Mark paid, grant access, refund/revoke, and expiry behavior cannot be verified because admin/access code is absent.
- TradingView access remains manual in docs, but there is no app-side record or admin workflow to support it.

## Product-Language Risks

Safe disclaimer references were found and should not be removed blindly. Unsafe or risky usages are mainly in live/variant marketing copy:

- `app/designs/range-command-v2/data.ts`: action-oriented strings including `before you click buy`, `Buy, wait, or avoid`, `Entry-quality context`, and `Wait for Pullback`.
- `app/designs/premium-hero-range-command-v2/page.tsx`: `Buy / wait / avoid context`.
- Variant routes under `app/designs/previous-pro`, `app/designs/nft-character-toolkit`, `app/designs/premium-fintech`, and `app/variant-codex-section` also contain similar action language. These are less urgent if they remain hidden/noindex, but should be cleaned before public linking.

## Code Quality Notes

- TypeScript/ESLint/build are healthy for the current code.
- The current production app is a design-route composition, not a clean production app boundary.
- Waitlist persistence is intentionally minimal but not production-durable.
- The Linear board introduces operational functionality into the public Next app tree and should be isolated or gated.
- There is no validation layer for beta plan IDs because the beta flow is absent.
- There is no shared product config for offer names/prices, increasing copy drift risk.

## Recommended Next 5 Actions

1. **Implement the minimal `/beta` signup flow.**  
   Must preserve `free_preview`, `beta_29`, and `pro_beta_49`, require TradingView username for paid plans, save signup before checkout, and keep access pending.

2. **Add safe checkout-link configuration.**  
   Add placeholder env names for `MANUAL_PAYMENT_LINK_29` and `MANUAL_PAYMENT_LINK_49`, and show checkout only after valid signup. If using one shared Lemon link, document manual amount verification in the UI/admin checklist.

3. **Implement a minimal gated `/beta/admin` workflow.**  
   Include manual paid verification, access grant only when paid plus TradingView username exists, refund/revoke, and expiry flags. Keep TradingView access manual.

4. **Clean public product copy.**  
   Replace action/recommendation wording in live homepage copy with structure-reading language. Do this before sending paid traffic.

5. **Gate or remove the local Linear board from deploy.**  
   Keep it local/internal unless protected by an admin gate. Do not enable Linear writes in any public deployment.

## What Not To Build Yet

- Supabase/database platform.
- Lemon webhooks.
- Automated TradingView access.
- Auth system beyond the smallest admin gate needed for manual beta.
- AI features.
- Large community platform.
- Complex subscription portal.
- More design variants.

## Final Counts

- P0 blockers: 3
- P1 important issues: 6
- P2 polish/cleanup: 4

## Manual Beta Safety

First manual beta users are **not safe through the current app** because signup-before-checkout, paid-plan TradingView username capture, admin verification, and access state handling are not implemented.

Manual beta can still be run fully off-platform with direct founder handling, but the current website should not be treated as the complete beta funnel.

## Exact Next Recommended Task

Build the smallest possible `/beta` signup flow with plan validation, required TradingView username for paid plans, persisted signup before checkout, and checkout link display only after successful signup.
