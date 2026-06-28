"""Orchestrator: load -> sweep -> ablation -> hunt -> report. Offline only.
Usage: python3 run_research.py [--n N]   (N limits the universe for a quick run)"""
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
    symbols = cfg["universe_small"]
    if "--n" in sys.argv:
        symbols = symbols[: int(sys.argv[sys.argv.index("--n") + 1])]
    print(f"[rc1] loading {len(symbols)} symbols ...")
    data, source = load_universe(cfg, symbols)
    print(f"[rc1] data source = {source}")
    print("[rc1] parameter sweep ...")
    ranked, best_params, best_df, cache, best_id = sweep(data, cfg)
    print(f"[rc1] configs={len(ranked)} best=config_{best_id} windows={len(best_df)}")
    print("[rc1] ablation ...")
    abl = run_ablations(cache, best_params, cfg)
    print("[rc1] hunting false-highs + building founder queues ...")
    hunted = hunt(best_df)
    rdir, m, conv, conv_label = write_all(cfg, source, symbols, ranked, best_params, best_df, abl, hunted)
    print("\n=== RC-1 AUTONOMOUS RUN ===")
    print(f"source            : {source}")
    print(f"windows / reject  : {m['n']} / {m['n_reject']}")
    print(f"false_high_rate   : {m['false_high_rate']}  (fatal={m['fatal_false_high']})")
    print(f"rule_of_three_95  : {m['rule_of_three_upper95']}   wilson95: {m['wilson_upper95']}")
    print(f"HighClarity rarity: {m['high_clarity_rarity']}  (target 0.01-0.05)")
    print(f"cap_accuracy      : {m['cap_accuracy']}  true_clear_recall: {m['true_clear_recall']}")
    print(f"stability         : {m['stability']}  objective: {m['objective']}")
    print(f"provisional conv  : {conv}/100  -> {conv_label}")
    print(f"reports -> {rdir}")


if __name__ == "__main__":
    main()
