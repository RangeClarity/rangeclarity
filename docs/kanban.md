# RangeClarity Kanban

**Last updated:** 2026-06-23  
**Source of truth:** `docs/rangeclarity-master-action-plan.md` (RC-MAP). This file is the active task board derived from RC-MAP until Linear is fully connected.  
**Current priority:** Simple Surface + Location Context first.

## Product Decision

RangeClarity should become the TradingView indicator people keep on the chart every day because it makes structure easier to read without making the chart louder.

The product direction is:

**Simple surface. Complex engine.**

Interpret "most viewed indicator" as:

- Most useful daily chart-reading companion.
- Most screenshot-friendly structure dashboard.
- Most instantly understandable.
- Most calm and professional.
- Not the loudest indicator.
- Not a signal machine.

The next product upgrade is still Location Context / Distance-to-Key-Zone, but it now sits inside a larger build sequence: first lock the simple visible surface, then define the complex engine underneath, then implement only after approval.

## Completed Today

- Completed a product/technical critique of the current indicator screenshot.
- Chose Location Context / Distance-to-Key-Zone Engine as the first meaningful feature upgrade.
- Reframed the build around "simple surface, complex engine."
- Reframed S/R Quality Upgrade as a supporting dependency for Location Context.
- Rejected more generic indicators as the next product move.
- Kept Volume / Liquidity Confirmation parked for MVP.
- Updated the Claude Code next prompt and phase tracker without modifying Pine code.

## Decisions Changed

- **Simple Surface + Location Context is the next priority.**
- **Location Context is the first feature upgrade.**
- **S/R Quality supports Location Context.** It is not the whole visible product move.
- **RC Score stays structure-first.** Volume is not a scoring pillar.
- **Multi-timeframe structure is parked until base-timeframe clarity works.**
- **No signal-like rows, labels, arrows, or prediction language.**

## New Build Phases

### Phase 0 - Product Shape Lock

Goal: define the visible indicator before adding engine complexity.

Acceptance:

- One-sentence product shape is approved.
- Default visible surface is locked.
- Advanced/hidden items are named.
- Rejected visual clutter is named.
- No code.

Default visible surface:

- One compact RC table.
- One clean trend/channel visual.
- Moving-average structure only if it improves orientation.
- Nearest meaningful support/resistance zones only.
- Volume bars may remain chart-native, but no volume engine yet.
- RSI panel is optional/contextual, not a core selling point.

### Phase 1 - Simple Surface Spec

Goal: design the simplest version a trader can understand in 3 seconds.

Acceptance:

- Exact table row order.
- Exact row names.
- Exact state labels.
- Score-vs-state decision.
- Color policy.
- Empty/N/A behavior.
- Screenshot-readability standard.
- No code.

Candidate rows:

- RC Score or State.
- S/R Quality.
- MA Structure.
- Trend Quality.
- Market State.
- Location Context.
- Support / Resistance only if they add clarity.

### Phase 2 - Complex Engine Spec

Goal: define the engine under the simple surface.

Acceptance:

- Engine modules are listed.
- Inputs are defined.
- State labels are defined.
- High-level formulas are documented.
- Edge cases are documented.
- Non-repaint posture is documented.
- No code.

Engine modules:

- Location Context / Distance-to-Key-Zone.
- S/R Quality + Freshness.
- MA Structure.
- Trend Quality.
- Market State / Regime.
- ATR Extension.
- Range Position.
- Optional trend maturity and pullback quality only if deterministic and quiet.

### Phase 3 - Location Context First Implementation Spec

Goal: create the first build-ready feature spec.

Acceptance:

- Distance-to-support logic.
- Distance-to-resistance logic.
- ATR extension logic.
- Position inside active range.
- Distance from EMA/trend reference.
- Clean / Mid-Range / Extended / Near Support / Near Resistance / Structurally Poor states.
- Explanation of how S/R Quality feeds Location Context.
- One dashboard row proposal.
- Validation checklist.
- No code.

### Phase 4 - Pine Architecture Gate

Goal: approve the Pine implementation plan before changing code.

Acceptance:

- Confirmed-bar logic.
- Pivot confirmation rules.
- Object limits.
- Table limits.
- Array limits.
- Performance risks.
- Repaint risks.
- Debug toggles.
- Validation method.
- Rollback plan.
- No code unless founder approves.

### Phase 5 - Controlled Pine Build

Goal: implement the first approved feature without expanding scope.

Acceptance:

- Location Context calculations added.
- One Location Context table row added.
- S/R quality improved only as needed to support Location Context.
- Existing chart visuals remain stable.
- TradingView compile/test pass completed.
- No unrelated modules added.

Requires explicit founder approval before code.

### Phase 6 - Visual Polish And Screenshot QA

Goal: make the indicator feel premium without adding noise.

Acceptance:

- Table spacing is tight.
- Colors are restrained and consistent.
- Labels are readable.
- Zone opacity is clean.
- No label/table overlap.
- No row bloat.
- Works on dark TradingView charts.
- Screenshot QA notes completed.

### Phase 7 - Validation And Beta Readiness

Goal: prove the read is useful before expanding features.

Acceptance:

- 20-chart validation pack completed.
- Beta feedback questions prepared.
- No-edge behavior documented.
- Failure cases documented.
- Launch/beta decision made.

## Board

| Status | Card | Owner | Acceptance |
|---|---|---|---|
| Doing | Phase 0 Product Shape Lock | Product | Visible/default/hidden/rejected surfaces are approved. |
| Ready | Phase 1 Simple Surface Spec | Product/Pine | Table rows, labels, state language, colors, and screenshot standard are defined. |
| Ready | Phase 2 Complex Engine Spec | Product/Pine | Engine modules, inputs, formulas, edge cases, and non-repaint posture are defined. |
| Ready | Phase 3 Location Context Spec | Pine/Product | Build-ready Distance-to-Key-Zone spec and dashboard row proposal are complete. |
| Ready | Phase 4 Pine Architecture Gate | Pine | Implementation plan, limits, repaint risks, debug toggles, and rollback plan are approved. |
| Blocked | Phase 5 Controlled Pine Build | Pine | Blocked until founder explicitly approves code. |
| Ready | Phase 6 Visual Polish + Screenshot QA | Product/Pine | Premium visual QA checklist is ready for post-build review. |
| Ready | Phase 7 Validation + Beta Readiness | Founder/Pine QA | 20-chart validation pack and beta questions are complete. |
| Parked | Volume Context Tiebreaker | Pine/Product | Revisit only after Location Context is trusted by beta users. |
| Parked | Multi-Timeframe Structure Alignment | Pine/Product | Revisit after base-timeframe clarity validates. |
| Rejected MVP | Volume / Liquidity Confirmation Engine | None | Not in MVP. |

## Current Next Work Cards

### 1. Phase 0 Product Shape Lock

Define:

- What the indicator is in one sentence.
- What must be visible by default.
- What must be hidden by default.
- What should never be added.
- What makes a screenshot feel premium.

Approved product shape:

> A clean TradingView dashboard that shows trend structure, key zones, current location, extension, and structure quality without signals.

### 2. Phase 1 Simple Surface Spec

Define:

- Table row count.
- Row order.
- Row names.
- State labels.
- Color rules.
- Score-vs-state decision.
- N/A behavior.
- Screenshot-readability test.

Design rule:

If the row does not improve the 3-second read, it does not belong in default view.

### 3. Phase 2 Complex Engine Spec

Define:

- Location Context.
- S/R Quality.
- MA Structure.
- Trend Quality.
- Market State.
- ATR Extension.
- Range Position.
- Optional trend maturity / pullback quality.

Design rule:

Every complex module must collapse into a simple, explainable row or state.

### 4. Phase 3 Location Context Spec

Define:

- Distance-to-support.
- Distance-to-resistance.
- Range position.
- ATR extension.
- EMA/trend-reference distance.
- Clean / extended / mid-range / near-zone / structurally poor states.
- How poor S/R quality creates insufficient/unclear location.

Recommended first visible row:

```text
Location Context    Extended / Near Upper Range
```

Optional Pro/debug form:

```text
Location Context    42/100    Extended / Near Upper Range
```

### 5. Phase 4 Pine Architecture Gate

Define:

- Confirmed-bar logic.
- Pivot confirmation lag.
- Object reuse.
- Table updates.
- Arrays and lookbacks.
- Debug mode.
- Test symbols.
- Rollback strategy.

No code until this is approved.

## 3-Day Execution Plan

### Day 1 - 2026-06-23

- Lock Phase 0 Product Shape.
- Draft Phase 1 Simple Surface Spec.
- Keep all work in docs/specs unless code is explicitly approved.

### Day 2 - 2026-06-24

- Draft Phase 2 Complex Engine Spec.
- Draft Phase 3 Location Context Spec.
- Review all visible dashboard language for signal-like drift.

### Day 3 - 2026-06-25

- Finish Phase 4 Pine Architecture Gate.
- Prepare 20-chart validation list.
- Decide implementation gate: approve Location Context code pass, defer, or revise spec.

## 7-Day Execution Plan

### 2026-06-23 to 2026-06-29

1. Lock Product Shape.
2. Lock Simple Surface Spec.
3. Lock Complex Engine Spec.
4. Lock Location Context first-build spec.
5. Finish Pine Architecture Gate.
6. Build 20-chart validation pack.
7. If founder approves code, implement Location Context as the only Pine change.

No new modules enter the build queue during this window.

## Validation Checklist

### Simple Surface

- [ ] User can understand the chart read within 3 seconds.
- [ ] Default table has no unnecessary rows.
- [ ] Every visible row has a clear purpose.
- [ ] Colors are restrained.
- [ ] Screenshot looks premium, not like a signal indicator.
- [ ] No buy/sell/entry/exit language.

### Complex Engine

- [ ] Every module maps to a visible structural question.
- [ ] Engine can say "unclear" without forcing a score.
- [ ] Strong trend can still show poor location when price is stretched.
- [ ] Mid-range does not get falsely upgraded.
- [ ] Missing levels produce honest insufficient/unclear output.

### Location Context

- [ ] Dashboard distinguishes clean, extended, mid-range, near support/resistance, and structurally poor states.
- [ ] Location state is explainable in one sentence.
- [ ] S/R quality directly affects location confidence.
- [ ] ATR extension is descriptive, not predictive.
- [ ] No signal-like labels appear.

### Pine Risk

- [ ] No volume-at-price binning.
- [ ] No heavy object growth.
- [ ] Visible zones remain capped.
- [ ] Confirmed pivots only for structure-driving outputs.
- [ ] No new feature creates repaint confusion.

### Beta

- [ ] 5-10 high-fit users identified.
- [ ] Feedback questions focus on trust, clarity, repeatability, and daily usefulness.
- [ ] Users are asked if they would pay only after using the structure read.
- [ ] Feedback distinguishes "looks nice" from "I would open this every day."

## Founder Input Needed

- Approve the new phase sequence.
- Confirm whether V1 should show RC/Location numeric scores or state-only labels.
- Confirm primary validation universe: US equities daily/4H only, or include ETF/index/crypto now.
- Choose the first 20 symbols for validation, or approve the team to propose them.
- Approve whether Pine implementation can start after Phase 4 is complete.
