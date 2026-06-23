# RangeClarity Visual Planning Artifacts

This folder contains visual operating-map documentation for RangeClarity.

## Files

- `rc-neural-roadmap.md` - human-readable source document for the RC Operating Map.
- `rc-operating-room.md` - human-readable notes for the RC Ops daily command center.
- `/roadmap` - internal Next.js visual page that renders the same operating map.
- `/ops` - internal Next.js command center for daily routine, automation boundaries, and next priorities.
- `../../data/roadmap/rc-neural-roadmap.json` - structured dataset used by the visual page.

## Update Order

1. Update `docs/rangeclarity-master-action-plan.md` first for major decisions.
2. Update `data/roadmap/rc-neural-roadmap.json` when systems, phases, tasks, roles, automations, or scores change.
3. Update `docs/visual/rc-neural-roadmap.md` when the narrative or decision dashboard changes.
4. Update `docs/visual/rc-operating-room.md` when the daily operating model changes.
5. Open `/roadmap` and `/ops` locally and check that the pages still scan cleanly.

## Guardrails

- Do not edit Pine implementation from this planning artifact.
- Do not create a competing roadmap.
- Do not add trading advice, signals, prediction language, or performance claims.
- Keep the visual roadmap calm, practical, and decision-oriented.
