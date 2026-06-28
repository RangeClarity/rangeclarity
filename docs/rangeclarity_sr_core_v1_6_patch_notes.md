# RangeClarity S/R Core — v1.6 patch notes (optional Soft Structure Channel)

Scope: an **additive, optional** trendline/parallel-channel context layer on top of the v1.5 S/R engine. **The S/R engine is unchanged** — selection, fallback, tiered rendering, distances, box rules, and dashboard rows 0–8 are byte-identical. Design: `docs/rangeclarity_trendline_channel_layer_design.md`. Stable pre-channel snapshot: `pine/archive/rangeclarity_sr_core_v1_before_trend_channel.pine`.

## What was added
A single, subtle **Soft Structure Channel** built from the **two most recent confirmed pivots** the S/R engine already tracks (reused via new `phBarArr`/`plBarArr` anchor arrays). It is validated, quality-scored, given a price-position state, and contributes a *secondary* "Channel bias" that defers to the structural bias. It is off-switchable and never dominates the chart.

- **Anchors:** confirmed `ta.pivothigh/low` only (no future data, no unconfirmed pivots).
- **Construction:** upper line through the last 2 pivot highs, lower through the last 2 pivot lows (two-pivot slope; no regression).
- **Validation (no fake channels):** needs ≥ `channelMinPivotPoints` per side; positive width; **width-drift parallelism** (`|Δwidth|/width ≤ channelParallelTol`, rejects wedges/triangles); **width sanity** (`≤ maxChannelWidthPct`); **relevance** (midline within the S/R hard-max distance). Fails → Developing or None, never forced.
- **Quality 0–100:** containment (share of recent closes inside the band) ×60 + parallelism ×25 + width-OK ×15. Labels: shown when ≥ `minChannelQualityToShow`, else Developing (very subtle) or hidden.
- **State:** Inside / Test Upper / Test Lower / Break Above / Break Below / Developing / None. Breaks require a **confirmed close** beyond the boundary ± `channelBreakBufferAtr × ATR` (no wick-only).
- **Channel bias:** Bullish/Bearish/Sideways from slope + price position + no opposing confirmed break — but if it **disagrees with the structural HH/HL bias, it resolves to Unclear**. The existing "Market bias" row is untouched and remains primary.

## Visual behavior (subtle by design)
- Two very thin (width 1) lines, soft blue, high transparency (`channelOpacity`, default 72). Midline **off** by default; fill **off** by default (ultra-faint `linefill` only if enabled).
- Strong/Valid quality → faint solid lines; Developing → gray dashed (dimmer); None → nothing drawn.
- **No on-chart channel labels, no big colored corridor, no green/red fill.** Status lives in the dashboard only. Visual priority stays: Strong box > Key line > Local line > **channel (lowest)**.

## Inputs added (group "Soft structure channel")
`showSoftChannel` (true), `showSoftChannelMidline` (false), `showSoftChannelFill` (false), `channelLookbackBars` (150), `channelMinPivotPoints` (2), `channelParallelTol` (0.35), `channelBreakBufferAtr` (0.3), `maxChannelWidthPct` (20), `minChannelQualityToShow` (55), `channelOpacity` (72).

## Dashboard changes
Two rows appended (table grew 9 → 11 rows): **Channel** (Inside/Test/Break/Developing/None, or "off") and **Channel bias** (Bullish/Bearish/Sideways/Unclear, or "—"/"off"). Existing rows unchanged.

## Alerts added (optional, confirmed bars, descriptive)
"Price closed above/below soft structure channel", "Price testing upper/lower structure". No buy/sell, target/defense, or prediction wording. (The four S/R alerts are unchanged.)

## How the stable S/R version was preserved
The sandbox's git was locked (`.git/index.lock`, not removable) **and** both git and bash read a stale 372-line view of the 525-line working file — so neither could snapshot reliably. The faithful backup was therefore written with the host-authoritative tool to `pine/archive/rangeclarity_sr_core_v1_before_trend_channel.pine` (full 525-line pre-channel S/R). To snapshot in git on your machine: `git add pine/rangeclarity_sr_core_v1.pine && git commit -m "Snapshot stable RangeClarity S/R before trendline channel layer"` (a local branch `rangeclarity-stable-sr-before-trend-channel` was also created, pointing at the prior HEAD).

## Object-limit safety
Channel adds ≤ 3 lines + 1 linefill per redraw; own pool torn down and rebuilt on `barstate.islast`. Combined peak ≈ ≤ 9 lines / ≤ 4 boxes / ≤ 6 labels — far under `max_boxes=60 / max_lines=60 / max_labels=60`. The containment loop runs once at `barstate.islast`; geometry is cheap scalar math per bar.

## What was intentionally NOT done
No regression sweep/ADX/Pearson/std-dev bands, no ZigZag import, no HTF `request.security`, no brute-force pivot combinatorics, no absolute-price slope tolerance, no fills-by-default, no on-chart channel labels, no RSI/MACD/VWAP/MTF/OB/FVG/liquidity/strategy/buy-sell. The channel never overrides bias and never invents resistance/structure.

## How to disable the new layer
Set **Show soft structure channel = false** (group "Soft structure channel"). The chart and dashboard then behave exactly like v1.5 (the Channel rows read "off"). All channel inputs default to a clean, subtle configuration.

## Known limitations / compile risks
- **Not compiled in TradingView by us** — static, host-authoritative edits + self-review only (the sandbox could not run Pine). A Pine Editor compile pass is the final gate.
- A two-pivot channel updates a few bars late (confirmed-pivot lag) and can shift when a new pivot confirms — honest structure change, not repaint.
- If the 2nd-most-recent pivot is > `max_bars_back` (1000) bars old (very low-pivot chart), the anchor line could be out of range; rare on normal daily charts.
- Slope "flat" threshold and quality weights are heuristics; tune `channelParallelTol`, `maxChannelWidthPct`, `minChannelQualityToShow` per taste.

## Manual test list (daily)
BTCUSD, VRT, INOD, MELI, TSCO, NOW, NVDA, SPY, QQQ. For each: (1) S/R lines still clean and present; (2) channel appears only on real parallel structure; (3) wedge/noise → Developing or hidden, not forced; (4) dashboard Market bias unchanged + Channel/Channel bias reasonable; (5) channel lines subtle; (6) no giant boxes/fills; (7) alerts only on confirmed close/test; (8) file compiles.
