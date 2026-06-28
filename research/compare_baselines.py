"""Run BOTH RC-1 offline baselines on the SAME real CSVs and assemble a REAL results doc.

Guarantees:
- exits safely (code 2) with the exact fetch command if no real CSVs exist; never fabricates.
- never reads/prints TIINGO_API_KEY (it does not touch .env or the key at all).
- copies the real CSVs into BOTH packages' data/ohlcv so neither silently uses synthetic.
- writes a REAL-only results doc; the frozen SYNTHETIC reference stays in its own file.
- does NOT mutate any scoring config (only runs each package's run script + writes a doc).
No Pine, no returns. Read-only w.r.t. rc1_ultimate scoring (only invokes its run script).

Run locally:  cd research ; python compare_baselines.py
"""
from __future__ import annotations
import os
import sys
import glob
import shutil
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
AUTO = os.path.join(HERE, "rc1_autonomous_model")
ULT = os.path.join(HERE, "rc1_ultimate_offline_indicator")
AUTO_CSV = os.path.join(AUTO, "data", "ohlcv")
ULT_CSV = os.path.join(ULT, "data", "ohlcv")
OUT = os.path.normpath(os.path.join(HERE, "..", "docs", "research",
                                    "rc1-real-data-baseline-v1-results.md"))


def _csvs(d):
    return [f for f in glob.glob(os.path.join(d, "*.csv")) if not os.path.basename(f).startswith("_")]


def _run(cwd, script):
    p = subprocess.run([sys.executable, script], cwd=cwd, capture_output=True, text=True)
    return (p.stdout or "") + (("\n[stderr]\n" + p.stderr) if p.returncode else "")


def main():
    src = _csvs(AUTO_CSV)
    if not src:
        print("[compare] NO real CSVs in rc1_autonomous_model/data/ohlcv/.")
        print("[compare] Fetch first (locally; .env holds TIINGO_API_KEY):")
        print("    cd rc1_autonomous_model ; python fetch_tiingo.py")
        print("[compare] then:  cd .. ; python compare_baselines.py")
        print("[compare] Not fabricating a baseline. Exiting (2).")
        sys.exit(2)
    os.makedirs(ULT_CSV, exist_ok=True)
    copied = 0
    for f in src:
        dst = os.path.join(ULT_CSV, os.path.basename(f))
        if os.path.abspath(f) != os.path.abspath(dst):
            shutil.copy2(f, dst)
            copied += 1
    print("[compare] " + str(len(src)) + " real CSVs; copied " + str(copied) +
          " into rc1_ultimate/data/ohlcv. Running both ...")
    auto_out = _run(AUTO, "run_research.py")
    ult_out = _run(ULT, "run_indicator.py")
    warn = []
    if "synthetic" in auto_out.lower():
        warn.append("rc1_autonomous_model reported SYNTHETIC - real CSVs not detected; do not treat as real.")
    if "source=synthetic" in ult_out.lower() or "synthetic (0/" in ult_out.lower():
        warn.append("rc1_ultimate reported SYNTHETIC - real CSVs not detected; do not treat as real.")
    md = []
    md.append("# RC-1 Real Data Baseline v1 - REAL RESULTS (auto)\n")
    md.append("> REAL data run. The frozen SYNTHETIC reference is in "
              "rc1-real-data-baseline-v1-comparison.md - do NOT conflate the two.\n")
    md.append("> Conviction stays RED until human-labeled review exists. RC Score is permission, "
              "not prediction. No scoring config was changed by this run.\n")
    if warn:
        md.append("\n## WARNING\n" + "\n".join("- " + w for w in warn) + "\n")
    md.append("\n## rc1_autonomous_model (real)\n```\n" + auto_out.strip() + "\n```\n")
    md.append("\n## rc1_ultimate_offline_indicator (real)\n```\n" + ult_out.strip() + "\n```\n")
    md.append("\n## Interpretation rules\n")
    md.append("- 0 Clear / 0 HighClarity on real data => LIKELY OVER-REJECTION, not validation.\n")
    md.append("- High Clarity rare is good ONLY if real clean charts still reach Clear sometimes.\n")
    md.append("- Compare each package's reports/ (state_distribution, cap_distribution, "
              "ablation_results, founder_review_queue). Paste this file + both founder_review_queue.csv back.\n")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        fh.write("\n".join(md))
    if warn:
        print("[compare] WARNING:\n   " + "\n   ".join(warn))
    print("[compare] wrote " + OUT)
    print("[compare] also see each package's reports/ folder for distributions + founder queues.")


if __name__ == "__main__":
    main()
