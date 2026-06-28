import { type Finding, type RcLiveQaEvent, THRESHOLDS } from "./schema";

function f(ev: RcLiveQaEvent, sev: Finding["severity"], rule: string, message: string, fix: string): Finding {
  return { rule, severity: sev, category: "location", symbol: ev.symbol, timeframe: ev.timeframe, message, suggested_fix: fix, source_event_id: ev.event_id, bar_time: ev.bar_time };
}

const POS_STATES = ["Near Support", "Lower Range", "Mid Range", "Upper Range", "Near Resistance"];

// A level counts as "near" when price is within nearDistancePctMax (%) OR within nearAtrMax (ATR)
// of it. This mirrors the indicator's Location kernel, which gates "Near Support/Resistance" on the
// same dual proximity test, so a wide band never reads "Near" when price is structurally far.
function isNear(distPct: number | null | undefined, nearAtr: number | null | undefined): boolean {
  const byPct = typeof distPct === "number" && Math.abs(distPct) <= THRESHOLDS.nearDistancePctMax;
  const byAtr = typeof nearAtr === "number" && nearAtr <= THRESHOLDS.nearAtrMax;
  return byPct || byAtr;
}

// "Near X" must actually be near; state must agree with range position AND proximity.
export function locationChecks(ev: RcLiveQaEvent): Finding[] {
  const out: Finding[] = [];
  const loc = ev.location;
  if (!loc) return out;

  const maxNear = THRESHOLDS.nearDistancePctMax;
  const maxAtr = THRESHOLDS.nearAtrMax;
  const nearAtr = loc.near_atr;
  const atrTxt = typeof nearAtr === "number" ? `${nearAtr} ATR` : "n/a";

  if (loc.state === "Near Resistance" && !isNear(loc.dist_resistance_pct, nearAtr))
    out.push(f(ev, "warning", "location.near_too_far", `Location "Near Resistance" but distance to resistance is ${loc.dist_resistance_pct}% / ${atrTxt} (> ${maxNear}% and > ${maxAtr} ATR).`, `Only emit "Near Resistance" within ${maxNear}% or ${maxAtr} ATR; otherwise use Upper Range.`));
  if (loc.state === "Near Support" && !isNear(loc.dist_support_pct, nearAtr))
    out.push(f(ev, "warning", "location.near_too_far", `Location "Near Support" but distance to support is ${loc.dist_support_pct}% / ${atrTxt} (> ${maxNear}% and > ${maxAtr} ATR).`, `Only emit "Near Support" within ${maxNear}% or ${maxAtr} ATR; otherwise use Lower Range.`));

  if (typeof loc.range_position === "number" && POS_STATES.includes(loc.state)) {
    const rp = loc.range_position;
    const nearSup = rp <= 20 && isNear(loc.dist_support_pct, nearAtr);
    const nearRes = rp >= 80 && isNear(loc.dist_resistance_pct, nearAtr);
    const expect = nearSup ? "Near Support" : nearRes ? "Near Resistance" : rp <= 40 ? "Lower Range" : rp < 60 ? "Mid Range" : "Upper Range";
    if (loc.state !== expect)
      out.push(f(ev, "info", "location.state_vs_position", `Location state "${loc.state}" disagrees with range position ${rp} / ${atrTxt} (expected "${expect}").`, "Derive Location from range position AND proximity (% or ATR); keep one source of truth with the indicator."));
  }
  return out;
}
