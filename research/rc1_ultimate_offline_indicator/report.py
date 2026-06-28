"""Reports (markdown + CSV). Honest: synthetic/no-label runs claim NO conviction."""
from __future__ import annotations
import os
import json
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))


def write_all(cfg, source, found, ranked, best_params, df, m, abl, hunted):
    rdir = os.path.join(HERE, cfg["paths"]["reports"])
    os.makedirs(rdir, exist_ok=True)
    # state distribution
    sd = df["final_state"].value_counts().rename_axis("state").reset_index(name="count")
    sd["pct"] = (sd["count"] / len(df)).round(4)
    sd.to_csv(os.path.join(rdir, "state_distribution.csv"), index=False)
    # cap distribution
    caps = df["caps"].dropna().astype(str).str.split(";").explode()
    caps = caps[caps.str.len() > 0]
    cd = caps.value_counts().rename_axis("cap").reset_index(name="count")
    cd.to_csv(os.path.join(rdir, "cap_distribution.csv"), index=False)
    # queues
    hunted["high_clarity_audit"].to_csv(os.path.join(rdir, "high_clarity_audit.csv"), index=False)
    hunted["false_high_suspects"].to_csv(os.path.join(rdir, "false_high_suspects.csv"), index=False)
    hunted["top_borderline"].to_csv(os.path.join(rdir, "borderline_cases.csv"), index=False)
    hunted["founder_review_queue"].to_csv(os.path.join(rdir, "founder_review_queue.csv"), index=False)
    abl.to_csv(os.path.join(rdir, "ablation_results.csv"), index=False)
    ranked.to_csv(os.path.join(rdir, "candidate_rulesets.csv"), index=False)
    json.dump({k: best_params[k] for k in cfg["grid"]} | {"metrics": m}, open(os.path.join(rdir, "best_ruleset.json"), "w"), indent=2, default=str)
    earns = [r["ablation"] for _, r in abl.iterrows() if r.get("earns_place") is True]
    noeff = [r["ablation"] for _, r in abl.iterrows() if r.get("earns_place") is False]
    top_caps = cd.head(3)["cap"].tolist()
    lines = [
        "# RC-1 Ultimate Offline Indicator — Summary\n",
        f"> **Data source: `{source}`** ({found}/{len(cfg['universe'])} symbols from CSV). "
        + ("**SYNTHETIC — pipeline check only, NOT evidence, NO conviction.**" if source == "synthetic"
           else "Real CSV bars (offline).") + " No Pine, no returns, no trading advice.\n",
        f"- windows: {m['n']} · states: {m['states']}\n",
        f"- High Clarity rarity: {m['high_clarity_rarity']} (target 0.01–0.05) · Clear+ rarity: {m['clear_plus_rarity']}\n",
        f"- false-high self-flag rate: {m['false_high_self_rate']} · fatal self: {m['fatal_self']} (must be 0)\n",
        f"- cap_accuracy: {m['cap_accuracy']} · stability: {m['stability']} · segment_robustness: {m['segment_robustness']} · objective: {m['objective']}\n",
        f"- caps fired most: {top_caps}\n",
        f"- concepts that EARN their place (ablation worsens on removal): {earns or 'see table'}\n",
        f"- concepts with NO effect here (unproven / re-test on real data): {noeff or 'none'}\n",
        "\n## Conviction: **RED**. ",
        "Synthetic and/or no human labels => internal consistency only, not a real false-high rate.\n",
        "\n## Ablation\n", abl.to_markdown(index=False),
        "\n\n## Honesty\nWithout human labels the 'false-high' figure is a self-consistency proxy; a real "
        "rate needs labeled cases (labels-50 -> Reject-Probe). High Clarity stays rare by construction; "
        "this run does not validate the model.\n",
    ]
    open(os.path.join(rdir, "offline_indicator_summary.md"), "w").write("\n".join(lines))
    return rdir, earns, noeff, top_caps
