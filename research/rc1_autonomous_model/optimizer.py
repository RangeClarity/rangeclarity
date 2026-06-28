"""Parameter sweep (grid/random). Objective is NOT returns — it minimises false-highs
(fatal=0 hard gate), keeps High Clarity rare, and rewards cap accuracy / consistency /
stability / simplicity. Builds the feature cache once and re-derives states per config."""
from __future__ import annotations
import itertools
import pandas as pd
from schemas import DEFAULT_PARAMS
from simulator import build_cache, simulate_from_cache
from metrics import summarize


def _configs(grid):
    keys = list(grid.keys())
    combos = list(itertools.product(*[grid[k] for k in keys]))
    out = []
    for c in combos:
        p = dict(DEFAULT_PARAMS)
        p.update({k: v for k, v in zip(keys, c)})
        out.append(p)
    return out


def sweep(data, cfg):
    cache = build_cache(data, DEFAULT_PARAMS)   # numeric uses fixed donchian_n
    weights = cfg["objective_weights"]
    rows, best = [], None
    for i, params in enumerate(_configs(cfg["grid"])):
        df = simulate_from_cache(cache, params, cfg)
        m = summarize(df, weights)
        rec = {"config_id": i, **{k: params[k] for k in cfg["grid"]}, **m}
        rows.append(rec)
        if best is None or m["objective"] > best[1]["objective"]:
            best = (params, m, df, i)
    ranked = pd.DataFrame(rows).sort_values("objective", ascending=False).reset_index(drop=True)
    return ranked, best[0], best[2], cache, best[3]
