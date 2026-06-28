# Decision Log

Append-only. Each decision records date, status, the call, and the evidence/rationale so settled debates are not reopened. Status ∈ Approved · Recommended (awaiting founder) · Open · Superseded.

> Hierarchy: a **Approved** decision here outranks the board and the repo state. See `CLAUDE.md`.

## Approved

### D-001 · Positioning: "chart clarity, not signals" · Approved
Educational decision-support only. No profit/win-rate/buy-sell/guarantee language anywhere. Evidence: `AGENTS.md`, `app/terms/page.tsx`, `app/privacy/page.tsx`.

### D-002 · Monetization: Whop-first, TradingView invite-only, Discord onboarding · Approved
The paid deliverable is the TradingView Pine indicator (invite-only); checkout via Whop; community/onboarding via Discord. Evidence: `PROJECT_HANDOFF.md` §2 ("Monetization: Whop first"), `RANGECLARITY_MASTER_PLAN.md`.

### D-003 · Direct Paid Beta over waitlist-first · Approved (founder direction, 2026-06-18)
Pursue first 5 paying customers directly; do not default to a waitlist. Validation test: "Can RangeClarity deliver enough real value to charge the first five customers?" Supersedes the waitlist-first assumption baked into RC-5 and the old landing CTA.

### D-006 · Architecture: Pine-first Paid Beta, anchored by a canonical tested scoring core (Path E) · Approved (founder, 2026-06-19)
Chosen over web-native (A), hybrid (C), and web-engine-with-Pine-companion (D). Weighted decision: **E 7.72 > B 7.66 > C 6.55 > A 5.18 > D 5.13** (full table + rationale in the architecture comparison and `docs/analysis-engine-plan.md`; saved review in `docs/product-plan-codex-review.md`). The TradingView Pine indicator is the product surface for the Beta; the web app handles marketing/payment/access; the **scores live in a pure, tested canonical reference** (EN-1) so Pine and any future web engine cannot diverge. Drivers: the Pine asset already exists (two ~480-line v6 scripts); TradingView supplies licensed data + charting + alerts at zero cost; a web-native engine needs a licensed market-data feed (commercial display rights), a charting library, an engine, and auth — weeks of spend and licensing risk **before** validation. **Conditions to revisit:** paying users demand multi-ticker scanning/watchlists; manual access management exceeds a few hours/week; or TradingView changes invite-only/alert terms.
- **EN-1 approved** as the first ticket (pure, tested scoring & state engine — Structure vs Entry, five states, full reasons, six fixtures). Full ticket in `docs/product-plan-codex-review.md`.
- **Next tickets:** PINE-1 (implement the new-spec indicator in Pine + reconcile the two Pine files + parity vs EN-1), then ACCESS-1 (Whop + invite-only publish + Discord + grant/revoke runbook).

## Recommended (awaiting founder approval)

### O-002 · What the 5 customers buy, and the price · Open
Define the exact Beta offer and price (~$29–49/mo indicated). Needed before ACCESS-1 / the Whop product. **Founder decision.**

### O-003 · Homepage: keep "Codex Premium Hero" vs promote "previous-pro" · Open
Live homepage is `premium-hero-range-command-v2` (commit `4fa4ce9`). RC-1 proposes promoting `/designs/previous-pro`. Lower priority than EN-1/PINE-1. **Founder decision; no churn until decided.**

### O-006 · Which Pine file is canonical · Open
Two implementations exist: `RangeClarity_Core.pine` (465 lines) and `pine/rangeclarity_ultimate_core.pine` (494 lines). PINE-1 must reconcile to one. **Founder/Codex decision.**

### O-007 · How much of the scoring formula to expose to customers · Open
Transparency is required (components + reasons), but exact weights/thresholds reveal the formula. Decide: show component values + reasons + directional weights, or full coefficients. **Founder decision.**

### O-008 · RC-1 broken-zone semantics over-reject; redesign before Pine · Recommended (awaiting founder review, 2026-06-25)
Real Baseline v1 (`docs/research/rc1-real-data-visual-review-v1.md`, frozen) shows the RC-1 scoring engine **OVER-REJECTS** on real data: 19/20 symbols, **1,767 windows, 0 Clear / 0 HighClarity**. Primary suspect is **broken-zone semantics**, not just `agree3`: `broken` binds **74.1%** of windows (`agree3` 97.5%, severe 55.5%, chop 52.7%); all **42 `clean_but_capped`** windows read `zone = Broken` on a `Clean` trend. Root cause: `research/rc1_ultimate_offline_indicator/zone_engine.py` (`zones_asof`) marks `Broken` against **any** historical support cluster on a tiny `0.25·ATR`, order-independent, no-reclaim / no-time-confirm test → normal pullbacks through stale levels get flagged Broken → cap 50. **Recommendation:** before any Pine work, founder reviews `clean_but_capped` in `research/reports/visual_review/index.html` and labels via `founder_labels_template.csv`, then approves or refuses the single reversible A/B toggle specified in `docs/research/rc1-ab-test-broken-zone-v0.md`. Tracked on the board as **RC-11**. **No scoring / `agree3` / cap / Pine change is approved by this entry. BLOCK Pine stands; conviction RED.** **Founder decision.**

## Deferred

### O-001 · In-app Stripe/auth/billing stack · Deferred (superseded by D-006)
The web-native auth/billing build (`docs/auth-billing-plan.md`, `docs/paid-beta-engineering-plan.md` AB-*) is **deferred until after paid validation**. Path E uses Whop + TradingView invite + Discord for the first customers. Revisit when self-serve SaaS is justified.

### O-005 · Enable Linear write-sync (Stage B) · Deferred
Linear stays read-only until explicitly approved. `docs/kanban.md` is the source of truth. Mechanics ready in `docs/linear-integration.md`.

## Superseded
- *Waitlist-first launch* → superseded by **D-003**.
- *Web-native engine as the first source of truth* → superseded by **D-006** (Pine-first + canonical core).
- *O-001 lightweight-vs-build question* → resolved by **D-006**.
- *O-004 retire waitlist-first* → folded into **D-003 / D-006** (the dead `action="#"` CTA will be replaced when the Whop offer exists).
