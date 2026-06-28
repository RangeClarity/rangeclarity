import { type Finding, type RcLiveQaEvent, FORBIDDEN_WORDS } from "./schema";

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Scan every surfaced text string for forbidden signal-like / decision wording.
export function complianceChecks(ev: RcLiveQaEvent): Finding[] {
  const out: Finding[] = [];
  const texts: string[] = [
    ...(ev.ui?.display_text ?? []),
    ev.rc?.state,
    ev.trend,
    ev.regime,
    ev.location?.state,
    ev.structure_delta,
  ].filter((t): t is string => typeof t === "string");
  const hay = texts.join("  •  ").toLowerCase();

  for (const w of FORBIDDEN_WORDS) {
    const isPhrase = w.includes(" ") || w.includes("-") || w.includes("/");
    const hit = isPhrase
      ? hay.includes(w)
      : new RegExp(`\\b${esc(w)}\\b`).test(hay);
    if (hit) {
      out.push({
        rule: "compliance.forbidden_word",
        severity: "critical",
        category: "compliance",
        symbol: ev.symbol,
        timeframe: ev.timeframe,
        message: `Forbidden signal-like wording surfaced: "${w}".`,
        suggested_fix: `Remove "${w}" from indicator output; use structure / location / regime / quality / clarity language only.`,
        source_event_id: ev.event_id,
        bar_time: ev.bar_time,
      });
    }
  }
  return out;
}
