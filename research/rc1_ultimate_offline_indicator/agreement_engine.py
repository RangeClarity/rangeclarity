"""Agreement Engine: lens agreement count, contradiction, agree3, weakest lens hint."""
from __future__ import annotations


def assemble(trend, location, zone, regime, extension, trend_dir, sdir, ma200_ok, ablation):
    ablation = ablation or set()
    contradiction = (trend_dir != 0 and sdir != 0 and trend_dir != sdir) and "agreement" not in ablation
    clean_trend = trend in ("Clean", "Range-bound")
    loc_meaning = location in ("NearSupport", "NearResistance", "Mid") and zone != "Insufficient"
    zone_real = zone in ("Fresh", "Tested")
    regime_ok = regime in ("Trend", "Range")
    ext_ok = extension in ("Normal", "Stretched")
    if "trend" in ablation:
        clean_trend = True
    if "zone" in ablation:
        zone_real = True
    if "location" in ablation:
        loc_meaning = True
    count = sum([clean_trend, loc_meaning, zone_real, regime_ok, ext_ok, ma200_ok])
    if "agreement" in ablation:
        count = 6
    agree3 = clean_trend and loc_meaning and zone_real
    return dict(agreement_count=int(count), agree3=bool(agree3), contradiction=bool(contradiction),
                clean_trend=clean_trend, loc_meaning=loc_meaning, zone_real=zone_real,
                regime_ok=regime_ok, ext_ok=ext_ok)
