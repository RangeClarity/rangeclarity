# RC-1 Chart Feature Spec

**Status:** Planning reference
**Last updated:** 2026-06-25
**Scope:** RangeClarity RC-1 TradingView structural clarity indicator

## Product Principle

RangeClarity should not help users "find trades." RangeClarity should help users decide whether the chart structure deserves attention.

RC-1 is a structure-first clarity indicator. It must not become a signal system, trade optimizer, forecast product, or opportunity scorer.

Every candidate feature must pass the daily operating question:

> Does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

## Market Reference Boundary

ChartPrime Oracle Plus and Prime Oscillators Pro Plus were reviewed as market-reference only.

Do not copy:

- logic
- naming
- visuals
- claims
- implementation
- signal framing
- performance language

The useful lesson from this reference is restraint. ChartPrime is heavily signal-oriented; RC-1 must move in the opposite direction.

## Oracle Plus Anti-Pattern Review

RC-1 should avoid the following patterns.

### Custom Signal Builder

Rejected for RC-1. A custom signal builder turns the product into a configurable trade-cue engine. That conflicts with RC Score as permission, not prediction.

### Auto Maximizer

Rejected for RC-1. Auto-optimization language implies that the system can search for better-performing trade conditions. That creates false confidence and invites performance claims.

### Reversal / Top / Bottom Signals

Rejected for RC-1. Reversal, top, and bottom language implies timing. RC-1 can describe stretched context or broken structure, but it must not imply a reversal call.

### Market Prophecy / Forecasts

Rejected for RC-1. Forecast framing is incompatible with market structure clarity. RC-1 should describe current structure, not predict future movement.

### TP/SL Ranges

Rejected for RC-1. TP/SL ranges are trade-management outputs. RC-1 may show key zones and distance to structure, but not target/stop framing.

### Oscillator Confluence

Rejected for RC-1 as opportunity scoring. Oscillator confluence tends to imply a stronger trade case when indicators align. RC-1 should instead ask whether structure is clean, conflicted, stretched, or unclear.

### Peak Seekers

Rejected for RC-1. Peak-seeking features imply timing extremes. RC-1 may classify extension or stretched context, but not identify peaks.

### Entry / Exit Framing

Rejected for RC-1. Entry/exit framing changes the product from chart clarity to trade instruction. Location Context must remain descriptive and non-advisory.

### "Best Performing Signals" Language

Rejected for RC-1. Performance ranking language implies validation against trade outcomes and encourages users to treat the tool as a signal product.

## Minimal Inspiration We Can Safely Keep

These concepts can be considered only when simplified into RC-1 structure language.

| Reference concept | RC-1 simplification | Decision |
|---|---|---|
| ChartPrime Prime Score | RC State, with numeric RC Score possibly hidden by default | Core only if framed as clarity state, not opportunity score |
| Consolidation Score | Chop / Regime | Core as a negative-first context flag |
| Quantum Bands | ATR Extension / Stretched Context | Candidate only as stretch context, not reversal zones |
| Quantum Reactor | Dynamic Trend Structure candidate | Candidate only as structure tracking, not a signal line |
| Prime Ranges | Key Zones / Zone Proximity | Core if used as structural zones, not TP/SL ranges |
| Candle Highlighting | Optional calm trend tint | Candidate / later; default off or very subtle |
| MTF bands/ranges | MTF support/resistance candidate | Candidate / later; not beta default |
| Volume / Money Flow | Liquidity or participation veto | Candidate / later; veto only, not positive score |
| Dynamic trend channel with structure coloring | Structure Corridor / Trend Structure Band | Candidate / Needs Validation; research layer only, not default RC-1 core until tested |

## Feature Classification

### Hard Rejected For RC-1

- Custom Signals
- Auto Maximizer
- Market Prophecy
- Reversal Signals
- Entry / Exit optimization
- TP/SL levels
- Peak Seekers
- Oscillator-based opportunity scoring

### Candidate / Later

- Dynamic Trend Band
- Structure Corridor / Trend Structure Band
- Candle Coloring
- MTF S/R
- Volume Context as veto only

### Core

- RC State
- Trend Structure
- Location Context
- Zone Proximity / Level History
- ATR Extension / Stretched
- Chop / Regime
- Hidden audit trail

## Candidate Feature: Structure Corridor / Trend Structure Band

### Classification

Candidate / Needs Validation.

This is not default RC-1 core and must not be added to Pine until tested.

### Context

A reviewed reference indicator draws a clean dynamic trend channel with color changes based on trend structure. The idea is visually powerful and may fit RangeClarity if treated as structural context only, not as a signal.

### Goal

Evaluate whether RangeClarity should include a calm structural channel or band in a later beta iteration.

### Purpose

- Show whether price is moving inside an orderly structural path.
- Visualize trend cleanliness.
- Show when price is stretched toward the edge of structure.
- Show when the structural path is broken or mixed.
- Help the chart communicate context in under 3 seconds.

### Strict Guardrails

- No buy/sell.
- No entry/exit.
- No TP/SL.
- No arrows.
- No signal labels.
- No "trend changed = action."
- No green/red trading language.
- No prediction framing.

### Approved Language

- Structure Corridor
- Trend Structure Band
- Structural Path
- Orderly / Mixed / Stretched / Broken
- Context only

### Rejected Language

- Trend Signal
- Buy Trend
- Sell Trend
- Entry Channel
- Profit Channel
- Target Channel
- Bullish/Bearish signal

### Visual Rules

- Calm transparent band.
- Minimal line weight.
- Muted colors only.
- Teal = orderly structure.
- Gray = mixed/range-bound.
- Amber = stretched/unstable.
- Muted red = structurally broken/weak.
- No aggressive green/red signal coloring.
- Must not clutter the chart.

### Validation Requirements Before Pine

1. Prototype in Python visual review first.
2. Compare against existing Trend Quality / Chop / Extension lenses.
3. Confirm it reduces visual confusion.
4. Confirm users do not interpret it as a trade signal.
5. Confirm it does not increase false confidence.
6. Keep it hidden or optional until validated.

### Open Questions

- Is the band based on regression channel, pivot channel, ATR channel, or swing structure?
- Does it repaint?
- How does it behave in ranges?
- How does it behave after breakouts?
- Should it be shown only when trend structure is clean?
- Should it be disabled by default in RC-1?

### Recommendation

Do not add this to RC-1 Pine yet.

Add it as a candidate visual layer for research. It may become one of RangeClarity's strongest visual differentiators if it remains structural and non-signal.

## RC-1 Language Rules

Use structure language:

- Clear structure
- Mixed structure
- Unclear structure
- Stretched context
- Choppy regime
- Near key zone
- Far from key structure
- Conflict present
- Weak or broken level history
- Structure Corridor
- Trend Structure Band
- Structural Path
- Orderly / Mixed / Stretched / Broken
- Context only

Avoid signal language:

- custom signal
- reversal signal
- best performing signal
- forecast
- prophecy
- entry
- exit
- target
- stop
- opportunity score
- top seeker
- bottom seeker
- trend signal
- buy trend
- sell trend
- entry channel
- profit channel
- target channel
- bullish/bearish signal

## Sprint Recommendation

The current sprint remains unchanged:

- Workspace Alignment & Path Reconciliation
- Visual Review Tool Verification
- Founder labels `clean_but_capped` only after paths are verified
- Real baseline review
- Visual Review Harness
- Trust spec
- Default dashboard rows
- Exact math for `locMeaning`, `noConflict`, and zone proximity
- labels-50 human review

Do not expand scope because a reference indicator has a visually strong channel.

The lesson from signal-heavy references is restraint.

## RC-1 Guardrail

If a proposed feature helps a user time, optimize, rank, or execute a trade, reject it for RC-1.

If a proposed feature helps a user understand whether the chart structure is clean, conflicted, stretched, choppy, orderly, broken, or unclear, classify it as core or candidate depending on complexity and validation status.
