# RangeClarity Module Audit

Audit of every candidate module against the MVP promise: *simple surface, complex engine, no noise, no repaint, easy to explain.* Each is classified **KEEP · SIMPLIFY · CUT · MOVE TO FUTURE · RESEARCH ONLY**.

Context: there was no prior working Pine code (only a placeholder), so this audit is forward-looking — it defines what made it into the stable core and what was deliberately held back.

## Core modules (in the stable build)

| Module | Status | Reason | Risk | Recommendation | Final decision |
|---|---|---|---|---|---|
| Regime (ATR percentile + ADX) | KEEP | First filter; cheap, robust, explainable | Label flicker if computed intrabar | Confirm on close; ≤5 labels | **KEEP** |
| Structure (pivots → bias, BOS, failed breakout) | KEEP | Skeleton of the read | Pivot lag; over-labeling | Track last 2 highs/lows only; honest lag | **KEEP** |
| Support/Resistance zones | SIMPLIFY → KEEP | Essential, but easy to clutter | Object-limit blowup; too many lines | Nearest support+resistance only (≤2 boxes), reuse objects | **KEEP (simplified)** |
| Momentum (RSI + EMA slope + ADX, confirm-only) | KEEP | Confirms/contradicts structure | Drift into "signals" | Confirm-only; never an entry trigger | **KEEP** |
| Confidence (weighted + penalties) | KEEP | The premium, explainable meta-signal | Fake precision; correlated inputs | Whole numbers; explicit named penalties | **KEEP** |
| No-Edge / Decision context | KEEP | The differentiator | Being ignored / buried | First-class output with reason string | **KEEP** |
| Dashboard table | KEEP | The entire UI | Visual clutter | One table, 9 rows, color-coded | **KEEP** |
| Descriptive alerts | KEEP | Useful, low-risk | Intrabar spam; advice-like wording | Confirmed-gated; no buy/sell words | **KEEP** |

## Held back (not in MVP)

| Module | Status | Reason | Final decision |
|---|---|---|---|
| Liquidity sweeps overlay | MOVE TO FUTURE | Valuable but adds objects + repaint risk; needs careful confirm logic | **V1.x** |
| Volume / RVOL context row | MOVE TO FUTURE | Good signal, but keep MVP surface minimal first | **V1.x** |
| Order blocks / FVG arrays | RESEARCH ONLY | High clutter, frequent repaint in public versions | **Research** |
| CVD / volume-delta approximation | RESEARCH ONLY | Heavy, approximate on most feeds | **Research** |
| Multi-timeframe regime confirm | MOVE TO FUTURE | Strong idea; adds `request.security` + lookahead care | **V2** |
| Divergence detection | RESEARCH ONLY | High false-positive rate; would dilute trust | **Research** |
| Historical-analog engine | MOVE TO FUTURE | Big build; not core | **Later** |
| Multi-symbol / watchlist scan | MOVE TO FUTURE | Belongs in product layer, not the indicator | **Later** |
| AI explanation text | MOVE TO FUTURE | Out of Pine scope; content layer | **Later** |
| Backtesting / strategy() conversion | CUT (for now) | Invites win-rate/profit framing we reject | **Not now** |

## Things explicitly CUT to protect the promise

- **Buy/sell signals, entries, targets, win-rate stats** — cut permanently. Antithetical to the product.
- **Extra oscillator panels** — cut; regime needs only ATR-pct + ADX.
- **Per-pivot line spam** — cut; nearest zones only.
- **Intrabar state changes for the verdict** — cut; confirmed-bar only.

## Net result

The stable core = exactly the six promised modules + dashboard + descriptive alerts. Everything that could add noise, clutter, repaint risk, or "signal-bot" framing was moved to future or research, not shipped.
