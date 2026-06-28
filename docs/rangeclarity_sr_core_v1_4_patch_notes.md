# RangeClarity S/R Core — v1.4 patch notes (adaptive fallback, never empty, premium lines)

Scope: a focused display-layer patch on `pine/rangeclarity_sr_core_v1.pine` so normal daily charts almost always show a useful structure map, while staying clean. **No rewrite, no new indicators, no signals.** Diagnosis: `docs/rangeclarity_empty_charts_line_ux_diagnosis.md`. Builds on v1.3 (`docs/rangeclarity_sr_core_v1_3_patch_notes.md`).

## Root cause (one line)
Every level came from a single source — confirmed `ta.pivothigh/low(8,8)` zones — filtered by a *fixed* % distance. On trending/volatile/at-highs dailies (INOD, BTCUSD, MELI, TSCO) no pivot zone fell inside the radius on one or both sides, so the chart went empty.

## What changed (and why)

1. **Adaptive display distance (P0).** The primary radius is now volatility-aware:
   `localDist = min(hardMaxDistPct, max(maxLocalDistPct, ATR% × atrDistMult, recentRange% × rangeDistMult))`.
   Calm names stay tight (~12%); volatile names widen automatically (up to the hard cap). `f_inRange` and the nearest bucket use `localDist`. *Why:* one fixed % can't fit both a $55 staple and a 5×-volatility momentum name.

2. **Fallback layer — subtle lines only (P0).** When a side has **no primary level** *and* visible levels `< minVisibleLevels`, add one fallback level on that side:
   - first, the nearest pivot zone within the wider `fallbackDist` → **"Local S/R"** (dashed line, shows %);
   - else the recent swing high/low (`ta.highest/lowest(fallbackLookback)`) → **"Swing S/R"** (dotted line, no %).
   Fallback never draws a box and never claims "Strong". *Why:* gives a useful floor/ceiling when clean pivots are sparse, without faking conviction.

3. **Hard distance cap (P0).** `hardMaxDistPct` (default **40%**) caps everything (primary and fallback). Far historical levels (80–90%) never show unless **Show far zones** is on. *Why:* never pollute the chart with ancient structure.

4. **Boxes stay rare + height-capped (P1).** A zone renders as a box only if **strong AND** its height ≤ `maxBoxHtPct` (default 8%). A strong-but-tall zone renders as a **solid thick line** instead of a giant box. *Why:* boxes signal real, contained areas; everything else is a line.

5. **Premium line hierarchy (P1).** Strong line = solid, thick, bright; Medium = solid thin; Weak = dashed thin; Fallback = dotted/dashed, dimmest. Compact right-side label pills: `Local S • -3.2%`, `Strong R • 91`, `Swing S`. (Primary "Nearest S/R" renamed **"Local S/R"** and now shows only %, not score+%.)

6. **Dashboard never looks broken (P1).** "Nearest support/resistance" shows the primary %, else the fallback distance (prefixed `swing` when from a raw swing), else **"none nearby"** (rare). The count row is now **Visible levels** (primary + fallback actually drawn), alongside **Tracked zones**.

## New / changed inputs
Group **"Display distance & fallback"**: `maxLocalDistPct` (12), `atrDistMult` (4.0), `rangeDistMult` (0.3), `fallbackDistPct` (30), `hardMaxDistPct` (40), `minVisibleLevels` (2), `showFallbackSwings` (true), `fallbackLookback` (50).
Group **"Scoring & display"**: added `maxBoxHtPct` (8.0), `showLineLabels` (true).
Removed: `maxDistPct`, `nearMaxDist` (replaced by the adaptive model).

## What was intentionally NOT changed
- Scoring, merge, bias, pivot/zone creation, alerts — unchanged.
- Pivot length stays 8/8 (loosening it would add noise/repaint risk; the fallback layer solves sparsity instead).
- No new indicators, MTF, VWAP, RSI/MACD, order blocks, FVG, liquidity, signals, or strategy entries.
- `lineStyleMode` (optional in the request) was **deferred** — the auto style hierarchy already reads cleanly; a manual override can be added later if wanted.

## Object-limit safety
Primary selection ≤ ~2 per side + range; fallback ≤ 1 per side. Peak per redraw ≈ ≤6 lines/boxes + ≤6 labels — far under `max_boxes=60 / max_lines=60 / max_labels=60`. Pools (`drawnBox`, `drawnLine`, `drawnLab`) are deleted and rebuilt only on the last bar (no per-bar leaks).

## Known limitations
- **Not yet compiled in TradingView by us** — static edits + self-review only; a Pine Editor compile pass remains the final gate.
- At genuine all-time highs there is no resistance above; the chart correctly shows "none nearby" for resistance (rare, expected).
- `fallbackLookback` (50) is a flat window; very fast names may benefit from a shorter lookback (tunable).
- Adaptive multipliers (`atrDistMult` 4, `rangeDistMult` 0.3) are heuristics; defaults aim for clean behavior across the tested names but can be tuned.

## How to test (daily)
- **INOD / BTCUSD / MELI / TSCO daily:** at least a nearest local support and/or resistance line should appear (Local or Swing), none 80–90% away. Dashboard shows realistic nearest %, "swing …" when fallback, or "none nearby" (rare).
- Confirm strong contained zones render as boxes; strong-but-tall and medium/weak as lines; fallback as the dimmest dashed/dotted lines.
- Toggle `showFallbackSwings` off → only primary levels; lower `minVisibleLevels` to 0 → no fallback. Raise/lower `atrDistMult` to see the adaptive radius change. `showFar` reveals far history.

## Next step
Compile in the Pine Editor and run the four daily charts. Candidate next pass (separate, reviewed): tune adaptive multipliers from real screenshots, optional `lineStyleMode`, and the still-deferred scoring + merge calibration.
