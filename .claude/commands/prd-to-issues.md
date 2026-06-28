---
description: Convert an approved PRD into structured implementation issues.
argument-hint: [path to an approved PRD]
---

# /prd-to-issues

Read the approved PRD at "$ARGUMENTS" (a docs/prd/*.md) and produce a structured issue plan.

## Each issue includes
Title - Module (owning deep module) - Goal - Scope - Non-goals - Files likely touched -
Acceptance criteria - Tests required - Risk level - Dependencies - Rollback notes.

## Categories
P0 guardrails - P1 implementation - P1 tests - P2 docs - P2 cleanup.

## Rules
- Do NOT create implementation issues for anything the PRD marks as blocked.
- If Linear is available: ASK before creating Linear issues (never auto-create).
- If Linear is not available: write markdown issue files under docs/issues/ (one file per issue).
- No scoring/cap/agree3/Pine/payment issues unless the PRD explicitly approved them AND names a
  before/after baseline test.
- No commit/push.
