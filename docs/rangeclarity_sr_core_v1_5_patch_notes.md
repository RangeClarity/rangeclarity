# RangeClarity S/R Core — v1.5 patch notes (robust fallback, tier labels, honest price discovery)

Scope: a focused fix on `pine/rangeclarity_sr_core_v1.pine` so strong trending charts (VRT, INOD, MELI, TSCO, BTCUSD) show a useful structure map and never look broken. **No rewrite, no new indicators, no signals.** Diagnosis: `docs/rangeclarity_vrt_empty_structure_diagnosis.md`. Builds on v1.4.

## Root cause (one line)
On a parabolic uptrend (VRT) the nearest confirmed pivot and the single 50-bar lowest-low were both beyond the fallback budget, and the fallback never consulted the **nearest recent pullback low** — so visible levels = 0 and the dashboard went blank, even though support clearly existed.

## What changed (and why)

1. **Robust, asymmetric fallback (P0).**
   - **Support** (`f_fallbackSup`): the nearest (highest below price) of {nearest support zone, **recent pullback low** `lowest(pullbackLookback)`, structure low `lowest(fallbackLookback)`} within `fallbackDist`. The short pullback window is what fixes VRT — in a trend the recent pullback low is the real, near support.
   - **Resistance** (`f_fallbackRes`): only a **real confirmed pivot-high zone** above price within `fallbackDist`. It never uses a raw high, so price discovery cannot invent fake overhead supply.
   Fallback draws subtle dashed **Local** lines only, one per empty side, and only when visible `< minVisibleLevels`.

2. **Honest "price discovery" handling (P0).** When there is no resistance above, the dashboard says **"none above"**, or **"price discovery"** when price is at/near the lookback high. No fake resistance line is ever drawn.

3. **Quality-tier labels (P1).** Render and labels now derive a tier from score: **Strong** (≥ strongThr) → box (or thick solid line if too tall), **Key** (≥ medThr) → clean thin solid line, **Local** (< medThr) → subtle dashed line. Labels: `Strong S • 91`, `Key R • 82`, `Local S • -3.2%` (Strong/Key show score; Local shows %). **"Swing S/R" removed.**

4. **Dashboard understands fallback (P1).** Nearest support/resistance show **tier + distance** (`Local S -8.4%`), or the fallback Local, or **"none above"** / **"none nearby"**. "Strongest zone" is a single row → `Strong S 91` / `Key R 78` / **"none local"**. Count row is **Visible levels** (primary + fallback). No blank values when a fallback exists.

5. **Cleaner internals (P1).** Selection simplified to a de-duplicated set of zone indices (`f_pushUniq`); the strongest-zone dashboard lookup uses nested guards (not `and array.get`) to avoid a `-1`-index runtime error; fallback toggle relabeled "Show fallback local levels".

## New / changed inputs
- Added **Recent pullback lookback (bars)** `pullbackLookback` (20) in *Display distance & fallback*.
- Relabeled **Structure lookback (bars)** (`fallbackLookback`, 50) and **Show fallback local levels** (`showFallbackSwings`).
- Unchanged: adaptive distance model (`maxLocalDistPct`, `atrDistMult`, `rangeDistMult`, `fallbackDistPct`, `hardMaxDistPct`), `minVisibleLevels`, `maxBoxHtPct`, `showLineLabels`, thresholds.

## What was intentionally NOT changed
- Scoring, merge, bias, pivot creation, alerts — unchanged.
- Pivot length stays 8/8 (the fallback solves sparsity instead of loosening pivots).
- No new indicators, MTF, VWAP, RSI/MACD, order blocks, FVG, liquidity, signals, or strategy entries.
- No fake resistance in price discovery (by design).

## Object-limit safety
Primary ≤ 4 (nearest + strongest per side, de-duplicated); fallback ≤ 1 per side. Peak ≈ ≤6 lines/boxes + ≤6 labels — far under `max_boxes=60 / max_lines=60 / max_labels=60`. Pools (`drawnBox`, `drawnLine`, `drawnLab`) are rebuilt only on the last bar.

## Known limitations
- **Not yet compiled in TradingView by us** — static edits + self-review; a Pine Editor compile pass is the final gate.
- A genuinely structureless symbol (brand-new listing, tiny history) may still read "none nearby" — rare and honest.
- The recent pullback low can occasionally sit very close to price in a fresh down-leg (a Local S near 0%); correct but visually tight.
- Adaptive multipliers and lookbacks are heuristics; defaults aim to work across the tested names and remain tunable.

## How to test (daily)
- **VRT:** expect a subtle **Local S** below price and **Nearest resistance: none above / price discovery**; Visible levels ≥ 1.
- **BTCUSD:** local structure when present; nothing 80–90% away.
- **INOD / MELI / TSCO:** at least a Local S (and a Key/Local R where real overhead exists); not empty.
- Toggle *Show fallback local levels* off → primary only. Set *Min visible structure levels* to 0 → no fallback. Watch the dashboard never show blanks when a Local line is drawn.

## Next step
Compile in the Pine Editor and run VRT / BTCUSD / INOD / MELI / TSCO. Candidate next pass (separate, reviewed): tune pullback/structure lookbacks and adaptive multipliers from real screenshots; optional polarity-flip support (prior resistance now acting as support); the still-deferred scoring + merge calibration.
