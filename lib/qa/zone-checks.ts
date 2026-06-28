import { type Finding, type RcLiveQaEvent, type RcZone, THRESHOLDS } from "./schema";

function f(ev: RcLiveQaEvent, sev: Finding["severity"], cat: Finding["category"], rule: string, message: string, fix: string): Finding {
  return { rule, severity: sev, category: cat, symbol: ev.symbol, timeframe: ev.timeframe, message, suggested_fix: fix, source_event_id: ev.event_id, bar_time: ev.bar_time };
}

function checkZone(ev: RcLiveQaEvent, side: string, z: RcZone, out: Finding[]): void {
  const strong = z.score >= THRESHOLDS.strongZoneScore || z.quality === "Fresh" || z.quality === "Tested";
  if (z.stale && strong)
    out.push(f(ev, "warning", "zone", "zone.stale_but_strong", `${side} zone is stale but still marked strong (quality ${z.quality}, score ${z.score}).`, "Decay/expire stale zones; a stale zone must not read Fresh/Tested or score high."));
  if (!z.stale && z.age_bars > THRESHOLDS.staleAgeBars)
    out.push(f(ev, "info", "zone", "zone.age_not_flagged", `${side} zone age ${z.age_bars} bars exceeds the stale threshold (${THRESHOLDS.staleAgeBars}) but stale=false.`, "Flag zones stale past the age threshold."));
  if (z.touches <= 1 && strong)
    out.push(f(ev, "warning", "zone", "zone.one_touch_strong", `${side} zone has only ${z.touches} touch(es) but is treated as strong.`, "Require >= 2 clean touches (or strong reaction) before a zone reads strong."));
}

// Stale-strong, one-touch-strong, overlap, and missing-level checks.
export function zoneChecks(ev: RcLiveQaEvent): Finding[] {
  const out: Finding[] = [];
  if (ev.support) checkZone(ev, "Support", ev.support, out);
  if (ev.resistance) checkZone(ev, "Resistance", ev.resistance, out);

  if (!ev.support && !ev.resistance)
    out.push(f(ev, "warning", "data-quality", "zone.missing_both", "No key support or resistance present.", "Fall back to a subtle structure level, or surface Insufficient Structure."));
  else if (!ev.support)
    out.push(f(ev, "info", "data-quality", "zone.missing_support", "No key support present (one-sided structure).", "Confirm Location reads 'Below Range' / open-below, not a fabricated level."));
  else if (!ev.resistance)
    out.push(f(ev, "info", "data-quality", "zone.missing_resistance", "No key resistance present (one-sided structure).", "Confirm Location reads 'Above Range' / open-above, not a fabricated level."));

  if (ev.support && ev.resistance && ev.support.price > 0) {
    const gapPct = Math.abs(ev.resistance.price - ev.support.price) / ev.support.price * 100;
    if (gapPct < THRESHOLDS.zonesTooClosePct)
      out.push(f(ev, "warning", "zone", "zone.too_close", `Support and resistance are only ${gapPct.toFixed(2)}% apart (overlap/duplicate).`, "Merge or de-duplicate near-identical zones; keep the stronger one."));
  }
  return out;
}
