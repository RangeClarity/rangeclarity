# Top idea cards (first 10)

Grounded in real scripts surveyed on /scripts/page-2 (June 2026). **Open-source status = VERIFY for all** until confirmed on each page. Cards are concept-level; no code captured. Cards 9–10 are deliberate **anti-patterns** (what not to build).

---
## 1. Siege Structure Engine (Multi-TF)
1. Name: Siege Structure Engine (Multi-TF) · 2. Author: DAFE · 3. `/script/4dTBTLXL-Siege-Structure-Engine-Multi-TF-DAFE/` · 4. VERIFY
5. **Core idea:** Detects market structure (swing highs/lows, Break of Structure, Change of Character) across multiple timeframes and frames a directional bias.
6. **Engine:** swing pivots → BOS/CHoCH labeling → HTF/LTF alignment; "internal vs swing" structure separation.
7. **UI:** structure labels + lines; can get busy on lower TFs.
8. **NOT copy:** dense BOS/CHoCH label spam, its exact visual, any code.
9. **Original build:** confirmed-bar pivot detection (`ta.pivothigh/low` with N bars right = no repaint); store last swings in arrays; derive one bias state (up/down/neutral) + a single "structure intact / broken" flag. Show *one* line per active swing, not all history.
10. **Value:** Core of our **Structure** module + feeds **Bias** and **Confidence**. Weight: high.
Ranking: value5 · orig3 · visual3 · engine4 · pine4 · moat3 · generic3 · repaint2

---
## 2. Liquidity Hunter
1. Liquidity Hunter · 2. (author VERIFY) · 3. `/script/7mWjLVnQ-Liquidity-Hunter/` · 4. VERIFY
5. **Core idea:** Finds clustered swing liquidity (equal highs/lows, pools) and flags where price may "hunt" stops.
6. **Engine:** cluster nearby pivots within a tolerance; tag equal highs/lows; track untouched pools.
7. **UI:** pool lines/zones; clutter risk if every pool drawn.
8. **NOT copy:** drawing every pool; predictive "hunt" arrows; code.
9. **Original build:** ATR-tolerance clustering of confirmed pivots; keep only the **nearest untouched** pool above and below price; a "proximity score" = distance/ATR. Sweep = wick beyond pool then close back inside (confirmed bar only).
10. **Value:** **Liquidity** module: nearest pool, sweep flag, proximity score → feeds Confidence + an alert. Weight: high.
Ranking: value5 · orig4 · visual3 · engine4 · pine3 · moat4 · generic2 · repaint3

---
## 3. Liquidity Stress Oscillator Pro
1. Liquidity Stress Oscillator Pro · 2. (VERIFY) · 3. `/script/S02UoUxh-Liquidity-Stress-Oscillator-Pro2/` · 4. VERIFY
5. **Core idea:** A composite oscillator describing a "liquidity regime / stress" state.
6. **Engine:** combine spread/volume/volatility proxies into one normalized 0–100 stress reading; regime bands.
7. **UI:** sub-pane oscillator — fine, but another pane to read.
8. **NOT copy:** opaque composite with no explanation; code.
9. **Original build:** a small set of *explainable* inputs (ATR percentile + relative volume + range position) → normalized composite that we can decompose ("why is stress high?"). Surface as a **Regime** state, not a mystery line.
10. **Value:** **Market Regime** module + the "No edge / Caution / Clean setup" verdict. Weight: high.
Ranking: value4 · orig4 · visual3 · engine4 · pine4 · moat4 · generic2 · repaint2

---
## 4. AG Pro VWAP Reclaim Quality
1. AG Pro VWAP Reclaim Quality · 2. AGPro · 3. `/script/1HZCCeTg-AG-Pro-VWAP-Reclaim-Quality-AGPro-Series/` · 4. VERIFY
5. **Core idea:** Doesn't just mark a VWAP reclaim — it **scores the quality** of the reclaim (strong bar, acceptance above, can be downgraded if structure lost).
6. **Engine:** multi-condition quality score (body size vs range, acceptance/closes above level, trend penalty, downgrade logic).
7. **UI:** compact quality readout — good model for us.
8. **NOT copy:** VWAP-specific logic verbatim; code; exact labels.
9. **Original build:** generalize "**event quality scoring**" to *any* level event (zone touch, reclaim, sweep): score = f(bar strength, acceptance, volume, trend agreement) with explicit **downgrade** if price loses the level. This is our scoring philosophy.
10. **Value:** Directly shapes **Confidence Score** + **Entry Quality** ("chasing / fair / patient"). Weight: very high — this is the most on-brand card.
Ranking: value5 · orig4 · visual4 · engine4 · pine4 · moat4 · generic2 · repaint2

---
## 5. HTF PD Arrays (OB / FVG / Pivot)
1. HTF PD Arrays · 2. (VERIFY) · 3. `/script/DeKFdP4G-HTF-PD-Arrays-6H-90m-OB-FVG-Pivot-RB/` · 4. VERIFY
5. **Core idea:** Maps higher-timeframe premium/discount arrays (order blocks, fair-value gaps, pivots) onto the chart.
6. **Engine:** HTF zone derivation; premium vs discount relative to a range midpoint.
7. **UI:** **too many** boxes — the clutter we explicitly avoid.
8. **NOT copy:** the wallpaper of OB/FVG boxes; SMC jargon overload; code.
9. **Original build:** keep only the idea of **premium/discount within the current range** (where is price in its range, upper/middle/lower third) + the *single* nearest HTF zone. Skip FVG/OB spam for MVP.
10. **Value:** **Smart Zones** + range-position input to Regime/Bias. Weight: medium (trim hard).
Ranking: value3 · orig3 · visual2 · engine3 · pine3 · moat3 · generic4 · repaint3

---
## 6. Volume Zones
1. Volume Zones · 2. (VERIFY) · 3. `/script/7PmTJIqs-Volume-Zones/` · 4. VERIFY
5. **Core idea:** Support/resistance zones weighted by the volume transacted there.
6. **Engine:** bucket volume by price; high-volume nodes become zones.
7. **UI:** zones/heat — can be heavy; we'd show 2–4 max.
8. **NOT copy:** full volume-profile rendering; code.
9. **Original build:** add a **volume score** to our ATR-clustered zones (sum relative volume at bars that touched the zone) → a zone is "stronger" if it formed on high participation. Cap to top 2 zones each side.
10. **Value:** Upgrades **Smart Zones** from price-only to volume-aware; feeds Confidence. Weight: high.
Ranking: value4 · orig4 · visual3 · engine4 · pine3 · moat4 · generic2 · repaint2

---
## 7. GammaRSI (adaptive RSI, K-Means bands)
1. GammaRSI · 2. MarketFragments · 3. `/script/Dkc6Axai-GammaRSI-MarketFragments/` · 4. VERIFY
5. **Core idea:** RSI whose overbought/oversold bands **adapt** to recent behavior (K-Means clustering of RSI values into zones) instead of fixed 70/30.
6. **Engine:** cluster recent RSI into adaptive bands; signal on zone change.
7. **UI:** colored RSI + zone dots — sub-pane.
8. **NOT copy:** K-Means implementation; per-bar cluster recompute (slow); code.
9. **Original build:** momentum used **only as confirmation**, not a signal: RSI relative to a rolling percentile (cheap, no clustering) + EMA-slope + ADX gate. Adaptive *thresholds* via percentile, not K-Means.
10. **Value:** **Momentum Confirmation** module (confirm-only). Weight: medium-high.
Ranking: value4 · orig3 · visual3 · engine3 · pine4 · moat3 · generic4 · repaint2

---
## 8. Long Tail RVOL Trigger
1. Long Tail RVOL Trigger · 2. (VERIFY) · 3. `/script/FIrQd7xO-Long-Tail-RVOL-Trigger/` · 4. VERIFY
5. **Core idea:** Triggers on unusually high relative volume ("long tail" of the volume distribution).
6. **Engine:** RVOL = volume / average volume; flag tail events.
7. **UI:** markers on spikes — minimal, good.
8. **NOT copy:** trigger-as-signal framing; code.
9. **Original build:** RVOL as a **context input** (light / normal / elevated participation) feeding zone strength + a "is this move backed by volume?" flag. No standalone buy/sell.
10. **Value:** **Volume Context** module. Weight: medium-high (cheap, robust).
Ranking: value4 · orig3 · visual4 · engine2 · pine5 · moat2 · generic4 · repaint1

---
## 9. AI SuperTrend Strength Forecasting Engine  ⚠️ ANTI-PATTERN
1. AI SuperTrend Strength Forecasting Engine · 2. TraderZen · 3. `/script/Y6sJ2odK-...-TraderZen/` · 4. VERIFY
5. **Core idea:** Markets itself as "AI" forecasting trend strength.
6. **Engine concept worth noting:** SuperTrend/ATR trailing direction is a legitimately useful, cheap **trend filter**.
7. **UI:** "forecast"/AI framing overpromises.
8. **NOT copy:** the word "forecasting", "AI" branding, any implication of prediction — conflicts with our compliance ("not prediction magic"). And code.
9. **Original build:** use plain **ATR trailing / SuperTrend direction** purely as an HTF trend filter input. Describe honestly as "trend state," never "forecast."
10. **Value:** **Trend Filter** input only; strong lesson in *honest wording* for our brand. Weight: low (concept), high (lesson).
Ranking: value2 · orig2 · visual3 · engine2 · pine5 · moat1 · generic5 · repaint2

---
## 10. Sniper Entry Exit (ONLY SIGNALS)  ⚠️ ANTI-PATTERN
1. Sniper Entry Exit with SL/TP (ONLY SIGNALS) · 2. KhanSaab · 3. `/script/wzw29T1g-...-ONLY-SIGNALS/` · 4. VERIFY (likely protected)
5. **Core idea:** Fires buy/sell signals with SL/TP — the exact thing we are positioned *against*.
6. **Engine:** typically MA/RSI crossovers dressed as "sniper" entries.
7. **UI:** arrow/label spam = chart wallpaper.
8. **NOT copy:** everything — signals, SL/TP promises, "sniper" hype, arrow spam, code. This is the negative space that defines our product.
9. **Original build:** the opposite — **no buy/sell spam**, one calm read, explicit "No edge" state.
10. **Value:** Defines our differentiation in one screenshot comparison. Weight: 0 (avoid), high as positioning contrast.
Ranking: value1 · orig1 · visual1 · engine1 · pine5 · moat1 · generic5 · repaint5

---

## Ranking matrix (1–5; generic & repaint: lower is better)
| # | Idea | Value | Orig | VisualSimplicity | Engine | Pine | Moat | Generic↓ | Repaint↓ | Verdict |
|---|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|
| 4 | VWAP Reclaim **Quality scoring** | 5 | 4 | 4 | 4 | 4 | 4 | 2 | 2 | **Core (scoring spine)** |
| 1 | Multi-TF **Structure** engine | 5 | 3 | 3 | 4 | 4 | 3 | 3 | 2 | **Core** |
| 2 | **Liquidity** clustering/sweep | 5 | 4 | 3 | 4 | 3 | 4 | 2 | 3 | **Core** |
| 3 | **Liquidity/volatility regime** | 4 | 4 | 3 | 4 | 4 | 4 | 2 | 2 | **Core (regime)** |
| 6 | **Volume-weighted zones** | 4 | 4 | 3 | 4 | 3 | 4 | 2 | 2 | **Core (zones)** |
| 8 | **RVOL** volume context | 4 | 3 | 4 | 2 | 5 | 2 | 4 | 1 | Build (cheap input) |
| 7 | Adaptive **momentum** confirm | 4 | 3 | 3 | 3 | 4 | 3 | 4 | 2 | Build (confirm-only) |
| 5 | HTF premium/discount arrays | 3 | 3 | 2 | 3 | 3 | 3 | 4 | 3 | Trim to range-position |
| 9 | "AI" SuperTrend forecasting | 2 | 2 | 3 | 2 | 5 | 1 | 5 | 2 | Lesson only |
| 10 | Sniper ONLY SIGNALS | 1 | 1 | 1 | 1 | 5 | 1 | 5 | 5 | Reject (anti-pattern) |

**Pipeline (cards 11–30, to write next):** Auto Pivot Trendlines (Tella), HTF PD Arrays FVG/OB detail, Candle Pattern Marker (clutter study), Precision Edge System (multi-factor composition), Auto Fibonacci (Hash), built-in Cumulative Volume Delta (TradingView, clean CVD reference), built-in Pivot Points High/Low (clean pivots), Nadaraya-Watson / kernel smoothing (regression bands), Squeeze/volatility compression, relative-strength-vs-benchmark, anchored VWAP, session accumulation/manipulation/distribution, historical-analog/fingerprint similarity, ADX regime gating, order-flow absorption proxy.
