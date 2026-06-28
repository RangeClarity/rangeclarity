"""Simulation cache + parameter sweep + metrics + objective. NOT returns. Optimises
false-high prevention / fatal=0 / High-Clarity rarity / cap accuracy / stability /
segment robustness / simplicity. (Without human labels the false-high term is a
self-consistency proxy — honest limit, see report.)"""
from __future__ import annotations
import itertools
import math
import numpy as np
import pandas as pd
import structure_features as sf
import indicators as ind
from negative_first_scorer import score_window


def build_cache(data, params):
    cache = {}
    for sym, df in data.items():
        cache[sym] = (df, sf.compute_frame(df, params), *ind.confirmed_pivots(df, 5))
    return cache


def simulate(cache, params, caps_cfg, cfg, ablation=None):
    rows = []
    h = cfg["windows"]["proxy_horizon"]
    minb, step = cfg["windows"]["min_bars"], cfg["windows"]["step"]
    for sym, (df, num, highs, lows) in cache.items():
        prior = None
        last = len(df) - h - 1
        for t in range(minb, last, step):
            sc, L = score_window(df, num, highs, lows, t, params, caps_cfg, prior, ablation)
            row = {"symbol": sym, "t": int(t), "date": str(df["date"].iloc[t]), **sc}
            end = min(len(num) - 1, t + h)
            if end > t + 2:
                fut = num.iloc[t + 1:end + 1]
                row["future_er"] = float(np.nanmean(fut["er"]))
                row["future_ci"] = float(np.nanmean(fut["ci"]))
            rows.append(row)
            prior = L if not L.get("insufficient") else prior
    return pd.DataFrame(rows)


def metrics(df, weights):
    n = len(df)
    sc = df["final_state"]
    hc = (sc == "HighClarity").mean() if n else 0.0
    clear_plus = sc.isin(["Clear", "HighClarity"]).mean() if n else 0.0
    fh_self = float(df["false_high_self_flag"].mean()) if n else 0.0
    fatal = int(df["false_high_self_flag"].sum())  # by construction should be 0
    capped = df[df["caps"].astype(str).str.replace("agree3", "").str.strip(";").str.len() > 0]
    cap_acc = capped["final_state"].isin(["Mixed", "Unclear", "Insufficient"]).mean() if len(capped) else 1.0
    # stability
    ok = tot = 0
    for _, g in df.sort_values(["symbol", "t"]).groupby("symbol"):
        s = [x for x in g["final_score"].tolist()]
        for a, b in zip(s, s[1:]):
            if a is None or b is None or (isinstance(a, float) and math.isnan(a)):
                continue
            tot += 1; ok += (abs(a - b) <= 15)
    stab = ok / tot if tot else 1.0
    seg = df.groupby("symbol")["final_state"].apply(lambda s: s.isin(["Clear", "HighClarity"]).mean())
    seg_robust = 1.0 - min(1.0, float(seg.std() if len(seg) > 1 else 0.0))
    simp = 1.0 if 0.01 <= hc <= 0.05 else (0.5 if hc <= 0.10 else 0.2)
    obj = (weights["false_high_prevention"] * (1 - fh_self) + weights["fatal_fail_prevention"] * (1.0 if fatal == 0 else 0.0)
           + weights["cap_accuracy"] * cap_acc + weights["state_stability"] * stab
           + weights["segment_robustness"] * seg_robust + weights["simplicity"] * simp)
    if fatal > 0:
        obj = 0.0
    return dict(n=n, high_clarity_rarity=round(hc, 4), clear_plus_rarity=round(clear_plus, 4),
                false_high_self_rate=round(fh_self, 4), fatal_self=fatal, cap_accuracy=round(cap_acc, 4),
                stability=round(stab, 4), segment_robustness=round(seg_robust, 4),
                simplicity=simp, objective=round(obj, 4),
                states={s: int((sc == s).sum()) for s in ["HighClarity", "Clear", "Mixed", "Unclear", "Insufficient"]})


def sweep(data, cfg):
    caps_cfg = cfg["caps"]
    cache = build_cache(data, cfg["params"])
    keys = list(cfg["grid"].keys())
    rows, best = [], None
    for i, combo in enumerate(itertools.product(*[cfg["grid"][k] for k in keys])):
        p = dict(cfg["params"]); p.update(dict(zip(keys, combo)))
        df = simulate(cache, p, caps_cfg, cfg)
        m = metrics(df, cfg["objective_weights"])
        rows.append({"config_id": i, **dict(zip(keys, combo)), **{k: m[k] for k in
                     ["high_clarity_rarity", "clear_plus_rarity", "false_high_self_rate",
                      "fatal_self", "cap_accuracy", "stability", "objective"]}})
        if best is None or m["objective"] > best[1]["objective"]:
            best = (p, m, df, i)
    ranked = pd.DataFrame(rows).sort_values("objective", ascending=False).reset_index(drop=True)
    return ranked, best[0], best[2], best[1], cache, best[3]
