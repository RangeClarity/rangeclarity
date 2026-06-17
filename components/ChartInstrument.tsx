"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SCENARIOS,
  getScenario,
  project,
  type Layout,
  type BiasT,
  type StateT,
} from "@/lib/scenarios";
import { onScenario } from "@/components/scenarioBus";

const L: Layout = { w: 1000, h: 440, padX: 18, padTop: 22, padBottom: 30 };

function biasTone(b: BiasT): string {
  if (b === "Bullish") return "bull";
  if (b === "Bearish") return "bear";
  return "neutral";
}

function stateTone(s: StateT): string {
  if (s === "Extended") return "warn";
  if (s === "Strong Trend" || s === "Constructive") return "bull";
  return "neutral";
}

export default function ChartInstrument({
  showTabs = true,
}: {
  showTabs?: boolean;
}) {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [scan, setScan] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const s = getScenario(activeId);
  const p = useMemo(() => project(s, L), [s]);

  // Allow Use Cases cards (or any caller) to drive this instrument.
  useEffect(() => onScenario((id) => setActiveId(id)), []);

  // Replay the scan sweep whenever the active scenario changes.
  useEffect(() => {
    setScan((n) => n + 1);
  }, [activeId]);

  // First on-enter sweep.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setScan((n) => n + 1);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const r = s.reading;

  return (
    <div className="instrument" ref={wrapRef} id="instrument">
      <div className="instrument-frame">
        <div className="instrument-bar">
          <span className="inst-symbol">SAMPLE</span>
          <span className="inst-sep">/</span>
          <span className="inst-tf">1D</span>
          <span className="inst-live" aria-hidden="true">
            <span className="dot" /> live read
          </span>
        </div>

        <div className="instrument-grid">
          <div className="chart-wrap">
            <svg
              className="chart"
              viewBox={`0 0 ${L.w} ${L.h}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={`${s.label}: ${r.bias} bias, ${r.state} state`}
            >
              <defs>
                <linearGradient id="scanGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#45e3c0" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#45e3c0" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#45e3c0" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* baseline grid */}
              {[0.25, 0.5, 0.75].map((g) => (
                <line
                  key={g}
                  className="grid-line"
                  x1={0}
                  x2={L.w}
                  y1={L.padTop + g * (L.h - L.padTop - L.padBottom)}
                  y2={L.padTop + g * (L.h - L.padTop - L.padBottom)}
                />
              ))}

              {/* zones */}
              {p.resistance ? (
                <g>
                  <rect
                    className="zone zone-r"
                    x={0}
                    y={p.resistance.y}
                    width={L.w}
                    height={p.resistance.h}
                  />
                  <text className="zone-label" x={L.w - 8} y={p.resistance.y + 13}>
                    RESISTANCE
                  </text>
                </g>
              ) : null}
              {p.support ? (
                <g>
                  <rect
                    className="zone zone-s"
                    x={0}
                    y={p.support.y}
                    width={L.w}
                    height={p.support.h}
                  />
                  <text className="zone-label" x={L.w - 8} y={p.support.y - 6}>
                    SUPPORT
                  </text>
                </g>
              ) : null}

              {/* candles */}
              <g>
                {p.candles.map((c, i) => (
                  <g className="candle" key={`${activeId}-${i}`}>
                    <line
                      className={`wick ${c.up ? "up" : "dn"}`}
                      x1={c.cx}
                      x2={c.cx}
                      y1={c.wickY}
                      y2={c.wickY + c.wickH}
                    />
                    <rect
                      className={`body ${c.up ? "up" : "dn"}`}
                      x={c.bx}
                      y={c.bodyY}
                      width={c.bw}
                      height={c.bodyH}
                    />
                  </g>
                ))}
              </g>

              {/* EMA reference */}
              <path className="ema" d={p.emaPath} />

              {/* playhead + last marker */}
              <line
                className="playhead"
                x1={p.last.x}
                x2={p.last.x}
                y1={L.padTop}
                y2={L.h - L.padBottom}
              />
              <circle className="last-dot" cx={p.last.x} cy={p.last.y} r={4.5} />
              <circle className="last-halo" cx={p.last.x} cy={p.last.y} r={4.5} />

              {/* scan sweep (re-keyed to replay) */}
              <rect
                key={scan}
                className="scan"
                x={0}
                y={L.padTop}
                width={120}
                height={L.h - L.padTop - L.padBottom}
              />
            </svg>
          </div>

          <div className="readout" key={`ro-${activeId}`}>
            <div className="ro-row ro-head">
              <div>
                <span className="ro-key">Bias</span>
                <span className={`tag tag-${biasTone(r.bias)}`}>{r.bias}</span>
              </div>
              <div>
                <span className="ro-key">State</span>
                <span className={`tag tag-${stateTone(r.state)}`}>{r.state}</span>
              </div>
            </div>

            <dl className="ro-list">
              <div className="ro-line">
                <dt>Support / Resistance</dt>
                <dd>
                  {s.support ? "zone below" : "none"}
                  <span className="ro-dim"> / </span>
                  {s.resistance ? "zone above" : "none"}
                </dd>
              </div>
              <div className="ro-line">
                <dt>Location</dt>
                <dd>
                  <span className="ro-dim">to S</span> {r.distToSupport}
                  <span className="ro-gap" />
                  <span className="ro-dim">to R</span> {r.distToResistance}
                </dd>
              </div>
              <div className="ro-line">
                <dt>In range</dt>
                <dd>{r.inRange}</dd>
              </div>
              <div className="ro-line">
                <dt>Range width</dt>
                <dd>{r.rangeWidth}</dd>
              </div>
              <div className="ro-line">
                <dt>Extension / Volume</dt>
                <dd>
                  {r.extension}
                  <span className="ro-dim"> / </span>
                  {r.volume}
                </dd>
              </div>
            </dl>

            <p className="ro-interp">{r.interpretation}</p>
          </div>
        </div>
      </div>

      {showTabs ? (
        <div className="inst-tabs" role="tablist" aria-label="Sample chart situations">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              role="tab"
              aria-selected={sc.id === activeId}
              className={`inst-tab ${sc.id === activeId ? "is-active" : ""}`}
              onClick={() => setActiveId(sc.id)}
            >
              {sc.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
