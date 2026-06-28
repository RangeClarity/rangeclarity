# RangeClarity — Master Action Plan (index)

A thin master index. It does **not** duplicate content — it points to the owner file for each topic, so
there is one source of truth. The `/ops` console and the Codex critic both read this as the "master plan".

## North star
Direct **Paid Beta**: deliver enough real value to charge the first five customers. The product sold is the
TradingView **Pine indicator** (`pine/rangeclarity_sr_core_v1.pine`), delivered invite-only; the Next.js app
is marketing + onboarding only. Brand: *Simple Chart. Complex Engine. No Signals. No Noise. Just Structure.*

## Where each thing lives (owner files)
| Topic | Owner file |
|---|---|
| Active roadmap / milestones | `docs/rangeclarity-active-roadmap.md` |
| Working board (tickets + status) | `docs/kanban.md` |
| Approved + open decisions | `docs/decisions.md` |
| Current factual state | `docs/project-state.md` |
| Active ≤5 tasks | `docs/current-sprint.md` |
| Paid-Beta readiness | `docs/launch-readiness.md` |
| Improvement loop (process) | `docs/ops/continuous-improvement-loop.md` |
| Where the loop is now | `docs/ops/current-loop-status.md` |
| Indicator QA signal | `docs/qa/live-qa-report.md` |
| Product surface / wording spec | `docs/RANGECLARITY_V2_SURFACE_SPEC.md` |
| Hidden engine spec | `docs/RANGECLARITY_V2_ENGINE_SPEC.md` |

## Operating rhythm
1. **Daily loop** (`docs/ops/daily-routine.md`): health → web/mobile QA → wording QA → indicator QA → Codex critique → one Claude fix → Dean visual approval → update board.
2. **One issue at a time** (WIP = 1). Codex critiques, Claude fixes, Dean approves.
3. **Gates:** `npm run health` green; `npm run qa:rc` clean (no product criticals); Dean's eyes on every visible change.

## Standing guardrails
No Pine edits unless approved · volume stays 0% of RC Score · no new features without a Feature Review ·
no auto agent execution · no auto commit/push · no broad redesign.

_Resolve conflicts top-down: approved decisions → kanban → decisions log → repo state._
