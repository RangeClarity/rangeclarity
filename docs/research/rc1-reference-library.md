# RC-1 Reference Library — Inventory + Review Cards

> **Concepts only.** We never copy code, UI, names, colors, params, or proprietary
> logic. The `.MD` source files contain real Pine — treat them as **licensed code to
> study, never to lift.** Every concept is re-implemented from RangeClarity's own
> model. Gate: `indicator_research_library/license_ledger.md`.

## IP governance finding (action needed)
The reference folder has **~35 files** across `sources/`, `sources/RangeClarity/`,
`sources/MA/`, `sources/TrendLine/`. The `license_ledger.md` only covers the **18**
top-level files. **The subfolder files (incl. two LuxAlgo proprietary toolkits) are
not yet in the ledger.** Until they are, treat every un-ledgered file as
**Inspiration only / description-only**. LuxAlgo = proprietary → **never read its
code into production reasoning; study the public *description* only.**

IP-risk legend: **HIGH** = NonCommercial / proprietary / unlicensed → concept-from-
description only, no code influence. **MED** = MPL-2.0 → concept re-implement +
attribution (don't copy the file). All ship as original RangeClarity logic regardless.

## Inventory (all references)

| File | Type | Category | Usable concept | IP risk | RC-1 (1–5) |
|---|---|---|---|---|---|
| sources/IndicatorSupportResistance.MD | Pine | S/R zones | Pivot clustering → channels; strength = touch count; keep strongest N | MED (MPL, LonesomeTheBlue) | 5 |
| sources/RangeClarity/Ranked Support & Resistance Zones.md | Pine | S/R zones | **Ranking** zones by quality — the scoring idea itself | HIGH (verify) | 5 |
| sources/RangeClarity/Statistical Zone Engine [JOAT].md | Pine | S/R zones | Statistical/probabilistic zone strength | MED (JOAT, verify) | 5 |
| sources/RangeClarity/Adaptive Support and Resistance Zones [BigBeluga].MD | Pine | S/R zones | Adaptive zone width/decay | HIGH (CC-NC) | 5 |
| sources/IndicatorNR2-NR20.MD | Pine | Chop/compression | Narrow-range + inside-bar + **ADX-adaptive lookback** | HIGH (CC-NC, Zeiierman) | 5 |
| sources/RangeClarity/Support & Resistance Pro Toolkit [LuxAlgo].md | Pine | S/R + surface | Comprehensive S/R + dashboard surface ideas | **HIGH (proprietary)** | 4 |
| sources/IndicatorAngleMarket.MD | Pine | Market structure | Pivot structure + ATR **deviation bands** + consecutive-break count | HIGH (CC-NC) | 4 |
| sources/IndicatorTrendImpulse.MD | Pine | Trend | Impulse vs drift channel | HIGH (CC-NC) | 4 |
| sources/IndicatorDeviation.MD | Pine | Extension/location | Deviation trend profile (±ATR stretch bands) | HIGH (CC-NC) | 4 |
| sources/TrendLine/Adaptive Trend Channel.md | Pine | Trend/location | Auto regression channel + slope | HIGH (verify) | 4 |
| sources/MA/Adaptive Trend Ribbon [Alpha Extract].md | Pine | MA structure | MA ribbon alignment/compression | HIGH (verify) | 4 |
| sources/MA/MA Suite SMA + EMA [Institutional].md | Pine | MA structure | Multi-MA stack + alignment state | HIGH (verify) | 4 |
| sources/MA/AG Pro Moving Average Ribbon Stress Meter.md | Pine | MA/regime | Ribbon **spread as regime/stress** meter | HIGH (verify) | 4 |
| sources/IndicatorSmartMoney.MD | Pine | Trend/structure | Breakout channels (BOS-style) | MED (MPL, AlgoAlpha) | 3 |
| sources/RangeClarity/Support Resistance - Dynamic v2.MD | Pine | S/R zones | Dynamic level update/expire | HIGH (verify) | 3 |
| sources/RangeClarity/Volumatic SupportResistanceLevels [BigBeluga].md | Pine | S/R + volume | Volume-weighted level *context* | HIGH (CC-NC) | 3 |
| sources/TrendLine/Auto Channel [SciQua].md | Pine | Trend/location | Auto channel fit | HIGH (verify) | 3 |
| sources/TrendLine/Auto Parallel Channels (HTF).md | Pine | Trend/location | HTF parallel channel | HIGH (verify) | 3 |
| sources/MA/Dual MA Gradient [Gabremoku].md | Pine | MA structure | Two-MA gradient/spacing | HIGH (verify) | 3 |
| sources/RangeClarity/Support & Resistance Dynamic [LuxAlgo].md | Pine | S/R zones | Dynamic S/R | **HIGH (proprietary)** | 3 |
| sources/IndicatorBreakouts.MD | Pine | Liquidity/zones | Stop-loss clustering as level magnet | MED (MPL, Kioseff) | 3 |
| sources/IndicatorMagnet.MD | Pine | Liquidity/zones | Liquidity magnet levels | MED (MPL, JOAT) | 3 |
| sources/IndicatorDynamicSwing.MD | Pine | Location/VWAP | Swing-anchored VWAP as location ref | HIGH (CC-NC) | 3 |
| sources/IndicatorPolynomial.MD | Pine | Location/volume | Regression volume profile | HIGH (CC-NC) | 3 |
| sources/MA/CUSTOM EMA SMA RIBBON.md | Pine | MA structure | Ribbon variant | HIGH (verify) | 2 |
| sources/MA/SMA Ribbon[A].md | Pine | MA structure | Ribbon variant | HIGH (verify) | 2 |
| sources/IndicatorLiquidityThermal.MD | Pine | Volume context | Liquidity heat *context* | HIGH (CC-NC) | 2 |
| sources/IndicatorVolumeBubble.MD | Pine | Volume context | Volume bubbles *context* | HIGH (CC-NC) | 2 |
| sources/IndicatorMLRSI.MD | Pine | Momentum/ML | ML-smoothed RSI (off-brand) | HIGH (CC-NC) | 2 |
| sources/IndicatorSmartTrader.MD | Pine | Mixed/signals | Multi-feature signal suite (counter-example) | HIGH (none stated) | 2 |
| sources/IndicatorNeural.MD | Pine | Momentum/ML | Neural oscillator (off-brand) | HIGH (CC-NC) | 1 |
| sources/IndicatorFVG.MD | Pine | Signals | FVG entry bot (**counter-example only**; lookahead) | HIGH (none) | 1 |
| sources/IndicatorVdubus.MD | Pine | Harmonics | Pattern generator (off-scope) | MED (MPL) | 1 |
| sources/MA/MA.md · sources/TrendLine/Automatic Trendline [Metrify].md | stub/empty | — | — | — | — |

---

## Top-20 review cards
Maps use a 0–3 scale (— none · ◔ weak · ◑ med · ● strong) across the six RC-1 lenses:
**Trend · Zone · Location · Chop/Regime · ATR/Ext · Agreement.**

### 1. Support Resistance Channels — LonesomeTheBlue · MED(MPL) · 5/5
- **Category / solves:** S/R zones — turns scattered pivots into a few ranked S/R *channels*.
- **Core concept:** cluster pivots whose values fall within a max % width into a band; **strength = number of touching pivots/bars**; keep the strongest N; zero-out absorbed pivots to de-duplicate.
- **Formula ideas to study:** channel-width cap as % of range; touch counting over a lookback; greedy "take strongest, suppress overlaps."
- **Strengths:** few, clean, ranked levels. **Weaknesses:** fixed % width; recency-blind. **Failure:** stale levels persist; over-merge in tight ranges.
- **RC learns:** the *merge + rank + cap* discipline for fewer/better zones. **Don't copy:** the code, the box look, broken-S/R triangles/alerts.
- **Maps:** Trend ◔ · Zone ● · Location ◑ · Chop — · ATR — · Agreement ◑

### 2. Ranked Support & Resistance Zones — verify · HIGH · 5/5
- **Category / solves:** S/R zones — explicitly *ranks* zones, which is the heart of Zone Quality.
- **Core concept:** score each zone by a blend of factors and present in rank order.
- **Formula ideas:** multi-factor zone scoring; rank-then-display; show top-k.
- **Strengths:** quality-first. **Weaknesses:** ranking weights opaque. **Failure:** rank inflation if factors correlate.
- **RC learns:** make Zone Quality an explicit ranked score feeding the `agree3` gate. **Don't copy:** its weights/visuals/name.
- **Maps:** Trend — · Zone ● · Location ◑ · Chop — · ATR — · Agreement ●

### 3. Statistical Zone Engine — JOAT · MED(verify) · 5/5
- **Category / solves:** S/R zones — statistical/probabilistic strength rather than raw touch counts.
- **Core concept:** treat reactions at a level statistically (distribution of touches/holds) to grade it.
- **Formula ideas:** normalise reaction strength; confidence as sample-size-aware.
- **Strengths:** honest about thin evidence. **Weaknesses:** heavier compute. **Failure:** under-sampling → false confidence.
- **RC learns:** **sample-size awareness** → low-evidence zones can't read strong (feeds the Insufficient gate). **Don't copy:** code/exact stats.
- **Maps:** Trend — · Zone ● · Location ◑ · Chop — · ATR — · Agreement ●

### 4. Adaptive Support & Resistance Zones — BigBeluga · HIGH(CC-NC) · 5/5
- **Category / solves:** S/R zones — zone width/decay that **adapts to volatility**.
- **Core concept:** ATR-scaled zone width; zones fade/expire with age and violations.
- **Formula ideas:** ATR-proportional band; age-decay; violation handling.
- **Strengths:** volatility-aware, self-cleaning. **Weaknesses:** decay tuning sensitive. **Failure:** over-fast decay drops valid levels.
- **RC learns:** ATR-scaled width + **freshness/age decay** for Zone Quality. **Don't copy:** CC-NC code, look.
- **Maps:** Trend — · Zone ● · Location ◑ · Chop — · ATR ◑ · Agreement ◑

### 5. Smart NR2–NR20 + Inside Bar — Zeiierman · HIGH(CC-NC) · 5/5
- **Category / solves:** Chop/compression + regime — detects narrowing range and adapts to trend strength.
- **Core concept:** an NR(n) is the tightest range vs its history; **ADX maps trend strength → adaptive lookback** (strong trend = shorter, chop = longer/stricter); inside-bar = contained range.
- **Formula ideas:** range-vs-history rank (`rankTightness`); ADX→lookback interpolation; compression as a regime cue.
- **Strengths:** clean compression + regime signal. **Weaknesses:** ships a full TP/SL **signal** engine. **Failure:** the trade layer is pure signal (off-brand).
- **RC learns:** **compression detection + ADX-as-regime-gate** for the Chop cap and Compression state. **Don't copy:** the entire trigger/TP/SL/arrow layer — counter-example for "not trades."
- **Maps:** Trend ◑ · Zone — · Location — · Chop ● · ATR ◑ · Agreement ◑

### 6. S/R Pro Toolkit — LuxAlgo · **HIGH (proprietary)** · 4/5
- **Category / solves:** S/R + dashboard surface — a comprehensive, polished S/R + panel product.
- **Core concept (from public description only):** multi-method S/R with a clean status panel; **study the *surface* (how much it shows vs hides), not the engine.**
- **Strengths:** premium, legible surface. **Weaknesses/Failure:** closed logic; can over-show.
- **RC learns:** surface restraint + one-glance hierarchy. **Don't copy:** ANY code/UI/name/colors — proprietary; description-only.
- **Maps:** Trend — · Zone ◑ · Location ◑ · Chop — · ATR — · Agreement ◔  *(surface reference)*

### 7. Angle Market Structure — BigBeluga · HIGH(CC-NC) · 4/5
- **Category / solves:** market structure — pivots + structure breaks with **ATR deviation bands** and a consecutive-break counter.
- **Core concept:** confirmed pivots define structure; crossing a pivot increments an up/down **count** (momentum of structure); ±1/2/3 ATR deviation rails frame extension.
- **Formula ideas:** consecutive break counting; ATR deviation rails as extension context.
- **Strengths:** clean structure read. **Weaknesses:** count can overstate. **Failure:** choppy pivots inflate counts.
- **RC learns:** **structure-break counting** for Trend clarity + **ATR rails** for Extension/Location. **Don't copy:** CC-NC code, look.
- **Maps:** Trend ● · Zone ◔ · Location ◑ · Chop ◔ · ATR ◑ · Agreement ◑

### 8. Trend Impulse Channels — Zeiierman · HIGH(CC-NC) · 4/5
- **Category / solves:** trend — separates impulsive trend from drift via a channel.
- **Core concept:** dynamic channel whose width/slope distinguishes impulse vs chop.
- **Formula ideas:** slope + channel containment as trend quality.
- **Strengths:** intuitive impulse read. **Weaknesses:** channel lag. **Failure:** late flips in fast reversals.
- **RC learns:** channel **containment + slope** → Trend Structure quality. **Don't copy:** CC-NC code, gradient look.
- **Maps:** Trend ● · Zone — · Location ◑ · Chop ◑ · ATR ◔ · Agreement ◑

### 9. Deviation Trend Profile — BigBeluga · HIGH(CC-NC) · 4/5
- **Category / solves:** extension/location — ±ATR/σ stretch bands around trend.
- **Core concept:** measure how stretched price is from a trend baseline in ATR/σ units.
- **Formula ideas:** ATR-normalised distance → Normal/Stretched/Extended.
- **Strengths:** clean extension measure. **Weaknesses:** baseline choice matters. **Failure:** baseline whips in chop.
- **RC learns:** the **Extension lens + Extended cap** math. **Don't copy:** CC-NC code, profile visuals.
- **Maps:** Trend ◑ · Zone — · Location ● · Chop — · ATR ● · Agreement ◑

### 10. Adaptive Trend Channel — verify · HIGH · 4/5
- **Category / solves:** trend/location — auto regression channel + slope.
- **Core concept:** fit a channel to recent swings; slope = direction, width/R² = cleanliness; position-in-channel = location.
- **Formula ideas:** regression slope + fit quality (R²); range-position within channel.
- **Strengths:** direction + clarity in one. **Weaknesses:** endpoint repaint risk. **Failure:** repaints if unconfirmed.
- **RC learns:** **R²/fit as Trend *clarity*** + channel range-position for Location. **Don't copy:** code/look; avoid repaint.
- **Maps:** Trend ● · Zone — · Location ● · Chop ◑ · ATR ◔ · Agreement ●

### 11. MA Suite SMA + EMA [Institutional] — verify · HIGH · 4/5
- **Category / solves:** MA structure — multi-MA stack with an alignment state.
- **Core concept:** 20/50/200 stack order + slope → a single trend-structure state.
- **Formula ideas:** stack ordering, slope sign, spacing normalisation → 0–100.
- **Strengths:** robust trend health. **Weaknesses:** lag at turns. **Failure:** whipsaw near crossovers.
- **RC learns:** **MA alignment/stacking → Trend sub-score + the trend-decided gate.** **Don't copy:** code/look.
- **Maps:** Trend ● · Zone — · Location ◔ · Chop ◑ · ATR — · Agreement ●

### 12. Adaptive Trend Ribbon [Alpha Extract] — verify · HIGH · 4/5
- **Category / solves:** MA structure — ribbon whose compression/expansion shows trend health.
- **Core concept:** many MAs; **ribbon spread** = trend strength, **ribbon tangle** = chop.
- **Formula ideas:** spread/width of the MA set as a regime + trend proxy.
- **Strengths:** glanceable. **Weaknesses:** visually heavy. **Failure:** ribbon clutter (anti-calm).
- **RC learns:** **MA spread → Trend strength AND chop** (feeds Chop cap). **Don't copy:** the ribbon visual (clutter we must avoid).
- **Maps:** Trend ● · Zone — · Location — · Chop ● · ATR — · Agreement ◑

### 13. AG Pro MA Ribbon Stress Meter — verify · HIGH · 4/5
- **Category / solves:** MA/regime — turns ribbon spread into a **stress/regime meter**.
- **Core concept:** normalise MA-spread into a 0–100 "stress" → trend vs compression vs expansion.
- **Formula ideas:** spread percentile → regime band.
- **Strengths:** regime as one number. **Weaknesses:** meter can mislead at turns. **Failure:** lag.
- **RC learns:** **spread-percentile → Regime input** (Compression/Expansion). **Don't copy:** meter UI/name.
- **Maps:** Trend ◑ · Zone — · Location — · Chop ● · ATR ◑ · Agreement ◑

### 14. Smart Money Breakout Channels — AlgoAlpha · MED(MPL) · 3/5
- **Category / solves:** structure — BOS-style breakout channels.
- **Core concept:** track structure highs/lows; a break = structure shift; channel frames it.
- **Formula ideas:** break-of-structure detection; channel as context.
- **Strengths:** clean BOS read. **Weaknesses:** "smart money" hype framing. **Failure:** false breaks in chop.
- **RC learns:** BOS as a **Trend/Structure-change** cue (Structure Delta). **Don't copy:** MPL code, name/branding.
- **Maps:** Trend ● · Zone ◔ · Location ◔ · Chop ◑ · ATR — · Agreement ◑

### 15. Support Resistance — Dynamic v2 — verify · HIGH · 3/5
- **Category / solves:** S/R zones — levels that update and expire dynamically.
- **Core concept:** maintain a live set of levels; promote/demote/expire on interaction.
- **Formula ideas:** level lifecycle (create→test→break→expire).
- **Strengths:** self-maintaining. **Weaknesses:** churn. **Failure:** flicker.
- **RC learns:** **zone lifecycle states** (Fresh/Tested/Weak/Broken). **Don't copy:** code/look.
- **Maps:** Trend — · Zone ● · Location ◑ · Chop — · ATR — · Agreement ◑

### 16. Volumatic Support/Resistance — BigBeluga · HIGH(CC-NC) · 3/5
- **Category / solves:** S/R + volume **context** — weights levels by volume at price.
- **Core concept:** levels where volume concentrated are emphasised.
- **Formula ideas:** volume-at-level as *context weight* — **never a score input for RC**.
- **Strengths:** highlights meaningful levels. **Weaknesses:** volume-dependent. **Failure:** thin-volume symbols mislead.
- **RC learns:** which level *matters* as **context only** (brand law: volume 0% of score). **Don't copy:** CC-NC code; don't import volume into the score.
- **Maps:** Trend — · Zone ◑ · Location ◑ · Chop — · ATR — · Agreement ◔  *(context)*

### 17. Auto Channel [SciQua] — verify · HIGH · 3/5
- **Category / solves:** trend/location — auto-fit channel.
- **Core concept:** fit channel to swings; position-in-channel = location.
- **RC learns:** range-position for Location; channel slope for Trend. **Don't copy:** code/look; avoid repaint.
- **Maps:** Trend ◑ · Zone — · Location ● · Chop ◔ · ATR — · Agreement ◑

### 18. Auto Parallel Channels (HTF) — verify · HIGH · 3/5
- **Category / solves:** trend/location — **HTF** parallel channel context.
- **Core concept:** higher-timeframe channel framing the current TF.
- **RC learns:** HTF agreement as a **future MTF gate** (off by default). **Don't copy:** code/look; use `lookahead_off`.
- **Maps:** Trend ◑ · Zone — · Location ◑ · Chop — · ATR — · Agreement ●  *(MTF roadmap)*

### 19. Dual MA Gradient [Gabremoku] — verify · HIGH · 3/5
- **Category / solves:** MA structure — two-MA spacing/gradient.
- **Core concept:** distance/gradient between two MAs = trend pressure.
- **RC learns:** simple **MA spacing** as a light Trend input. **Don't copy:** gradient fill/name.
- **Maps:** Trend ◑ · Zone — · Location — · Chop ◑ · ATR — · Agreement ◔

### 20. Stop-Loss Clustering / Breakouts — KioseffTrading · MED(MPL) · 3/5
- **Category / solves:** liquidity/zones — clusters of likely stops act as magnets.
- **Core concept:** infer where stops pool → levels price gravitates to.
- **Formula ideas:** clustering of swing extremes as a *context* level (not a signal).
- **Strengths:** explains "why a level matters." **Weaknesses:** speculative. **Failure:** narrative over-reach.
- **RC learns:** clustering as **Zone context**, strictly non-predictive. **Don't copy:** MPL code; no "stop hunt" signal framing.
- **Maps:** Trend — · Zone ◑ · Location ◑ · Chop — · ATR — · Agreement ◔

## Coverage read
- **Strong:** S/R zone quality (1–4,15,16,20), MA structure (11–13,19), trend channels (8,10,17,18), structure breaks (7,14).
- **Thin in the folder:** dedicated **chop/regime** (only 5,12,13) and **pure volatility/ATR regime** (Choppiness Index, Efficiency Ratio) — fill from public-standard concepts (see `RANGECLARITY_INDICATOR_RESEARCH_LIBRARY_PLAN.md`).
- **Counter-examples (study what NOT to do):** FVG (signal bot, lookahead), SmartTrader (kitchen-sink signals), MLRSI/Neural (ML oscillators, off-brand).
