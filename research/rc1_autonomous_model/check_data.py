"""Data-readiness checker. Reports per-symbol bar counts, schema issues, and which
required symbols are missing. Outputs the exact format when no data is present.
NO data is fetched or fabricated."""
from __future__ import annotations
import os
import glob
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
OHLCV = os.path.join(HERE, "data", "ohlcv")
MIN_BARS = 260
SCHEMA = ["date", "open", "high", "low", "close", "volume"]
UNIVERSE = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "TSLA", "META", "AMZN", "KO", "XOM",
            "JPM", "GE", "F", "AMD", "AVGO", "CVX", "INTC", "JNJ", "WMT", "DIS"]

FORMAT = ("Exact CSV per symbol -> data/ohlcv/<SYMBOL>.csv\n"
          "  header: symbol,date,open,high,low,close,volume\n"
          "  date ISO YYYY-MM-DD ascending daily; high>=low; volume int; >= 260 bars.")


def check():
    os.makedirs(OHLCV, exist_ok=True)
    files = [f for f in sorted(glob.glob(os.path.join(OHLCV, "*.csv")))
             if not os.path.basename(f).startswith("_")]
    print(f"[check] dir: {OHLCV}")
    print(f"[check] csv files found: {len(files)}")
    if not files:
        print("[check] NO DATA. Provide CSVs in the format below, then re-run.\n")
        print(FORMAT)
        missing = ", ".join(UNIVERSE)
        print(f"\n[check] required symbols missing (all {len(UNIVERSE)}): {missing}")
        return False
    rows, ok_syms = [], []
    for f in files:
        sym = os.path.splitext(os.path.basename(f))[0].upper()
        try:
            df = pd.read_csv(f)
            df.columns = [c.lower() for c in df.columns]
            missing_cols = [c for c in SCHEMA if c not in df.columns]
            n = len(df)
            nan = int(df[[c for c in SCHEMA if c in df.columns]].isna().sum().sum())
            bad_hl = int((df["high"] < df["low"]).sum()) if {"high", "low"} <= set(df.columns) else -1
            status = ("OK" if (not missing_cols and n >= MIN_BARS and nan == 0 and bad_hl == 0)
                      else "REJECT")
            if status == "OK":
                ok_syms.append(sym)
            rows.append(dict(symbol=sym, bars=n, missing_cols=";".join(missing_cols) or "-",
                             nans=nan, high_lt_low=bad_hl, status=status))
        except Exception as e:
            rows.append(dict(symbol=sym, bars=0, missing_cols=f"ERR:{e}", nans=-1,
                             high_lt_low=-1, status="REJECT"))
    rep = pd.DataFrame(rows)
    print(rep.to_string(index=False))
    miss = [s for s in UNIVERSE if s not in {r["symbol"] for r in rows}]
    print(f"\n[check] usable symbols: {len(ok_syms)} / {len(UNIVERSE)} required")
    if miss:
        print(f"[check] missing from universe: {', '.join(miss)}")
    return len(ok_syms) > 0


if __name__ == "__main__":
    check()
