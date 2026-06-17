import s from "../v2.module.css";

/* ============================================================
   MascotV2 — "RangeBot", the ORIGINAL RangeClarity meme mascot,
   built entirely from SVG primitives (no external/third-party art).
   A single, clean hooded chart-nerd with cap + headphones + crossed
   arms, centered with a soft glow and ground shadow. The earlier
   floating dashboard panels were removed for a clear, premium logo.
   ============================================================ */

export default function MascotV2() {
  return (
    <div className={s.mascotWrap}>
      <div className={s.mascotGlow} aria-hidden="true" />
      <svg
        viewBox="0 0 340 360"
        className={s.mascotSvg}
        role="img"
        aria-label="RangeBot — the RangeClarity mascot, a hooded chart reader with headphones"
      >
        {/* soft teal halo + ground shadow */}
        <defs>
          <radialGradient id="mv-halo" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(52,245,176,0.20)" />
            <stop offset="100%" stopColor="rgba(52,245,176,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="170" cy="168" rx="150" ry="150" fill="url(#mv-halo)" />
        <ellipse cx="170" cy="338" rx="92" ry="15" fill="#34f5b0" opacity="0.12" />
        <ellipse cx="170" cy="336" rx="78" ry="11" fill="#04070d" opacity="0.55" />

        {/* ---------- mascot (RangeBot), centered ---------- */}
        <g className={s.bob} transform="translate(54 26)">
          {/* hood behind head */}
          <path d="M70 70 C70 18 158 18 158 70 L168 150 L60 150 Z" fill="#0d1626" stroke="#243a59" strokeWidth="2" />

          {/* headphone band */}
          <path d="M64 78 C64 24 164 24 164 78" fill="none" stroke="#1a2740" strokeWidth="9" strokeLinecap="round" />

          {/* cap dome + brim */}
          <path d="M82 58 C82 26 146 26 146 58 L146 64 L82 64 Z" fill="#0c1322" stroke="#26384f" strokeWidth="2" />
          <path d="M82 62 C70 62 58 66 52 72 C66 70 78 68 96 68 Z" fill="#0c1322" stroke="#26384f" strokeWidth="2" />
          <circle cx="114" cy="34" r="2.6" fill="#34f5b0" />

          {/* face */}
          <ellipse cx="114" cy="86" rx="40" ry="40" fill="#eef3ff" />
          {/* eyes — angular, focused */}
          <path d="M92 80 L108 86 L92 92 Z" fill="#0a0f1a" />
          <path d="M136 80 L120 86 L136 92 Z" fill="#0a0f1a" />

          {/* headphone ear cups */}
          <circle cx="70" cy="88" r="16" fill="#0c1322" stroke="#2a3a5c" strokeWidth="2" />
          <circle cx="158" cy="88" r="16" fill="#0c1322" stroke="#2a3a5c" strokeWidth="2" />
          {/* EQ bars on right cup (accent) */}
          {[8, 14, 10, 16].map((h, i) => (
            <rect key={i} x={151 + i * 4} y={88 - h / 2} width="2.4" height={h} rx="1" fill="#34f5b0" />
          ))}

          {/* hoodie torso */}
          <path d="M56 150 C56 138 70 132 114 132 C158 132 172 138 172 150 L184 268 C184 280 60 280 44 268 Z" fill="#0f1828" stroke="#243a59" strokeWidth="2" />
          {/* hood opening */}
          <path d="M86 134 C96 150 132 150 142 134" fill="none" stroke="#243a59" strokeWidth="2" />
          {/* zipper + drawstrings (accent) */}
          <line x1="114" y1="138" x2="114" y2="262" stroke="#1a2740" strokeWidth="3" />
          <path d="M104 140 C104 156 100 168 96 178" fill="none" stroke="#34f5b0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M124 140 C124 156 128 168 132 178" fill="none" stroke="#34f5b0" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="96" cy="180" r="2.6" fill="#34f5b0" />
          <circle cx="132" cy="180" r="2.6" fill="#34f5b0" />

          {/* crossed arms */}
          <path d="M52 196 C92 182 150 182 186 208 C150 224 96 226 60 224 C50 220 48 204 52 196 Z" fill="#11203a" stroke="#243a59" strokeWidth="2" />
          <path d="M188 200 C150 188 96 190 58 214 C96 230 150 230 184 220 C194 216 194 206 188 200 Z" fill="#0e1a30" stroke="#243a59" strokeWidth="2" />
          {/* hands */}
          <ellipse cx="60" cy="222" rx="12" ry="10" fill="#eef3ff" />
          <ellipse cx="184" cy="214" rx="12" ry="10" fill="#eef3ff" />

          {/* shoulder lightning-arrow emblem (accent) */}
          <path d="M150 168 l-10 12 6 1 -7 12 18 -16 -7 -1 7 -9 z" fill="#34f5b0" opacity="0.95" />
        </g>
      </svg>

      <span className={s.mascotCaption}>
        RangeBot · your chart-reading desk buddy <em>(mascot, not a signal bot)</em>
      </span>
    </div>
  );
}
