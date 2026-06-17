# RangeClarity Ultimate Core — Pine Test Plan

Validates `pine/rangeclarity_ultimate_core.pine` for stability, readability, and non-repainting. **Pine compiles only inside TradingView**, so Step 0 is the definitive compile check.

## Step 0 — Compile & smoke test (do first)

1. Pine Editor → paste the file → **Add to chart**.
2. Confirm: no compile errors/warnings; dashboard renders (10 rows); ≤2 zone boxes + ≤2 dashed range lines; the range meter `[####------]` shows in the Range Pos. row.
3. Open settings: 8 Basic inputs + the Advanced group, all with tooltips and strong defaults.

## Step 1 — Repainting check (critical)

For each symbol: note Context, Confidence, Zone Strength, and zone levels on the forming bar; then use **Bar Replay** to step forward and confirm those values once `confirmed`. Pass = confirmed outputs never contradict; pivots/zones not back-dated; alerts fire only on closed bars. Scroll history: only confirmed states should appear.

## Step 2 — Category coverage matrix

Fill one row per symbol; test on 1D, plus 4H/1H where noted.

| # | Category | Suggested | TF | Regime | Compression score sane? | Zone quality | Dashboard readable? | False/unclear? | Repaint? | Clutter? | Improvement |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Large-cap tech | AAPL / MSFT | 1D | | | | | | | | |
| 2 | High-vol growth | TSLA / NVDA | 4H | | | | | | | | |
| 3 | Index ETF | SPY / QQQ | 1D | | | | | | | | |
| 4 | Crypto | BTCUSD / ETHUSD | 4H | | | | | | | | |
| 5 | Sideways / choppy | range-bound mid-cap | 1H | | | | | | | | |
| 6 | Trending | clear uptrend name | 1D | | | | | | | | |
| 7 | Breakdown | recent downtrend | 4H | | | | | | | | |
| 8 | Breakout | post-consolidation | 1D | | | | | | | | |
| 9 | Low-volume / ugly | thin small-cap | 1D | | | | | | | | |

Record for each: ticker, timeframe, regime output, range-zone quality, dashboard readability, false/unclear outputs, repaint concern, visual clutter, improvement needed.

## Step 3 — Behaviour expectations (sanity)

- **Choppy (#5) / ugly (#9):** Context should frequently read **No Edge / Wait**; Compression score should spike when ranges tighten. If it invents directional context in obvious chop, raise chop/penalty thresholds.
- **Trend (#6) / breakout (#8):** Confidence should reach Medium/High and Context **Strong Context** or **Breakout Watch** at the right moments. If never, lower thresholds or check the strong-close fraction.
- **High-vol (#2) after a big move:** should show **Avoid Chase** (extended) or **Risk Elevated** (volatility shock), not "Strong Context."
- **Zone Strength:** older, multi-touch, high-volume zones should score higher than fresh single-touch ones.

## Step 4 — Readability, performance, visuals

- Verdict readable in **< 5 seconds**; meter legible; ≤6 colors.
- No "max objects" warnings on long history (budget: 1 table + 2 boxes + 2 lines).
- No lag on symbol/timeframe switches.
- Theme = Light and every dashboard position render correctly.

## Step 5 — Alerts

Create all six; confirm messages are descriptive (no buy/sell), and fire only on bar close.

## Step 6 — Edge cases

- New / low-history symbol: should degrade to No Edge, draw no bogus zones, not error.
- Weekly (1W): sparse pivots — still sensible or No Edge.
- Zero/!low-volume instruments: volume confirmation shouldn't break (percentile handles it).

## Sign-off checklist

- [ ] Compiles cleanly in TradingView
- [ ] No repainting of confirmed outputs
- [ ] ≤ (1 table + 2 boxes + 2 lines); range meter renders
- [ ] No Edge / Wait / Risk Elevated appear appropriately
- [ ] No buy/sell/profit/win-rate wording anywhere (UI + alerts)
- [ ] Zone Strength behaves (touches/age/volume influence visible)
- [ ] Readable < 5s; strong defaults; tested across 9 categories + timeframes
