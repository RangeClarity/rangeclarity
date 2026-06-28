# RangeClarity Indicator User Guide

*For `pine/rangeclarity_ultimate_core.pine` ("RangeClarity Ultimate Core - Market Map", Pine Script v6). This is a documentation guide; it does not change the indicator.*

---

## Quick-start checklist (read this first)

- Add the indicator to your chart.
- Look at **Regime** — what kind of market is this?
- Look at **Range Position** — near support, mid-range, or near resistance?
- Check **Momentum** — strong, fading, or extended?
- Check **Confidence** — do the modules agree?
- Respect **No Edge / Wait** — doing nothing is a valid outcome.
- Do **not** chase price near resistance.
- Use your **own research and risk management**. RangeClarity is context, not advice.

---

## 1. What RangeClarity is

RangeClarity is a TradingView chart-structure indicator. It reads the market and shows you, in one clean dashboard: **regime** (what kind of market), **structure** (the chart skeleton), **support and resistance** zones, **range position**, **momentum**, a **confidence** score, and an explicit **no-edge / wait** state.

To be completely clear:

- It is **not** a buy/sell signal bot.
- It is **not** financial advice.
- It does **not** guarantee profits.
- It does **not** predict the market.

It exists to help you understand chart context so you can make your own, better-informed decisions.

---

## 2. What problem it solves

Most traders don't lose for lack of signals — they lose by acting when there is no edge. RangeClarity is built to help you:

- Avoid buying too late, right under resistance.
- See at a glance whether price is near support, mid-range, or extended.
- Tell whether momentum is strong, fading, or exhausted.
- Recognize when there is no clear edge and waiting is the better choice.
- Replace a cluttered screen of overlapping indicators with one calm dashboard.

---

## 3. How to install it in TradingView

1. Open **TradingView** and load any chart.
2. Open the **Pine Editor** (bottom panel).
3. Open `pine/rangeclarity_ultimate_core.pine`, copy **all** of it, and paste it into the editor (replacing any template code).
4. Click **Save** and give it a name.
5. Click **Add to chart**.
6. Open the indicator's **settings** to adjust the theme, dashboard position, or sensitivity if you wish (defaults are strong).
7. **Test on multiple tickers and timeframes** before relying on it — behavior varies by asset and timeframe.

Give the chart a few hundred bars of history so pivots and percentile calculations can populate.

---

## 4. Main dashboard fields

The dashboard is a single table. Top row shows **RangeClarity** and the **ticker | timeframe**. Below are the rows you read top-to-bottom. (Note on naming: internally the engine also computes a structure score, a momentum score and a range score that feed Confidence, but to keep the surface clean only the numbers below are displayed.)

### Regime
What kind of market this is: `Trend`, `Range`, `Compression`, `Expansion`, or `Chop`. When the regime is **Compression**, a 0–100 number is shown next to it — higher means an unusually tight, coiled range. *Interpret:* it sets the backdrop for everything else. *Don't assume:* a regime label is not a direction.

### Structure
The chart skeleton: `Bullish`, `Bearish`, `Neutral`, `Range-bound`, `Breakout attempt`, or `Failed breakout`. If a directional bias exists it appears in parentheses, e.g. `Bullish (Up)`. *Interpret:* the higher-level shape of price. *Don't assume:* "Bullish" is a recommendation — it describes structure, not a trade.

### Range Position
Where price sits between the nearest support and resistance, shown as a bucket (`Lower` / `Mid` / `Upper`), a percentage, and a meter like `[#######---]`. 0% = at support, 100% = at resistance. *Interpret:* low = nearer support, high = nearer resistance, middle = mid-range. *Don't assume:* a high reading is not "sell" and a low reading is not "buy."

### Support Zone / Resistance Zone (on the chart)
These are drawn on the price chart, not as dashboard rows: a **green-tinted box** is the nearest support zone, a **red-tinted box** is the nearest resistance zone, and **grey dashed lines** mark the current range bounds. Only the nearest of each is drawn to avoid clutter. *Interpret:* areas where price has reacted before. *Don't assume:* zones are walls — price can pass through them.

### Momentum
`Strong`, `Improving`, `Fading`, `Extended`, `Weak`, or `Neutral`. *Interpret:* whether the move is gaining or running out of fuel. *Don't assume:* momentum is confirmation, never an entry trigger on its own.

### Zone Str. (Zone Strength)
The strength (0–100) of the nearest active zone, labelled with its side (`Support` or `Resistance`). It blends how many times the level was touched, how mature it is, and whether it formed on high volume. *Interpret:* higher = more history behind the level. *Don't assume:* a strong zone is guaranteed to hold.

### Confidence
A label (`High`, `Medium`, `Low`, `Conflicting`) plus a 0–100 number. It measures **how much the modules agree**, after subtracting penalties for messy conditions. *Interpret:* high = the read is internally consistent. *Don't assume:* confidence is **not** a probability of profit — see Section 9.

### Context (Decision Context)
The single most important row: one of `Watch`, `Structure Not Clear`, `No Edge`, `Stretched`, `Coiled`, `Retest Area`, `Strong Context`, or `Risk Elevated`. *Interpret:* a plain summary of the situation. *Don't assume:* none of these is "buy" or "sell." See Section 11.

### Note
A short plain-English reason for the current Context (e.g. "Mid-range - unclear location", "Coiled near a boundary"). It tells you *why* the indicator concluded what it did.

### State
Shows `forming` (the live bar has not closed — the read can still change) or `confirmed` (the bar has closed — the read is final), followed by "not advice".

---

## 5. Regime guide

| Regime | What it means for you |
|---|---|
| **Trend** | A directional move with strength (ADX-confirmed). Pullbacks into structure tend to be more interesting than mid-trend chases. |
| **Range** | Sideways, weak trend strength. Boundaries matter more than breakouts; the edges are where reactions happen. |
| **Compression** | An unusually tight, coiled range (shown with a 0–100 score). Energy is building; direction is unknown until it resolves. |
| **Expansion** | Volatility is high and the market is moving with trend strength. Moves are larger and can be over-extended. |
| **Chop** | Messy, no clean structure. This usually drives a **No Edge** context — the honest read is "nothing clean here." |

A note on "No Edge": in this indicator "No Edge" is a **Context** label, not a Regime. The Regime equivalent of "no clean market" is **Chop**, which typically produces a No Edge context.

---

## 6. Structure guide

- **Bullish structure** — higher highs and higher lows; the skeleton points up.
- **Bearish structure** — lower highs and lower lows; the skeleton points down.
- **Neutral** — not enough confirmed swings to classify yet.
- **Range-bound** — swings are flat on both sides; price is boxed in.
- **Breakout attempt** — price has closed decisively beyond the last confirmed swing (a "strong-close" filter is applied so weak pokes don't count).
- **Failed breakout** — price pierced a level then closed back inside. A high-information warning that a move lacked follow-through; it lowers confidence.

---

## 7. Support and resistance guide

- **Support zone (green box)** — an area below price where buyers have reacted before. Price may slow or bounce here.
- **Resistance zone (red box)** — an area above price where sellers have reacted before. Price may stall or reverse here.
- **Why zones, not exact lines** — real reactions cluster around an area, not a single tick. RangeClarity draws a band (price ± a fraction of ATR) to reflect that honestly. A precise line implies accuracy that doesn't exist.
- **Why a location near resistance is a weaker one** — price sits right where sellers are most likely to push back, an unclear, stretched location. The dashboard's `Stretched` label and high Range Position readings are there to flag this.
- **Why support is not guaranteed to hold** — a zone is a probability based on past behavior, not a wall. Strong zones break, especially on news or in expansion regimes. Always plan for the level failing.

---

## 8. Momentum guide

| State | Meaning | What to consider |
|---|---|---|
| **Strong** | Momentum is high and trend strength confirms it. | Strong momentum does **not** automatically mean a good entry — check where price is in the range first. |
| **Improving** | Momentum is building from a lower base. | Often more constructive than already-strong momentum near resistance. |
| **Fading** | Momentum is rolling over. | Patience may beat action; the move may be tiring. |
| **Extended** | Price is stretched (RSI at an extreme). | Chase risk is high — this is when buying late hurts most. |
| **Weak** | Little directional energy. | Consistent with range/chop; edges matter more than the middle. |
| **Neutral** | No clear momentum signal. | Treat as "no help either way." |

Momentum in RangeClarity is **confirmation only** — it is never used as a standalone buy/sell trigger.

---

## 9. Confidence guide

- **High** (score ≥ 70) — the modules are well aligned and few penalties apply.
- **Medium** (score ≥ 45) — a workable read with some caveats.
- **Low** (below the medium threshold) — weak agreement; treat with caution.
- **Conflicting** — structure and momentum disagree (e.g. bullish structure but downward momentum). Confidence is downgraded and labelled here.

**Most important:** Confidence measures **module alignment**, not the probability of a profitable trade. A "High" reading means the indicator's parts agree with each other — it says nothing about whether your trade will work.

---

## 10. No-edge / wait-state guide

**No Edge is not a failure. It is one of the most valuable things the indicator can tell you.** It means RangeClarity does not see enough clean structure or context to form a useful read.

You will typically see No Edge (or Wait) when:

- price is mid-range (poor reward-to-risk in either direction),
- signals conflict (structure says one thing, momentum another),
- momentum is extended (the move already happened),
- the market is choppy or structure is unclear,
- confidence is low.

Why "wait" can be the best output: most losses come from acting when there is no edge. A tool that is willing to say "nothing clean here, wait" is protecting you from forcing trades. Treat No Edge as permission to do nothing.

---

## 11. Allowed context labels

These are the only labels the Context row can show. None of them is a buy or sell instruction.

| Label | Meaning | When it may appear | What to consider |
|---|---|---|---|
| **Watch** | Developing; nothing decisive yet. | Mixed but not messy conditions. | Keep observing; let it clarify. |
| **Structure Not Clear** | An unclear location to read. | Compression, or mid-range with no breakout. | Patience; an edge may form later. |
| **No Edge** | Not clean enough to read. | Conflict, chop, or low confidence. | Stand aside; this is normal and useful. |
| **Stretched** | The move is over-extended. | Extended momentum and price far from its mean. | An extended, stretched location. |
| **Coiled** | Coiled and near a boundary. | Compression regime near support/resistance. | Energy may release; watch for resolution. |
| **Retest Area** | A trend is pulling back into structure. | Uptrend into support, or downtrend into resistance. | Often a more constructive location; still your call. |
| **Strong Context** | Modules are aligned, confidence high. | High confidence with no conflict. | A clean read — not a guarantee or a trade call. |
| **Risk Elevated** | Volatility shock; unstable conditions. | ATR percentile very high. | Conditions are unstable — context only. |

---

## 12. What RangeClarity does NOT mean

RangeClarity does **not**:

- tell you what to buy,
- tell you what to sell,
- predict the market,
- guarantee entries or outcomes,
- replace your own research,
- replace your risk management,
- provide financial advice.

It describes chart context. Every decision remains yours.

---

## 13. Best use cases

RangeClarity is best for:

- long-term investors using technical timing on top of fundamental ideas,
- swing traders holding positions for days to weeks,
- watchlist builders who want quick context on many names,
- anyone trying to avoid late entries near resistance,
- users who want clean chart context instead of indicator overload.

It is **not** designed for high-frequency scalping or for people who want to be told what to buy.

---

## 14. Suggested workflow

1. Start with your own fundamental or watchlist idea.
2. Open the chart in TradingView.
3. Check the **Regime**.
4. Check **support/resistance** (the zones on the chart).
5. Check **Range Position**.
6. Check **Momentum**.
7. Check **Confidence**.
8. If the Context is **No Edge / Wait**, wait.
9. If the Context is **Strong Context** (or otherwise constructive), continue your **own** research and planning.
10. Log your decision and your reasoning for later review.

---

## 15. Example interpretations (hypothetical)

*These are illustrative chart situations, not investment recommendations.*

**Example 1 — Constructive pullback.** Price near support (Range Pos. ~20%), Momentum `Improving`, Confidence `Medium`/`High`, Context `Retest Area`. *Reading:* a trend is pulling into support with improving momentum. The indicator sees a cleaner backdrop — you'd do your own risk work from here.

**Example 2 — Late and stretched.** Price near resistance (Range Pos. ~85%), Momentum `Extended`, Context `Stretched`. *Reading:* the move already happened and price is under resistance — an extended, stretched location.

**Example 3 — Nothing clean.** Price mid-range (~50%), structure and momentum disagree, Confidence `Conflicting`, Context `No Edge`. *Reading:* there's no edge. Waiting is the sensible response.

**Example 4 — Coiled.** Regime `Compression` with a high compression score, price near a boundary, Context `Coiled`. *Reading:* energy is building near an edge; watch for a resolved, confirmed move rather than anticipating.

**Example 5 — Trap and turbulence.** Structure `Failed breakout`, Regime `Expansion`/shock, Context `Risk Elevated`. *Reading:* a breakout failed and volatility is high — conditions are unstable; smaller size or standing aside is reasonable.

---

## 16. Settings guide

Defaults are strong. New users should keep everything default at first and only adjust **Theme**, **Dashboard position**, and possibly **Sensitivity**.

### Basics

| Setting | Controls | Default | When to change | When not to |
|---|---|---|---|---|
| Sensitivity (structure lookback) | How many bars define a swing pivot | 10 | Raise for cleaner/slower swings on higher timeframes; lower for more, smaller swings | Avoid extremes unless you understand the lag trade-off |
| Zone width (x ATR) | Thickness of S/R zones | 0.6 | Widen on volatile assets, narrow on calm ones | Don't make zones so wide they lose meaning |
| Show support/resistance zones | Draw the green/red boxes | On | Turn off for a barer chart | — |
| Show range bounds + meter | Draw dashed range lines + the meter | On | Turn off to declutter | — |
| Use momentum in confidence | Include momentum in the confidence blend | On | Turn off to weight structure/zones more | — |
| Use volume confirmation | Small confidence nudge from volume | On | Turn off on instruments with unreliable volume | — |
| Theme | Dark or Light dashboard | Dark | Match your chart theme | — |
| Dashboard position | Where the table sits | Top Right | Move if it overlaps price | — |

### Advanced (change only if you know why)

| Setting | Controls | Default |
|---|---|---|
| ATR length | Volatility measure length | 14 |
| ATR/volume percentile window | Lookback for volatility & volume percentiles | 100 |
| Compression lookback | Window for range-tightness ranking | 20 |
| ADX / DMI length | Trend-strength length | 14 |
| RSI length | Momentum length | 14 |
| EMA (slope) length | Slope reference length | 20 |
| Pivots remembered per side | How many recent pivots are stored | 8 |
| Strong-close fraction of bar | How decisive a close must be to count as a breakout | 0.5 |
| High-confidence threshold | Score for "High" | 70 |
| Medium-confidence threshold | Score for "Medium" | 45 |
| Weight: regime / structure / momentum / zone | Confidence blend weights | 0.25 / 0.30 / 0.25 / 0.20 |

If this feels like a lot: leave the Advanced group alone. The defaults are the recommended configuration.

---

## 17. Alerts guide

This version includes **six descriptive alerts**. All are context notifications, gated to fire only on a **confirmed (closed) bar**, and none contain buy/sell wording.

| Alert | What it means | When to use | What it does NOT mean |
|---|---|---|---|
| RangeClarity: Near Support | Price entered the nearest support zone | To be notified when price reaches support context | Not a "buy" |
| RangeClarity: Near Resistance | Price entered the nearest resistance zone | To watch for stalling/chase risk | Not a "sell" |
| RangeClarity: Coiled | Compression near a boundary | To watch a coiled setup | Not a breakout confirmation |
| RangeClarity: No Edge / Structure Not Clear | No clean edge right now | To know when to stand down | Not an instruction to act |
| RangeClarity: Momentum Extended | Momentum is stretched | To flag an extended move | Not a reversal call |
| RangeClarity: Confidence Improved | Confidence just rose to High | To re-check a chart you're following | Not a profit signal |

To use: add an alert in TradingView, choose RangeClarity as the condition, and pick the alert you want. There are **no buy/sell alerts**, by design.

---

## 18. Timeframe guide

- **Best for swing/position use:** Daily (1D) and 4-hour (4H). These are cleaner and align with the tool's intent.
- **1H:** usable for shorter-horizon swing trading, but expect more noise and more frequent No Edge readings.
- **Below 1H:** increasingly noisy; pivots lag relative to the speed of price, and the read flips more often. Use with care.
- **Test your own style:** behavior differs by asset and timeframe. Try the indicator on the instruments and timeframes you actually trade before trusting it.

Lower timeframes are noisier because swings are smaller and confirmation lags more in relative terms.

---

## 19. Limitations (honest)

- Zones can and do fail — they are probabilities, not walls.
- Momentum can reverse without warning.
- No indicator can see the future; this one included.
- Range and regime detection can behave differently across asset classes.
- Low-liquidity or thin charts can produce messy or unreliable reads (the tool will often say No Edge in those cases — that's intended).
- Extreme news events can invalidate any technical context instantly.
- You must still manage your own position sizing and risk.

---

## 20. FAQ

**Q: Is RangeClarity a buy/sell signal?**
A: No. It provides chart context and a decision framework, never trade instructions.

**Q: Does it repaint?**
A: The outputs that drive the verdict (structure, zones, zone strength) are computed on **confirmed** data and do not change after a bar closes. Swing pivots confirm a few bars late by design (an honest, unavoidable lag — pivots are never back-dated). On the **live, forming bar**, the confidence number can still update until the bar closes; the dashboard's **State** row shows `forming` vs `confirmed` so you always know whether the read is final. No `request.security`/lookahead is used. In short: confirmed outputs do not repaint; the live bar previews and then locks on close.

**Q: Does it work on all assets?**
A: It can be tested on many assets (stocks, ETFs, crypto, FX), but behavior varies. Always test on your own instruments.

**Q: Which timeframe should I use?**
A: It depends on your style. Daily and 4H are cleaner for investors and swing traders.

**Q: What does No Edge mean?**
A: Conditions are not clean enough to read — waiting is the sensible response. It is a feature, not a fault.

**Q: Can I use this alone?**
A: No. It should be one part of a broader research and risk-management process, not a sole decision-maker.

---

## 21. Quick-start (repeat)

- Add the indicator to your chart.
- Look at **Regime**.
- Look at **Range Position**.
- Check **Momentum**.
- Check **Confidence**.
- Respect **No Edge**.
- Do not chase price near resistance.
- Use your own research and risk management.

---

## 22. Disclaimer

RangeClarity is an educational and analytical chart-structure tool. It is **not financial, investment, or trading advice**, does **not** guarantee profits, and does **not** tell you what to buy or sell. Markets carry risk and you are responsible for your own decisions. Always do your own research and manage your own risk.
