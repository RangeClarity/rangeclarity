---
name: rangeclarity-neural-map-maintainer
description: >
  Maintain the RangeClarity Neural Map (a.k.a. System Brain / project brain) — the internal-ops
  dashboard view that maps modules, key files/functions, consumers, tests/gates, status, blocked
  areas, and the next safe action. Use whenever work mentions the Neural Map, System Brain,
  Internal Ops, module graph, command center, ops dashboard, module status, or project brain. Keeps
  docs/architecture/rangeclarity-neural-map.json and app/ops/neural-map/** in sync as a
  read-only / dashboard-only view, gated by RC_INTERNAL_PAGES_ENABLED, without touching
  scoring / caps / agree3 / Broken-Zone, Pine, payments, or production behavior.
---

# RangeClarity Neural Map Maintainer

Documentation / dashboard only. The Neural Map is a **read-only** view — never turn it into a control panel.

## 1. First read (source of truth)
- docs/ops/rangeclarity-command-center.md
- docs/architecture/module-status-board.md
- docs/architecture/system-map.md
- docs/ops/decision-log.md
- docs/ops/daily-workflow.md
- docs/architecture/rangeclarity-neural-map.json

## 2. Existing architecture (do not re-litigate)
- The Neural Map lives **inside the existing gated ops area** — do **not** create a separate dashboard.
- The UI lives under `app/ops/neural-map/**`.
- The source of truth is `docs/architecture/rangeclarity-neural-map.json`.
- The ops pattern is gated: `if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();`.
- Views are **read-only / copy-only** unless a change is explicitly approved.

## 3. Allowed edits
- `docs/architecture/rangeclarity-neural-map.json`
- `app/ops/neural-map/**`
- `lib/ops/opsData.ts` — **only** for read-only data helpers / types
- small navigation links from `app/ops` or `app/command-center` when needed

## 4. Forbidden unless explicitly approved
- scoring behavior
- caps / agree3 / Broken-Zone logic
- Pine files
- payment / Lemon files
- production behavior
- package changes (package.json / dependencies)
- Linear sync (none in v1)

## 5. Required checks (after edits)
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- if available: `npm run health`

## 6. Output contract (end every run with)
- files touched
- whether it was docs / dashboard only
- whether internal gating remains intact (RC_INTERNAL_PAGES_ENABLED → notFound)
- whether scoring / Pine / payments were untouched
- tests run (and results)
- remaining blockers

Do not stage, commit, or push.
