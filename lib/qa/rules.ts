import type { Finding, RcLiveQaEvent } from "./schema";
import { complianceChecks } from "./compliance-checks";
import { scoreChecks } from "./score-checks";
import { locationChecks } from "./location-checks";
import { zoneChecks } from "./zone-checks";
import { regimeChecks } from "./regime-checks";

// Run every deterministic rule over an ordered event stream.
// Previous-event state (for score-jump) is tracked per symbol+timeframe.
export function runRules(events: RcLiveQaEvent[]): Finding[] {
  const findings: Finding[] = [];
  const prev = new Map<string, RcLiveQaEvent>();
  for (const ev of events) {
    const key = `${ev.symbol}|${ev.timeframe}`;
    const before = prev.get(key);
    findings.push(...complianceChecks(ev));
    findings.push(...scoreChecks(ev, before));
    findings.push(...locationChecks(ev));
    findings.push(...zoneChecks(ev));
    findings.push(...regimeChecks(ev));
    prev.set(key, ev);
  }
  return findings;
}
