# RC Ops Brain

A lightweight foundation for **agent observability and recurring improvement/research loops**. It is the
index for *what loops exist, when to run them, what they read, and who decides*. It builds on the
improvement loop (`docs/ops/continuous-improvement-loop.md`) and the `/ops` console.

> Principle (unchanged): **automate visibility, routine, and handoff — not judgment.** Today every loop is
> *human-run* (you paste a prompt or run a local command). Nothing here calls a paid API, runs in the
> background, or touches secrets. The "brain" is documentation + a read-only status script + the `/ops` view.

## The loops at a glance

| # | Loop | Cadence | Run with | Reads / writes | Who decides |
|---|------|---------|----------|----------------|-------------|
| 1 | **Daily Health** | daily | `npm run health` · `npm run ops:status` | → terminal · `docs/qa/live-qa-report.md` | Dean: safe to edit? |
| 2 | **Indicator QA** | daily / on change | `npm run qa:rc` | `data/qa/fixtures/` → `docs/qa/live-qa-report.md` · `data/qa/findings.jsonl` | Dean: which finding matters |
| 3 | **Website / Mobile QA** | on-demand | paste `prompts/website-mobile-qa.md` | homepage + beta/free-access → findings + fix batch | Dean: approve one batch |
| 4 | **Codex Critic** | daily / weekly | paste `prompts/codex-daily-critic.md` | repo state + reports → A–G critique | Dean: pick one issue |
| 5 | **Deep Research** | weekly / on-demand | paste `prompts/deep-research-weekly.md` | market/competitor research → brief | Dean: strategy calls |
| 6 | **LangSmith layer** | *future* | — (deferred) | tracing/evals once an agent *runtime* exists | — |

Loops 1–2 are mechanical (local commands). Loops 3–5 are prompt hand-offs to Codex/Claude (or a
research-capable tool). Loop 6 is deliberately not built yet — see `langsmith-future-plan.md`.

## How a day / week flows
- **Each session:** Daily Health → Indicator QA → read `live-qa-report.md` → (if needed) Codex Critic to pick the one issue → fix → re-run health. Detail: `docs/ops/agent-loop-playbook.md`.
- **Weekly block:** Deep Research for strategy (competitors, marketplace, pricing, positioning). Detail: `docs/ops/deep-research-playbook.md`.
- **Live view:** `npm run dev` → `/ops` shows the loops, the health command, the Live QA path, and copy-paste prompts.

## For a non-terminal founder
1. **Run daily:** `npm run health`, then `npm run ops:status` (read-only snapshot + "safe to edit?").
2. **Send to Codex/Claude:** the prompt files in `prompts/` (the `/ops` page has copy buttons).
3. **Reports to read:** `docs/qa/live-qa-report.md` (indicator) · `docs/ops/current-loop-status.md` (where the loop is).
4. **Founder decisions:** which one issue to fix, approving UI fix batches, any Pine change, pricing/positioning, and *if/when* to adopt LangSmith / a research API.

## Deferred on purpose (not built)
- **LangSmith SDK** — no programmatic agent runtime to trace yet (loops are human-run). Plan + event schema: `langsmith-future-plan.md`.
- **OpenAI Deep Research API** — weekly research is manual for now; the API is a *future* backend, not a daily dependency.
- **Automation** — no cron, no background jobs, no external network calls, no secrets.

## Map
- Playbook for loops 1–4 → `docs/ops/agent-loop-playbook.md`
- Strategic research → `docs/ops/deep-research-playbook.md`
- Future tracing/evals → `docs/ops/langsmith-future-plan.md`
- Process + guardrails → `docs/ops/continuous-improvement-loop.md`
- Live console → `/ops` (`app/ops/page.tsx`), explained in `docs/ops/rc-ops-console.md`
