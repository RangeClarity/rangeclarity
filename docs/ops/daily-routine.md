# RangeClarity Daily Routine

Use this routine to keep RangeClarity moving without opening ten parallel fronts.

## Morning

1. Check the worktree:

```bash
git status --short
```

2. Run project health:

```bash
npm run health
```

3. Run indicator QA:

```bash
npm run qa:rc
```

4. Review the QA report:

```text
docs/qa/live-qa-report.md
```

5. Review current loop status:

```text
docs/ops/current-loop-status.md
```

If the QA report is only a scaffold, treat Live QA as the current operating gap.

## Website Check

1. Run the dev server:

```bash
npm run dev
```

2. Inspect the homepage on mobile.

3. Inspect the beta/free-access flow.

4. Note the top 3 issues only.

Check for:

- Too much text.
- Weak first viewport.
- Mobile spacing problems.
- CTA confusion.
- Generic copy.
- Design mismatch.
- Broken responsive layout.
- Missing premium feel.

## Agent Loop

1. Ask Codex to critique current state using:

```text
prompts/codex-daily-critic.md
```

2. Pick one approved issue.

3. Ask Claude to fix one approved issue only using:

```text
prompts/claude-fix-one-issue.md
```

4. Rerun:

```bash
npm run health
```

5. Update:

```text
docs/kanban.md
docs/ops/current-loop-status.md
```

Only update RC-MAP if the decision changed strategy.

## Dean Approval

Dean approves:

- The one issue selected for Claude.
- The visual result after Claude finishes.
- Whether kanban or RC-MAP needs an update.
- Whether another loop should start.

## Evening

1. Record what changed.

2. Decide the next task.

3. Prepare the next prompt.

4. Confirm no automatic commit or push happened.

## Daily Constraint

One day should produce one meaningful improvement, not five half-fixes.

If the first issue is not fixed, do not move to the second issue.
