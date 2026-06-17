# MVP spec (DRAFT — Phase 1 seed, build only after architecture approval)

Working name: **RangeClarity Engine — Market Map**. Overlay indicator, Pine v6.

## MVP scope (smallest thing that feels like a real product)
Surface = one table + max 4 zones. Engine = 4 inputs → confidence → verdict.

### Modules in MVP
1. **Regime:** ATR percentile (compression/normal/expansion/shock) + range position (upper/mid/lower third).
2. **Structure & Bias:** confirmed swing pivots → last BOS/CHoCH → bias up/down/neutral.
3. **Smart Zones:** nearest support + nearest resistance (ATR-clustered, touch count, RVOL weight, recency). Max 2 each side; draw nearest only.
4. **Momentum/Volume confirm:** RSI-percentile + EMA slope + ADX gate; RVOL context. Confirm-only.
5. **Confidence 0–100:** weighted blend with explicit downgrades; explainable.
6. **Verdict:** No edge / Caution / Clean setup + bias color.

### Dashboard (one table, top-right)
`Ticker · Regime · Bias · Nearest support · Nearest resistance · Liquidity target · Confidence · Verdict`

### Inputs — beginner (5–7)
Sensitivity (pivot lookback), Zone strictness, Show zones (on/off), Momentum confirm (on/off), Theme, Advanced mode (toggle).

### Inputs — advanced (hidden groups)
Per-factor weights, ATR length/percentile window, ADX/RSI lengths, RVOL window, max zones, debug overlay, alert thresholds.

### Alerts (MVP)
- Zone of interest activated (price entered nearest zone, confirmed).
- Regime changed (confirmed).
- High-confidence confluence (score ≥ threshold, confirmed).
(No buy/sell wording. Descriptive only.)

### Out of scope for MVP (later)
FVG/OB arrays, CVD/delta approximation, historical-analog engine, multi-symbol, web export. See `future_modules.md`.

### Definition of done (MVP, quality Level 2)
Runs without errors on stocks-D, crypto-4H, index-1H; no repaint of confirmed outputs; ≤4 drawn objects + 1 table; "No edge" appears in genuinely unclear conditions; beginner can read the verdict in <5 seconds.
