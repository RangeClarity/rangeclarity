"""Numeric feature frame (confirmed-bar) + Trend Quality lens."""
from __future__ import annotations
import numpy as np
import pandas as pd
import indicators as ind


def compute_frame(df, params):
    d = df.copy()
    c = d["close"]
    d["atr"] = ind.atr(d, 14)
    d["ma20"], d["ma50"], d["ma200"] = ind.sma(c, 20), ind.sma(c, 50), ind.sma(c, 200)
    d["sl200"] = d["ma200"].diff(10) / d["atr"].replace(0, np.nan)
    d["adx"] = ind.adx(d, 14)
    d["er"] = ind.efficiency_ratio(c, 10)
    d["ci"] = ind.choppiness(d, 14)
    d["overlap"] = ind.overlap_ratio(d, 10)
    n = int(params["donchian_n"])
    dh = d["high"].rolling(n, min_periods=n).max()
    dl = d["low"].rolling(n, min_periods=n).min()
    d["donch_pos"] = (c - dl) / (dh - dl).replace(0, np.nan)
    d["kc_pos"] = (c - d["ma20"]) / (1.5 * d["atr"]).replace(0, np.nan)
    d["atr_contraction"] = d["atr"] / d["atr"].rolling(50, min_periods=20).mean().replace(0, np.nan)
    d["ext_atr"] = (c - d["ma200"]).abs() / d["atr"].replace(0, np.nan)
    _, d["reg_r2"] = ind.reg_slope_r2(c, 20)   # research-only
    return d


def trend_state(row, params):
    ma200_ok = not np.isnan(row["ma200"])
    if np.isnan(row["ma20"]) or np.isnan(row["ma50"]):
        return "Weak", 0, ma200_ok
    up = row["ma20"] > row["ma50"] > row["ma200"]
    dn = row["ma20"] < row["ma50"] < row["ma200"]
    sloped = (not np.isnan(row["sl200"])) and abs(row["sl200"]) >= params["ma_slope_flat"]
    adx_ok = (not np.isnan(row["adx"])) and row["adx"] >= params["adx_trend_min"]
    if (up or dn) and sloped and adx_ok:
        st = "Clean"
    elif not sloped and not (up or dn):
        st = "Range-bound"
    elif up or dn:
        st = "Mixed"
    else:
        st = "Weak"
    return st, (1 if up else -1 if dn else 0), ma200_ok


def structure_dir(highs, lows, t):
    hs = [v for (ci, v) in highs if ci <= t][-2:]
    ls = [v for (ci, v) in lows if ci <= t][-2:]
    if len(hs) < 2 or len(ls) < 2:
        return 0
    if hs[1] > hs[0] and ls[1] > ls[0]:
        return 1
    if hs[1] < hs[0] and ls[1] < ls[0]:
        return -1
    return 0
