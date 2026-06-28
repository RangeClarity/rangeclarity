"""RC-1 autonomous model — shared schemas, enums, constants, default params.

Negative-first: the score is the MINIMUM of what structure permits, never the sum.
No returns, no Pine, no future bars in scoring, no signal language.
"""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from typing import Optional

# ---- allowed lens states -----------------------------------------------------
TREND_STATES = ("Clean", "Mixed", "Weak", "Range-bound")
LOCATION_STATES = ("NearSupport", "Lower", "Mid", "Upper", "NearResistance", "Above", "Below")
ZONE_STATES = ("Fresh", "Tested", "Weak", "Broken", "Insufficient")
REGIME_STATES = ("Trend", "Range", "Compression", "Expansion", "Chop")
EXTENSION_STATES = ("Normal", "Stretched", "Extended", "Severe")
RC_STATES = ("HighClarity", "Clear", "Mixed", "Unclear", "Insufficient")

# ---- weak-label buckets ------------------------------------------------------
# proxy ground truth derived from strict rules (NOT human-confirmed truth)
WEAK_LABELS = ("reject", "mixed", "clear", "highclarity")
REJECT_REASONS = (
    "chop", "broken_zone", "weak_zone", "severe_extension", "contradiction",
    "mid_range_no_structure", "compression_no_direction", "insufficient_data", "unstable",
)
# fatal: High Clarity on any of these = the model did what it must never do
FATAL_REJECT_REASONS = ("chop", "broken_zone", "contradiction", "severe_extension")

# ---- default parameters (the optimizer sweeps these) -------------------------
DEFAULT_PARAMS = {
    # chop / regime
    "chop_ci_trigger": 61.8,      # Choppiness Index >= -> chop
    "er_chop_thresh": 0.30,       # Efficiency Ratio < -> noisy
    "adx_trend_min": 20.0,        # ADX < -> no trend
    # extension (in ATRs from MA200)
    "ext_stretched_atr": 2.0,
    "ext_extended_atr": 3.0,
    "ext_severe_atr": 4.0,
    # zones
    "zone_cluster_atr": 0.75,     # merge pivots within k*ATR
    "zone_width_atr": 1.0,        # nominal zone half-width in ATR
    "zone_fresh_bars": 250,       # older + untouched -> stale
    "zone_touch_min": 2,          # < -> weak/one-touch
    "zone_broken_atr": 0.25,      # close beyond by k*ATR -> broken
    "near_zone_atr": 1.0,         # within k*ATR -> "near" a level
    # location
    "donchian_n": 20,
    "mid_band": 0.30,             # central fraction -> Mid / no-man's-land
    # trend / MA
    "ma_slope_flat": 0.05,        # |slope| in ATR/bar below this = flat
    # agreement / stability
    "agree3_required": 3,         # trend+location+zone clean
    "hysteresis_max_jump": 15,    # band jump guard (score points)
    # high clarity
    "high_clarity_cut": 85,
    "hc_persistence_bars": 3,
}

# ---- locked v0 cap ceilings (source: validation/rc1-cap-thresholds-v0.md) ----
CAPS = {
    "insufficient": None,         # no number
    "contradictory": 40,
    "chop": 44,
    "broken": 50,
    "severe": 50,
    "weakzone": 52,
    "conflict": 55,
    "compression": 60,
    "extended": 60,
    "pricediscovery": 60,
    "lensmissing": 60,
    "midrange": 65,
    "agree3": 69,
}

def band_of(score: Optional[int]) -> str:
    if score is None:
        return "NA"
    if score > 85:
        return "86-100"
    if score >= 70:
        return "70-85"
    if score >= 45:
        return "45-69"
    return "0-44"

def state_of(score: Optional[int]) -> str:
    if score is None:
        return "Insufficient"
    if score > 85:
        return "HighClarity"
    if score >= 70:
        return "Clear"
    if score >= 45:
        return "Mixed"
    return "Unclear"


@dataclass
class Score:
    final_score: Optional[int]
    final_state: str
    final_band: str
    triggered_gates: list = field(default_factory=list)
    triggered_caps: list = field(default_factory=list)
    weakest_lens: str = ""
    agreement_count: int = 0
    why_not_higher: str = ""
    false_high_risk: bool = False
    audit_comment: str = ""

    def as_dict(self):
        return asdict(self)
