import { CHART } from "../data";
import s from "../previous.module.css";

/* Mock TradingView-style chart — pure SVG/CSS, no live data.
   Larger, premium canvas with a prominent Range Score header. */
export default function MockChart() {
  const candles = [34, 30, 40, 36, 46, 52, 48, 58, 54, 64, 60, 70, 74, 68, 78, 72, 82, 76];
  const W = 640;
  const H = 380;
  const resTop = 54;
  const resBot = 104;
  const supTop = 274;
  const supBot = 324;
  const priceY = 138;
  const base = 322;
  const colW = (W - 56) / candles.length;
  const lastX = 36 + (candles.length - 1) * colW;

  return (
    <div className={s.terminal}>
      {/* top bar */}
      <div className={s.termHead}>
        <div className={s.dots}>
          <span className={s.dot} style={{ background: "#ff5d7acc" }} />
          <span className={s.dot} style={{ background: "#ffcf5ccc" }} />
          <span className={s.dot} style={{ background: "#34f5b0cc" }} />
        </div>
        <span className={s.termTitle}>
          <strong className={s.termTicker}>{CHART.ticker}</strong>
          <span className={s.termTf}>· 1D · RangeClarity</span>
        </span>
        <span className={s.live}>● LIVE</span>
      </div>

      <div className={s.chartGrid}>
        {/* chart pane */}
        <div className={s.chartPane}>
          <svg viewBox={`0 0 ${W} ${H}`} className={s.chartSvg} role="img" aria-label="Mock price chart with support and resistance zones">
            {/* gridlines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="0" y1={(H / 5) * i} x2={W} y2={(H / 5) * i} stroke="#1b2740" strokeWidth="1" />
            ))}

            {/* resistance zone */}
            <rect x="0" y={resTop} width={W} height={resBot - resTop} fill="rgba(255,93,122,0.12)" />
            <line x1="0" y1={resTop} x2={W} y2={resTop} stroke="#ff5d7a" strokeWidth="1.4" strokeDasharray="7 6" opacity="0.85" />
            <text x="14" y={resTop - 9} fill="#ff5d7a" fontSize="14" fontWeight="600" fontFamily="ui-monospace, monospace">RESISTANCE · $39.00–$42.00</text>

            {/* support zone */}
            <rect x="0" y={supTop} width={W} height={supBot - supTop} fill="rgba(52,245,176,0.12)" />
            <line x1="0" y1={supBot} x2={W} y2={supBot} stroke="#34f5b0" strokeWidth="1.4" strokeDasharray="7 6" opacity="0.85" />
            <text x="14" y={supBot + 20} fill="#34f5b0" fontSize="14" fontWeight="600" fontFamily="ui-monospace, monospace">SUPPORT · $28.50–$31.00</text>

            {/* candles */}
            {candles.map((h, i) => {
              const x = 36 + i * colW;
              const top = base - h * 2.6;
              const col = i % 2 === 0 ? "#34f5b0" : "#ff5d7a";
              const bodyH = Math.max(h * 0.8, 8);
              return (
                <g key={i}>
                  <line x1={x} y1={top - 10} x2={x} y2={top + bodyH + 7} stroke={col} strokeWidth="1.6" opacity="0.6" />
                  <rect x={x - colW * 0.3} y={top} width={colW * 0.6} height={bodyH} rx="2" fill={col} opacity="0.92" />
                </g>
              );
            })}

            {/* current price line + tag */}
            <line x1="0" y1={priceY} x2={W} y2={priceY} stroke="#ffcf5c" strokeWidth="1.4" strokeDasharray="2 5" opacity="0.9" />
            <rect x={W - 96} y={priceY - 15} width="88" height="30" rx="6" fill="#ffcf5c" />
            <text x={W - 52} y={priceY + 5} textAnchor="middle" fill="#1a1405" fontSize="15" fontWeight="800" fontFamily="ui-monospace, monospace">{CHART.price}</text>
            <circle cx={lastX} cy={priceY} r="5.5" fill="#ffcf5c" />
            <circle cx={lastX} cy={priceY} r="11" fill="none" stroke="#ffcf5c" strokeWidth="1.2" className={s.pulse} />
          </svg>
        </div>

        {/* readout pane */}
        <div className={s.readPane}>
          {/* prominent score header */}
          <div className={s.scoreHeader}>
            <div>
              <div className={s.scoreNum}>
                {CHART.rangeScore}
                <span className={s.scoreOut}>/100</span>
              </div>
              <div className={s.scoreLabel}>Range Score · {CHART.pricePosition}</div>
            </div>
            <span className={s.scoreBadge}>{CHART.verdict}</span>
          </div>

          <div className={s.readRow}><span className={s.readLabel}>Price Position</span><span className={s.readValue} style={{ color: "#38e1ff" }}>{CHART.pricePosition}</span></div>
          <div className={s.readRow}><span className={s.readLabel}>Support</span><span className={s.readValue} style={{ color: "#34f5b0" }}>{CHART.support}</span></div>
          <div className={s.readRow}><span className={s.readLabel}>Resistance</span><span className={s.readValue} style={{ color: "#ff5d7a" }}>{CHART.resistance}</span></div>
          <div className={s.readRow}><span className={s.readLabel}>Momentum</span><span className={s.readValue} style={{ color: "#38e1ff" }}>{CHART.momentum}</span></div>
          <div className={s.readRow}><span className={s.readLabel}>Entry Quality</span><span className={s.readValue} style={{ color: "#ffcf5c" }}>{CHART.entryQuality}</span></div>
          <div className={s.readRow}><span className={s.readLabel}>Risk Level</span><span className={s.readValue} style={{ color: "#9b6bff" }}>{CHART.risk}</span></div>

          <div className={s.verdictBox}>
            <span className={s.readLabel}>Verdict</span>
            <span className={s.verdictVal}>WAIT FOR PULLBACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
