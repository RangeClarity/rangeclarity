# Prompt — Indicator Core Upgrade (RangeClarity Pine)

For evolving the TradingView indicator **one disciplined slice at a time**. Planning-first and
**approval-gated**: no Pine edit happens until Dean explicitly approves the slice.

**Hard rules:** no buy/sell/entry/exit/wait/prediction language; volume stays 0% of RC Score; brand =
"Simple Chart. Complex Engine. No Signals. No Noise. Just Structure."; never repaint confirmed reads;
keep object pools bounded; gate every change through `npm run qa:rc` before/after.

```
Propose ONE indicator core upgrade slice (e.g. a single engine module or quality refinement).

Phase 1 — PLAN ONLY (no code):
- What the slice improves and why it matters for structure clarity.
- Exact internals (formulas, states, thresholds) and where they sit in pine/rangeclarity_sr_core_v1.pine.
- Surface impact: at most what changes on the dashboard (prefer hidden engine; one row max if needed).
- Brand check (no forbidden wording), repaint check, drawing-budget check.
- Validation plan: which rc_live_qa.v1 fixtures represent the new output + the symbols to eyeball.
Return the plan and STOP for Dean's approval.

Phase 2 — IMPLEMENT (only after approval):
- Smallest change; no broad refactor; preserve CRLF + balanced parens; verify no NUL.
- Add/update fixtures, run `npm run qa:rc`, fix change-caused findings.
- Report files changed, formulas, what is NOT verified (Pine compiles only in TradingView), and the
  per-symbol manual visual checklist. Do not proceed to the next slice until this one passes visual + QA.
```
