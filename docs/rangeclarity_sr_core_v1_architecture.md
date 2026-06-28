# RangeClarity S/R Core v1 — Architecture

Companion to `pine/rangeclarity_sr_core_v1.pine`. This is the foundation indicator for the RangeClarity TradingView product (decision `docs/decisions.md` D-006; blueprint `docs/rangeclarity-blueprint/`).

## Product philosophy
Not "another S/R indicator." RangeClarity **classifies the chart setup first** (market bias), then surfaces **only the zones that matter for that setup**. Simple visual, complex engine. **No signals, no buy/sell arrows, no predictions.** The user should understand: structure, distance to important zones, zone strength, and current context — in a few seconds.

## Inspiration (concepts only — no code copied)
Reviewed in `indicator_research_library/sources/RangeClarity/`: Adaptive S/R [BigBeluga], Ranked Support & Resistance Zones, Statistical Zone Engine [JOAT], Support & Resistance Dynamic / Pro Toolkit [LuxAlgo], Volumatic S/R [BigBeluga], and `../IndicatorSupportResistance.MD`. Concepts reverse-engineered: pivot→channel formation, strength-by-pivot-count, ATR-adaptive width, aggressive merging to avoid line spaghetti, volume behaviour at levels, zone *ranking*, and broken-level handling. All formulas/code in v1 are original.

## Module map (mirrors the Pine sections)
1. **Inputs** — pivots, ATR, width, merge, breakout buffer, max zones, min score, cooldown, toggles, bias sensitivity, volume scoring.
2. **Types / arrays** — `type Zone` (UDT) held in `array<Zone>`; fallback to parallel arrays documented below.
3. **Utility** — ATR, percent/ATR distance, clamp, volume MA, label/box helpers.
4. **Pivot detection** — confirmed `ta.pivothigh/low(L,R)`, offset-corrected.
5. **Zone creation** — pivot → ATR-width zone (top/bottom/mid/width).
6. **Zone merging** — union nearby same-type zones into one stronger zone.
7. **Zone updates** — touches (with cooldown), reactions, failed breaks, breakouts, recency, basic flip.
8. **Scoring** — transparent 0–100 with named components + penalties.
9. **Market bias** — Bullish / Bearish / Sideways / Unclear from confirmed pivots.
10. **Visual rendering** — bias-driven selection; shaded boxes (opacity = strength); minimal labels.
11. **Dashboard** — one compact table.
12. **Alerts** — descriptive `alertcondition`s.

## Data model — `Zone` (UDT)
```
type Zone
    int    id
    string ztype        // "support" | "resistance"
    float  top
    float  bottom
    float  mid
    int    createdBar
    int    lastTouchBar
    int    touchCount
    int    reactionCount
    int    failedBreakCount
    int    breakoutCount
    int    retestCount
    float  volScore      // 0..15 rolling
    float  biasScore     // 0..15
    float  ageScore      // 0..10
    float  score         // 0..100
    string strength      // Strong | Medium | Weak | Developing
    string state         // Fresh | Active | Tested | Weakened | Broken | Flipped | Retest
    int    pendingTouchBar // for reaction detection (-1 = none)
    float  pendingTouchPx
    box    boxRef
    label  labelRef
```
**Fallback:** if UDT/array-of-objects causes compile issues on a given TradingView build, the same fields map 1:1 to parallel `array<float>/<int>/<string>` indexed by zone id. v1 ships the UDT version; the parallel-array shape is documented here so a swap is mechanical.

## Pivot → zone (no future leak)
`ta.pivothigh(high, L, R)` confirms a pivot **R bars after** it forms and returns the value from `R` bars back. We create the zone when the pivot confirms and anchor `createdBar = bar_index - R`. We **accept the R-bar lag** (honest; documented) rather than back-dating. Zone width = `ATR(atrLen) × atrMult`; `top = mid + w/2`, `bottom = mid − w/2`, `mid = pivot price`.

## Merging
On a new zone, scan existing **same-type** zones; if mid-distance ≤ `mergeATR × ATR` (or boxes overlap), **merge**: `top = max`, `bottom = min`, `mid = touch-weighted average`, `touchCount += `, `createdBar = min`, `lastTouchBar = max`, recompute score, state → Active. Goal: one strong zone, not many weak nearby lines.

## Touches, reactions, breaks (confirmed bars only)
- **Touch:** bar range `[low,high]` intersects `[bottom,top]` **and** `bar_index − lastTouchBar > cooldown` (stops chop from inflating counts). Updates `lastTouchBar`, `touchCount`, records `pendingTouch*` for reaction.
- **Reaction:** within `reactionWindow` bars of a touch, price moves away by `reactionATR × ATR` (support → up; resistance → down) → `reactionCount++` (raises score).
- **Failed break (rejection):** price pierces beyond zone ± `buffer × ATR` intrabar but **closes back inside** → `failedBreakCount++` (strengthens — a defended level).
- **Break / weaken:** **close** beyond zone ± `buffer × ATR` → state `Broken` (penalty); `breakoutCount++`.
- **Basic flip (v1):** a Broken resistance is tagged flip-eligible to support (and vice-versa); on a later hold-retest from the other side it relabels `Flipped`. Full re-integration of flipped zones into target/defense selection is **v1.1** (kept minimal in v1 for stability).

## Scoring (0–100, transparent & adjustable)
| Component | Range | Basis |
|---|---|---|
| Touch count | 0..20 | `min(touchCount×5, 20)` |
| Reaction strength | 0..25 | `min(reactionCount×8 + failedBreaks×5, 25)` |
| Volume behaviour | 0..15 | avg relative volume at touches vs `SMA(volume, volLen)` |
| Bias alignment | 0..15 | zone role agrees with market bias |
| Recency / age | 0..10 | decays with bars since last touch |
| Cleanliness / merge | 0..10 | tighter width + more merged pivots |
| Failed-break penalty | 0..−25 | applied when `Broken` |
| Weak-touch penalty | 0..−10 | many touches, few reactions (chop) |
`score = clamp(Σ, 0, 100)` → **Strong 80–100 · Medium 60–79 · Weak 40–59 · Developing <40** (hidden unless "show weak" is on). Scoring is intentionally simple and tunable in v1 — transparent over perfect.

## Market bias (simple, no ML, no leak)
From the last few **confirmed** pivot highs/lows (kept in small `var` arrays):
- **Bullish:** higher highs **and** higher lows.
- **Bearish:** lower highs **and** lower lows.
- **Sideways:** highs and lows roughly flat within a band (sensitivity input).
- **Unclear:** mixed / not enough confirmed pivots.

## Bias-driven visual priority
| Bias | Show | Distance shown | Defense |
|---|---|---|---|
| Bullish | top 3 resistance **targets** above | % to each target | strongest support below = **defense** (merge support aggressively) |
| Bearish | top 3 support **targets** below | % to each target | strongest resistance above = **defense** (merge resistance aggressively) |
| Sideways | strongest upper resistance + lower support (+1 internal) | range width % | range boundaries |
| Unclear | nearest strong support + nearest strong resistance only | — | neutral labels ("Developing Zone") |

Boxes: opacity/visibility scales with strength (Strong → most visible, Weak → subtle, Broken → faded/hidden, Developing → very subtle). Labels are tiny: `S/R • Strength • Score • ±dist% • role/state` (e.g., `R • Strong 84 • +4.2% • Target`).

## Dashboard (one table, corner)
`RangeClarity S/R Core v1` · Market Bias · Active Setup (mode sentence) · Nearest Support % · Nearest Resistance % · Strongest Zone · # active zones · last break/retest state.

## Alerts (descriptive, never advice)
Approaching strong support / resistance · entering strongest support defense / resistance target · confirmed breakout above resistance · confirmed breakdown below support · retest after break. Messages are descriptive only. Set alerts to **"Once per bar close"** for non-repainting behaviour.

## Object management
`indicator(max_boxes_count=60, max_labels_count=60, max_lines_count=20)`. Zone **data** lives in the `array<Zone>` (persists via `var`); **drawings** are created only on `barstate.islast`, deleting and recreating the small visible set each redraw → no per-bar object leaks. Old/broken zones are pruned from the data array beyond a cap.

## Non-repainting policy
Pivots confirm with `R`-bar lag (disclosed, not back-dated). Touch/reaction/break logic uses confirmed bars. Drawings refresh on the latest bar. Bias uses confirmed pivots only. No `request.security` lookahead in v1 (single timeframe).

## Extension roadmap (designed for, not built in v1)
HTF confluence (weekly zones), VWAP/AVWAP context, liquidity-sweep filter, retest-quality score, statistical win-rate/EV per zone (concept from Statistical Zone Engine), full flipped-zone integration, visual performance dashboard, scanner/watchlist via the numeric plot contract in `docs/rangeclarity-blueprint/`. The `Zone` model and scoring are built so these are additive.

## Explicitly NOT in v1
RSI, MACD, VWAP, order blocks, FVG, liquidity sweeps, multi-timeframe, ML, buy/sell signals, strategy backtesting. Volume is **only** a scoring input, never a separate visual.
