# RangeClarity — Live Internal Plan

> INTERNAL working document. Not customer-facing. No secrets, no customer data.
> Edit this file to update the `/project-plan` page — it is the source of truth for that view.

**Last updated:** 2026-06-20 · **Branch:** `main` · **Sprint:** 1 — Paid Beta Access Loop (Jun 20 → Jul 7)

This is the practical, current-state plan. It reconciles the roadmap docs in `docs/roadmap/` with the code actually in the repo today. Where the two disagree, the code wins and the gap is listed as a reconciliation item.

---

## 1. Current Status

Day 1 of Sprint 1 ("Paid Beta Access Loop"). The hardest asset — the TradingView Pine indicator — already exists. This session built and verified the **registration to manual-checkout to admin-grant** loop on the web app, which is ahead of where the older roadmap docs assume (they still describe a dead CTA and no payment path).

The central question is unchanged: **can the indicator deliver enough real value to charge the first five customers?** That validation (RC-6) is not done and gates real revenue.

- **Phase:** P0/P1 boundary — the access loop is largely built; product-value proof is not.
- **Provider posture:** manual fulfilment, no live charges, no webhooks. A founder confirms each payment by hand.
- **Money path:** test/sandbox only until the founder explicitly approves live mode.

## 2. What Works Now

Verified in this repo (code plus this session's checks):

- **Core indicator built.** `RangeClarity_Core.pine` (465 lines, Pine v6) — the deliverable customers pay for.
- **Landing builds, type-clean.** Next.js 15 App Router + React 19 + TS 5; source typecheck passes. Live homepage is `premium-hero-range-command-v2`.
- **Public nav cleaned.** Header shows only `Premium Indicators` and `Investor Research Lab` (plus logo and the Get Beta Access CTA). Committed as `052a3e4`.
- **Pricing CTAs route correctly.** `/beta?plan=free_preview`, `/beta?plan=beta_29`, `/beta?plan=pro_beta_49`.
- **Registration before checkout.** `/beta` collects name, email, TradingView username, and plan; saved by `lib/betaStore.ts` to `.data/beta-signups.jsonl` as `unpaid` / access `pending` before any checkout.
- **Manual checkout wired.** `PAYMENT_PROVIDER=manual`; paid plans return a Lemon Squeezy hosted checkout link (`MANUAL_PAYMENT_LINK_29` / `_49`); the success screen shows the "Complete payment" button. Free preview is lead-capture only.
- **Admin console.** `/beta/admin` is gated by `ADMIN_TOKEN` (a strong token is set). Admin can mark paid and grant TradingView access; cannot grant without a TradingView username; refund and revoke work; access stays `pending` until a manual grant.

## 3. What Is Still Missing

- **Indicator not validated (the gate).** `RANGECLARITY_PINE_TEST_PLAN.md` matrix is empty — no recorded proof on real charts. `[RC-6]`
- **Offer and price not finalized.** ~$29–49/mo indicated, not decided. `[O-002]`
- **One shared Lemon link for both paid plans.** Checkout cannot distinguish $29 from $49; admin verifies the paid amount in Lemon by hand ($29.9 maps to beta_29, $49 maps to pro_beta_49). Decide one variant or two. `[PAY-1]`
- **Live build/deploy unverified.** `next build` not confirmed in this environment; not deployed to Vercel. `[RC-3]`
- **No core value / onboarding screen** for a new buyer (what they bought, how to read it). `[VALUE-1]`
- **Legal copy still reads "waitlist" in places** — needs paid-beta plus refund/cancellation wording. `[RC-9]`
- **No analytics** on CTA to checkout to conversion. `[RC-10]`
- **Canonical scoring core (web brain) not built** — deferred by design. `[EN-1]`
- **Canonical Pine file undecided** — `RangeClarity_Core.pine` vs `pine/rangeclarity_ultimate_core.pine`. `[O-006 / PINE-1]`

## 4. Next Tasks

Stable IDs reused from `docs/kanban.md` and `docs/decisions.md`; new items prefixed clearly.

- **[RC-6] Validate the Core indicator** on 1D + 4H/1H; fill at least 6 of 9 test categories; run the repaint check; record a founder "worth charging" verdict. This is the gate — do it first.
- **[O-002] Decide the Beta offer and price.** Founder decision; unblocks final checkout amounts and legal copy.
- **[PAY-1] Finalize Lemon Squeezy checkout.** Confirm product/variant and price; decide one shared link vs two; keep test mode until approved; document the manual buy-verify-grant runbook.
- **[RC-9] Legal reword for paid beta.** Refund window + cancellation path; drop "waitlist" wording; keep educational and no-advice disclaimers.
- **[RC-3] Verify `next build` and deploy** a Vercel preview (founder promotes to prod).
- **[VALUE-1] Core value screen** (overview, sample ticker, bias/score/state, "what this means / does not mean").
- **[O-006 / PINE-1] Pick the canonical Pine file** and reconcile the two implementations.

## 5. P0 / P1 / P2 Priorities

### P0 — must happen first (gates revenue)

- **[RC-6]** Validate the indicator is worth charging for.
- **[O-002]** Decide the offer and price.

### P1 — needed for a clean paid beta

- **[PAY-1]** Finalize Lemon checkout (test mode; confirm amounts; runbook).
- **[RC-9]** Legal reword (refund / billing / cancellation).
- **[RC-3]** Verify build and deploy a preview.

### P2 — value and clarity, after the loop is real

- **[VALUE-1]** Core value / onboarding screen.
- **[O-003]** Homepage decision (keep Codex hero vs promote previous-pro).
- **[O-006 / PINE-1]** Canonical Pine reconcile.
- **[RC-10]** Minimal conversion analytics (after the offer is live).

## 6. Current Blockers

- **[RC-6] Indicator validation** — blocks the meaning of the whole loop; until value is proven, the built payment path has nothing confirmed worth selling. Owner: Founder + Codex/Pine.
- **[O-002] Offer and price** — founder decision; blocks final checkout amounts, legal copy, and any live switch.
- **[DEC-1] Provider record mismatch** — the decision log `D-002` says Whop-first, but the implemented checkout uses Lemon Squeezy (manual provider). Update `docs/decisions.md` to match the built reality, or consciously switch. Owner: Founder.
- **Environment (this machine):** `.next` is read-only here so a full `next build` cannot run; `git push` needs the founder's GitHub credentials. These are not code blockers — run them locally.

## 7. Founder Manual Actions

- Run the Pine test plan on TradingView; record the matrix; give an explicit go/no-go verdict. `[RC-6]`
- Decide the Beta offer and price. `[O-002]`
- In Lemon Squeezy: confirm the product/variant(s) and price; decide one shared link vs two; keep test mode until ready for live. Verify each paid amount before marking a buyer paid.
- Publish the indicator invite-only on TradingView; prepare the Discord / onboarding path.
- Push the current commit to origin (`git push origin main`) and deploy a Vercel preview when ready.
- Explicitly approve any switch to live payments. No live charges until then.

## 8. Claude Code Tasks

- Keep `/beta` registration and `/beta/admin` fulfilment in good shape (done this session; verified).
- Maintain this internal `/project-plan` page (the viewer for this document).
- `[RC-9]` Draft the paid-beta legal reword for founder sign-off.
- `[VALUE-1]` Build the core value / onboarding screen when prioritized.
- `[PAY-1]` Write the manual fulfilment runbook (buy, verify amount in Lemon, mark paid, grant TV access).
- `[RC-10]` Wire minimal analytics once the offer is live.
- Do not add webhooks, in-app Stripe/auth, a database, or a multi-ticker scanner before validation.

## 9. Codex QA Tasks

- Review this file (`docs/project-plan/rangeclarity-live-plan.md`) and the `/project-plan` page for accuracy.
- QA the `/beta` loop: registration saves before checkout; paid plans require a TradingView username; the success screen shows the "Complete payment" button; access stays pending until a manual grant.
- QA the access gate: confirm access cannot be granted without payment + TradingView username (override aside); confirm a refund revokes access.
- Review the Pine validation matrix when RC-6 is run.
- Guardrail check: no buy/sell, profit, win-rate, or prediction language anywhere (chart, app, docs).
- Confirm no secrets or customer data appear in this document or the page.

## 10. Most Important Next Step

> **Validate the Core indicator (RC-6) and lock the offer and price (O-002).**
> The registration to checkout to admin-grant loop is built and verified. What is not yet proven is that the indicator is worth paying for. Until RC-6 passes and the price is set, everything downstream (live checkout, deploy, onboarding) is waiting on evidence, not engineering. Prove the value, set the price, then turn the loop on.
