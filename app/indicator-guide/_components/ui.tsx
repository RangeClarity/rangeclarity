/* Shared visual atoms for the RangeClarity visual guide. Presentational only. */
import type { CSSProperties, ReactNode } from "react";
import s from "./guide.module.css";
import { TONE, type Tone } from "./data";

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  const c = TONE[tone];
  const style: CSSProperties = {
    color: c,
    borderColor: `${c}66`,
    background: `${c}1f`,
  };
  return (
    <span className={s.chip} style={style}>
      <span className={s.chipDot} style={{ background: c }} />
      {children}
    </span>
  );
}

export function ScoreBar({ value, tone, label }: { value: number; tone: Tone; label?: string }) {
  const c = TONE[tone];
  return (
    <div className={s.scoreBar} aria-label={`${label ?? "score"} ${value} of 100`}>
      <div className={s.scoreTrack}>
        <div className={s.scoreFill} style={{ width: `${value}%`, background: c }} />
      </div>
      <span className={s.scoreNum} style={{ color: c }}>{value}</span>
    </div>
  );
}

// ASCII-style meter that mirrors the indicator's [####------] dashboard meter.
export function Meter({ pct }: { pct: number }) {
  const filled = Math.max(0, Math.min(10, Math.round(pct / 10)));
  return (
    <span className={s.meter}>
      [{"#".repeat(filled)}
      <span className={s.meterEmpty}>{"-".repeat(10 - filled)}</span>]
    </span>
  );
}

export function SectionHead({
  kicker,
  title,
  blurb,
  id,
}: {
  kicker: string;
  title: string;
  blurb?: string;
  id?: string;
}) {
  return (
    <header className={s.secHead} id={id}>
      <span className={s.kicker}>{kicker}</span>
      <h2 className={s.h2}>{title}</h2>
      {blurb ? <p className={s.blurb}>{blurb}</p> : null}
    </header>
  );
}

// A faithful mock of the on-chart dashboard table.
export function DashboardMock() {
  const rows: { k: string; v: string; tone?: Tone; big?: boolean }[] = [
    { k: "Regime", v: "Compression 78", tone: "blue" },
    { k: "Structure", v: "Range-bound" },
    { k: "Range Pos.", v: "Upper 78%" },
    { k: "Momentum", v: "Strong", tone: "green" },
    { k: "Zone Str.", v: "Resistance 72" },
    { k: "Confidence", v: "Medium 58", tone: "amber" },
    { k: "Context", v: "Wait", tone: "grey", big: true },
    { k: "Note", v: "Mid-range - poor R/R" },
    { k: "State", v: "confirmed | not advice" },
  ];
  return (
    <div className={s.dash} role="img" aria-label="RangeClarity dashboard mock">
      <div className={s.dashTitle}>
        <span>RangeClarity</span>
        <span className={s.dashTicker}>AAPL | 1D</span>
      </div>
      {rows.map((r) => (
        <div key={r.k} className={s.dashRow}>
          <span className={s.dashKey}>{r.k}</span>
          <span
            className={r.big ? s.dashValBig : s.dashVal}
            style={r.tone ? { color: TONE[r.tone] } : undefined}
          >
            {r.k === "Range Pos." ? (
              <>
                Upper 78% <Meter pct={78} />
              </>
            ) : (
              r.v
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// Tiny inline candlestick / line thumbnails for structure states.
export function MiniPattern({ kind }: { kind: "up" | "down" | "flat" | "range" | "break" | "fail" }) {
  const up = TONE.green;
  const dn = TONE.red;
  const gr = TONE.grey;
  const paths: Record<string, ReactNode> = {
    up: <polyline points="2,38 14,30 26,32 38,20 50,22 62,8" fill="none" stroke={up} strokeWidth="2.5" />,
    down: <polyline points="2,8 14,16 26,14 38,26 50,24 62,38" fill="none" stroke={dn} strokeWidth="2.5" />,
    flat: <polyline points="2,24 14,20 26,26 38,22 50,25 62,21" fill="none" stroke={gr} strokeWidth="2.5" />,
    range: (
      <>
        <line x1="2" y1="12" x2="62" y2="12" stroke={gr} strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="2" y1="36" x2="62" y2="36" stroke={gr} strokeWidth="1.5" strokeDasharray="3 3" />
        <polyline points="2,30 14,16 26,32 38,16 50,30 62,18" fill="none" stroke={TONE.blue} strokeWidth="2.5" />
      </>
    ),
    break: (
      <>
        <line x1="2" y1="16" x2="62" y2="16" stroke={gr} strokeWidth="1.5" strokeDasharray="3 3" />
        <polyline points="2,34 16,30 30,20 44,18 62,6" fill="none" stroke={TONE.blue} strokeWidth="2.5" />
      </>
    ),
    fail: (
      <>
        <line x1="2" y1="14" x2="62" y2="14" stroke={gr} strokeWidth="1.5" strokeDasharray="3 3" />
        <polyline points="2,32 16,24 30,10 40,18 52,30 62,34" fill="none" stroke={dn} strokeWidth="2.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 64 44" className={s.mini} aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}
