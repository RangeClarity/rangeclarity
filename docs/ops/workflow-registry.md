# RC Workflow Registry

The index of the RangeClarity operating system: every agent role, prompt, command, and output file, with
**when to use it**. The `/ops` dashboard is the live view of this registry. Process: `docs/ops/continuous-improvement-loop.md`.

## Roles
- **Codex = critic.** Read-only. Audits + ranks. Never edits.
- **Claude = fixer.** One approved issue, smallest change. Stops and asks.
- **Dean = approver.** Owns visual/brand gate + every decision. Runs the commands.

## Agent prompts (copy → paste into the right tool)
| Card | Prompt file | When to use | Tool |
|---|---|---|---|
| Codex Daily Critic | `prompts/codex-daily-critic.md` | Each morning — rank what matters, pick one issue | Codex |
| Claude Fix One Issue | `prompts/claude-fix-one-issue.md` | After Dean approves one issue | Claude |
| Website/Mobile QA | `prompts/website-mobile-qa.md` | Auditing homepage + beta flow (390/430px) | Codex or Claude |
| Indicator Core Upgrade | `prompts/indicator-core-upgrade.md` | Evolving the Pine engine one slice (approval-gated) | Claude |
| Feature Review | `prompts/codex-feature-review.md` | Before building any non-trivial feature | Codex |
| Product Language QA | `prompts/product-language-qa.md` | Checking copy for brand/signal drift | Codex or Claude |
| Release Readiness | `prompts/release-readiness.md` | Go/no-go before charging beta users | Codex |
| Landing Page QA (lens) | `prompts/landing-page-qa.md` | Deep landing-only audit lens | any |

## Commands (run manually in your terminal — the dashboard only copies them)
| Command | Purpose |
|---|---|
| `git status --short` | See what's dirty before changing anything |
| `npm run health` | typecheck → lint → qa:rc → build (the green/red gate) |
| `npm run qa:rc` | Refresh the indicator QA report |
| `npm run rc:loop` | Print the daily loop + commands (read-only orientation) |
| `npm run dev` | Run the app locally (incl. `/ops`) |
| `npm run build` | Production build check |

## Output files (read in `/ops`, open in your editor)
| File | What it holds |
|---|---|
| `docs/ops/current-loop-status.md` | Where the loop is right now (phase, health, top issue) |
| `docs/qa/live-qa-report.md` | Indicator QA product findings (daily signal) |
| `docs/kanban.md` | The working board |
| `docs/rangeclarity-master-action-plan.md` | Master plan index → roadmap/kanban/decisions |
| `data/ops/latest-codex-review-prompt.md` | The Codex prompt staged for this pass |
| `data/ops/latest-claude-fix-prompt.md` | The Claude fix prompt staged for this pass |

## Golden rules
WIP = 1 · Codex critiques, Claude fixes one, Dean approves · no auto agent execution · no auto commit/push.
