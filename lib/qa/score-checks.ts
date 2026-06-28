import { type Finding, type RcLiveQaEvent, THRESHOLDS } from "./schema";

function f(ev: RcLiveQaEvent, sev: Finding["severity"], rule: string, message: string, fix: string): Finding {
  return { rule, severity: sev, category: "score", symbol: ev.symbol, timeframe: ev.timeframe, message, suggested_fix: fix, source_event_id: ev.event_id, bar_time: ev.bar_time };
}

// Score/state coherence, large jumps, and high score over weak zones.
export function scoreChecks(ev: RcLiveQaEvent, prev?: RcLiveQaEvent): Finding[] {
  const out: Finding[] = [];
  const s = ev.rc?.score;
  const state = ev.rc?.state;
  if (typeof s !== "number") return out;

  // 1) score/state mismatch (bands: Clear >=70, Mixed 45-69, Weak <45)
  if (state === "Clear" && s < 70) out.push(f(ev, "warning", "score.state_mismatch", `State "Clear" but RC score is ${s} (expected >= 70).`, "Lower the state to Mixed/Weak, or re-check the score caps."));
  if (state === "Weak" && s >= 55) out.push(f(ev, "warning", "score.state_mismatch", `State "Weak" but RC score is ${s} (expected < 45).`, "Raise the state, or verify the conflict/cap logic."));
  if (state === "Mixed" && (s >= 70 || s < 45)) out.push(f(ev, "info", "score.state_mismatch", `State "Mixed" but RC score is ${s} (expected 45-69).`, "Align the state band with the score, or document the cap that overrode it."));

  // 2) RC score jump too large vs previous confirmed event
  if (prev && typeof prev.rc?.score === "number") {
    const jump = Math.abs(s - prev.rc.score);
    if (jump > THRESHOLDS.scoreJump) out.push(f(ev, "warning", "score.large_jump", `RC score jumped ${jump} points since the previous confirmed bar (${prev.rc.score} -> ${s}).`, "Smooth the headline score or confirm a real structural change drove it; avoid jumpy reads."));
  }

  // 3) high score with weak key zones
  if (s >= THRESHOLDS.highScore) {
    const zones = [ev.support, ev.resistance].filter((z): z is NonNullable<typeof z> => !!z);
    const weak = zones.filter((z) => z.quality === "Weak" || z.quality === "Insufficient" || z.score < THRESHOLDS.weakZoneScore);
    if (weak.length > 0) out.push(f(ev, "warning", "score.high_with_weak_zones", `High RC score (${s}) but key zone quality is weak (${weak.map((z) => `${z.quality}/${z.score}`).join(", ")}).`, "Cap RC score when key zones are weak/insufficient; structure clarity should not read high on thin levels."));
  }
  return out;
}
