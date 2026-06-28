"""Location Context lens: Donchian/Keltner position + distance to nearest useful zone,
mid-range / no-man's-land + price-discovery handling."""
from __future__ import annotations
import numpy as np


def location_state(row, zone, params):
    dp = row["donch_pos"]
    near = params["near_zone_atr"]
    lo, hi = 0.5 - params["mid_band"] / 2, 0.5 + params["mid_band"] / 2
    if not zone["has_res"] and not np.isnan(dp) and dp >= 0.98:
        return "Above"
    if not zone["has_sup"] and not np.isnan(dp) and dp <= 0.02:
        return "Below"
    if not np.isnan(zone["sup_d"]) and zone["sup_d"] <= near:
        return "NearSupport"
    if not np.isnan(zone["res_d"]) and zone["res_d"] <= near:
        return "NearResistance"
    if np.isnan(dp):
        return "Mid"
    if lo <= dp <= hi:
        return "Mid"
    return "Upper" if dp > hi else "Lower"
