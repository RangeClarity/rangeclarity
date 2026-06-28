# RC-1 Validation Methodology — 20-chart pack

> **Structural-clarity validation, not a trading backtest.** No returns, no P&L, no
> win-rate. We test whether RC Score is *honest and conservative*: does it read
> `High Clarity`/`Clear` only when a human agrees the structure is obviously clean,
> and does it stay `Mixed`/`Unclear`/`Insufficient` otherwise. Founder-run on
> TradingView (the sandbox cannot render charts).

## labels.csv schema (`docs/research/validation/labels.csv`)
One row per chart case. Human label is filled **before** seeing the engine output to
avoid bias.

| Column | Type | Notes |
|---|---|---|
| case_id | string | `RC1-01`…`RC1-20` |
| symbol | string | e.g. `NASDAQ:AAPL` |
| timeframe | string | `1D` / `1W` / `4H` |
| as_of_date | date | bar the screenshot ends on (YYYY-MM-DD) |
| scenario | enum | clean_trend / clean_range / chop / extended / price_discovery / thin_data / conflict / breakout_fail |
| human_trend | enum | Clean/Mixed/Weak/Range-bound |
| human_location | enum | NearSupport/Lower/Mid/Upper/NearResistance/Above/Below |
| human_zone | enum | Fresh/Tested/Weak/Insufficient |
| human_regime | enum | Trend/Range/Compression/Expansion/Chop |
| human_extension | enum | Normal/Stretched/Extended |
| human_is_clear | bool | "Is this *obviously clean structure*?" Y/N |
| expected_state | enum | HighClarity/Clear/Mixed/Unclear/Insufficient |
| expected_band | string | e.g. `45-69` |
| expected_caps | string | caps that should fire, e.g. `chop<=50` |
| screenshot | string | filename (see convention) |
| reviewer | string | initials |
| notes | string | free text |

## Screenshot naming convention
`RC1_<caseid>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png`
e.g. `RC1_07_AAPL_1D_20260219_extended.png`. Lowercase scenario; SYMBOL without
exchange prefix; store in `docs/research/validation/screens/`.

## The 20 required chart cases
Balanced so "Clear" is **earned**, not common (≈4 Clear-eligible, ≈16 not).

| # | Scenario | What it proves | Expected state | Expected caps |
|---|---|---|---|---|
| 01 | clean_trend + pullback to fresh support | positive control: agreement → high | **Clear / High Clarity** | none |
| 02 | clean_trend, price mid-move (gap, no zone) | trend alone ≠ Clear | Mixed | agree3 ≤69 |
| 03 | clean_range, price mid, both rails tested | clean range = clear structure | Clear | none |
| 04 | clean_range, price at tested rail | range + location + zone agree | Clear / High Clarity | none |
| 05 | chop / tangled MAs | chop forbids clarity | Unclear | chop ≤50 |
| 06 | strong trend **into** heavy resistance | conflict cap | Mixed | conflict ≤55 |
| 07 | clean_trend but ATR-extended | extension cap | Mixed | extended ≤60 |
| 08 | price discovery / ATH, no overhead level | one reference absent | Mixed | pricediscovery ≤60 |
| 09 | thin data / new listing | data gate | **Insufficient** | no number |
| 10 | one-touch "zone" treated as strong | weak-zone cap | Mixed/Unclear | weakzone ≤55 |
| 11 | stale old level, untouched 250+ bars | age decay holds | Mixed | weakzone ≤55 |
| 12 | volatility expansion / blow-off | expansion cap | Mixed | expansion ≤60 |
| 13 | MA unavailable (short history) | lens-missing cap | ≤65 | lensmissing ≤65 |
| 14 | contradictory (MA up vs LH/LL down) | contradiction → Unclear | **Unclear** | contradictory ≤44 |
| 15 | clean downtrend to fresh resistance | symmetry: shorts score like longs | Clear / High Clarity | none |
| 16 | range breakout that failed back inside | false-break not rewarded | Mixed/Unclear | conflict ≤55 |
| 17 | two overlapping zones 0.3% apart | de-dup / too-close | Mixed | — |
| 18 | strong trend, normal extension, fresh zone, both sides | full agreement | **High Clarity (>85)** | none |
| 19 | adjacent confirmed bars, no structural event | hysteresis: no big jump | stable | Δ≤~15 |
| 20 | genuine multi-lens disagreement | low stays low | Unclear (<45) | — |

## Pass / fail criteria (per case)
- **PASS** if engine state == expected_state (±1 adjacent band) **and** the expected
  caps fired **and** no forbidden inflation (no Clear while a lens is Weak/Insufficient/conflict).
- **FAIL** if it reads Clear/High Clarity on a non-clean chart, misses a required cap,
  shows a number on Insufficient, or jumps >~15 pts without a structural event.
- **UNCLEAR(review)** if human and engine disagree by ≥2 bands → investigate thresholds.

## Exit bar for Phase 2
≥18/20 PASS, **zero** false-Clear on chop/extended/conflict/contradictory/thin cases,
and High Clarity appears on ≤1–2 of the 20. Otherwise retune before prototyping.
