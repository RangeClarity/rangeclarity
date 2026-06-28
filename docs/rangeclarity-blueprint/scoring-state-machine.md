# Scoring & state machine — V0.1 (transparent, no black box)

All numbers below are **seed values** to calibrate against golden fixtures, not final. Normalization: distances in **% of price and ATR-multiples** so a $10 and $500 stock compare. Every output carries component values, weights, thresholds, reasons, and confidence.

## Zone algorithm (deterministic)
1. Detect confirmed pivots `ta.pivothigh/low(L,R)` (lag = `R` bars, disclosed).
2. Cluster pivots within `ATR × k` (k≈0.6) into a band `[lo,hi]`.
3. **Strength** = f(reaction count, rejection magnitude in ATR, recency decay `0.97^barsAgo`, volume-at-level, role reversal, optional weekly confluence).
4. **Confidence** = f(reactions, data quality, width sanity). Keep ≤2 support + ≤2 resistance; draw nearest each side.
5. Outputs per zone: `{lo, hi, role, strength 0–100, confidence 0–100, reactions, recencyBars, distancePct, reasons[]}`. No future leakage; pivots confirm before use.

## Structure Score (0–100) — "is the chart strong?"
Weighted (seed): MA position & alignment .30 · MA slope .15 · HH/HL structure .20 · base/range quality .10 · relative strength .15 · volume quality .10. Penalties: structural breakdown −30, MA200 declining −15. Output components + reasons + confidence.

## Entry Score (0–100) — "is *now* a good place to buy?"
Weighted (seed): distance-from-support (closer = higher) .25 · reward:risk geometry .25 · extension (%, ATR; lower = higher) .20 · distance-to-resistance (more room = higher) .15 · distance-from-MA50 .10 · base/breakout context .05. Penalties: post-uncontrolled-move −20, gap/earnings risk −10, resistance < 3% away −15. Output components + reasons + confidence.

## No-Edge conditions (first-class outcome)
Return **No Edge** when any: conflicting MA structure (price above some, below others with flat slopes); price in **mid-range** (40–60% of range) with no breakout; nearest support > ~12% below **and** resistance < ~3% above (poor geometry); reward:risk < ~1:1; zone confidence < 35; ATR percentile in "shock"; missing confirmation; `dataQuality < 50`.

## Setup state — decision tree (evaluated top-down, on confirmed bars)
```
if dataQuality < 50            -> No Edge        (reason DATA_*)            // never fake confidence
elif No-Edge conditions met    -> No Edge        (reasons: which fired)
elif Structure < 45            -> Structurally Weak (price below MA200 / broken structure)
elif Entry >= 65 and Structure >= 60 and not extended and R:R >= ~1.5
                               -> Favorable      (TREND_STACK_BULLISH + SUPPORT_NEARBY + R/R_OK)
elif extended (>8% & >4xATR above support) or resistance too close
                               -> Extended       (EXTENDED_FROM_SUPPORT / RESISTANCE_TOO_CLOSE)
else                           -> Watch          (constructive but not yet a clean entry)
```
Confidence (separate from scores) downgrades on thin data, conflict, or low zone confidence. **Structure and Entry are never blended into one headline number** — the state is derived from both, transparently.

## Reason codes (engine → one UI sentence)
`TREND_STACK_BULLISH` · `PRICE_ABOVE_MA200` · `MA_SLOPE_RISING` · `MA_COMPRESSED` · `HH_HL_INTACT` · `SUPPORT_NEARBY` · `RESISTANCE_TOO_CLOSE` · `EXTENDED_FROM_SUPPORT` · `MID_RANGE_NO_EDGE` · `ENTRY_RISK_POOR` · `RR_FAVORABLE` · `RS_LEADER` · `RS_LAGGARD` · `DATA_HISTORY_INSUFFICIENT` · `DATA_VOLUME_UNRELIABLE` · `DATA_GAP_ANOMALY`.

Example sentence: *"Structure remains strong, but price is extended 9.2% above support and is approaching resistance, making the current entry unattractive."* (from `EXTENDED_FROM_SUPPORT` + `RESISTANCE_TOO_CLOSE` + high Structure + low Entry.)

## Preview vs confirmed
The forming bar may **preview** a state; it **locks on close**. Alerts fire only on `barstate.isconfirmed`. Historical bars render only confirmed states so backtest visuals match what users saw live.
