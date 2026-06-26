# RangeClarity Module Registry (living)

> **Documentation only.** One row per module: boundary, risk, top leak, next approved task, blocked work.
> Update this table whenever a module boundary moves (step 4 of the
> [daily-design-loop](../ops/daily-design-loop.md)). Full detail is in each module doc under `modules/`.
> Vocabulary + audit: [rangeclarity-deep-modules](./rangeclarity-deep-modules.md).

## Registry

| Module | Owner files | Public interface (target) | Risk | Top leak | Next approved task | Blocked | Doc |
|---|---|---|---|---|---|---|---|
| **Core Scoring** | `research/rc1_ultimate_offline_indicator/negative_first_scorer.py`, `rc_scoring_facade.py`, 6 lens engines | `score_window_input(RcWindowInput) -> RcVerdict` | **HIGH** | leaky caller-heavy signature; data loader colocated | migrate `render_visual_review.py` to the facade; re-run golden test | caps/`agree3`/Broken changes (labels ≥20 + A/B) | [core-scoring](./modules/core-scoring.md) |
| **Data Adapters** | `data_loader.py` (×2), `fetch_tiingo.py`, `fetch_yfinance.py`, `check_data.py` | `loadCandles(symbol, source, range) -> NormalizedCandles` | **MEDIUM** | loader lives inside the scoring package; duplicated | (after Core API) extract `loadCandles` out | consolidate the 2 copies (HIGH) | [data-adapters](./modules/data-adapters.md) |
| **Research Experiments** | `full_real_review.py`, `optimizer.py`, `ablation.py`, `metrics.py`, `report.py`, `compare_baselines.py` | `runExperiment(config) -> ExperimentReport` | **MEDIUM** | calls scorer internals; 2 parallel packages | keep baseline reproducible; spec `runExperiment` | Broken-Zone A/B; package merge | [research-experiments](./modules/research-experiments.md) |
| **Founder Review** | `research/rc1_review_agent/*`, `research/reports/visual_review/*` | `loadFounderLabels()` · `compareAgentToFounder(labels)` | **MEDIUM** | agent imports engine internals | founder labels **15/40 → ≥20**, re-run agent | writing labels into priority CSV (by request) | [founder-review](./modules/founder-review.md) |
| **Web UI** | `app/**`, `lib/analytics.ts`, `lib/affiliate.ts`, CSS modules | `displayVerdict(verdict)` + marketing pages | **LOW–MED** | verdict wording re-authored (no shared schema) | none (web commits paused) | redesign do-not-touch; commits paused | [web-ui](./modules/web-ui.md) |
| **Pine Layer** | `RangeClarity_Core.pine`, `pine/**` | (consumer — renders, no API) | **HIGH** | risk of second source of truth | **NONE** (frozen) | all Pine changes (until GREEN) | [pine-layer](./modules/pine-layer.md) |
| **Ops / Feedback Loops** | `package.json`, `scripts/test/run-tests.mjs`, `scripts/*.mjs` | `npm run health` · `npm run verify` | **LOW** | health/verify once inverted (fixed) | document golden test in routine | none | [ops-feedback-loops](./modules/ops-feedback-loops.md) |
| **Payments / Access** | `lib/payments/**`, `app/beta/**`, `lib/beta*`, `supabase/migrations/` | `lib/payments/index.ts` provider selector | **MEDIUM** | (isolated — discipline: keep compliance line) | **NONE** (do-not-touch); founder confirms env links | payment/Lemon changes; Stripe live | [payments-access](./modules/payments-access.md) |
| **Product / Docs / PRD** | `CLAUDE.md`, `AGENTS.md`, `docs/**`, `.claude/commands/*` | the docs tree + 5 slash commands | **LOW** | overlapping/legacy docs at root + `docs/` | keep this system model current | none | [agent-map](../agents/agent-map.md) |

## Reading the registry
- **Risk** = blast radius if the module is wrong. HIGH = can manufacture **false confidence** or diverge a
  second source of truth (Core Scoring, Pine). MEDIUM = corrupts research/access but isolated. LOW = inspection/docs.
- **Top leak** = the one boundary problem to fix first (full list in the module doc).
- **Next approved task** = the *only* thing approved to do now; everything else needs a PRD + founder approval.
- **Blocked** = explicitly not allowed yet, and why.

## Update protocol
1. A change moved a boundary? Update that row's **public interface** / **top leak** here.
2. A leak was closed? Move it from "Top leak" to the module doc's history and update Risk if it dropped.
3. New blocked item? Add it to **Blocked** with the gating condition.
4. Keep this table and each `modules/*.md` in sync — the table is the index, the doc is the truth.
