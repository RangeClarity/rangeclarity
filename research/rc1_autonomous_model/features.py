"""Confirmed-bar feature engine. NO future bars used in any feature (proxies live
elsewhere, evaluation-only). Indicators are public/textbook concepts, original code."""
from __future__ import annotations
import numpy as np
import pandas as pd

def _sma(s, n): return s.rolling(n, min_periods=n).mean()
def _ema(s, n): return s.ewm(span=n, adjust=False, min_periods=n).mean()

def atr(df, n=14):
    h, l, c = df["high"], df["low"], df["close"]
    pc = c.shift(1)
    tr = pd.concat([(h - l), (h - pc).abs(), (l - pc).abs()], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()

def adx(df, n=14):
    h, l = df["high"], df["low"]
    up = h.diff(); dn = -l.diff()
    plus = ((up > dn) & (up > 0)) * up.clip(lower=0)
    minus = ((dn > up) & (dn > 0)) * dn.clip(lower=0)
    tr = pd.concat([(h - l), (h - df["close"].shift()).abs(), (l - df["close"].shift()).abs()], axis=1).max(axis=1)
    atr_ = tr.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    pdi = 100 * plus.ewm(alpha=1 / n, adjust=False, min_periods=n).mean() / atr_.replace(0, np.nan)
    mdi = 100 * minus.ewm(alpha=1 / n, adjust=False, min_periods=n).mean() / atr_.replace(0, np.nan)
    dx = 100 * (pdi - mdi).abs() / (pdi + mdi).replace(0, np.nan)
    return dx.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()

def efficiency_ratio(c, n=10):
    change = c.diff(n).abs()
    vol = c.diff().abs().rolling(n, min_periods=n).sum()
    return change / vol.replace(0, np.nan)

def choppiness(df, n=14):
    a = atr(df, 1).rolling(n, min_periods=n).sum()
    rng = df["high"].rolling(n, min_periods=n).max() - df["low"].rolling(n, min_periods=n).min()
    return 100 * np.log10((a / rng.replace(0, np.nan))) / np.log10(n)

def compute_numeric(df, params):
    d = df.copy()
    c = d["close"]
    d["atr"] = atr(d, 14)
    d["ma20"], d["ma50"], d["ma200"] = _sma(c, 20), _sma(c, 50), _sma(c, 200)
    d["sl20"] = d["ma20"].diff(5) / d["atr"].replace(0, np.nan)
    d["sl200"] = d["ma200"].diff(10) / d["atr"].replace(0, np.nan)
    d["adx"] = adx(d, 14)
    d["er"] = efficiency_ratio(c, 10)
    d["ci"] = choppiness(d, 14)
    n = int(params["donchian_n"])
    dh = d["high"].rolling(n, min_periods=n).max()
    dl = d["low"].rolling(n, min_periods=n).min()
    d["donch_pos"] = (c - dl) / (dh - dl).replace(0, np.nan)  # 0..1
    d["kc_pos"] = (c - d["ma20"]) / (1.5 * d["atr"]).replace(0, np.nan)
    d["atr_contraction"] = d["atr"] / d["atr"].rolling(50, min_periods=20).mean().replace(0, np.nan)
    d["ext_atr"] = (c - d["ma200"]).abs() / d["atr"].replace(0, np.nan)
    return d

def confirmed_pivots(df, w=5):
    h, l = df["high"].values, df["low"].values
    n = len(df)
    highs, lows = [], []  # (confirm_idx, value)
    for i in range(w, n - w):
        seg_h = h[i - w:i + w + 1]; seg_l = l[i - w:i + w + 1]
        if h[i] == seg_h.max():
            highs.append((i + w, h[i]))
        if l[i] == seg_l.min():
            lows.append((i + w, l[i]))
    return highs, lows

def _cluster(vals, tol):
    if not vals:
        return []
    vals = sorted(vals)
    clusters, cur = [], [vals[0]]
    for v in vals[1:]:
        if abs(v - np.mean(cur)) <= tol:
            cur.append(v)
        else:
            clusters.append(cur); cur = [v]
    clusters.append(cur)
    return [(float(np.mean(cl)), len(cl)) for cl in clusters]

def zones_asof(df, highs, lows, t, atr_t, params):
    close_t = df["close"].iloc[t]
    tol = params["zone_cluster_atr"] * atr_t
    sup_vals = [v for (ci, v) in lows if ci <= t]
    res_vals = [v for (ci, v) in highs if ci <= t]
    sup_cl = _cluster(sup_vals, tol); res_cl = _cluster(res_vals, tol)
    below = [(m, k) for (m, k) in sup_cl if m < close_t]
    above = [(m, k) for (m, k) in res_cl if m > close_t]
    n_zones = len(sup_cl) + len(res_cl)
    nearest_sup = max(below, key=lambda x: x[0]) if below else None
    nearest_res = min(above, key=lambda x: x[0]) if above else None
    def dist_atr(z):
        return abs(close_t - z[0]) / atr_t if z and atr_t > 0 else np.nan
    sup_d, res_d = dist_atr(nearest_sup), dist_atr(nearest_res)
    # choose the in-play zone = closest of the two
    inplay, touches = None, 0
    cand = [z for z in [nearest_sup, nearest_res] if z]
    if cand:
        inplay = min(cand, key=lambda z: abs(close_t - z[0]))
        touches = inplay[1]
    # broken: a former support cluster now decisively below price's recent lows
    broken = False
    if nearest_sup and (close_t < nearest_sup[0] - params["zone_broken_atr"] * atr_t):
        broken = False  # support below price is normal
    for (m, k) in sup_cl:
        # price closed below a cluster by margin within last 20 bars => broken support
        recent = df["close"].iloc[max(0, t - 20):t + 1]
        if (recent < m - params["zone_broken_atr"] * atr_t).any() and (recent > m).any():
            broken = True
            break
    # freshness: bars since price last came within near band of in-play zone
    fresh_bars = 999
    if inplay:
        nb = params["near_zone_atr"] * atr_t
        win = df.iloc[max(0, t - params["zone_fresh_bars"]):t + 1]
        near_mask = ((win["low"] <= inplay[0] + nb) & (win["high"] >= inplay[0] - nb))
        if near_mask.any():
            fresh_bars = t - win.index[near_mask][-1]
    return dict(n_zones=n_zones, sup_d=sup_d, res_d=res_d, touches=int(touches),
                broken=bool(broken), fresh_bars=int(fresh_bars),
                has_sup=nearest_sup is not None, has_res=nearest_res is not None)

def _structure_dir(highs, lows, t):
    hs = [v for (ci, v) in highs if ci <= t][-2:]
    ls = [v for (ci, v) in lows if ci <= t][-2:]
    if len(hs) < 2 or len(ls) < 2:
        return 0
    hh = hs[1] > hs[0]; hl = ls[1] > ls[0]; lh = hs[1] < hs[0]; ll = ls[1] < ls[0]
    if hh and hl: return 1
    if lh and ll: return -1
    return 0

def derive_states(df, num, highs, lows, t, params, ablation=None):
    ablation = ablation or set()
    row = num.iloc[t]
    atr_t = row["atr"]
    enough = (t >= params["donchian_n"] + 5) and not np.isnan(atr_t) and len(
        [1 for (ci, _) in highs if ci <= t]) + len([1 for (ci, _) in lows if ci <= t]) >= 4
    ma200_ok = not np.isnan(row["ma200"])
    if not enough or atr_t <= 0:
        return dict(insufficient=True)
    z = zones_asof(df, highs, lows, t, atr_t, params)
    # ---- regime ----
    ci, er, adx_v, contr = row["ci"], row["er"], row["adx"], row["atr_contraction"]
    if (not np.isnan(ci) and ci >= params["chop_ci_trigger"]) or (not np.isnan(er) and er < params["er_chop_thresh"]):
        regime = "Chop"
    elif not np.isnan(contr) and contr < 0.7 and (np.isnan(adx_v) or adx_v < params["adx_trend_min"]):
        regime = "Compression"
    elif not np.isnan(contr) and contr > 1.4:
        regime = "Expansion"
    elif not np.isnan(adx_v) and adx_v >= params["adx_trend_min"] and not np.isnan(er) and er >= params["er_chop_thresh"]:
        regime = "Trend"
    else:
        regime = "Range"
    # ---- trend ----
    stacked_up = row["ma20"] > row["ma50"] > row["ma200"]
    stacked_dn = row["ma20"] < row["ma50"] < row["ma200"]
    sloped = abs(row["sl200"]) >= params["ma_slope_flat"] if not np.isnan(row["sl200"]) else False
    if (stacked_up or stacked_dn) and sloped and not np.isnan(adx_v) and adx_v >= params["adx_trend_min"]:
        trend = "Clean"
    elif regime == "Range" or (not sloped and not (stacked_up or stacked_dn)):
        trend = "Range-bound"
    elif stacked_up or stacked_dn:
        trend = "Mixed"
    else:
        trend = "Weak"
    trend_dir = 1 if stacked_up else (-1 if stacked_dn else 0)
    # ---- extension ----
    e = row["ext_atr"]
    extension = ("Severe" if e >= params["ext_severe_atr"] else "Extended" if e >= params["ext_extended_atr"]
                 else "Stretched" if e >= params["ext_stretched_atr"] else "Normal")
    # ---- location ----
    dp = row["donch_pos"]
    lo, hi = 0.5 - params["mid_band"] / 2, 0.5 + params["mid_band"] / 2
    near = params["near_zone_atr"]
    if not z["has_res"] and dp >= 0.98:
        location = "Above"
    elif not z["has_sup"] and dp <= 0.02:
        location = "Below"
    elif z["sup_d"] is not None and not np.isnan(z["sup_d"]) and z["sup_d"] <= near:
        location = "NearSupport"
    elif z["res_d"] is not None and not np.isnan(z["res_d"]) and z["res_d"] <= near:
        location = "NearResistance"
    elif lo <= dp <= hi:
        location = "Mid"
    elif dp > hi:
        location = "Upper"
    else:
        location = "Lower"
    # ---- zone quality ----
    if z["broken"]:
        zone = "Broken"
    elif z["n_zones"] == 0 or (not z["has_sup"] and not z["has_res"]):
        zone = "Insufficient"
    elif z["touches"] < params["zone_touch_min"]:
        zone = "Weak"
    elif z["fresh_bars"] <= 30:
        zone = "Fresh"
    elif z["fresh_bars"] >= params["zone_fresh_bars"]:
        zone = "Weak"  # stale
    else:
        zone = "Tested"
    # ---- contradiction ----
    sdir = _structure_dir(highs, lows, t)
    contradiction = (trend_dir != 0 and sdir != 0 and trend_dir != sdir)
    # ---- caps triggered ----
    caps = []
    if regime == "Chop" and "chop" not in ablation: caps.append("chop")
    if contradiction and "contradiction" not in ablation: caps.append("contradictory")
    if zone == "Broken" and "zone" not in ablation: caps.append("broken")
    if zone == "Weak" and "zone" not in ablation: caps.append("weakzone")
    if extension == "Severe" and "extension" not in ablation: caps.append("severe")
    elif extension == "Extended" and "extension" not in ablation: caps.append("extended")
    if regime == "Compression" and "chop" not in ablation: caps.append("compression")
    if regime == "Expansion": caps.append("extended")
    if location in ("Above", "Below"): caps.append("pricediscovery")
    if location == "Mid" and zone in ("Insufficient", "Weak") and "location" not in ablation: caps.append("midrange")
    if not ma200_ok: caps.append("lensmissing")
    # ---- agreement (0..6) ----
    clean_trend = trend in ("Clean", "Range-bound")
    loc_meaning = location in ("NearSupport", "NearResistance", "Mid") and zone != "Insufficient"
    zone_real = zone in ("Fresh", "Tested")
    regime_ok = regime in ("Trend", "Range")
    ext_ok = extension in ("Normal", "Stretched")
    agree = sum([clean_trend, loc_meaning, zone_real, regime_ok, ext_ok, ma200_ok])
    if "agreement" in ablation:
        agree = 6  # ablation: pretend always agree
    agree3 = clean_trend and loc_meaning and zone_real
    return dict(insufficient=False, trend=trend, location=location, zone=zone, regime=regime,
                extension=extension, caps=caps, agreement_count=int(agree), agree3=bool(agree3),
                contradiction=bool(contradiction), trend_dir=trend_dir, ma200_ok=ma200_ok,
                ext_atr=float(e), ci=float(ci) if not np.isnan(ci) else None,
                er=float(er) if not np.isnan(er) else None, adx=float(adx_v) if not np.isnan(adx_v) else None,
                touches=z["touches"], fresh_bars=z["fresh_bars"], n_zones=z["n_zones"])
