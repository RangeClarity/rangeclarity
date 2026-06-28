# ▶ START HERE — RC-1 labels-50 Manual Scoring

> Open this first. Everything you need to score the 50 cases is linked below.
> **RC-1 v1 scope is LOCKED** (no new research). Goal of this pass: fill the 50-row
> template so we can run Reject-Probe v0 and measure the false-high rate.
> **No Pine · no live data · no push · no Telegram · no Linear.**

## 1. Open these (in order)
1. **Decisions / scope (why we score this way):** `../rc1-reference-iteration-decisions.md`
2. **Locked cap thresholds (the rules you apply):** `rc1-cap-thresholds-v0.md`
3. **Per-case worksheet (what to look for):** `rc1-50-manual-scoring-worksheet.md`
4. **Operator guide (how to label):** `rc1-50-labeling-operator-guide.md`
5. **Entry sheet (where you record):** `labels-50-scoring-template.csv`  ← fill this (0/50 today)

Chart setup once: clean candles · MAs 20/50/200 · one Keltner (ATR) band · ~150–300 bars
· dark theme · nothing else. Screenshots → `validation/screens/`, named
`RC1_<id>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png`.

## 2. 10-case warmup (calibration — expected gate shown on purpose)
Do these 10 first to calibrate your eye on all five states + both new buckets. (For cases
11–50, label *before* peeking at any expected value.) **First: pick RC1-09's symbol** — a
stock IPO'd < 6 months ago.

| # | Symbol | TF | What to verify | Likely gate to watch | Target state |
|---|---|---|---|---|---|
| RC1-01 | AAPL | 1D | clean uptrend pulling to a fresh tested support; 20/50/200 stacked up | none (positive control) | Clear |
| RC1-03 | KO | 1D | well-defined range, both rails tested, price mid | none; don't over-credit mid-range | Clear |
| RC1-18 | AVGO | 1D | ALL six lenses agree (trend+zone+location+regime+normal ext) | none — the rare High anchor | HighClarity |
| RC1-05 | TSLA | 1D | tangled MAs, overlapping candles, no clean swings | **chop → chop≤44** | Unclear |
| RC1-14 | GE | 1D | MA rising while structure prints LH/LL | **contradiction → contradictory≤40** | Unclear |
| RC1-07 | NVDA | 1D | clean trend but stretched far from 200-MA | **overextension → extended≤60 / severe≤50** | Mixed |
| RC1-10 | F | 1D | a one-touch level treated as strong | **weak_zone → weakzone≤52** | Mixed |
| RC1-27 | META | 1D | key support cut decisively, no reclaim | **broken_zone → broken≤50** | Unclear/low-Mixed |
| RC1-41 | JNJ | 1D | BB-inside-Keltner squeeze, low ADX, no direction | **compression → compression≤60** | Mixed |
| RC1-09 | *your IPO pick* | 1D | short history, few pivots, no MA-200 | **insufficient_data → no number** | Insufficient |

**Exact fields to fill (every case, into the CSV):** `screenshot_captured` ·
`human_review_done` · `human_trend` · `human_location` · `human_zone` · `human_regime` ·
`human_extension` · `human_is_clear` · `negative_gate_applied` · `cap_applied` ·
`manual_state` · `manual_band` · `reviewer_confidence` (1–5) · `fatal_false_high_risk` ·
`notes`.

## 3. Enum reference (use these exact values — no free text)
- **human_trend:** `Clean` · `Mixed` · `Weak` · `Range-bound`
- **human_location:** `NearSupport` · `Lower` · `Mid` · `Upper` · `NearResistance` · `Above` · `Below`
- **human_zone:** `Fresh` · `Tested` · `Weak` · `Insufficient`
- **human_regime:** `Trend` · `Range` · `Compression` · `Expansion` · `Chop`
- **human_extension:** `Normal` · `Stretched` · `Extended` · `Severe`
- **human_is_clear:** `Y` · `N`
- **negative_gate_applied:** `none` · `insufficient_data` · `contradiction` · `chop` ·
  `broken_zone` · `severe_overextension` · `weak_zone` · `mid_range_poor_location` ·
  `price_discovery` · `compression` · `conflict` · `lens_missing` · `score_instability` ·
  `expansion` · `too_close`
- **cap_applied:** `none` · `no_number` · `contradictory<=40` · `chop<=44` · `broken<=50` ·
  `severe<=50` · `weakzone<=52` · `conflict<=55` · `compression<=60` · `extended<=60` ·
  `pricediscovery<=60` · `lensmissing<=60` · `midrange<=65` · `agree3<=69`
- **manual_state:** `HighClarity` · `Clear` · `Mixed` · `Unclear` · `Insufficient`
- **manual_band:** `86-100` · `70-85` · `45-69` · `0-44` · `NA`

*(If two caps apply, use the lower ceiling. Final state = the lowest applicable cap's band.)*

## 4. Reminder
**When unsure → mark Mixed / Unclear, never Clear.** Clarity is permission, not prediction;
the product's job is to withhold confidence on bad/unclear charts, not manufacture it. Lower
`reviewer_confidence` and say why in `notes` when in doubt.

---
After 50/50 are filled: hand the sheet back → we build + run **Reject-Probe v0** (gate:
**0 fatal false-highs**, 0 Clear on any reject bucket, High Clarity ≤2, ≥46/50 consistent).
