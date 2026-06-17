# No-Edge Patterns

The most important and most under-built module in retail indicators. Distilled concepts for detecting when there is **no edge** and the honest output is WAIT / NO EDGE.

## The core question

"Is doing nothing the best move right now?" Most tools never say "wait." Saying it well is RangeClarity's differentiator and trust-builder.

## When there is likely no edge

- **Signals conflict.** Structure says up, momentum says down (or vice versa). Conflict = no clean read.
- **Mid-range price.** Price in the middle 40–60% of its range with no breakout → poor reward-to-risk in either direction.
- **Messy volatility.** Volatility shock (ATR pct very high) or erratic chop where ADX is low and structure is mixed.
- **Low confidence.** The weighted/penalized confidence score falls below a floor.
- **Extension.** Move is far extended from mean → chasing has poor R/R ("Avoid Chase").
- **Compression unresolved.** Coiled but not yet broken → "Wait," not a trade.
- **Thin / unclear data.** No confirmed pivots yet, or zones can't be established → don't invent a level.

## Design principles

- **"No edge" must be repaint-safe by design.** When inputs disagree or data is thin, output No Edge rather than fabricating structure. This can never look wrong in hindsight because it asserts nothing.
- **Distinguish flavors of inaction** so it's informative, not just blank:
  - `No Edge` — conflicting / messy / low confidence.
  - `Wait` — compressed or mid-range; let it resolve.
  - `Avoid Chase` — extended; the move already happened.
- **Pair the verdict with a one-line reason** ("Signals conflict", "Mid-range — poor R/R") so the user trusts and learns from it.

## Mapping to a clean output (what RangeClarity does)

The verdict engine checks these conditions in priority order and emits one of:
`No Edge` · `Wait` · `Avoid Chase` · `Breakout Watch` · `Pullback Zone` · `Strong Context` · `Watch` — each with a short reason string. Crucially, **no buy/sell wording ever appears.**

## Pitfalls / what NOT to copy

- Don't bury "no edge" — make it a first-class, prominent state.
- Don't let a single strong module force action when others disagree; conflict wins.
- Don't replace "no edge" with a weak directional guess to seem useful. The honesty *is* the usefulness.

## Open ideas to test later

- Track how often each no-edge reason fires per instrument (calibration).
- Surface "time in no-edge" stats in the weekly review content.
