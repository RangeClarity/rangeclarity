# RangeClarity Workflow Registry

**Purpose:** central registry for the repeatable RangeClarity operating system.

Use this registry before starting recurring work. It prevents random prompts,
scope drift, and multi-issue fix passes. Codex critiques. Claude fixes one
approved issue. Dean approves. RC-MAP and kanban stay aligned.

## Global Rules

- Do not edit Pine unless Dean explicitly approves Pine work.
- Do not redesign the site from a workflow prompt.
- Do not add product features from an ops workflow.
- Do not commit or push automatically.
- Work one issue at a time.
- Update `docs/rangeclarity-master-action-plan.md` only when strategy changes.
- Update `docs/kanban.md` when active work status changes.
- Keep product language calm, structural, and non-advisory.

## Workflow A: Daily Health Loop

| Field | Definition |
|---|---|
| Name | Daily Health Loop |
| Goal | Check whether the project is safe to work on today. |
| Trigger | Start of day, before a Claude fix, or after any implementation pass. |
| Inputs | Git status, package scripts, QA report, loop status. |
| Shell commands | `git status --short`, `npm run health`, `npm run qa:rc` |
| Codex role | Interpret failures, identify the first blocker, and recommend one next fix. |
| Claude role | Fix one approved blocker only. |
| Dean/founder approval | Required before choosing the next fix if multiple blockers exist. |
| Acceptance criteria | Health passes or the first failing command is clearly documented. |
| Files updated | `docs/ops/current-loop-status.md`, optionally `docs/kanban.md`. |
| Do-not-touch rules | No Pine, no broad redesign, no features, no commit/push. |

## Workflow B: Website / Mobile QA Loop

| Field | Definition |
|---|---|
| Name | Website / Mobile QA Loop |
| Goal | Keep the homepage, beta/free-access flow, and mobile layouts premium and clear. |
| Trigger | Before public sharing, after landing page changes, or when mobile feels weak. |
| Inputs | Homepage files, beta/free-access files, browser/mobile screenshots, console output. |
| Shell commands | `npm run dev`, `npm run health` |
| Codex role | Run `prompts/website-mobile-qa.md`, identify top issues, choose one fix. |
| Claude role | Fix one approved website/mobile issue. |
| Dean/founder approval | Required for visual acceptance. |
| Acceptance criteria | No overflow, clipped text, unclear CTA, or obvious mobile mismatch for the approved fix. |
| Files updated | Relevant app files, `docs/ops/current-loop-status.md`, optionally `docs/kanban.md`. |
| Do-not-touch rules | No full redesign, no product feature changes, no Pine. |

## Workflow C: Indicator Core Improvement Loop

| Field | Definition |
|---|---|
| Name | Indicator Core Improvement Loop |
| Goal | Improve Indicator Core V2 without turning it into a noisy signal tool. |
| Trigger | Location, zone quality, extension, structure change, or score caps feel weak. |
| Inputs | RC-MAP, kanban, indicator spec, QA report, screenshots, Dean notes. |
| Shell commands | `npm run qa:rc`, `npm run health` |
| Codex role | Critique the proposed indicator improvement and define a tiny approved scope. |
| Claude role | Prepare or implement one approved fix only if Pine work is approved. |
| Dean/founder approval | Required before any Pine edit and again after visual chart review. |
| Acceptance criteria | One structural issue improves, no signal labels appear, no forbidden wording appears. |
| Files updated | Specs/docs first; Pine only after explicit approval. |
| Do-not-touch rules | No buy/sell language, no signal labels, no volume engine, no feature expansion. |

## Workflow D: Product Language Compliance Loop

| Field | Definition |
|---|---|
| Name | Product Language Compliance Loop |
| Goal | Keep RangeClarity language structural, calm, and non-advisory. |
| Trigger | Before beta, before marketing, after copy changes, or after wording drift is spotted. |
| Inputs | App copy, docs, prompts, indicator labels, QA report. |
| Shell commands | `npm run health` after edits. |
| Codex role | Identify risky words and propose safer structure/context language. |
| Claude role | Replace one approved wording cluster only. |
| Dean/founder approval | Required for public-facing language. |
| Acceptance criteria | No buy/sell, entry/exit, target, prediction, profit, win-rate, accuracy, or advice wording. |
| Files updated | Relevant docs/app copy, `docs/ops/current-loop-status.md`. |
| Do-not-touch rules | No redesign, no strategy rewrite, no Pine unless approved. |

## Workflow E: Feature Upgrade Review Loop

| Field | Definition |
|---|---|
| Name | Feature Upgrade Review Loop |
| Goal | Decide whether a proposed feature should be built, deferred, or rejected. |
| Trigger | A new feature idea appears or an existing module feels incomplete. |
| Inputs | Feature idea, RC-MAP, kanban, QA findings, user/beta notes. |
| Shell commands | No required shell command before critique; `npm run health` after approved implementation. |
| Codex role | Run `prompts/codex-feature-review.md` and score the feature 0-100. |
| Claude role | Do nothing until Dean approves a scoped implementation task. |
| Dean/founder approval | Required before moving from review to build. |
| Acceptance criteria | Clear build/defer/reject decision with reason and owner. |
| Files updated | RC-MAP decision log for strategic changes, kanban for active work. |
| Do-not-touch rules | No implementation during review, no feature stacking, no Pine without approval. |

## Workflow F: Release Readiness Loop

| Field | Definition |
|---|---|
| Name | Release Readiness Loop |
| Goal | Decide whether RangeClarity is ready for beta/public release. |
| Trigger | Before beta invite, public share, pricing test, or major landing page push. |
| Inputs | Health result, QA report, website/mobile QA, compliance sweep, beta/access docs. |
| Shell commands | `git status --short`, `npm run health`, `npm run qa:rc`, `npm run build` |
| Codex role | Identify release blockers and non-blocking polish items. |
| Claude role | Fix only one approved blocker per pass. |
| Dean/founder approval | Required for release go/no-go. |
| Acceptance criteria | Health passes, major QA blockers are resolved or accepted, no compliance drift remains. |
| Files updated | `docs/ops/current-loop-status.md`, `docs/kanban.md`, release checklist if present. |
| Do-not-touch rules | No late feature additions, no marketing claims, no automatic push. |

## Workflow G: Weekly Strategy Review Loop

| Field | Definition |
|---|---|
| Name | Weekly Strategy Review Loop |
| Goal | Keep strategy, work cards, QA findings, and next priorities aligned. |
| Trigger | Weekly review, major decision, or after several fix passes. |
| Inputs | RC-MAP, kanban, loop status, QA report, beta feedback, git status. |
| Shell commands | `git status --short`, `npm run health` |
| Codex role | Critique whether current work matches strategy and recommend next-week priorities. |
| Claude role | Update docs only after Dean approves the chosen roadmap changes. |
| Dean/founder approval | Required for priority changes. |
| Acceptance criteria | One clear weekly priority, parked items remain parked, RC-MAP and kanban agree. |
| Files updated | `docs/rangeclarity-master-action-plan.md`, `docs/kanban.md`, `docs/ops/current-loop-status.md`. |
| Do-not-touch rules | No implementation, no Pine, no new feature queue without scoring. |
