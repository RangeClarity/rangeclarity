"""RC-1 FULL real-data baseline + visual review (resumable, per-symbol cache).
RESEARCH ONLY. Read-only over the frozen engine: NO scoring change, NO cap change, NO
agree3 loosening, NO Pine, NO trade language. 'real' mode uses ONLY real CSVs (no synthetic
fallback); symbols without a CSV (e.g. F) are skipped.

Usage (resumable; each call scores up to --max-new uncached symbols, then aggregates):
  python research/full_real_review.py            # process a batch + aggregate
  python research/full_real_review.py --max-new 99 --charts 32   # full in one go (local)
"""
from __future__ import annotations
import os
import sys
import json
import hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
ULT = os.path.join(ROOT, "rc1_ultimate_offline_indicator")
OUT = os.path.join(ROOT, "reports", "visual_review")
CACHE = os.path.join(OUT, "cache")
sys.path.insert(0, ULT)
sys.path.insert(0, ROOT)

import yaml
import pandas as pd
import data_loader
import structure_features as sf
import indicators as ind
from negative_first_scorer import score_window

ROWCOLS = ["symbol", "t", "date", "final_state", "final_score", "final_band", "caps",
           "weakest_lens", "agreement_count", "why_not_higher", "trend", "zone", "location",
           "regime", "extension", "false_high_self_flag"]


def _phash(params):
    return hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]


def _fingerprint(df, params):
    return str(len(df)) + "|" + str(df["date"].iloc[-1]) + "|" + _phash(params)


def score_symbol(sym, df, cfg):
    params, caps = cfg["params"], cfg["caps"]
    num = sf.compute_frame(df, params)
    highs, lows = ind.confirmed_pivots(df, 5)
    minb, step, hz = cfg["windows"]["min_bars"], cfg["windows"]["step"], cfg["windows"]["proxy_horizon"]
    rows, prior = [], None
    for t in range(minb, len(df) - hz - 1, step):
        sc, L = score_window(df, num, highs, lows, t, params, caps, prior)
        r = {"symbol": sym, "t": int(t), "date": str(df["date"].iloc[t])}
        for k in ROWCOLS[3:]:
            r[k] = sc.get(k)
        rows.append(r)
        prior = L if not L.get("insufficient") else prior
    return pd.DataFrame(rows, columns=ROWCOLS)


def categorize(r):
    caps = [c for c in str(r.get("caps") or "").split(";") if c and c != "agree3"]
    high = r["final_state"] in ("Clear", "HighClarity")
    s = r["final_score"]
    if high and (bool(r.get("false_high_self_flag")) or caps):
        return "suspicious_high"
    if (r["trend"] == "Clean" and r["regime"] in ("Trend", "Range")
            and r["extension"] in ("Normal", "Stretched") and r["final_state"] in ("Mixed", "Unclear")):
        return "clean_but_capped"
    if s is not None and not pd.isna(s) and 60 <= s <= 74:
        return "borderline"
    if r["agreement_count"] in (2, 3) and r["final_state"] == "Mixed":
        return "uncertain"
    if caps and r["final_state"] in ("Mixed", "Unclear", "Insufficient"):
        return "caps_saved"
    return "other"


CATS = ["clean_but_capped", "suspicious_high", "borderline", "caps_saved", "uncertain"]


def main():
    argv = sys.argv
    max_new = int(argv[argv.index("--max-new") + 1]) if "--max-new" in argv else 6
    charts_n = int(argv[argv.index("--charts") + 1]) if "--charts" in argv else 30
    cfg = yaml.safe_load(open(os.path.join(ULT, "config.yaml")))
    os.makedirs(CACHE, exist_ok=True)
    idx_path = os.path.join(CACHE, "_index.json")
    index = json.load(open(idx_path)) if os.path.isfile(idx_path) else {}
    real = [s for s in cfg["universe"] if data_loader._find_csv(s, cfg)]
    missing = [s for s in cfg["universe"] if s not in real]
    new = 0
    for sym in real:
        f = data_loader._find_csv(sym, cfg)
        df = data_loader._load_csv(f)
        fp = _fingerprint(df, cfg["params"])
        cf = os.path.join(CACHE, sym + ".csv")
        if index.get(sym) == fp and os.path.isfile(cf):
            continue
        if new >= max_new:
            continue
        score_symbol(sym, df, cfg).to_csv(cf, index=False)
        index[sym] = fp
        new += 1
        print("[full] scored " + sym)
    json.dump(index, open(idx_path, "w"), indent=0)
    cached = [s for s in real if os.path.isfile(os.path.join(CACHE, s + ".csv"))]
    frames = [pd.read_csv(os.path.join(CACHE, s + ".csv")) for s in cached]
    allr = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame(columns=ROWCOLS)
    remaining = [s for s in real if s not in cached or index.get(s) is None]
    todo = [s for s in real if not (index.get(s) and os.path.isfile(os.path.join(CACHE, s + ".csv")))]
    # ---- aggregates ----
    n = len(allr)
    allr["category"] = allr.apply(categorize, axis=1) if n else []
    def cap_has(col, names):
        return allr["caps"].fillna("").apply(lambda c: any(x in str(c).split(";") for x in names))
    state_dist = allr["final_state"].value_counts().to_dict() if n else {}
    clear_high = int(allr["final_state"].isin(["Clear", "HighClarity"]).sum()) if n else 0
    caps_expl = allr["caps"].fillna("").str.split(";").explode()
    caps_expl = caps_expl[caps_expl.str.len() > 0]
    cap_dist = caps_expl.value_counts().to_dict() if n else {}
    rates = {} if not n else {
        "agree3_binding": round(cap_has("a", ["agree3"]).mean(), 4),
        "zone_binding": round(cap_has("z", ["broken", "weakzone"]).mean(), 4),
        "extension_binding": round(cap_has("e", ["severe", "extended"]).mean(), 4),
        "chop_binding": round(cap_has("c", ["chop", "compression"]).mean(), 4)}
    weakest = allr["weakest_lens"].value_counts().to_dict() if n else {}
    # outputs
    if n:
        sd = pd.DataFrame(sorted(state_dist.items()), columns=["state", "count"]); sd.to_csv(os.path.join(OUT, "real_state_distribution.csv"), index=False)
        pd.DataFrame(sorted(cap_dist.items(), key=lambda x: -x[1]), columns=["cap", "count"]).to_csv(os.path.join(OUT, "real_cap_distribution.csv"), index=False)
        persym = allr.groupby("symbol").apply(lambda g: pd.Series({
            "windows": len(g), "clear_plus": int(g["final_state"].isin(["Clear", "HighClarity"]).sum()),
            "clean_but_capped": int((g["category"] == "clean_but_capped").sum()),
            "top_weakest": g["weakest_lens"].mode().iloc[0] if len(g) else "-"})).reset_index()
        persym.to_csv(os.path.join(OUT, "real_per_symbol_summary.csv"), index=False)
        q = []
        for c in CATS:
            sub = allr[allr["category"] == c].copy()
            sub = sub.sort_values("final_score", ascending=(c != "suspicious_high")).head(40)
            q.append(sub)
        fq = pd.concat(q, ignore_index=True) if q else allr.iloc[0:0]
        fq[["symbol", "t", "date", "category", "final_state", "final_score", "caps",
            "weakest_lens", "agreement_count", "trend", "zone", "location", "regime",
            "extension", "why_not_higher"]].to_csv(os.path.join(OUT, "founder_review_queue.csv"), index=False)
    # ---- HTML (only when all real symbols cached) ----
    html_note = "deferred (run again until all symbols cached)"
    if n and not todo:
        _render_html(cfg, allr, cached, missing, state_dist, charts_n)
        html_note = os.path.join(OUT, "index.html")
    print("[full] cached " + str(len(cached)) + "/" + str(len(real)) + " real symbols; new this run=" + str(new) +
          "; remaining=" + str(todo))
    print("[full] windows=" + str(n) + " state=" + str(state_dist) + " Clear+High=" + str(clear_high))
    print("[full] binding rates=" + str(rates))
    print("[full] weakest_lens=" + str(weakest))
    print("[full] categories=" + (str(allr["category"].value_counts().to_dict()) if n else "{}"))
    print("[full] HTML -> " + html_note)


def _render_html(cfg, allr, cached, missing, state_dist, charts_n):
    from render_visual_review import _fig, _audit
    params, caps = cfg["params"], cfg["caps"]
    # pick review windows: spread across categories
    picks = []
    per = max(4, charts_n // len(CATS))
    for c in CATS:
        sub = allr[allr["category"] == c].sort_values("final_score", ascending=(c != "suspicious_high")).head(per)
        for _, r in sub.iterrows():
            picks.append((r["symbol"], int(r["t"]), c))
    by = {c: [] for c in CATS}
    cacheframe = {}
    for sym, t, c in picks:
        if sym not in cacheframe:
            df = data_loader._load_csv(data_loader._find_csv(sym, cfg))
            cacheframe[sym] = (df, sf.compute_frame(df, params), ind.confirmed_pivots(df, 5))
        df, num, (highs, lows) = cacheframe[sym][0], cacheframe[sym][1], (cacheframe[sym][2])
        sc, fig = _fig(df, num, highs, lows, t, params, caps)
        import html as _h
        div = fig.to_html(full_html=False, include_plotlyjs=False)
        card = '<div class="card"><h3>' + _h.escape(sym + " - " + str(sc["final_state"]) + " (" + str(sc["final_score"]) + ")  [" + c + "]") + '</h3><pre>' + _h.escape(_audit(sym, t, df, sc)) + '</pre>' + div + '</div>'
        by[c].append(card)
    banner = ("SOURCE = Yahoo/yfinance fallback (NOT final vendor). real " + str(len(cached)) + "/" +
              str(len(cfg["universe"])) + " symbols" + ("; missing: " + ", ".join(missing) if missing else "") +
              ". FULL real baseline. Conviction RED - not validation. State distribution: " + str(state_dist) + ".")
    nav = " &middot; ".join('<a href="#' + c + '">' + c + " (" + str(len(by[c])) + ")</a>" for c in CATS)
    head = ("<!doctype html><html><head><meta charset='utf-8'><title>RC-1 Full Real Review</title>"
            "<script src='https://cdn.plot.ly/plotly-2.35.2.min.js'></script><style>"
            "body{background:#070a12;color:#e6edf3;font-family:system-ui,Segoe UI,Roboto,sans-serif;margin:18px}"
            "h1{font-size:20px}h3{font-size:14px;margin:.4rem 0;color:#cbd5e1}"
            ".card{background:#0b0f1a;border:1px solid #1f2937;border-radius:12px;padding:12px;margin:14px 0}"
            "pre{white-space:pre-wrap;color:#9aa3b2;font-size:12px}a{color:#2dd4bd;text-decoration:none}"
            "nav{margin:10px 0 16px}.note{color:#94a3b8;font-size:12px}</style></head><body>")
    parts = [head, "<h1>RC-1 Full Real Visual Review</h1>", "<div class='note'>" + banner +
             " No trade signals; state + caps + audit only. RC Score is permission, not prediction.</div>",
             "<nav>" + nav + "</nav>"]
    for c in CATS:
        if by[c]:
            parts.append("<h2 id='" + c + "'>" + c + " (" + str(len(by[c])) + ")</h2>")
            parts.extend(by[c])
    parts.append("</body></html>")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write("\n".join(parts))


if __name__ == "__main__":
    main()
