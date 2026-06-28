# RC-1 Learning Agent — Architecture

> An **offline research agent** that learns and validates the most reliable RC-1
> scoring rules using data, labels, negative-first validation, and statistical
> conviction. **RC Score measures structural clarity, not trade probability.** No
> returns optimisation, no financial advice, **no Pine yet.** The agent's single
> objective: **minimise false-high scores** (bad/unclear charts receiving Clear/High).

## Design principles
- **Negative-first objective.** The loss the agent minimises is the **false-high rate**,
  not accuracy or any return. The False-High Hunter is the primary signal.
- **Interpretable-first.** ML is used only to *discover thresholds*; rules are then
  **distilled into simple, explainable, monotonic** logic. We never ship a black box.
- **Offline + leak-free.** Historical OHLCV (Alpaca, Daily/Weekly), confirmed bars only,
  no lookahead, holdout never tuned.
- **Structure, not trades.** Features are structural; forward "proxies" are validity
  checks, never signals; **volume is 0% of the score** (context only).

## Pipeline
```
Data Agent ─▶ Feature Engine ─▶ Rule Scorer ─▶ False-High Hunter ─▶ Conviction Engine
                    ▲                 ▲                 │                    │
              Labeling Agent ─────────┘        (incidents feed)        (metrics gate)
                    │                                   ▼                    ▼
                    └──────────── Model Research ─▶ Rule Distillation ─▶ LLM Review Panel
```

## The eight components (responsibilities + I/O)
**1. Data Agent** — loads OHLCV for S&P 500 + Russell 2000, Daily/Weekly first; confirmed
bars only; caches; no lookahead. *In:* symbol list, TF, date range. *Out:* `bars`
(symbol, tf, bar_time, o/h/l/c/v, is_confirmed).

**2. Feature Engine** — computes the eight structural features per confirmed bar (spec:
`rc1-feature-engine-spec.md`). *Out:* `features` row (8 features + raw sub-signals +
cap_flags).

**3. Labeling Agent** — manages `labels.csv`/`labels-50.csv`; expands 50→300 by
**actively selecting uncertain/high-risk cases** (model-confident-high or near band
edges) for human review; tracks `reviewer_confidence`; measures inter-rater agreement
(Cohen's κ). *Out:* labeled cases + agreement report.

**4. False-High Hunter** — the core. Scans scored data for bad charts that got Clear/High
and for cap violations (spec: `rc1-false-high-hunter.md`). *Out:* `incidents`
(symbol, tf, as_of, state, score, violated_rule, severity, evidence).

**5. Statistical Conviction Engine** — reports false-high rate + CIs (rule of three),
fatal rate, band/cap accuracy, calibration by band, High-Clarity rarity, segment
robustness (framework: `rc1-model-validation-framework.md`).

**6. Model Research Layer** — interpretable methods first (decision trees, logistic
regression, monotonic scoring, isotonic calibration, bootstrap CIs; GBM **only** as a
benchmark). Used to *discover* thresholds, never shipped raw.

**7. Rule Distillation Layer** — converts learned patterns into rejection gates, hard
caps, penalties, agreement multipliers, state labels, and Pine-*compatible* logic
(plan: `rc1-rule-distillation-plan.md`). Distilled rules must be **simpler than** the
model and behave within tolerance.

**8. LLM Review Panel** — LLMs as **reviewers, not truth**: Codex → QA/risk/consistency ·
Claude → implementation feasibility · Gemini → product clarity · AntiGravity → strategy
coherence. They critique; humans + the metrics decide.

## Train / Validation / Holdout
- **Research set** designs rules · **Validation set** tunes caps · **Holdout** (never
  touched until final) reports the honest false-high CI.
- Splits: **time** (older→design, newer→holdout), **symbol**, **sector**, **regime**.

## Anti-leakage (hard rules)
Confirmed bars only · no future bars in any feature/score · pivots delayed/confirmed ·
**never tune on the holdout** · forward proxies are evaluation-only · time-ordered splits
(no shuffling across the cut).

## Next 14-day implementation plan
- **D1–2 Data Agent** — Alpaca Daily loader for ~100 symbols; confirmed-bar handling; cache.
- **D3–5 Feature Engine** — the 8 features; unit-test each against `labels-50` expectations.
- **D6–7 Rule Scorer** — port the negative-first caps/gates (no learning yet); score `labels-50`.
- **D8 False-High Hunter** — the conflict + cap-violation detectors; run on the scored set.
- **D9–10 Conviction Engine** — metrics + rule-of-three bounds + the report; gate on `labels-50`.
- **D11–12 Scale + holdout** — expand toward ~300 via the Labeling Agent's selection; time/sector splits; segment metrics.
- **D13 Model Research** — decision tree / logistic to *discover* thresholds vs hand-rules (research only).
- **D14 Distillation + LLM panel** — draft distilled rules; run the review panel; write the conviction report.

## Smallest useful version (build first) — "Reject-Probe v0"
**Data Agent (minimal) + Feature Engine + rule-based negative-first Scorer + False-High
Hunter + Conviction report.** No ML, no labeling automation, no LLM panel. It scores
`labels-50` (and a few hundred extra charts) with the **current hand-rules** and answers
the only question that matters now: *do our rules ever give a bad chart a high score, and
what's the upper bound on that rate?* Everything else (Model Research, Distillation,
active labeling, LLM panel) is Phase 2 — you cannot *learn* better rules until you can
*measure* the false-high rate of the rules you already have. Reject-Probe v0 = days 1–10
of the plan.
