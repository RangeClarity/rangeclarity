"""Negative-first min-gate scorer. LAW: score = minimum of what structure permits, never
the sum. Builds lenses from the engines, applies gates -> caps(min) -> agreement ->
hysteresis -> band, and emits an audit (why_not_higher). No additive confluence."""
from __future__ import annotations
import numpy as np
import structure_features as sf
import zone_engine, regime_engine, location_engine, extension_engine, agreement_engine

CAP_LENS = {"chop": "Chop/Regime", "compression": "Chop/Regime", "contradictory": "Agreement",
            "broken": "Zone", "weakzone": "Zone", "severe": "Extension", "extended": "Extension",
            "pricediscovery": "Location", "midrange": "Location", "lensmissing": "Trend", "agree3": "Agreement"}


def _band_state(s):
    if s is None:
        return "NA", "Insufficient"
    if s > 85:
        return "86-100", "HighClarity"
    if s >= 70:
        return "70-85", "Clear"
    if s >= 45:
        return "45-69", "Mixed"
    return "0-44", "Unclear"


def build_lenses(df, num, highs, lows, t, params, ablation=None):
    ablation = ablation or set()
    row = num.iloc[t]
    atr_t = row["atr"]
    n_piv = len([1 for (ci, _) in highs if ci <= t]) + len([1 for (ci, _) in lows if ci <= t])
    if t < params["donchian_n"] + 5 or np.isnan(atr_t) or atr_t <= 0 or n_piv < 4:
        return {"insufficient": True}
    zone = zone_engine.zones_asof(df, highs, lows, t, atr_t, params)
    trend, tdir, ma200_ok = sf.trend_state(row, params)
    regime = regime_engine.regime_state(row, params)
    location = location_engine.location_state(row, zone, params)
    extension, ext_atr = extension_engine.extension_state(row, zone, params)
    sdir = sf.structure_dir(highs, lows, t)
    agr = agreement_engine.assemble(trend, location, zone["state"], regime, extension, tdir, sdir, ma200_ok, ablation)
    return {"insufficient": False, "trend": trend, "zone": zone["state"], "regime": regime,
            "location": location, "extension": extension, "ma200_ok": ma200_ok, "ext_atr": ext_atr,
            "ci": None if np.isnan(row["ci"]) else float(row["ci"]),
            "er": None if np.isnan(row["er"]) else float(row["er"]),
            "adx": None if np.isnan(row["adx"]) else float(row["adx"]),
            "reg_r2": None if np.isnan(row["reg_r2"]) else float(row["reg_r2"]),
            "touches": zone["touches"], "fresh_bars": zone["fresh_bars"], "nearest_atr": zone["nearest_atr"],
            **agr}


def score_window(df, num, highs, lows, t, params, caps_cfg, prior=None, ablation=None):
    ablation = ablation or set()
    L = build_lenses(df, num, highs, lows, t, params, ablation)
    if L["insufficient"]:
        return ({"final_score": None, "final_state": "Insufficient", "final_band": "NA",
                 "caps": "", "weakest_lens": "Data", "agreement_count": 0,
                 "why_not_higher": "insufficient confirmed structure (no number)",
                 "false_high_self_flag": False}, L)
    caps = []
    if L["regime"] == "Chop" and "chop" not in ablation: caps.append("chop")
    if L["regime"] == "Compression" and "chop" not in ablation: caps.append("compression")
    if L["regime"] == "Expansion" and "extension" not in ablation: caps.append("extended")
    if L["contradiction"]: caps.append("contradictory")
    if L["zone"] == "Broken" and "zone" not in ablation: caps.append("broken")
    if L["zone"] == "Weak" and "zone" not in ablation: caps.append("weakzone")
    if L["extension"] == "Severe" and "extension" not in ablation: caps.append("severe")
    elif L["extension"] == "Extended" and "extension" not in ablation: caps.append("extended")
    if L["location"] in ("Above", "Below") and "location" not in ablation: caps.append("pricediscovery")
    if L["location"] == "Mid" and L["zone"] in ("Insufficient", "Weak") and "location" not in ablation: caps.append("midrange")
    if not L["ma200_ok"] and "trend" not in ablation: caps.append("lensmissing")
    caps = sorted(set(caps))
    ceiling = min([caps_cfg[c] for c in caps], default=100)
    if not L["agree3"]:
        ceiling = min(ceiling, caps_cfg["agree3"])
        if "agree3" not in caps:
            caps.append("agree3")
    persistence_ok = bool(prior) and (not prior.get("insufficient")) and prior.get("agreement_count", 0) == 6 and not prior.get("_had_caps", False)
    if not caps:
        sc = 88 if (L["agreement_count"] == 6 and persistence_ok) else (78 if L["agree3"] else 60)
    else:
        sc = ceiling
        if "contradictory" in caps:
            sc = min(sc, caps_cfg["contradictory"])
    sc = max(0, min(int(sc), ceiling))
    # hysteresis: limit upward promotion vs prior confirmed score
    if "hysteresis" not in ablation and prior and prior.get("_score") is not None:
        if sc - prior["_score"] > params["hysteresis_max_jump"]:
            sc = prior["_score"] + params["hysteresis_max_jump"]
    band, state = _band_state(sc)
    binding = min((c for c in caps if c in caps_cfg), key=lambda c: caps_cfg[c], default=None)
    weakest = CAP_LENS.get(binding, "Agreement" if not L["agree3"] else "—")
    why = ("clean agreement" if not caps else
           f"capped by {binding} (<= {caps_cfg.get(binding)})" if binding else "partial agreement")
    fh = state in ("Clear", "HighClarity") and (bool([c for c in caps if c != 'agree3']) or L["contradiction"])
    L["_had_caps"] = bool([c for c in caps if c != "agree3"]); L["_score"] = sc
    return ({"final_score": sc, "final_state": state, "final_band": band, "caps": ";".join(caps),
             "weakest_lens": weakest, "agreement_count": L["agreement_count"], "why_not_higher": why,
             "false_high_self_flag": bool(fh), "trend": L["trend"], "zone": L["zone"], "regime": L["regime"],
             "location": L["location"], "extension": L["extension"], "ci": L["ci"], "er": L["er"],
             "adx": L["adx"], "ext_atr": L["ext_atr"], "reg_r2": L["reg_r2"]}, L)
