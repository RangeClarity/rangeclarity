/* Stylized, annotated mock of RangeClarity on a TradingView-style chart.
   Mock data only — illustrative candles, not real prices. */
import s from "./guide.module.css";
import { TONE } from "./data";

// Illustrative candles: a pullback into support, then a bounce toward mid-range.
const CANDLES: { x: number; o: number; c: number; h: number; l: number }[] = [
  { x: 40, o: 150, c: 120, h: 135, l: 158 },
  { x: 70, o: 122, c: 138, h: 116, l: 142 },
  { x: 100, o: 138, c: 132, h: 126, l: 150 },
  { x: 130, o: 132, c: 158, h: 128, l: 168 },
  { x: 160, o: 158, c: 178, h: 150, l: 184 },
  { x: 190, o: 178, c: 168, h: 160, l: 186 },
  { x: 220, o: 168, c: 150, h: 146, l: 176 },
  { x: 250, o: 150, c: 132, h: 128, l: 158 },
  { x: 280, o: 132, c: 120, h: 116, l: 138 },
  { x: 310, o: 120, c: 138, h: 116, l: 146 },
  { x: 340, o: 138, c: 160, h: 134, l: 168 },
  { x: 370, o: 160, c: 176, h: 152, l: 182 },
];

function Callout({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g className={s.callout}>
      <circle cx={x} cy={y} r="11" fill={TONE.blue} stroke="#cfe3ff" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
        {n}
      </text>
    </g>
  );
}

export function ChartAnatomy() {
  const cw = 9; // candle half width
  return (
    <svg viewBox="0 0 620 300" className={s.anatomy} role="img" aria-label="Annotated RangeClarity chart">
      {/* grid */}
      <defs>
        <pattern id="rcgrid" width="40" height="34" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V34" fill="none" stroke="rgba(124,160,220,0.10)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="620" height="300" fill="url(#rcgrid)" />

      {/* resistance zone (red band) near top */}
      <rect x="0" y="104" width="430" height="22" fill={`${TONE.red}26`} stroke={`${TONE.red}66`} strokeWidth="1" />
      <line x1="0" y1="115" x2="430" y2="115" stroke={`${TONE.grey}aa`} strokeWidth="1.2" strokeDasharray="5 4" />
      <text x="8" y="100" fontSize="11" fill={TONE.red} fontWeight="600">RESISTANCE ZONE</text>

      {/* support zone (green band) near bottom */}
      <rect x="0" y="186" width="430" height="22" fill={`${TONE.green}26`} stroke={`${TONE.green}66`} strokeWidth="1" />
      <line x1="0" y1="197" x2="430" y2="197" stroke={`${TONE.grey}aa`} strokeWidth="1.2" strokeDasharray="5 4" />
      <text x="8" y="223" fontSize="11" fill={TONE.green} fontWeight="600">SUPPORT ZONE</text>

      {/* candles */}
      {CANDLES.map((k, i) => {
        const bull = k.c < k.o; // lower y = higher price; bull if close above open => c<o in screen coords
        const col = bull ? TONE.green : TONE.red;
        const top = Math.min(k.o, k.c);
        const h = Math.abs(k.o - k.c);
        return (
          <g key={i}>
            <line x1={k.x} y1={k.h} x2={k.x} y2={k.l} stroke={col} strokeWidth="1.4" />
            <rect x={k.x - cw} y={top} width={cw * 2} height={Math.max(h, 2)} fill={col} rx="1.5" />
          </g>
        );
      })}

      {/* current price marker */}
      <circle cx="370" cy="176" r="5" fill="#fff" stroke={TONE.blue} strokeWidth="2.5" />
      <line x1="382" y1="176" x2="430" y2="176" stroke={`${TONE.blue}88`} strokeWidth="1" strokeDasharray="2 3" />

      {/* dashboard panel mock (top-right) */}
      <g>
        <rect x="446" y="14" width="166" height="232" rx="8" fill="#0b0f1a" stroke={`${TONE.grey}88`} strokeWidth="1" />
        <rect x="446" y="14" width="166" height="26" rx="8" fill={`${TONE.blue}55`} />
        <text x="456" y="31" fontSize="11" fontWeight="700" fill="#eaf2ff">RangeClarity</text>
        <text x="604" y="31" fontSize="9" fill="#9fb0cc" textAnchor="end">AAPL | 1D</text>
        {[
          ["Regime", "Compression 78", TONE.blue],
          ["Structure", "Range-bound", "#cdd8ee"],
          ["Range Pos.", "Upper 78%", "#cdd8ee"],
          ["Momentum", "Strong", TONE.green],
          ["Zone Str.", "Resistance 72", "#cdd8ee"],
          ["Confidence", "Medium 58", TONE.amber],
          ["Context", "Structure Not Clear", TONE.grey],
          ["Note", "unclear location", "#8294b4"],
        ].map((r, i) => (
          <g key={i}>
            <text x="456" y={56 + i * 23} fontSize="9.5" fill="#8294b4">{r[0] as string}</text>
            <text x="604" y={56 + i * 23} fontSize="9.5" fontWeight="600" fill={r[2] as string} textAnchor="end">{r[1] as string}</text>
          </g>
        ))}
      </g>

      {/* numbered callouts */}
      <Callout x={120} y={197} n={1} />{/* support */}
      <Callout x={120} y={115} n={2} />{/* resistance */}
      <Callout x={370} y={176} n={3} />{/* current price position */}
      <Callout x={462} y={70} n={4} />{/* dashboard */}
      <Callout x={520} y={125} n={5} />{/* momentum */}
      <Callout x={520} y={171} n={6} />{/* confidence */}
      <Callout x={520} y={194} n={7} />{/* context */}
    </svg>
  );
}

export const ANATOMY_LEGEND: { n: number; title: string; text: string }[] = [
  { n: 1, title: "Support zone", text: "Green band below price where buyers reacted before. A band, not a line — reactions cluster." },
  { n: 2, title: "Resistance zone", text: "Red band above price where sellers reacted before — a stretched location to lean on." },
  { n: 3, title: "Current price position", text: "Where price sits inside the range — drives the Range Position % and meter." },
  { n: 4, title: "Dashboard panel", text: "The single table that summarizes every module. The whole UI in one place." },
  { n: 5, title: "Momentum state", text: "Strong / Improving / Fading / Extended / Weak / Neutral — confirmation, not a trigger." },
  { n: 6, title: "Confidence", text: "0–100 module alignment with a label. Not a probability of profit." },
  { n: 7, title: "Context / No-Edge", text: "The summary read — Watch, Structure Not Clear, No Edge, Stretched, etc. Never buy/sell." },
];
