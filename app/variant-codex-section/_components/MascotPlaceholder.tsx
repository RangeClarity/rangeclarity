/* ---------------------------------------------------------------------------
   PLACEHOLDER mascot for the Bold Hero variant.
   The original Codex hero used a rendered 3D hooded "RangeClarity" character
   (raster image) that is NOT in this repo. This on-brand SVG stands in for it
   so the layout is production-ready and unbroken.

   TO REPLACE: drop the real render at /public/mascot-hero.png (or .webp) and
   swap this component for <Image src="/mascot-hero.png" ... /> in BoldHero.tsx.
   --------------------------------------------------------------------------- */
export default function MascotPlaceholder() {
  return (
    <svg viewBox="0 0 360 380" width="100%" height="100%" role="img" aria-label="RangeClarity mascot (placeholder)">
      <defs>
        <linearGradient id="rcMascotBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11161f" />
          <stop offset="1" stopColor="#0a0e16" />
        </linearGradient>
        <radialGradient id="rcMascotGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="rgba(52,245,176,0.22)" />
          <stop offset="1" stopColor="rgba(52,245,176,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="200" rx="150" ry="160" fill="url(#rcMascotGlow)" />

      {/* hood / shoulders */}
      <path d="M70 360 C70 250 110 205 180 205 C250 205 290 250 290 360 Z" fill="url(#rcMascotBody)" stroke="#1c2740" strokeWidth="2" />
      {/* hood opening */}
      <path d="M120 150 C120 95 145 70 180 70 C215 70 240 95 240 150 C240 200 215 220 180 220 C145 220 120 200 120 150 Z" fill="#0d1119" stroke="#1c2740" strokeWidth="2" />
      {/* face */}
      <ellipse cx="180" cy="150" rx="46" ry="52" fill="#e9eef7" />
      {/* eyes (angular, like the screenshot) */}
      <path d="M158 140 l16 -7 0 14 z" fill="#0a0e16" />
      <path d="M202 140 l-16 -7 0 14 z" fill="#0a0e16" />
      {/* headphone band + cups */}
      <path d="M128 132 C128 92 232 92 232 132" fill="none" stroke="#11161f" strokeWidth="12" strokeLinecap="round" />
      <rect x="116" y="128" width="24" height="40" rx="10" fill="#11161f" stroke="#1c2740" strokeWidth="2" />
      <rect x="220" y="128" width="24" height="40" rx="10" fill="#11161f" stroke="#1c2740" strokeWidth="2" />
      {/* equalizer on the cup (brand accent) */}
      <g fill="#34f5b0">
        <rect x="226" y="148" width="3" height="8" rx="1" />
        <rect x="231" y="143" width="3" height="13" rx="1" />
        <rect x="236" y="146" width="3" height="10" rx="1" />
      </g>
      {/* zip + lightning motif on hoodie */}
      <line x1="180" y1="222" x2="180" y2="320" stroke="#1c2740" strokeWidth="3" />
      <path d="M188 250 l-12 22 8 0 -10 26" fill="none" stroke="#34f5b0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {/* little uptrend on the chest */}
      <polyline points="120,300 140,288 160,294 184,272" fill="none" stroke="#2fffd6" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
