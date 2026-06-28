"""Chop / Regime lens: Choppiness + Efficiency Ratio + overlap + ATR contraction/expansion."""
from __future__ import annotations
import numpy as np


def regime_state(row, params):
    ci, er, adx_v = row["ci"], row["er"], row["adx"]
    contr, ov = row["atr_contraction"], row["overlap"]
    chop = ((not np.isnan(ci) and ci >= params["chop_ci_trigger"])
            or (not np.isnan(er) and er < params["er_chop_thresh"])
            or (not np.isnan(ov) and ov >= 0.6))
    if chop:
        return "Chop"
    if not np.isnan(contr) and contr < 0.7 and (np.isnan(adx_v) or adx_v < params["adx_trend_min"]):
        return "Compression"
    if not np.isnan(contr) and contr > 1.4:
        return "Expansion"
    if not np.isnan(adx_v) and adx_v >= params["adx_trend_min"] and not np.isnan(er) and er >= params["er_chop_thresh"]:
        return "Trend"
    return "Range"
