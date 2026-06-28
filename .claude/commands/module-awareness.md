---
description: Map the work into RangeClarity's modules and their boundaries BEFORE any code change.
argument-hint: [what you're about to change]
---

# /module-awareness

Create shared architectural awareness before touching code. Reference:
`docs/architecture/rangeclarity-deep-modules.md`.

Core principle: make interfaces smaller and modules deeper. Do not move mess around.

## What to do
Inspect the files relevant to "$ARGUMENTS" (read-only) and classify the work across these modules:
Web UI - Scoring Core - Data Adapters - Research Experiments - Founder Review - Pine/TradingView -
Ops/Feedback Loops - Payments/Access - Docs/Product Planning.

For each module the work touches, state:
- Owns - the logic that legitimately lives here.
- Must not know about - the boundaries it must not cross.
- Public interface - the small, stable entry point.
- Hidden complexity - what stays inside.
- Current leaks - where complexity already crosses the boundary.
- Test boundary - how this module is tested in isolation.
- Risk level - low / medium / high.

## Output format
- Module(s) touched:
- Interface affected:
- Hidden complexity involved:
- Tests required (before/after):
- Files likely safe to touch:
- Files forbidden to touch: (always includes Pine, lib/payments/**, .env*, scoring caps/agree3)

## RangeClarity guardrails (always)
No buy/sell/entry/exit/profit/prediction framing. No scoring/cap/agree3 change. Pine untouched until
conviction is GREEN. Scoring-adjacent changes require a before/after vs the frozen 1,767-window baseline.
Never increase false confidence. No commit/push. Conviction is currently RED.
