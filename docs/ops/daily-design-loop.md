# RangeClarity Daily Design Loop

> **Invest in the design of the system every day.** Documentation only — this loop changes no behavior;
> it decides *what* to change next, safely. Pair with [system-map](../architecture/system-map.md) ·
> [module-registry](../architecture/module-registry.md) · [agent-map](../agents/agent-map.md) ·
> [feedback-loops](./feedback-loops.md).

The goal is not to ship a lot. The goal is to make the system a little **deeper** each day: smaller
interfaces, more hidden complexity, fewer leaks — **without increasing false confidence**.

## Daily checklist
Work top to bottom. Stop at the first step that says "blocked" and record why.

1. **Read [`system-map.md`](../architecture/system-map.md).** Re-load the nine modules, the one-way
   dependency direction, and the conviction state (RED today).
2. **Check `git status`.** What is already dirty? (Today: pre-existing web/Pine working-tree drift is
   paused pending founder QA — do not fold it into new work.)
3. **Identify touched modules.** Map every dirty/intended file to exactly one module. If a change spans two
   modules, that is a leak signal — narrow it.
4. **Update the [module registry](../architecture/module-registry.md) if boundaries changed.** New
   interface, closed leak, or new blocked item → update the row now, while it's fresh.
5. **Run `health` if available.** `npm run health` (fast: typecheck → lint → test). For a scoring-package
   change, also run the golden test:
   `python3 research/rc1_ultimate_offline_indicator/test_rc_scoring_facade.py`.
6. **Decide today's *one* design improvement.** Exactly one. Use `/improve-codebase-architecture` to pick
   the highest-safety candidate (e.g. migrate one caller to `score_window_input`; extract `loadCandles`).
7. **Confirm blocked areas.** Re-state what is *not* allowed today: Pine, payment/Lemon, scoring/cap/`agree3`/
   Broken-Zone changes (until labels ≥20 + frozen-baseline A/B), commit/push without approval, Linear writes.
8. **End with the next action.** Write one concrete next step (a command, a file, an approval to request) so
   tomorrow's loop starts already aimed.

## Daily Design Questions
Answer these before committing to today's improvement. If any answer is uncomfortable, pick a smaller change.

- **What module is getting deeper today?** (More logic moves *inside* one module's boundary.)
- **What interface is becoming simpler?** (Fewer parameters, one boring call — e.g. `score_window_input`.)
- **What complexity is being hidden?** (What will callers stop needing to know?)
- **What test protects this?** (Golden test, schema test, copy/label guardrail, Playwright smoke.)
- **What should not be touched?** (Name the frozen surfaces explicitly: Pine, payment, scoring law.)
- **Does this increase false confidence?** (If yes → **stop.** This is the #1 risk.)
- **Does this move us closer to conviction?** (RED → YELLOW → GREEN: labels, baseline compare, validation.)

## PRD / issues workflow (where today's idea goes)
```
idea ─▶ /grill-me ─▶ Needs PRD ─▶ /write-a-prd ─▶ founder approves ─▶ /prd-to-issues ─▶ smallest issue
     ─▶ /module-awareness <area> ─▶ implement smallest safe step ─▶ health ─▶ verify (before handoff)
```
Nothing skips `/grill-me`. Nothing reaches code without `/module-awareness`. Nothing blocked gets an issue.

## Feedback-loop awareness (what each gate protects)
- **`npm run health`** (fast) — types + lint + the **copy guardrail** (no buy/sell/prediction language) +
  the **label-schema guardrail** (founder labels stay in the 5 allowed values). Run constantly.
- **`npm run verify`** (full) — `health` + production build. Before any deploy / major handoff.
- **Golden test** (`test_rc_scoring_facade.py`, `RC_GOLDEN_FULL=1`) — proves the scoring facade is byte-for-byte
  identical to the frozen engine across all **1,767** baseline windows. Run before any scoring-package change.
- **Frozen baseline** — every scoring experiment reports its delta vs Real Baseline v1; no "looks better"
  without numbers.

## Today's one design improvement — good candidates
Pick **one** (smallest first), via `/improve-codebase-architecture`:
1. Migrate `render_visual_review.py` (read-only) to `score_window_input`; re-run the golden test (must stay 1,767 identical).
2. Then `build_founder_review.py`; baseline-critical `full_real_review.py` / `optimizer.py` last.
3. (Later) Extract `loadCandles` out of the scoring package behind the Data Adapter interface.

## Copy-paste daily block
```
[ ] 1 read system-map.md
[ ] 2 git status
[ ] 3 touched modules: ______
[ ] 4 registry updated? y/n
[ ] 5 npm run health  (+ golden test if scoring pkg)
[ ] 6 today's ONE improvement: ______
[ ] 7 blocked confirmed: Pine, payment, scoring/caps/agree3/Broken, commit/push, Linear
[ ] 8 next action: ______
Design Qs: deeper module? simpler interface? complexity hidden? test? do-not-touch? false confidence? closer to conviction?
```
