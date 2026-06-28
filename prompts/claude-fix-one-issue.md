# Prompt — Claude: Fix One Issue (RangeClarity)

Paste this to Claude when you have **one** approved issue (usually from Codex section F).
Claude is the **fixer**: one issue, smallest change, then stop and report. Fill in the issue at the top.

---

```
RangeClarity — fix ONE approved issue only.

THE ONE ISSUE (approved by Dean):
<paste the single issue here — what's wrong, the target file, and the acceptance criterion>

RULES (do not break these):
- Fix ONLY this one issue. Do not touch anything else, even if you spot other problems —
  list those at the end as "noticed, not touched" instead.
- Make the SMALLEST useful change. No broad redesign, no refactor, no re-architecting a page.
- No new features. No new dependencies.
- Do NOT edit the Pine indicator (`pine/rangeclarity_sr_core_v1.pine`) unless this issue text
  explicitly says Dean approved a Pine change.
- Keep brand language: "Simple Chart. Complex Engine. No Signals. No Noise. Just Structure."
  Never introduce: buy/sell, entry/exit, wait, avoid chase, pullback zone, breakout watch,
  conviction, win-rate, profit, prediction, financial advice.
- Do NOT commit or push. Do NOT deploy. Leave git for Dean.

WORKFLOW:
1. Briefly confirm your understanding of the one issue and the single file(s) you'll change.
2. Make the minimal edit.
3. Run `npm run health` (typecheck → lint → qa:rc → build). If it can't fully run in your
   environment, run what you can and say honestly which steps are verified vs not.
4. Show the exact diff (or before/after) of what you changed.

REPORT BACK:
- Files changed (paths) and a one-line description of each change.
- `npm run health` result (green/red; if red, why, and whether it's pre-existing).
- Acceptance criterion: met? yes/no, with evidence.
- "Noticed, not touched": other issues you saw but deliberately left alone.
- Then STOP. Ask: "Approve this, or revise? And what's the next single issue?"
  Do NOT start another fix until Dean answers.
```

---

### Reminder for Dean
- After Claude reports, **look at it** (`npm run dev`, mobile + desktop) before approving — phase 7.
- Approve or reject the *same* issue; don't let a rejection turn into a second, different change.
- Once approved, update `docs/kanban.md` and `docs/ops/current-loop-status.md`, then pick the next single issue.
