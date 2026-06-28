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

# RangeClarity — Ultimate Core Specification

**File:** `pine/rangeclarity_ultimate_core.pine` · **Platform:** TradingView, **Pine Script v6** · **Type:** overlay
**Status:** Spec for the stable core, synthesized from concepts extracted from 18 research indicators (see `indicator_research_library/`). This evolves the earlier `RangeClarity_Core.pine` by upgrading the zone-strength and confidence engines and adding a compression score, a range meter, a context line, and a `Risk Elevated` state.

> Pine version choice: **v6**. It is the current stable version and what 17 of 18 research sources use. (The brief said "use v5 if unsure" — we are not unsure; v6 is correct and consistent with the corpus.)

---

## 1. Product principles (binding)

Simple on the surface, complex underneath. Helps users understand regime, structure, support/resistance, range position, momentum, volatility/compression, confidence, no-edge, entry-quality *context*, and the risk of chasing late moves. It **never** outputs buy/sell signals, profit promises, win-rate claims, financial advice, or fake AI prediction. No-edge is a feature.

All scoring is **explainable** — re-implemented weighted-feature math, never a black box. (Two "AI" sources in the corpus were found to be k-NN/Fisher and linear-regression/ADAM; we keep the explainable spirit, not the opacity.)

---

## 2. Modules (stable core only)

### 2.1 Regime
Classifies the environment from ATR percentile (volatility state), a **compression score** (percentile-ranked range tightness — *concept ex NR2–NR20, Zeiierman*), and ADX/DMI (trend strength, with a stepped-stability mindset *ex Trend Impulse, Zeiierman*).
Outputs: `Trend` · `Range` · `Compression` · `Expansion` · `Chop` · (→ feeds `No Edge`).

### 2.2 Structure
Confirmed swing pivots → HH/HL/LH/LL bias (*ex Dynamic Swing, Zeiierman*), break of structure with a **strong-close filter** (≥ a fraction of the candle body beyond the level, *ex Smart Money, AlgoAlpha*), and failed-breakout detection.
Outputs: `Bullish` · `Bearish` · `Neutral` · `Range-bound` · `Breakout attempt` · `Failed breakout`.

### 2.3 Support / Resistance (upgraded zone engine)
Builds ATR-width zones by **clustering confirmed pivots and counting touches** (*ex Support Resistance Channels, LonesomeTheBlue*), then scores each zone by **strength × proximity × age-maturity** (*ex Liquidity Magnet Pro, JOAT*) with a **volume-percentile modifier** (*ex Volumatic S/R, BigBeluga*). Draws nearest support + nearest resistance only.
Outputs: `Support zone` · `Resistance zone` · `Current range` · `Near support` · `Mid range` · `Near resistance`, plus a 0–100 **Zone Strength**.

### 2.4 Momentum (confirm-only)
Direction (RSI vs 50 + EMA slope) and strength (ADX + slope magnitude), with extension/exhaustion via ATR distance + RSI extreme. Never an entry trigger by itself.
Outputs: `Strong` · `Improving` · `Fading` · `Extended` · `Weak` · `Neutral`.

### 2.5 Confidence (0–100, explainable)
Weighted blend of regime clarity, structure quality, momentum-confirms-bias, and zone quality — with **proximity weighting** (*ex Magnet*) and a **volume-confirmation** nudge (*ex Volume Bubbles, QuantAlgo*) — minus explicit named penalties.
Outputs: `High` · `Medium` · `Low` · `Conflicting`.

### 2.6 No-Edge / Decision context
Tells the user when not to act, each state carrying a **one-line reason** (the "Blocker Lens" abstraction borrowed in concept from FVG — *we borrow only the idea of naming the blocker, none of its signal machinery*).
Allowed context labels: `Watch` · `Wait` · `No Edge` · `Avoid Chase` · `Breakout Watch` · `Pullback Zone` · `Strong Context` · `Risk Elevated`.

> **Retired legacy wording (superseded):** `Avoid Chase`, `Pullback Zone`, `Breakout Watch`, and `Wait` (as an instruction) are **retired** under the V2 language policy (`docs/RANGECLARITY_V2_SURFACE_SPEC.md` → Language policy) and are forbidden by the Live QA compliance rule (`compliance.forbidden_word`). Use structure / location / regime / quality language instead (e.g. *Extended* / *Stretched* / *Upper Range*; *Near Key Support* / *Retest Area* / *Lower Range*).
No-Edge reasons: `No Edge` · `Wait` · `Too extended` · `Mid-range chop` · `Conflicting signals` · `Poor risk/reward`.
**Forbidden labels:** Buy · Sell · Guaranteed Entry · Profit Prediction · 99% Win Rate.

### 2.7 Dashboard
One compact, color-coded table + a small range meter + a single plain-English context line.

```
RangeClarity                    AAPL | 1D
Regime          Compression
Structure       Range-bound
Range Position  Upper Range  78%   �#######...#
Momentum        Strong but Extended
Zone Strength   Resistance  72
Confidence      Medium  58
Context         Wait for Pullback
Note            Coiled near resistance; mid-range R/R is poor.
State           confirmed · not advice
```

Color language (≤6 colors): green = aligned/strong, blue = breakout/improving, teal = pullback, amber = watch/medium/extended, red = conflicting/avoid-chase/risk, grey = wait/no-edge/low.

---

## 3. Scoring summary (detail in `RANGECLARITY_ALGORITHM_DESIGN.md`)

| Score | Range | Meaning |
|---|---|---|
| Compression Score | 0–100 | How unusually tight the recent range is |
| Range Position Score | 0–100 | Where price sits between nearest support and resistance |
| Structure Score | 0–100 | Cleanliness/alignment of structure |
| Momentum Score | 0–100 | Direction + strength (confirm-only) |
| Zone Strength | 0–100 | touches × proximity × maturity × volume-percentile |
| Confidence Score | 0–100 | Weighted blend − named penalties |
| No-Edge Penalty | subtracts | Chop, conflict, mid-range, shock, extension, failed breakout |

**No fake precision:** whole numbers only; if signals conflict, confidence drops and labels "Conflicting"; if there is no edge, it says so.

---

## 4. Inputs (minimal)

**Basics (≤7):** Sensitivity (pivot lookback), Zone width (×ATR), Show zones, Show range bounds & meter, Use momentum in confidence, Theme, Dashboard position.
**Advanced (one group, strong defaults):** ATR length/percentile window, ADX length, RSI length, EMA length, compression lookback, pivots remembered, confidence thresholds, four module weights, volume-confirmation toggle.

---

## 5. Alerts (descriptive only, confirmed-bar gated)

`Near Support` · `Near Resistance` · `Breakout Watch` · `No Edge / Wait` · `Momentum Extended` · `Confidence Improved`. No buy/sell wording.

---

## 6. Repaint posture

Pivots confirm `sensitivity` bars late (honest lag, never back-dated). Verdict, zones, and alerts use confirmed relationships; alerts gated on `barstate.isconfirmed`. No `request.security`/lookahead. The live bar may preview the confidence number; final on close (`forming`/`confirmed` shown). No-edge is repaint-safe by design.

---

## 7. Definition of done

Compiles in the TradingView Pine Editor with no errors; confirmed outputs don't repaint; ≤ (1 table + 2 boxes + 2 lines + 1 meter) objects; "No Edge/Wait/Risk Elevated" appears in genuinely unclear/risky conditions; readable in < 5 seconds; strong defaults out of the box.
