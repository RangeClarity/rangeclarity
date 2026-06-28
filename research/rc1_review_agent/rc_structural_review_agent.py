#!/usr/bin/env python3
"""RC Structural Review Agent -- READ-ONLY, ADVISORY assistant for founder review.

PURPOSE
  Assist (NOT replace) the founder's review of `clean_but_capped` windows by proposing, for each
  one, a structural-clarity label + confidence + reason + the visual evidence that mattered + whether
  the Broken-Zone flag looks valid or spurious.

HARD GUARDRAILS
  - Does NOT modify scoring, caps, agree3, or any engine config. It only READS frozen outputs and
    recomputes independent, read-only diagnostics from the same bars the chart is drawn from.
  - Does NOT implement the A/B test. Does NOT create or touch Pine.
  - No buy/sell/entry/exit language. No prediction. No trade-quality scoring. Structural clarity only.
  - If the evidence does not clearly separate the cases, it labels `unsure`.

LABELS (exactly one per window)
  true_broken | stale_zone_false_cap | normal_pullback_false_cap | genuinely_unclear | unsure

The thresholds below are ADVISORY REVIEW HEURISTICS for this assistant only. They are deliberately
separate from the engine and never feed back into any score. They are echoed into the output so the
founder can see and discount them.
"""
from __future__ import annotations
import os, sys, csv
import numpy as np

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

# ---- ADVISORY review heuristics (NOT engine params; not scoring) ----
DECISIVE_BREAK_ATR = 1.0     # close >= this far below the in-play level = decisive
SHALLOW_BREAK_ATR  = 0.5     # close <= this far below = marginal / ordinary pullback
SUSTAIN_BARS       = 3       # closes kept below the broken threshold = persistence
RECLAIM_PULLBACK_ATR = 1.5   # reclaimed dip no deeper than this = ordinary pullback (else volatile round-trip)
STALE_AGE_BARS     = 250     # constituent pivots older than this = stale level (matches zone_fresh_bars)
CONF_CAP           = 0.85    # this is an assistant; never assert certainty
CONF_MIN           = 0.30

QUEUE = os.path.join(VR, "founder_review_queue.csv")
TEMPLATE = os.path.join(VR, "founder_labels_template.csv")
OUT = os.path.join(VR, "agent_label_suggestions.csv")
CMP = os.path.join(VR, "agent_vs_founder_comparison.md")

LABELS = ["true_broken", "stale_zone_false_cap", "normal_pullback_false_cap",
          "genuinely_unclear", "unsure"]


def _clamp(x):
    return max(CONF_MIN, min(CONF_CAP, round(float(x), 2)))


def diagnostics(df, num, highs, lows, t, params):
    """Read-only replication of what zone_engine.zones_asof sees, plus extra diagnostics about the
    cluster(s) that trip the Broken flag. Returns a dict; never mutates the engine."""
    out = {"ok": False}
    if t >= len(df):
        return out
    atr_t = float(num["atr"].iloc[t]) if not pd.isna(num["atr"].iloc[t]) else 0.0
    if atr_t <= 0:
        return out
    close_t = float(df["close"].iloc[t])
    tol = params["zone_cluster_atr"] * atr_t
    bt = params["zone_broken_atr"] * atr_t
    sup_pivots = [(ci, v) for (ci, v) in lows if ci <= t]
    sup = zone_engine._cluster([v for (ci, v) in sup_pivots], tol)
    below = [z for z in sup if z[0] < close_t]
    nsup = max(below, key=lambda z: z[0]) if below else None
    nsup_d = abs(close_t - nsup[0]) / atr_t if nsup else float("nan")
    recent = df["close"].iloc[max(0, t - 20):t + 1]

    trips = []
    for (m, k) in sup:
        below_mask = recent < (m - bt)
        above_mask = recent > m
        if bool(below_mask.any()) and bool(above_mask.any()):
            pen = (m - float(recent.min())) / atr_t if float(recent.min()) < m else 0.0
            bars_below = int(below_mask.sum())
            reclaimed = bool(close_t >= m)
            ordered = False
            seen_above = False
            for cval in recent.values:
                if cval > m:
                    seen_above = True
                elif seen_above and cval < (m - bt):
                    ordered = True
                    break
            ages = [t - ci for (ci, v) in sup_pivots if abs(v - m) <= tol]
            pivot_age = int(min(ages)) if ages else 999
            dist_atr = abs(close_t - m) / atr_t
            is_inplay = (nsup is not None and abs(m - nsup[0]) <= 1e-9) or (dist_atr <= params["near_zone_atr"])
            trips.append(dict(m=m, k=int(k), pen=pen, bars_below=bars_below, reclaimed=reclaimed,
                              ordered=ordered, pivot_age=pivot_age, dist_atr=dist_atr, is_inplay=is_inplay))
    out.update(ok=True, atr_t=atr_t, close_t=close_t, n_sup=len(sup), nsup_d=nsup_d,
               nsup_level=(nsup[0] if nsup else float("nan")), trips=trips)
    try:
        z = zone_engine.zones_asof(df, highs, lows, t, atr_t, params)
        out["engine_broken"] = bool(z.get("broken"))
        out["engine_zone_state"] = z.get("state")
    except Exception:
        out["engine_broken"] = None
        out["engine_zone_state"] = None
    return out


def _binding_trip(diag):
    """Pick the trip that best explains the cap: prefer an in-play trip; else the nearest trip."""
    trips = diag.get("trips", [])
    if not trips:
        return None
    inplay = [x for x in trips if x["is_inplay"]]
    if inplay:
        return min(inplay, key=lambda x: x["dist_atr"])
    return min(trips, key=lambda x: x["dist_atr"])


def decide(row, diag):
    """Transparent decision tree -> (label, confidence, broken_assessment, reason, evidence).
    Reasons are comma-free so the CSV is portable regardless of quoting."""
    why = (row.get("why_not_higher") or "").lower()
    regime = row.get("regime", "?")
    contradictory_binds = ("contradictory" in why) or (str(row.get("final_score")) == "40")

    if not diag.get("ok"):
        return ("unsure", CONF_MIN, "uncertain",
                "Diagnostics unavailable for this window (missing bars / no ATR); cannot assess the Broken flag.",
                "no bar diagnostics")

    trip = _binding_trip(diag)
    if trip is None:
        return ("unsure", CONF_MIN, "uncertain",
                "Engine marks zone=Broken but the read-only replication found no tripping support cluster; needs a human look.",
                "no tripping cluster reproduced")

    pen, br, rc = trip["pen"], trip["bars_below"], trip["reclaimed"]
    age, inplay, dist = trip["pivot_age"], trip["is_inplay"], trip["dist_atr"]
    nsup_d = diag.get("nsup_d", float("nan"))
    ev = ("pen=%.2f ATR; bars_below=%d; reclaimed=%s; trip_inplay=%s; trip_dist=%.1f ATR; "
          "nearest_support=%.1f ATR; pivot_age=%d bars" % (pen, br, rc, inplay, dist, nsup_d, age))

    # 0) A structural contradiction is the binding cap -> the Broken question is not what holds it down.
    if contradictory_binds:
        ba = "spurious (pullback)" if (pen <= SHALLOW_BREAK_ATR or rc) else (
             "valid" if (pen >= DECISIVE_BREAK_ATR and not rc and br >= SUSTAIN_BARS) else "uncertain")
        reason = ("Binding cap is 'contradictory' - structure conflicts with the Clean trend at this bar; "
                  "clarity is held down by that conflict not only by Broken. The Broken flag itself looks %s." % ba)
        return ("genuinely_unclear", _clamp(0.50), ba, reason, ev)

    # 1) Stale: a non-primary / old cluster trips while the nearest in-play support is intact.
    nearest_tripped = any(x["is_inplay"] for x in diag["trips"])
    if (not inplay) and (not nearest_tripped):
        conf = 0.55 + min(0.25, 0.05 * dist) + (0.05 if age > STALE_AGE_BARS else 0.0)
        reason = ("Broken fired on a secondary support ~%.1f ATR from price while the nearest in-play support "
                  "(~%.1f ATR) did not break; constituent pivots ~%d bars old. Nearest structure intact." %
                  (dist, nsup_d, age))
        return ("stale_zone_false_cap", _clamp(conf), "spurious (stale)", reason, ev)
    if inplay and age > STALE_AGE_BARS and pen < DECISIVE_BREAK_ATR:
        conf = 0.5 + min(0.25, 0.0005 * age)
        reason = ("In-play support is built from old pivots (~%d bars) and the penetration is non-decisive "
                  "(%.2f ATR); the level looks stale rather than freshly broken." % (age, pen))
        return ("stale_zone_false_cap", _clamp(conf), "spurious (stale)", reason, ev)

    # 2) Decisive + sustained + un-reclaimed break of the in-play level -> genuinely broken.
    if inplay and pen >= DECISIVE_BREAK_ATR and (not rc) and br >= SUSTAIN_BARS:
        conf = 0.55 + 0.12 * (pen - DECISIVE_BREAK_ATR) + 0.03 * (br - SUSTAIN_BARS)
        reason = ("Decisive close-through of the in-play support by %.2f ATR over %d bars below the broken "
                  "threshold with no reclaim at this bar - consistent with a genuine structural break." % (pen, br))
        return ("true_broken", _clamp(conf), "valid", reason, ev)

    # 3) Reclaimed: price closed back above the in-play level at this bar.
    if inplay and rc:
        if pen <= RECLAIM_PULLBACK_ATR and br <= SUSTAIN_BARS:
            conf = 0.60 + (RECLAIM_PULLBACK_ATR - pen) * 0.10
            reason = ("Price dipped %.2f ATR below the in-play support within the window but reclaimed it by this "
                      "bar with a Clean trend / %s regime - an ordinary pullback through the level not a break." %
                      (pen, regime))
            return ("normal_pullback_false_cap", _clamp(conf), "spurious (pullback)", reason, ev)
        reason = ("Price made a deep %.2f ATR excursion below the in-play support then reclaimed it by this bar - "
                  "a volatile round-trip; not currently broken but not clean structure either." % pen)
        return ("genuinely_unclear", _clamp(0.48), "uncertain", reason, ev)

    # 4) Not reclaimed, in-play, but not decisive+sustained.
    if inplay and pen <= SHALLOW_BREAK_ATR:
        conf = 0.55 + (SHALLOW_BREAK_ATR - pen) * 0.4
        reason = ("Only a %.2f ATR close below the in-play support with a Clean trend / %s regime - reads as a "
                  "marginal pullback through the level not a structural break." % (pen, regime))
        return ("normal_pullback_false_cap", _clamp(conf), "spurious (pullback)", reason, ev)
    if inplay and pen >= DECISIVE_BREAK_ATR and br < SUSTAIN_BARS:
        reason = ("Decisive %.2f ATR penetration of the in-play support but only %d bar(s) below the threshold - "
                  "a fresh unconfirmed break; too early to call broken vs pullback." % (pen, br))
        return ("genuinely_unclear", _clamp(0.45), "uncertain", reason, ev)
    if inplay and SHALLOW_BREAK_ATR < pen < DECISIVE_BREAK_ATR:
        reason = ("Moderate %.2f ATR penetration of the in-play support over %d bars with no reclaim - evidence "
                  "does not cleanly separate a real break from a pullback." % (pen, br))
        return ("genuinely_unclear", _clamp(0.45), "uncertain", reason, ev)

    # 5) Fallback.
    return ("unsure", _clamp(0.35), "uncertain",
            "Mixed structural signals around the Broken flag; defer to human review.", ev)


# Founder label inputs, in INCREASING precedence (a later file overrides an earlier one on conflict).
# founder_review_priority.csv is the priority-sorted worktable the founder actually labels in while
# reviewing the charts, so it WINS conflicts. founder_labels.csv kept for backward compatibility.
LABEL_FILES = [
    ("founder_labels.csv", os.path.join(VR, "founder_labels.csv")),
    ("founder_labels_template.csv", TEMPLATE),
    ("founder_review_priority.csv", os.path.join(VR, "founder_review_priority.csv")),
]


def _read_label_file(path):
    """Return {(symbol,date): label} for rows with a non-empty founder_label; None if file absent."""
    if not os.path.exists(path):
        return None
    out = {}
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            lab = (r.get("founder_label") or "").strip()
            if lab:
                out[(r.get("symbol", "").strip(), r.get("date", "").strip())] = lab
    return out


def load_founder_labels():
    """Merge founder labels from all known input files. Precedence (low -> high):
    founder_labels.csv < founder_labels_template.csv < founder_review_priority.csv, so the priority
    worktable wins any per-window conflict. Returns (labels, meta) where meta reports how many labels
    were found, per-file counts, the preferred contributing source, and how many conflicts were resolved.
    """
    labels, src_of = {}, {}
    per_source, contributing, conflicts = [], [], 0
    for name, path in LABEL_FILES:
        d = _read_label_file(path)
        if d is None:
            per_source.append((name, None))          # file absent
            continue
        per_source.append((name, len(d)))
        if d:
            contributing.append(name)
        for k, v in d.items():
            if k in labels and labels[k] != v:
                conflicts += 1
            labels[k] = v                            # later file overrides -> priority CSV wins
            src_of[k] = name
    used_counts = {}
    for nm in src_of.values():
        used_counts[nm] = used_counts.get(nm, 0) + 1
    meta = {"total": len(labels), "per_source": per_source, "conflicts": conflicts,
            "primary": (contributing[-1] if contributing else None),
            "contributing": contributing, "used_counts": used_counts}
    return labels, meta


def _source_summary(meta):
    return "; ".join("%s=%s" % (nm, ("absent" if c is None else c)) for nm, c in meta["per_source"])


def main():
    cfg = yaml.safe_load(open(os.path.join(ULT, "config.yaml")))
    params = cfg["params"]
    with open(QUEUE, newline="") as f:
        rows = [r for r in csv.DictReader(f) if r.get("category") == "clean_but_capped"]
    syms = sorted({r["symbol"] for r in rows})
    print("[agent] clean_but_capped windows: %d across %d symbols" % (len(rows), len(syms)))
    data, _, _ = data_loader.load_universe(cfg, syms)

    cache = {}
    founder, fmeta = load_founder_labels()
    out_rows = []
    for r in rows:
        sym = r["symbol"]; t = int(r["t"])
        if sym not in cache:
            df = data.get(sym)
            if df is None:
                cache[sym] = (None, None, None, None)
            else:
                num = sf.compute_frame(df, params)
                highs, lows = ind.confirmed_pivots(df, 5)
                cache[sym] = (df, num, highs, lows)
        df, num, highs, lows = cache[sym]
        if df is None:
            label, conf, ba, reason, ev = ("unsure", CONF_MIN, "uncertain",
                                           "Bars for %s not found; cannot assess." % sym, "no bars")
            diag = {"ok": False}
        else:
            diag = diagnostics(df, num, highs, lows, t, params)
            label, conf, ba, reason, ev = decide(r, diag)
        trip = _binding_trip(diag) if diag.get("ok") else None
        fl = founder.get((sym, r["date"]), "")
        out_rows.append({
            "symbol": sym, "date": r["date"], "t": t,
            "final_state": r.get("final_state"), "final_score": r.get("final_score"),
            "binding_cap": (r.get("why_not_higher") or "").replace(",", ";"), "zone": r.get("zone"),
            "location": r.get("location"), "regime": r.get("regime"),
            "extension": r.get("extension"), "trend": r.get("trend"),
            "agent_label": label, "confidence": conf, "broken_zone_assessment": ba,
            "reason": reason, "visual_evidence": ev,
            "diag_trip_inplay": (trip["is_inplay"] if trip else ""),
            "diag_penetration_atr": (round(trip["pen"], 2) if trip else ""),
            "diag_bars_below": (trip["bars_below"] if trip else ""),
            "diag_reclaimed": (trip["reclaimed"] if trip else ""),
            "diag_pivot_age_bars": (trip["pivot_age"] if trip else ""),
            "diag_nearest_sup_atr": (round(diag["nsup_d"], 2) if diag.get("ok") and not pd.isna(diag.get("nsup_d")) else ""),
            "diag_trip_cluster_atr": (round(trip["dist_atr"], 2) if trip else ""),
            "diag_n_sup_clusters": (diag.get("n_sup") if diag.get("ok") else ""),
            "engine_zone_state": diag.get("engine_zone_state", ""),
            "founder_label": fl,
            "agreement": ("" if not fl else ("agree" if fl == label else "differ")),
        })

    cols = list(out_rows[0].keys())
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(out_rows)
    dist = {}
    for o in out_rows:
        dist[o["agent_label"]] = dist.get(o["agent_label"], 0) + 1
    print("[agent] agent label distribution: %s" % dist)
    print("[agent] wrote %s (%d rows)" % (OUT, len(out_rows)))
    print("[agent] founder labels found: %d (%s)" % (fmeta["total"], _source_summary(fmeta)))
    if fmeta["total"]:
        print("[agent] labels used by file (after precedence): %s | preferred=%s | conflicts=%d"
              % (fmeta["used_counts"], fmeta["primary"], fmeta["conflicts"]))
    else:
        print("[agent] no founder labels yet -> not computing agreement / confusion / A/B verdict.")
    write_comparison(out_rows, founder, fmeta)


def write_comparison(out_rows, founder, meta):
    have = [o for o in out_rows if o["founder_label"]]
    dist = {}
    for o in out_rows:
        dist[o["agent_label"]] = dist.get(o["agent_label"], 0) + 1
    avg_conf = sum(float(o["confidence"]) for o in out_rows) / max(1, len(out_rows))
    lines = ["# Agent vs Founder labels -- comparison",
             "",
             "_Read-only assistant. Agent suggestions never change scoring; the founder's labels are the truth._",
             "",
             "- clean_but_capped windows: **%d**" % len(out_rows),
             "- founder labels found: **%d**  (sources: %s)" % (meta["total"], _source_summary(meta)),
             "- agent mean confidence: **%.2f** (capped at %.2f by design)" % (avg_conf, CONF_CAP)]
    if meta["total"]:
        used = "; ".join("%s=%d" % (k, v) for k, v in meta["used_counts"].items())
        lines.append("- label input used (after precedence): **%s** | preferred = `%s` | conflicts resolved = %d"
                     % (used, meta["primary"], meta["conflicts"]))
    lines += ["", "## Agent label distribution", "", "| label | count |", "|---|---|"]
    for L in LABELS:
        lines.append("| %s | %d |" % (L, dist.get(L, 0)))

    if not have:
        lines += ["", "## Founder labels",
                  "",
                  "No founder labels yet. The agent reads them (in increasing precedence) from "
                  "`founder_labels.csv` < `founder_labels_template.csv` < `founder_review_priority.csv` "
                  "(the priority worktable wins conflicts). Fill the `founder_label` column in the template "
                  "**or** the priority CSV and re-run; agreement + confusion will then appear here."]
    else:
        fdist = {}
        for o in have:
            fdist[o["founder_label"]] = fdist.get(o["founder_label"], 0) + 1
        lines += ["", "## Founder label distribution (%d labeled)" % len(have), "", "| label | count |", "|---|---|"]
        for L in LABELS:
            lines.append("| %s | %d |" % (L, fdist.get(L, 0)))
        agree = sum(1 for o in have if o["agreement"] == "agree")
        lines += ["", "## Agreement",
                  "",
                  "- matched: **%d / %d** (%.0f%%)" % (agree, len(have), 100.0 * agree / len(have)),
                  "", "| symbol | date | agent | conf | founder | match |",
                  "|---|---|---|---|---|---|"]
        for o in have:
            lines.append("| %s | %s | %s | %.2f | %s | %s |" %
                         (o["symbol"], o["date"], o["agent_label"], float(o["confidence"]),
                          o["founder_label"], o["agreement"]))
        conf = {}
        for o in have:
            conf[(o["founder_label"], o["agent_label"])] = conf.get((o["founder_label"], o["agent_label"]), 0) + 1
        lines += ["", "## Confusion (rows = founder, cols = agent)", "",
                  "| founder \\\\ agent | " + " | ".join(LABELS) + " |",
                  "|" + "---|" * (len(LABELS) + 1)]
        for fl in LABELS:
            cells = [str(conf.get((fl, al), 0)) for al in LABELS]
            lines.append("| %s | %s |" % (fl, " | ".join(cells)))
    open(CMP, "w").write("\n".join(lines) + "\n")
    print("[agent] wrote %s (founder labels found: %d)" % (CMP, meta["total"]))


if __name__ == "__main__":
    main()
