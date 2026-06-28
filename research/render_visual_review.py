"""RC-1 Visual Review Harness (headless Plotly HTML). RESEARCH VISUALISATION ONLY.
Reads CSVs from rc1_autonomous_model/data/ohlcv (or synthetic fallback), scores recent
windows with the FROZEN rc1_ultimate_offline_indicator engine (read-only), categorizes
each window, and writes research/reports/visual_review/index.html. Calm zone bands, price
line, NO arrows/buy/sell/entry/exit/target/setup/prediction. State words + caps + audit only.
Run:  python research/render_visual_review.py [--per-symbol 2]
"""
from __future__ import annotations
import os
import sys
import html

ROOT = os.path.dirname(os.path.abspath(__file__))
ULT = os.path.join(ROOT, "rc1_ultimate_offline_indicator")
OUTDIR = os.path.join(ROOT, "reports", "visual_review")
sys.path.insert(0, ULT)

import yaml
import pandas as pd
import data_loader
import structure_features as sf
import indicators as ind
import zone_engine
from rc_scoring_facade import RcWindowInput, score_window_input
import plotly.graph_objects as go

TEAL, SLATE = "#2dd4bd", "#64748b"
CATS = ["suspicious_high", "borderline", "caps_saved", "uncertain", "other"]


def _categorize(sc):
    caps = [c for c in str(sc.get("caps", "")).split(";") if c and c != "agree3"]
    high = sc["final_state"] in ("Clear", "HighClarity")
    s = sc["final_score"]
    if high and (sc.get("false_high_self_flag") or caps):
        return "suspicious_high"
    if caps and sc["final_state"] in ("Mixed", "Unclear", "Insufficient"):
        return "caps_saved"
    if s is not None and 60 <= s <= 74:
        return "borderline"
    if sc["agreement_count"] in (2, 3) and sc["final_state"] == "Mixed":
        return "uncertain"
    return "other"


def _audit(sym, t, df, sc):
    g = lambda k: sc.get(k, "-")
    return (sym + " @ " + str(df["date"].iloc[t]) + "  |  STATE: " + str(sc["final_state"]) +
            "  score: " + str(sc["final_score"]) + "  band: " + str(sc["final_band"]) +
            "\ncaps: " + (str(sc.get("caps")) or "-") + "   weakest_lens: " + str(sc["weakest_lens"]) +
            "   agreement: " + str(sc["agreement_count"]) + "/6" +
            "\nlenses: trend=" + str(g("trend")) + " zone=" + str(g("zone")) + " location=" +
            str(g("location")) + " regime=" + str(g("regime")) + " extension=" + str(g("extension")) +
            "\nwhy_not_higher: " + str(sc["why_not_higher"]))


def _fig(df, num, highs, lows, t, params, caps_cfg):
    # Migrated to the Core Scoring facade (behavior-preserving). verdict.raw is the exact verdict
    # dict the frozen scorer returned, so every downstream consumer (_categorize/_audit/main, and
    # full_real_review._render_html which imports _fig/_audit) is byte-identical. prior=None as before.
    verdict = score_window_input(RcWindowInput(
        df=df, num=num, highs=highs, lows=lows, t=t,
        params=params, caps_cfg=caps_cfg, prior=None))
    sc = verdict.raw
    w = df.iloc[max(0, t - 150):t + 1]
    fig = go.Figure(go.Candlestick(x=w["date"], open=w["open"], high=w["high"], low=w["low"],
                    close=w["close"], increasing_line_color=TEAL, decreasing_line_color=SLATE,
                    increasing_fillcolor=TEAL, decreasing_fillcolor=SLATE, showlegend=False))
    close_t = float(df["close"].iloc[t])
    atr_t = float(num["atr"].iloc[t]) if not pd.isna(num["atr"].iloc[t]) else 0.0
    fig.add_hline(y=close_t, line=dict(color=SLATE, width=1, dash="dot"))
    if atr_t > 0 and not verdict.is_insufficient:
        z = zone_engine.zones_asof(df, highs, lows, t, atr_t, params)
        hw = 0.5 * atr_t
        x0, x1 = w["date"].iloc[0], w["date"].iloc[-1]
        if z["has_sup"] and not pd.isna(z["sup_d"]):
            m = close_t - z["sup_d"] * atr_t
            fig.add_shape(type="rect", x0=x0, x1=x1, y0=m - hw, y1=m + hw, line=dict(width=0),
                          fillcolor="rgba(45,212,189,0.12)", layer="below")
        if z["has_res"] and not pd.isna(z["res_d"]):
            m = close_t + z["res_d"] * atr_t
            fig.add_shape(type="rect", x0=x0, x1=x1, y0=m - hw, y1=m + hw, line=dict(width=0),
                          fillcolor="rgba(100,116,139,0.14)", layer="below")
    fig.update_layout(height=360, margin=dict(l=42, r=18, t=8, b=18), xaxis_rangeslider_visible=False,
                      template="plotly_dark", paper_bgcolor="#0b0f1a", plot_bgcolor="#0b0f1a")
    return sc, fig


def main():
    per_sym = 2
    if "--per-symbol" in sys.argv:
        per_sym = int(sys.argv[sys.argv.index("--per-symbol") + 1])
    cfg = yaml.safe_load(open(os.path.join(ULT, "config.yaml")))
    params, caps_cfg = cfg["params"], cfg["caps"]
    real_syms = [s for s in cfg["universe"] if data_loader._find_csv(s, cfg)]
    missing = [s for s in cfg["universe"] if s not in real_syms]
    syms = real_syms if real_syms else cfg["universe"]
    source = "real CSV" if real_syms else "synthetic"
    data, _, _ = data_loader.load_universe(cfg, syms)
    minb, step, hz = cfg["windows"]["min_bars"], cfg["windows"]["step"], cfg["windows"]["proxy_horizon"]
    by_cat = {c: [] for c in CATS}
    dist = {}
    for sym in syms:
        df = data[sym]
        num = sf.compute_frame(df, params)
        highs, lows = ind.confirmed_pivots(df, 5)
        last = len(df) - hz - 1
        ts = sorted(set(max(minb, last - i * step) for i in range(per_sym)))
        for t in ts:
            sc, fig = _fig(df, num, highs, lows, t, params, caps_cfg)
            dist[sc["final_state"]] = dist.get(sc["final_state"], 0) + 1
            cat = _categorize(sc)
            div = fig.to_html(full_html=False, include_plotlyjs=False)
            title = html.escape(sym + " - " + str(sc["final_state"]) + " (" + str(sc["final_score"]) + ")  [" + cat + "]")
            card = '<div class="card"><h3>' + title + '</h3><pre>' + html.escape(_audit(sym, t, df, sc)) + '</pre>' + div + '</div>'
            by_cat[cat].append(card)
    os.makedirs(OUTDIR, exist_ok=True)
    banner = ("SOURCE = " + source + ": " + str(len(real_syms)) + "/" + str(len(cfg["universe"])) +
              " symbols from CSV" + ("; missing: " + ", ".join(missing) if missing else "") +
              ". Research visualisation only - not validation; conviction RED.")
    nav = " &middot; ".join('<a href="#' + c + '">' + c + " (" + str(len(by_cat[c])) + ")</a>" for c in CATS)
    head = ("<!doctype html><html><head><meta charset='utf-8'><title>RC-1 Visual Review</title>"
            "<script src='https://cdn.plot.ly/plotly-2.35.2.min.js'></script><style>"
            "body{background:#070a12;color:#e6edf3;font-family:system-ui,Segoe UI,Roboto,sans-serif;margin:18px}"
            "h1{font-size:20px}h3{font-size:14px;margin:.4rem 0;color:#cbd5e1}"
            ".card{background:#0b0f1a;border:1px solid #1f2937;border-radius:12px;padding:12px;margin:14px 0}"
            "pre{white-space:pre-wrap;color:#9aa3b2;font-size:12px}a{color:#2dd4bd;text-decoration:none}"
            "nav{margin:10px 0 16px}.note{color:#94a3b8;font-size:12px}</style></head><body>")
    parts = [head, "<h1>RC-1 Visual Review</h1>",
             "<div class='note'>" + banner + " State distribution this view: " + str(dist) +
             ". No trade signals; state words + caps + audit only. RC Score is permission, not prediction.</div>",
             "<nav>" + nav + "</nav>"]
    for c in CATS:
        if by_cat[c]:
            parts.append("<h2 id='" + c + "'>" + c + " (" + str(len(by_cat[c])) + ")</h2>")
            parts.extend(by_cat[c])
    parts.append("</body></html>")
    out = os.path.join(OUTDIR, "index.html")
    open(out, "w", encoding="utf-8").write("\n".join(parts))
    n = sum(len(v) for v in by_cat.values())
    print("[viz] source=" + source + " real=" + str(len(real_syms)) + "/" + str(len(cfg["universe"])) +
          " charts=" + str(n) + " dist=" + str(dist) + " -> " + out)


if __name__ == "__main__":
    main()
