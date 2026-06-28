# RangeClarity Daily Workflow

> The repeatable daily sequence. Documentation only. Pair with the
> [command-center](./rangeclarity-command-center.md), the [module-status-board](../architecture/module-status-board.md),
> the [agent-map](../agents/agent-map.md), and the [decision-log](./decision-log.md).
> (Sibling: [daily-design-loop](./daily-design-loop.md) — same philosophy, design-investment framing.)

The rule of the day: **one lane, one small safe change, fully gated — and never increase false confidence.**

## Daily sequence
1. **Read the command center.** Re-load conviction, active vs blocked lanes, and today's priority.
2. **Run `git status`.** See what is already dirty (some web/Pine drift is paused — don't fold it into new work).
3. **Identify changed modules.** Map every dirty/intended file to exactly one module on the status board.
4. **Pick one lane only.** Do not spread across modules; a change that spans two modules is a leak signal — narrow it.
5. **Run `/module-awareness <area>`.** Confirm the owner, the interface, the test boundary, and the forbidden files.
6. **Use `/grill-me` if the idea is new.** Pressure-test it → Go / No-go / Needs PRD.
7. **Use `/write-a-prd` if the idea survives.** Compact PRD into `docs/prd/`.
8. **Use `/prd-to-issues` before implementation.** Break the approved PRD into small, buildable issues.
9. **Implement one small issue.** Smallest safe step; behavior-preserving by default.
10. **Run `npm run health`.** Fast gate: typecheck → lint → test. (For a scoring-package change, also run the golden test: `python3 research/rc1_ultimate_offline_indicator/test_rc_scoring_facade.py`.)
11. **Run `npm run verify` only before handoff / deploy.** Full gate: `health` + production build.
12. **Update the command center and the decision log.** Record what moved, what's still blocked, and any decision made.

## Daily Questions
Answer before committing to today's change. If any answer is uncomfortable, choose a smaller change.

- **What module is getting deeper today?**
- **What interface is becoming simpler?**
- **What complexity is being hidden?**
- **What test protects this?**
- **What should not be touched?**
- **Does this increase false confidence?** _(If yes → stop. This is the #1 risk.)_
- **Does this move us closer to conviction?** _(RED → YELLOW → GREEN.)_

## Copy-paste block
```
[ ] 1  read command-center
[ ] 2  git status
[ ] 3  changed modules: ______
[ ] 4  one lane: ______
[ ] 5  /module-awareness
[ ] 6  /grill-me (if new idea)
[ ] 7  /write-a-prd (if it survives)
[ ] 8  /prd-to-issues
[ ] 9  implement ONE small issue
[ ] 10 npm run health  (+ golden test if scoring pkg)
[ ] 11 npm run verify  (only before handoff/deploy)
[ ] 12 update command-center + decision-log
Daily Qs: deeper module? simpler interface? complexity hidden? test? do-not-touch? false confidence? closer to conviction?
```

---

## Recovery sprint focus (2026-06-27)
**One lane per day; land small, reviewable commit groups.** Today's order: (1) verify the Vercel preview for `fd6e760` is green, (2) land the feedback-loop scripts group, (3) keep founder labels moving toward 20+. Daily view: [command-center](./rangeclarity-command-center.md). Do not touch Pine, scoring, caps, `agree3`, or payments; no broad cleanup commits; no commit/push without approval.
