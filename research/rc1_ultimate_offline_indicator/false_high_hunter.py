"""False-High Hunter: without human labels it surfaces SUSPECTS for founder review (it
cannot compute a real false-high rate). Self-flag fatals (a high state with a non-agree3
cap, or a number on Insufficient) should be 0 by construction."""
from __future__ import annotations
import pandas as pd

COLS = ["symbol", "t", "date", "final_state", "final_score", "caps", "weakest_lens",
        "agreement_count", "why_not_higher", "regime", "zone", "location", "extension"]


def hunt(df, k=20):
    cols = [c for c in COLS if c in df.columns]
    high = df[df["final_state"].isin(["Clear", "HighClarity"])]
    suspects = high[high["false_high_self_flag"]] if "false_high_self_flag" in df else high.iloc[0:0]
    borderline = df[df["final_score"].fillna(-1).between(60, 74)]
    capped = df[df["caps"].astype(str).str.replace("agree3", "").str.strip(";").str.len() > 0]
    caps_saved = capped[capped["final_state"].isin(["Mixed", "Unclear", "Insufficient"])]
    uncertain = df[df["agreement_count"].isin([2, 3]) & (df["final_state"] == "Mixed")]
    top_high = high.sort_values("final_score", ascending=False)
    return {
        "high_clarity_audit": high[high["final_state"] == "HighClarity"][cols].head(200),
        "false_high_suspects": suspects[cols].head(200),
        "top_suspicious_high": (suspects if len(suspects) else top_high)[cols].head(k),
        "top_borderline": borderline[cols].head(k),
        "top_caps_saved": caps_saved[cols].head(k),
        "top_uncertain": uncertain[cols].head(k),
        "founder_review_queue": pd.concat([
            top_high[cols].head(k).assign(queue="suspicious_high"),
            borderline[cols].head(k).assign(queue="borderline"),
            caps_saved[cols].head(k).assign(queue="caps_saved"),
            uncertain[cols].head(k).assign(queue="uncertain"),
        ], ignore_index=True),
    }
