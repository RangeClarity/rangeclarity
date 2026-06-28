"""Ablation: remove one concept at a time; a concept earns its place only if removing
it makes the system worse (more false-highs / High-Clarity inflation / less stable).
v0 wires chop, extension, zone, location, agreement. trend-quality + hysteresis ablation
are state-level-deferred (noted in the report)."""
from __future__ import annotations
import pandas as pd
from simulator import simulate_from_cache
from metrics import summarize

ABLATIONS = ["chop", "extension", "zone", "location", "agreement"]


def run_ablations(cache, best_params, cfg):
    weights = cfg["objective_weights"]
    full = summarize(simulate_from_cache(cache, best_params, cfg), weights)
    rows = [{"ablation": "FULL", **{k: full[k] for k in
            ["false_high_rate", "fatal_false_high", "high_clarity_rarity", "stability",
             "true_clear_recall", "objective"]}}]
    for ab in ABLATIONS:
        m = summarize(simulate_from_cache(cache, best_params, cfg, ablation={ab}), weights)
        rows.append({"ablation": f"-{ab}",
                     "false_high_rate": m["false_high_rate"], "fatal_false_high": m["fatal_false_high"],
                     "high_clarity_rarity": m["high_clarity_rarity"], "stability": m["stability"],
                     "true_clear_recall": m["true_clear_recall"], "objective": m["objective"],
                     "fh_delta": round(m["false_high_rate"] - full["false_high_rate"], 4),
                     "hc_delta": round(m["high_clarity_rarity"] - full["high_clarity_rarity"], 4),
                     "earns_place": (m["false_high_rate"] > full["false_high_rate"]
                                     or m["fatal_false_high"] > full["fatal_false_high"]
                                     or m["high_clarity_rarity"] > full["high_clarity_rarity"]
                                     or m["stability"] < full["stability"])})
    return pd.DataFrame(rows)
