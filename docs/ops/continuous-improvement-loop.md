# RC Continuous Improvement Loop

**Purpose:** keep RangeClarity improving without chaos.

This loop turns loose issues into a repeatable operating cadence. Codex audits
and critiques. Claude fixes one approved issue. Dean approves visually. RC-MAP
and kanban are updated after meaningful decisions.

The loop does not redesign the whole site, edit Pine, add features, commit, or
push automatically.

## Operating Rule

One loop equals one focused improvement.

Do not batch unrelated issues. Do not let a website issue become a product
strategy rewrite. Do not let a wording sweep become a Pine change. Do not let
QA findings become a new feature list.

## Roles

| Role | Responsibility | Must not do |
|---|---|---|
| Dean | Chooses priorities, approves visuals, decides if a fix is good enough. | Skip approval gates or approve broad scope without seeing the result. |
| Codex | Audits current state, critiques, ranks issues, defines what Claude should fix first. | Implement broad changes when the task is critique-only. |
| Claude | Implements one approved fix. | Redesign, add features, edit Pine, or continue to a second fix without approval. |
| RC-MAP | Central source of truth. | Become stale after decisions change. |
| Kanban | Active operating board. | Become a backlog of every idea. |

## Loop Stages

### 1. Daily Health Check

Run:

```bash
git status --short
npm run health
```

Purpose:

- Catch broken typecheck, lint, QA, or build before changing anything.
- See whether the worktree already has unrelated changes.
- Avoid starting a new fix on top of unknown breakage.

Output:

- Health result.
- Dirty worktree summary.
- Known blockers.

### 2. Website / Mobile QA

Run the app locally and inspect the homepage plus beta/free-access flow.

Check only for:

- Weak first viewport.
- Too much text.
- Mobile spacing problems.
- CTA confusion.
- Design mismatch.
- Broken responsive layout.
- Premium feel.

Output:

- Top 3 website issues only.

### 3. Product Wording QA

Review visible product language across the homepage, docs, prompts, and product
surfaces.

Reject wording that sounds like:

- Buy/sell signals.
- Entry/exit instructions.
- Targets.
- Predictions.
- Profit, win-rate, accuracy, or guaranteed outcome claims.
- Financial advice.

Output:

- Specific wording issues.
- Safer replacement direction.

### 4. Indicator QA

Use the current QA report when it exists:

```text
docs/qa/live-qa-report.md
```

Until Live QA exists, this step is a manual review gate.

Check:

- Score consistency.
- Location logic.
- Zone quality.
- Regime consistency.
- Visual noise.
- Forbidden wording.

Output:

- Top suspicious readings.
- Whether each issue is visual, algorithmic, wording, or data-quality related.

### 5. Codex Critique

Use:

```text
prompts/codex-daily-critic.md
```

Codex must inspect current project state and return:

- Project health.
- Top blockers.
- Website/mobile issues.
- Product wording issues.
- QA findings.
- The single first issue Claude should fix.
- What not to touch.

Output:

- One recommended Claude task.
- Explicit non-goals.

### 6. Claude Fix Pass

Use:

```text
prompts/claude-fix-one-issue.md
```

Claude fixes only the approved issue.

Rules:

- Smallest useful change.
- No broad redesign.
- No Pine unless explicitly approved.
- No feature expansion.
- Run `npm run health` after the fix.
- Report changed files.
- Stop after one issue.

Output:

- One fix.
- Health result.
- Files changed.
- Any remaining issue.

### 7. Founder Visual Approval

Dean checks the result directly.

Approve only if:

- The visible issue is actually improved.
- Mobile still works.
- The page still feels premium and calm.
- No new wording drift appears.
- The change did not create a new product direction.

Output:

- Approved.
- Needs revision.
- Revert/request different fix.

### 8. RC-MAP / Kanban Update

Update docs only when the decision or work state changed.

Update:

- `docs/rangeclarity-master-action-plan.md` for strategic decisions.
- `docs/kanban.md` for active work cards and status.
- `docs/ops/current-loop-status.md` for daily operating state.

Output:

- Current top issue.
- Next Claude task.
- Next Codex review task.
- Founder decision needed.

## Definition Of Done For One Loop

- Health was run before or after the fix.
- Codex identified the priority.
- Claude fixed exactly one approved issue.
- Dean reviewed visually.
- RC-MAP or kanban was updated only if needed.
- No commit or push was made automatically.

## What Stays Manual For Now

- Founder visual approval.
- Final priority decisions.
- Pine implementation approval.
- Product wording approval.
- Marketing claim approval.
- Commit and push.

## What Can Become Automated First

1. Daily QA report.
2. Findings to bug list.
3. Weekly roadmap summary.

## What Stays Later

- TradingView webhook ingest.
- Screenshot QA.
- GitHub/Linear issue creation.
- Website Brain.
- Payment or Pro access automation.
