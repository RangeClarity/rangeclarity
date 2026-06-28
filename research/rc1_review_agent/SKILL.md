---
name: rc-structural-review
description: >
  Advisory assistant for founder review of RC-1 `clean_but_capped` windows. For each window it
  proposes one structural-clarity label (true_broken / stale_zone_false_cap /
  normal_pullback_false_cap / genuinely_unclear / unsure) with a confidence, a short reason, the
  visual evidence that mattered, and whether the Broken-Zone flag looks valid or spurious. Read-only:
  it never changes scoring/caps/agree3, never implements the A/B, never touches Pine, and uses no
  buy/sell/prediction/trade-quality language. Use it to PRE-FILL the founder's review, not replace it.
---

# RC Structural Review Agent (advisory, read-only)

## When to use
After a Real Baseline run has produced `research/reports/visual_review/founder_review_queue.csv`,
when the founder wants a first pass over the `clean_but_capped` windows before labeling them by hand.
This assistant **does not replace human judgment** — it proposes; the founder decides.

## What it does
For every `clean_but_capped` window it recomputes, **read-only**, the diagnostics behind the
`zone = Broken` cap (which support cluster tripped the flag, whether that cluster is the in-play
nearest support or a stale/secondary one, how deep the close went below it, whether price reclaimed
it, how persistent the break was, how old the cluster's pivots are) and applies a transparent
decision tree to propose one label.

## Hard rules (enforced in code)
- No modification of scoring, caps, `agree3`, or any engine config. Reads frozen outputs + bars only.
- No A/B implementation. No Pine. 
- No buy/sell/entry/exit/target/prediction/trade-quality language. Structural clarity only.
- If the evidence does not cleanly separate the cases, it labels `unsure` (or `genuinely_unclear`).
- Confidence is capped at 0.85 by design — this is an assistant, not an oracle.

## Inputs
- `research/reports/visual_review/founder_review_queue.csv` (the `clean_but_capped` rows + audit fields)
- `research/rc1_autonomous_model/data/ohlcv/<SYM>.csv` (bars — same source the charts are drawn from)
- the frozen engine functions in `research/rc1_ultimate_offline_indicator/` (imported read-only)
- founder labels, when filled (for comparison) — read from **either** `research/reports/visual_review/founder_labels_template.csv` **or** `research/reports/visual_review/founder_review_priority.csv` (the priority worktable wins conflicts; `founder_labels.csv` also read if present)

## Run
```bash
python3 research/rc1_review_agent/rc_structural_review_agent.py
```

## Outputs
- `research/reports/visual_review/agent_label_suggestions.csv` — one row per window: `agent_label`,
  `confidence`, `broken_zone_assessment` (valid / spurious / uncertain), `reason`, `visual_evidence`,
  the raw diagnostics, and `founder_label` + `agreement` (populated once the founder labels exist).
- `research/reports/visual_review/agent_vs_founder_comparison.md` — label distribution, and (once
  founder labels exist) an agreement rate + confusion table.

## How to read it
- `broken_zone_assessment` is the most decision-relevant column for the A/B hypothesis: `spurious
  (stale)` / `spurious (pullback)` support "Broken over-rejects"; `valid` argues against it for that case.
- Treat `genuinely_unclear` / `unsure` and any confidence < ~0.6 as "look yourself" — they are the
  windows the assistant could not resolve from daily closes alone.
- The founder's hand labels remain the source of truth. Re-run after labeling to get agreement metrics.

## Registering as a live skill (optional)
This folder is a repo asset. To expose it as a Cowork/Claude skill, register it via
**Settings → Capabilities** (skills cannot be installed from within a chat session). The agent runs
fine as a plain script regardless.
