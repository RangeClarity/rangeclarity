import type { CSSProperties } from "react";
import type { ModuleV2 } from "../data";
import s from "../v2.module.css";

/* Compact CSS/SVG mock visuals for each module header. */
function MiniVisual({ visual, c, c2 }: { visual: ModuleV2["visual"]; c: string; c2: string }) {
  const bg = `radial-gradient(120% 120% at 0% 0%, ${c}1f, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${c2}1a, transparent 55%), #070b14`;
  if (visual === "range") {
    const candles = [34, 28, 42, 50, 44, 56, 62, 70, 66, 76];
    return (
      <div className={s.modVisual} style={{ background: bg }}>
        <span className={s.modTag} style={{ color: c, background: `${c}1a` }}>RANGE MAP</span>
        <svg viewBox="0 0 300 152" className={s.chartSvg}>
          <rect x="0" y="26" width="300" height="18" fill={`${c}14`} />
          <line x1="0" y1="26" x2="300" y2="26" stroke={c} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
          <rect x="0" y="108" width="300" height="18" fill={`${c2}14`} />
          <line x1="0" y1="126" x2="300" y2="126" stroke={c2} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
          {candles.map((h, i) => {
            const x = 24 + i * 28;
            const top = 130 - h * 1.3;
            const col = i % 2 === 0 ? c : c2;
            return (
              <g key={i}>
                <line x1={x} y1={top - 7} x2={x} y2={top + h * 0.6} stroke={col} strokeWidth="1.4" opacity="0.55" />
                <rect x={x - 5} y={top} width="10" height={Math.max(h * 0.45, 7)} rx="1.5" fill={col} opacity="0.85" />
              </g>
            );
          })}
          <circle cx="276" cy="44" r="4.5" fill={c} />
          <circle cx="276" cy="44" r="9" fill="none" stroke={c} strokeWidth="1" className={s.pulse} />
        </svg>
      </div>
    );
  }
  if (visual === "momentum") {
    const bars = [26, 40, 56, 72, 64, 84, 70, 52, 36, 80];
    return (
      <div className={s.modVisual} style={{ background: bg }}>
        <span className={s.modTag} style={{ color: c, background: `${c}1a` }}>MOMENTUM</span>
        <svg viewBox="0 0 300 152" className={s.chartSvg}>
          <polyline points="10,96 50,80 90,86 130,58 170,64 210,38 250,48 290,24" fill="none" stroke={c} strokeWidth="2" opacity="0.9" />
          {bars.map((h, i) => (
            <rect key={i} x={16 + i * 28} y={140 - h * 0.6} width="13" height={h * 0.6} rx="2" fill={c} opacity={0.25 + (i / bars.length) * 0.6} />
          ))}
          <circle cx="290" cy="24" r="4.5" fill={c2} className={s.pulse} />
        </svg>
      </div>
    );
  }
  const cx = 84;
  const cy = 76;
  return (
    <div className={s.modVisual} style={{ background: bg }}>
      <span className={s.modTag} style={{ color: c, background: `${c}1a` }}>RISK RADAR</span>
      <svg viewBox="0 0 300 152" className={s.chartSvg}>
        {[18, 34, 50, 64].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth="0.75" opacity="0.25" />
        ))}
        <line x1={cx - 64} y1={cy} x2={cx + 64} y2={cy} stroke={c} strokeWidth="0.5" opacity="0.2" />
        <line x1={cx} y1={cy - 64} x2={cx} y2={cy + 64} stroke={c} strokeWidth="0.5" opacity="0.2" />
        <g className={s.sweep} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx} ${cy} L${cx + 64} ${cy} A64 64 0 0 0 ${cx + 45} ${cy - 45} Z`} fill={`${c}40`} />
          <line x1={cx} y1={cy} x2={cx + 64} y2={cy} stroke={c} strokeWidth="1.5" />
        </g>
        <circle cx={cx + 26} cy={cy - 20} r="3.2" fill={c} className={s.pulse} />
        <circle cx={cx - 30} cy={cy + 16} r="2.8" fill={c2} />
        <g transform="translate(196, 30)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="0" y={i * 22} width="78" height="11" rx="3" fill="#ffffff" opacity="0.06" />
          ))}
          <rect x="0" y="0" width="58" height="11" rx="3" fill={c} opacity="0.9" />
          <rect x="0" y="22" width="38" height="11" rx="3" fill={c} opacity="0.7" />
          <rect x="0" y="44" width="66" height="11" rx="3" fill={c2} opacity="0.8" />
          <rect x="0" y="66" width="28" height="11" rx="3" fill={c} opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

export default function ModuleCardV2({ m }: { m: ModuleV2 }) {
  const vars = {
    ["--cc" as string]: m.c,
    ["--cc2" as string]: m.c2,
    ["--cardc" as string]: `${m.c}33`,
  } as CSSProperties;
  return (
    <article className={s.modCard} style={vars}>
      <div className={s.modBar} />
      <span className={s.modChip} style={{ color: m.c, borderColor: `${m.c}66` }}>{m.chip}</span>
      <MiniVisual visual={m.visual} c={m.c} c2={m.c2} />
      <div className={s.modPillRow}>
        <span className={s.modPill} style={{ color: m.c, background: `${m.c}1a`, boxShadow: `inset 0 0 0 1px ${m.c}40` }}>
          {m.pill}
        </span>
      </div>
      <h3 className={s.modTitle}>{m.title}</h3>
      <p className={s.modTagline} style={{ color: m.c }}>{m.tagline}</p>
      <p className={s.modBlurb}>{m.blurb}</p>
      <div className={s.modStats}>
        {m.stats.map((st) => (
          <div key={st.label} className={s.modStat}>
            <div className={s.modStatV} style={{ color: m.c }}>{st.value}</div>
            <div className={s.modStatL}>{st.label}</div>
          </div>
        ))}
      </div>
      <div className={s.modMeta}>
        <div className={s.metaItem}>
          <span className={s.metaKey}>Shows</span>
          <span className={s.metaVal}>{m.shows}</span>
        </div>
        <div className={s.metaItem}>
          <span className={s.metaKey}>Avoids</span>
          <span className={s.metaVal}>{m.avoids}</span>
        </div>
        <div className={s.metaItem}>
          <span className={s.metaKey}>Best for</span>
          <span className={s.metaVal}>{m.bestFor}</span>
        </div>
      </div>
    </article>
  );
}
