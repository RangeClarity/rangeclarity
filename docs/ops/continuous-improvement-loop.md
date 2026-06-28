# RC Continuous Improvement Loop

A repeatable daily loop that **audits → prioritizes → critiques → fixes one thing → approves → records**.
Its job is to stop the project drowning in loose issues (landing/mobile problems, long copy, wording
drift, QA findings, unfinished milestones) by forcing **single-piece flow**: one fix in flight at a time.

> **The three roles**
> - **Codex = critic.** Read-only. Audits state and ranks what matters. Never edits files.
> - **Claude = fixer.** Implements exactly **one** approved issue, smallest useful change. Never batches.
> - **Dean = approver.** Owns the visual/brand gate and every decision. Codex and Claude propose; Dean disposes.

## Hard guardrails (inherited from `CLAUDE.md` / `AGENTS.md`)
- **WIP = 1.** Never start a second fix before the current one is approved and recorded.
- **No whole-site redesign.** Improve what exists; do not re-architect pages or add homepages.
- **No Pine edits unless explicitly approved** (`pine/rangeclarity_sr_core_v1.pine`).
- **No new features.** The loop is for quality, not scope.
- **No commit, no push, no deploy, no Linear writes, no Stripe live** without Dean's explicit say-so.
- **No new risky dependencies.**
- Brand language is non-negotiable: *Simple Chart. Complex Engine. No Signals. No Noise. Just Structure.*
  Forbidden wording: buy/sell, entry/exit, wait, avoid chase, pullback zone, breakout watch, conviction,
  win-rate, profit, prediction, financial advice.

---

## The loop — 8 phases

Run phases 1–4 as the **audit** (gather), 5 as the **critique** (rank), 6 as the **fix** (one), 7–8 as
**approve + record**. One full pass = one day = one fix.

### 1. Daily Health Check
Mechanical green/red on the codebase.
- `git status --short` — know what's already dirty before changing anything.
- `npm run health` — `typecheck → lint → qa:rc → build`. Must be green before and after any fix.
- Owner: Dean (command) → Claude (interpret if red).

### 2. Website / Mobile QA
Human eyes on the live surface.
- `npm run dev`, open the homepage (`app/designs/rangeclarity-fox-brand-v1/page.tsx`) at a phone width (~390px) and desktop.
- Walk the beta path: `/beta/free-access` (`app/beta/free-access/`) and `/beta` (`app/beta/page.tsx`).
- Capture **the top 3 issues only** (not a backlog). Use `prompts/landing-page-qa.md` to keep the lens consistent.
- Owner: Dean.

### 3. Product Wording QA
Catch language drift before it ships.
- Scan visible copy against the brand sentence and the forbidden-word list (above) and `docs/RANGECLARITY_V2_SURFACE_SPEC.md`.
- Flag long/generic/hype copy and anything that reads like a signal or advice.
- Owner: Dean (with Codex in phase 5).

### 4. Indicator QA
The offline quality gate for indicator output.
- `npm run qa:rc` → reads `data/qa/fixtures/sample-events.jsonl`, writes `docs/qa/live-qa-report.md`.
- Review the report. **Pine itself is not edited here** unless Dean has approved a specific change.
- Owner: Dean → Claude (only if a Pine change is approved).

### 5. Codex Critique
Turn the audit into a ranked, opinionated list.
- Paste `prompts/codex-daily-critic.md`. Codex inspects state and returns A–G (health, top-5 blockers,
  mobile/landing, wording, QA findings, **what Claude should fix first**, **what not to touch**).
- Dean reads F, picks **one** issue, and writes it into `docs/ops/current-loop-status.md` → *Next Claude task*.
- Owner: Dean + Codex.

### 6. Claude Fix Pass
Exactly one fix.
- Paste `prompts/claude-fix-one-issue.md` with the one approved issue.
- Claude makes the smallest useful change, runs `npm run health`, reports files changed, and **stops** —
  it asks before touching anything else.
- Owner: Claude.

### 7. Founder Visual Approval
Nothing is "done" until Dean sees it.
- Dean re-runs `npm run dev`, looks at the change on mobile + desktop, checks brand/calm feel.
- **Approve** → go to phase 8. **Reject** → note why in the status file; Claude revises (still one issue).
- Owner: Dean.

### 8. RC-MAP / Kanban update
Close the loop on paper.
- Move the issue in `docs/kanban.md`; update `docs/ops/current-loop-status.md` (phase, last health, next tasks).
- If a decision was made, log it in `docs/decisions.md`. If it touches the roadmap, note it in `docs/rangeclarity-active-roadmap.md`.
- Commit/push is **Dean's manual call**, separate from the loop.
- Owner: Dean.

---

## One-screen summary

```
        ┌─────────────────────────────────────────────────────────────┐
        │  AUDIT            CRITIQUE        FIX            APPROVE+LOG  │
        │  1 Health     →   5 Codex    →   6 Claude   →   7 Dean visual │
        │  2 Web/Mobile     critique       one fix        8 Kanban/MAP  │
        │  3 Wording        (A–G)          (smallest)     update        │
        │  4 Indicator      pick ONE       run health                   │
        └─────────────────────────────────────────────────────────────┘
   Codex critiques · Claude fixes one · Dean approves · WIP = 1 · no auto commit/push
```

## Definition of done (one iteration)
- One issue fixed with the smallest useful change.
- `npm run health` green before and after (or red explained as a known environment limit).
- Dean visually approved it.
- `docs/kanban.md` + `docs/ops/current-loop-status.md` updated.
- Nothing committed/pushed unless Dean chose to.

## What this loop deliberately does **not** do
- It does not batch fixes, redesign pages, add features, or touch Pine on its own.
- It does not automate git. Humans decide when code ships.
