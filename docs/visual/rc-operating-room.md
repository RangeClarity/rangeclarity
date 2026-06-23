# RangeClarity Operating Room / RC Ops

**Route:** `/ops`  
**File:** `app/ops/page.tsx`  
**Purpose:** internal command center for daily RangeClarity operating decisions.

RC Ops is a visual dashboard for Dean and future agents. It shows what exists,
what is missing, what can be automated, what stays manual, and what should not
be built yet. It does not edit Pine, run automation, or implement product
features.

## Source References

- `docs/rangeclarity-master-action-plan.md` - central RC-MAP source of truth.
- `docs/kanban.md` - active task board and current build discipline.
- `docs/qa/live-qa-agent-architecture.md` - planned Live QA architecture file.
- `docs/qa/live-qa-rules.md` - planned Live QA rules file.
- `docs/qa/live-qa-report.md` - planned daily QA report file.
- `package.json` - current scripts; QA commands are planned, not active yet.
- `app/roadmap/page.tsx` - existing internal visual roadmap style reference.

## Dashboard Sections

1. Project System Map
   - RC-MAP, Kanban, Pine Indicator Core V2, Location Quality Kernel, Zone
     Quality, Extension, Structure Change, Score Caps, Live QA Agent, QA
     Fixtures, QA Report, Landing / Waitlist, Payments / Pro Access, X Content
     Agent, future webhook, future screenshot QA, and future Website Brain.
   - Each module shows status, owner, priority, current action, and automation
     potential.

2. Daily Routine Panel
   - Morning QA routine.
   - Build loop: Claude implements, Codex reviews, Dean approves visually.
   - Evening record and next-prompt routine.

3. Action Buttons / Commands
   - Shows copyable text for:
     - `npm run qa:rc`
     - `npm run qa:report`
     - `docs/qa/live-qa-report.md`
     - `docs/kanban.md`
     - `docs/rangeclarity-master-action-plan.md`
   - QA commands are visual placeholders until scripts exist.

4. Automation Opportunities
   - Marks daily QA report, findings to bug list, and weekly roadmap summary as
     worth doing now.
   - Marks webhook ingest, screenshot QA, issue creation, X drafts, beta
     feedback summary, and Website Brain style automation as later.

5. Priority Roadmap
   - Now: Location Quality Kernel v1, QA Agent as gate, Zone Quality v1, Score
     Caps, Structure Change.
   - Next: Pine JSON emitter, TradingView webhook receiver, 20-50 ticker daily
     review, beta feedback loop.
   - Later: Website Brain, Watchlist Radar, Pro automation, Screenshot QA, MTF
     advanced mode.

6. Manual vs Automated
   - Clarifies which tasks still need human judgment and which can become
     automated after Core V2 and offline QA stabilize.

## Maintenance Rules

- Update RC-MAP first when strategy changes.
- Update `docs/kanban.md` second when work cards change.
- Update `/ops` only when the operating model changes.
- Do not add Pine logic or product features from this page.
- Do not mark QA commands as available until scripts exist in `package.json`.
- Keep the page calm, internal, and decision-oriented.

## Current Gaps

- `docs/qa/live-qa-agent-architecture.md` is not present yet.
- `docs/qa/live-qa-rules.md` is not present yet.
- `docs/qa/live-qa-report.md` is not present yet.
- `npm run qa:rc` and `npm run qa:report` are not present in `package.json`.

These gaps are shown intentionally in RC Ops so Dean can see what should become
automated first.
