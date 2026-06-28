# RC Ops Console (`/ops`) — how to use it

An internal, **read-only** operating dashboard at `app/ops/page.tsx`. It puts the project routine, agent
prompts, shell commands, QA/status outputs, the workflow map, and the decision queue in one place.

> Core principle: **automate visibility, routine, and handoff — not judgment.** The console shows you what
> to do and hands you the exact prompt/command. **You** run the command and **you** paste the prompt. It
> never runs Codex/Claude and never executes shell commands.

## Open it
```bash
npm run dev
# then visit http://localhost:3000/ops
```
It is `robots: noindex` and intended for local use. It reads repo files at request time, so it always
reflects the current `docs/` + `data/` state when you run `dev`. If a file isn't generated yet, the card
shows a clean "not generated yet" state instead of breaking.

## What it shows (sections)
- **A. Today / Project Status** — current phase, last health, QA criticals/warnings, top issue, next action (parsed from `current-loop-status.md` + `live-qa-report.md`).
- **B. Agent Control** — one card per prompt: purpose, when to use, file path, copy-prompt button, next-action hint.
- **C. Shell Command Center** — copyable commands. **Copy only — nothing executes.**
- **D. Output Feed** — status/QA/kanban/plan/staged-prompt files with path + copy-path + status.
- **E. Workflow Map** — the loop, left to right.
- **F. Decision Queue** — the recurring decisions only you can make.
- **G. Do Not Touch Now** — the standing guardrails.

## What stays manual (by design)
- Running `npm run health` / `qa:rc` / `build` / `dev` — you run them in your terminal.
- Sending prompts to Codex/Claude — you copy from a card and paste into the tool.
- Approving fixes, picking the one issue, committing/pushing — always you.

## Why V1 does not execute agents or commands
Safety and trust. Auto-running agents or shell from a browser button means a single click could change
code, spend tokens, or mutate git. V1 keeps a human between intent and action. The console's job is to make
the *right* next action obvious and one copy away — not to take it for you.

## V2 ideas (not built — documented only)
A future "run" capability, if ever added, must be:
- **whitelist-only** (a fixed set like `health`, `qa:rc`, `git status --short` — never `git add/commit/push/reset`),
- **local-only** (refuse unless host is localhost),
- **env-guarded** behind `RC_OPS_ENABLE_COMMANDS=true` (off by default),
- read-only by default, with explicit per-command opt-in and visible audit logging.
Until all of that exists, the console stays copy-only.
