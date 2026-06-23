# RangeClarity Feature Improvement Loop

**Trigger:** a feature feels weak, broken, too noisy, generic, confusing, or not
premium enough.

This loop is for improving an existing surface or module. It is not permission
to add new features.

## Scope Rules

- Improve one feature issue at a time.
- Do not broaden scope during the fix.
- Do not edit Pine unless Dean explicitly approves Pine work.
- Do not redesign the site.
- Do not commit or push automatically.

## Process

1. Identify the issue.
   - What feels weak?
   - Where does it appear?
   - Is it visual, wording, logic, QA, mobile, or documentation?

2. Score the issue.
   - Use the scoring model below.
   - If the score is low, park it.

3. Ask Codex to critique.
   - Use `prompts/codex-feature-review.md` for feature direction.
   - Use `prompts/codex-daily-critic.md` for daily project health.

4. Choose one approved fix.
   - Dean selects one issue only.
   - Acceptance criteria must be clear before Claude starts.

5. Ask Claude to implement one scoped fix.
   - Use `prompts/claude-fix-one-issue.md`.
   - Claude must stop after one fix.

6. Run health.

```bash
npm run health
```

7. Manually review UI/chart.
   - Dean approves visually.
   - For indicator work, review TradingView chart behavior manually.

8. Update docs/kanban.
   - Update `docs/kanban.md` if active work changed.
   - Update RC-MAP only if strategy changed.
   - Update `docs/ops/current-loop-status.md` after each loop.

## Scoring Model

```text
Priority Score =
User Impact 25%
+ Product Clarity 20%
+ Revenue/Beta Value 15%
+ Risk Reduction 15%
+ Fix Simplicity 10%
+ Differentiation 10%
+ Automation Value 5%
```

Score each input from 1-5, then normalize to 0-100.

## Score Interpretation

| Score | Decision |
|---:|---|
| 85-100 | Fix now if safe and scoped. |
| 70-84 | Fix soon after current top issue. |
| 50-69 | Park unless it blocks beta or health. |
| 0-49 | Reject or revisit later. |

## Acceptance Criteria

- One visible or measurable issue is improved.
- `npm run health` passes.
- No Pine was edited without approval.
- No new feature was added.
- No broad redesign happened.
- Dean visually approved the result when UI/chart output changed.
- `docs/ops/current-loop-status.md` reflects the latest state.
