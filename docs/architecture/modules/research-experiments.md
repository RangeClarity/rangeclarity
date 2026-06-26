# Module: Research Experiments

> Living architecture doc — **documentation only**. No behavior/scoring/Pine/payment change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md).

## Purpose
Run offline experiments + A/B over a stable core, **always measured against the frozen baseline** — no
"looks better" without numbers.

## Public interface
- **Target:** `runExperiment(config) -> ExperimentReport`.
- **Current scripts:** `full_real_review.py` (the 1,767-window Real Baseline v1 harness) · `optimizer.py`
  (`sweep`/`simulate`) · `ablation.py` · `false_high_hunter.py` · `metrics.py` · `report.py` ·
  `run_indicator.py` · `run_research.py` · `compare_baselines.py` · `simulator.py` · `weak_labeler.py`.

## Hidden complexity
Per-symbol cache + parameter fingerprint (`_phash`); window stepping; the category taxonomy
(`clean_but_capped` / `suspicious_high` / `borderline` / `caps_saved` / `uncertain`); aggregates (state
distribution, cap-binding rates, weakest-lens); HTML review render; the parameter grid sweep; ablation deltas.

## Owns
Frozen baselines · A/B runs · metrics · comparison reports · `suspicious_high` checks.

## Must not own
Production UI · Pine code · payment/access.

## Subfunctions
`score_symbol` · `categorize` · `sweep` · `simulate` · `run_ablations` · `hunt` · `metrics` · `write_all`.

## Dependencies
Core Scoring (`score_window`) · Data Adapters (`load_universe`) · Founder Review (labels for A/B) · config.

## Dependent modules
Ops (reports feed decisions) · `docs/decisions.md`.

## Current leaks
1. Experiments call `score_window` **internals** directly (no `runExperiment` contract).
2. Two parallel packages (`rc1_ultimate_offline_indicator` canonical vs `rc1_autonomous_model` earlier).
3. Ad-hoc script entry points with no common config schema.

## Risk level
**MEDIUM.** A wrong experiment → a wrong scoring decision, but it is isolated from the live product.

## Tests required
Every run reports its **delta vs the frozen 1,767-window baseline**; reproduce the baseline numbers exactly
(the new golden test already pins the engine output); `suspicious_high` must not rise.

## Agent / skill to use
`/grill-me` (pressure-test the experiment) → `/write-a-prd` → `/prd-to-issues` · `/module-awareness Research Experiments`.

## Next approved task
Keep the frozen baseline reproducible (golden test green). Then **spec** the `runExperiment` facade
(candidate #4, LOW risk) — not yet approved.

## Blocked work
Broken-Zone A/B (blocked on labels) · consolidating the two research packages (**HIGH**, blocked until the
stable Core API exists).
