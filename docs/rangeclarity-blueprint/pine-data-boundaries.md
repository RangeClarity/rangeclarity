# Pine data boundaries (verified vs TradingView / Pine v6 docs, 2026)

The architecture is modelled around what Pine can actually do at runtime. Verify against the cited sources before building.

## Available inside Pine at runtime
- **Current chart OHLCV** (`open/high/low/close/volume`) — direct, no request call.
- **Symbol metadata** — `syminfo.*` (ticker, type, currency, mintick, sector/industry where provided).
- **Other timeframes** (e.g., weekly confirmation) via `request.security(syminfo.tickerid, "1W", …, lookahead=barmerge.lookahead_off)`, consuming the **previous closed** HTF value.
- **Other symbols / benchmarks** (SPY, QQQ, a sector ETF) via `request.security("AMEX:SPY", …)`.
- **TradingView-exposed financials / economic / dividends / splits** via `request.financial`, `request.economic`, `request.dividends/splits` (coverage varies by symbol/market).
- **User-configured inputs** via `input.*`.

## NOT available inside Pine (do not architect around these)
- Calling an arbitrary **RangeClarity REST API**, **WebSocket**, **database**, **live JSON**, or **LLM** from inside Pine. Pine has **no general outbound HTTP fetch**. The canonical score is **not** injected from our server.
- **Pine Seeds** for *new* custom data: **new repository creation is currently suspended** (existing repos still supported). → **Do not** make Pine Seeds the primary data path. [tradingview-pine-seeds/docs]

## Supported outbound direction (one-way)
- Pine `alert()` / `alertcondition()` → **TradingView webhook** → RangeClarity backend. This is the *only* Pine↔backend link, and it is **outbound, event-only, on a paid TradingView plan** (Free = 1 alert; webhooks need Essential+). Model it as a one-way arrow; the backend never feeds Pine.

## Hard limits to design under (Pine v6)
- **Plots:** max 64/script. **Lines / boxes / labels:** default 50, max **500** each (polylines max 100) — **reuse objects, never create per-bar.** Tables don't count against these and are ideal for the dashboard. [TradingView "Lines and boxes"]
- **`request.*` security calls:** keep well under the ~**40** guidance (and for performance). 
- **Pine Screener:** screens on an indicator's **plots** only; **no indicator-on-indicator, no custom timeframes** on the screener. → our weekly-confirmation read works on the chart but **not** as a screener column; screener uses the chart timeframe. [TradingView "Pine Screener key features and requirements"]
- **Alerts by plan:** Free 1 · Essential 20 · Plus 100 · Premium 400 · … Ultimate unlimited; server-side + webhooks on Premium+. [TradingView alerts]

## Consequence for RangeClarity
The Beta must compute **everything from chart OHLCV + a small number of `request.*` reads** (≤ ~4: weekly confirm, SPY, optional sector ETF, optional regime). No backend dependency for the score. The backend is **optional** and **downstream** of Pine alerts.

Sources: [Pine Seeds docs](https://github.com/tradingview-pine-seeds/docs/blob/main/faq.md) · [Lines and boxes limits](https://tw.tradingview.com/pine-script-docs/concepts/lines-and-boxes) · [Pine Screener requirements](https://www.tradingview.com/support/solutions/43000742436-tradingview-pine-screener-key-features-and-requirements/) · [TradingView alerts](https://www.tradingview.com/support/solutions/43000520149-introduction-to-tradingview-alerts/)
