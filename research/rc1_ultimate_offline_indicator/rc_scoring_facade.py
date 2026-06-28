"""RC-1 scoring facade — a small, stable, BORING public interface over the frozen scorer.

INTERFACE / FACADE ONLY. This module adds NO scoring logic. It wraps the existing
``negative_first_scorer.score_window(df, num, highs, lows, t, params, caps_cfg, prior, ablation)``
behind one call:

    score_window_input(RcWindowInput(...)) -> RcVerdict

It does NOT change scoring, caps, agree3, Broken-Zone semantics, thresholds, cap order, or
outputs. ``RcVerdict.raw`` is the exact dict the scorer returned and ``RcVerdict.lenses`` is the
exact lens dict (``L``) the scorer returned. To chain hysteresis/persistence exactly as the
existing callers do, feed the previous verdict's ``.lenses`` back in as ``prior`` using the same
idiom the callers use:  ``prior = v.lenses if not v.lenses.get("insufficient") else prior``.

Why this exists: docs/architecture/rangeclarity-deep-modules.md flagged the scorer's leaky,
caller-heavy signature ``score_window(df, num, highs, lows, t, params, caps_cfg, ...)``. This
facade is the "one boring call" target interface for the Core Scoring deep module. It is
introduced WITHOUT migrating callers and WITHOUT touching behavior (see test_rc_scoring_facade.py).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional

from negative_first_scorer import score_window  # frozen scorer — imported, never modified

# Stable lens-diagnostic fields the scorer already emits when structure is sufficient
# (see negative_first_scorer.score_window's return dict). Wrapped verbatim, never recomputed.
_VERDICT_LENS_FIELDS = (
    "trend", "zone", "regime", "location", "extension",
    "ci", "er", "adx", "ext_atr", "reg_r2",
)


@dataclass(frozen=True, eq=False)
class RcWindowInput:
    """Everything ``score_window`` currently needs, wrapped — no recompute, no reinterpretation.

    df, num, highs, lows, t, params, caps_cfg, prior, ablation are passed straight through to the
    existing scorer unchanged. symbol/date are OPTIONAL metadata, carried for convenience only and
    NOT used by scoring. Frozen so an input object is an immutable description of one window.
    """
    df: Any
    num: Any
    highs: Any
    lows: Any
    t: int
    params: dict
    caps_cfg: dict
    prior: Optional[dict] = None
    ablation: Optional[set] = None
    symbol: Optional[str] = None
    date: Optional[str] = None


@dataclass(eq=False)
class RcVerdict:
    """A stable view of one scored window. Every field is exactly what the scorer returned —
    nothing here is recomputed or reinterpreted. ``raw`` and ``lenses`` are the scorer's own
    dicts (lossless escape hatches)."""
    score: Optional[int]            # = sc["final_score"]
    state: str                      # = sc["final_state"]  (Insufficient/Unclear/Mixed/Clear/HighClarity)
    band: str                       # = sc["final_band"]
    caps: str                       # = sc["caps"]  (';'-joined, e.g. "broken;chop")
    weakest_lens: str               # = sc["weakest_lens"]
    agreement_count: int            # = sc["agreement_count"]
    why_not_higher: str             # = sc["why_not_higher"]
    false_high_self_flag: bool      # = sc["false_high_self_flag"]
    # lens diagnostics (present when structure is sufficient; otherwise absent -> None)
    trend: Optional[str] = None
    zone: Optional[str] = None
    regime: Optional[str] = None
    location: Optional[str] = None
    extension: Optional[str] = None
    ci: Optional[float] = None
    er: Optional[float] = None
    adx: Optional[float] = None
    ext_atr: Optional[float] = None
    reg_r2: Optional[float] = None
    # optional carried metadata (not produced by the scorer)
    symbol: Optional[str] = None
    date: Optional[str] = None
    # exact, lossless passthroughs
    raw: dict = field(default_factory=dict)
    lenses: dict = field(default_factory=dict)

    @property
    def is_insufficient(self) -> bool:
        return self.state == "Insufficient"

    @classmethod
    def from_score_window(cls, sc: dict, lenses: dict, symbol=None, date=None) -> "RcVerdict":
        """Map the scorer's (sc, L) tuple onto the stable view. Pure field copy — no logic."""
        return cls(
            score=sc.get("final_score"),
            state=sc.get("final_state"),
            band=sc.get("final_band"),
            caps=sc.get("caps", ""),
            weakest_lens=sc.get("weakest_lens"),
            agreement_count=sc.get("agreement_count", 0),
            why_not_higher=sc.get("why_not_higher"),
            false_high_self_flag=bool(sc.get("false_high_self_flag", False)),
            **{k: sc.get(k) for k in _VERDICT_LENS_FIELDS},
            symbol=symbol,
            date=date,
            raw=sc,
            lenses=lenses,
        )


def score_window_input(inp: RcWindowInput) -> RcVerdict:
    """Thin public facade: call the existing frozen scorer, wrap its outputs. No new logic,
    no changed thresholds, no changed cap order, no changed outputs."""
    sc, lenses = score_window(
        inp.df, inp.num, inp.highs, inp.lows, inp.t,
        inp.params, inp.caps_cfg, prior=inp.prior, ablation=inp.ablation,
    )
    return RcVerdict.from_score_window(sc, lenses, symbol=inp.symbol, date=inp.date)
