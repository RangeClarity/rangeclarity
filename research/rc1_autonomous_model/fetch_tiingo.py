"""Fetch Daily OHLCV from Tiingo EOD into the local cache, normalised to the RC-1 schema.

SECRETS: TIINGO_API_KEY is read from the environment / .env and sent as an Authorization
header. It is NEVER printed, logged, or written to any file. Do not commit .env.

Run locally (where .env + network exist):
    cd research/rc1_autonomous_model
    python3 fetch_tiingo.py
Then:
    python3 check_data.py && python3 run_research.py
"""
from __future__ import annotations
import os
import sys
import datetime as dt
import pandas as pd
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE_RAW = os.path.join(HERE, "data", "ohlcv", "tiingo")
RUN_DIR = os.path.join(HERE, "data", "ohlcv")
UNIVERSE = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "TSLA", "META", "AMZN", "KO", "XOM",
            "JPM", "GE", "F", "AMD", "AVGO", "CVX", "INTC", "JNJ", "WMT", "DIS"]
MIN_BARS = 500
BASE = "https://api.tiingo.com/tiingo/daily/{sym}/prices"


def _load_dotenv():
    # walk up to find .env; load keys into os.environ without printing values
    d = HERE
    for _ in range(6):
        p = os.path.join(d, ".env")
        if os.path.isfile(p):
            try:
                from dotenv import load_dotenv
                load_dotenv(p)
            except Exception:
                for line in open(p):
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            return p
        d = os.path.dirname(d)
    return None


def _validate(df: pd.DataFrame):
    issues = []
    need = ["date", "open", "high", "low", "close", "volume"]
    miss = [c for c in need if c not in df.columns]
    if miss:
        return [f"missing cols {miss}"]
    if df["date"].duplicated().any():
        issues.append("duplicate dates")
    if not df["date"].is_monotonic_increasing:
        issues.append("not sorted")
    if len(df) < MIN_BARS:
        issues.append(f"only {len(df)} bars (<{MIN_BARS})")
    bad = ((df["high"] < df["low"]) | (df["high"] < df["open"]) | (df["high"] < df["close"])
           | (df["low"] > df["open"]) | (df["low"] > df["close"]) | (df[["open", "high", "low", "close"]] <= 0).any(axis=1))
    if int(bad.sum()) > 0:
        issues.append(f"{int(bad.sum())} impossible OHLC rows")
    if df["volume"].isna().any():
        issues.append("missing volume")
    return issues


def fetch_symbol(sym, key, start, end):
    headers = {"Content-Type": "application/json", "Authorization": f"Token {key}"}
    params = {"startDate": start, "endDate": end, "format": "json", "resampleFreq": "daily"}
    r = requests.get(BASE.format(sym=sym), headers=headers, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()
    if not data:
        return None
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    df = df.sort_values("date").drop_duplicates("date").reset_index(drop=True)
    os.makedirs(CACHE_RAW, exist_ok=True)
    df.to_csv(os.path.join(CACHE_RAW, f"{sym}.csv"), index=False)  # full raw+adj cache
    # canonical run file uses ADJUSTED OHLCV for modeling (fallback to raw)
    g = lambda a, b: df[a] if a in df.columns else df[b]
    out = pd.DataFrame({"symbol": sym, "date": df["date"],
                        "open": g("adjOpen", "open"), "high": g("adjHigh", "high"),
                        "low": g("adjLow", "low"), "close": g("adjClose", "close"),
                        "volume": g("adjVolume", "volume")})
    return out


def main():
    _load_dotenv()
    key = os.environ.get("TIINGO_API_KEY")
    if not key:
        print("[tiingo] TIINGO_API_KEY not found in environment/.env.")
        print("[tiingo] Set it in .env (gitignored):  TIINGO_API_KEY=<your key>")
        print("[tiingo] Install deps:  py -m pip install python-dotenv requests pandas numpy pyyaml")
        sys.exit(2)
    start = os.environ.get("TIINGO_START_DATE", "2018-01-01")
    end = os.environ.get("TIINGO_END_DATE", dt.date.today().isoformat())
    os.makedirs(RUN_DIR, exist_ok=True)
    print(f"[tiingo] fetching {len(UNIVERSE)} symbols {start}..{end} (key hidden)")
    ok, rejected = [], []
    for sym in UNIVERSE:
        try:
            out = fetch_symbol(sym, key, start, end)
            if out is None:
                rejected.append((sym, "empty response")); continue
            issues = _validate(out)
            if issues:
                rejected.append((sym, "; ".join(issues))); continue
            out.to_csv(os.path.join(RUN_DIR, f"{sym}.csv"), index=False)
            ok.append((sym, len(out)))
            print(f"  OK   {sym:5s} {len(out)} bars")
        except requests.HTTPError as e:
            rejected.append((sym, f"HTTP {e.response.status_code if e.response else '?'}"))
            print(f"  FAIL {sym:5s} HTTP error (key not shown)")
        except Exception as e:
            rejected.append((sym, type(e).__name__))
            print(f"  FAIL {sym:5s} {type(e).__name__}")
    print(f"\n[tiingo] fetched OK: {len(ok)} | rejected: {len(rejected)}")
    for s, why in rejected:
        print(f"   reject {s}: {why}")
    if not ok:
        print("[tiingo] No data fetched. If this is a sandboxed/offline env, run locally "
              "where .env + network exist. (Do not fabricate data.)")
        sys.exit(3)


if __name__ == "__main__":
    main()
