# Paid Beta — Engineering Plan (design only)

> **PROPOSAL. Nothing implemented.** No packages installed, no provider accounts, no deploy, no live payments. Awaiting founder approval.
> Architecture detail lives in [`docs/auth-billing-plan.md`](./auth-billing-plan.md); state in [`docs/project-state.md`](./project-state.md); decisions in [`docs/decisions.md`](./decisions.md); readiness in [`docs/launch-readiness.md`](./launch-readiness.md). This file owns the **engineering org, process, test/CI/monitoring baseline, and execution sequence** — it does not repeat the architecture.

## Engineering organization (project subagents)
Implementers and reviewers are **separate** (an implementer is never its own reviewer):
- **rangeclarity-chief-of-staff** — planning, tickets, prioritization.
- **frontend-engineer** — UI/screens (write).
- **backend-auth-engineer** — Supabase auth, sessions, entitlement (write).
- **billing-engineer** — payment adapter, checkout (TEST), webhooks (write).
- **qa-engineer** — tests + build/lint/type verification (tests only).
- **security-reviewer** — read-only security gate; signs off before deploy/live.
- **ux-reviewer** — read-only UX gate.
Agent definitions are in the outputs folder → install to `.claude/agents/` (that path is session-protected, so it can't be written automatically).

## 1. Confirmed current state
Next.js 15.3 App Router + React 19 + TS 5 landing site; type-clean; **not deployed**. **No** database, auth, payments, middleware, protected routes, server actions, **tests, or CI**. One file-based API route (`/api/waitlist`); only `WAITLIST_FILE` env used. The paid product (`RangeClarity_Core.pine`, v6, 465 lines) exists but is unvalidated. Evidence: `docs/project-state.md`.

## 2. Existing reusable systems
- **Design system:** `app/globals.css` (~1534 lines, 28 CSS-token variables) + components (`PricingSection`, `WaitlistForm`, `DashboardMock`, `ChartInstrument`, `Reveal`, `Sparkline`, `UseCases`). Reuse for pricing/dashboard/account UI.
- **API + env patterns:** the waitlist route + `lib/` server helpers show the conventions to follow.
- **Planning/automation:** `docs/kanban.md` board + the read-only Linear bridge (`scripts/hermes/linear/`).
- **Deploy guide:** `docs/deploy-rangeclarity.md` (Vercel).

## 3. Missing paid-beta capabilities
Auth + sessions; a database + entitlement state; payment checkout + verified idempotent webhooks; server-side access control; **a test runner + CI**; basic monitoring/observability; legal terms for paid (refunds/billing).

## 4. Recommended architecture
**Supabase (Auth + Postgres) + a provider-agnostic payment adapter + server-side entitlement.** Auth is decoupled from the payment provider so the provider can change without rebuilding registration. Full rationale and option comparison: `docs/auth-billing-plan.md` §4–5.

## 5. Registration flow
Homepage → Pricing → Sign-up (email+verify / Google) → `/auth/callback` → signed-in. Diagram: `docs/auth-billing-plan.md` §6.

## 6. Payment & entitlement flow
Server creates a TEST checkout → provider → **webhook (verified, idempotent)** updates `subscriptions` → `hasActiveAccess()` gates `/app`. Return URLs grant nothing. Diagram: `docs/auth-billing-plan.md` §7.

## 7. Database changes
`profiles`, `billing_customers`, `subscriptions`, `webhook_events` (idempotency) with RLS + an `auth.users → profiles` trigger. Full schema: `docs/auth-billing-plan.md` §8.

## 8. Security model
Access decided **server-side** only; browser never decides; return URLs grant nothing; webhooks verified + idempotent; secrets server-only (no `NEXT_PUBLIC_` leakage); no plaintext passwords; RLS on user tables; no secrets in repo. Detail: `docs/auth-billing-plan.md` §11–12.

## 9. Route plan
`/pricing`, `/sign-up`, `/sign-in`, `/auth/callback`, `/auth/reset`, `/app` (+`/app/onboarding`), `/account`, `/account/billing`, `/checkout/success|cancel`, `/api/checkout`, `/api/webhooks/payments`, `middleware.ts`. Table: `docs/auth-billing-plan.md` §9.

## 10. Test strategy
Today there is **no test runner** — this is a prerequisite for the definition of done.
- **Add Vitest** (unit/integration) + a thin React Testing Library setup. Scripts: `test`, `test:run`.
- **Unit:** `hasActiveAccess()` across all user states; webhook event mapping; signature verification.
- **Integration:** webhook **idempotent replay** (same event id → one effect); bad signature → 400; return URL grants nothing.
- **Gates on every ticket:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` all green.
- **Manual:** mobile (~375px) + the state matrix in `docs/auth-billing-plan.md` §14. Playwright E2E is **deferred** (not for the first beta).

## 11. Deployment sequence
DB migrations (dev) → auth on a Vercel **preview** (TEST) → payments in **sandbox** + webhook test events → entitlement matrix green → founder review → promote to prod with payments still TEST → **separate approval** → live payments. Detail: `docs/auth-billing-plan.md` §15.

## 12. Rollback strategy
Gate paid surfaces behind a `PAID_BETA_ENABLED` flag; keep auth/payments in TEST until verified; reversible migrations; disable webhook + revert to last-good Vercel build to back out. No customer data deleted on rollback. Detail: `docs/auth-billing-plan.md` §16.

## 13. Monitoring requirements (minimal for Beta)
- **Webhook observability:** structured logs for every event (received/verified/deduped/applied/failed); the `webhook_events` table is the audit trail.
- **Subscription changes:** log state transitions (who, from→to, when).
- **Errors:** capture server errors (start with Vercel logs; add Sentry only if needed).
- **Uptime/health:** a lightweight `/api/health` and Vercel's built-in monitoring.
- **No heavy analytics stack now** — just enough to debug a failed payment and confirm access.

## 14. Implementation tickets (≤7 active)
Full per-ticket detail (files, security) in `docs/auth-billing-plan.md` §20. Each ticket's **Definition of Done = the full bar in `CLAUDE.md`** (criteria + tests + lint + types + build + mobile + states + authz + no secrets + no unrelated changes + docs + rollback + a separate review-agent sign-off).

| # | Ticket | Pri | Owner agent | Reviewer | Depends on |
|---|--------|-----|-------------|----------|-----------|
| **EB-0** | Engineering baseline: Vitest + test scripts + minimal GitHub Actions CI (lint/type/build/test) + `.env.example` scaffolding | **P0** | qa-engineer + frontend | security-reviewer | none |
| AB-1 | Supabase project + schema + RLS + profile trigger | P0 | backend-auth | security-reviewer | Supabase approval |
| AB-2 | Auth (email+Google+verify+reset) + middleware + protected `/app` | P0 | backend-auth | qa + security | AB-1 |
| AB-3 | Entitlement module + route guards + `/pricing` `/account` `/account/billing` | P1 | backend-auth + frontend | qa + ux | AB-1, AB-2 |
| AB-4 | Payment adapter + checkout (TEST) + return pages | P1 | billing | security | AB-3 + provider decision |
| AB-5 | Webhook handler (verify + idempotent + subscription upsert) | P0 | billing | **security (sign-off)** + qa | AB-1, AB-4 |
| AB-7 | Terms capture + onboarding (TradingView invite + Discord) | P2 | frontend + founder copy | ux | AB-2 |

Deferred to backlog (keeps active ≤7): **AB-6** minimal admin view.

## 15. Acceptance criteria (per ticket)
- **EB-0:** `npm test` runs (≥1 passing sample test); CI runs lint+typecheck+build+test on push and is green; `.env.example` lists all needed placeholders; no product behavior changed.
- **AB-1:** the four tables + RLS exist; signup creates exactly one `profiles` row; cross-user reads denied (SQL test); service-role used only server-side.
- **AB-2:** email+password and Google sign-in work; unverified email blocked from `/app`; reset works; signed-out `/app` → `/sign-in`.
- **AB-3:** `hasActiveAccess()` matches the state table for all states; `/app` gated by it; billing page shows status read-only.
- **AB-4:** adapter interface implemented for one provider in TEST; checkout opens; success/cancel pages grant nothing.
- **AB-5:** bad signature → 400; replayed event id → single effect; valid events upsert subscription + period end.
- **AB-7:** `terms_version`/`terms_accepted_at` recorded at sign-up; onboarding shows TradingView invite + Discord post-payment.
Verification commands per ticket: `docs/auth-billing-plan.md` §20.

## 16. Founder decisions still required
1. **Payment provider + company country** (blocker — Stripe availability). 2. Approve **Supabase**. 3. **Plan(s) + price** and **trial yes/no**. 4. **Past-due grace** + **refund** policy (→ RC-9 legal). 5. **Terms version** string. 6. Approve deploy, and (separately) live payments. 7. Confirm you want the **self-serve web product** vs the lighter manual Beta (`docs/decisions.md` O-001).

## 17. Do NOT build now
Organizations/teams; phone auth; usernames; referral/social features; complex profile settings; roles beyond user/admin; a full admin console (minimal AB-6 only, later); analytics dashboards; Playwright E2E; the durable waitlist (`RC-5`, deferred); new homepage concepts/redesigns; any infra beyond Supabase + Vercel + the payment provider.

---

## Highest-priority ticket
**EB-0 — Engineering baseline (test runner + CI + DoD gates).** It is the only ticket with **no external dependency** (doesn't wait on the Supabase or payment-provider decisions), and your professional definition of done is unachievable without it — every later ticket needs tests + build verification to be *completable*. AB-1 is the first feature ticket immediately after, once Supabase is approved.

**Do this next: EB-0 — establish the test + CI baseline (Vitest, `npm test`, GitHub Actions running lint/typecheck/build/test) so every Paid Beta ticket can meet the definition of done.** (Pending your approval of this plan — no implementation yet.)
