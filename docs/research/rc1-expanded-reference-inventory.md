# RC-1 Expanded Reference Inventory

> Concept-only catalogue, scored by the Reference Conviction Score (RCS,
> `rc1-reference-conviction-engine.md`). Expanded from **35 → 84** references. Per-row
> "learn / avoid / failure" is consolidated by concept in
> `rc1-concept-conviction-matrix.md` (avoids 84 redundant cards). **No code/UI/name/
> formula copying.** IP class: 🟢 public-domain/standard · 🟡 MPL (re-implement) ·
> 🟠 CC-NC (inspiration-only) · 🔴 proprietary/exclude · ⛔ unlicensed/exclude.
> Pop tier: U universal · H high · M medium · N niche.

## Count summary
- Before: 35 (ledger rows 1–36, incl. stubs). After: **84** scored references.
- New additions lean **public-domain/textbook** (lowest IP risk, highest cross-ref
  agreement) — a deliberate conviction strategy, not vendor scripts.
- By category: 1) S/R 16 · 2) Trend/MA 13 · 3) Regime/Chop 12 · 4) ATR/Vol 11 ·
  5) Location/VWAP 12 · 6) Dashboard UX 9 · 7) Risk filters 11.

## 1. Market Structure / S/R / Pivot Zones
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept (terse) |
|---|---|---|---|---|---|---|---|---|
|1|Classic Pivot Points|public|🟢|U|5|88|Zone/Location|deterministic level math|
|2|Camarilla Pivots|public|🟢|H|4|80|Zone/Location|tighter intraday pivots|
|3|Fibonacci Pivots|public|🟢|H|3|72|Zone|fib-spaced levels|
|4|Williams Fractals|public|🟢|U|4|82|Zone|swing-pivot detection|
|5|ZigZag swing S/R|public|🟢|H|4|78|Zone|swing extremes as levels|
|6|Auto S/R (pivot cluster)|concept|🟢|H|5|86|Zone|cluster pivots→ranked levels|
|7|Support Resistance Channels|LonesomeTheBlue|🟡|H|5|84|Zone|strength = touch count, keep top-N|
|8|Statistical Zone Engine|JOAT|🟡|M|5|82|Zone|sample-size-aware zone strength|
|9|Ranked S&R Zones|Zeiierman|🟠|M|5|70|Zone|explicit zone ranking|
|10|Adaptive S&R Zones|BigBeluga|🟠|H|5|70|Zone/ATR|ATR-scaled width + decay|
|11|Support Resistance Dynamic v2|LonesomeTheBlue|🟡|M|3|66|Zone|level lifecycle/expire|
|12|Volume Profile / VPVR|public/concept|🟢|H|3|64|Zone(context)|time-at-price = level importance|
|13|Market Structure BOS/CHoCH|concept|🟢|H|4|74|Trend/Zone|break of structure = shift|
|14|Order Blocks|concept|🟢|H|2|44|Zone(context)|last opposing candle zone (signal-risk)|
|15|Volumatic S/R|BigBeluga|🟠|M|3|54|Zone(context)|volume-weighted levels (context only)|
|16|LuxAlgo S&R Pro Toolkit|LuxAlgo|🔴|H|4|EXCL|surface ref|proprietary — description-only|

## 2. Trend Quality / MA Structure
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|17|SMA / EMA (20/50/200)|public|🟢|U|5|90|Trend|baseline trend anchors|
|18|MA alignment / stacking|concept|🟢|U|5|90|Trend|stack order+slope = trend health|
|19|GMMA (Guppy ribbon)|public|🟢|H|3|66|Trend/Regime|ribbon spread = trend vs chop|
|20|Supertrend|public|🟢|U|5|84|Trend/ATR|ATR-trailing state + hysteresis|
|21|Ichimoku Kumo|public|🟢|U|3|62|Trend|multi-component trend agreement|
|22|Linear Regression Channel|public|🟢|H|4|82|Trend/Location|slope + R² = trend clarity|
|23|Hull MA|public|🟢|H|2|52|Trend|low-lag smoothing (lag/whip trade-off)|
|24|Parabolic SAR|public|🟢|U|2|44|Trend|trailing flip (signal-like)|
|25|Vortex Indicator|public|🟢|M|3|58|Trend|directional vigor|
|26|MA Suite SMA+EMA|MasterOfDesaster|🟡|M|4|72|Trend|multi-MA alignment state|
|27|Dual MA Gradient|Gabremoku|🟡|N|3|60|Trend|two-MA spacing/pressure|
|28|Trend Impulse Channels|Zeiierman|🟠|M|4|62|Trend|impulse vs drift channel|
|29|Adaptive Trend Ribbon|Alpha Extract|⛔|M|4|EXCL|—|unlicensed — exclude|

## 3. Regime / Chop / Range Detection
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|30|Choppiness Index|public|🟢|U|5|92|Regime|the canonical chop scalar → Chop cap|
|31|ADX / DMI|public|🟢|U|5|90|Regime/Trend|trend strength vs noise gate|
|32|Kaufman Efficiency Ratio|public|🟢|H|5|88|Regime|signal/noise of price travel|
|33|Bollinger BandWidth|public|🟢|U|4|80|Regime|contraction vs expansion|
|34|TTM Squeeze (concept)|concept|🟢|H|4|78|Regime|BB-inside-Keltner compression|
|35|Darvas Box|public|🟢|M|3|66|Regime/Zone|bounded-range detection|
|36|Range Filter (concept)|concept|🟢|M|3|60|Regime|smoothed range vs trend|
|37|Hurst Exponent (concept)|concept|🟢|N|2|48|Regime|persistence vs mean-reversion|
|38|Choppiness via ATR percentile|concept|🟢|H|4|76|Regime/ATR|volatility-percentile regime|
|39|Smart NR2–NR20 + Inside Bar|Zeiierman|🟠|M|5|66|Regime|NR compression + ADX-adaptive LB|
|40|AG Pro MA Ribbon Stress|AGPro|⛔|M|4|EXCL|—|unlicensed — exclude|
|41|Wave Trend (concept)|concept|🟢|H|2|40|Regime/Momentum|momentum osc (off-brand)|

## 4. ATR / Volatility / Extension
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|42|ATR (Average True Range)|public|🟢|U|5|90|ATR|volatility unit for everything|
|43|Keltner Channels|public|🟢|U|5|88|ATR/Location|ATR envelope → extension + position|
|44|Bollinger Bands|public|🟢|U|4|80|ATR/Location|σ envelope; stretch vs mean|
|45|Chandelier Exit|public|🟢|H|4|80|ATR/Extension|ATR distance from extreme = maturity|
|46|ATR Bands / Stops|public|🟢|H|3|70|ATR|ATR-scaled rails|
|47|Std-Dev Channel|public|🟢|M|3|66|ATR/Location|statistical stretch|
|48|Historical Volatility|public|🟢|M|3|62|ATR|vol regime context|
|49|% distance from 200-MA (ATR-norm)|concept|🟢|H|5|86|Extension/Location|cross-symbol extension anchor|
|50|Deviation Trend Profile|BigBeluga|🟠|M|4|62|Extension|±ATR stretch rails|
|51|Bollinger %B|public|🟢|H|3|68|Location/ATR|position within band 0–1|
|52|SuperTrend (ATR)|public|🟢|U|4|78|ATR/Trend|ATR trailing (cross-listed)|

## 5. Location / Donchian / Keltner / VWAP concepts
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|53|Donchian Channels|public|🟢|U|5|88|Location|range extremes → Upper/Mid/Lower|
|54|Session VWAP|public|🟢|U|4|72|Location(context)|fair-value reference (context, 0% score)|
|55|Anchored VWAP|public|🟢|H|4|72|Location(context)|event-anchored fair value|
|56|VWAP Bands|public|🟢|H|3|64|Location(context)|σ bands around VWAP|
|57|Rolling VWAP|public|🟢|M|3|60|Location(context)|continuous VWAP|
|58|Fibonacci Retracement|public|🟢|U|3|62|Location|retrace zones (discretionary)|
|59|Range position (0–100)|concept|🟢|H|5|84|Location|where in the defined range|
|60|Dynamic Swing Anchored VWAP|Zeiierman|🟠|M|3|56|Location(context)|swing-anchored VWAP|
|61|Auto Channel|SciQua|🟠|M|3|54|Location/Trend|auto-fit channel|
|62|Auto Parallel Channels (HTF)|TradeSymbiotic|🟡|N|3|60|Location|HTF parallel channel|
|63|Polynomial Regression Profile|BigBeluga|🟠|N|2|48|Location(context)|regression volume profile|
|64|Adaptive Trend Channel|unstated|⛔|M|4|EXCL|—|unlicensed — exclude|

## 6. Score / Dashboard / Table UX
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|65|Single-table state dashboard|concept|🟢|U|5|88|Surface|state words + one number, color-coded|
|66|Confidence/strength meter|concept|🟢|H|4|72|Surface/Score|calibration (rare highs) + counter-example|
|67|Screener-style status table|concept|🟢|H|3|66|Surface|compact multi-symbol/state grid|
|68|Heatmap / color-state panel|concept|🟢|H|3|64|Surface|semantic color hierarchy|
|69|"One number" headline panel|concept|🟢|H|5|82|Surface|premium calm, no scoreboard|
|70|Info-panel / legend pattern|concept|🟢|M|3|58|Surface|compact context legend|
|71|Multi-factor confluence panel|concept|🟢|H|4|62|Score|how factors combine (and over-inflate)|
|72|Gauge / dial widgets|concept|🟢|M|2|40|Surface|dial UI (clutter risk)|
|73|LuxAlgo S&R Dynamic (panel)|LuxAlgo|🔴|H|3|EXCL|surface ref|proprietary — description-only|

## 7. Risk filters / false-signal prevention concepts
| # | Reference | Source | IP | Pop | Rel | RCS | RC lens | Concept |
|---|---|---|---|---|---|---|---|---|
|74|Multi-timeframe confirmation|concept|🟢|U|5|84|Agreement|HTF must agree before confidence|
|75|Volatility/chop trade filter|concept|🟢|U|5|86|Agreement/Regime|don't read clear in chop|
|76|Trend filter gating|concept|🟢|U|4|80|Agreement/Trend|require trend agreement|
|77|Hysteresis / state-machine smoothing|concept|🟢|H|5|86|Agreement|no band jump without event|
|78|Signal cooldown / debounce|concept|🟢|H|4|72|Agreement|suppress flicker|
|79|Confluence "min not sum" gating|concept|🟢|H|5|88|Agreement|worst lens caps the read|
|80|Divergence-as-warning|concept|🟢|H|2|46|Risk|warning only, never score input|
|81|Volume-as-context-only|concept|🟢|H|5|84|Risk|volume 0% of score (brand law)|
|82|No-trade / unclear default|concept|🟢|H|5|88|Agreement|humility default = permission-not-prediction|
|83|ADX gate (low = no-trend)|public|🟢|U|4|80|Regime/Agreement|gate confidence by trend presence|
|84|FVG / imbalance engine|concept/trade_w_samet|🟠|H|1|30|Reject|signal/lookahead — counter-example|

## RCS leaders (for the engine; full ranking in chat output)
Highest IP-safe, cross-referenced, testable, calm: Choppiness Index (92) · SMA/EMA &
MA alignment (90) · ADX/DMI (90) · ATR (90) · Confluence min-gate (88) · No-trade
default (88) · Pivot Points (88) · Keltner (88) · Donchian (88) · Efficiency Ratio (88).
Excluded (IP): LuxAlgo ×2 (proprietary), Adaptive Trend Ribbon / AG Pro Ribbon /
Adaptive Trend Channel (unlicensed).
