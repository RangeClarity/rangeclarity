# RangeClarity Visual System

Status: implemented in `pine/rangeclarity_sr_core_v1.pine`, inside
`// BEGIN/END RangeClarity Visual System` markers (central block) plus tagged
gates. The S/R selection/scoring engine and the MA Structure engine are
**unchanged** — this layer only controls colours, transparency, visibility
gates, derived presentation values, and presets.

## Visual philosophy
**Simple Chart. Complex Engine. No Signals. No Noise. Just Structure.**
The chart should feel professional, alive, and useful the moment RangeClarity
is added — without ever implying a trade. Everything here is *structural
context*: where price sits in its structure, how clean the trend is, and where
the key levels are. There are no buy/sell signals, no arrows, no predictions.

## Presets (input group "RangeClarity Visual")
One dropdown drives the look. Because Pine cannot change other input widgets,
the preset resolves to **effective flags in code**; per-element toggles still
apply as overrides.

- **Max Visual** *(default — first-use experience for new beta users)* — trend
  channel + S/R zones + MA cloud + MA200 anchor + dashboard + short labels.
  Strongest/nearest levels only. The "wow" setup.
- **Premium Dark** — same elements as Max Visual, tuned for dark charts
  (recommended everyday premium look).
- **Clean** — restrained professional default: S/R zones + MA200 + 20/50 cloud
  + dashboard + minimal labels, **no channel**.
- **Minimal** — dashboard + key levels only. No channel, no on-chart MA visuals,
  labels hidden. (The dashboard still shows the MA / Trend Quality scores.)

## Recommended TradingView theme
Use TradingView's **Dark** theme for the intended premium look. Pine cannot set
the chart background, candles, or theme — those are your TradingView settings.
The system is built to **remain legible on light charts** (the dashboard/legend
panels carry their own dark background; on-chart colours are mid-tone teal/
magenta/slate that read on both).

## What each colour means
- **Teal** — support / bullish structure (uptrend channel, support zones,
  bullish MA cloud, "above 200", strong/healthy scores).
- **Magenta** — resistance / bearish structure (downtrend channel, resistance
  zones, bearish MA cloud, "below 200", weak/risk scores).
- **Slate / grey** — neutral, ranging, mixed, or "not reliable enough to colour".
- **Amber / yellow** — developing / neutral score states.
- **Soft slate-white** — the MA200 long-term anchor line.

Colour is used as **state encoding, not decoration**.

## What the trend channel means
The channel is the existing validated **Soft Structure Channel**, now coloured
by direction: teal = up, magenta = down, slate = neutral/range/unclear. It is
built from the **two most recent confirmed pivots** per side, validated for
parallelism, width sanity, and relevance, and quality-scored.

### What the channel does NOT mean
It is **not** a signal, target, entry/exit, or prediction. It does not say
"buy the bottom rail" or "sell the top rail". It is a *structural envelope* for
context only, and it **defers to S/R** (S/R is always the primary layer). When
the data isn't reliable, the channel hides itself rather than drawing something
misleading.

## Cross-instrument behaviour
Distances and tolerances are **ATR- and percentage-normalised**, so the system
behaves consistently across stocks, ETFs, crypto, indices, and high/low-priced
instruments on 1D / 4H / 1H. The channel **fails gracefully**: too few pivots,
gaps, low liquidity, or flat/range markets → it shows Developing or hides, and
the state reads neutral. No hardcoded price distances, no fixed-pixel
assumptions, and object pools keep the drawing count well under the 60-object
limits.

## Validation checklist (run in TradingView — the compile is the final gate)
> Authored + statically self-checked outside TradingView; not compiled here.

Symbols: **AAPL or NVDA, SPY or QQQ, BTCUSD, one weak/downtrending stock, one
sideways/range stock.** Timeframes: **1D and 4H** (1H if possible). Themes:
**dark and light.**

1. Compiles with no errors; no object-limit errors.
2. Chart stays clean — S/R zones remain the primary layer.
3. Channel is meaningful (real parallel structure), directional (teal up /
   magenta down / slate neutral), and **hidden when not reliable**.
4. MA cloud adds clarity (teal bull / magenta bear / slate mixed); MA200 reads
   as a clear anchor; 100/150 hidden by default.
5. Dashboard is readable: RC Score dominant, then S/R · MA · Trend Quality ·
   Market State · Key Support · Key Resistance · vs 200.
6. Presets behave: **Max Visual** (default) looks impressive; **Clean** still
   feels professional (no channel); **Minimal** = dashboard + key levels;
   **Premium Dark** tuned for dark.
7. No signal language, no arrows, no prediction language anywhere.
8. Legend (optional) is OFF by default and legible when enabled.
9. Bar Replay shows no misleading repaint (confirmed pivots only).
