# RC-1 Statistical Iteration Engine

> Offline Python engine to run many parameter + validation iterations and prove whether
> the locked RC-1 v1 concepts truly create conviction — **while keeping the final ruleset
> explainable (<3 s) and Pine-compatible.** No Pine, no returns optimisation, no copied
> logic, no scraping, no push/Telegram/Linear.

## Throughline (read first)
**Conviction is data-bound, not iteration-bound.** Iterations explore the parameter space;
they do **not** manufacture evidence. The false-high confidence interval is set by the
number of human-confirmed bad charts (rule of three / Wilson), not by how many configs you
tried. So this engine is a **Phase 5–6** tool that runs *after* labels + the Python
prototype — it must **not** jump ahead of the current NOW (manually label `labels-50`).
More labeled data > more iterations. Iterations are capped to avoid overfitting a small
label set.

## 1. Purpose
The engine is **not** for predicting trades or returns. It tests whether RC-1 rules
**reduce false-highs** (bad/unclear charts getting Clear/High) and produce **stable
structural-clarity** scores, across resamples and segments — and which concepts are load-
bearing (ablation). It searches parameters, but the objective is honesty, not yield.

## 2. What to iterate (parameter ranges; v0 value in parens)
| Parameter | Range | v0 |
|---|---|---|
| Choppiness trigger | 50–70 | ~55–61.8 |
| Efficiency Ratio threshold | 0.20–0.40 | ~0.30 |
| ADX trend gate | 18–28 | ~20–25 |
| Chop cap ceiling | 40–50 | **44** |
| ATR Stretched / Extended / Severe | 1.5–2.5 / 2.5–3.5 / >3 ATR | 2 / 3 / >3 |
| Extension cap (moderate / severe) | 55–65 / 44–52 | 60 / 50 |
| Zone width × ATR | 0.5–1.5 | 1.0 |
| Zone freshness decay window | 150–350 bars (linear vs exp) | ~250 linear |
| Min touches for "strong" / reaction req / cooldown | 2–3 / on-off / 3–8 bars | 2 / on / 5 |
| Broken-zone: decisive-close beyond | 0.1–0.5 ATR | ~0.25 |
| Broken-zone cap | 44–55 | 50 |
| Location bands (Near within / Mid center width) | 1–2 ATR or 1–2% / 20–40% | 1.5% / 30% |
| Price-discovery cap | 55–65 | 60 |
| MA alignment strictness / slope flat band | 2-of-3 vs all-3 / 0–0.2 ATR | all-3 / 0.1 |
| Agreement minimum (agree3) / High-Clarity agreement | 3-of-3 / 5-of-6 vs 6-of-6 | 3-of-3 / 6-of-6 |
| Agreement cap ceiling | 65–72 | 69 |
| Hysteresis max Δ/bar / promotion persistence | 10–20 / 2–4 bars | 15 / 3 |
| High Clarity rarity cutoff / target rate | 82–88 / 1–5% | 85 / 1–5% |

## 3. Iteration types
- **Grid search** — coarse sweep of the table above (sanity + coverage).
- **Random search** — broad, cheap exploration of high-dim combos.
- **Bayesian / Optuna-style** — focus trials where the objective improves.
- **Bootstrap resampling** — CIs on every metric (false-high, accuracy) by resampling cases.
- **Walk-forward** — train on earlier bars, validate on later (time-honest).
- **Time-split / symbol-split / sector-split / volatility-regime split** — generalisation.
- **Ablation** — remove one concept, measure damage (§6).
- **Stress tests** — extreme vol, gaps, illiquid names, regime flips, earnings shocks.

## 4. Primary objective function (NOT returns)
```
objective = 0.40 * false_high_prevention      # (1 - false_high_rate), bootstrapped
          + 0.20 * fatal_fail_prevention      # robustness of fatal==0 across resamples/segments
          + 0.15 * cap_accuracy
          + 0.10 * state_band_accuracy
          + 0.10 * score_stability            # low hysteresis violations
          + 0.05 * simplicity_explainability  # fewer params/rules, Pine-feasible
```
**Hard gate:** any **fatal false-high disqualifies** the config (objective → 0), regardless
of the 20% term — the 20% only rewards how *robustly* fatal stays 0. High Clarity rarity
outside 1–5% is also disqualifying. Simplicity penalty fights overfitting and protects the
<3 s / Pine constraint.

## 5. Reference-conviction link (how testing moves conviction)
For each adopted concept, conviction **rises only if** ablation worsens the system **and**
the flagged condition demonstrably explains real bad-high cases:
- **Chop:** rises if high chop consistently precedes false-high risk and the cap removes it.
- **ATR extension:** rises if severe extension repeatedly yields unstable/unclear structure
  and the cap prevents inflated scores.
- **Zone quality:** rises if weak/broken/stale zones repeatedly explain bad high-score cases.
- **Location:** rises if mid-range / no-man's-land cases are less reliable and capping
  improves honesty.
- **Agreement gate:** rises if multi-lens agreement produces cleaner audited highs than
  single-lens strength.
- **Hysteresis:** rises if smoothing cuts score jumps **without** hiding real regime changes.

## 6. Ablation framework
**Baseline (full):** negative-first + zone + location + chop + extension + trend +
agreement + hysteresis. Remove one at a time:
| Ablation | Measure | Concept earns conviction if removal… |
|---|---|---|
| − chop cap | false-high ↑, HC inflation, instability | …raises false-highs / inflates HC |
| − extension cap | false-high ↑, fatal ↑ | …lets extended charts read clear |
| − zone quality | false-high ↑, lost true-clears | …breaks weak/broken detection |
| − location context | false-high ↑ | …lets no-man's-land read clear |
| − agreement gate | HC inflation, false-high ↑ | …lets single lens manufacture highs |
| − hysteresis | instability ↑, jump fatals | …reintroduces score jumps |
| − trend quality | false-high ↑ / lost clears | …degrades trend-decided gate |
Track: false-high increase, fatal increase, HC inflation, score instability, **lost
true-clear cases**. **A concept is kept only if removing it makes the system measurably
worse.** If removal changes nothing → cut it (simplicity).

## 7. Holdout methodology
- **Research set** designs rules · **Validation set** tunes parameters (where all the
  iteration runs) · **Holdout** is untouched until the end and **run exactly once.**
- **No tuning on the holdout.** Confirmed bars only · no future leakage · pivots
  delayed/confirmed · forward proxies are evaluation-only · time-ordered splits.
- The search space + simplicity penalty are sized to the label count so the holdout stays
  honest (don't fit 30 free params to 100 labels).

## 8. Statistical outputs (per candidate ruleset)
`false_high_rate` · `fatal_false_high_rate` · **rule-of-three upper bound (3/n)** ·
**Wilson 95% CI** · `high_clarity_rarity` · `cap_accuracy` · `band_accuracy` ·
`state_accuracy` · `score_stability` · per-bucket · per-sector · per-timeframe ·
**ablation deltas** · `simplicity_score` · **final Model Conviction Score**
(`rc1-conviction-score-framework.md`). Emit md + json per run for trend tracking.

## 9. Model-selection rules (advance only if all hold)
0 fatal false-highs · false-high CI acceptable (≤~1% upper bound for beta) · High Clarity
rare (1–5%) · **no single segment fails** · ablation supports each core concept · rules
explainable in <3 s · Pine implementation feasible (scalar, confirmed-bar, object-budget).
A higher-objective config that violates any of these **loses** to a simpler one that holds.

## 10. Computational plan (phases — iterations scale WITH data)
| Phase | Data | Iteration budget | Note |
|---|---|---|---|
| 1 | **labels-50 manual** | 0 (hand) | current NOW; Reject-Probe v0 |
| 2 | labels-100 | 0–small | manual + v0 |
| 3 | Python prototype (Alpaca, approval) | ~10²–10³ smoke | parity with manual rules |
| 4 | 300 labeled | **~10³–10⁴** grid/random/Optuna + bootstrap + full ablation | beta-grade search |
| 5 | 10k–100k chart-window batch | ~10⁴ | distribution, calibration, segments |
| 6 | **1M+ param/window iterations** | ~10⁵–10⁶ | premium only; needs the big labeled/semi-labeled set |
| 7 | final holdout | **1 run** | honest CI |
| 8 | distil to Pine rules | — | only the stable, simple, validated ruleset |
Iterations at Phases 1–3 are tiny by design; the big searches (4–6) require the data to
justify them.

## 11. What LLMs should / should not do
**Should:** review failure cases, explain *why* a ruleset failed, detect overfitting risk
(too many params vs labels, suspiciously perfect segments), audit language/product clarity,
propose **simpler** rules. **Should not:** be treated as statistical evidence · replace
human labels · tune thresholds by opinion · approve a model without **measured** false-high
results. LLMs critique; data decides.

## 12. Final recommendation (decisive)
- **Iterations useful before beta:** **~1,000–10,000** configs (grid → random → Optuna)
  evaluated on labels-100→300 with bootstrap CIs + the full ablation set. Enough to find a
  **stable, simple** ruleset and prove every concept earns its place.
- **Overkill before beta:** **100k–1M+** iterations. With only 50–300 labels they overfit;
  the false-high bound is data-bound (≤1% needs ~300 clean reject cases regardless of
  iteration count). Save 1M+ for Phase 6 after ≥10k–100k labeled/semi-labeled windows exist.
- **Minimum evidence for controlled beta (Green):** **300 labeled · 0 fatal · false-high
  ≤~1% (Wilson/rule-of-three upper) · HC 1–5% · no segment fails · ablation supports the
  core caps · <3 s explainable · Pine-feasible.** (Controlled **alpha** = 100 labeled, 0
  fatal, ≤~3%.)
- **Evidence for premium launch (Blue):** **10k–100k → 1M** window iterations across S&P 500
  + Russell 2000, multi-year, all splits + stress + walk-forward clean · ≤~0.3% bound ·
  calibration curves · **final holdout passed once.**

**Bottom line:** don't out-iterate your data. The next real conviction comes from labeling
`labels-50`, then 100, then 300 — the engine's big runs are Phase 4+ and exist to *test*
the locked spine, never to discover yield.

## Appendix — Data-before-iteration (why not now)
**Why massive iteration on thin ground truth overfits instead of building conviction:**
1. **Search ≠ evidence.** Picking the best of N configs on a small label set is a multiple-
   comparisons search; the winner's measured false-high rate is optimistically biased
   (winner's curse) and regresses to a worse number out-of-sample.
2. **The CI is data-bound.** Rule of three: 0 false-highs in *n* reject cases → ≤3/n at
   95%. 41 reject cases ⇒ ≤~7% no matter how many configs you run; ≤1% needs ~300. No
   iteration count tightens a CI computed on few cases.
3. **Degrees of freedom.** ~20 tunable thresholds fit to 50–100 labels can memorise them;
   you want ≥~10–15 independent cases per free parameter and >~20 per reject bucket.
4. **No real holdout.** Tiny data can't spare an informative untouched holdout, so results
   stay in-sample (circular).

**Minimum dataset before large-scale iteration is statistically meaningful:**
**≈300 human-confirmed cases (~250 reject, ~20–30 per reject bucket) with a pre-split,
untouched holdout.** 100 supports only a *coarse* search + ablation direction; <100 is
manual / Reject-Probe sanity only.

**Per-stage: what's learnable vs statistically invalid to claim**
| Stage | n (reject) | Can learn | Invalid to claim |
|---|---|---|---|
| A. labels-50 | 50 (~41, ~5/bucket) | logic bugs; 0-fatal smoke test; does each cap fire; eye calibration | any false-high *rate*/CI (0/41=≤~7%); "works"; rarity; segment robustness; any tuned threshold "validated" |
| B. labels-100 | 100 (~80, ~8–10) | first wide-CI rate (≤~3.7%); ablation *direction*; coarse sensitivity | ≤1%; per-segment robustness; a "best" config as final; beta-ready; calibration curves |
| C. labels-300 | 300 (~250, ~20–30) | **beta-grade CI (≤~1.2%); full ablation; stable param ranges; first honest holdout** — large-scale iteration (1k–10k configs) becomes meaningful here | ≤0.3%; S&P-vs-Russell/multi-year robustness; premium; auto-labels as truth |
| D. Python prototype | parity set | parity ≥95% → trust automation; auto-score 10k+ for distribution; feature accuracy; band calibration | a false-high rate from **auto-labels alone** (circular); conviction without human-audited highs + a human reject set; "parity = correct" |
| E. S&P/Russell batch | 10k–1M windows | full distribution; HC rarity at scale; **segment robustness; calibration; stress; premium bound (≤~0.3%)** with human-audited highs + large human reject sample | any trade/return/prediction claim (permanent); a rate resting only on auto-labels; cherry-picked segments (worst segment governs) |
