# RangeClarity Kanban

Local source of truth until Linear is connected. Do not create real Linear tickets from this file without founder approval.

## Current Operating Mode

- Linear status: blocked / not connected in the active Codex tool context.
- Active board: this file.
- Migration rule: keep every card Linear-ready, then migrate only after Linear MCP/API credentials are confirmed and the target project validates as `RangeClarity`.
- Source of truth rule: if Telegram/Hermes, Claude, Codex, and Linear disagree, this file wins until a real Linear sync is completed.

## Board Rules

- Every card must move RangeClarity closer to users, revenue, or validated product value.
- Avoid backend, auth, payments, real stock APIs, and AI bot features until validation proves the need.
- Keep public claims educational: no signals, no hype, no profit promises, no personalized financial advice.
- Linear sync status stays `not synced` until `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID`, `LINEAR_PROJECT_NAME=RangeClarity`, and `LINEAR_DRY_RUN=true` are configured and validated.
- One row equals one future Linear issue unless the founder explicitly asks to split or merge it.
- Done conditions must be concrete enough to verify without guessing.
- Real Linear creation remains blocked until founder approval and a separate non-dry-run implementation pass.

## Milestone Board

| ID | Milestone | Status | Priority | Owner | Done Condition | Linear |
|---|---|---|---|---|---|---|
| RC-M01 | Domain live | Backlog | High | Founder | RangeClarity.com resolves to the intended landing page with HTTPS. | not synced |
| RC-M02 | Landing page live | In Progress | High | Founder + Codex/Claude | Premium meme-fintech TradingView landing page is live, mobile-safe, and CTA-ready. | not synced |
| RC-M03 | Waitlist or early-access capture live | Next | High | Founder | Visitor can take one clear action to join early access or request Pro. | not synced |
| RC-M04 | TradingView setup page live | Next | Medium | Founder + Codex/Claude | Setup page explains Starter -> waitlist/Discord -> invite-only Pro flow. | not synced |
| RC-M05 | Starter / Range Map MVP built and tested | Backlog | High | Founder | TradingView Starter scope is implemented and tested on realistic chart scenarios. | not synced |
| RC-M06 | 10 early testers recruited | Backlog | High | Founder | 10 TradingView users agree to test and give structured feedback. | not synced |
| RC-M07 | 3 users willing to pay | Backlog | High | Founder | 3 qualified users explicitly say they would pay for Pro access. | not synced |
| RC-M08 | First paid Pro plan launched | Backlog | High | Founder | Manual or Whop-backed paid access flow is live for first customers. | not synced |
| RC-M09 | 10 paying users | Backlog | Medium | Founder | 10 active paid users are onboarded without breaking support flow. | not synced |
| RC-M10 | 50 paying users | Backlog | Medium | Founder | Repeatable acquisition/onboarding/support loop supports 50 paid users. | not synced |
| RC-M11 | Weekly content engine running | Backlog | Medium | Founder | Weekly chart-context content cadence runs for 4 consecutive weeks. | not synced |

## Next

| ID | Task | Milestone | Priority | Owner | Done Condition | Linear |
|---|---|---|---|---|---|---|
| RC-T01 | Choose the first conversion path | RC-M03 | High | Founder | Decide waitlist form, Discord invite, Whop page, or manual Telegram/DM capture. | not synced |
| RC-T02 | Make landing page CTA concrete | RC-M02 / RC-M03 | High | Codex/Claude | Primary and secondary CTAs point to the chosen early-access path. | not synced |
| RC-T03 | Final landing page trust pass | RC-M02 | High | Codex/Claude | FAQ, disclaimer, and no-hype copy are visible and consistent. | not synced |
| RC-T04 | Freeze Starter / Range Map MVP spec | RC-M05 | High | Founder | Scope lists included signals, excluded Pro features, test scenarios, and compliance language. | not synced |
| RC-T05 | Draft early tester outreach message | RC-M06 | High | Founder + Hermes | Message explains the product, asks for feedback, and avoids trading-result claims. | not synced |

## In Progress

| ID | Task | Milestone | Priority | Owner | Done Condition | Linear |
|---|---|---|---|---|---|---|
| RC-T06 | Preserve premium meme-fintech landing identity | RC-M02 | High | Codex/Claude | Homepage keeps dark market-command-center, TradingView toolkit, collectible-card direction. | not synced |
| RC-T07 | Keep Hermes RangeClarity command center working | RC-M03 / RC-M06 | Medium | Codex | Telegram commands return project status, plan, weekly priorities, and dry-run Linear planning. | not synced |

## Backlog

| ID | Task | Milestone | Priority | Owner | Done Condition | Linear |
|---|---|---|---|---|---|---|
| RC-T08 | Publish domain and HTTPS checklist | RC-M01 | High | Founder | DNS, hosting, HTTPS, canonical URL, and smoke test are documented. | not synced |
| RC-T09 | Build TradingView setup page content | RC-M04 | Medium | Codex/Claude | Setup flow covers discovery, install, early access, invite approval, and support. | not synced |
| RC-T10 | Write Range Map test scenarios | RC-M05 | High | Founder | At least 5 scenarios cover range, support/resistance, compression, breakout watch, and late-entry risk. | not synced |
| RC-T11 | Create tester feedback form/questions | RC-M06 | High | Founder | Feedback captures clarity, confusion, trust, willingness to pay, and feature objections. | not synced |
| RC-T12 | Run 3 willingness-to-pay conversations | RC-M07 | High | Founder | 3 qualified users answer pricing/value questions without being pushed into signals/profit framing. | not synced |
| RC-T13 | Decide launch pricing | RC-M08 | High | Founder | Pick initial Pro price and annual/monthly framing. | not synced |
| RC-T14 | Choose first access/payment mechanism | RC-M08 | High | Founder | Decide manual access, Whop, or waitlist-only prelaunch path. | not synced |
| RC-T15 | Create weekly chart-context content backlog | RC-M11 | Medium | Founder + Hermes | 12 educational post ideas teach range, trend, support/resistance, extension, and risk. | not synced |
| RC-T16 | Define onboarding checklist for paid Pro users | RC-M08 / RC-M09 | Medium | Founder | New user knows how to get access, install indicators, ask support, and understand limitations. | not synced |
| RC-T17 | Track early objections and product risks | RC-M06 / RC-M07 | Medium | Hermes | Objections are grouped into copy, product, pricing, trust, and onboarding buckets. | not synced |

## Blocked

| ID | Task | Milestone | Priority | Owner | Blocker | Linear |
|---|---|---|---|---|---|---|
| RC-B01 | Create real Linear tickets | All | Medium | Founder | Linear MCP/tool is not connected in the active Codex context. Requires confirmed Linear access, `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID`, `LINEAR_PROJECT_NAME=RangeClarity`, target validation, a separate non-dry-run implementation pass, and explicit approval. | not synced |
| RC-B02 | Validate Linear RangeClarity target | All | High | Founder + Codex | Run discovery and validation scripts; confirm the configured project name is exactly `RangeClarity` and belongs to the configured team. | not synced |

## Done

| ID | Task | Milestone | Owner | Done Evidence | Linear |
|---|---|---|---|---|---|
| RC-D01 | Create RangeClarity project docs baseline | RC-M02 | Codex | `docs/plan.md`, `docs/rcstatus.md`, and this Kanban file exist. | not synced |
| RC-D02 | Add Hermes dry-run Linear planner | RC-M03 | Codex | Hermes can draft Linear tickets in dry-run mode and requires approval before creation. | not synced |
| RC-D03 | Add Telegram setup/status checks | RC-M03 | Codex | `RangeClarity setup test`, `/rcsetup`, and `/rcstatus` return deterministic project context. | not synced |

## Sync To Linear Later

When Linear is configured and validated, create tickets from this order:

1. RC-T01 through RC-T05.
2. RC-T06 and RC-T07.
3. RC-M01 through RC-M05 as milestones/projects or labels.
4. Remaining backlog after founder approves the first board.

Before any real ticket creation, run:

```powershell
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_validate_target.py
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_dry_run_ticket.py --from-kanban RC-T01
```

## Linear Migration Map

Use this mapping when Linear becomes available:

| Local Field | Linear Field |
|---|---|
| ID | Issue identifier prefix in title or custom field |
| Task | Issue title |
| Milestone | Project, milestone, or label |
| Priority | Linear priority |
| Owner | Assignee or unassigned note |
| Done Condition | Issue description acceptance criteria |
| Board section | Linear status |

Recommended Linear labels:

- `rangeclarity`
- `landing`
- `tradingview`
- `validation`
- `gtm`
- `pricing`
- `community`
- `compliance-copy`

Recommended first Linear statuses:

- `Backlog`
- `Next`
- `In Progress`
- `Blocked`
- `Done`
