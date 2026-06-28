"""Zone Quality lens: confirmed pivots -> clusters -> nearest S/R -> touches, freshness,
broken/stale, width(ATR), de-dup -> zone state."""
from __future__ import annotations
import numpy as np


def _cluster(vals, tol):
    if not vals:
        return []
    vals = sorted(vals)
    out, cur = [], [vals[0]]
    for v in vals[1:]:
        if abs(v - np.mean(cur)) <= tol:   # de-duplication / merge
            cur.append(v)
        else:
            out.append(cur); cur = [v]
    out.append(cur)
    return [(float(np.mean(c)), len(c)) for c in out]


def zones_asof(df, highs, lows, t, atr_t, params):
    close_t = df["close"].iloc[t]
    tol = params["zone_cluster_atr"] * atr_t
    sup = _cluster([v for (ci, v) in lows if ci <= t], tol)
    res = _cluster([v for (ci, v) in highs if ci <= t], tol)
    below = [z for z in sup if z[0] < close_t]
    above = [z for z in res if z[0] > close_t]
    nsup = max(below, key=lambda z: z[0]) if below else None
    nres = min(above, key=lambda z: z[0]) if above else None
    sup_d = abs(close_t - nsup[0]) / atr_t if nsup and atr_t > 0 else np.nan
    res_d = abs(close_t - nres[0]) / atr_t if nres and atr_t > 0 else np.nan
    cand = [z for z in [nsup, nres] if z]
    inplay = min(cand, key=lambda z: abs(close_t - z[0])) if cand else None
    touches = inplay[1] if inplay else 0
    broken = False
    for (m, k) in sup:
        recent = df["close"].iloc[max(0, t - 20):t + 1]
        if (recent < m - params["zone_broken_atr"] * atr_t).any() and (recent > m).any():
            broken = True
            break
    fresh_bars = 999
    if inplay:
        nb = params["near_zone_atr"] * atr_t
        win = df.iloc[max(0, t - params["zone_fresh_bars"]):t + 1]
        mask = (win["low"] <= inplay[0] + nb) & (win["high"] >= inplay[0] - nb)
        if mask.any():
            fresh_bars = t - win.index[mask][-1]
    n_zones = len(sup) + len(res)
    # zone state
    if broken:
        state = "Broken"
    elif n_zones == 0 or (nsup is None and nres is None):
        state = "Insufficient"
    elif touches < params["zone_touch_min"]:
        state = "Weak"
    elif fresh_bars <= 30:
        state = "Fresh"
    elif fresh_bars >= params["zone_fresh_bars"]:
        state = "Weak"            # stale
    else:
        state = "Tested"
    nearest_atr = np.nanmin([x for x in [sup_d, res_d] if not np.isnan(x)]) if cand else np.nan
    return dict(state=state, sup_d=sup_d, res_d=res_d, touches=int(touches),
                fresh_bars=int(fresh_bars), broken=bool(broken), n_zones=n_zones,
                has_sup=nsup is not None, has_res=nres is not None, nearest_atr=nearest_atr)
