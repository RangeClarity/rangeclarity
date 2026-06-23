# MVP spec (DRAFT — Phase 1 seed, build only after architecture approval)

> 2026-06-23 update: S/R Quality Upgrade is the current priority. Do not build
> the Volume / Liquidity Confirmation Engine now. Volume is parked for MVP and
> may return later only as a small context/tiebreaker around major zones.

Working name: **RangeClarity Engine — Market Map**. Overlay indicator, Pine v6.

## MVP scope (smallest thing that feels like a real product)
Surface = one table + max 4 zones. Engine = structure inputs → confidence → verdict.

### Modules in MVP
1. **Regime:** ATR percentile (compression/normal/expansion/shock) + range position (upper/mid/lower third).
2. **Structure & Bias:** confirmed swing pivots → last BOS/CHoCH → bias up/down/neutral.
3. **Smart Zones:** nearest support + nearest resistance (ATR-clustered, touch count, recency, freshness, reaction quality). Max 2 each side; draw nearest only.
4. **Momentum context:** RSI-percentile + EMA slope + ADX gate. Context-only.
5. **Confidence 0–100:** weighted blend with explicit downgrades; explainable.
6. **Verdict:** No edge / Caution / Clean setup + bias color.

### Dashboard (one table, top-right)
`Ticker · Regime · Bias · Nearest support · Nearest resistance · Location · Confidence · Verdict`

### Inputs — beginner (5–7)
Sensitivity (pivot lookback), Zone strictness, Show zones (on/off), Momentum confirm (on/off), Theme, Advanced mode (toggle).

### Inputs — advanced (hidden groups)
Per-factor weights, ATR length/percentile window, ADX/RSI lengths, max zones, debug overlay, alert thresholds.

### Alerts (MVP)
- Zone of interest activated (price entered nearest zone, confirmed).
- Regime changed (confirmed).
- High-confidence confluence (score ≥ threshold, confirmed).
(No buy/sell wording. Descriptive only.)

### Out of scope for MVP (later)
FVG/OB arrays, CVD/delta approximation, historical-analog engine, multi-symbol, web export. See `future_modules.md`.

### Definition of done (MVP, quality Level 2)
Runs without errors on stocks-D, crypto-4H, index-1H; no repaint of confirmed outputs; ≤4 drawn objects + 1 table; "No edge" appears in genuinely unclear conditions; beginner can read the verdict in <5 seconds.
