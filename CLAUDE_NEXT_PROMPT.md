# Claude Code Next Prompt

You are continuing RangeClarity as Chief Product Architect and Pine Script planning partner.

Current phase: planning/spec only. Do not edit Pine code, landing-page code, backend code, package files, or deployment config unless the founder explicitly approves an implementation pass.

## First Files To Read

- `AGENTS.md`
- `docs/rangeclarity-master-action-plan.md`
- `docs/kanban.md`
- `docs/TASKS.md`
- `RANGECLARITY_MASTER_PLAN.md`
- `RANGECLARITY_CORE_INDICATOR_SPEC.md`
- `RANGECLARITY_ALGORITHM_DESIGN.md`

## Product North Star

Build the indicator people want to keep on the chart every day:

**Simple surface. Complex engine.**

Interpret "most viewed indicator" as:

- Most useful daily chart-reading companion.
- Most screenshot-friendly structure dashboard.
- Most instantly understandable without looking cheap.
- Most professional, calm, and trusted.
- Not the loudest.
- Not the most signal-like.

RangeClarity should feel like the chart understands structure, but the screen should stay extremely simple.

## Compliance And Brand Rules

- No buy/sell language.
- No entry/exit instructions.
- No prediction language.
- No profit, win-rate, accuracy, or "high probability" claims.
- No financial-advice wording.
- No arrows, signal labels, or target labels.
- Use structure, regime, location, extension, range, risk/context, quality, and clarity language only.
- If a feature makes the product louder, more generic, or more signal-like, reject it.

## New Build Phases

Use these phases going forward.

### Phase 0 - Product Shape Lock

Planning only.

Define the visible product in one sentence:

> A clean TradingView dashboard that shows trend structure, key zones, current location, extension, and structure quality without signals.

Lock the maximum default visible surface:

- One compact RC table.
- One clean trend/channel visual.
- Moving-average structure only if it improves orientation.
- Nearest meaningful support/resistance zones only.
- Volume bars may remain chart-native, but no volume engine yet.
- RSI panel is optional/contextual, not a core selling point.

Output:

- Final default visual policy.
- What is visible by default.
- What is hidden or advanced.
- What is explicitly rejected.

No code.

### Phase 1 - Simple Surface Spec

Planning only.

Design the simplest version a trader can understand in 3 seconds:

- RC Score or state row.
- S/R quality row.
- MA Structure row.
- Trend Quality row.
- Market State row.
- Location Context row.
- Support / Resistance rows only if they add clarity.

Decide whether the table shows a numeric score in V1 or uses state-only text.

Output:

- Exact row order.
- Exact row names.
- Exact state labels.
- Color policy.
- Empty/N/A behavior.
- Screenshot-readability standard.

No code.

### Phase 2 - Complex Engine Spec

Planning only.

Define the engine under the simple surface:

- Location Context / Distance-to-Key-Zone.
- S/R Quality + Freshness.
- MA Structure.
- Trend Quality.
- Market State / Regime.
- ATR Extension.
- Range position.
- Optional trend maturity and pullback quality, only if deterministic and quiet.

Each engine component must explain one structural question:

- Where is price?
- Is the trend structure clean?
- Are the nearby zones meaningful?
- Is price stretched?
- Is the market trending, ranging, compressing, or messy?
- Is the current read clean enough to pay attention to, or unclear?

Output:

- Engine modules.
- Inputs.
- State labels.
- High-level formulas.
- Edge cases.
- Non-repaint posture.

No code.

### Phase 3 - Location Context First Implementation Spec

Planning only.

This is still the first actual feature to implement after approval.

Define:

- Distance-to-support logic.
- Distance-to-resistance logic.
- ATR extension logic.
- Position inside active range.
- Distance from EMA/trend reference.
- Clean / Mid-Range / Extended / Near Support / Near Resistance / Structurally Poor states.
- How S/R Quality feeds Location Context.

Output:

- One build-ready Location Context spec.
- One dashboard row proposal.
- One validation checklist.

No code.

### Phase 4 - Pine Architecture Gate

Planning only.

Before any Pine changes, write the implementation plan:

- Confirmed-bar logic.
- Pivot confirmation rules.
- Object limits.
- Table limits.
- Array limits.
- Performance risks.
- Repaint risks.
- Debug toggles.
- Validation method.

Output:

- Pine build plan.
- Test matrix.
- Rollback plan.

No code unless founder approves.

### Phase 5 - Controlled Pine Build

Code only after explicit founder approval.

Build in this order:

1. Refactor only if required.
2. Add Location Context calculations.
3. Add one Location Context table row.
4. Improve S/R quality only as needed to support Location Context.
5. Keep chart visuals stable.
6. Run TradingView compile/test pass.

Do not add unrelated modules during this phase.

### Phase 6 - Visual Polish And Screenshot QA

Code/design only after implementation approval.

Make it feel premium without adding noise:

- Tight table spacing.
- Stable colors.
- Readable labels.
- Clean zone opacity.
- No overlapping labels.
- No row bloat.
- Works on dark TradingView charts.

Output:

- Screenshot QA checklist.
- Before/after notes.
- Any visible compromises.

### Phase 7 - Validation And Beta Readiness

Planning/testing.

Validate on at least 20 charts before calling it beta-ready:

- Clean uptrends.
- Clean downtrends.
- Range-bound charts.
- Messy/no-edge charts.
- Gap/event charts.
- Index/ETF.
- Optional crypto.

Success is not "more signals." Success is:

> A trader can tell within 3 seconds whether current location is clean, extended, mid-range, near support/resistance, or structurally poor.

## Current First Move

Start Phase 0 and Phase 1 now.

Do not jump directly to Pine.

The first concrete upgrade remains:

**Location Context / Distance-to-Key-Zone Engine**

But Claude Code should frame it inside the larger product system:

**simple visible indicator, complex structure engine underneath.**

## What To Park

Do not build yet:

- Complex MTF dashboard.
- AI commentary.
- Volume / Liquidity Confirmation Engine.
- Volume at 15% of RC Score.
- Anchored VWAP automation.
- Relative strength benchmark.
- Alerts.
- Backtesting.
- Signal labels.
- Prediction copy.
- Price targets.
- Extra oscillators.

## Recommended Output Shape

Give the founder a concise planning update:

1. The new phases.
2. What Phase 0 locks.
3. What Phase 1 defines.
4. Why Location Context is still first.
5. What remains parked.
6. The approval gate before Pine code.

End with:

Build first: Simple Surface + Location Context.
Do not build yet: signal features, complex MTF, AI, or volume engine.
Success metric: 3-second structure/location clarity on a clean screenshot.
