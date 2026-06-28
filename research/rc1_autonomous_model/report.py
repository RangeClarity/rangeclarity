"""Reports: markdown + CSV. Proxies use future bars for EVALUATION ONLY. Conviction is
reported honestly (Red) when data is synthetic / weak-labelled."""
from __future__ import annotations
import os
import json
import pandas as pd
from metrics import summarize, provisional_conviction

HERE = os.path.dirname(os.path.abspath(__file__))


def _proxy_validation(df):
    if "future_er" not in df.columns:
        return pd.DataFrame()
    g = df.copy()
    g["group"] = g["final_state"].apply(lambda s: "Clear/High" if s in ("Clear", "HighClarity") else s)
    return g.groupby("group").agg(n=("symbol", "size"),
                                  future_er=("future_er", "mean"),
                                  future_ci=("future_ci", "mean"),
                                  future_ext=("future_ext", "mean")).round(3).reset_index()


def _segments(df):
    by_sym = df.groupby("symbol").agg(n=("t", "size"),
                                      false_high=("false_high_proxy", "sum"),
                                      hc=("final_state", lambda s: (s == "HighClarity").mean())).round(4).reset_index()
    if "regime" in df.columns:
        by_reg = df.dropna(subset=["regime"]).groupby("regime").agg(
            n=("t", "size"), false_high=("false_high_proxy", "sum"),
            clear_plus=("final_state", lambda s: s.isin(["Clear", "HighClarity"]).mean())).round(4).reset_index()
    else:
        by_reg = pd.DataFrame()
    return by_sym, by_reg


def write_all(cfg, source, symbols, ranked, best_params, best_df, abl, hunted):
    rdir = os.path.join(HERE, cfg["paths"]["reports"])
    os.makedirs(rdir, exist_ok=True)
    w = cfg["objective_weights"]
    m = summarize(best_df, w)
    conv, conv_label = provisional_conviction(m)

    ranked.to_csv(os.path.join(rdir, "candidate_rulesets.csv"), index=False)
    json.dump({k: best_params[k] for k in cfg["grid"]} | {"metrics": m},
              open(os.path.join(rdir, "best_ruleset.json"), "w"), indent=2, default=str)
    hunted["false_high_cases"].to_csv(os.path.join(rdir, "false_high_cases.csv"), index=False)
    hunted["high_clarity_audit"].to_csv(os.path.join(rdir, "high_clarity_audit.csv"), index=False)
    abl.to_csv(os.path.join(rdir, "ablation_results.csv"), index=False)
    by_sym, by_reg = _segments(best_df)
    by_sym.to_csv(os.path.join(rdir, "segment_results.csv"), index=False)
    proxy = _proxy_validation(best_df)
    proxy.to_csv(os.path.join(rdir, "proxy_validation.csv"), index=False)
    fd_cols = [c for c in ["ci", "er", "adx", "ext_atr", "agreement_count"] if c in best_df.columns]
    best_df[fd_cols].describe().to_csv(os.path.join(rdir, "feature_distributions.csv"))
    for name in ["top_suspicious_high", "top_borderline", "top_caps_saved", "top_uncertain"]:
        hunted[name].to_csv(os.path.join(rdir, f"founder_review_{name}.csv"), index=False)

    earns = abl[abl.get("earns_place", False) == True]["ablation"].tolist() if "earns_place" in abl else []
    noise = abl[abl.get("earns_place", True) == False]["ablation"].tolist() if "earns_place" in abl else []
    lines = []
    A = lines.append
    A("# RC-1 Autonomous Model — Run Summary\n")
    A(f"> **Data source: `{source}`.** " + ("**SYNTHETIC fixtures — pipeline verification only, "
      "NOT validation evidence. No conviction is claimed.**\n" if source == "synthetic"
      else "Historical confirmed bars (offline).\n"))
    A(f"- Symbols: {len(symbols)} · windows scored: {m['n']} · reject cases: {m['n_reject']}\n")
    A("\n## Headline metrics (best ruleset)\n")
    A(f"- false_high_proxy_rate: **{m['false_high_rate']}** · fatal: **{m['fatal_false_high']}** "
      f"(must be 0)\n- rule-of-three upper95: {m['rule_of_three_upper95']} · Wilson upper95: {m['wilson_upper95']}\n"
      f"- High Clarity rarity: {m['high_clarity_rarity']} (target 0.01–0.05) · Clear+ rarity: {m['clear_plus_rarity']}\n"
      f"- cap_accuracy: {m['cap_accuracy']} · true_clear_recall: {m['true_clear_recall']} · stability: {m['stability']}\n")
    A(f"\n## Provisional internal conviction: **{conv}/100 — {conv_label}**\n")
    A("(Capped Red by design: synthetic data + weak labels are not human-confirmed truth and "
      "there is no untouched holdout. Real conviction requires human-labeled cases.)\n")
    A("\n## Answers\n")
    A(f"1. **Best ruleset:** config_id {int(ranked.iloc[0]['config_id'])} — "
      f"{ {k: best_params[k] for k in cfg['grid']} } (objective {ranked.iloc[0]['objective']}).\n")
    A("2. **Caps preventing the most false-highs:** see `ablation_results.csv` — removing a cap that raises "
      "false_high_rate most is the strongest preventer.\n")
    A(f"3. **Concepts that earned conviction (ablation worsened on removal):** {earns or 'see ablation table'}.\n")
    A(f"4. **Concepts that added little (no worsening on removal):** {noise or 'none flagged'} "
      "(re-check with real data + more windows).\n")
    A("5. **Founder review:** `founder_review_*` CSVs (suspicious highs, borderline, caps-saved, uncertain).\n")
    A("6. **Python scorer v0:** keep the min-gate + locked caps as implemented here; do not add additive terms.\n")
    A("7. **Not into Pine yet:** anything unvalidated on human labels; ML; volume-in-score; momentum; the whole "
      "thing until labels exist.\n")
    A(f"8. **Model conviction level: RED.** Pipeline runs; evidence does not yet exist.\n")
    A("\n## Proxy validation (future bars = evaluation only, never scoring)\n")
    A(proxy.to_markdown(index=False) if not proxy.empty else "_no proxy rows_\n")
    A("\n\n## Ablation\n")
    A(abl.to_markdown(index=False))
    A("\n\n## Caveat\n")
    A("Weak labels and the scorer share rule DNA, so agreement is partly circular — this measures internal "
      "consistency + that caps fire, NOT the real-world false-high rate. Replace weak labels with human labels "
      "(labels-50 → 100 → 300) for real conviction.\n")
    open(os.path.join(rdir, "run_summary.md"), "w").write("\n".join(lines))
    return rdir, m, conv, conv_label
