# RangeClarity Trendline / Soft Channel Layer Design

Companion to `pine/rangeclarity_sr_core_v1.pine`. Stable S/R snapshot preserved at `pine/archive/rangeclarity_sr_core_v1_before_trend_channel.pine`. This layer is **secondary context** on top of the S/R engine, which remains primary. Concepts only studied from `indicator_research_library/sources/TrendLine/` — no code copied.

## 1. What the current S/R layer already does well and must be preserved
The S/R engine is the product foundation and stays primary and untouched:
- Confirmed-pivot zones with merging, scoring (0–100), and state (Fresh/Active/Tested/Broken/Flipped).
- Quality-tier rendering: **Strong** → capped box, **Key** → thin solid line, **Local** → subtle dashed line; boxes stay rare and height-capped.
- Adaptive display distance + robust **fallback** (nearest pivot / recent pullback low / structure low) so charts are never empty; honest **"none above" / price discovery** for resistance.
- Dashboard: Market bias, Active setup, Nearest support/resistance (tier + distance), Strongest zone, Visible levels, Tracked zones, Last event.
- Object hygiene: pools torn down and rebuilt only on `barstate.islast`; alerts on confirmed bars only.

The channel layer must not alter selection, fallback, rendering tiers, distances, the box rules, or the existing dashboard semantics. It only **adds** a subtle, optional overlay and 2 dashboard rows.

## 2. Inspiration from Automatic Trendline [Metrify]
The reference file shipped **empty (0 bytes)**, so no concepts were extractable from it directly. We honour the *intent* the founder called out — lines that look intentionally, "trader-drawn," relevant to current price, with only useful structure surviving — by adopting the cleanliness principles from the other three: confirmed-pivot anchors, a strict validity gate, thin premium lines, and dim/hide when structure is weak.

## 3. Inspiration from Auto Parallel Channels (HTF)
- **Confirmed pivots only** as anchors (`ta.pivothigh/low(len,len)`), keeping the last few pivot highs/lows (price + bar). No repaint of the channel definition.
- **Width-stability parallelism test** (the key idea we borrow): measure channel width now vs projected one span forward; if the relative width drifts beyond a tolerance, it's a wedge/triangle → **reject**. Scale-independent, unlike raw slope equality.
- **Dim-on-break / stop-extending** and **one subtle color** carry the verdict instead of clutter.
- Borrowed default: parallel tolerance ≈ **0.35** (loosen to 0.5–0.7 if too few channels appear).

## 4. Inspiration from Auto Channel [SciQua]
- **Candidate-channel thinking** from recent confirmed swing pivots; require **≥2 highs and ≥2 lows** before anything is drawn.
- **Containment ratio** (fraction of recent price inside the band) as the core "is this real" signal — used as both a gate and a score component.
- **Close-based break confirmation** with an optional buffer; wick-only pokes don't flip state.
- Avoided: its **absolute slope tolerance** (symbol-scale dependent), **100%-containment** brittleness, and **O(H²·L²·P) brute force** over all pivot pairs.

## 5. Inspiration from Adaptive Trend Channel / Julien_Exe
- **Multi-factor quality score (0–100)** with explicit weights and human-readable tiers (Weak→Strong) → our Strong/Valid/Developing/None labels.
- **Containment + width-as-%-of-price sanity cap** (reject channels too wide to be useful; ~20–35%).
- **Eligible vs ineligible coloring** — a single color/opacity property signals trust (we map this to Strong = clearer line, Developing = gray/very subtle, None = hidden).
- **Heavy compute only at `barstate.islast`** (scan/score once), persistent object reuse.
- Avoided: full linear-regression length-sweep, ADX/Pearson machinery, log-price mode, and the large analytics/annualized-return table — far over scope for a clean context layer.

## 6. What we intentionally do NOT copy
- No regression length-sweep, ADX, Pearson, std-dev bands, ZigZag library import, or HTF `request.security` channel (keeps it light, self-contained, no new dependencies).
- No brute-force pivot-combination search; no absolute-price slope tolerance.
- No big fills, no aggressive green/red corridors, no on-chart channel labels, no buy/sell/target/defense wording, no predictions.
- The channel never overrides the existing market bias and never invents structure.

## 7. Proposed RangeClarity version — "Soft Structure Channel"
A single, optional, subtle parallel channel built from the **two most recent confirmed pivot highs** (upper) and **two most recent confirmed pivot lows** (lower) already tracked by the S/R engine (reused via small additive pivot-bar arrays). It is validated, quality-scored, given a state, and contributes a *secondary* "Channel bias" that defers to the existing structural bias on conflict. Rendered as two very thin lines (optional midline/fill off by default), only when quality clears a threshold; otherwise Developing (ultra-subtle) or hidden. Status lives in the dashboard, not on the chart.

## 8. Trendline / channel validation rules
A channel is built only if ALL hold (else state = Developing or None, never forced):
1. **Enough structure:** ≥ `channelMinPivotPoints` (default 2) recent pivot highs AND lows with valid bars.
2. **Sane geometry:** current upper > lower (positive width).
3. **Parallelism (width-drift):** `|widthFwd − widthNow| / widthNow ≤ channelParallelTolerance` (default 0.35) → rejects wedges/triangles.
4. **Width sanity:** channel width as % of price ≤ `maxChannelWidthPct` (default 20).
5. **Relevance:** price not extremely far from the band — midline within the S/R hard-max distance of price; price within/near the channel.
6. **Containment:** ≥ ~0.6 of the last `channelLookbackBars` closes inside the band feeds the score (low containment → Developing, not drawn solid).

## 9. Visual hierarchy
1. **Strong S/R box** — highest priority (unchanged).
2. **Key S/R line** — high (unchanged).
3. **Local S/R line** — medium (unchanged).
4. **Soft Structure Channel** — subtle background context (new, lowest).

Channel rules: very thin upper/lower lines (width 1), high transparency (`channelOpacity`); midline off by default (or extremely subtle); fill off by default (ultra-low opacity if on); no large/colored corridor; no on-chart labels. Strong/Valid quality → faint solid lines; Developing → very subtle gray dashed (or hidden); None → nothing. Channel drawings live in their own pool, rebuilt on `barstate.islast`.

## 10. Market bias logic (channel is secondary, never overrides)
Compute a **separate** `channelBias` from slope + price position + no opposing confirmed break:
- **Bullish:** slope > flat, price inside/above midline, no confirmed break below lower.
- **Bearish:** slope < −flat, price inside/below midline, no confirmed break above upper.
- **Sideways:** |slope| ≈ flat, price inside, width reasonable.
- **Unclear/Developing:** too few pivots, too wide, poor parallelism, price far outside, OR **channelBias disagrees with the existing structural bias** → resolve to **Unclear** (prefer humility over a forced call).
The existing dashboard **"Market bias"** (from HH/HL · LH/LL) is unchanged and remains primary; the channel adds a **"Channel bias"** row only.

## 11. Risks of clutter
- A second corridor competing with S/R lines → mitigated: one channel max, thin high-transparency lines, no labels, no fill by default, hidden below quality threshold.
- Fake channels on wedges/noise → mitigated: width-drift parallelism + width cap + min-pivot gate; otherwise Developing/None.
- Dashboard bloat → only 2 added rows (Channel, Channel bias).
- Object-limit pressure → ≤ 2 lines (+ optional midline + 1 linefill); well under budget; pooled teardown.
- Repaint worry → anchors are confirmed pivots; break/test use confirmed close + ATR buffer.

## 12. Minimal implementation plan
1. Inputs group "Soft Structure Channel" (all clean defaults; off-switch first).
2. Additive state: `phBarArr`/`plBarArr` (pivot bars, mirror the existing pivot push), `drawnChan` line pool, channel flag vars.
3. Helpers: `f_chanValAt(slope, anchorPx, anchorBar, bi)`; build slopes from the last 2 pivots; validation; containment + quality score; state; channelBias (with deference).
4. Confirmed-bar section: compute current upper/lower, set test/break flags for alerts (confirmed only).
5. `barstate.islast`: validate + score + draw subtle lines (+ optional midline/fill); add 2 dashboard rows.
6. Optional alertconditions (confirmed bars, descriptive only).
7. Do not touch S/R selection/fallback/rendering/distances/box rules.

## 13. Known Pine Script limitations
- Confirmed pivots lag by `pivR` bars (disclosed; no back-dating) — the channel updates a few bars late, by design.
- A two-pivot channel can shift when a new pivot confirms; that's honest structure change, not repaint of past bars.
- `line`/`linefill` object caps — we keep ≤ ~3 channel objects and reuse the pooled teardown.
- No `request.security` HTF channel in v1 (single timeframe) to avoid HTF-close repaint subtleties; HTF is a future option.
- Containment loop over `channelLookbackBars` runs once at `barstate.islast` (cheap); avoid very large lookbacks.

## Reference note
Studied: `Auto Parallel Channels (HTF)`, `Auto Channel [SciQua]`, `Adaptive Trend Channel`. `Automatic Trendline [Metrify]` was an empty file. All channel code in RangeClarity is original; only concepts (confirmed-pivot anchoring, width-drift parallelism, containment scoring, subtle eligible/ineligible visuals) were reused.
