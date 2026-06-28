"""Public/textbook indicators, original implementations. Confirmed-bar; no lookahead.
No proprietary formulas/code used."""
from __future__ import annotations
import numpy as np
import pandas as pd

def sma(s, n): return s.rolling(n, min_periods=n).mean()
def ema(s, n): return s.ewm(span=n, adjust=False, min_periods=n).mean()

def atr(df, n=14):
    h, l, c = df["high"], df["low"], df["close"]
    pc = c.shift(1)
    tr = pd.concat([(h - l), (h - pc).abs(), (l - pc).abs()], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()

def adx(df, n=14):
    h, l = df["high"], df["low"]
    up = h.diff(); dn = -l.diff()
    plus = ((up > dn) & (up > 0)) * up.clip(lower=0)
    minus = ((dn > up) & (dn > 0)) * dn.clip(lower=0)
    pc = df["close"].shift()
    tr = pd.concat([(h - l), (h - pc).abs(), (l - pc).abs()], axis=1).max(axis=1)
    a = tr.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    pdi = 100 * plus.ewm(alpha=1 / n, adjust=False, min_periods=n).mean() / a.replace(0, np.nan)
    mdi = 100 * minus.ewm(alpha=1 / n, adjust=False, min_periods=n).mean() / a.replace(0, np.nan)
    dx = 100 * (pdi - mdi).abs() / (pdi + mdi).replace(0, np.nan)
    return dx.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()

def efficiency_ratio(c, n=10):
    return c.diff(n).abs() / c.diff().abs().rolling(n, min_periods=n).sum().replace(0, np.nan)

def choppiness(df, n=14):
    a1 = atr(df, 1).rolling(n, min_periods=n).sum()
    rng = df["high"].rolling(n, min_periods=n).max() - df["low"].rolling(n, min_periods=n).min()
    return 100 * np.log10(a1 / rng.replace(0, np.nan)) / np.log10(n)

def overlap_ratio(df, n=10):
    """Mean bar-to-bar range overlap (high overlap ~ chop). 0..1."""
    h, l = df["high"], df["low"]
    inter = (np.minimum(h, h.shift(1)) - np.maximum(l, l.shift(1))).clip(lower=0)
    union = (np.maximum(h, h.shift(1)) - np.minimum(l, l.shift(1))).replace(0, np.nan)
    return (inter / union).rolling(n, min_periods=n).mean()

def reg_slope_r2(c, n=20):
    """Linear-regression slope (per bar) and R^2 over n bars. Research-only signal."""
    x = np.arange(n)
    xm = x.mean()
    def f(win):
        y = win.values
        ym = y.mean()
        sxx = ((x - xm) ** 2).sum()
        sxy = ((x - xm) * (y - ym)).sum()
        b = sxy / sxx if sxx else 0.0
        yhat = ym + b * (x - xm)
        ss_t = ((y - ym) ** 2).sum()
        r2 = 1 - ((y - yhat) ** 2).sum() / ss_t if ss_t else 0.0
        return b
    slope = c.rolling(n, min_periods=n).apply(f, raw=False)
    def f2(win):
        y = win.values; ym = y.mean()
        sxx = ((x - xm) ** 2).sum(); sxy = ((x - xm) * (y - ym)).sum()
        b = sxy / sxx if sxx else 0.0
        yhat = ym + b * (x - xm); ss_t = ((y - ym) ** 2).sum()
        return 1 - ((y - yhat) ** 2).sum() / ss_t if ss_t else 0.0
    r2 = c.rolling(n, min_periods=n).apply(f2, raw=False)
    return slope, r2

def confirmed_pivots(df, w=5):
    h, l = df["high"].values, df["low"].values
    n = len(df)
    highs, lows = [], []
    for i in range(w, n - w):
        if h[i] == h[i - w:i + w + 1].max():
            highs.append((i + w, float(h[i])))
        if l[i] == l[i - w:i + w + 1].min():
            lows.append((i + w, float(l[i])))
    return highs, lows
