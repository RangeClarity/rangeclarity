# RangeClarity — Closed Beta Launch Readiness Checklist

Status: planning. The gate for inviting the first closed-beta users. Complements `docs/launch-readiness.md` (paid-beta indicator checklist) with the **full-system** view. Every item must be green (or explicitly waived in `decisions.md`) before invites go out.

## Indicator (chart)
- [ ] Pine file **compiles** in the TradingView Pine Editor (no errors/warnings that matter).
- [ ] S/R works on all test symbols (BTCUSD, VRT, INOD, MELI, TSCO, NOW, NVDA, SPY, QQQ, EURUSD) — Local/Key/Strong render correctly.
- [ ] No empty charts where real structure exists; no far/irrelevant zones (no -80/-99% levels) by default.
- [ ] "None above" / price-discovery handled honestly (no fake resistance).
- [ ] Soft Structure Channel **does not clutter** the chart; appears only on real parallel structure.
- [ ] No **fake channels** on wedges/triangles/noise (Developing/None instead).
- [ ] Channel is optional and off-switch returns to clean S/R.
- [ ] Alerts are **clean** and confirmed-bar only; no buy/sell, target/defense, or prediction wording.
- [ ] Dashboard reads clearly; Market bias unchanged by the channel layer.
- [ ] Indicator delivered **invite-only** (no public TV publish yet).

## Schema & parity
- [ ] Shared schema v0.1 frozen and versioned.
- [ ] Every alert maps to a valid `eventType`; alert JSON validates against the schema.
- [ ] Golden test vectors exist and **pass in both** the Pine reference and the TS scanner.
- [ ] `rangeClarityScore` is a clarity/attention score (documented), never a direction/probability score.

## Website Brain & scanner
- [ ] Scanner runs over the beta watchlist universe and writes snapshot rows.
- [ ] Scanner output **matches the chart** on spot-checked symbols (parity within tolerance).
- [ ] Data source licensing permits this use; cost is sustainable; caching respects provider limits.
- [ ] Events (scanner diffs + TV webhooks) accumulate correctly; webhook receiver is authenticated and idempotent.

## Market Room & explanations
- [ ] Market Room shows ranked, **useful examples** — a user sees which charts are at a level in <30s.
- [ ] Ranking feels reasonable on real data (sanity-checked vs charts).
- [ ] Every surfaced card has a clear, accurate, **non-advice** explanation.
- [ ] Watchlist Radar daily brief has good signal-to-noise (capped, severity-filtered).

## Product, compliance, ops
- [ ] **No investment-advice language** anywhere (chart, scanner, brief, explanations, marketing) — copy reviewed.
- [ ] Landing/explainer page communicates the clarity value clearly (even if invite-only).
- [ ] Onboarding is understandable; a new user reaches first value quickly.
- [ ] **Error logging** exists (server + client) and is reviewable.
- [ ] A **user feedback process** exists (channel + triage).
- [ ] Privacy/security basics in place (secrets not in repo; auth on inbound endpoints; see `PRIVACY_AND_DEV_SECURITY_CHECKLIST.md`).
- [ ] Access is **invite-only**; no public signup/payments yet.
- [ ] Rollback/runbook: how to disable the channel layer, pause the scanner, and revert the indicator (archive baseline) is documented.

## Sign-off
- [ ] Founder review complete.
- [ ] Codex review of schema + scanner parity complete.
- [ ] 3–5 invited users identified and onboarding tested cold.

> Beta is ready only when all boxes are checked or explicitly waived (with reason + date) in `decisions.md`. Quality over speed — slipping the date is acceptable; shipping an unclear product is not.
