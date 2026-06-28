import { type Finding, type RcLiveQaEvent, THRESHOLDS } from "./schema";

function f(ev: RcLiveQaEvent, sev: Finding["severity"], cat: Finding["category"], rule: string, message: string, fix: string): Finding {
  return { rule, severity: sev, category: cat, symbol: ev.symbol, timeframe: ev.timeframe, message, suggested_fix: fix, source_event_id: ev.event_id, bar_time: ev.bar_time };
}

// Regime sanity + visual budget (rows / zones).
export function regimeChecks(ev: RcLiveQaEvent): Finding[] {
  const out: Finding[] = [];
  const s = ev.rc?.score;
  if (typeof s === "number" && s >= THRESHOLDS.highScore && ev.regime === "Chop")
    out.push(f(ev, "warning", "regime", "regime.high_score_in_chop", `High RC score (${s}) while regime is Chop.`, "Cap RC score in chop; choppy structure should not read clear."));

  if (typeof ev.ui?.table_rows === "number" && ev.ui.table_rows > THRESHOLDS.maxTableRows)
    out.push(f(ev, "warning", "visual", "visual.too_many_rows", `Dashboard has ${ev.ui.table_rows} rows (budget ${THRESHOLDS.maxTableRows}).`, "Move extra rows to Advanced; keep the default surface compact."));
  if (typeof ev.ui?.visible_zones === "number" && ev.ui.visible_zones > THRESHOLDS.maxVisibleZones)
    out.push(f(ev, "warning", "visual", "visual.too_many_zones", `${ev.ui.visible_zones} zones drawn (hard cap ${THRESHOLDS.maxVisibleZones}).`, "Cap drawn zones; show only the nearest 1-2 per side."));
  return out;
}
