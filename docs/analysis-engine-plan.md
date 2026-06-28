# Analysis Engine — Current State & First Ticket (design only)

> **PROPOSAL. Nothing implemented.** Answers "what exists / what's hardcoded / what needs a real engine / first ticket / acceptance criteria" for the entry-quality + market-location product. Product intent owned by the founder spec (the 8 five-second questions; states Favorable/Watch/Extended/No Edge/Structurally Weak; **separate structural vs entry score**; "Stop chasing — know your location"). Related: `docs/project-state.md`, `docs/paid-beta-engineering-plan.md`.

## 1. What already exists
- **A real engine — but in Pine, on TradingView.** `RangeClarity_Core.pine` (v6, 465 lines, 10 `ta.*` calls) computes ATR, ADX/DMI trend strength, RSI, **one** EMA, pivot-high/low **S/R zones** (tolerance + touch-count strength proxy), **range position 0–100**, a regime/state machine (Compression/Expansion/Trending), a **regime-clarity score 0–100**, and a **zone-quality score**. This is genuine logic and a strong reference — but it runs in TradingView, not the web app.
- **A documented scoring philosophy.** `RANGECLARITY_ALGORITHM_DESIGN.md` / `_CORE_INDICATOR_SPEC.md` / `_ULTIMATE_CORE_SPEC.md` define `momScore`, **named penalties** (Chop −25, conflict −20, mid-range-no-breakout −15, …) and states (No Edge, Avoid Chase, Breakout Watch, Watch). This is the seed of a transparent, decomposable score.
- **A web presentation shell (UI only).** `components/ChartInstrument.tsx` (candles + volume + a smoothing line as SVG), `components/DashboardMock.tsx`, the `/designs/*` dashboards, the scenario switcher (`components/scenarioBus.ts`), and the approved vocabulary. The information *hierarchy* the spec wants largely exists as layout.

## 2. What is static or hardcoded
- **Every dashboard reading in the web app is mock data.** `lib/scenarios.ts` is "deterministic, illustrative … sample charts, not live data": candles are seeded-random and the bias/state/location/extension/interpretation strings are **hardcoded per scenario**. The only real math is a cosmetic 14-period `ema()` used to draw a line.
- Design-route dashboards (`app/designs/*/data.ts`) hardcode values like `momentum: "Strong but Extended"` and copy like `"78 / WAIT FOR PULLBACK"`.
- **No score is actually computed in the web app.** Nothing reads real OHLCV; nothing derives a state or score from data.

## 3. What requires a real calculation engine (does not exist in TypeScript)
All of the spec's 8 answers: trend health; **price vs 50/100/200 MA**; **MA alignment + slope**; S/R **zones** (range, strength, reaction count, recency, distance, invalidated); **price location** (at support / in range / near breakout / near resistance / extended / below invalidation); extension; the component sub-scores; the **structural-score vs entry-score separation**; the final **SETUP STATE** + plain-English explanation; the **risk map** (nearest support, invalidation, nearest resistance, approx reward:risk). Plus a **daily-OHLCV market-data source** to feed it (none today).

### Gap vs the new spec (important)
The current Pine/spec use a **single EMA + ADX/RSI**, not the **50/100/200-MA structure** the new spec centers on; and they don't yet **separate structural quality from entry quality** or output the exact `Favorable/Watch/Extended/No Edge/Structurally Weak` set or a reward:risk figure. So the new model is a **refinement** to be built fresh (in TS), using the Pine + algorithm docs as the formula reference for parity.

## 4. Decision required before committing (founder)
**Where does the engine run, and where does data come from?**
- **(A) Web-app TS engine + a market-data provider** (daily OHLCV API) → enables the spec's "enter ticker → web dashboard" workflow; needs a data-provider decision + the auth/billing gate. *The spec's described workflow implies this.*
- **(B) Stay a TradingView Pine indicator** (update Pine to the new 50/100/200 + state model) → no data provider; matches the TradingView-first model; the web app stays marketing.
- **(C) Both, kept in parity** (most work).

**EN-1 below (pure MA/trend math) is no-regret under (A) and (C), and still useful as the reference for (B).** Recommendation: confirm **(A)** if you want the web product; EN-1 is then the right first build.

## 5. First implementation ticket — EN-1

### EN-1 — Analysis engine core: Trend & Moving-Average Structure (pure, tested)
- **Priority** P0 (first product-engine slice) · **Owner** Claude Code (engine) · **Review** qa-engineer (tests) + founder (TA semantics) · **Depends on** EB-0 test runner *(or bundle a minimal Vitest config into this ticket so it is self-contained)* · **Effort** ~0.5–1d
- **Files likely to change:** `lib/engine/types.ts`, `lib/engine/movingAverages.ts`, `lib/engine/trend.ts`, `lib/engine/__tests__/*.test.ts`, `lib/engine/fixtures/*.json`, (maybe) `vitest.config.ts`, `package.json` (test scripts).
- **Scope (only this):** a pure, deterministic module that takes an array of **daily OHLCV bars** (from fixtures — **no data provider, no UI, no network**) and returns a typed, **decomposable** object:
  - `SMA50 / SMA100 / SMA200` (with explicit handling when history < period),
  - price-vs-each-MA (above/below + % distance),
  - **MA alignment** (bullish `50>100>200`, bearish `50<100<200`, or mixed),
  - **MA slope** per MA (rising / flat / falling via lookback + threshold),
  - a **transparent trend classification** `Bullish | Transitional | Bearish` derived from the above, **with the reasons attached** (every sub-decision exposed — no black-box number).
- **Out of scope (later tickets):** S/R zone detection, price location, extension, component scores, structural-vs-entry separation, final SETUP STATE, risk map, market-data provider, charting/UI, Pine parity port.

### Exact acceptance criteria
1. `lib/engine/` exposes a **pure function** (no I/O, no `Date.now`, no randomness) `analyzeTrend(bars: Bar[]): TrendResult` with exported TypeScript types.
2. `Bar` = `{ date: string; open: number; high: number; low: number; close: number; volume: number }`; input shorter than 200 bars still returns a valid result with MAs that lack history marked `null`/`insufficient` (no throw).
3. Output includes, for 50/100/200: the MA value (or `null`), `priceVsMA: "above"|"below"`, and `distancePct`; plus `alignment: "bullish"|"bearish"|"mixed"`, per-MA `slope: "rising"|"flat"|"falling"`, and `trend: "Bullish"|"Transitional"|"Bearish"` **with** a `reasons: string[]` explaining the classification.
4. **Golden-fixture unit tests** cover: a clean uptrend (price above all, 50>100>200 rising → Bullish), a downtrend (→ Bearish), a crossover/mixed case (→ Transitional), and an insufficient-history case — each asserting exact MA values (hand-verified) and the classification + reasons.
5. SMA values match an independent hand calculation to ≤0.01 on the fixtures.
6. Determinism: running twice on the same input yields identical output (asserted).
7. **Definition of done** (per `CLAUDE.md`): `npm test` green, `npm run lint` clean, `npm run typecheck` clean, `npm run build` passes, no secrets, no unrelated files changed, docs updated, reviewed by qa-engineer; founder confirms the trend semantics match intent.
- **Verification commands:** `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`.
- **Security considerations:** none (pure math, no I/O, no secrets, no PII).

### Why EN-1 first
Smallest coherent, fully testable slice; **zero external dependency** (no data provider, no auth, no UI); it is the input every later module (location, scoring, state) consumes; and it directly establishes the **transparent, decomposable** architecture the spec demands (and the structural-vs-entry split begins here, since structural quality is largely trend+MA+structure).

## Stop-doing now (per the MVP boundary)
No intraday/day-trading, no low-latency alerts, no broker execution, no social/community, no dozens of indicators, no AI price predictions, no projected-future arrows, no buy/sell commands. First version = **daily-chart swing** only.
