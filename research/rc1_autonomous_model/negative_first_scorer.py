"""Negative-first min-gate scorer. THE LAW: score = minimum of what structure permits,
never the sum of what is present. No additive confluence. Obeys
docs/research/rc1-python-scorer-v0-contract.md and validation/rc1-cap-thresholds-v0.md."""
from __future__ import annotations
from schemas import CAPS, Score, state_of, band_of

CAP_LENS = {
    "chop": "Chop/Regime", "compression": "Chop/Regime", "contradictory": "Agreement",
    "broken": "Zone Quality", "weakzone": "Zone Quality", "severe": "ATR Extension",
    "extended": "ATR Extension", "pricediscovery": "Location", "midrange": "Location",
    "lensmissing": "Trend Quality", "agree3": "Agreement",
}


def score_case(feat, prior_feat=None) -> Score:
    if feat.get("insufficient"):
        return Score(None, "Insufficient", "NA", triggered_gates=["data"],
                     why_not_higher="insufficient confirmed structure (no number)",
                     audit_comment="data gate", weakest_lens="Data")
    caps = list(feat["caps"])
    gates = []
    ceiling = 100
    for c in caps:
        v = CAPS.get(c)
        if v is not None:
            ceiling = min(ceiling, v)
    # agreement gate (Clear/High requires trend+location+zone clean)
    if not feat["agree3"]:
        ceiling = min(ceiling, CAPS["agree3"])
        if "agree3" not in caps:
            caps.append("agree3")
        gates.append("agreement")
    # persistence for High Clarity
    persistence_ok = bool(prior_feat) and (not prior_feat.get("insufficient")) and \
        prior_feat.get("agreement_count", 0) == 6 and not prior_feat.get("caps")
    # representative score within the permitted ceiling (NOT an additive sum)
    if not caps:
        if feat["agreement_count"] == 6 and persistence_ok:
            sc = 88   # rare High Clarity
        elif feat["agree3"]:
            sc = 78   # Clear
        else:
            sc = 60   # Mixed
    else:
        sc = ceiling
        if "contradictory" in caps:
            sc = min(sc, CAPS["contradictory"])
    sc = max(0, min(int(sc), ceiling))
    # weakest lens = cap with the lowest ceiling
    binding = None
    if caps:
        binding = min((c for c in caps if CAPS.get(c) is not None),
                      key=lambda c: CAPS[c], default=None)
    weakest = CAP_LENS.get(binding, "—") if binding else ("Agreement" if not feat["agree3"] else "—")
    state = state_of(sc)
    why = "clean agreement" if not caps and feat["agree3"] else (
        f"capped by {binding} (<= {CAPS.get(binding)})" if binding else "partial agreement (<=69)")
    # self-audit false-high risk: a high state with any cap/contradiction is a defect
    fh_risk = state in ("Clear", "HighClarity") and (bool(caps) or feat["contradiction"])
    return Score(sc, state, band_of(sc), triggered_gates=gates, triggered_caps=caps,
                 weakest_lens=weakest, agreement_count=feat["agreement_count"],
                 why_not_higher=why, false_high_risk=fh_risk,
                 audit_comment=f"regime={feat['regime']} zone={feat['zone']} loc={feat['location']} ext={feat['extension']}")
