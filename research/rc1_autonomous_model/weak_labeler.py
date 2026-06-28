"""Weak labels = proxy ground truth from STRICT rules (NOT human-confirmed truth).
A weak 'reject' chart must never receive Clear/High; that is the false-high proxy test.
Because weak labels and the scorer share rule DNA, agreement is partly circular — this
measures internal consistency + that caps fire, NOT real-world false-high rate."""
from __future__ import annotations


def weak_label(feat) -> tuple[str, str]:
    if feat.get("insufficient"):
        return "reject", "insufficient_data"
    # strict reject (most severe first)
    if feat["regime"] == "Chop":
        return "reject", "chop"
    if feat["contradiction"]:
        return "reject", "contradiction"
    if feat["zone"] == "Broken":
        return "reject", "broken_zone"
    if feat["extension"] == "Severe":
        return "reject", "severe_extension"
    if feat["zone"] == "Weak":
        return "reject", "weak_zone"
    if feat["regime"] == "Compression":
        return "reject", "compression_no_direction"
    if feat["location"] == "Mid" and feat["zone"] in ("Insufficient", "Weak"):
        return "reject", "mid_range_no_structure"
    # high clarity (extremely strict)
    if (feat["agreement_count"] == 6 and not feat["caps"] and not feat["contradiction"]
            and feat["extension"] == "Normal" and feat["regime"] in ("Trend", "Range")
            and feat["trend"] in ("Clean", "Range-bound") and feat["zone"] in ("Fresh", "Tested")):
        return "highclarity", "full_agreement"
    # clear-eligible
    if (feat["agree3"] and not feat["caps"] and feat["regime"] in ("Trend", "Range")
            and feat["extension"] in ("Normal", "Stretched") and not feat["contradiction"]):
        return "clear", "clean_structure"
    return "mixed", "default"
