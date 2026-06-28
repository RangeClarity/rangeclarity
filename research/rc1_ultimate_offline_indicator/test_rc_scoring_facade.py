"""Golden-output test: the facade must return EXACTLY what the raw scorer returns.

Proves score_window_input(RcWindowInput(...)) is behavior-preserving vs the existing
negative_first_scorer.score_window(...), on real OHLC windows, including the stateful
``prior`` (hysteresis/persistence) chain.

Two independent prior chains are maintained in lock-step:
  * RAW    : sc, L = score_window(...);            prior_raw = L if not L["insufficient"] else prior_raw
  * FACADE : v = score_window_input(RcWindowInput);prior_fac = v.lenses if not insufficient else prior_fac
At every window we assert the full verdict dict is identical. If the two prior chains ever
diverged, a later verdict would differ — so whole-series equality also proves the prior path.

Run (smoke, one symbol, fast):   python3 test_rc_scoring_facade.py
Scale to the frozen baseline:     RC_GOLDEN_FULL=1 python3 test_rc_scoring_facade.py
  -> iterates every universe symbol that has a local CSV, reproducing the same windows the
     1,767-window Real Baseline v1 scores (full_real_review.py). Exits non-zero on any mismatch.

NO scoring/caps/agree3/Pine/payment change. Read-only over the frozen engine.
"""
from __future__ import annotations

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import yaml  # noqa: E402
import data_loader  # noqa: E402
import structure_features as sf  # noqa: E402
import indicators as ind  # noqa: E402
from negative_first_scorer import score_window  # noqa: E402
from rc_scoring_facade import RcWindowInput, RcVerdict, score_window_input  # noqa: E402

# Public verdict keys the facade promises to expose as typed attributes (must match the
# scorer's dict exactly). Mirrors negative_first_scorer.score_window's return dict.
PUBLIC = [
    "final_score", "final_state", "final_band", "caps", "weakest_lens",
    "agreement_count", "why_not_higher", "false_high_self_flag",
    "trend", "zone", "regime", "location", "extension",
    "ci", "er", "adx", "ext_atr", "reg_r2",
]
ATTR = {  # scorer-dict key -> facade attribute name (only the renamed ones differ)
    "final_score": "score", "final_state": "state", "final_band": "band",
}
# prior-relevant lens keys the scorer reads back off `prior` (persistence/hysteresis)
PRIOR_KEYS = ["insufficient", "agreement_count", "_had_caps", "_score"]


def _check_symbol(sym, df, params, caps, windows):
    minb, step, hz = windows["min_bars"], windows["step"], windows["proxy_horizon"]
    num = sf.compute_frame(df, params)
    highs, lows = ind.confirmed_pivots(df, 5)
    prior_raw = None
    prior_fac = None
    n = 0
    n_sufficient = 0
    n_capped = 0
    for t in range(minb, len(df) - hz - 1, step):
        sc, L = score_window(df, num, highs, lows, t, params, caps, prior_raw)
        v = score_window_input(RcWindowInput(
            df=df, num=num, highs=highs, lows=lows, t=t,
            params=params, caps_cfg=caps, prior=prior_fac, symbol=sym, date=str(df["date"].iloc[t]),
        ))
        # 1) full verdict dict identical
        assert v.raw == sc, f"{sym} t={t}: raw dict differs\n  raw={sc}\n  fac={v.raw}"
        # 2) every public attribute equals the scorer's value
        for key in PUBLIC:
            attr = ATTR.get(key, key)
            got = getattr(v, attr)
            exp = sc.get(key)
            assert got == exp or (got is None and exp is None), \
                f"{sym} t={t}: attr {attr} ({key}) {got!r} != {exp!r}"
        assert isinstance(v, RcVerdict)
        assert v.is_insufficient == (sc["final_state"] == "Insufficient")
        # 3) prior-relevant lens keys identical across the two independent chains
        for k in PRIOR_KEYS:
            assert L.get(k) == v.lenses.get(k), f"{sym} t={t}: lens[{k}] {L.get(k)!r} != {v.lenses.get(k)!r}"
        # advance both prior chains with the IDENTICAL idiom the callers use
        prior_raw = L if not L.get("insufficient") else prior_raw
        prior_fac = v.lenses if not v.lenses.get("insufficient") else prior_fac
        n += 1
        if sc["final_state"] != "Insufficient":
            n_sufficient += 1
        if sc.get("caps"):
            n_capped += 1
    return n, n_sufficient, n_capped


def main():
    cfg = yaml.safe_load(open(os.path.join(HERE, "config.yaml")))
    params, caps, windows = cfg["params"], cfg["caps"], cfg["windows"]
    full = os.environ.get("RC_GOLDEN_FULL") == "1"
    universe = cfg["universe"] if full else ["AAPL"]

    symbols = [s for s in universe if data_loader._find_csv(s, cfg)]
    if not symbols:
        print("[golden] SKIP: no local OHLC CSV found for", universe,
              "(populate research/rc1_autonomous_model/data/ohlcv/). Facade import OK.")
        # still prove the module imports + types are wired
        assert callable(score_window_input) and RcWindowInput and RcVerdict
        return 0

    total = total_suf = total_cap = 0
    for sym in symbols:
        df = data_loader._load_csv(data_loader._find_csv(sym, cfg))
        n, ns, nc = _check_symbol(sym, df, params, caps, windows)
        total += n
        total_suf += ns
        total_cap += nc
        print(f"[golden] {sym}: {n} windows identical (sufficient={ns}, capped={nc})")

    # the test must actually exercise real scoring, not an all-insufficient no-op
    assert total > 0, "no windows scored"
    assert total_suf > 0, "no sufficient windows — test did not exercise real scoring"
    assert total_cap > 0, "no capped windows — test did not exercise caps"
    print(f"[golden] PASS: facade == score_window on {total} windows across {len(symbols)} symbol(s) "
          f"(sufficient={total_suf}, capped={total_cap}). mode={'FULL' if full else 'smoke(AAPL)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
