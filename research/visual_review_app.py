"""RC-1 Visual Review - interactive Streamlit app. RESEARCH VISUALISATION ONLY.
No scoring changes, no Pine, no trade signals. Reuses the headless harness functions.
Run:  python -m streamlit run research/visual_review_app.py
"""
from __future__ import annotations
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "rc1_ultimate_offline_indicator"))
sys.path.insert(0, HERE)

import yaml
import streamlit as st
import data_loader
import structure_features as sf
import indicators as ind
from render_visual_review import _fig, _audit, _categorize, CATS

cfg = yaml.safe_load(open(os.path.join(HERE, "rc1_ultimate_offline_indicator", "config.yaml")))
params, caps = cfg["params"], cfg["caps"]
real = [s for s in cfg["universe"] if data_loader._find_csv(s, cfg)]
syms = real or cfg["universe"]
src = ("real CSV %d/%d" % (len(real), len(cfg["universe"]))) if real else "synthetic"

st.set_page_config(page_title="RC-1 Visual Review", layout="wide")
st.title("RC-1 Visual Review (research only)")
st.caption("Source: " + src + ". RC Score is permission, not prediction. "
           "No trade signals; state words + caps + audit only. Conviction: RED.")

sym = st.sidebar.selectbox("Symbol", syms)
k = st.sidebar.slider("Recent windows", 1, 12, 4)
catf = st.sidebar.multiselect("Category filter", CATS, default=CATS)


@st.cache_data(show_spinner=False)
def _load(s):
    d, _, _ = data_loader.load_universe(cfg, [s])
    return d[s]


df = _load(sym)
num = sf.compute_frame(df, params)
highs, lows = ind.confirmed_pivots(df, 5)
minb, step, hz = cfg["windows"]["min_bars"], cfg["windows"]["step"], cfg["windows"]["proxy_horizon"]
last = len(df) - hz - 1
ts = sorted(set(max(minb, last - i * step) for i in range(k)))
shown = 0
for t in ts:
    sc, fig = _fig(df, num, highs, lows, t, params, caps)
    cat = _categorize(sc)
    if cat not in catf:
        continue
    shown += 1
    st.subheader(sym + " @ " + str(df["date"].iloc[t]) + " - " + str(sc["final_state"]) +
                 " (" + str(sc["final_score"]) + ")  [" + cat + "]")
    st.code(_audit(sym, t, df, sc))
    st.plotly_chart(fig, use_container_width=True)
if shown == 0:
    st.info("No windows match the selected category filter.")
