"""Ablation: remove one concept; it earns its place only if removal makes the system worse
(more suspicious highs / Clear-High inflation / less stable)."""
from __future__ import annotations
import pandas as pd
from optimizer import simulate, metrics

ABLATIONS = ["chop", "zone", "location", "extension", "agreement", "hysteresis", "trend"]


def run_ablations(cache, best_params, caps_cfg, cfg):
    w = cfg["objective_weights"]
    full = metrics(simulate(cache, best_params, caps_cfg, cfg), w)
    rows = [{"ablation": "FULL", "clear_plus": full["clear_plus_rarity"], "high_clarity": full["high_clarity_rarity"],
             "false_high_self": full["false_high_self_rate"], "fatal": full["fatal_self"],
             "stability": full["stability"], "objective": full["objective"], "earns_place": ""}]
    for ab in ABLATIONS:
        m = metrics(simulate(cache, best_params, caps_cfg, cfg, ablation={ab}), w)
        earns = (m["clear_plus_rarity"] > full["clear_plus_rarity"] or m["high_clarity_rarity"] > full["high_clarity_rarity"]
                 or m["false_high_self_rate"] > full["false_high_self_rate"] or m["fatal_self"] > full["fatal_self"]
                 or m["stability"] < full["stability"])
        rows.append({"ablation": f"-{ab}", "clear_plus": m["clear_plus_rarity"], "high_clarity": m["high_clarity_rarity"],
                     "false_high_self": m["false_high_self_rate"], "fatal": m["fatal_self"],
                     "stability": m["stability"], "objective": m["objective"],
                     "clear_plus_delta": round(m["clear_plus_rarity"] - full["clear_plus_rarity"], 4),
                     "stability_delta": round(m["stability"] - full["stability"], 4),
                     "earns_place": bool(earns)})
    return pd.DataFrame(rows)
