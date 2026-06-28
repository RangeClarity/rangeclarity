# RangeClarity S/R Core — v1.2 patch notes (BTCUSD far-zone fix + UX)

Scope: a focused, additive fix on `pine/rangeclarity_sr_core_v1.pine` for the BTCUSD/Bitstamp daily "support near 0 / −99.9%" report. **No rewrite, no architecture change, no new indicators.** Diagnosis: `docs/rangeclarity_btcusd_daily_diagnosis.md`. Builds on v1.1 (`docs/rangeclarity_sr_core_v1_1_patch_notes.md`).

## Root cause (one line)
An ancient but **real** Bitstamp pivot low (~$100-era BTC) survived in the zone array and was selected/displayed because v1 had **no validity or distance relevance filter** — so a zone ~99.9% below price was eligible for both the chart and the dashboard.

## What changed (and why)

1. **Validity layer — `f_isValidZone(z)` (P0).** New helper rejects degenerate zones: NA `mid/top/bottom`, non-positive `mid`/`top`, `bottom < mintick`, inverted `top < bottom`, or `createdBar <= 0`. *Every* selection and dashboard path now requires it, so an invalid zone can never be drawn or counted.

2. **Max-display-distance gate — `maxDistPct` + `f_inRange(z)` (P0).** New input **Max display distance (%)** (default **30**) hides zones farther than that from price. New input **Show far zones (history mode)** (default off) overrides the gate for inspection. This is what removes the −99.9% BTC zone from view while keeping it tracked.

3. **Bucket-based visual selection (P0).** Replaced the single bias-driven `f_topN` dump with explicit, de-duplicated buckets:
   - **Nearest S / Nearest R** — closest valid, in-range zone on each side (`f_nearestIdx`).
   - **Strong S / Strong R** — highest-score valid, in-range zone on each side (`f_strongestIdx`).
   - **Bias extras** — Bullish adds resistance **Above**; Bearish adds support **Below** (`f_topN`, now validity+range filtered).
   - **Sideways** — **Range High / Range Low** from strongest-or-nearest.
   - De-duplication (`f_addSel` via `array.includes`) collapses nearest+strongest to one box when they're the same zone.

4. **Dashboard rewrite — "Visible" vs "Tracked" (P1).** Nearest support/resistance and "Strongest zone" now read from the same valid+in-range buckets (no more full-array scan). Table expanded to 9 rows; added **Visible zones** (count actually drawn) and **Tracked zones** (full internal array), so a user sees e.g. *Visible 4 / Tracked 49* instead of a misleading single number.

5. **Neutral labels.** Roles on labels are **Nearest S, Nearest R, Strong S, Strong R, Range High, Range Low, Above, Below** with signed % (Range rows omit %). No Target/Defense/buy-sell language.

6. **Defensive `if` instead of ternary for `array.get` (P0 safety).** Dashboard nearest/strongest distance reads use guarded `if idx >= 0` blocks rather than `idx >= 0 ? array.get(...) : na`, because Pine can evaluate both ternary branches — which would re-introduce an `array.get index out of bounds` runtime error on a `-1` index.

## New inputs
- **Max display distance (%)** — `maxDistPct`, default 30, min 1.
- **Show far zones (history mode)** — `showFar`, default false.

## What was intentionally NOT changed
- Scoring model, merge logic, bias model, pivot/zone creation — unchanged (the ancient zone was *valid input*, not a scoring/merge bug).
- No new indicators, MTF, VWAP, RSI/MACD, order blocks, FVG, liquidity, signals, or strategy entries.
- Alert conditions and v1.1 event-flag/lifetime fixes — unchanged.

## Known limitations (still true after v1.2)
- **Not yet compiled in TradingView by us** — static edits + self-review only; a Pine Editor compile pass is still required.
- A very quiet instrument could have *all* zones beyond `maxDistPct`; raise it or enable **Show far zones**.
- Distance gate is symmetric % around price; it does not yet adapt to volatility/ATR (possible future refinement).
- Pivot confirmation lag and the "current structure on the latest bar" rendering model from v1/v1.1 are unchanged.

## How to test (BTCUSD daily)
See the manual test plan in `docs/rangeclarity_btcusd_daily_diagnosis.md` — in short: BTCUSD/Bitstamp/1D should show no −99.9% zone, a realistic nearest support, and a Visible-vs-Tracked split; toggling **Show far zones** brings the ancient zones back.

## Next step
Compile in the Pine Editor and run the BTCUSD + AAPL + EURUSD daily checks. The next substantive pass (separate, reviewed) remains scoring + merge calibration; an ATR-adaptive distance gate is a candidate add-on.
