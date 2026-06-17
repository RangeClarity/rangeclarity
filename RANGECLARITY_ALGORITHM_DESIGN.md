# RangeClarity — Algorithm Design

Plain-English design of the engine behind `pine/rangeclarity_ultimate_core.pine`. Everything here is original, re-implemented from extracted concepts (see `indicator_research_library/BEST_IDEAS_EXTRACTED.md`). No source code reused.

---

## 1. Inputs (kept minimal, strong defaults)

- **Sensitivity** (pivot lookback, default 10) — bigger = cleaner/slower swings.
- **Zone width ×ATR** (default 0.6) — zone band thickness.
- **Show zones / Show range bounds & meter / Use momentum in confidence / Use volume confirmation** — toggles.
- **Theme / Dashboard position.**
- **Advanced:** ATR length (14), ATR percentile window (100), compression lookback (20), ADX length (14), RSI length (14), EMA length (20), pivots remembered (8), confidence thresholds (high 70 / med 45), module weights (structure .30, regime .25, momentum .25, zone .20).

---

## 2. Core calculations

### 2.1 Shared measurements
`atr = ATR(len)`, `atrPct = percentrank(atr, win)`, `[+DI,−DI,ADX] = dmi(len,len)`, `rsi = RSI(close,len)`, `ema = EMA(close,len)`, `emaSlope = (ema − ema[5]) / atr`, `volPct = percentrank(volume, win)`.

### 2.2 Regime detection
1. **Compression score** (concept ex *NR2–NR20*): take the current bar range `high−low`, and compute its percentile rank *inverted* over `compression lookback` → tighter-than-history = higher score. Also factor ATR percentile. `compressionScore = clamp(0.6×(100−rangePctile) + 0.4×(100−atrPct), 0, 100)`.
2. **Flags:** `compression = atrPct<25 or compressionScore>70`; `expansion = atrPct>75`; `shock = atrPct>92`; `trending = ADX≥22`; `ranging = ADX<18`.
3. **Label (priority):** Compression (compressed & not trending) → Expansion (expanding & trending) → Trend (ADX strong) → Range (ADX weak) → else Chop.
4. **Regime clarity score** feeds confidence: Trend 82, Expansion 78, Compression 62, Range 52, Chop 22.

### 2.3 Structure detection
1. Confirmed pivots `ta.pivothigh/low(sensitivity, sensitivity)`; keep last two highs/lows + a rolling array of recent pivots.
2. **Bias** from HH+HL (Up), LH+LL (Down), else Neutral (concept ex *Dynamic Swing* swing labels).
3. **Break with strong-close filter** (concept ex *Smart Money*): `bosUp = close > lastPH AND (close − lastPH) ≥ strongCloseFrac × (high−low)`; symmetric for down. This rejects weak pokes.
4. **Failed breakout:** pierced last bar, closed back inside this bar.
5. **Structure label & score:** Bullish/Bearish 80, Breakout attempt 60, Range-bound 46, Failed breakout 34, Neutral 30.

### 2.4 Support / resistance detection (upgraded)
1. Maintain rolling arrays of recent confirmed pivot highs (resistance candidates) and lows (support candidates).
2. **Nearest zones:** nearest pivot high above price = resistance; nearest pivot low below = support. Band = ±(zoneWidth×ATR).
3. **Touch count** (concept ex *Support Resistance Channels*): how many stored pivots fall within the band → raw strength.
4. **Maturity / age-decay** (concept ex *Liquidity Magnet*): bars since the zone's defining pivot; penalize very fresh (<~3 bars), reward mid-life, gently decay when stale.
5. **Volume-percentile modifier** (concept ex *Volumatic S/R*): if the defining pivot formed on high-percentile volume, boost strength.
6. **Zone Strength 0–100** = `clamp( base(touches) + maturityAdj + volumeAdj , 0, 100)`.

### 2.5 Range position
`rangeHi`/`rangeLo` = nearest resistance/support (fallback to recent extremes if no pivots yet). `rangePos = clamp((close−rangeLo)/(rangeHi−rangeLo)×100, 0, 100)`. Buckets: ≥66 Upper, ≤34 Lower, else Mid. Flags: `nearRes` ≥75, `nearSup` ≤25, `midRange` 40–60.

### 2.6 Momentum (confirm-only)
`momScore = clamp(50 + (rsi−50)×0.6 + clamp(emaSlope,−3,3)×12 + (ADX−20)×0.5, 0, 100)`. Rising vs `momScore[3]`. `extended = rsi>72 or rsi<28`. Label: Extended → Strong (≥65 & ADX≥22) → Improving (≥52 & rising) → Fading (<50 & not rising) → Weak (ADX<18 & RSI≈50) → Neutral. Direction (Up/Down/Flat) used for conflict detection. **Never standalone entry.**

### 2.7 Confidence scoring (explainable)
1. **Momentum-confirms-bias** `momoConfirm`: agree → 85, conflict → 20, else ~50.
2. **Proximity weight** (concept ex *Magnet*): zone quality scaled up as price nears a strong zone (closer + stronger = higher `zoneScore`).
3. **Volume confirmation** (concept ex *Volume Bubbles*): if a breakout/near-boundary read is backed by high `volPct`, small confidence boost; compression with low volume → small penalty.
4. **Base:** `(regimeScore·wR + structScore·wS + momoConfirm·wM + zoneScore·wZ) / Σw`.
5. **Penalties (named, subtracted):** Chop −25, conflict −20, mid-range-no-breakout −15, shock −15, extended −10, failed breakout −10.
6. `confidence = clamp(base + volumeAdj − penalties, 0, 100)`; label High/Medium/Low, or **Conflicting** when bias and momentum disagree.

### 2.8 No-edge downgrade logic
Verdict evaluated in priority order, each with a reason string:
- conflict / chop / confidence<35 → **No Edge** (reason: conflicting / messy / low confidence)
- shock (very high ATR pct) → **Risk Elevated** (reason: volatility shock)
- extended + price >2×ATR from EMA → **Avoid Chase** (reason: too extended)
- compression near a boundary → **Breakout Watch** (reason: coiled near boundary)
- compression otherwise → **Wait** (reason: let it resolve)
- uptrend into support / downtrend into resistance → **Pullback Zone**
- confidence ≥ high & aligned → **Strong Context**
- mid-range → **Wait** (reason: mid-range, poor R/R)
- else → **Watch**

---

## 3. Scoring model (honesty rules)

- Whole numbers only — no `73.48%` false precision.
- Correlated inputs don't multiply confidence; agreement is rewarded, conflict explicitly penalized.
- Low is allowed to be low; No-Edge is a valid, common output.
- Every penalty is a named, documented condition — any score is explainable in one sentence.

---

## 4. Visual output (what the user sees)

- **Up to two zone boxes:** nearest support (green-tinted) and nearest resistance (red-tinted), reused/updated each bar (never spawned per bar).
- **Optional dashed range bounds** at nearest support/resistance.
- **One compact dashboard table** (≤8 rows + context line) with color-coded values.
- **Range meter:** a short ASCII bar (e.g. `[####------]`) showing range position 0–100 at a glance.
- **Momentum state, Zone Strength, Confidence** as words + numbers.
- **Context** label (one of the allowed set) + a one-line plain-English **Note** (the reason).
- **State** row: `forming` vs `confirmed`, plus "not advice".

No label spam, ≤6 colors, no second pane. Drawing budget: 1 table + 2 boxes + 2 lines.
