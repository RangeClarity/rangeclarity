# Engine module map — Pine runtime, V0.1

The 14 Pine modules and their concrete V0.1 design. The canonical TS core (`docs/analysis-engine-plan.md`) is the authoritative spec for every formula here; Pine re-implements and is parity-checked. All structural decisions fire on `barstate.isconfirmed` (see `scoring-state-machine.md` + `repainting_rules`).

### 1. Data Quality Gate
Emit `dataQuality 0–100` + warnings; **never show a confident score on thin data.** Checks: bars available ≥ 200 (else MA200 = insufficient → cap confidence); any `na`/zero-volume bars; abnormal gap (|gap| > N×ATR) flag; non-equity / unsupported type; thin liquidity (median volume floor). Reason codes: `DATA_HISTORY_INSUFFICIENT`, `DATA_VOLUME_UNRELIABLE`, `DATA_GAP_ANOMALY`.

### 2. Moving-Average Structure
`SMA50/100/200`; `priceVsMA` per average; **alignment** (50>100>200 bullish / inverse bearish / mixed); **slope** per MA. **Normalize so a $10 and a $500 stock compare:** distances as **% of price** *and* **ATR-multiples**; slope as **% change over 20 bars** (and ATR-normalized). Output `maAlignmentScore 0–100`. Reason codes: `TREND_STACK_BULLISH`, `PRICE_ABOVE_MA200`, `MA_COMPRESSED`, `MA_SLOPE_RISING`.

### 3. Trend Structure
Confirmed swing pivots (`ta.pivothigh/low(left,right)`) → higher-high/higher-low vs lower-high/lower-low → last break of structure → `trend ∈ {Bullish, Transitional, Bearish}` with reasons. Lagging by `right` bars **by design** (disclosed).

### 4. Support/Resistance Zone Engine
Deterministic, **zones not lines** (see `scoring-state-machine.md` §zones). Pivots → ATR-cluster nearby pivots into a band → score by reactions, rejection magnitude, recency decay, volume-at-level, role reversal, optional weekly confluence. Keep **≤2 support + ≤2 resistance**, draw nearest only. Each zone: `{lo, hi, role, strength, confidence, reactions, recencyBars, distancePct, reasons[]}`.

### 5. Price Location Engine
Where price sits: `at support | inside range | near breakout | near resistance | extended above support | below invalidation`, from distance to nearest zones + range position. Reason codes: `SUPPORT_NEARBY`, `RESISTANCE_TOO_CLOSE`, `MID_RANGE_NO_EDGE`.

### 6. Extension Engine
Distance above nearest confirmed support and above MA50, in **% and ATR**; flag `EXTENDED_FROM_SUPPORT` when > thresholds (e.g., > 8% and > 4×ATR). Feeds Entry score down.

### 7. Relative Strength Context
`request.security("AMEX:SPY")` (and optional sector ETF): ratio vs benchmark over 50/100 bars → `rsScore 0–100`. Reason: `RS_LEADER` / `RS_LAGGARD`. (Not a screener column — see boundaries.)

### 8. No-Edge Filter
First-class outcome (not just a low score). Triggers in `scoring-state-machine.md` §No-Edge: conflicting MAs, mid-range, support too far / resistance too close, weak R:R, unreliable zones, abnormal volatility, missing confirmation, low data quality.

### 9. Structure Score (0–100)
Company/chart quality: price vs MA50/100/200, MA alignment + slope, HH/HL structure, base/range quality, relative strength, volume quality, absence of breakdown. Weighted, component breakdown + reasons + confidence. Seed weights from `RANGECLARITY_ALGORITHM_DESIGN.md`.

### 10. Entry Score (0–100)
Location *now*: distance from confirmed support, distance from invalidation, distance to resistance, distance from MA50, extension (%, ATR), reward:risk geometry, breakout extension, gap risk, in/above/below base, post-uncontrolled-move flag. Component breakdown + reasons + confidence. **Deliberately independent of Structure** — this is the anti-chasing core.

### 11. Setup State Machine
`Favorable | Watch | Extended | No Edge | Structurally Weak` via the transparent tree in `scoring-state-machine.md`. No blended headline number.

### 12. Explanation / Reason Codes
Engine emits structured codes (e.g., `TREND_STACK_BULLISH`, `EXTENDED_FROM_SUPPORT`, `RESISTANCE_TOO_CLOSE`, `ENTRY_RISK_POOR`, `DATA_HISTORY_INSUFFICIENT`). The UI composes **one sentence**. An LLM may *later* rephrase reasons for clarity but **must not** change scores or state.

### 13. Visualization Adapter
One compact table (Setup State, Entry, Structure, Location, support/resistance, extension, MA structure, RS, sentence) + ≤4 zone boxes + MA lines + current-price marker. Preview vs confirmed styling.

### 14. Alert Adapter
Confirmed-bar `alert()` events (state change, zone activated, became Extended/Favorable) → optional TradingView webhook → RangeClarity backend. Descriptive only, never buy/sell.
