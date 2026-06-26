# Module: Ops / Feedback Loops

> Living architecture doc — **documentation only**. No behavior change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md) · detail:
> [feedback-loops](../../ops/feedback-loops.md).

## Purpose
Make the project **easy and fast to test** — catch problems in seconds, before they reach git or users.
This module protects RangeClarity's #1 risk: shipping **false confidence**.

## Public interface
- `npm run health` — **fast** gate: `typecheck → lint → test`. Run before every small change.
- `npm run verify` — **full** gate: `health → build`. Run before a deploy / major handoff.
- Plus `test:unit` (Vitest, opt-in) · `test:e2e` (Playwright, opt-in) · `ops:status`.

## Hidden complexity
The dependency-free test runner (`scripts/test/run-tests.mjs`) with the **copy guardrail** (negation-aware
banned-language check) and the **label-schema guardrail**; `rc-loop.mjs`; `ops-status.mjs`; and the new
Python golden test (`research/rc1_ultimate_offline_indicator/test_rc_scoring_facade.py`).

## Owns
Typecheck · lint · unit/e2e wiring · banned-language + label guardrails · daily validation commands · status scripts.

## Must not own
Product internals — Ops only **inspects**, it never changes behavior.

## Subfunctions
`run-tests.mjs` (copy + label checks) · `ops-status.mjs` · `rc-loop.mjs` · `package.json` scripts ·
`test_rc_scoring_facade.py` (golden, `RC_GOLDEN_FULL=1` scales to the 1,767-window baseline).

## Dependencies
The whole repo (it inspects everything) · no product dependency.

## Dependent modules
**Everything** — Ops is the gate every other module passes through before a commit.

## Current leaks
`health`/`verify` meaning was once inverted (now fixed: health = fast, verify = full). `test:unit` /
`test:e2e` are deliberately opt-in and **not** wired into `health`/`verify` (so they stay green without extra deps).

## Risk level
**LOW** — and that is the goal. A deep, inspection-only module that changes no behavior.

## Tests required
Ops **is** the test layer; keep it green. Add the Python golden test to the routine: run it before any change
inside the scoring package.

## Agent / skill to use
`/module-awareness Ops` · the [daily-design-loop](../../ops/daily-design-loop.md).

## Next approved task
Document the `RC_GOLDEN_FULL` golden test in the daily routine (added this session). Keep `health` green.

## Blocked work
None — Ops is the safe layer. Vitest/Playwright remain opt-in until installed.
