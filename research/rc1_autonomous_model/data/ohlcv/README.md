# Drop real Daily OHLCV here

One CSV per symbol, named `<SYMBOL>.csv` (e.g. `AAPL.csv`, `SPY.csv`).

## Exact schema (header required, lowercase)
```
symbol,date,open,high,low,close,volume
AAPL,2021-01-04,133.52,133.61,126.76,129.41,143301900
AAPL,2021-01-05,128.89,131.74,128.43,131.01,97664900
...
```
- `date`: ISO `YYYY-MM-DD`, ascending, daily bars, no gaps-as-rows.
- `open/high/low/close`: floats, adjusted or raw (be consistent); `high>=low`.
- `volume`: integer (≥0). The `symbol` column is optional (filename is authoritative).
- **Minimum 260 bars** per symbol (MA-200 + scoring windows). Symbols with fewer are rejected.

## Start universe (20)
SPY QQQ AAPL MSFT NVDA TSLA META AMZN KO XOM JPM GE F AMD AVGO CVX INTC JNJ WMT DIS

## Then
```
cd research/rc1_autonomous_model
python3 check_data.py        # readiness report
python3 run_research.py      # real baseline once readiness passes
```
No live/streaming data — historical confirmed bars only. No fabricated rows.
