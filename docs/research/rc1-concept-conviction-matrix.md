# RC-1 Concept Conviction Matrix

> Where references converge into **testable RC-1 rules**. Rule Conviction Score (0–100)
> per `rc1-reference-conviction-engine.md` §B. **Conviction = reference agreement +
> data validation + IP safety; popularity = small bonus.** No Pine; outputs are
> proposed caps/gates/penalties + the `labels.csv` cases they touch.

Legend — Rec: **Adopt** ≥75 · **Test** 55–74 · **Watch** 40–54 · **Reject** <40 ·
**Excl** = IP-blocked. IP-safe support = # of 🟢/🟡 references behind it.

| # | Concept / rule | Support (independent refs) | IP-safe | RC lens | Proposed cap/gate/penalty | Test cases | Conv | Rec |
|---|---|---|---|---|---|---|---|---|
|C1|**Chop detection**|6 — Choppiness, ADX, Efficiency Ratio, BandWidth, NR, GMMA-spread|6/6|Chop/Regime|**Chop cap ≤50**|RC1-05,20|**95**|Adopt|
|C2|**ATR extension cap**|6 — Keltner, Chandelier, %from200, Deviation, BBands, StdDev|5/6|ATR Extension|**Extended cap ≤60**|RC1-07,12|**94**|Adopt|
|C3|**Confluence "min not sum" agreement gate**|4 — min-gate, MTF confirm, trend filter, chop filter|4/4|Agreement|**agree3 gate; final=min(base,caps)**|all gate cases|**92**|Adopt|
|C4|**Pivot-cluster zone strength (touches)**|6 — SR Channels, Auto S/R, Ranked, Statistical, Fractals, Pivots|5/6|Zone Quality|zone score = touches/reaction|RC1-10,11,17|**90**|Adopt|
|C5|**MA alignment / stacking (20/50/200)**|5 — SMA/EMA, MA-align, MA Suite, GMMA, Dual MA|5/5|Trend|trend-decided gate; lens-missing ≤65|RC1-02,13,14|**89**|Adopt|
|C6|**Range/Donchian location**|5 — Donchian, Keltner, range-position, Darvas, %B|5/5|Location|Upper/Mid/Lower + pricediscovery ≤60|RC1-03,04,08|**87**|Adopt|
|C7|**Hysteresis / state-machine smoothing**|3 — hysteresis, Supertrend, cooldown|3/3|Agreement|**jump fatal**; ≤15 pts/bar|RC1-19|**85**|Adopt|
|C8|**No-trade / Unclear default (permission≠prediction)**|3 — no-trade default, chop filter, MTF|3/3|Agreement/Risk|default Mixed/Unclear; Clear earned|RC1-05,14,20|**83**|Adopt|
|C9|**ADX trend-strength gate**|3 — ADX, NR(ADX-adaptive), Vortex|3/3|Regime/Agreement|low ADX → range/cap|RC1-05,16|**80**|Adopt|
|C10|**Stale / broken zone demotion**|3 — Dynamic v2, Adaptive S/R, Statistical|3/3|Zone Quality|**weak/stale zone cap ≤55**|RC1-10,11|**78**|Adopt|
|C11|**ATR-scaled zone width + age decay**|4 — Adaptive S/R, Keltner, ATR, Dynamic v2|3/4|Zone Quality/ATR|width=k·ATR; decay penalty|RC1-11|**77**|Adopt|
|C12|**Volume = context only (0% of score)**|3 — volume-context, Volumatic, VPVR + brand law|3/3|Risk filter|never additive; veto only|RC1-12|**76**|Adopt|
|C13|**Calm state-first / one-number surface**|4 — single-table, one-number, confidence-meter, heatmap|4/4|Dashboard|one headline number; states else|(surface)|**74**|Adopt|
|C14|**De-dup / merge near-identical zones**|3 — SR Channels, Auto S/R, Adaptive|3/3|Zone Quality|**too_close merge**|RC1-17|**72**|Adopt|
|C15|**Price-discovery handling (no overhead level)**|3 — Donchian, VWAP, range-position|3/3|Location|**pricediscovery cap ≤60**|RC1-08|**72**|Test|
|C16|**Compression detection (NR/Squeeze/BandWidth)**|4 — NR, TTM Squeeze, BandWidth, Darvas|4/4|Regime|Compression state; expansion ≤60|RC1-12 (+add compression)|**71**|Test|
|C17|**Trend clarity via regression R²/containment**|4 — LinReg Channel, Auto Channel, StdDev, Trend Impulse|3/4|Trend|R² → trend-clarity weight|RC1-01,02|**70**|Test|
|C18|**VWAP as location context (not score)**|5 — Session/Anchored/Bands/Rolling VWAP, Dynamic Swing|4/5|Location(context)|context row only|RC1-04|**69**|Test|
|C19|**Confidence-meter calibration (rare highs)**|2 — confidence-meter, no-trade default|2/2|Score/Surface|>85 rare gate|RC1-18|**68**|Test|
|C20|**MTF / HTF confirmation**|3 — MTF confirm, Auto Parallel HTF, Ichimoku|3/3|Agreement|HTF agreement (off by default)|(roadmap)|**64**|Watch|
|C21|**BOS / CHoCH structure change**|3 — BOS/CHoCH, Smart Money, Angle Market|2/3|Trend/Δ|Structure-change row|RC1-16|**62**|Test|
|C22|**Round-number confluence**|2 — round numbers, Pivots|2/2|Zone(context)|minor confluence bonus(context)|—|**55**|Watch|
|C23|**Order blocks / liquidity levels as context**|3 — Order Blocks, Magnet, Breakouts|2/3|Zone(context)|context only; no signal|—|**52**|Watch|
|C24|**Divergence as score input**|2 — divergence, Wave Trend|2/2|Risk|warning-only, never score|—|**37**|Reject|
|C25|**FVG / imbalance as engine**|1 — FVG|0/1|Reject|none (signal/lookahead)|—|**30**|Reject|

## IP-excluded concepts (cannot source from current files)
- Any logic derived from **LuxAlgo** toolkits (proprietary) → use IP-safe equivalents
  (Pivots, Donchian, public S/R) instead.
- MA-ribbon-spread-as-regime sourced from **unlicensed** files (Adaptive Trend Ribbon,
  AG Pro Ribbon) → re-derive from **GMMA (public)** + **MA Suite (MPL)**.

## Reading the matrix
**Adopt (14):** C1–C14 — all IP-safe, multi-reference, testable, and each **reduces a
false-high path** (caps/gates/penalties) or carries the calm surface. These are the RC-1
spine.
**Test (7):** C15–C19, C21, plus compression — promising but need a `labels.csv` case or
batch calibration first (note: C16 compression and C19 rarity have **no/weak seed case** —
add before relying on them).
**Watch (3):** C20 (MTF, roadmap), C22 round numbers, C23 order blocks (signal-risk).
**Reject (2):** C24 divergence-in-score, C25 FVG engine — signal-like / lookahead, against
"permission not prediction."
