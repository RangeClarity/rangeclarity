import { CHART } from "../data";
import s from "../v2.module.css";

/* Mock TradingView-style chart — pure SVG/CSS, no live data. */
export default function MockTradingViewChartV2() {
  // candle highs (mock) climbing into the upper range
  const candles = [
    34, 30, 40, 36, 46, 52, 48, 58, 54, 64, 60, 70, 74, 68, 78, 72, 82, 76,
  ];
  const W = 560;
  const H = 300;
  const resTop = 40;
  const resBot = 74;
  const supTop = 218;
  const supBot = 252;
  const colW = (W - 40) / candles.length;

  return (
    <div className={s.terminal}>
      <div className={s.termHead}>
        <div className={s.dots}>
          <span className={s.dot} style={{ background: "#ff5d7acc" }} />
          <span className={s.dot} style={{ background: "#ffcf5ccc" }} />
          <span className={s.dot} style={{ background: "#34f5b0cc" }} />
        </div>
        <span className={s.termTitle}>RANGECLARITY · {CHART.ticker} · 1D</span>
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
            <rect x="0" y={resTop} width={W} height={resBot - resTop} fill="rgba(255,93,122,0.1)" />
            <line x1="0" y1={resTop} x2={W} y2={resTop} stroke="#ff5d7a" strokeWidth="1" strokeDasharray="6 5" opacity="0.8" />
            <text x="10" y={resTop - 6} fill="#ff5d7a" fontSize="11" fontFamily="ui-monospace, monospace">RESISTANCE $39.00–$42.00</text>
            {/* support zone */}
            <rect x="0" y={supTop} width={W} height={supBot - supTop} fill="rgba(52,245,176,0.1)" />
            <line x1="0" y1={supBot} x2={W} y2={supBot} stroke="#34f5b0" strokeWidth="1" strokeDasharray="6 5" opacity="0.8" />
            <text x="10" y={supBot + 16} fill="#34f5b0" fontSize="11" fontFamily="ui-monospace, monospace">SUPPORT $28.50–$31.00</text>
            {/* tasteful state stickers */}
            <g>
              <rect x={W - 150} y={46} width={74} height={17} rx={5} fill="rgba(255,93,122,0.16)" stroke="#ff5d7a" strokeWidth="1" />
              <text x={W - 113} y={58} textAnchor="middle" fill="#ff5d7a" fontSize="9" fontWeight={700} fontFamily="ui-monospace, monospace">TOO HOT</text>
            </g>
            <g>
              <rect x={196} y={100} width={86} height={17} rx={5} fill="rgba(255,207,92,0.16)" stroke="#ffcf5c" strokeWidth="1" />
              <text x={239} y={112} textAnchor="middle" fill="#ffcf5c" fontSize="9" fontWeight={700} fontFamily="ui-monospace, monospace">WAIT ZONE</text>
            </g>
            <g>
              <rect x={W - 156} y={226} width={92} height={17} rx={5} fill="rgba(52,245,176,0.16)" stroke="#34f5b0" strokeWidth="1" />
              <text x={W - 110} y={238} textAnchor="middle" fill="#34f5b0" fontSize="9" fontWeight={700} fontFamily="ui-monospace, monospace">CALM ENTRY</text>
            </g>
            {/* candles */}
            {candles.map((h, i) => {
              const x = 28 + i * colW;
              const top = 250 - h * 2.1;
              const up = i % 2 === 0;
              const col = up ? "#34f5b0" : "#ff5d7a";
              const bodyH = Math.max(h * 0.7, 6);
              return (
                <g key={i}>
                  <line x1={x} y1={top - 9} x2={x} y2={top + bodyH + 6} stroke={col} strokeWidth="1.4" opacity="0.6" />
                  <rect x={x - colW * 0.28} y={top} width={colW * 0.56} height={bodyH} rx="1.5" fill={col} opacity="0.9" />
                </g>
              );
            })}
            {/* current price line */}
            <line x1="0" y1="92" x2={W} y2="92" stroke="#ffcf5c" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.9" />
            <g>
              <rect x={W - 70} y="80" width="64" height="22" rx="4" fill="#ffcf5c" />
              <text x={W - 38} y="95" textAnchor="middle" fill="#1a1405" fontSize="12" fontWeight="700" fontFamily="ui-monospace, monospace">$39.40</text>
            </g>
            <circle cx={28 + (candles.length - 1) * colW} cy="92" r="4.5" fill="#ffcf5c" />
            <circle cx={28 + (candles.length - 1) * colW} cy="92" r="9" fill="none" stroke="#ffcf5c" strokeWidth="1" className={s.pulse} />
          </svg>
        </div>

        {/* readout pane */}
        <div className={s.readPane}>
          <div className={s.readRow}>
            <span className={s.readLabel}>Range Score</span>
            <span className={s.readValue}>
              <span className={s.scorePill}>
                <span style={{ color: "#34f5b0", fontSize: "1.05rem", fontWeight: 800 }}>{CHART.rangeScore}</span>
                <span style={{ color: "#5d6a8c" }}>/ 100</span>
              </span>
            </span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Price Position</span>
            <span className={s.readValue} style={{ color: "#38e1ff" }}>{CHART.pricePosition}</span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Support</span>
            <span className={s.readValue} style={{ color: "#34f5b0" }}>{CHART.support}</span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Resistance</span>
            <span className={s.readValue} style={{ color: "#ff5d7a" }}>{CHART.resistance}</span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Momentum</span>
            <span className={s.readValue} style={{ color: "#38e1ff" }}>{CHART.momentum}</span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Entry Quality</span>
            <span className={s.readValue} style={{ color: "#ffcf5c" }}>{CHART.entryQuality}</span>
          </div>
          <div className={s.readRow}>
            <span className={s.readLabel}>Risk Level</span>
            <span className={s.readValue} style={{ color: "#9b6bff" }}>{CHART.risk}</span>
          </div>
          <div className={s.verdictBox}>
            <span className={s.readLabel}>Verdict</span>
            <span className={s.verdictVal}>WAIT FOR PULLBACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
