"""Data loader: local CSV (this pkg or sibling) -> synthetic (unit/smoke only).
No live fetch here; populate CSVs via rc1_autonomous_model/fetch_tiingo.py. No fabrication
of 'real' results: synthetic is tagged source='synthetic'."""
from __future__ import annotations
import os
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
COLS = ["date", "open", "high", "low", "close", "volume"]


def _find_csv(symbol, cfg):
    for d in cfg["data"]["local_dirs"]:
        p = d if os.path.isabs(d) else os.path.join(HERE, d)
        f = os.path.join(p, f"{symbol}.csv")
        if os.path.isfile(f):
            return f
    return None


def _load_csv(path):
    df = pd.read_csv(path)
    df.columns = [c.lower() for c in df.columns]
    df = df[[c for c in COLS if c in df.columns]].dropna()
    df["date"] = df["date"].astype(str)
    return df.sort_values("date").drop_duplicates("date").reset_index(drop=True)


def _synthetic(symbol, cfg):
    n = int(cfg["data"]["bars"])
    seed = abs(hash(symbol)) % (2**32)
    rng = np.random.default_rng(seed)
    price = 100.0 + (seed % 50)
    closes = []
    cycle = ["uptrend", "range", "downtrend", "range", "chop", "compression", "expansion", "uptrend", "range"]
    i = 0
    while len(closes) < n:
        reg = cycle[i % len(cycle)]
        seg = int(rng.integers(55, 110))
        center = price
        hw = max(2.0, price * rng.uniform(0.03, 0.06))
        target = center + hw
        for _ in range(seg):
            if reg == "uptrend":
                price += rng.normal(0.35, 0.45)
            elif reg == "downtrend":
                price -= rng.normal(0.35, 0.45)
            elif reg == "range":
                price += 0.18 * (target - price) + rng.normal(0.0, 0.3)
                if abs(price - target) < hw * 0.35:
                    target = center - hw if target > center else center + hw
            elif reg == "chop":
                price += rng.normal(0.0, 1.4)
            elif reg == "expansion":
                price += rng.normal(0.0, 2.4)
            else:
                price += rng.normal(0.0, 0.15)
            price = max(1.0, price)
            closes.append(price)
            if len(closes) >= n:
                break
        i += 1
    closes = np.array(closes[:n])
    vol = np.abs(np.diff(closes, prepend=closes[0])) + 0.3
    highs = closes + rng.uniform(0.05, 0.6, n) * vol
    lows = closes - rng.uniform(0.05, 0.6, n) * vol
    opens = np.concatenate([[closes[0]], closes[:-1]])
    volume = rng.integers(1_000_000, 5_000_000, n)
    dates = pd.date_range("2018-01-01", periods=n, freq="B").strftime("%Y-%m-%d")
    return pd.DataFrame({"date": dates, "open": opens, "high": highs, "low": lows,
                         "close": closes, "volume": volume})


def load_universe(cfg, symbols):
    data, found = {}, 0
    for s in symbols:
        f = _find_csv(s, cfg)
        if f:
            df = _load_csv(f)
            if len(df) >= cfg["windows"]["min_bars"]:
                data[s] = df
                found += 1
                continue
        data[s] = _synthetic(s, cfg)
    source = "real" if found == len(symbols) else ("mixed" if found else "synthetic")
    return data, source, found
