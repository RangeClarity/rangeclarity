# Module: Founder Review

> Living architecture doc — **documentation only**. No behavior/scoring/Pine/payment change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md) · labels source:
> [rc1-founder-review-notes-broken-zone](../../research/rc1-founder-review-notes-broken-zone.md).

## Purpose
Human labeling + visual review. The founder's eyes are the **truth signal** that gates scoring conviction —
nothing is validated GREEN without them.

## Public interface
- **Target:** `loadFounderLabels() -> FounderLabelSet` · `compareAgentToFounder(labels) -> ReviewReport`.
- **Current:** `research/rc1_review_agent/rc_structural_review_agent.py` (read-only agent →
  `agent_label_suggestions.csv`) · `research/rc1_review_agent/build_founder_review.py` (priority CSV +
  anchored charts HTML). Artifacts in `research/reports/visual_review/`.

## Hidden complexity
Label-file precedence (template / priority / `founder_labels`); the priority sort (`PRIORITY` map); the
**5-label taxonomy** + level hierarchy; agreement/confusion computation; calm chart rendering (no
arrows/buy/sell/entry/exit/target).

## Owns
`founder_labels_template.csv` · `founder_review_priority.csv` · `visual_review/*` charts + reports · label
distribution · agreement/confusion tables.

## Must not own
Scoring implementation · web product pages · Pine behavior.

## Subfunctions
`render_fig` · priority-CSV builder · `PRIORITY` map · label-schema enforcement · agent suggestion generation.

## Dependencies
Core Scoring (currently imports **internals** — a leak) · Data Adapters (`load_universe`) · config.

## Dependent modules
Research Experiments (the Broken-Zone A/B depends on these labels) · Ops (the label-schema guardrail).

## Current leaks
1. The review agent imports engine **internals** (`data_loader`, `zones_asof`, `score_window`) instead of a
   stable scoring API.
2. Labels live in a doc note + the agent CSV, not a single unified `FounderLabelSet`.

## Risk level
**MEDIUM.** Label integrity gates every scoring decision, but the module is read-only / advisory.

## Tests required
Label-schema guardrail (`npm run test`: every `founder_label` ∈ {`true_broken`, `stale_zone_false_cap`,
`normal_pullback_false_cap`, `genuinely_unclear`, `unsure`}) · unit test on label-file precedence.

## Agent / skill to use
The RC structural review agent (`rc_structural_review_agent.py`, read-only) · `/module-awareness Founder Review`.

## Next approved task
**Critical path:** founder advances `clean_but_capped` labeling from **15/40 → ≥20**, then re-run
`rc_structural_review_agent.py` and refresh the agreement/confusion tables.

## Blocked work
Broken-Zone A/B (needs labels ≥20 + frozen-baseline compare) · writing labels into
`founder_review_priority.csv` (left blank by founder request).
