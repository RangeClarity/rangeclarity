# RangeClarity — Quick Start

A 5-minute beginner guide. For the full reference, see `RANGECLARITY_INDICATOR_USER_GUIDE.md`.

## What it is

RangeClarity is a TradingView chart-structure dashboard. It tells you the market's **regime**, **structure**, **support/resistance**, **range position**, **momentum**, a **confidence** score, and — honestly — when there's **no edge** and waiting is better.

It is **not** a buy/sell signal bot, **not** financial advice, and does **not** guarantee profits. It gives you context; you make the decisions.

## How to install

1. TradingView → **Pine Editor**.
2. Paste the contents of `pine/rangeclarity_ultimate_core.pine`.
3. **Save**, then **Add to chart**.
4. (Optional) Set Theme and Dashboard position in settings. Keep other defaults.

## How to read the dashboard

| Row | Read it as |
|---|---|
| **Regime** | What kind of market: Trend, Range, Compression, Expansion, Chop. |
| **Structure** | The chart's shape: Bullish, Bearish, Neutral, Range-bound, Breakout attempt, Failed breakout. |
| **Range Pos.** | Where price sits: 0% = support, 100% = resistance (with a `[####------]` meter). |
| **Momentum** | Strong, Improving, Fading, Extended, Weak, Neutral. |
| **Zone Str.** | Strength (0–100) of the nearest support/resistance zone. |
| **Confidence** | How much the modules agree (High/Medium/Low/Conflicting) — not a profit probability. |
| **Context** | The summary call (see labels below). |
| **Note** | One-line reason for the Context. |
| **State** | `forming` (live, can change) or `confirmed` (final). |

On the chart: **green box** = nearest support, **red box** = nearest resistance, **grey dashed lines** = range bounds.

## What each Context label means

- **Watch** — developing; observe.
- **Structure Not Clear** — compressed or mid-range; an unclear location to read.
- **No Edge** — not clean enough to read; stand aside.
- **Stretched** — the move is over-extended from its mean.
- **Coiled** — compression near a boundary.
- **Retest Area** — a trend is pulling back into structure.
- **Strong Context** — modules aligned (a clean read, not a guarantee).
- **Risk Elevated** — volatility shock; conditions are unstable (context only).

None of these is "buy" or "sell."

## What "No Edge" means

No Edge means conditions aren't clean enough — price is mid-range, signals conflict, momentum is extended, or the market is choppy. **It is a feature, not a failure.** Waiting is often the smartest move.

## 5-step workflow

1. Start with your own watchlist or idea.
2. Check **Regime** and **support/resistance**.
3. Check **Range Position** and **Momentum**.
4. Check **Confidence**. If **No Edge / Wait**, wait.
5. If the context is constructive, continue your **own** research and risk planning — then log your decision.

## Disclaimer

RangeClarity is an educational and analytical chart-structure tool. It is not financial advice, does not guarantee profits, and does not tell you what to buy or sell. Do your own research and manage your own risk.
