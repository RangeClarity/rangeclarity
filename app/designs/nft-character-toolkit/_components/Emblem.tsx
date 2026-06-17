import s from "../nft.module.css";
import type { CSSProperties } from "react";

/* ============================================================
   Original RangeClarity character emblems — abstract, geometric
   silhouettes built from SVG primitives. No external art, no
   reference to any existing NFT collection or mascot.
   ============================================================ */

type Props = { kind: "ronin" | "beast" | "goblin" | "oracle"; c: string; c2: string; className?: string };

function Ronin({ c, c2 }: { c: string; c2: string }) {
  // Disciplined warrior: helm + visor band + crossed blades.
  return (
    <svg viewBox="0 0 160 130" width="100%" height="100%" aria-hidden="true">
      <g className={s.bob} style={{ transformOrigin: "80px 70px" } as CSSProperties}>
        <path d="M80 26 C58 26 48 44 48 66 C48 90 62 104 80 104 C98 104 112 90 112 66 C112 44 102 26 80 26 Z" fill="#0a1120" stroke={c} strokeWidth="2" />
        <rect x="52" y="58" width="56" height="12" rx="3" fill={c} opacity="0.9" />
        <rect x="58" y="61" width="12" height="6" rx="2" fill="#06101d" />
        <rect x="90" y="61" width="12" height="6" rx="2" fill="#06101d" />
        <path d="M80 26 C72 14 64 12 60 8" fill="none" stroke={c2} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M80 26 C88 14 96 12 100 8" fill="none" stroke={c2} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* crossed blades */}
      <line x1="30" y1="118" x2="130" y2="40" stroke={c2} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
      <line x1="130" y1="118" x2="30" y2="40" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

function Beast({ c, c2 }: { c: string; c2: string }) {
  // Momentum force: horned head + rising energy bars.
  return (
    <svg viewBox="0 0 160 130" width="100%" height="100%" aria-hidden="true">
      <g className={s.bob} style={{ transformOrigin: "80px 64px" } as CSSProperties}>
        <path d="M50 40 C40 26 36 20 30 12 C44 18 54 26 60 36" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
        <path d="M110 40 C120 26 124 20 130 12 C116 18 106 26 100 36" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
        <path d="M80 34 C56 34 48 52 48 72 C48 94 64 104 80 104 C96 104 112 94 112 72 C112 52 104 34 80 34 Z" fill="#0a1120" stroke={c} strokeWidth="2" />
        <path d="M64 64 l12 8 -12 8" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M96 64 l-12 8 12 8" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 90 q12 8 24 0" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + i * 8} y={120 - (i + 1) * 7} width="5" height={(i + 1) * 7} rx="1.5" fill={c2} opacity={0.4 + i * 0.15} />
      ))}
    </svg>
  );
}

function Goblin({ c, c2 }: { c: string; c2: string }) {
  // Cautious gremlin: big ears + jagged warning grin.
  return (
    <svg viewBox="0 0 160 130" width="100%" height="100%" aria-hidden="true">
      <g className={s.bob} style={{ transformOrigin: "80px 66px" } as CSSProperties}>
        <path d="M52 56 C34 44 22 46 14 52 C30 56 40 62 50 70 Z" fill="#0a1120" stroke={c} strokeWidth="2" />
        <path d="M108 56 C126 44 138 46 146 52 C130 56 120 62 110 70 Z" fill="#0a1120" stroke={c} strokeWidth="2" />
        <path d="M80 36 C58 36 50 54 50 74 C50 94 64 104 80 104 C96 104 110 94 110 74 C110 54 102 36 80 36 Z" fill="#0a1120" stroke={c} strokeWidth="2" />
        <circle cx="68" cy="66" r="5" fill={c} />
        <circle cx="92" cy="66" r="5" fill={c} />
        <path d="M62 84 l8 -6 6 6 6 -6 8 6 6 -6" fill="none" stroke={c2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* warning triangle */}
      <path d="M124 116 l10 -18 10 18 Z" fill="none" stroke={c} strokeWidth="2" opacity="0.7" />
      <line x1="134" y1="104" x2="134" y2="110" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function Oracle({ c, c2 }: { c: string; c2: string }) {
  // Future AI seer: orbiting bot head with a single scanning eye.
  return (
    <svg viewBox="0 0 160 130" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="80" cy="66" rx="58" ry="34" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.4" />
      <g className={s.bob} style={{ transformOrigin: "80px 64px" } as CSSProperties}>
        <rect x="54" y="42" width="52" height="48" rx="16" fill="#0a1120" stroke={c} strokeWidth="2" />
        <circle cx="80" cy="66" r="13" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="80" cy="66" r="5" fill={c} className={s.pulse} />
        <line x1="80" y1="42" x2="80" y2="32" stroke={c2} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="29" r="3.5" fill={c2} />
        <rect x="60" y="78" width="8" height="4" rx="2" fill={c2} opacity="0.7" />
        <rect x="92" y="78" width="8" height="4" rx="2" fill={c2} opacity="0.7" />
      </g>
      <circle cx="22" cy="66" r="3" fill={c} className={s.pulse} />
      <circle cx="138" cy="66" r="3" fill={c} className={s.pulse} />
    </svg>
  );
}

export default function Emblem({ kind, c, c2, className }: Props) {
  const vars = { ["--ec1" as string]: `${c}26`, ["--ec2" as string]: `${c2}1f` } as CSSProperties;
  return (
    <div className={`${s.emblemBox} ${s.holo} ${className ?? ""}`} style={vars}>
      <span className={s.shine} aria-hidden="true" />
      {kind === "ronin" && <Ronin c={c} c2={c2} />}
      {kind === "beast" && <Beast c={c} c2={c2} />}
      {kind === "goblin" && <Goblin c={c} c2={c2} />}
      {kind === "oracle" && <Oracle c={c} c2={c2} />}
    </div>
  );
}
