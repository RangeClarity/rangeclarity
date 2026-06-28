#!/usr/bin/env python3
"""Build the founder review package (READ-ONLY, ADVISORY). Produces, from the agent's suggestions:
  1) founder_review_priority.csv  -- compact, priority-sorted, with blank founder_label + notes
  2) founder_review_charts.html   -- ALL clean_but_capped windows rendered with per-window anchors,
                                     sorted by priority, each linkable as #win-<SYM>-<DATE>

Does NOT modify scoring/caps/agree3, does NOT implement the A/B, does NOT touch Pine. It only READS
frozen outputs and renders calm charts (no arrows/buy/sell/entry/exit/target/prediction).
"""
from __future__ import annotations
import os, sys, csv, html

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
ULT = os.path.join(REPO, "research", "rc1_ultimate_offline_indicator")
VR = os.path.join(REPO, "research", "reports", "visual_review")
sys.path.insert(0, ULT)

import yaml
import pandas as pd
import data_loader
import structure_features as sf
import indicators as ind
import zone_engine
from rc_scoring_facade import RcWindowInput, score_window_input
import plotly.graph_objects as go

AGENT = os.path.join(VR, "agent_label_suggestions.csv")
OUT_CSV = os.path.join(VR, "founder_review_priority.csv")
OUT_HTML = os.path.join(VR, "founder_review_charts.html")
CHART_FILE = "founder_review_charts.html"

# Highest priority first (founder confirms the likely false-caps fastest), true_broken last.
PRIORITY = {"normal_pullback_false_cap": 0, "stale_zone_false_cap": 1,
            "genuinely_unclear": 2, "true_broken": 3, "unsure": 4}
TEAL, SLATE = "#2dd4bd", "#64748b"


def render_fig(df, num, highs, lows, t, params, caps_cfg):
    # Migrated to the Core Scoring facade (behavior-preserving): the same frozen scorer runs
    # underneath, consumed through the typed verdict. `sc` was unused here (the HTML shows the
    # agent-CSV values, not the live score); only the insufficient flag gates the zone bands.
    verdict = score_window_input(RcWindowInput(
        df=df, num=num, highs=highs, lows=lows, t=t,
        params=params, caps_cfg=caps_cfg, prior=None))
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
    fig.update_layout(height=340, margin=dict(l=44, r=16, t=8, b=18), xaxis_rangeslider_visible=False,
                      template="plotly_dark", paper_bgcolor="#0b0f1a", plot_bgcolor="#0b0f1a")
    return fig


def main():
    cfg = yaml.safe_load(open(os.path.join(ULT, "config.yaml")))
    params, caps_cfg = cfg["params"], cfg["caps"]
    rows = list(csv.DictReader(open(AGENT, newline="")))
    rows.sort(key=lambda r: (PRIORITY.get(r["agent_label"], 9), -float(r["confidence"] or 0)))

    # ---- 1) compact priority CSV ----
    cols = ["priority_rank", "symbol", "date", "window_t", "agent_label", "confidence",
            "broken_assessment", "reason", "visual_evidence", "chart_ref", "founder_label", "notes"]
    with open(OUT_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for i, r in enumerate(rows, 1):
            anchor = "win-%s-%s" % (r["symbol"], r["date"])
            w.writerow({
                "priority_rank": i, "symbol": r["symbol"], "date": r["date"], "window_t": r["t"],
                "agent_label": r["agent_label"], "confidence": r["confidence"],
                "broken_assessment": r["broken_zone_assessment"], "reason": r["reason"],
                "visual_evidence": r["visual_evidence"],
                "chart_ref": "%s#%s" % (CHART_FILE, anchor),
                "founder_label": "", "notes": "",
            })
    print("[pkg] wrote %s (%d rows)" % (OUT_CSV, len(rows)))

    # ---- 2) anchored charts HTML (all windows) ----
    syms = sorted({r["symbol"] for r in rows})
    data, _, _ = data_loader.load_universe(cfg, syms)
    cache = {}
    by_label = {}
    cards = []
    for i, r in enumerate(rows, 1):
        sym, t = r["symbol"], int(r["t"])
        if sym not in cache:
            df = data.get(sym)
            if df is None:
                cache[sym] = (None, None, None, None)
            else:
                num = sf.compute_frame(df, params)
                highs, lows = ind.confirmed_pivots(df, 5)
                cache[sym] = (df, num, highs, lows)
        df, num, highs, lows = cache[sym]
        by_label[r["agent_label"]] = by_label.get(r["agent_label"], 0) + 1
        anchor = "win-%s-%s" % (sym, r["date"])
        title = "#%d  %s @ %s  --  agent: %s (conf %s)" % (i, sym, r["date"], r["agent_label"], r["confidence"])
        meta = ("broken: %s  &middot;  engine: %s (%s)  &middot;  zone=%s  &middot;  loc=%s  &middot;  regime=%s  "
                "&middot;  ext=%s  &middot;  trend=%s  &middot;  caps: %s" %
                (r["broken_zone_assessment"], r["final_state"], r["final_score"], r["zone"], r["location"],
                 r["regime"], r["extension"], r["trend"], r["binding_cap"]))
        if df is None:
            chart = "<div class='warn'>bars for %s not found</div>" % html.escape(sym)
        else:
            fig = render_fig(df, num, highs, lows, t, params, caps_cfg)
            chart = fig.to_html(full_html=False, include_plotlyjs=False)
        card = (("<div class='card' id='%s'>" % anchor) +
                "<h3>" + html.escape(title) + "</h3>" +
                "<div class='meta'>" + meta + "</div>" +
                "<div class='reason'><b>why agent:</b> " + html.escape(r["reason"]) + "</div>" +
                "<div class='evi'>" + html.escape(r["visual_evidence"]) + "</div>" +
                "<div class='ask'>Your label &rarr; write in <code>founder_labels_template.csv</code>: "
                "true_broken / stale_zone_false_cap / normal_pullback_false_cap / genuinely_unclear / unsure</div>" +
                chart + "</div>")
        cards.append((r["agent_label"], card))

    order = ["normal_pullback_false_cap", "stale_zone_false_cap", "genuinely_unclear", "true_broken", "unsure"]
    nav = " &middot; ".join("<a href='#%s'>%s (%d)</a>" % (L, L, by_label.get(L, 0)) for L in order if by_label.get(L))
    head = ("<!doctype html><html><head><meta charset='utf-8'><title>RC-1 Founder Review</title>"
            "<script src='https://cdn.plot.ly/plotly-2.35.2.min.js'></script><style>"
            "body{background:#070a12;color:#e6edf3;font-family:system-ui,Segoe UI,Roboto,sans-serif;margin:18px}"
            "h1{font-size:20px}h2{font-size:16px;margin:22px 0 6px;color:#e2e8f0;border-top:1px solid #1f2937;padding-top:14px}"
            "h3{font-size:14px;margin:.3rem 0;color:#cbd5e1}"
            ".card{background:#0b0f1a;border:1px solid #1f2937;border-radius:12px;padding:12px;margin:14px 0}"
            ".meta{color:#94a3b8;font-size:12px;margin:2px 0 6px}.reason{color:#cbd5e1;font-size:12.5px;margin:2px 0}"
            ".evi{color:#7f8da3;font-size:11.5px;font-family:ui-monospace,Consolas,monospace;margin:2px 0 6px}"
            ".ask{color:#2dd4bd;font-size:12px;margin:4px 0 8px}.warn{color:#f59e0b;font-size:12px}"
            "a{color:#2dd4bd;text-decoration:none}nav{margin:10px 0 6px;font-size:13px}code{color:#cbd5e1}"
            ".note{color:#94a3b8;font-size:12px;margin-bottom:8px}</style></head><body>")
    parts = [head, "<h1>RC-1 Founder Review &mdash; clean_but_capped (%d windows)</h1>" % len(rows),
             "<div class='note'>Advisory, read-only. Agent suggestions never change scoring; your label is the truth. "
             "Calm structure only &mdash; no signals, no prediction. RC Score is permission, not prediction. Conviction RED.</div>",
             "<nav>" + nav + "</nav>"]
    labels_seen = {}
    for L in order:
        group = [c for (lab, c) in cards if lab == L]
        if not group:
            continue
        parts.append("<h2 id='%s'>%s (%d)</h2>" % (L, L, len(group)))
        parts.extend(group)
    parts.append("</body></html>")
    open(OUT_HTML, "w", encoding="utf-8").write("\n".join(parts))
    print("[pkg] wrote %s (%d charts) label_counts=%s" % (OUT_HTML, len(cards), by_label))


if __name__ == "__main__":
    main()
