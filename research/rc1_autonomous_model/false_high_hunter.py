"""False-High Hunter + founder-review queues. Surfaces the few cases worth a human's
eyes instead of asking the founder to label everything."""
from __future__ import annotations
import pandas as pd


def hunt(df, k=20):
    high = df[df["final_state"].isin(["Clear", "HighClarity"])]
    false_high = df[df["false_high_proxy"]]
    fatal = df[df["fatal_false_high_proxy"]]
    reject = df[df["weak_label"] == "reject"]
    caps_saved = reject[reject["final_state"].isin(["Mixed", "Unclear", "Insufficient"])
                        & reject["caps"].astype(str).str.len().gt(0)]
    uncertain = df[(df["weak_label"] == "mixed") & (df["agreement_count"].isin([2, 3]))]
    borderline = df[df["final_score"].fillna(-1).between(60, 74)]
    suspicious_high = high[high["false_high_self_flag"] | high["false_high_proxy"]
                           | (high["agreement_count"] < 6) & (high["final_state"] == "HighClarity")]
    cols = ["symbol", "t", "date", "final_state", "final_score", "weak_label", "weak_reason",
            "caps", "weakest_lens", "agreement_count", "why_not_higher"]
    cols = [c for c in cols if c in df.columns]
    return dict(
        false_high_cases=false_high[cols].head(200),
        fatal_cases=fatal[cols].head(200),
        high_clarity_audit=high[high["final_state"] == "HighClarity"][cols].head(200),
        top_suspicious_high=suspicious_high[cols].head(k),
        top_borderline=borderline[cols].head(k),
        top_caps_saved=caps_saved[cols].head(k),
        top_uncertain=uncertain[cols].head(k),
    )
