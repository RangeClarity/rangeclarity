# RC-1 False-High Hunter

> The core of the negative-first agent. Its job is to **find every bad/unclear chart that
> received Clear or High Clarity**, and every High that violated a cap. Minimising its
> output **is** the product goal. No Pine, no returns.

## Why it leads
A false-high is the one failure that destroys trust in a clarity product. The Hunter makes
that failure **countable** and **auditable**, turning "is RC-1 safe?" into a number with a
confidence interval.

## Inputs
- `features` + `rc_score` + `rc_state` + `caps_applied` (from the scorer).
- Ground truth: `labels-50.csv` / `labels.csv` bucket + `human_is_clear`, plus (at scale)
  a **human audit of every Clear/High** ("does this look clean? Y/N").

## Detectors (each emits an incident)
| Detector | Condition | Severity |
|---|---|---|
| **chop × high** | state ∈ {Clear, HighClarity} AND chop_regime high (chop flag) | **Fatal** |
| **weak/broken-zone × high** | Clear/High AND zone ∈ {Weak, one-touch, Broken, Insufficient} | **Fatal** |
| **extension × high** | Clear/High AND atr_extension = Extended (esp. severe) | **Fatal** |
| **contradiction × high** | Clear/High AND structure Contradictory | **Fatal** |
| **number-on-insufficient** | a number shown AND data Insufficient | **Fatal** |
| **cap-violation** | rc_score > a triggered cap's ceiling | **Fatal** (logic bug) |
| **score-jump** | |Δscore| > 15 vs prior confirmed bar, no structural event | High |
| **rarity-breach** | High Clarity share > ~5% over a segment | High |
| **human-disagree** | model Clear/High but human audit says bad/unclear | Fatal |

"Fatal" = the model did the one thing it must never do; any fatal blocks promotion.

## Incident record (output schema)
```
incident_id, symbol, tf, as_of_bar, rc_state, rc_score,
detector, severity (fatal|high|warn), violated_rule,
evidence { chop_regime, zone_state, atr_extension, agreement_score, caps_applied,
           prior_score, segment }, label_bucket, human_is_clear, reviewer
```

## Outputs the Hunter produces
- **False-High count + rate** (per bucket, per segment) → feeds the Conviction Engine's
  rule-of-three bound.
- **Fatal list** (must be empty to advance).
- **Audit queue** — every Clear/High for human sign-off (cheap because High is rare).
- **Failure-pattern clusters** — common evidence patterns behind incidents → feed Rule
  Distillation (e.g. "highs leak when zone one-touch + strong trend" ⇒ tighten weak-zone
  cap / strengthen agreement gate).

## How it closes the loop
Hunter incidents → Distillation proposes a tighter gate/cap/penalty → re-score → Hunter
re-runs → Conviction Engine confirms the false-high rate dropped **without** crushing the
positive controls (clean charts must still be allowed Clear). The metric to watch is
**false-high rate ↓ toward 0 while clean-control recall stays high.**

## Anti-leakage
Operates only on confirmed-bar scores; audit uses the chart **as of** the labeled bar (no
hindsight beyond the bar); never tunes thresholds on the holdout — Hunter runs on the
holdout **once**, at final evaluation, to report the honest number.
