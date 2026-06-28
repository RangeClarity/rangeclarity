# RC-1 Labeling Guide (one page) — labels-50.csv

> The 50-case stratified set for **early conviction** (Level 2). Goal: prove bad charts
> **cannot** get a high score. Metric in front of you: **false-high rate = 0.** Manual
> only — no Pine, no automation. `labels-50.csv` adopts the negative-first tightened caps
> (`rc1-negative-first-scoring.md` §7); the original 20-case `labels.csv` is unchanged.

## Set composition (50)
Bad-structure (reject) buckets, ~5 each: **chop, weak_zone, broken_zone (new),
mid_range_poor_location, overextension, contradiction_conflict, compression (new),
thin_data**, plus edges (volatility_expansion, visual_dashboard_risk, score_stability).
Positive controls are a deliberate minority (~16%): **clean_trend ×3, clean_range ×3,
full_agreement ×2.**

## Bucket definitions (label by structure, not gut)
- **chop** — no directional structure; tangled MAs; high Choppiness / low Efficiency.
- **weak_zone** — level with <2 clean touches or no reaction (one-touch / untested / stale).
- **broken_zone** — a key level decisively violated; or a failed breakout back inside.
- **mid_range_poor_location** — price in a gap / mid-range / above or below range (no level).
- **overextension** — price stretched from the 200-MA / range mid in ATR units (severe = >3 ATR).
- **contradiction_conflict** — lenses oppose (MA up vs LH/LL = contradiction; price under
  heavy resistance = conflict).
- **compression** — squeeze / narrow-range / low ADX with **no** directional resolution.
- **thin_data** — too few confirmed pivots or no MA-200 → Insufficient (no number).
- **clean_trend / clean_range / full_agreement** — positive controls; only these may earn
  Clear / High Clarity.

## Per case (in file order)
1. Open the bucket's suggested **symbol + timeframe**. The **scenario is the
   requirement** — markets move, so if the symbol no longer shows it, **substitute** a
   chart that does and update `symbol` + `as_of_date`.
2. Screenshot per name `RC1_<id>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png` → `screens/`.
3. Fill the human columns **before** scoring: `human_trend, human_location, human_zone,
   human_regime, human_extension, human_is_clear (Y/N), human_rc_call`.
4. Hand-apply the rubric (`rc1-scoring-rubric.md` + negative-first gates) → write
   `engine_state`, `engine_score`; set `result` (pass / fail / unclear) vs `expected_*`.
5. Operator-pick rows (RC1-09, 13, 46, 47): choose a real recent IPO / short-history /
   illiquid name and record it.

## Pre-declared metrics (record per run; see rc1-statistical-validation-plan.md)
- **False-High Rate** (bad chart → Clear/High) — target **0**.
- **Fatal False-High** (chop/broken/contradiction/severe-extension → High Clarity) — **0**.
- Band / State / Cap accuracy. **High-Clarity rarity** (expect ≤1–2 of 50 here).

## Pass bar for this set (Level 2)
≥ **46/50** pass · **zero** false-Clear on any reject bucket · **zero** fatal false-high ·
High Clarity on ≤1–2 cases. 0/≈41 reject cases bounds the false-high rate ≤ ~7% (rule of
three) — early confidence; tighten to ≤1% later at 300 (Level 3). If any reject bucket
leaks a high score, fix the **model**, not the test.
