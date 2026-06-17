# RangeClarity Indicator — Test Plan

How to validate `RangeClarity_Core.pine` is stable, readable, and non-repainting before it goes to users. **Pine cannot be compiled outside TradingView**, so step 0 is the definitive compile check.

## Step 0 — Compile & smoke test (do first)

1. Paste `RangeClarity_Core.pine` into the TradingView Pine Editor → **Add to chart**.
2. Confirm: no compile errors, no runtime errors, dashboard renders, ≤2 zone boxes + ≤2 range lines drawn.
3. Open settings: all Basic + Advanced inputs appear with tooltips and sensible defaults.

## Step 1 — Repainting check (the critical one)

For each test ticker:
1. Note the **Context**, **Confidence**, and zone levels on the live (forming) bar.
2. Wait for the bar to close (or use **Bar Replay**), then re-check after `sensitivity` more bars confirm.
3. **Pass condition:** confirmed outputs do not contradict what was shown as `confirmed`; pivots/zones are not back-dated; alerts only fired on closed bars.
4. Scroll back through history: historical bars should show only confirmed states (no future leakage).

## Step 2 — Category coverage

Test on at least one symbol per row, on 1H / 4H / 1D as noted.

| # | Category | Suggested symbol | TF | Regime label (expected-ish) | Zone quality | Dashboard readable? | False/unclear output? | Repaint concern? | Clutter? | Improvement needed |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Large-cap tech | AAPL / MSFT | 1D | Trend or Range | | | | | | |
| 2 | High-vol growth | TSLA / NVDA | 4H | Expansion / Trend | | | | | | |
| 3 | Index ETF | SPY / QQQ | 1D | Trend / Range | | | | | | |
| 4 | Crypto | BTCUSD / ETHUSD | 4H | Expansion / Chop | | | | | | |
| 5 | Sideways / choppy | a range-bound mid-cap | 1H | Range / Chop → No Edge | | | | | | |
| 6 | Strong trend | a clear uptrend name | 1D | Trend | | | | | | |
| 7 | Breakdown | a recent downtrend | 4H | Trend (down) / Expansion | | | | | | |
| 8 | Breakout | post-consolidation breakout | 1D | Compression→Expansion | | | | | | |
| 9 | Low-volume / ugly | thin small-cap | 1D | Chop → No Edge | | | | | | |

For each, record: ticker, timeframe, regime label, range-zone quality, dashboard readability, any false/unclear outputs, repaint concern, visual clutter, improvement needed.

## Step 3 — "No Edge" sanity

- On the choppy (#5) and ugly (#9) charts, **Context should frequently read No Edge / Wait.** If it keeps inventing directional context in obvious chop, tighten the chop/penalty thresholds.
- On the clean trend (#6) and breakout (#8) charts, confidence should reach Medium/High and Context should reach Strong Context / Breakout Watch at the right moments. If it never does, loosen thresholds.

## Step 4 — Readability & performance

- Can a new user read the verdict in **under 5 seconds**? If not, simplify wording/colors.
- Object count stays within limits across long histories (no "max objects" warning).
- No noticeable lag when scrolling or switching symbols.

## Step 5 — Alerts

- Create each of the six alerts; confirm messages are descriptive (no buy/sell wording) and fire only on bar close.

## Step 6 — Edge cases

- Brand-new / low-history symbol: should degrade gracefully to No Edge, not error or draw bogus zones.
- Very high timeframe (1W): pivots sparse — verify it still reads sensibly or says No Edge.
- Theme = Light and each dashboard position option render correctly.

## Sign-off checklist

- [ ] Compiles with no errors/warnings in TradingView
- [ ] No repainting of confirmed outputs (Step 1 passed on all symbols)
- [ ] ≤4 drawn objects + 1 table at all times
- [ ] "No Edge / Wait" appears appropriately in chop and is not buried
- [ ] No buy/sell/profit/win-rate wording anywhere (UI + alerts)
- [ ] Readable in <5 seconds; defaults are strong out of the box
- [ ] Tested across all 9 categories and 1H/4H/1D
