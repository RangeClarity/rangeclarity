# RangeClarity — Expert Review Brief

For a Pine Script expert (e.g. QuantNomad, Daveatt) reviewing `pine/rangeclarity_ultimate_core.pine` ("RangeClarity Ultimate Core - Market Map", Pine v6, overlay). This brief orients the reviewer quickly and lists the specific things we want scrutinized.

## 1. Product goal

A premium, decision-support **chart-context** indicator for swing traders and long-term investors. Philosophy: *simple on the surface, complex underneath.* It deliberately does **not** produce buy/sell signals, targets, or profit/win-rate claims. "No Edge" is a first-class output. We value **stability and explainability over cleverness**, and **non-repainting** behavior for everything that drives the verdict.

## 2. Modules (all original code; concepts re-implemented from open research, no source copied)

1. **Regime** — ATR percentile + percentile range-tightness (compression score) + ADX/DMI → Trend / Range / Compression / Expansion / Chop.
2. **Structure** — confirmed swing pivots → HH/HL/LH/LL bias, break-of-structure with a strong-close filter, failed-breakout detection.
3. **Support/Resistance** — pivot clustering + touch count, age/maturity adjustment, volume-percentile weighting → 0–100 zone strength; nearest support + resistance drawn only.
4. **Momentum** — RSI + EMA slope + ADX, confirm-only, with extension detection.
5. **Confidence** — weighted blend (regime/structure/momentum/zone) + volume nudge − named penalties → 0–100, label High/Medium/Low/Conflicting.
6. **No-Edge / Context** — priority-ordered verdict with a reason string; labels: Watch, Wait, No Edge, Avoid Chase, Breakout Watch, Pullback Zone, Strong Context, Risk Elevated.
7. **Dashboard** — one table (10 rows) + range meter; ≤2 boxes + 2 lines, objects reused.
8. **Alerts** — six descriptive, confirmed-bar-gated alerts; no buy/sell wording.

## 3. Logic summary (the parts most worth checking)

- **Pivots:** `ta.pivothigh/low(sensitivity, sensitivity)` — confirm `sensitivity` bars late by design. Recent pivots, their bar index, and volume percentile at formation are stored in capped arrays (default 8/side).
- **Zone strength** (`zoneStrength()`): `base = min(touches*18, 60)` + age adjustment (penalize <3 bars, +15 up to 300 bars, +5 to 600, −10 beyond) + volume adjustment (vol pct >80 → +15, >60 → +8), clamped 0–100.
- **Confidence:** weighted average of regimeScore/structScore/momoConfirm/zoneScore (weights .25/.30/.25/.20, sum-normalized) + volume nudge − penalties (Chop 25, conflict 20, mid-range-no-breakout 15, shock 15, extended 10, failed breakout 10).
- **Verdict:** evaluated in priority order; conflict/chop/confidence<35 → No Edge; shock → Risk Elevated; extended+bigMove → Avoid Chase; etc.
- **Drawing:** only on `barstate.islast`, objects created once then updated (`box.set_*`, `line.set_*`).

## 4. Questions for the expert

1. **Regime classification:** is the ATR-percentile + range-tightness + ADX combination robust across assets, or would you gate/normalize differently (e.g. ADX hysteresis to reduce flip-flop)?
2. **Zone strength weighting:** are the touch/age/volume weightings sensible, or do they over-reward old levels? Better maturity curve?
3. **Confidence model:** is a weighted-blend-minus-penalties approach the right shape, or would you prefer a multiplicative/odds formulation? Are the penalty magnitudes reasonable?
4. **Strong-close break filter** (`strongFrac` of bar range): good fakeout filter, or does it interact badly with gappy instruments?
5. **Momentum as confirm-only:** agree it should never gate the verdict directionally on its own?
6. **Array sizing / performance:** is `maxPivots` per side + per-bar `percentrank` calls acceptable, or are there cheaper rolling approaches?
7. **Anything that could be simpler** without losing signal?

## 5. Repainting questions (please verify)

- Confirm that the verdict, zones, and zone-strength only change on **confirmed** pivot data and do **not** repaint after bar close.
- Confirm the intentional pivot lag (`sensitivity` bars) is acceptable and clearly the right trade-off vs. any back-dating.
- The **confidence number** can update on the forming bar and locks on close (State row shows forming/confirmed). Is exposing an intrabar-updating number acceptable, or should it be frozen to last confirmed value for display too?
- Alerts are gated on `barstate.isconfirmed`. Confirm this prevents intrabar alert flip-flop.
- No `request.security`/lookahead is used. Confirm nothing else introduces look-ahead.

## 6. Testing checklist (what we'll run, feedback welcome)

- Compile clean in the Pine Editor (no errors/warnings).
- Bar-Replay repaint check: forming vs. confirmed outputs must not contradict for confirmed values.
- 9 categories (large-cap tech, high-vol growth, index ETF, crypto, choppy, trending, breakdown, breakout, low-volume) on 1H/4H/1D — see `RANGECLARITY_PINE_TEST_PLAN.md`.
- Object-count stays within budget (1 table + 2 boxes + 2 lines) on long history.
- "No Edge / Wait / Risk Elevated" appears appropriately in messy/risky conditions.

## 7. Known limitations (already acknowledged)

- Pivots lag by `sensitivity` bars (by design).
- Behavior varies across asset classes; thin/low-liquidity charts are noisy (tool tends to No Edge there).
- Confidence is **alignment**, not probability of profit — documented as such to users.
- No multi-timeframe confirmation in this core (planned for a future version).
- Not yet compiled/validated by a third party — this review is the next step.

## 8. How to load

Paste `pine/rangeclarity_ultimate_core.pine` into the TradingView Pine Editor → Add to chart. Companion docs: `RANGECLARITY_ULTIMATE_CORE_SPEC.md`, `RANGECLARITY_ALGORITHM_DESIGN.md`, `RANGECLARITY_PINE_TEST_PLAN.md`.
