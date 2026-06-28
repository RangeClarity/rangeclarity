# RangeClarity — Master Vision

Status: planning. This is the north-star document for the full RangeClarity system. It sits above the indicator-level docs (`rangeclarity_sr_core_v1_architecture.md`, `rangeclarity_trendline_channel_layer_design.md`) and the existing planning surface (`project-state.md`, `decisions.md`, `kanban.md`). Source-of-truth hierarchy in `CLAUDE.md` still applies.

## What RangeClarity is
RangeClarity is a **market-structure clarity system** in two connected parts:

1. **The Indicator** — a clean TradingView Pine overlay that shows, in a few seconds, the structure of a single chart: support/resistance as Local / Key / Strong levels, a Soft Structure Channel, market bias (Bullish / Bearish / Sideways / Unclear), and distance to the levels that matter. No buy/sell, no predictions.
2. **The Website Brain** — the intelligence layer that runs the same structural logic across many symbols and watchlists, scores and ranks them by *clarity*, stores events over time, and tells the user *which charts are worth their attention and why*.

The product philosophy is constant across both: **simple visual, complex engine, clear context.** The indicator is the lens; the brain is the radar.

## The problem it solves
Traders and investors drown in charts and noise. The common failure isn't a lack of indicators — it's a lack of **clarity about structure**: where am I in the range, is this a clean trend or chop, is price near a level that matters, and which of my 50 watchlist names is actually at a decision point today? Existing tools either oversimplify (one moving average) or overwhelm (RSI + MACD + VWAP + order blocks + FVG + liquidity all at once), and most quietly imply buy/sell calls.

RangeClarity answers four plain questions, per chart and across a watchlist:
- What is the structure (bias)?
- Where are the levels that matter (Local / Key / Strong S/R, channel boundaries)?
- How far is price from them?
- Which charts are interesting right now, and why?

## Who it is for
- **Self-directed swing traders / investors** who think in structure and levels, not signals.
- **Watchlist-driven users** tracking 20–200 symbols who need a daily "what changed / what's at a level" radar.
- **Discretionary traders** who want a clean second opinion on structure without a black-box signal.
It is explicitly **not** for users seeking automated entries/exits or prediction calls.

## Why it is not just an indicator
An indicator can only describe the chart you're looking at. The value compounds when the same engine watches *every* chart you care about and surfaces the few that matter:
- One chart → "this is the structure."
- Many charts → "these 6 of your 120 names are at Local/Key/Strong levels or testing a channel boundary, ranked by clarity, with a one-line reason each."
That cross-sectional ranking, the historical event memory, and the daily brief are things a Pine script fundamentally cannot do. The indicator is the visible 10%; the brain is the 90% that creates the workflow and the retention loop.

## How the indicator and the brain work together
They share **one structural language** (`rangeclarity_shared_signal_schema.md`) so a level called "Key S" on the chart is the same "Key S" in the scanner and the daily brief. Two sync paths:
- **Computed independently, reconciled:** the website re-implements the canonical scoring core (from the indicator's tested spec) over historical OHLCV so it can scan symbols the user isn't actively charting. Parity is enforced by shared test vectors.
- **Event-driven from the chart:** TradingView alerts/webhooks emit schema-shaped events (break above channel, entered Strong S, etc.) into the brain so live chart events feed the Market Room and history.
The brain ranks and explains; the indicator confirms and visualizes. Round-trip: brain surfaces a name → user opens it in TradingView → the indicator shows the identical structure.

## What makes it differentiated
- **Clarity, not signals** — a deliberately narrow, premium scope competitors don't hold (they chase feature counts).
- **One shared structural schema** across chart and web — consistency users can trust.
- **Ranking by clarity** — a "which charts deserve attention" radar, not another oscillator.
- **Explanations** — every surfaced chart comes with a plain-language *why* (Hermes/AI layer), never advice.
- **Restraint as a feature** — no RSI/MACD/VWAP/OB/FVG/liquidity pile-up; the cleanliness is the brand.

## What we intentionally avoid
- Buy/sell signals, entries/exits, take-profit/stop levels, "target/defense" wording.
- Prediction or probability-of-direction language.
- A noisy indicator pack or a generic multi-tool script.
- Investment-advice framing anywhere (chart, scanner, brief, marketing). RangeClarity *describes structure*; the user decides.
- Overbuilding the SaaS before the indicator + scanner + Market Room loop is validated with real users.

## One-sentence pitch
RangeClarity turns a wall of charts into a short, ranked, explained list of the structures worth watching — a clean map on the chart, a clarity radar behind it.
