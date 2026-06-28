"""ATR Extension lens: distance from MA200 in ATRs (+ distance from nearest zone in ATRs);
severe-extension flag."""
from __future__ import annotations
import numpy as np


def extension_state(row, zone, params):
    e = row["ext_atr"]
    if np.isnan(e):
        return "Normal", np.nan
    if e >= params["ext_severe_atr"]:
        st = "Severe"
    elif e >= params["ext_extended_atr"]:
        st = "Extended"
    elif e >= params["ext_stretched_atr"]:
        st = "Stretched"
    else:
        st = "Normal"
    return st, float(e)
