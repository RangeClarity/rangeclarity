# Feature feasibility matrix

Pine feasibility / repaint / cost verified against `pine-data-boundaries.md`. Verdict = MVP / Later / Reject for the Pine-first Beta.

| Feature | Required data | Source in TradingView | Pine fn / source | External data? | Pine feasibility | Repaint risk | Cost (req/compute) | User value | Verdict | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| MA50/100/200 | chart close | current chart | `ta.sma` | No | Trivial | None | ~0 | High | **MVP** | core trend structure |
| Daily trend | chart OHLC | current chart | pivots, MA stack | No | Easy | Low (pivot lag, disclosed) | low | High | **MVP** | |
| Weekly confirmation | weekly OHLC | HTF | `request.security("1W",lookahead_off)` | No | Easy | Low if `[1]` closed | 1 call | Med-High | **MVP** | not a screener column |
| Support/resistance zones | pivots, ATR, volume | current chart | pivots + ATR cluster | No | Moderate | Low (confirmed pivots) | med loop | High | **MVP** | ≤2/side, nearest drawn |
| Volume confirmation | chart volume | current chart | RVOL, vol-at-level | No | Easy | None | low | Med | **MVP** | confirm-only |
| Relative strength vs SPY | SPY closes | benchmark | `request.security("AMEX:SPY")` | No | Easy | Low | 1 call | High | **MVP** | RS context |
| Relative strength vs sector | sector ETF | benchmark | `request.security(sectorETF)` | No (map needed) | Moderate | Low | 1 call | Med | **Later** | needs ticker→sector map |
| Broad-market regime | SPY/QQQ MA/ATR | benchmark | `request.security` | No | Easy | Low | shares SPY call | Med | **Later** | optional gate |
| Earnings proximity | earnings date | TV financials | `request.earnings`/financial | Maybe (coverage) | Moderate | Low | 1 call | High | **Later** | gap-risk flag; coverage varies |
| Fundamental growth | revenue/EPS | TV financials | `request.financial` | Maybe | Moderate | Low | calls | Med | **Later** | Minervini-style filter |
| Institutional ownership | ownership data | not reliably in Pine | — | Yes | Low | — | — | Med | **Reject (Pine)** | future web only |
| News sentiment | news feed | not in Pine | — | Yes | None | — | — | Med | **Reject (Pine)** | future web only |
| Options flow | options data | not in Pine | — | Yes | None | — | — | Med | **Reject (Pine)** | future web only |
| AI explanation | reason codes | backend/web | — (post-hoc only) | Yes | None in Pine | — | — | Med | **Later (web)** | never changes score/state |
| Watchlist scanning | plots | Pine Screener | numeric plots 0–9 | No | Limited | n/a | n/a | High | **Later** | screener: plots only, chart TF only |

**Highest value per unit of complexity (MVP):** MA50/100/200, daily trend, S/R zones, volume confirm, weekly confirmation, RS vs SPY. Everything needing external feeds or ownership/news/options is **web-platform-only** and must not be forced into the Pine MVP.
