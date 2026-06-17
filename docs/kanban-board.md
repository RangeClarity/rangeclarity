# RangeClarity Kanban Board

Linear is the intended project source of truth. Until Linear credentials are configured and tested, this markdown file and `docs/kanban-board.json` are the safe local fallback.

Slack and Telegram are delivery channels only:

- Slack: `slack:taskoza-agents`, `slack:C0BA3UD48TG`
- Telegram: `telegram:Dean`, `telegram:Columbus`

## Operating Rules

- `KANBAN_PROVIDER=linear` makes Hermes use Linear when `LINEAR_API_KEY` and `LINEAR_TEAM_ID` or `LINEAR_TEAM_KEY` are configured.
- Missing Linear credentials fall back to `docs/kanban-board.json` and this file.
- Real Linear writes require explicit command/action approval.
- RangeClarity work must move toward users, revenue, or validated product value.
- Public copy must stay educational: no signals, no hype, no profit promises, no personalized financial advice.
- No backend, auth, payments, real stock APIs, or AI trading bots unless explicitly approved.

## Status Mapping

| Local Status | Linear Status |
|---|---|
| Backlog | Backlog |
| Planned / Next | Planned |
| In Progress | In Progress |
| Blocked | Backlog |
| Done | Done |

## Milestones

| ID | Milestone | Status | Priority | Owner | Done Condition | Linear |
|---|---|---|---|---|---|---|
| RC-M01 | Domain live | Backlog | High | Founder | RangeClarity.com resolves to the intended landing page with HTTPS. | not synced |
| RC-M02 | Landing page live | In Progress | High | Founder + Codex/Claude | Premium meme-fintech TradingView landing page is live, mobile-safe, and CTA-ready. | not synced |
| RC-M03 | Waitlist or early-access capture live | Planned | High | Founder | Visitor can take one clear action to join early access or request Pro. | not synced |
| RC-M04 | TradingView setup page live | Planned | Medium | Founder + Codex/Claude | Setup page explains Starter to waitlist/Discord to invite-only Pro flow. | not synced |
| RC-M05 | Starter / Range Map MVP built and tested | Backlog | High | Founder | TradingView Starter scope is implemented and tested on realistic chart scenarios. | not synced |
| RC-M06 | 10 early testers recruited | Backlog | High | Founder | 10 TradingView users agree to test and give structured feedback. | not synced |
| RC-M07 | 3 users willing to pay | Backlog | High | Founder | 3 qualified users explicitly say they would pay for Pro access. | not synced |
| RC-M08 | First paid Pro plan launched | Backlog | High | Founder | Manual or Whop-backed paid access flow is live for first customers. | not synced |
| RC-M09 | 10 paying users | Backlog | Medium | Founder | 10 active paid users are onboarded without breaking support flow. | not synced |
| RC-M10 | 50 paying users | Backlog | Medium | Founder | Repeatable acquisition, onboarding, and support loop supports 50 paid users. | not synced |
| RC-M11 | Weekly content engine running | Backlog | Medium | Founder | Weekly chart-context content cadence runs for 4 consecutive weeks. | not synced |

## Planned

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
| RC-T07 | Keep Hermes RangeClarity command center working | RC-M03 / RC-M06 | Medium | Codex | Telegram commands return project status, plan, weekly priorities, Kanban, and dry-run Linear planning. | not synced |

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

## Done

| ID | Task | Milestone | Owner | Done Evidence | Linear |
|---|---|---|---|---|---|
| RC-D01 | Create RangeClarity project docs baseline | RC-M02 | Codex | `docs/plan.md`, `docs/rcstatus.md`, and `docs/kanban.md` exist. | not synced |
| RC-D02 | Add Hermes dry-run Linear planner | RC-M03 | Codex | Hermes can draft Linear tickets in dry-run mode and requires approval before creation. | not synced |
| RC-D03 | Add Telegram setup/status checks | RC-M03 | Codex | `RangeClarity setup test`, `/rcsetup`, and `/rcstatus` return deterministic project context. | not synced |

## Sync Later

Once Linear is configured, migrate the first tickets in this order:

1. RC-T01 through RC-T05.
2. RC-T06 and RC-T07.
3. RC-M01 through RC-M05 as Linear milestones, projects, labels, or parent issues.
4. Remaining backlog after founder approval.
