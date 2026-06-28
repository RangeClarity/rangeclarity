# RangeClarity Live QA — Rules Catalog (v1)

Deterministic checks over `rc_live_qa.v1` events. Severity: 🔴 critical · 🟠 warning · 🔵 info.

## Compliance
- `compliance.forbidden_word` 🔴 — any forbidden signal-like / decision word appears in
  surfaced text (states or `ui.display_text`). List: buy, sell, entry, exit, target,
  avoid chase, pullback zone, breakout watch, confirmed breakout, conviction, liquidity,
  absorption, poor r/r, size down, win rate, high probability, guaranteed, profit.

## Score
- `score.state_mismatch` 🟠/🔵 — headline state disagrees with the RC score band
  (Clear ≥ 70, Mixed 45–69, Weak < 45).
- `score.large_jump` 🟠 — RC score moved more than 35 points vs the previous confirmed
  bar for the same symbol/timeframe.
- `score.high_with_weak_zones` 🟠 — RC score ≥ 70 while a key zone is Weak/Insufficient
  or scores < 45.

## Location
A level counts as **near** when price is within `nearDistancePctMax` (1.5%) **or** within
`nearAtrMax` (1.0 ATR) of it — the dual proximity test the indicator's Location kernel uses
(`location.near_atr` carries the ATR distance to the nearer key level; optional).
- `location.near_too_far` 🟠 — state "Near Support/Resistance" but price is **not near** that
  level by either test (> 1.5% **and** > 1.0 ATR). Otherwise the state should read Lower / Upper Range.
- `location.state_vs_position` 🔵 — Location state disagrees with the expected state derived from
  `range_position` **and** proximity (≤20 + near → Near Support · ≥80 + near → Near Resistance ·
  ≤40 Lower · <60 Mid · else Upper). "Near" requires an extreme position *and* real proximity, so a
  wide band reads Lower/Upper — not "Near" — when price is structurally far.

## Zone
- `zone.stale_but_strong` 🟠 — zone `stale=true` yet reads Fresh/Tested or scores ≥ 80.
- `zone.age_not_flagged` 🔵 — age > 250 bars but `stale=false`.
- `zone.one_touch_strong` 🟠 — ≤ 1 touch but treated as strong.
- `zone.too_close` 🟠 — support and resistance within 1% of each other (overlap/duplicate).

## Data quality
- `zone.missing_both` 🟠 — no key support and no key resistance.
- `zone.missing_support` / `zone.missing_resistance` 🔵 — one-sided structure.

## Regime / Visual
- `regime.high_score_in_chop` 🟠 — RC score ≥ 70 while regime is Chop.
- `visual.too_many_rows` 🟠 — table rows > 9 (default-surface budget).
- `visual.too_many_zones` 🟠 — drawn zones > 4 (hard cap).

Thresholds live in `lib/qa/schema.ts` (`THRESHOLDS`) and are tunable.
