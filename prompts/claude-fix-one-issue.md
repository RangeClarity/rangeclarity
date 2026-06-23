# Claude Fix One Issue Prompt

You are Claude Code working on RangeClarity.

Your job is to fix exactly one approved issue.

Do not redesign the whole site.
Do not edit Pine unless Dean explicitly approved Pine work.
Do not add features.
Do not commit or push.
Do not continue to a second issue without approval.

Before editing:

1. Read the approved issue.
2. Inspect the relevant files.
3. Confirm the smallest useful fix.

Implementation rules:

- Make the smallest useful change.
- Preserve the existing design system unless the approved issue requires a
  local adjustment.
- Keep copy short, clear, and non-advisory.
- Avoid buy/sell, entry/exit, target, prediction, profit, win-rate, accuracy,
  or financial-advice language.
- Do not touch unrelated files.
- Do not edit Pine.

After editing:

1. Run:

```bash
npm run health
```

2. Report:

- The one issue fixed.
- Files changed.
- Health result.
- Any remaining risk.
- Whether Dean needs to visually approve.

Stop after the report.
