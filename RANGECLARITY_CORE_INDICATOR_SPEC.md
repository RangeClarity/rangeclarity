> **LEGACY v1 — decision-support era. SUPERSEDED.**
> This document describes the original RangeClarity (Regime / Structure / S-R /
> **Momentum** / **Confidence** / **No-Edge verdict** with labels like *Avoid Chase*,
> *Pullback Zone*, *Breakout Watch*, *Wait*, and a **Volume** confirmation factor).
> It is retained for history only. The canonical product is now the **calm-structure
> V2** spec: `docs/RANGECLARITY_V2_SURFACE_SPEC.md` + `docs/RANGECLARITY_V2_ENGINE_SPEC.md`.
> Momentum, Confidence verdicts, the No-Edge/Avoid-Chase/Pullback/Wait instruction
> labels, `poor R/R`/`size down` wording, and the Volume engine described below are
> **RETIRED**. Do not implement from this file.

---

# RangeClarity Core Indicator — Specification

**File:** `RangeClarity_Core.pine` · **Platform:** TradingView, Pine Script v6 · **Type:** overlay
**Status:** Stable MVP. Implements the six core modules and nothing else.

---

## 1. What this is (and is not)

RangeClarity is a **chart-structure and decision-support tool**. It reads the market and renders one clean dashboard: regime, structure, range position, momentum, confidence, and a decision context — including an explicit **No-Edge / Wait** state.

It is **not** a buy/sell signal bot, does **not** predict price, does **not** promise profits, and is **not** financial advice. The dashboard footer and all alert messages restate this.

**Design law:** simple on the surface, complex underneath. One table + at most four drawn objects. Everything that drives the verdict is computed on **confirmed bars** to avoid repainting.

---

## 2. The six core modules

### 2.1 Regime
Identifies the environment. Inputs: ATR percentile (volatility state) + ADX/DMI (trend strength).

| Output | Condition (plain English) |
|---|---|
| Compression | Low ATR percentile (<25), not trending |
| Expansion | High ATR percentile (>75) while trending |
| Trend | ADX strong (≥22) |
| Range | ADX weak (<18) |
| Chop | Messy / none of the above → tends toward No Edge |

### 2.2 Structure
Reads chart skeleton from confirmed swing pivots. Tracks last two highs/lows → HH/HL/LH/LL → bias; detects break of structure and failed breakouts.

Outputs: `Bullish` · `Bearish` · `Neutral` · `Range-bound` · `Breakout attempt` · `Failed breakout` (+ bias Up/Down/Neutral).

### 2.3 Support / Resistance
Builds ATR-width **zones** from confirmed pivots. Draws only the nearest support and nearest resistance (≤2 boxes) + optional dashed range bounds. Zone strength = count of clustered touches.

Outputs (range position): `Upper Range` · `Mid Range` · `Lower Range`, plus near-support / near-resistance flags.

### 2.4 Momentum (confirm-only)
Direction (RSI vs 50, EMA slope) + strength (ADX, RSI distance, slope magnitude) → one 0–100 score and a label. **Never an entry trigger by itself.**

Outputs: `Strong` · `Improving` · `Fading` · `Extended` · `Weak` · `Neutral`.

### 2.5 Confidence (0–100)
Weighted blend of regime clarity, structure quality, momentum confirmation, and zone quality, minus explicit penalties. See §4.

Outputs: `High` · `Medium` · `Low` · `Conflicting`.

### 2.6 No-Edge / Decision context
Tells the user when not to act. Checked in priority order; emits one decision label + a one-line reason.

Allowed labels: `No Edge` · `Wait` · `Avoid Chase` · `Breakout Watch` · `Pullback Zone` · `Strong Context` · `Watch`.
**Forbidden, by design:** Buy · Sell · Guaranteed Entry · Profit Prediction · Win-rate claims.

> **Retired legacy wording (superseded):** `Avoid Chase`, `Pullback Zone`, `Breakout Watch`, and `Wait` (as an instruction) are **retired** under the V2 language policy (`docs/RANGECLARITY_V2_SURFACE_SPEC.md` → Language policy). They are forbidden by the Live QA compliance rule (`compliance.forbidden_word`) and must not be surfaced in product output. Replace with structure / location / regime / quality language (e.g. *Extended* / *Stretched* / *Upper Range* for the former "Avoid Chase"; *Near Key Support* / *Retest Area* / *Lower Range* for the former "Pullback Zone").

---

## 3. The dashboard (the whole UI)

One small table, position configurable (default top-right):

```
RangeClarity                 AAPL | 1D
Regime          Compression
Structure       Range-bound
Range Pos.      Upper Range | 78%
Momentum        Strong but Extended
Confidence      Medium | 58
Context         Wait for Pullback
Why             Mid-range - poor R/R
State           confirmed | not advice
```

Color logic: green = strong/aligned, blue = breakout/improving, teal = pullback, amber = watch/medium/extended, red = conflicting/avoid-chase, grey = wait/no-edge/low. The **State** row shows `forming` vs `confirmed` so the user always knows if the read is final.

---

## 4. Scoring model

All scores 0–100; whole numbers only (no fake precision).

1. **Range Position Score** — `(close − support) / (resistance − support) × 100`. Where price sits in its range.
2. **Momentum Score** — `clamp(50 + (RSI−50)×0.6 + slopeNorm×12 + (ADX−20)×0.5, 0, 100)`.
3. **Structure Score** — by structure label (clean trend 80 → failed breakout 34).
4. **Confidence Score** — `clamp(weightedBase − penalties, 0, 100)` where
   `weightedBase = (regimeScore·wR + structScore·wS + momoConfirm·wM + zoneScore·wZ) / Σw`.
5. **No-Edge penalties** (subtracted from confidence): Chop −25, conflict −20, mid-range no-breakout −15, volatility shock −15, extended −10, failed breakout −10.

Default weights: structure 0.30, regime 0.25, momentum 0.25, zone 0.20 (all user-adjustable in Advanced).

### How confidence works (summary)
Confidence rewards module **agreement** and punishes named conflict conditions. Because every penalty is explicit and documented in code, any score can be explained in one sentence. If conditions are messy, the score is low — it never inflates just because many things fire.

### How no-edge works (summary)
The verdict engine evaluates, in order: conflict / chop / low-confidence → `No Edge`; extended + big move → `Avoid Chase`; compression near a boundary → `Breakout Watch`; compression otherwise → `Wait`; trend pulling into support/resistance → `Pullback Zone`; high confidence + aligned → `Strong Context`; mid-range → `Wait`; else `Watch`. "No edge" is repaint-safe because it asserts no level.

---

## 5. Inputs

**Basics (6):** Sensitivity (structure lookback), Zone width (×ATR), Show zones, Show range bounds, Use momentum in confidence, Theme, Dashboard position.
**Advanced (strong defaults):** ATR length/percentile window, ADX length, RSI length, EMA length, pivots remembered, confidence thresholds, four module weights.

---

## 6. Alerts (descriptive only, confirmed-bar gated)

Near Support · Near Resistance · Breakout Watch · No Edge / Wait · Momentum Extended · Confidence Improved. No buy/sell wording. No directional instruction.

---

## 7. Repainting posture

- Swing pivots confirm `sensitivity` bars after the fact — accepted, honest lag; never back-dated.
- Verdict and alerts use confirmed relationships; alerts gated on `barstate.isconfirmed`.
- The live bar may *preview* a confidence number; it is final only on close (dashboard shows `forming`/`confirmed`).
- No `request.security` lookahead is used in the MVP (no MTF yet).

---

## 8. How to use it on TradingView

1. Open TradingView → **Pine Editor** (bottom panel).
2. Paste the full contents of `RangeClarity_Core.pine`.
3. Click **Add to chart**. The dashboard appears (default top-right).
4. Tune **Sensitivity** to your timeframe (higher = cleaner/slower swings) and **Zone width** to taste.
5. Read it top-down: Regime → Structure → Range → Momentum → Confidence → Context. If Context says **No Edge / Wait**, the tool is telling you there is nothing clean here.
6. (Optional) Create alerts from the six conditions; messages are descriptive, not advice.

**Recommended timeframes:** swing/position use — 1H, 4H, 1D. Works on stocks, ETFs, crypto, FX. Give it enough history (a few hundred bars) for pivots and percentiles to populate.

---

## 9. Definition of done (met)

Runs without errors on stocks-D, crypto-4H, index-1H; confirmed outputs do not repaint; ≤4 drawn objects + 1 table; "No Edge" appears in genuinely unclear conditions; a beginner can read the verdict in under five seconds. Final compile verification is performed in the TradingView Pine Editor (see test plan).
