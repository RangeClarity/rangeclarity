# RC-1 Rule Distillation Plan

> Converts patterns the Model Research Layer *discovers* into **simple, explainable,
> negative-first** logic: rejection gates, hard caps, penalties, agreement multipliers,
> state labels, and **Pine-compatible** (but not yet written) rules. Interpretability and
> a bounded false-high rate beat model accuracy. No Pine implemented here.

## What we distil into
| Target | Form | Example |
|---|---|---|
| **Rejection gate** | boolean → state | chop_regime high → Unclear |
| **Hard cap** | ceiling, `min()` | extended → score ≤60; severe ≤50 |
| **Penalty** | subtractive | one-touch zone −10 |
| **Agreement multiplier** | gate/scale | agreement <3 ⇒ hold ≤69; full ⇒ allow >85 |
| **State label** | band → word | ≥70 Clear · 45–69 Mixed · <45 Unclear · gate Insufficient |
| **Pine-compatible logic** | scalar, confirmed-bar | thresholds as constants; object-budget aware |

## Distillation workflow
1. **Discover** — shallow tree / monotonic logistic finds a threshold (e.g. "false-highs
   cluster when Choppiness > X and ADX < Y").
2. **Translate** — express as one negative-first rule (a gate/cap/penalty), not a model
   coefficient salad.
3. **Constrain** — enforce **monotonicity** (chop↑/extension↑ ⇒ clarity↓) and **whole-
   number** thresholds; reject any rule that could *raise* clarity for worse structure.
4. **Fidelity check** — distilled rule must match the model's reject decisions within
   tolerance (e.g. ≥99% of the model's caught false-highs still caught) **and be simpler**
   (fewer conditions). If a rule needs many clauses to match, it's overfit — drop it.
5. **Validate** — re-score, run the False-High Hunter, confirm false-high rate ↓ and
   clean-control recall unchanged.
6. **Review** — LLM panel (Codex risk / Claude feasibility / Gemini clarity / AntiGravity
   coherence) critiques; humans + metrics decide.

## Acceptance criteria for a distilled rule
- Reduces (or never raises) the false-high rate. · Maps to **one** RC lens/cap. · Monotone
  and whole-number. · Explainable to a user in <3 seconds. · Has a `labels-50` test case. ·
  Simpler than the model it came from. · Brand-safe wording (Unclear/Mixed/Clear/High
  Clarity/Insufficient — never buy/sell/target/setup).

## Pine-compatibility notes (for the *eventual* port — not written now)
Every distilled rule must be expressible as **scalar math on confirmed bars** (MAs, ATR,
percentrank, pivot arrays, `var` snapshots), reuse object pools (≤60/60/60 budget), no
`request.security` lookahead, no per-bar object creation. Rules that can't be expressed
this way are research-only and excluded from the RC-1 ship set.

## Output of the layer
A versioned **rule set** (`gates`, `caps`, `penalties`, `agreement`, `bands`) with, per
rule: source pattern, threshold + CI, fidelity vs model, test cases, and the false-high
delta it produced. This rule set — not the model — is what a future approved pass would
port to Pine.

## Anti-leakage
Thresholds discovered on research/validation sets only; **holdout never used to tune**;
the final rule set is evaluated on the holdout once for the honest false-high CI before
any promotion.
