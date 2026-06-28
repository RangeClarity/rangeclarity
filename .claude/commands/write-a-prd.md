---
description: Turn an idea into a compact PRD before implementation.
argument-hint: [idea / short-name]
---

# /write-a-prd

Turn "$ARGUMENTS" into a compact, decision-ready PRD. Write it to
docs/prd/YYYY-MM-DD-<short-name>.md (use today's date and a kebab-case short name).

## PRD sections
Title - Problem - User - Context - Goals - Non-goals - Requirements - Module ownership (which deep
module owns this; see /module-awareness) - User experience - Data requirements - Test requirements -
Guardrails - Success criteria - Rollout plan - Open questions.

## RangeClarity guardrails (always include verbatim in the PRD)
- No signals. No prediction. No buy/sell/entry/exit/profit language.
- No false confidence; HighClarity must remain rare.
- Any scoring change requires a before/after vs the frozen 1,767-window baseline.
- Pine changes are blocked unless explicitly approved (conviction must be GREEN).
- No commit/push from this command.

Keep it short. Do not write product code here.
