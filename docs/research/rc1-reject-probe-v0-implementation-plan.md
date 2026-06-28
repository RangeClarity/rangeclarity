# RC-1 Reject-Probe v0 — Implementation Plan (plan only)

> **Build plan, not code.** Implement only after `labels-50` is 50/50 labeled. Obeys
> `rc1-python-scorer-v0-contract.md` (negative-first min-gate; **min of permitted, never sum
> of present**) and `rc1-reject-probe-v0-spec.md`. **No live data, no ML, no Pine, no returns.**

## Module layout
```
rc1_reject_probe/
  schemas.py        # Features, Score, Incident, Convictions (dataclasses)
  features_human.py # adapter: labels-50 human_* states -> Features (v0 input; NO data fetch)
  rules.py          # negative-first scorer: gates -> caps(min) -> agreement -> band
  hunter.py         # false-high + fatal + cap-violation detectors -> Incidents
  conviction.py     # metrics: false-high rate, rule-of-three, Wilson CI, accuracy, Conviction Score
  report.py         # render report.md + report.json + per-case audit table
  cli.py            # python -m rc1_reject_probe.cli --labels <template.csv> --out report.md
tests/
  test_rules.py     # scorer vs expected_state/caps on labels-50
  test_hunter.py    # synthetic chop-high / weak-high / contradiction-high / number-on-insufficient
```
Stdlib + `csv` (optional `pandas`). **No network libraries.** Deterministic; no RNG.

## Inputs
- `labels-50-scoring-template.csv` (filled human_* + manual_* + bucket + case_id).
- `labels-50.csv` (expected_state / expected_band / expected_caps) — joined on `case_id`.
- `rc1-cap-thresholds-v0.md` thresholds (encoded as constants matching the locked doc).

## Outputs
- `report.md` + `report.json` (Convictions serialised, for run-over-run tracking).
- Per-case **audit table** (per the scorer contract §8): `final_state, allowed_band,
  triggered_gates, triggered_caps, weakest_lens, agreement_count, why_not_higher,
  false_high(Y/N), fatal(Y/N), state_match, cap_match`.

## Validations (run before scoring)
- 50/50 `human_review_done = Y`; abort if not.
- Enum hygiene: every human_*, gate, cap, state, band in the allowed set; abort on unknown.
- No missing required fields.
- Determinism check: same input ⇒ identical report.

## Exact report metrics
`false_high_rate` · `fatal_false_high_rate` (must be 0) · **rule-of-three upper-95 (3/n_reject)**
· **Wilson 95% CI** · `high_clarity_count` + rarity · `cap_accuracy` · `state_accuracy` ·
`band_accuracy` · per-bucket table · **Model Conviction Score** (`rc1-conviction-score-framework.md`)
· list of incidents (false-highs / fatals / cap-violations).

## Hard exclusions (build fails review if present)
No live-data fetch · no ML · no Pine · no returns · no additive confluence · no volume in
score · no signal wording · no future/live bars. (Mirrors the scorer contract §10 guardrails.)

## When to implement
**Only after** `labels-50` is 50/50 labeled and passes the checklist §C gate. Until then this
stays a plan. First implementation target: reproduce the manual `manual_state` from the
human reads (rule parity), then emit the false-high report + Conviction Score. v1 later swaps
`features_human` for an Alpaca feature engine (behind approval) — schemas/rules/hunter/report
reused unchanged.
