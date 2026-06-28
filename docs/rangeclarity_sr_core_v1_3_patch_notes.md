# RangeClarity S/R Core — v1.3 patch notes (strength-based rendering, never empty)

Scope: a focused display-layer redesign on `pine/rangeclarity_sr_core_v1.pine` so the chart stays clean **without going empty**. **No rewrite, no new indicators, no signals.** Diagnosis: `docs/rangeclarity_empty_chart_diagnosis.md`. Builds on v1.2 (`docs/rangeclarity_sr_core_v1_2_patch_notes.md`).

## Root cause (one line)
v1.2's anti-far-zone filters over-corrected: a 30% distance gate + `state != "Broken"` exclusion + all-or-nothing box rendering left little or nothing near price on trending dailies like BTCUSD.

## What changed (and why)

1. **Strength-based rendering (P0).** A selected level now renders by its **own score**, not as a uniform box:
   - **Strong (≥ `strongThr`, default 80)** → shaded **box** (a true area), 2px border.
   - **Medium (≥ `medThr`, default 60)** → solid **line** at mid (clear reference level).
   - **Weak (≥ 40)** → thin **dashed line** (subtle reference).
   - **Developing (< 40)** → dotted **faint line** — only ever shown when it is the nearest fallback.
   New `var array<line> drawnLine` pool, cleared/rebuilt on `barstate.islast` like the box/label pools. *Why:* gives a quiet middle tier so useful weak/medium levels are shown subtly instead of dropped.

2. **Always-on nearest floor (P0).** `f_nearestIdx` now uses a wider `nearMaxDist` (default **60%**) and **allows broken/flipped levels on the correct side of price**. A broken resistance now below price is a flipped support, etc., so it reappears as the nearest support. *Why:* guarantees a nearest valid support below and nearest valid resistance above whenever one exists — the chart no longer empties right after a breakout.

3. **Selection simplified to a clean map (P1).** Buckets are now: **Nearest S, Nearest R** (always, any score) + **Strong S, Strong R** (if they clear `minScore`), de-duplicated; **Sideways** uses **Range High / Range Low** and still guarantees a nearest level each side. The old bias-extra `f_topN` dump (up to 3 extra boxes+labels per side) was **removed** — bias now drives scoring emphasis and the dashboard, not object count. *Why:* fewer objects, clear hierarchy, no clutter.

4. **Dashboard expanded to a 10-row map (P1).** Rows: Market bias · Active setup · Nearest support · Nearest resistance · **Strongest support** · **Strongest resistance** · Visible zones · Tracked zones · Last event. Nearest/Strongest show an explicit **"none"** when absent, so the panel never implies "no levels" just because no *strong* zone exists.

5. **Short premium labels.** `Nearest S • 58 • -2.4%` (nearest shows %), `Strong R • 91`, `Range High • 76` (no %). Label opacity tracks render mode (boxes brightest, faint lines dimmest). No Target/Defense/debug text.

6. **Dead code + obsolete input removed.** Orphaned `f_topN` / `f_appendRoles` and the now-unused `maxZones` input were deleted.

## New / changed inputs (group "Scoring & display")
- **Strong score → shaded zone (box)** — `strongThr`, default 80.
- **Medium score → solid line** — `medThr`, default 60.
- **Nearest level max distance (%)** — `nearMaxDist`, default 60.
- **Min score for strongest/extra zones** — `minScore` (relabeled; nearest is always shown regardless).
- Removed: **Max target zones per side** (`maxZones`).

## What was intentionally NOT changed
- Scoring model, merge, bias model, pivot/zone creation, alerts — unchanged.
- `maxDistPct` (30%) still gates the **map** zones (strongest/range); only the **nearest** bucket uses the wider `nearMaxDist`.
- No new indicators, MTF, VWAP, RSI/MACD, order blocks, FVG, liquidity, signals, or strategy entries.

## Object-limit safety
Selection caps at ~4 levels (2 per side) + range. Only strong ones use boxes; the rest use single lines. Peak per redraw ≈ ≤4 boxes, ≤4 lines, ≤4 labels — far under `max_boxes=60 / max_lines=60 / max_labels=60`. Pools are deleted and rebuilt only on the last bar (no per-bar leaks).

## Known limitations (still true after v1.3)
- **Not yet compiled in TradingView by us** — static edits + self-review only; a Pine Editor compile pass remains the final gate.
- Distance budgets are flat % (not ATR-adaptive); a very quiet instrument may still need a higher `nearMaxDist`.
- Allowing broken levels in the nearest bucket can occasionally surface a recently-broken level as a faint line — intended (it is real structure), but worth watching in fast reversals.

## How to test (BTCUSD daily)
1. BTCUSD/Bitstamp/1D should show a nearest support below and nearest resistance above (subtle lines if weak, boxes if strong) — not empty.
2. Dashboard shows realistic Nearest support/resistance %, separate Strongest support/resistance (or "none"), and Visible vs Tracked counts.
3. Right after a breakout, the just-broken level should appear as the nearest support/resistance (polarity flip), as a line.
4. Confirm strong levels render as boxes, medium/weak as lines — clean hierarchy, few objects.
5. Cross-check AAPL and EURUSD daily; toggle `showFar`, raise/lower `strongThr`/`medThr` to see mode transitions.

## Next step
Compile in the Pine Editor and run the BTCUSD + AAPL + EURUSD checks. Candidate next pass (separate, reviewed): ATR-adaptive distance budgets and the deferred scoring + merge calibration.
