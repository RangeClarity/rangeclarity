# RangeClarity V2 — Surface Spec (the calm visible product)

> Canonical. Pairs with `docs/RANGECLARITY_V2_ENGINE_SPEC.md` (the hidden engine).
> Supersedes the legacy decision-support specs (see "Legacy" note in those files).
> Status: **spec/lock** — no Pine is written from this until the founder approves
> an implementation pass.

## Product shape (locked)
**RangeClarity is a clean TradingView dashboard that shows trend structure, key
zones, current location, extension, zone quality, and structure change — without
signals.** Simple surface, complex engine. No signals. No noise. Just structure.

## Why this exists
The moat is **not** the table — it is the **hidden Structure Quality Engine**
behind it. The surface must stay calm, screenshot-friendly, and readable in 3
seconds; the depth lives underneath and only surfaces as a few honest states.

## Default surface — the table (6–7 rows, locked)
State-first wording. **One** optional whole-number headline; **no per-row
numbers** by default (they live in Advanced).

| # | Row | States (one word/phrase) | Notes |
|---|---|---|---|
| 1 | **RangeClarity** | `Clear` / `Mixed` / `Weak` / `Insufficient Structure` (+ optional whole number, e.g. `Clear · 84`) | Headline; from RC Score + caps |
| 2 | **Trend Structure** | `Clean` / `Mixed` / `Weak` / `Range-bound` | MA alignment + slope + channel + HH/HL or LH/LL |
| 3 | **Location** | `Near Support` / `Lower Range` / `Mid-Range` / `Upper Range` / `Near Resistance` / `Above Range` / `Below Range` | from the Location Quality module |
| 4 | **Zone Quality** | `Fresh` / `Tested` / `Weak` / `Insufficient` | quality of the key zones in play |
| 5 | **Extension** | `Normal` / `Stretched` / `Extended` | distance from structure (ATR), context only |
| 6 | **Structure Change** | `Improved` / `Weakened` / `Unchanged` | vs prior confirmed bar/day — the daily habit hook |
| 7 | **Key Zones** | `S 58.40 · R 67.50` | compact nearest support + resistance (+ distances) |

Notes on the row set (reconciled with Codex):
- **Regime is not a default row.** It feeds the engine + RC Score and is shown in
  Advanced; "Trend Structure" already conveys trend-vs-range at a glance.
- Row 7 puts both key levels on **one** compact line to keep the table short.
- If an even simpler "3-second" cut is wanted, **Extension** moves to Advanced
  (→ 6 rows). Default is 7.

## Visible chart elements (max default surface)
- One calm **directional trend/channel** (teal up / magenta down / slate neutral),
  shown only when reliable; hidden otherwise.
- **Nearest meaningful S/R only** — 1–2 support + 1–2 resistance (Max Visual ≤ 2/side,
  Clean 1/side, hard cap 4); strong zones heavier, weak zones faded/hidden.
- **Minimal MA structure** — quiet 200 anchor + subtle 20/50 cloud (orientation only).
- Native **volume bars** may remain (chart-native) — **no volume engine**.
- **No default RSI panel.** No second pane by default.

## Numeric policy (resolved)
- **Headline:** one calm **state word** + an **optional whole number** (no decimals,
  no fake precision). The number can be toggled off.
- **Rows:** **state words only** by default. Row-level numbers are **Advanced**.
- Rationale: a column of `/100`s reads like a scoreboard (louder, more generic,
  faintly signal-like). Words stay calm and instantly legible; one honest headline
  number keeps it premium and screenshot-friendly.

## Language policy
**Allowed:** structure, regime, location, extension, range, zone quality, trend
structure, structure change, clarity, risk/context, clean/mixed/weak,
fresh/tested, stretched/extended, near support/resistance.
**Forbidden:** buy/sell, entry/exit, target, arrows, signal/setup labels,
prediction, profit/win-rate/accuracy/"high-probability", financial-advice wording,
and the retired verdict words (`Avoid Chase`, `Pullback Zone`, `Breakout Watch`,
`Wait` as an instruction, `poor R/R`, `size down`).

## Advanced (hidden by default)
Row-level scores · Regime detail · MTF/HTF alignment · compression details ·
trend maturity · relative strength vs SPY/QQQ · ATR/ADX/CHOP internals · zone
debug (touches, age, reaction, violation count). Advanced **explains** the engine;
it never clutters the chart.

## Explicitly rejected (kept out of the canonical/default product)
Momentum module · Confidence verdict labels · No-Edge/Avoid-Chase/Pullback/Wait
instructions · Volume / liquidity engine · volume as a major score component ·
buy/sell/arrows/targets · RSI as a core selling point · MTF dashboard in default
view · loud alerts (deferred) · AI text (deferred).
