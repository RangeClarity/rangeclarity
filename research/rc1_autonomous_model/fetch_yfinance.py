"""Yahoo Finance (yfinance) OHLCV downloader -- RESEARCH UNBLOCKER ONLY.

This is a FALLBACK data source. Yahoo/yfinance data is fine for a research baseline but is
NOT the final vendor baseline -- prefer Tiingo or another official provider for final
validation. No API key required. No scoring logic is touched here.

Adjusted vs unadjusted (documented choice):
  We fetch with auto_adjust=False (raw OHLC + 'Adj Close'), PRESERVE the raw bars in
  data/ohlcv/yfinance_raw/<SYM>.csv, and write the canonical modeling file using
  SPLIT/DIVIDEND-ADJUSTED O/H/L/C (back-adjusted via factor = AdjClose/Close), to match the
  Tiingo path which used adjusted OHLC. Volume is raw (yfinance gives no adjusted volume;
  volume is 0% of the RC score, so this is immaterial to scoring).

Run locally (needs internet):
  cd research/rc1_autonomous_model
  python fetch_yfinance.py
Then:
  python check_data.py && cd .. && python compare_baselines.py
"""
from __future__ import annotations
import os
import sys
import datetime as dt
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
RUN_DIR = os.path.join(HERE, "data", "ohlcv")
RAW_DIR = os.path.join(HERE, "data", "ohlcv", "yfinance_raw")
MIN_BARS = 500
UNIVERSE = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "TSLA", "META", "AMZN", "KO", "XOM",
            "JPM", "GE", "F", "AMD", "AVGO", "CVX", "INTC", "JNJ", "WMT", "DIS"]


def _flatten(df, sym):
    if isinstance(df.columns, pd.MultiIndex):
        # ('Open','SPY') -> 'Open'
        df = df.copy()
        df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
    return df


def _validate(df):
    need = ["date", "open", "high", "low", "close", "volume"]
    iss = [f"missing {c}" for c in need if c not in df.columns]
    if iss:
        return iss
    if df["date"].duplicated().any():
        iss.append("duplicate dates")
    if not df["date"].is_monotonic_increasing:
        iss.append("not sorted")
    if len(df) < MIN_BARS:
        iss.append(f"only {len(df)} bars (<{MIN_BARS})")
    bad = ((df["high"] < df["low"]) | (df["high"] < df["open"]) | (df["high"] < df["close"])
           | (df["low"] > df["open"]) | (df["low"] > df["close"]) | (df[["open", "high", "low", "close"]] <= 0).any(axis=1))
    if int(bad.sum()):
        iss.append(f"{int(bad.sum())} impossible OHLC rows")
    if df["volume"].isna().any():
        iss.append("missing volume")
    return iss


def fetch_symbol(yf, sym, start, end):
    raw = yf.download(sym, start=start, end=end, auto_adjust=False, progress=False, threads=False)
    if raw is None or len(raw) == 0:
        return None
    raw = _flatten(raw, sym).reset_index()
    raw.columns = [str(c).lower() for c in raw.columns]
    dcol = "date" if "date" in raw.columns else ("datetime" if "datetime" in raw.columns else raw.columns[0])
    raw = raw.rename(columns={dcol: "date", "adj close": "adjclose"})
    raw["date"] = pd.to_datetime(raw["date"]).dt.strftime("%Y-%m-%d")
    os.makedirs(RAW_DIR, exist_ok=True)
    raw.to_csv(os.path.join(RAW_DIR, f"{sym}.csv"), index=False)   # preserve raw + adjclose
    factor = (raw["adjclose"] / raw["close"]).where(raw["close"] != 0, 1.0)
    out = pd.DataFrame({"symbol": sym, "date": raw["date"],
                        "open": raw["open"] * factor, "high": raw["high"] * factor,
                        "low": raw["low"] * factor, "close": raw["adjclose"],
                        "volume": raw["volume"]})
    return out.dropna().sort_values("date").drop_duplicates("date").reset_index(drop=True)


def main():
    try:
        import yfinance as yf
    except Exception:
        print("[yf] yfinance not installed. Install (research-only fallback):")
        print("    py -m pip install yfinance")
        sys.exit(2)
    start = os.environ.get("YF_START_DATE", "2018-01-01")
    end = (dt.date.today() + dt.timedelta(days=1)).isoformat()  # yfinance end is exclusive
    os.makedirs(RUN_DIR, exist_ok=True)
    print(f"[yf] Yahoo/yfinance FALLBACK fetch {len(UNIVERSE)} symbols {start}..today")
    ok, rejected = [], []
    for sym in UNIVERSE:
        try:
            out = fetch_symbol(yf, sym, start, end)
            if out is None:
                rejected.append((sym, "empty response")); print(f"  FAIL {sym:5s} empty"); continue
            iss = _validate(out)
            if iss:
                rejected.append((sym, "; ".join(iss))); print(f"  REJECT {sym:5s} {iss}"); continue
            out.to_csv(os.path.join(RUN_DIR, f"{sym}.csv"), index=False)
            ok.append((sym, len(out))); print(f"  OK   {sym:5s} {len(out)} bars")
        except Exception as e:
            rejected.append((sym, type(e).__name__)); print(f"  FAIL {sym:5s} {type(e).__name__}")
    print(f"\n[yf] fetched OK: {len(ok)} | rejected: {len(rejected)}  (SOURCE = Yahoo/yfinance fallback)")
    for s, why in rejected:
        print(f"   reject {s}: {why}")
    if not ok:
        print("[yf] No data. If offline/sandboxed, run locally where internet is available. "
              "Do not fabricate data.")
        sys.exit(3)


if __name__ == "__main__":
    main()
