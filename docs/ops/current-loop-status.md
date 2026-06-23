# RC Continuous Improvement Loop Status

**Last updated:** 2026-06-23  
**Owner:** Dean  
**Source of truth:** `docs/rangeclarity-master-action-plan.md`

## Current Project Phase

Workflow system created. The project is in operating-system setup and QA gate
stabilization, not product feature expansion.

## Last Health Result

Passed on 2026-06-23.

Command:

```bash
npm run health
```

Passed:

- `npm run typecheck`
- `npm run lint`
- `npm run qa:rc`
- `npm run build`

## Last QA Result

`docs/qa/live-qa-report.md` now exists as a scaffold. It does not yet contain
automated TradingView webhook findings.

## Current Top Issue

The Live QA Agent is not implemented yet. The report exists, but daily QA still
needs real fixtures, deterministic rules, and a report generator.

## Selected Next Issue

Mobile Navigation + Conversion Redesign v1.

Prompt:

```text
prompts/claude-mobile-navigation-conversion-v1.md
```

Scope:

- Homepage `/`
- `/beta`
- `/beta/free-access`
- Shared beta header/nav if relevant
- Mobile UX, first viewport, CTA clarity, and conversion flow

## Current Codex Task

After Claude's pass, use `prompts/codex-daily-critic.md` or
`prompts/website-mobile-qa.md` to review health, mobile quality, wording drift,
and whether the fix stayed scoped.

## Current Claude Task

Use `prompts/claude-mobile-navigation-conversion-v1.md` to fix the approved
mobile navigation and conversion issue. Claude must keep the change scoped, run
`npm run health`, and stop after reporting.

## Founder Approval Needed

- Choose the first issue for Claude.
- Approve any visual website/mobile change.
- Approve any Pine edit before it starts.
- Decide whether RC-MAP or kanban needs updating after the fix.

## Do-Not-Touch List

- Pine implementation unless explicitly approved.
- Broad landing page redesign.
- New product features.
- Payment/pro access automation.
- Website Brain.
- Commits or pushes.
