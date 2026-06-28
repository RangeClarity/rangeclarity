# RC-1 Model Validation Framework

> The Statistical Conviction Engine (component 5) + Model Research Layer (component 6).
> Consolidates `rc1-statistical-validation-plan.md` into the agent. Goal: bound the
> **false-high rate** with confidence intervals; use **interpretable methods first**; ML
> only to discover thresholds. No returns, no advice, no Pine.

## Primary metrics (pre-declared)
- **False-High Rate** = P(bad chart → Clear/High). *Target 0; bound by rule of three.*
- **Fatal False-High Rate** = P(chop/broken/contradiction/severe-extension → High). *= 0.*
- **Band / State / Cap accuracy** vs `expected_*`.
- **Calibration by band** — among "Clear" reads, what share survive human audit?
  (isotonic-calibrated reliability curve).
- **High-Clarity rarity** — share at >85 (target ~1–5%).
- **Segment robustness** — every metric re-reported per segment (index, cap size, vol,
  regime, TF, year, sector); **no segment may hide a false-high cluster.**

Secondary: score stability, hysteresis violations, agreement consistency, score
distribution by scenario.

## Confidence intervals
- **Rule of three** (0 failures): 95% upper bound ≈ 3/n, 99% ≈ 4.6/n. 0/300 ⇒ ≤~1%;
  0/600 ⇒ ≤~0.5%.
- **Proportion CI** (when failures occur): Wilson interval (not normal-approx) for small p.
- **Bootstrap CIs** for derived metrics (calibration error, per-segment rates).

## Sample-size targets
50 (early, ≤~7% bound) → 300 (≤~1%) → 1,000 (≤~0.3%) → batch. Per bucket: 20 early / 50
stronger / 100 robust. Oversample rare buckets (broken/compression/contradiction).

## Model Research Layer — interpretable-first ladder
Use ML to **find thresholds**, then distil (next doc). Never ship raw ML.
1. **Decision trees (shallow, depth ≤4)** — discover the cap thresholds and interaction
   rules that separate bad-from-clean; read the splits directly.
2. **Logistic regression (monotonic, regularised)** — which features predict a *false-high*;
   sign-constrained so "more chop ⇒ never higher clarity."
3. **Monotonic scoring** — enforce monotonic constraints (chop↑ ⇒ score↓, extension↑ ⇒
   score↓) so the learned mapping can't invert the negative-first logic.
4. **Isotonic calibration** — map raw scores to honest band probabilities (rare highs).
5. **Bootstrap** — CIs on every threshold and metric.
6. **Gradient boosting — benchmark only.** If a GBM beats the distilled rules on
   false-high rate, that's a *flag to study*, not a thing to ship. Interpretability and a
   bounded false-high rate win over a marginally better black box.

**Objective for all models:** minimise false-high rate subject to keeping clean-control
recall high — not maximise overall accuracy.

## Train / Validation / Holdout (+ anti-leakage)
- Research → design; Validation → tune caps; **Holdout → untouched** until final, runs
  once for the honest CI.
- Splits: time (older design / newer holdout), symbol, sector, regime — **time-ordered, no
  shuffling across the cut.**
- Leakage hard-stops: confirmed bars only · no future bars in features/score · pivots
  delayed/confirmed · forward proxies evaluation-only · no tuning on holdout.

## Structural proxies (validity, NOT signals)
Post-hoc only: forward trend efficiency, lower forward chop, structure persistence, fewer
forward cap violations, volatility-normalised cleanliness. They check that **high clarity
behaves differently from unclear** — never predict price, never feed the score.

## Promotion gates
→ **Python prototype**: 20-case pass + zero fatal false-highs + gates accepted.
→ **Pine**: 100+ pass + low false-high rate + High Clarity rare + caps consistent across buckets.
→ **Beta**: 300 pass + 0 fatal + false-high CI ≤~1% + healthy batch distribution + no segment failure.
