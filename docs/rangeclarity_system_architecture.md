# RangeClarity — System Architecture

Status: planning (no implementation implied). Companion to `rangeclarity_master_vision.md` and `rangeclarity_shared_signal_schema.md`. Builds on the existing `docs/rangeclarity-blueprint/` and `docs/ARCHITECTURE.md`.

## Layers (responsibility map)

1. **TradingView Pine Indicator layer** — `pine/rangeclarity_sr_core_v1.pine`. The on-chart visual: S/R zones (Local/Key/Strong), Soft Structure Channel, market bias, distances, dashboard, descriptive alerts. Single timeframe, confirmed pivots, no signals. Emits alert events shaped to the shared schema. **Visible truth for one chart.**
2. **Canonical Scoring Core** — a tested, framework-agnostic spec of the structure math (pivots → zones → scoring → bias → channel → events). The Pine indicator is one implementation; the website re-implements the same spec. Parity enforced by shared **test vectors** (golden fixtures). This is the "one brain, two bodies" anchor (decision D-006 / Path E).
3. **Data / Scanner layer** — pulls historical + recent OHLCV for a universe of symbols/watchlists, runs the canonical core over each, writes schema rows. Batch (daily/intraday cron) + on-demand. Owns data adapters, rate limits, caching, and the symbol universe.
4. **Event / Webhook Sync layer** — receives TradingView alert webhooks (schema-shaped), validates/auth-checks them, deduplicates, and writes events to the store. Bridges live chart events into the brain.
5. **Storage layer** — current structural snapshot per symbol/timeframe + append-only event history + user watchlists/presets. (Snapshot table, events table, watchlist table.)
6. **Website Brain (API + ranking)** — the service that reads snapshots/events, computes the **rangeClarityScore** ranking, filters ("near Strong S", "testing channel", "bias flipped"), and serves the UI. Owns ranking logic and query API.
7. **Watchlist layer** — user-defined symbol lists; the unit the scanner and Market Room operate on. Import from CSV/manual now; TradingView watchlist sync later.
8. **Market Room / Watchlist Radar layer** — the primary web UI: ranked, explained cards of the charts worth watching today, with filters and a daily brief.
9. **Hermes / AI explanation layer** — turns schema rows + events into short, plain-language, *non-advice* explanations ("why this chart is interesting"). Deterministic templates first; LLM phrasing later, constrained by a no-advice guardrail.
10. **User settings / presets layer** — thresholds, universe, notification prefs, saved filters; shared defaults so chart and web agree.
11. **Future SaaS layer** — auth, billing, plans, usage limits, onboarding. Designed for (see `auth-billing-plan.md`) but **not built until the core loop is validated**; auth stays separate from the payment provider.

## ASCII architecture diagram

```
                 ┌──────────────────────────────────────────────┐
                 │         CANONICAL SCORING CORE (spec)         │
                 │  pivots → zones → score → bias → channel →    │
                 │  events     (golden test vectors enforce      │
                 │             parity across both bodies)        │
                 └───────────────┬───────────────┬──────────────┘
                  implemented as │               │ implemented as
                                 ▼               ▼
        ┌─────────────────────────────┐   ┌────────────────────────────┐
        │   PINE INDICATOR (chart)     │   │   SCANNER (server)          │
        │  S/R map · channel · bias    │   │  universe × timeframe →     │
        │  dashboard · alerts          │   │  schema rows (batch+ondemand)│
        └───────────────┬─────────────┘   └───────────────┬────────────┘
            TV alerts →  │ webhook (schema-shaped events)  │ writes
                         ▼                                 ▼
                 ┌──────────────────┐            ┌──────────────────────┐
                 │ EVENT/WEBHOOK    │──────────► │   STORAGE             │
                 │ SYNC (auth/dedup)│            │ snapshots · events ·  │
                 └──────────────────┘            │ watchlists · presets  │
                                                 └─────────┬────────────┘
                                                           ▼
                                          ┌────────────────────────────────┐
                                          │   WEBSITE BRAIN (API + ranking) │
                                          │  rangeClarityScore · filters    │
                                          └───────┬───────────────┬────────┘
                                                  ▼               ▼
                                     ┌──────────────────┐  ┌────────────────────┐
                                     │  MARKET ROOM /    │  │  HERMES / AI        │
                                     │  WATCHLIST RADAR  │◄─┤  explanations       │
                                     │  ranked cards +   │  │  (no-advice guard)  │
                                     │  daily brief      │  └────────────────────┘
                                     └─────────┬────────┘
                                               ▼
                                   ┌────────────────────────┐
                                   │  USER: watchlists,      │
                                   │  settings/presets,      │
                                   │  (future) auth/billing  │
                                   └────────────────────────┘
        Round-trip: Brain surfaces a name ──► user opens it in TradingView ──►
        Indicator shows the identical structure (same schema language).
```

## Key design decisions
- **Schema-first.** Both bodies speak `rangeclarity_shared_signal_schema.md`. Build the schema before the scanner.
- **Parity by test vectors, not by sharing a runtime.** Pine can't import the TS core; instead golden fixtures (input OHLCV → expected schema) gate both implementations. Divergence is the #1 architectural risk (see strategy doc).
- **Snapshot + event split.** Snapshots answer "state now"; events answer "what changed." Ranking uses both.
- **Brain is read-optimized.** Scanner writes; brain reads/ranks; UI never recomputes structure.
- **Webhook is additive, not required.** The scanner alone can power the MVP; TV webhooks enrich it later (M8).
- **AI is the last mile, constrained.** Hermes phrases facts already in the schema; it never invents levels or gives advice.

## What lives where (initial)
- Pine: `pine/`. Canonical core spec + test vectors: `docs/rangeclarity-blueprint/` + a future `core/` (spec) and `core/fixtures/`. Web: `app/` (Next.js, already present) + `app/api/` for scanner/brain endpoints. Storage: a hosted DB (chosen at M4). Hermes: existing `hermes.md` patterns, extended with the no-advice guard.

## Explicitly out of scope for v1 architecture
Multi-timeframe confluence engine, real-money integrations, social/sharing, mobile app, broker connectivity. These are post-beta and must not pull focus.
