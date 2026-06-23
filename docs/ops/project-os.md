# RangeClarity Project OS — architecture & phased plan

The "Project OS" is the internal operating layer on top of the Command Center (`/command-center`) and Ops
console (`/ops`). This doc turns the 10-component vision into a grounded, safety-classified, phased build.
It is a **plan**, not a build order to run all at once.

> Principle (unchanged): automate **visibility, routine, handoff — not judgment**. Read-only first.
> No UI shell execution, no git mutation, no Linear writes, no external APIs without an explicit,
> guardrailed founder decision. WIP = 1: build one slice, verify, approve, then the next.

## Where each component stands

| # | Component | Status | Safety | Built on / lands in |
|---|-----------|--------|--------|---------------------|
| 1 | Project State Machine | **partial** | 🟢 green | Phase selector (command-center) + `docs/ops/current-loop-status.md`; add milestone/batch/owner/allowed-blocked fields |
| 2 | Daily Run Ledger | new | 🟡 amber | local script appends `data/ops/run-ledger.jsonl`; UI displays read-only |
| 3 | Evidence Engine | new | 🟡 amber | local `npm run` script reads git/QA/build → writes an evidence artifact; UI displays |
| 4 | Priority Scoring | new | 🟢 green | rubric doc + scored tasks file (read-only display) |
| 5 | Agent Run Manager | new | 🟢 green | read-only table over `data/ops/agent-runs.jsonl` (schema already in `langsmith-future-plan.md`) |
| 6 | QA → Task Converter | new | 🟢 green | reads `data/qa/findings.jsonl` → draft tasks (title/severity/files/acceptance/owner) |
| 7 | Git Commit Planner | **partial** | 🟡 amber | done manually last commit pass; script it: read git, classify, output plan (no staging) |
| 8 | Decision Queue + statuses | **partial** | 🟢 green | `docs/ops/founder-decision-queue.md` → add Pending/Approved/Rejected/Needs-Research/Implemented + chips |
| 9 | Product Core Roadmap | **partial** | 🟢 green | `rangeclarity-active-roadmap.md` + `RANGECLARITY_V2_*_SPEC.md` → read-only progress panel |
| 10 | Autonomy Layer | **deferred** | 🔴 decision | execution buttons + Linear drafts — see "Decision required" |

## Safety classes
- 🟢 **Green — build now (read-only, file-based):** 1, 4, 5, 6, 8, 9. No execution, no writes beyond local docs/data the founder edits.
- 🟡 **Amber — local read-only scripts:** 2, 3, 7. Implemented as `npm run …` helpers that read git/QA and write a docs/data artifact; the **UI only displays** the artifact. Still no UI execution.
- 🔴 **Red — decision-gated:** 10. Browser-triggered execution and Linear writes conflict with the standing rules; do not build without the explicit decision + guardrails below.

## Phased plan
- **Phase 0 — done:** Command Center V1, `/ops`, `ops:status`, Live QA engine + report, decision queue, roadmap/V2 specs, prompts, `rc_agent_run` schema. Indicator: Location Kernel v1 implemented (awaiting visual approval) — Zone Quality gated behind that.
- **Phase 1 — green slices (next):** QA→Task Converter · Priority Scoring · Product Core Roadmap panel · Decision-Queue statuses · State-Machine fields. All read-only, no new deps.
- **Phase 2 — amber scripts:** Evidence Engine · Git Commit Planner · Run Ledger as `npm run` helpers; UI surfaces their output. No UI execution, no git mutation.
- **Phase 3 — red, decision-gated:** Autonomy Layer. Only if approved, and only as: **local-only**, behind `RC_OPS_ENABLE_COMMANDS=true` (off by default), a fixed **whitelist** (`health`, `qa:rc`, `ops:status`, commit-*plan*), with a visible audit log, and **never** `push`/`reset`/`delete`/Linear-write. Linear drafts wait for auth/gating (open decision in the founder queue).

## Decision required (founder)
1. **UI execution at all?** The Autonomy Layer's "Run health / Run QA" buttons mean the browser triggers server-side shell — a real security surface. Recommended: stay **copy-only + local scripts** for now (Phases 1–2); revisit execution only with the Phase-3 guardrails.
2. **Linear drafts** — remain deferred until auth/gating exists (already an item in `founder-decision-queue.md`). "Generate Linear draft issues" stays off.
3. **Persistence** — use **file-based** `jsonl`/`markdown` (recommended, fits the read-only model) rather than a database (deferred).

## What this OS will NOT do (standing guardrails)
No Pine edits during ops work · no public-website redesign · no payment/Lemon behavior changes · no external
APIs · no LangSmith/OpenAI SDK · no Linear writes · no git mutations or dangerous automation from the UI.
