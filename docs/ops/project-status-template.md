# RangeClarity Project Status — Daily Template

> Copy the block below into your daily note (or the bottom of the [decision-log](./decision-log.md)).
> Documentation only. Keep it short and honest.

## Template
```
Date:
Today's lane:
Conviction:            (RED / YELLOW / GREEN)
Modules touched:
Files changed:
Tests run:
What improved:
What remains blocked:
Next action:
Do not touch:
Decision needed:
```

## Worked example (2026-06-25)
```
Date:               2026-06-25
Today's lane:       Core Scoring (facade migration)
Conviction:         RED
Modules touched:    Core Scoring (research/rc1_review_agent/build_founder_review.py)
Files changed:      build_founder_review.py (1 file)
Tests run:          golden smoke 93/93; golden full 1,767/1,767; equivalence 40/40 agent windows; py_compile; builder run (artifacts restored)
What improved:      2nd low-risk consumer migrated to score_window_input; -1 direct score_window caller
What remains blocked: Broken-Zone A/B (labels <20); Pine; payment/Lemon; broad scoring refactors
Next action:        Continue founder labels 15 -> 20+; then migrate full_real_review.py (chains prior, golden-test after)
Do not touch:       Pine, payment/Lemon, scoring caps/agree3/Broken-Zone semantics
Decision needed:    none today
```
