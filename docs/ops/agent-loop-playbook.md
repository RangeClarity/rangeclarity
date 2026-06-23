# Agent Loop Playbook

How to run the four recurring loops (Daily Health, Indicator QA, Website/Mobile QA, Codex Critic). All are
human-run; none call APIs. Overview: `docs/ops/rc-ops-brain.md`.

---

## 1. Daily Health Loop
- **Cadence:** start of each working session.
- **Run:** `npm run health` (typecheck → lint → `qa:rc` → build). Then `npm run ops:status` for a read-only snapshot.
- **Reads/writes:** regenerates `docs/qa/live-qa-report.md`; prints pass/fail per step.
- **Safe-to-continue gate:** green = continue. Red = that red is today's first fix (before anything cosmetic).
  `ops:status` echoes the last recorded health + product-critical count so you get a one-glance verdict.
- **Founder decision:** none if green; if red, decide fix-now vs revert.

## 2. Indicator QA Loop
- **Cadence:** daily, and after any indicator or fixture change.
- **Run:** `npm run qa:rc`.
- **Reads/writes:** scans `data/qa/fixtures/*.jsonl` → writes `docs/qa/live-qa-report.md` + `data/qa/findings.jsonl`.
- **How to read:** the report splits **Product Findings** (the daily signal) from **QA self-test findings**
  (intentional `sentinel-*` negative controls — expected to fire; ignore for product decisions).
  Target: **0 product criticals**; triage warnings; self-tests firing means the scanner is alive.
- **Founder decision:** which product finding (if any) becomes the next issue. Pine edits stay approval-gated.

## 3. Website / Mobile QA Loop
- **Cadence:** on-demand, before shipping UI changes.
- **Run:** paste `prompts/website-mobile-qa.md` to Codex or Claude.
- **Scope:** homepage, `/beta`, `/beta/free-access`, mobile (390/430px), forms, and likely console/build issues.
- **Output shape:** structured findings — *severity · file · problem · suggested fix* — ending in **one safe fix batch** and "ask approval before editing."
- **Founder decision:** approve/trim the fix batch; visual approval after the fix.

## 4. Codex Critic Loop
- **Cadence:** daily when choosing what to do next; weekly for direction.
- **Run:** paste `prompts/codex-daily-critic.md` to Codex (read-only critic).
- **Output:** A project health · B top-5 blockers · C mobile/landing · D wording · E QA findings · F **what to fix first (one issue)** · G what not to touch.
- **Founder decision:** read **F**, pick exactly one issue, write it into `docs/ops/current-loop-status.md` → *Next Claude task*; heed **G**.

---

## Single-piece flow
WIP = 1. Don't start a second fix until the current one is health-green, visually approved, and logged in
`docs/kanban.md` + `docs/ops/current-loop-status.md`. Codex critiques · Claude fixes one · Dean approves.

## What needs founder approval (always)
Picking the one issue · approving UI fix batches · any Pine change · pricing/positioning · committing/pushing ·
adopting any new dependency, API, or the LangSmith layer.
