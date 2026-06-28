# RC-1 Phase 2 — Manual Validation Operator Checklist

> Goal: capture 20 chart screenshots and hand-score each against the RC-1 rubric to
> confirm the model is **conservative and honest** before any Python/Pine work.
> **Manual only — do not automate capture.** No Pine, no batch, no provider needed.

## One-time setup (TradingView)
- [ ] Use a **clean chart**: candles, dark theme, no unrelated indicators.
- [ ] Add only judging aids: **SMA/EMA 20, 50, 200** (for Trend/MA structure) and one
      **ATR-based band (e.g. Keltner)** for the Extension read. Nothing else.
- [ ] Show **~150–300 bars** so structure, pivots, and the 200-MA are all visible.
- [ ] Create folder `docs/research/validation/screens/` for the images.

## Per chart (repeat ×20, in `labels.csv` order)
1. [ ] Open the **scenario**'s suggested symbol + timeframe from `labels.csv`.
2. [ ] **Confirm the scenario actually holds** right now. Markets move — the symbol is a
       *suggestion*. If it no longer shows the scenario, **substitute a chart that does**
       and update `symbol` + `as_of_date` in the row.
3. [ ] Record the **bar date** in `as_of_date` (YYYY-MM-DD) and screenshot the chart.
4. [ ] Save as `RC1_<id>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png` in `screens/`.
       (SYMBOL without exchange prefix; lowercase scenario.)
5. [ ] **Before** scoring, fill the human columns from what you see:
       `human_trend, human_location, human_zone, human_regime, human_extension,
       human_is_clear (Y/N), human_rc_call` (your gut overall band).
6. [ ] **Hand-apply the rubric** (`rc1-scoring-rubric.md`): weighted base → `agree3`
       gate → caps (min) → penalties → band. Write `engine_state` + `engine_score`.
7. [ ] Compare to `expected_state` / `expected_caps`; set `result` = pass / fail / unclear
       (per `rc1-validation-methodology.md`).

## The exact 20 to capture (scenario is the requirement; symbol is a suggestion)
1 AAPL 1D — clean trend pulling to fresh support · 2 MSFT 1D — trend in a gap (no zone) ·
3 KO 1D — clean range, mid · 4 PG 1D — range at a tested rail · 5 TSLA 1D — chop ·
6 XOM 1D — uptrend under heavy resistance · 7 NVDA 1D — extended from 200MA ·
8 AAPL 1W — price discovery / ATH · 9 *recent IPO (<6mo)* 1D — thin data ·
10 F 1D — one-touch weak zone · 11 T 1D — stale level · 12 BTCUSD 1D — expansion ·
13 *recent listing (<200 bars)* 1D — MA200 missing · 14 GE 1D — contradictory (MA vs structure) ·
15 WBA 1D — clean **downtrend** to fresh resistance · 16 AMD 1D — failed breakout ·
17 JPM 1D — two zones ~0.3% apart · 18 AVGO 1D — full agreement (rare High Clarity) ·
19 CVX 1D — two adjacent bars (hysteresis) · 20 INTC 1D — multi-lens disagreement.

## Exit bar (to advance to Phase 3)
- [ ] ≥ **18/20 pass**.
- [ ] **Zero false-Clear** on chop / extended / conflict / contradictory / thin cases.
- [ ] **High Clarity on ≤ 1–2** of the 20.
If not met, retune thresholds in the model docs **before** the Python prototype.
