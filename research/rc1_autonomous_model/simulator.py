"""Simulation runner: per symbol/window compute features -> weak label -> score.
Future bars used ONLY for evaluation proxies, NEVER in scoring. Cache lets the
optimizer reuse numeric features/pivots across parameter configs (thresholds only
change in derive_states; numeric uses fixed donchian_n)."""
from __future__ import annotations
import numpy as np
import pandas as pd
from features import compute_numeric, confirmed_pivots, derive_states
from weak_labeler import weak_label
from negative_first_scorer import score_case
from schemas import FATAL_REJECT_REASONS


def build_cache(data, params):
    cache = {}
    for sym, df in data.items():
        num = compute_numeric(df, params)
        highs, lows = confirmed_pivots(df, 5)
        cache[sym] = (df, num, highs, lows)
    return cache


def _future_proxies(num, t, horizon):
    end = min(len(num) - 1, t + horizon)
    if end <= t + 2:
        return {}
    fut = num.iloc[t + 1:end + 1]
    return dict(future_er=float(np.nanmean(fut["er"])),
                future_ci=float(np.nanmean(fut["ci"])),
                future_ext=float(np.nanmean(fut["ext_atr"])))


def simulate_from_cache(cache, params, cfg, ablation=None):
    rows = []
    horizon = cfg["windows"]["proxy_horizon"]
    minb, step = cfg["windows"]["min_bars"], cfg["windows"]["step"]
    for sym, (df, num, highs, lows) in cache.items():
        prior = None
        last = len(df) - horizon - 1
        for t in range(minb, last, step):
            feat = derive_states(df, num, highs, lows, t, params, ablation=ablation)
            sc = score_case(feat, prior)
            wl, reason = weak_label(feat)
            high = sc.final_state in ("Clear", "HighClarity")
            number_on_insufficient = bool(feat.get("insufficient") and sc.final_score is not None)
            false_high = bool(high and wl == "reject")
            fatal = bool((sc.final_state in ("Clear", "HighClarity") and reason in FATAL_REJECT_REASONS)
                         or number_on_insufficient)
            row = dict(symbol=sym, t=int(t), date=str(df["date"].iloc[t]),
                       weak_label=wl, weak_reason=reason,
                       final_score=sc.final_score, final_state=sc.final_state, final_band=sc.final_band,
                       caps=";".join(sc.triggered_caps), weakest_lens=sc.weakest_lens,
                       agreement_count=sc.agreement_count, why_not_higher=sc.why_not_higher,
                       false_high_proxy=false_high, fatal_false_high_proxy=fatal,
                       false_high_self_flag=sc.false_high_risk)
            if not feat.get("insufficient"):
                row.update(trend=feat["trend"], location=feat["location"], zone=feat["zone"],
                           regime=feat["regime"], extension=feat["extension"],
                           ci=feat.get("ci"), er=feat.get("er"), adx=feat.get("adx"),
                           ext_atr=feat.get("ext_atr"))
            row.update(_future_proxies(num, t, horizon))
            rows.append(row)
            prior = feat if not feat.get("insufficient") else prior
    return pd.DataFrame(rows)


def simulate(data, params, cfg, ablation=None):
    return simulate_from_cache(build_cache(data, params), params, cfg, ablation)
