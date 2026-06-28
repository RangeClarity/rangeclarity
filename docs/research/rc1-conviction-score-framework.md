# RC-1 Conviction Score Framework (internal)

> **Internal** 0–100 confidence that the RC-1 scoring system is beta-ready. **Not** the
> user-facing RC Score, and **not** the Reference Conviction Score. It gates the
> beta-readiness rubric (`rc1-beta-readiness-plan.md` §6). Driven by the false-high rate,
> not by accuracy or returns. No Pine, no live data.

## Governing rule
```
Model Conviction = false-high performance + data validation + robustness + holdout cleanliness
Fatal false-highs are a GATE, not a deduction.
```

## Components (0–100)
| # | Component | Max | How it scores |
|---|---|---|---|
| 1 | **False-high performance** | 25 | 0 observed FH → scaled by the rule-of-three bound: ≤1% =25 · ≤2% =20 · ≤4% =15 · ≤7% =10 · unknown =0. **Any observed FH → 0.** |
| 2 | **Fatal false-high** | 15 | 0 fatal AND ≥100 cases =15; 0 fatal but <100 =8; **any fatal → see GATE.** |
| 3 | **Cap accuracy** | 10 | ≥95% =10 · ≥90% =7 · ≥80% =4 · else 0 |
| 4 | **State/band agreement** | 10 | state ≥90% =10 · ≥85% =7 · ≥75% =4 · else 0 |
| 5 | **High Clarity rarity** | 10 | within 1–5% =10 · 5–8% =6 · 0% or >10% =0 (0% is suspicious too) |
| 6 | **Segment robustness** | 10 | ≥4 clean segments =10 · 2–3 =6 · 1 =3 · none =0 |
| 7 | **Label coverage** | 10 | ≥300 stratified, ≥20/reject bucket =10 · 100–299 =6 · 50–99 =3 · <50 =0 |
| 8 | **Holdout cleanliness** | 5 | holdout exists + evaluated once =5 · tuned-on-test or none =0 |
| 9 | **Reviewer confidence** | 5 | avg ≥4/5 AND inter-rater κ≥0.6 =5 · partial =2 · none =0 |

**GATE — fatal false-high:** if **any** fatal false-high exists (High Clarity on
chop/broken/contradiction/severe-extension, or a number on Insufficient), **Model
Conviction is capped at 20** regardless of the component sum. A beta cannot ship over a
fatal.

## Conviction → readiness level
| Conviction | Level |
|---|---|
| < 40 | **Red** (research only) |
| 40–59 | **Orange** (prototype) |
| 60–74 | **Yellow** (controlled alpha) |
| 75–89 | **Green** (beta-ready) |
| ≥ 90 | **Blue** (premium-ready) |
*(The fatal GATE overrides: any fatal ⇒ ≤20 ⇒ Red.)*

## Where we are now (honest estimate)
With **0/50 labeled**, almost every component is unproven:
- FH performance 0 (no data) · Fatal 0 (untested) · Cap acc 0 · State/band 0 · Rarity 0 ·
  Segments 0 · Label coverage 0 (<50 labeled) · Holdout 0 · Reviewer 0.
- **Current Model Conviction ≈ 0–5 → Red.** The *design* is Orange-capable, but on
  **evidence** we are Red until labels exist. This is the whole point of the negative-first
  program: no conviction is claimed without measured false-highs.

## Projected trajectory (if each step passes clean)
| After step | Likely components earned | Conviction (est.) | Level |
|---|---|---|---|
| **A+B** labels-50 + v0 (0/41 FH) | FH 10 (≤7%) · Fatal 8 · Cap ~7 · State ~7 · Rarity 10 · Cov 3 · Rev 2 | **~47** | Orange |
| **D+F** 100 labeled + audit (0/~80) | FH 15 (≤4%) · Fatal 15 · Cap 10 · State 10 · Rarity 10 · Cov 6 · Rev 5 | **~71** | Yellow |
| **G** 300 + segments + holdout (0/~250) | FH 25 (≤1%) · Fatal 15 · Cap 10 · State 10 · Rarity 10 · Seg 10 · Cov 10 · Hold 5 · Rev 5 | **~90+** | Green→Blue |
*(Pine parity (H) is a ship gate inside Green; it doesn't add points but is required to
ship a Pine beta.)*

## How to use it
Reject-Probe v0 emits the components it can measure each run; the Conviction Score is
recomputed and stamped on every conviction report. It is the single number that answers
"are we allowed to call RC-1 beta-ready yet?" — and it cannot be talked up, only **earned**
with labeled data and a clean false-high record.
