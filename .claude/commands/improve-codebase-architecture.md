---
description: Improve architecture by deepening modules, not broad cleanup. Audit + propose; ask before refactor.
argument-hint: [area, optional]
---

# /improve-codebase-architecture

Improve architecture by making modules DEEPER and interfaces SMALLER - never by broad cleanup or moving
mess around. Reference and keep current: docs/architecture/rangeclarity-deep-modules.md.

## Steps
1. Run /module-awareness for the area "$ARGUMENTS".
2. Identify shallow modules + complexity leaks.
3. Propose small refactor candidates.
4. Rank by safety and testability.
5. ASK before implementing, unless the task is explicitly approved.

## Deep Module rules
- Each module exposes a small, stable interface; complexity lives behind it.
- UI must not know scoring internals.
- Scoring must not know file paths or web UI.
- Data adapters must not decide clarity.
- Research must not mutate production behavior.
- Pine remains a visual companion, not a source of truth.
- Payment/access code stays isolated from product research.

## Per refactor candidate, output
- current problem
- target interface
- hidden complexity
- files involved
- tests needed (incl. before/after vs the frozen baseline if scoring-adjacent)
- blast radius
- safe first step

## Allowed first refactors
docs-only architecture map - test-script normalization - typecheck/lint/test health loop -
extracting pure interfaces ONLY when behavior is unchanged (golden-output verified) -
adding tests around existing behavior.

## Forbidden without explicit approval
scoring changes - cap changes - Pine edits - payment edits - broad file moves - large renames -
deleting untracked files - committing/pushing.
