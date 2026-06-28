# Paid Beta — Launch Readiness

Scored against the founder's test: **"Can RangeClarity deliver enough real value to charge the first five customers?"** Status ∈ ✅ ready · 🟡 partial · ❌ missing · ➖ not needed for first 5. Evidence required for ✅. Owned details: `docs/project-state.md`, `docs/kanban.md`.

| # | Area | Status | Evidence / note | Ticket |
|---|------|--------|------------------|--------|
| 1 | **Core user value** | 🟡 | Indicator built (`RangeClarity_Core.pine`, 465 lines) but **not validated** — test matrix empty. This is the gate. | RC-6 |
| 2 | **Pricing** | ❌ | Only static pricing UI; no decided Beta price. | O-002 |
| 3 | **Stripe / payment flow** | ➖ | None in repo. For first 5, use **Whop** checkout (external), not in-app Stripe. | RC-7 / O-001 |
| 4 | **Authentication** | ➖ | None. Not needed — access is via TradingView invite, not app login. | O-001 |
| 5 | **Entitlements / access control** | 🟡 | Manual for first 5: TradingView invite-only + Discord role. No code needed yet. | RC-7 |
| 6 | **Legal disclaimers** | 🟡 | Terms/Privacy exist with educational + financial disclaimers; reworded from "waitlist" to paid; add refund/billing terms. | RC-9 |
| 7 | **Billing states** | ➖ | Handled by Whop for the Beta (active/expired). Revisit at scale. | RC-7 |
| 8 | **Cancellation** | 🟡 | Via Whop subscription management; document the path. | RC-7 |
| 9 | **Refund handling** | 🟡 | Define a simple Beta refund policy (e.g., 7-day) in Terms. | RC-9 |
| 10 | **Analytics** | ❌ | None wired. Minimal: track CTA→Whop clicks + conversions. Low priority. | RC-10 |
| 11 | **Production reliability** | 🟡 | Landing type-clean; `next build` unverified; not deployed. | RC-3 |
| 12 | **Customer support path** | 🟡 | Discord intended; confirm a support channel + response expectation. | RC-7 |

## Readiness verdict
**Not launch-ready today, but on a short path.** The hard asset (a real indicator) exists; viability hinges on **(1) validating the indicator is worth paying for (RC-6)** and **(2) standing up a Whop + invite-only access path and pointing the CTA at it (RC-7, RC-8)**. Building Stripe/auth/entitlements in the app for 5 customers would be **over-engineering** — explicitly out of scope until demand is proven (see `docs/decisions.md` O-001).

The blockers are **value-validation and an offer/access path**, not heavy infrastructure.
