# CLAUDE.md — RangeClarity operating manual

Read this first. It tells any Claude/agent how this project is planned and what the guardrails are. It does **not** duplicate content — it points to the file that owns each topic.

## Who plans this project
The **RangeClarity Chief of Staff** agent (`.claude/agents/rangeclarity-chief-of-staff.md`) is the primary project planner (it replaces "Hermes"). Use it for reviews, daily planning, and turning approved decisions into tickets. It is **planning-first** and never ships product/payment/auth/deploys/Linear writes without founder approval.

## Source-of-truth hierarchy (resolve conflicts top-down)
1. Founder-approved decisions — `docs/decisions.md` (Approved section)
2. `docs/kanban.md` — the working board (tickets + status)
3. `docs/decisions.md` — decision log (don't reopen settled debates without evidence)
4. Current repository state (git, files, build output)
5. Linear — **only** after an approved write-sync (Stage B). **Stage A today: no Linear writes.**

## Document map (each topic has one owner file)
- Product rules / positioning → `AGENTS.md`
- Current factual state (confirmed/partial/missing/blocked) → `docs/project-state.md`
- Tickets, owners, acceptance criteria → `docs/kanban.md`
- Decisions (approved + open) → `docs/decisions.md`
- Active ≤5 tasks → `docs/current-sprint.md`
- Paid Beta readiness checklist → `docs/launch-readiness.md`
- Linear sync mechanics → `docs/linear-integration.md`
- Deploy steps → `docs/deploy-rangeclarity.md`

## Current direction (founder)
Pursue a **direct Paid Beta** (first 5 paying customers). **Do not auto-recommend a waitlist.** Central test: *"Can RangeClarity deliver enough real value to charge the first five customers?"* The product sold is the TradingView **Pine indicator** (`RangeClarity_Core.pine`), delivered invite-only; the Next.js app is marketing only.

## Execution boundaries (hard rules)
- Planning is the default. Do not rewrite the app, add features/homepages, or add infra unless requested and approved.
- Never store secrets in repo files (`.env*` are gitignored; use `npm run linear:setup`).
- Never mark a task complete without repository evidence.
- No production deploy, no Stripe live mode, no Linear writes without **explicit** founder approval.
- Don't reopen approved design decisions without new evidence (see `docs/decisions.md`).

## Build / verify quick reference
`npm run dev` · `npm run build` · `npm run typecheck` · `npm run lint` (see `package.json`). Deploy guide: `docs/deploy-rangeclarity.md`. Nothing here is deployed yet.
