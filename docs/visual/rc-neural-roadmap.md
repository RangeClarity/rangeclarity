# RangeClarity Neural Roadmap / RC Operating Map

**Status:** Strategic operating map derived from RC-MAP  
**Last updated:** 2026-06-23  
**Primary source of truth:** `docs/rangeclarity-master-action-plan.md`  
**Dataset:** `data/roadmap/rc-neural-roadmap.json`  
**Visual page:** `/roadmap`

This document extends RC-MAP. It does not replace it. RC-MAP remains the decision source of truth; this operating map visualizes dependencies, priorities, owners, automation opportunities, and the path from planning into implementation.

## Purpose

The RC Operating Map helps Dean, Codex, Claude Code, Hermes, and future agents understand:

- what we are building
- what depends on what
- what to do first
- what to automate
- what type of developer or freelancer is needed
- how to score and prioritize tasks
- how to move from planning into implementation

The system view is:

```text
Indicator Brain
  -> Pine Surface
  -> Live QA Agent
  -> Website / Payments
  -> User Access
  -> Community
  -> Marketing
  -> Feedback Loop
  -> Product Iteration
```

## Neural System Map

| System | Status | Owner | Priority | Dependencies | Automation | Skill Type |
|---|---:|---|---:|---|---|---|
| Product Shape / RC-MAP | in progress | Dean + Codex | 96 | none | medium | Product architecture |
| Pine Indicator Surface | next | Claude + Pine specialist | 90 | RC-MAP, Hidden Structure Engine | low | Pine Script UI and chart design |
| Hidden Structure Engine | next | Claude + Codex | 94 | RC-MAP | medium | Quant structure design |
| Location Quality Kernel | next | Claude + Pine specialist | 92 | Hidden Engine, Zone Engine | medium | Pine algorithm design |
| Zone Quality Engine | next | Claude + Pine specialist | 89 | Hidden Engine | medium | Market structure logic |
| Structure Delta Engine | later | Codex + Claude | 83 | Location Kernel, Zone Engine | high | State machine design |
| Live QA Agent | next | Codex + backend automation | 84 | Indicator Surface, QA Fixtures | high | QA automation |
| TradingView Webhook Pipeline | later | Backend automation developer | 71 | Live QA Agent, Pine JSON | high | TypeScript backend |
| Website / Landing / Waitlist | in progress | Claude + TypeScript developer | 78 | RC-MAP | medium | Next.js product frontend |
| Payments / Pro Access | later | Dean + backend developer | 63 | Website, Beta Loop | medium | Payment operations |
| User Accounts | later | Backend developer | 47 | Payments / Pro Access | medium | Auth and data modeling |
| Discord / Telegram / Community | later | Dean + Hermes | 67 | Beta Loop | medium | Community operations |
| X Content Agent | later | Dean + Hermes | 66 | Indicator Surface, Demo Screenshots | high | Growth content operations |
| Feedback + Bug Intake | next | Hermes + Codex | 79 | Beta Loop, Live QA Agent | high | Product ops |
| Daily QA Reports | next | Codex + Hermes | 82 | QA Fixtures, Live QA Agent | high | QA reporting |
| Future Website Brain / Watchlist Radar | later | Dean + product architect | 58 | Live QA, Webhooks, Beta Loop | high | Product strategy and data architecture |

## Roadmap Phases

### Phase 0 - Product Shape Lock

Lock what RangeClarity is and is not.

Exit criteria:

- RC-MAP accepted.
- V2 product shape locked.
- Default surface constraints approved.

### Phase 1 - Indicator Core v2

Location Quality Kernel, Zone Quality, Simple Surface table, and score caps.

Exit criteria:

- Pine spec approved.
- Location row defined.
- Zone quality rules defined.
- No signal wording.

### Phase 2 - Live QA Agent

Offline fixtures, QA rules, reports, then TradingView webhook.

Exit criteria:

- Fixture runner works.
- Daily report writes.
- Webhook schema approved.

### Phase 3 - Pro Access Foundation

Payments, account/access management, TradingView invite/manual/pro flow.

Exit criteria:

- Manual beta access proven.
- Payment path chosen.
- TradingView invite process documented.

### Phase 4 - Feedback + Beta Loop

Private users, bug reports, chart screenshots, and daily QA improvements.

Exit criteria:

- 5-10 testers active.
- Feedback intake works.
- Weekly review cadence running.

### Phase 5 - Marketing Engine

X content, landing page iteration, demo visuals, and waitlist conversion.

Exit criteria:

- Proof screenshots approved.
- Durable waitlist fixed.
- Content cadence starts.

### Phase 6 - Automation Layer

Daily QA report, issue generation, content drafts, and user feedback summary.

Exit criteria:

- Daily QA automated.
- Issue drafts generated.
- Weekly summary generated.

### Phase 7 - Website Brain / Watchlist Radar

Canonical engine, watchlist ranking, and daily structure briefs.

Exit criteria:

- Watchlist data stable.
- Compliance reviewed.
- User demand proven.

## Prioritization Scoring

Priority Score =

```text
Impact 25%
+ Product Clarity 20%
+ Dependency Unlock 15%
+ Revenue/Beta Value 15%
+ Risk Reduction 10%
+ Automation Leverage 10%
+ Effort Inverse 5%
```

Inputs use a 1-5 scale. Effort inverse is `6 - effort`. Scores are normalized to 0-100.

Each task records:

- impact
- effort
- confidence
- priority score
- recommended timing
- why it matters

## Highest Priority Tasks

| Rank | Task | Score | Timing | Why |
|---:|---|---:|---|---|
| 1 | Lock V2 Product Shape | 91 | now | Prevents drift into indicator soup or signal language. |
| 2 | Lock V2 Surface Spec | 88 | now | Defines exactly what appears on chart before Pine work starts. |
| 3 | Add Score Caps | 87 | next | Keeps RC Score honest when zones, regime, or location are weak. |
| 4 | Implement Location Quality Kernel v1 | 86 | next | Creates the core premium read: where price is relative to meaningful structure. |
| 5 | RC-MAP Update Discipline | 86 | now | Prevents competing roadmaps and stale implementation assumptions. |
| 6 | Improve S/R Selection | 85 | next | Location logic is only trustworthy if support and resistance are trustworthy. |
| 7 | Create QA Fixtures | 84 | next | Allows regression testing before TradingView webhooks exist. |
| 8 | Add Structure Change v1 | 84 | later | Creates the daily habit hook. |
| 9 | Create QA Rules | 83 | next | Turns product standards into deterministic checks. |
| 10 | Founder Approval Gates | 82 | now | Keeps planning, Pine work, payments, and automation from starting prematurely. |

## Developer / Freelancer Recommendations

| Role | Should Do | Should Not Do | Hours | Priority | Internal First? |
|---|---|---|---:|---|---|
| Pine Script Specialist | Review and implement approved Indicator Core v2 logic, compile in TradingView, validate repaint behavior. | Invent visible signals, add trade-call wording, or expand scope beyond approved spec. | 8-18 | high after Phase 0 | Claude/Codex can spec first; hire for implementation QA and compile validation. |
| TypeScript/Next.js Developer | Durable waitlist, internal dashboards, QA tooling, and careful production plumbing. | Build accounts/payments before manual beta validates demand. | 8-20 | medium | Claude/Codex can handle internal pages and specs first. |
| Backend Automation Developer | Build webhook receiver, event store, reports, and future issue automation. | Create trading automation or live advice workflows. | 10-24 | medium after offline QA | Codex can build offline fixture runner first. |
| Product/UI Designer | Polish indicator surface, landing proof visuals, and screenshot style. | Turn the product into a flashy fintech dashboard or signal aesthetic. | 8-16 | medium | Dean/Codex can define constraints first. |
| QA Automation Engineer | Fixture regression, screenshot QA, report validation, and brittle-case testing. | Assert trading correctness or build strategy backtests. | 8-20 | later | Codex can define rules and initial runner first. |
| Growth/Content Operator | Turn approved screenshots into educational, compliance-safe content. | Make performance claims, trade calls, or hype posts. | 5-10/week | later after proof | Dean can write early posts manually. |
| DevOps/Light Infrastructure | Deploy Vercel app, durable storage, backups, secrets, and monitoring. | Overbuild cloud infrastructure before traffic and beta demand. | 4-10 | medium | Codex can document first. |
| Trading/Product Advisor | Review whether reads feel useful to serious swing traders. | Provide signals, claims, or performance marketing language. | 4-8 | medium after V2 surface | Dean can source beta feedback first. |

## Automation Opportunities

| Automation | Trigger | Input | Output | Owner | Difficulty | Worth Now |
|---|---|---|---|---|---|---|
| Daily Indicator QA Report | Daily after confirmed 1D events or fixture run | QA events and findings | `docs/qa/live-qa-report.md` | Codex + Hermes | medium | yes, offline first |
| Fixture Regression Tests | Before Pine or scoring changes | QA fixtures | pass/fail findings | Codex | low | yes |
| TradingView Webhook Event Collection | Confirmed TradingView alerts | Pine JSON alert payload | SQLite/Supabase events | Backend automation | medium | not until offline QA is useful |
| Screenshot Review | Daily or before beta review | Chart URLs/screenshots | visual QA findings | QA automation | high | later |
| GitHub/Linear Issue Creation | High priority QA finding | finding JSONL | draft issue | Hermes | medium | later |
| RC-MAP Update Reminders | After major critique or implementation | decision summary | reminder/checklist | Hermes | low | yes |
| X Post Draft Generation | Approved proof screenshot | screenshot + safe notes | draft X posts | Hermes + Dean | low | later |
| User Feedback Summary | Weekly beta review | feedback form + bug intake | themes and priorities | Hermes + Codex | medium | later |
| Beta User Onboarding | Approved beta user | email, TradingView username, access status | onboarding checklist | Dean + Hermes | medium | later, manual first |
| Weekly Roadmap Review | Friday review | RC-MAP, kanban, QA, feedback | next-week priorities | Dean + Codex | low | yes |

## Decision Dashboard

### What should we build this week?

- Lock V2 Product Shape.
- Lock V2 Surface Spec.
- Run Compliance Wording Sweep.
- Enforce RC-MAP Update Discipline.
- Define Location Quality Kernel spec.

### What should we avoid building now?

- Product feature implementation before approval.
- Pine edits outside Location Quality plan.
- Full volume/liquidity engine.
- Payments automation.
- Complex MTF dashboard.
- AI commentary.
- Trading advice language.

### Highest leverage next task

Lock V2 Surface Spec, then specify Location Quality Kernel v1.

### What is blocked?

- Controlled Pine build is blocked until founder approval.
- Webhook pipeline is blocked until offline QA runner is useful.
- Payments automation is blocked until manual beta flow is validated.
- Screenshot QA is blocked until state QA creates meaningful findings.

### What requires founder approval?

- V2 surface rows and score visibility.
- Pine implementation start.
- Payment/access flow.
- Waitlist provider.
- Beta user cohort.
- Any public marketing claims.

### What should Claude do?

- Draft V2 surface spec.
- Draft Location Quality Kernel spec.
- Prepare Pine architecture gate.
- Keep implementation blocked until approved.

### What should Codex review?

- RC-MAP consistency.
- Compliance wording.
- Pine feasibility.
- QA rule coverage.
- Whether new features improve clarity without noise.

### What can Hermes automate?

- RC-MAP update reminders.
- Weekly roadmap review prompts.
- QA report summary later.
- Feedback summary later.
- Issue draft generation later.

## Update Rules

1. Update RC-MAP first when a major decision changes.
2. Update `data/roadmap/rc-neural-roadmap.json` when tasks, scores, owners, phases, or automations change.
3. Update this Markdown file when the narrative or decision dashboard changes.
4. Run the visual page locally and check `/roadmap` after dataset changes.
5. Do not edit Pine implementation from this roadmap task.
