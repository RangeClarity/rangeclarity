"""Metrics + objective. NOT returns. Optimises false-high prevention, fatal=0,
rarity, cap accuracy, consistency, stability, simplicity. Includes rule-of-three
and Wilson bounds. Conviction here is PROVISIONAL/internal — weak labels are not
human truth, so the real beta Conviction Score stays Red until human labels exist."""
from __future__ import annotations
import math
import numpy as np
import pandas as pd


def wilson_upper(k, n, z=1.96):
    if n == 0:
        return None
    p = k / n
    den = 1 + z * z / n
    centre = p + z * z / (2 * n)
    half = z * math.sqrt((p * (1 - p) + z * z / (4 * n)) / n)
    return (centre + half) / den


def stability(df):
    if df.empty:
        return 0.0
    ok, tot = 0, 0
    for _, g in df.sort_values(["symbol", "t"]).groupby("symbol"):
        s = g["final_score"].tolist()
        for a, b in zip(s, s[1:]):
            if a is None or b is None or (isinstance(a, float) and math.isnan(a)):
                continue
            tot += 1
            if abs(a - b) <= 15:
                ok += 1
    return ok / tot if tot else 1.0


def summarize(df, weights):
    n = len(df)
    rej = df[df["weak_label"] == "reject"]
    n_rej = len(rej)
    fh = int(rej["false_high_proxy"].sum()) if n_rej else 0
    fatal = int(df["fatal_false_high_proxy"].sum())
    fh_rate = fh / n_rej if n_rej else 0.0
    rule_of_three = (3 / n_rej) if (n_rej and fh == 0) else None
    wilson = wilson_upper(fh, n_rej) if n_rej else None
    hc = (df["final_state"] == "HighClarity").mean() if n else 0.0
    clear_plus = df["final_state"].isin(["Clear", "HighClarity"]).mean() if n else 0.0
    cap_fired = rej.apply(lambda r: (str(r["caps"]) != "" and str(r["caps"]) != "nan")
                          or r["final_state"] in ("Insufficient", "Unclear"), axis=1).mean() if n_rej else 1.0
    clearlbl = df[df["weak_label"].isin(["clear", "highclarity"])]
    true_clear_recall = clearlbl["final_state"].isin(["Clear", "HighClarity"]).mean() if len(clearlbl) else 0.0
    stab = stability(df)
    simplicity = 1.0 if 0.01 <= hc <= 0.06 else (0.5 if hc <= 0.10 else 0.2)
    fhp = max(0.0, 1 - fh_rate)
    ffp = 1.0 if fatal == 0 else 0.0
    obj = (weights["false_high_prevention"] * fhp + weights["fatal_fail_prevention"] * ffp
           + weights["cap_accuracy"] * cap_fired + weights["band_state_consistency"] * true_clear_recall
           + weights["stability"] * stab + weights["simplicity"] * simplicity)
    if fatal > 0:
        obj = 0.0  # hard gate
    return dict(n=n, n_reject=n_rej, false_high=fh, false_high_rate=round(fh_rate, 4),
                fatal_false_high=fatal, rule_of_three_upper95=(round(rule_of_three, 4) if rule_of_three else None),
                wilson_upper95=(round(wilson, 4) if wilson is not None else None),
                high_clarity_rarity=round(hc, 4), clear_plus_rarity=round(clear_plus, 4),
                cap_accuracy=round(cap_fired, 4), true_clear_recall=round(true_clear_recall, 4),
                stability=round(stab, 4), simplicity=simplicity, objective=round(obj, 4))


def provisional_conviction(m):
    """Internal-consistency score 0-100 (NOT the beta Conviction Score). Capped Red
    because evidence is synthetic/weak-labelled, not human-confirmed."""
    if m["fatal_false_high"] > 0:
        return 0, "Red (fatal present)"
    score = (25 * max(0, 1 - m["false_high_rate"]) + 15 + 10 * m["cap_accuracy"]
             + 10 * m["true_clear_recall"] + 10 * (1 if 0.01 <= m["high_clarity_rarity"] <= 0.05 else 0.4)
             + 10 * m["stability"])
    # hard cap: no human labels, no holdout, synthetic data -> cannot exceed Red ceiling
    score = min(score, 20)
    return round(score, 1), "Red (synthetic + weak-labels; not human-validated)"
