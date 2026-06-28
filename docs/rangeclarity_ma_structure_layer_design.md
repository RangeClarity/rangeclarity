# RangeClarity MA Structure Layer — design notes

**Status:** implemented as an additive block inside `pine/rangeclarity_sr_core_v1.pine`
(the canonical "RangeClarity S/R Core v1"). **Not a new indicator. Not a generic
ribbon. Not a signal system.** It is a subtle moving-average *structure* layer that
adds trend context to the existing S/R engine.

Scope: the block is wrapped in `// BEGIN RangeClarity Structure Stack` …
`// END RangeClarity Structure Stack` and was **appended** to the file. The S/R
engine (lines 1–713) is **byte-for-byte unchanged** — verified by md5 of the file
head before/after the edit. Every new identifier is prefixed `ms` so nothing in the
S/R engine can be shadowed or altered.

---

## Confirmed decisions (founder)
1. Canonical base = `sr_core_v1` (not a separate file).
2. Default MA family = **SMA**.
3. EMA is optional (a single input toggle).
4. Default visible MAs = **20 / 50 / 200**.
5. MA **100 / 150 are internal** (shown only in "Full" mode).
6. Higher-timeframe (HTF) 200 anchor is **optional and OFF by default**.
7. **S/R remains primary.** MA is subordinate context.
8. The MA layer is **context only, never a signal.**

---

## What it does
It helps you read four things at a glance, without adding noise:

- **Trend structure** — the order of the moving averages (are faster MAs cleanly
  above/below slower ones, or tangled?).
- **Trend quality** — a 0–100 score combining alignment, slope agreement, slope
  strength, and spacing steadiness, expressed as Strong / Healthy / Developing / Weak.
- **Compression / expansion** — how tightly the MAs are clustered (Compressed),
  spreading out (Expanding), or steady (Normal).
- **Long-term context** — price relative to the 200 MA and the 200's direction,
  with an optional higher-timeframe 200 anchor.

## What it explicitly does NOT do
No buy/sell signals. No arrows or shapes. No entries, exits, or targets. No
predictions or forecasts. No profit/win-rate language. No alerts. No strategy or
backtest. No crossovers as triggers. It never overrides the S/R structural read and
never invents support/resistance. It is descriptive context, not advice.

---

## Inputs (group "RangeClarity Structure Stack")
| Input | Default | Notes |
|---|---|---|
| Enable MA Structure Layer | **true** | Off ⇒ chart behaves exactly like the S/R-only version. |
| MA type | **SMA** | SMA = steadier; EMA = faster/more reactive. |
| Show mode | **Clean** | Clean = 20/50/200 · Full = also 100/150 · Band = fade 20/50 lines, emphasise the corridor. |
| Show 20/50 corridor fill | **true** | Subtle tinted fill between the 20 and 50 MAs. |
| Show MA price labels | **false** | Off for cleanliness; values are always in the status line via plot titles. |
| Show higher-timeframe 200 anchor | **false** | Optional long-term line; repaint-safe. |
| Higher-timeframe for 200 anchor | **1W** | Only drawn when the anchor is enabled. |
| Show MA structure dashboard | **true** | Small 4-row read-out in its own table. |
| MA dashboard position | **Bottom Right** | A different corner than the S/R dashboard (top right) to avoid overlap. |

---

## Visual behaviour (subtle by design)
- **MA 200** is the heaviest line — a calm soft slate-white anchor (width 2).
- **MA 20 / 50** are thin active lines (width 1), tinted by the structure class
  (teal = bullish, soft magenta = bearish, slate = neutral/mixed).
- **MA 100 / 150** are hidden by default; in **Full** mode they appear faint and grey
  as internal context only.
- The **20/50 corridor fill** is always faint (≈80–96% transparent), slightly more
  visible in **Band** mode and very lightly modulated by quality. No rainbow, no
  green/red flood fill.
- **Visual priority is preserved automatically.** The S/R engine draws zones with
  `box`/`line`/`label` objects (the drawing layer). The MA layer uses `plot()`/`fill()`
  (the plot layer), which TradingView renders *beneath* the drawing layer. So the
  order on screen is: **S/R zones > MA 200 anchor > 20/50 corridor > optional internal MAs.**

---

## How the read is computed (hidden in code; shown only as words)
- **Alignment (35%)** — counts pairwise order violations across all 10 MA pairs and
  measures how close the stack is to a clean order in *either* direction. A perfectly
  ordered stack (bull or bear) scores 100; a tangled stack scores low.
- **Slope consistency (25%)** — how many of the five MAs agree on direction
  (all up or all down = 1.0).
- **Slope strength (20%)** — average MA slope, normalised by ATR so it is comparable
  across instruments and timeframes.
- **Spacing health (20%)** — steadiness of the stack width (whippy, erratic spacing
  scores lower than a smoothly widening/holding stack).

These combine into **Structure Quality 0–100**, lightly EMA-smoothed, then labelled
Strong (≥75) / Healthy (≥55) / Developing (≥35) / Weak.

**Structure class** is a descriptive state, not a signal:
- **Bullish** — clean bullish order (or strong alignment with rising MAs and price above 200).
- **Bearish** — clean bearish order (or strong alignment with falling MAs and price below 200).
- **Neutral / Compression** — MAs clustered (within ~1.5 ATR) and not cleanly ordered.
- **Mixed / Transition** — everything else (the stack is reorganising).

**Spacing** = Compressed (width < ~1.5 ATR) / Expanding (width rising > 0.10 ATR/bar) / Normal.
**vs 200** = price Above/Below the 200 MA, plus the 200's direction (up `/\`, down `\/`, flat `--`).

(Thresholds — 1.5 ATR cluster, 0.10 ATR expansion, 0.5 ATR/3-bar "strong" slope — are
heuristics, documented inline as comments and easy to tune.)

---

## MA structure dashboard (separate small table)
Four rows: **MA structure**, **MA quality** (label + score), **MA spacing**, **vs 200**.

It is a *separate* compact table (default bottom-right), deliberately **not** merged
into the S/R dashboard. Reason: merging rows would require editing the existing
dashboard code, and this build could not be compiled in TradingView here — keeping the
MA table separate guarantees the S/R engine and its dashboard stay untouched. Merging
the four rows into the main 11-row table is a small, safe change once the file has had
one successful Pine Editor compile; until then, separation is the safer default.

---

## Higher-timeframe 200 anchor (repaint-safe)
When enabled, an HTF 200 MA is pulled via
`request.security(syminfo.tickerid, <tf>, <200 MA expr>, lookahead = barmerge.lookahead_off)`.
`lookahead_off` means it uses only **confirmed** higher-timeframe values — it will not
paint with information the higher timeframe had not yet produced. It is **off by default**.
(The security call itself is computed once; the line only *draws* when the toggle is on.)

---

## Isolation & safety summary
- **Append-only edit.** The block was added to the end of the file; the S/R section is
  byte-for-byte identical (md5-verified head).
- **`ms`-prefixed namespace.** No S/R variable is reused or shadowed.
- **Plot layer below the drawing layer** ⇒ S/R always renders on top.
- **Object budget.** Adds ≤ 5 short-lived labels (pooled, cleared each redraw) and one
  4-cell table; well under the indicator's `max_labels = 60`. No boxes/lines added.
- **Disable cleanly.** Set *Enable MA Structure Layer = false*: all MA plots go `na`,
  the fill/labels vanish, and the MA table is deleted — the chart is identical to the
  S/R-only version.

---

## TradingView validation checklist (final gate — must be run by a human)
> This file was authored and statically self-checked outside TradingView. It has **not**
> been compiled in the Pine Editor here. A compile + visual pass is required before use.

Test on **1D and 4H**, across a large-cap stock/ETF, a crypto pair, and an index
(e.g. NVDA, SPY, QQQ, BTCUSD, MELI, VRT):

1. **Compiles** in the Pine Editor with no errors or warnings.
2. **Chart stays clean** — S/R zones are clearly primary; MAs are subordinate context.
3. **MA 200 anchor** is readable and useful as long-term context.
4. **20/50 corridor fill** helps read trend/compression without flooding the chart.
5. **Dashboard updates** correctly: Structure / Quality / Spacing / vs 200 read sensibly
   and match what the eye sees.
6. **Show modes** behave: Clean (20/50/200), Full (adds faint 100/150), Band (faded
   lines + corridor).
7. **MA type** toggles SMA↔EMA with no errors.
8. **Bar Replay** shows no misleading repaint of the MA layer; structure changes are
   honest (MAs update on the close, like any MA).
9. **HTF 200 anchor** is off by default; when enabled it uses `lookahead_off` and does
   not look into the future.
10. **Disable toggle** returns the chart to S/R-only behaviour exactly.
11. **Compression case** (sideways/low-vol symbol) reads "Compressed" / "Neutral", not a
    forced trend.

---

## Known limitations / compile risk
- **Not compiled by us** — static, host-authoritative edit + self-review only. The Pine
  Editor compile is the final gate (see checklist).
- Needs roughly **≥ 200 bars** of history for the 200 MA; on very short charts the
  dashboard shows "–" until enough data exists.
- Hidden MAs (e.g. 100/150 in Clean mode) still appear as titled entries in the Data
  Window with no value — cosmetic only.
- Thresholds for compression/expansion/strong-slope are heuristics; tune to taste.
- MAs update on the bar close like any moving average (expected behaviour, not repaint).

## What was intentionally NOT added
No buy/sell signals, arrows, or shapes. No crossover/cross alerts. No targets, stops, or
"risk rails". No ADX/DMI/RSI/MACD/VWAP filters. No memory zones / aura / bar tint. No
strategy or backtest. No prediction or win-rate text. No rename of the indicator. No
change to the S/R engine, its zones, distances, fallback, scoring, dashboard rows 0–10,
or its alerts.

---

## No-advice disclaimer
RangeClarity is a market-structure visualisation tool. The MA Structure Layer describes
the current arrangement and quality of moving averages for context only. It does not
provide financial advice, recommendations, signals, or predictions, and nothing it
displays should be treated as a basis for any trade decision.
