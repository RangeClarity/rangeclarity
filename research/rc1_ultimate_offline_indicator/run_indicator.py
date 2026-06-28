"""Orchestrator: load -> sweep -> ablation -> hunt -> report. Offline only.
  python3 run_indicator.py --smoke    # synthetic pipeline check (6 symbols)
  python3 run_indicator.py            # real CSV baseline if present, else synthetic (tagged)
"""
from __future__ import annotations
import os
import sys
import yaml
from data_loader import load_universe
from optimizer import sweep
from ablation import run_ablations
from false_high_hunter import hunt
from report import write_all

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    os.chdir(HERE)
    cfg = yaml.safe_load(open("config.yaml"))
    symbols = cfg["universe"]
    if "--smoke" in sys.argv:
        symbols = symbols[:6]
    print(f"[rc1] loading {len(symbols)} symbols ...")
    data, source, found = load_universe(cfg, symbols)
    print(f"[rc1] source={source} ({found}/{len(symbols)} real CSV)")
    ranked, best_params, best_df, m, cache, best_id = sweep(data, cfg)
    print(f"[rc1] configs={len(ranked)} best=config_{best_id} windows={m['n']}")
    abl = run_ablations(cache, best_params, cfg["caps"], cfg)
    hunted = hunt(best_df)
    rdir, earns, noeff, top_caps = write_all(cfg, source, found, ranked, best_params, best_df, m, abl, hunted)
    print("\n=== RC-1 ULTIMATE OFFLINE INDICATOR ===")
    print(f"source           : {source} ({found}/{len(symbols)} real)")
    print(f"windows          : {m['n']}")
    print(f"states           : {m['states']}")
    print(f"HighClarity rare : {m['high_clarity_rarity']}  Clear+: {m['clear_plus_rarity']}")
    print(f"false-high self  : {m['false_high_self_rate']}  fatal_self: {m['fatal_self']}")
    print(f"cap_accuracy     : {m['cap_accuracy']}  stability: {m['stability']}  objective: {m['objective']}")
    print(f"caps fired most  : {top_caps}")
    print(f"earns place      : {earns}")
    print(f"no effect here   : {noeff}")
    print(f"reports -> {rdir}")
    print("conviction       : RED (synthetic/no-labels => not validated)")


if __name__ == "__main__":
    main()
