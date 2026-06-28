# RangeClarity — Milestone Roadmap (M0 → M11)

Status: planning. Sequenced path from current state to public/paid beta. Times assume **solo founder + Claude Code/Codex**, quality-first (no rushed launch). Scenario adjustments in `rangeclarity_execution_strategy.md`. Each milestone is gated; do not start the next until acceptance is met.

Legend — time is calendar effort at a sustainable pace, not full-time minimums.

---

## M0 — Planning & current-state snapshot
- **Goal:** one coherent plan + a frozen, documented baseline of the indicator.
- **Deliverables:** this roadmap + vision, architecture, schema, 12-week plan, kanban, readiness checklist, execution strategy; `pine/archive/...before_trend_channel.pine` baseline noted; `project-state.md` updated.
- **Files touched:** `docs/*` (planning only).
- **Estimate:** 2–4 days.
- **Acceptance:** all eight planning docs exist and agree; founder approves the sequence.
- **Risks:** analysis paralysis. **Mitigation:** timebox; planning docs are living, not perfect.
- **Not yet:** no code, no scanner, no schema implementation.

## M1 — Stable S/R Indicator Core
- **Goal:** the S/R engine (Local/Key/Strong, fallback, dashboard) is compiled-clean and stable on the test universe.
- **Deliverables:** Pine Editor compile pass; manual test results on the 10-symbol list; any compile/runtime fixes; `RANGECLARITY_PINE_TEST_PLAN.md` results logged.
- **Files touched:** `pine/rangeclarity_sr_core_v1.pine` (fixes only), `docs/` test log.
- **Estimate:** 3–5 days (mostly manual TV testing + small fixes).
- **Acceptance:** compiles in TradingView; S/R clean on BTCUSD/VRT/INOD/MELI/TSCO/NOW/NVDA/SPY/QQQ + 1 forex; no -99% / far-zone regressions; no empty charts where structure exists.
- **Risks:** sandbox can't compile Pine (must test in TV). **Mitigation:** founder runs the Pine Editor pass; Codex reviews logic.
- **Not yet:** no new indicators, no MTF, no website.

## M2 — Soft Structure Channel (validated)
- **Goal:** the optional channel layer is clean, subtle, never fake, and toggleable — already implemented (v1.6), now **verified**.
- **Deliverables:** TV compile + visual verification across the test universe; tune `channelParallelTol` / `maxChannelWidthPct` / `minChannelQualityToShow` from real screenshots; confirm "Developing/None" behavior on wedges/noise.
- **Files touched:** `pine/rangeclarity_sr_core_v1.pine` (tuning only), `docs/rangeclarity_trendline_channel_layer_design.md`.
- **Estimate:** 3–5 days.
- **Acceptance:** channel appears only on real parallel structure; no clutter/giant fills; S/R unaffected; off-switch returns to pure v1.5 behavior.
- **Risks:** two-pivot channel instability. **Mitigation:** keep quality gate strict; defer regression-based channel to post-beta.
- **Not yet:** HTF channels, multi-channel, regression fits.

## M3 — Indicator event / alert schema
- **Goal:** the indicator emits **schema-shaped** events; schema v0.1 frozen.
- **Deliverables:** finalize `rangeclarity_shared_signal_schema.md`; map every `alertcondition` to an `eventType`; define the JSON alert message body; define `rangeClarityScore` v1 formula + the golden **test vectors** (input bars → expected schema).
- **Files touched:** `docs/rangeclarity_shared_signal_schema.md`, new `core/fixtures/` (data only), Pine alert message strings.
- **Estimate:** 4–6 days.
- **Acceptance:** schema reviewed (Codex); fixtures exist; a TV alert produces valid JSON; no advice wording.
- **Risks:** schema churn later. **Mitigation:** version it; additive-only changes after freeze.
- **Not yet:** building the receiver/scanner.

## M4 — Website Brain architecture
- **Goal:** concrete technical design for storage, scanner, brain API, and the canonical core port — decision-complete, minimal build.
- **Deliverables:** choose DB + hosting + data provider (cost/licensing checked); define snapshot/event/watchlist tables; stub `core/` (canonical scoring spec) and `app/api/` endpoints; data-licensing note in `decisions.md`.
- **Files touched:** `docs/`, `app/api/` (stubs), `core/` (spec scaffolding).
- **Estimate:** 1–1.5 weeks.
- **Acceptance:** founder-approved stack + data source; schema tables drafted; canonical-core spec maps to fixtures.
- **Risks:** market-data licensing/cost. **Mitigation:** pick a provider with clear personal/commercial terms; cache aggressively; start with EOD daily data.
- **Not yet:** real scanning, UI.

## M5 — Scanner MVP
- **Goal:** compute schema rows for a watchlist of symbols from historical daily OHLCV, passing parity fixtures.
- **Deliverables:** canonical core in TS; data adapter (EOD daily); batch job over a 20–50 symbol list → snapshot rows in DB; parity tests green vs Pine fixtures.
- **Files touched:** `core/`, `app/api/scan*`, DB.
- **Estimate:** 2–3 weeks.
- **Acceptance:** scanner output matches fixtures within tolerance; runs over the test universe; rows queryable.
- **Risks:** Pine↔TS divergence. **Mitigation:** fixtures gate every change; small symbol set first.
- **Not yet:** intraday, large universes, webhooks, AI.

## M6 — Market Room MVP
- **Goal:** a web page that shows ranked, explained structure cards for a watchlist.
- **Deliverables:** `rangeClarityScore` ranking; cards (symbol, bias, nearest S/R types+%, channel state, one-line template explanation); basic filters (bias, "near Strong/Key", "testing channel"); daily snapshot refresh.
- **Files touched:** `app/` (Market Room route), brain API.
- **Estimate:** 2–3 weeks.
- **Acceptance:** founder can open the page and, in <30s, see which of ~50 names are at a level and why; ranking feels reasonable; no advice language.
- **Risks:** ranking feels arbitrary. **Mitigation:** tune weights against real charts; show the *reason*, not just a number.
- **Not yet:** auth/billing, user accounts beyond a single founder list.

## M7 — Watchlist Radar
- **Goal:** user-managed watchlists + a daily brief of what changed / what's at a level.
- **Deliverables:** import (CSV/manual) and manage lists; per-list daily brief (top N by clarity + notable events); event history view.
- **Files touched:** `app/`, watchlist + events tables.
- **Estimate:** 1.5–2 weeks.
- **Acceptance:** create a list, get a useful daily brief; events accumulate and are browsable.
- **Risks:** noisy briefs. **Mitigation:** severity thresholds; cap items; "why" on each.
- **Not yet:** multi-user scale, notifications beyond on-site.

## M8 — TradingView alert / webhook sync
- **Goal:** live chart events from the indicator flow into the brain.
- **Deliverables:** authenticated webhook receiver (`app/api/linear/`-style pattern already exists for inbound endpoints); schema validation + dedup; events merged with scanner data in Market Room/history.
- **Files touched:** `app/api/`, events store.
- **Estimate:** 1–1.5 weeks.
- **Acceptance:** a real TV alert posts a valid event that appears in the Market Room/history; bad/unauth payloads rejected.
- **Risks:** spoofed/duplicate webhooks. **Mitigation:** shared secret, idempotency keys, rate limits.
- **Not yet:** per-user TV account linking (manual alert setup first).

## M9 — Hermes / AI explanation layer
- **Goal:** crisp, plain-language, **non-advice** explanations of why a chart is interesting.
- **Deliverables:** deterministic template explanations first; optional LLM phrasing constrained by a no-advice guardrail + eval set; explanations attached to cards/briefs.
- **Files touched:** `app/api/`, `hermes.md` patterns extended.
- **Estimate:** 1–2 weeks.
- **Acceptance:** explanations are accurate to the schema, readable, and never advisory (guardrail eval passes).
- **Risks:** hallucinated levels / advice drift. **Mitigation:** AI only phrases existing schema facts; guardrail + tests; template fallback.
- **Not yet:** chat, Q&A, autonomous agents.

## M10 — Closed beta readiness
- **Goal:** the whole loop is trustworthy for a handful of invited users.
- **Deliverables:** complete `rangeclarity_launch_readiness_checklist.md`; error logging; basic onboarding; feedback channel; invite-only access; indicator delivered invite-only (per CLAUDE.md).
- **Files touched:** `app/`, infra, docs.
- **Estimate:** 1.5–2 weeks.
- **Acceptance:** every checklist item green; 3–5 invited users complete onboarding and get value.
- **Risks:** premature scale. **Mitigation:** keep it invite-only; instrument feedback.
- **Not yet:** payments, public signup.

## M11 — Public landing & paid beta
- **Goal:** first paying users on a clear value proposition.
- **Deliverables:** landing page that explains the clarity value (reuse `app/` premium hero work); pricing; auth + payment provider (per `auth-billing-plan.md`, country-gated); onboarding; first-5-customers test.
- **Files touched:** `app/`, billing, auth.
- **Estimate:** 2–3 weeks.
- **Acceptance:** a new user can understand, sign up, pay, onboard, and get the indicator + Market Room value; no advice/compliance language.
- **Risks:** compliance/advice framing; payment-provider availability. **Mitigation:** legal review of copy; keep auth separate from payments; provider decision is a known blocker (O-001).
- **Not yet:** scaling, ads, integrations beyond TV.

---

## Cross-cutting "do not build yet" (until validated)
MTF confluence, intraday scanning at scale, broker/real-money links, mobile app, social features, an indicator marketplace, RSI/MACD/VWAP/OB/FVG/liquidity. Revisit only after the M5–M7 loop proves users care.
