"""Data loader. Resolution: local CSV -> Alpaca (if creds) -> synthetic fixtures.

NEVER fabricates 'real' results: synthetic data is clearly tagged source='synthetic'
and is for PIPELINE VERIFICATION ONLY, not validation evidence.
No live/streaming data; historical confirmed bars only.
"""
from __future__ import annotations
import os
import numpy as np
import pandas as pd

COLS = ["date", "open", "high", "low", "close", "volume"]


def _alpaca_available(cfg) -> bool:
    keys = cfg["data"].get("alpaca_env", [])
    return all(os.environ.get(k) for k in keys)


def resolve_source(cfg) -> str:
    prov = cfg["data"].get("provider", "auto")
    if prov in ("local", "alpaca", "synthetic"):
        return prov
    local = cfg["data"].get("local_dir", "")
    if local and os.path.isdir(local) and any(f.endswith(".csv") for f in os.listdir(local)):
        return "local"
    if _alpaca_available(cfg):
        return "alpaca"
    return "synthetic"


def _load_local(symbol, cfg):
    path = os.path.join(cfg["data"]["local_dir"], f"{symbol}.csv")
    if not os.path.isfile(path):
        return None
    df = pd.read_csv(path)
    df.columns = [c.lower() for c in df.columns]
    return df[[c for c in COLS if c in df.columns]].dropna().reset_index(drop=True)


def _load_alpaca(symbol, cfg):
    # Only used if creds present AND the package is reachable. Historical bars only.
    try:
        from alpaca.data.historical import StockHistoricalDataClient  # type: ignore
        from alpaca.data.requests import StockBarsRequest  # type: ignore
        from alpaca.data.timeframe import TimeFrame  # type: ignore
    except Exception:
        return None
    try:
        client = StockHistoricalDataClient(os.environ["ALPACA_API_KEY_ID"],
                                           os.environ["ALPACA_API_SECRET_KEY"])
        tf = TimeFrame.Day if cfg["data"].get("timeframe", "1D") == "1D" else TimeFrame.Week
        req = StockBarsRequest(symbol_or_symbols=symbol, timeframe=tf, limit=cfg["data"]["bars"])
        bars = client.get_stock_bars(req).df
        bars = bars.reset_index()
        out = pd.DataFrame({
            "date": bars["timestamp"], "open": bars["open"], "high": bars["high"],
            "low": bars["low"], "close": bars["close"], "volume": bars["volume"]})
        return out.dropna().reset_index(drop=True)
    except Exception:
        return None


def _synthetic(symbol, cfg):
    """Deterministic per-symbol OHLCV exercising EVERY decision path: clean trends,
    clean oscillating ranges (rails get repeat touches -> Tested zones), chop,
    expansion, compression. Fixtures only -- NOT evidence."""
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
            else:  # compression
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
    dates = pd.date_range("2018-01-01", periods=n, freq="B")
    return pd.DataFrame({"date": dates, "open": opens, "high": highs, "low": lows,
                         "close": closes, "volume": volume})


def load_universe(cfg, symbols):
    source = resolve_source(cfg)
    data, used = {}, source
    for s in symbols:
        df = None
        if source == "local":
            df = _load_local(s, cfg)
        elif source == "alpaca":
            df = _load_alpaca(s, cfg)
        if df is None or len(df) < cfg["windows"]["min_bars"]:
            df = _synthetic(s, cfg)
            used = "synthetic" if source != "local" else used
        data[s] = df.reset_index(drop=True)
    return data, used
