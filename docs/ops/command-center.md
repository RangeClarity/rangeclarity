# RangeClarity Command Center (`/command-center`)

Internal founder workbench: project state, memory, daily commands, agent prompts, QA, decisions, and
safety — on one screen. **Internal only** (`robots: noindex`); **do not deploy publicly** (no auth yet).
Linked from `/ops`.

## Open it
`npm run dev` → http://localhost:3000/command-center

**Production gate (required):** the internal pages — `/ops`, `/command-center`, `/linear-board` — require
`RC_INTERNAL_PAGES_ENABLED=true` and otherwise return **404**. They should not be enabled on public
production unless the routes are additionally protected. See `.env.example`.

**Local dev:** to view the internal ops pages locally, add `RC_INTERNAL_PAGES_ENABLED=true` to `.env.local`
(gitignored — never commit it) and run `npm run dev`. Do **not** set this flag in Vercel / production.

## What it reads (source of truth = files)
- `docs/ops/project-memory.md` · `docs/ops/current-loop-status.md` · `docs/ops/founder-decision-queue.md`
- `docs/qa/live-qa-report.md` · `data/qa/findings.jsonl`
- `prompts/*` (loaded for copy-paste)

## Interactive controls (local React state only — nothing persisted, nothing executed)
- **Phase selector** — Planning · Build · QA · Commit · Research · Founder Review → shows the recommended workflow for that mode.
- **Next-action selector** — Health · Ops Status · Indicator QA · Codex Critic · Claude Fix · Website QA · Deep Research · Git Cleanup · Update Lemon → shows the exact command/prompt, expected output, safety notes, and where to save the result.
- **Copy buttons** copy commands/prompts to the clipboard. The UI **never runs anything**.

## Read-only / deferred to V2
Read-only file display + clipboard copy only. No shell execution from the browser, no external APIs, no
LangSmith / OpenAI SDK, no Linear writes, no git mutations. Persisting the selected phase, auth gating, and
any live execution are **V2** (deferred).
