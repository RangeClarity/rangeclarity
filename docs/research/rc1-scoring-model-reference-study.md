# RC-1 Scoring-Model Reference Study

> How strong indicator systems build (or fail to build) trustworthy **scoring**, translated
> into RangeClarity's original, negative-first architecture. Concept-only — **no code,
> formulas, UI, names, or colors copied; no scraping; no Pine; no returns; no signal
> language.** RC Score measures structural clarity, not trade probability.

## Headline finding
Open libraries (**TA-Lib, pandas-ta**) provide excellent **primitives** (ATR, ADX,
Choppiness, Donchian, Keltner, Bollinger) but **no trustworthy scoring model** — combining
them is the user's job, and the popular way to combine them is an **additive "confluence"
sum** (add up bullish/strong signals). **That additive pattern is the primary source of
false-highs:** many weak signals sum to a high score. **vectorbt** contributes *methodology*
(vectorised parameter sweeps, walk-forward, stats), not a scorer. The academic lesson is
**calibration**: a trustworthy score's stated confidence matches observed reliability.
→ RC-1 adopts the **primitives** (ATR-normalised, regime-gated, confirmed-bar, bounded) and
**rejects the combination pattern**, replacing additive confluence with a **negative-first
min-gate** (worst lens caps the read).

## Meta-lessons (what makes a score trustworthy)
- **Reward-strength vs reject-weakness.** Reward-strength scoring inflates; reject-weakness
  (negative-first) withholds. RC is reject-weakness.
- **Normalise by ATR.** Anything in ATR units is comparable across symbols/regimes; raw
  price/percent thresholds are not.
- **Gate by regime.** Don't read clarity in chop; trend-strength/efficiency gates are the
  difference between robust and naive.
- **Agreement, not sum.** Independent lenses *agreeing* is trustworthy; a weighted sum of
  correlated signals is not (it double-counts and can't fail).
- **Bounded + confirmed-bar + calibrated.** Clamp outputs, score on closed bars, keep highs
  rare and audited. Un-calibrated, repainting, unbounded scores are untrustworthy.

## Per-concept analysis (Q1 what it scores · Q2 inputs · Q3 reward/reject · Q4 trust · Q5 false-high risk · Q6 learn · Q7 don't-copy · Q8 RC lens)

**ADX / DMI (TA-Lib/pandas-ta)** — Q1 trend *strength/presence* · Q2 directional movement, ATR · Q3 reward (strength) · Q4 trustworthy as a **gate** (low ADX = no trend), untrustworthy as a buy signal · Q5 high ADX in a blow-off reads "strong" while late · Q6 use as a **trend-presence + chop gate**, not a strength reward · Q7 DI-cross signals, the "strong trend = enter" framing · Q8 Chop/Regime + Trend.

**ATR (TA-Lib)** — Q1 volatility magnitude · Q2 true range · Q3 neither (a unit) · Q4 highly trustworthy primitive · Q5 none by itself (misuse: ignoring it → non-comparable thresholds) · Q6 **the universal normaliser** for zone width, extension, location · Q7 nothing to copy (public concept) · Q8 ATR Extension + all lenses.

**Choppiness Index / Efficiency Ratio** — Q1 trend-vs-noise · Q2 range vs path length · Q3 **reject** (flags noise) · Q4 trustworthy chop detector · Q5 low if thresholds loose (chop slips through) · Q6 the **chop cap input** — the #1 false-high preventer · Q7 using it as an entry filter · Q8 Chop/Regime.

**Bollinger / Keltner — bandwidth & %B** — Q1 volatility state + position-in-band · Q2 stdev/ATR envelope · Q3 mixed · Q4 trustworthy for compression/extension/location, untrustworthy as breakout signal · Q5 "squeeze = imminent breakout" (direction unknown) · Q6 **compression** (test) + **extension/location** · Q7 squeeze "fire" dots/arrows · Q8 ATR Extension + Location + Regime.

**Donchian Channels** — Q1 range extremes · Q2 N-bar high/low · Q3 neither · Q4 trustworthy location frame · Q5 breakout-signal misuse · Q6 **range-position → Upper/Mid/Lower + price-discovery** · Q7 breakout entries · Q8 Location.

**RSI / Stochastic / MACD (TA-Lib oscillators)** — Q1 momentum · Q2 price deltas · Q3 reward · Q4 **untrustworthy for clarity** (mean-reversion + divergence = direction prediction) · Q5 "oversold = strong" false-highs; divergence false reversals · Q6 *what not to do* — momentum ≠ structural clarity · Q7 the oscillators as score inputs entirely · Q8 (none — **reject** for RC score).

**Weighted-additive "confluence" scoring dashboards** — Q1 a blended "signal strength" · Q2 many indicators summed · Q3 **reward (sum)** · Q4 **untrustworthy** — correlated factors double-count; the score can't fail · Q5 **the canonical false-high engine** (many weak signals → high) · Q6 *the anti-pattern to reject*; replace with min-gate agreement · Q7 the additive design, weights, the /100 scoreboard look · Q8 Agreement (as a counter-example).

**Pivot-cluster S/R strength (reference folder: SR Channels, Statistical Zone)** — Q1 level quality · Q2 confirmed pivots, touches, reactions · Q3 mixed (rewards real touches, should reject thin) · Q4 trustworthy if touch/reaction/freshness-gated · Q5 one-touch/stale levels read "strong" · Q6 **Zone Quality** with weak/stale/broken demotion · Q7 vendor code/look · Q8 Zone Quality.

**MA 20/50/200 alignment (reference folder: MA Suite, GMMA)** — Q1 trend health · Q2 MAs, slope, spacing · Q3 reward (alignment) · Q4 trustworthy as a *state*, lagging at turns · Q5 aligned-but-extended reads clean · Q6 **Trend Quality + trend-decided gate** · Q7 ribbon clutter, MA-cross signals · Q8 Trend Quality.

**vectorbt (research framework)** — Q1 nothing (a backtester) · Q2 vectorised price ops · Q3 n/a · Q4 trustworthy *methodology* (sweeps, walk-forward, stats) · Q5 if used to optimise returns → overfit · Q6 the **iteration/validation methodology** (Phase 4+), not a scorer; never returns · Q7 its trade/return orientation · Q8 (methodology → feeds the iteration engine).

**Calibration / reliability (academic: reliability diagrams, Brier score, isotonic)** — Q1 whether stated confidence = observed reliability · Q2 predicted vs realised · Q3 neither (a check) · Q4 the **definition of a trustworthy score** · Q5 reveals over-confidence · Q6 **High Clarity must be rare + audited + calibrated** · Q7 nothing (public stats) · Q8 Dashboard Surface + Agreement.

## Scoring parameter matrix
| Parameter | Reward/Reject | Trust | False-high risk | RC lens | Decision |
|---|---|---|---|---|---|
| ATR normalisation | unit | high | none | all | **Adopt** |
| Choppiness / Efficiency Ratio | reject | high | low | Chop/Regime | **Adopt** |
| ADX trend-presence gate | gate | high | low | Chop/Trend | **Adopt** |
| Donchian/Keltner range-position | neutral | high | low | Location | **Adopt** |
| ATR distance-from-anchor (extension) | reject | high | low | ATR Extension | **Adopt** |
| Pivot touches + reaction + freshness | mixed | med-high | med (if ungated) | Zone Quality | **Adopt** (gated) |
| MA 20/50/200 alignment + slope | reward | med | med (extended) | Trend Quality | **Adopt** (as state+gate) |
| Min-gate agreement (worst lens caps) | reject | high | low | Agreement | **Adopt** |
| Hysteresis / confirmed-bar | stability | high | low | Agreement/Surface | **Adopt** |
| Bounded, whole-number, calibrated output | discipline | high | low | Surface | **Adopt** |
| Bollinger/Keltner bandwidth (compression) | reject | med | med (squeeze hype) | Regime | **Test** |
| %B position nuance | neutral | med | med | Location | **Test** |
| Regression R² trend clarity | reward | med | low | Trend | **Test** |
| RSI/Stochastic/MACD momentum | reward | low | **high** | — | **Reject** |
| Weighted-additive confluence sum | reward | low | **highest** | — | **Reject** |
| Volume/OBV/MFI in score | reward | low | high | — | **Reject** (brand law: 0%) |
| Candlestick/pattern signals | reward | low | high | — | **Reject** |

## Repeated concepts across top references (= high cross-reference conviction)
ATR-normalisation · regime/chop gating · confirmed-bar/no-repaint · bounded outputs ·
range-position location · pivot-based S/R. These recur in nearly every robust system →
**high conviction**. (Additive confluence also recurs — but as the *failure* mode.)

## High-conviction vs low-value parameters
- **High-conviction:** ATR normaliser, Choppiness/ER, ADX gate, Donchian/Keltner location,
  pivot zone quality, MA alignment, min-gate agreement, hysteresis, calibration.
- **Low-value / noisy:** momentum oscillators (RSI/Stoch/MACD), additive confluence sums,
  volume-based scores, candlestick patterns, decimal precision, MA-variant zoo
  (Hull/ALMA), per-row /100 scoreboards.

## Adopt now / Test / Reject (this study → v1)
- **Adopt now:** every High-conviction parameter above (they *are* the locked v1 spine).
- **Test in Reject-Probe:** bandwidth compression, %B nuance, regression-R² trend.
- **Reject:** momentum oscillators as inputs, additive confluence, volume-in-score,
  candlestick signals, anything direction-predictive.

## How each adopted concept prevents false-highs
- ATR normalisation → caps mean the same thing across symbols (no symbol slips through on
  raw thresholds). · Choppiness/ER → forces Unclear in noise. · ADX gate → no "trend" read
  without trend presence. · Location → blocks no-man's-land highs. · Zone gating → thin/
  broken levels can't read strong. · MA alignment gate → trend-decided required for Clear. ·
  **Min-gate agreement → the structural fix for additive false-highs** (worst lens caps;
  signals can't sum their way up). · Hysteresis → no transient spike to Clear. · Calibration
  → highs stay rare and audited.

## How this updates the Python scorer (later)
- Implement the **primitives ATR-normalised** (zone width, extension, location all in ATR/%
  of range). · Combine via **`min(base, caps)` + agree3**, **never an additive sum**. ·
  Bound + whole-number outputs; confirmed-bar; hysteresis snapshot. · Momentum/volume/
  pattern modules are **absent by construction**. · vectorbt-style sweeps belong to the
  iteration engine (Phase 4+), not the scorer, and never optimise returns.

## Final output
**Top 10 scoring ingredients for RC-1:** 1) ATR universal normaliser · 2) Choppiness/ER
chop scalar · 3) ADX trend-presence gate · 4) pivot-cluster zone strength (touch+reaction+
freshness) · 5) Donchian/Keltner range-position · 6) MA 20/50/200 alignment · 7) ATR
distance-from-anchor extension · 8) **min-gate agreement (worst lens caps)** · 9)
hysteresis + confirmed-bar stability · 10) bounded, calibrated, rare-high output.

**Top 5 rejection rules:** 1) chop/low-efficiency → Unclear · 2) severe ATR extension → cap
· 3) weak/one-touch/broken zone → cap · 4) trend↔structure contradiction → Unclear · 5)
insufficient data → no number.

**Top 5 confidence-building rules:** 1) multi-lens **agreement** required for high (not one
lens's strength) · 2) calibration — highs rare + 100% audited · 3) confirmed-bar + hysteresis
(no repaint/jump) · 4) ATR-normalised, bounded outputs (no fake precision) · 5) out-of-sample
holdout + per-segment CIs (claims are tested).

**Recommended RC-1 v1 scoring stack:** inputs (ATR-normalised primitives) → **reject-weakness
gates/caps** (chop, extension, zone, location, contradiction, data) → **min-gate agreement**
→ hysteresis → calm one-number band. Volume context-only (0%). Seven core lenses, nothing
additive, readable in <3 s.

**Next validation step (unchanged):** this study confirms the locked spine — it does **not**
change the NOW. Manually score `labels-50`, then build + run **Reject-Probe v0**; the scorer
will implement ATR-normalised primitives + the min-gate (never an additive confluence sum).
