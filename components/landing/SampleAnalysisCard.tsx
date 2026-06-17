import { sampleAnalysis } from "@/lib/range-data";

const a = sampleAnalysis;

export function SampleAnalysisCard() {
  return (
    <section
      id="tradingview-preview"
      className="border-b border-white/10 bg-[#070b12] px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase text-signal">Sample TradingView chart</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            A mock indicator overlay for reading ASTS without the candle chase.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            The preview uses CSS and SVG only. No chart API, no live data, no pretend signal engine -
            just the kind of clean TradingView overlay RangeClarity is being built around.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            Mock data only. Not a live feed, not financial advice.
          </p>
        </div>

        <article className="overflow-hidden rounded-lg border border-signal/20 bg-[#09111e] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-md border border-signal/30 bg-signal/10 text-sm font-black text-signal">
                {a.ticker.slice(0, 2)}
              </span>
              <div>
                <p className="text-lg font-black leading-none text-white">
                  {a.ticker} <span className="text-sm font-bold text-slate-500">/ {a.name}</span>
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                  {a.window}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-amber/40 bg-amber/10 px-2.5 py-1.5 text-[11px] font-black uppercase text-amber">
                Decision: {a.decision}
              </span>
              <span className="rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-black uppercase text-slate-400">
                Mock data
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.06fr_0.94fr]">
            <div className="space-y-4 border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#05070d]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase text-slate-500">
                    <span className="rounded border border-white/10 px-2 py-1">Range Map Overlay</span>
                    <span className="rounded border border-white/10 px-2 py-1">Momentum Engine</span>
                    <span className="rounded border border-white/10 px-2 py-1">Risk Radar</span>
                  </div>
                  <span className="rounded border border-mint/25 bg-mint/10 px-2 py-1 text-[11px] font-black uppercase text-mint">
                    Range score {a.rangeScore} / 100
                  </span>
                </div>

                <div className="relative h-72 overflow-hidden p-4">
                  <div className="absolute inset-0 dashboard-line opacity-50" />
                  <div className="absolute left-4 right-4 top-[23%] h-[18%] rounded border border-amber/30 bg-amber/10">
                    <span className="absolute right-2 top-2 text-[10px] font-black uppercase text-amber">
                      Resistance {a.resistance}
                    </span>
                  </div>
                  <div className="absolute left-4 right-4 bottom-[18%] h-[20%] rounded border border-mint/30 bg-mint/10">
                    <span className="absolute left-2 bottom-2 text-[10px] font-black uppercase text-mint">
                      Support {a.support}
                    </span>
                  </div>
                  <svg className="relative h-full w-full" viewBox="0 0 520 260" role="img" aria-label="Mock TradingView chart with RangeClarity overlays">
                    <polyline
                      points="6,204 42,184 76,191 112,158 146,166 184,132 220,140 252,105 286,116 324,76 362,88 396,58 430,74 468,69 514,92"
                      fill="none"
                      stroke="#9fd3ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="6,224 42,211 76,218 112,192 146,201 184,172 220,181 252,151 286,161 324,122 362,132 396,106 430,114 468,110 514,128"
                      fill="none"
                      stroke="#a8f0d1"
                      strokeWidth="1.5"
                      strokeDasharray="6 7"
                      strokeLinecap="round"
                    />
                    <line x1="0" y1="88" x2="520" y2="88" stroke="#d9b46c" strokeWidth="1.5" strokeDasharray="8 8" />
                    <line x1="0" y1="188" x2="520" y2="188" stroke="#a8f0d1" strokeWidth="1.5" strokeDasharray="8 8" />
                    <circle cx="468" cy="69" r="6" fill="#ffffff" />
                    <text x="384" y="52" fill="#ffffff" fontSize="12" fontWeight="700">
                      Current price {a.currentPrice}
                    </text>
                  </svg>
                  <div className="absolute bottom-4 right-4 rounded-md border border-amber/30 bg-[#080d17]/90 px-3 py-2 text-right">
                    <p className="text-[10px] font-black uppercase text-amber">Risk zone</p>
                    <p className="text-sm font-black text-white">{a.riskLevel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase text-slate-500">
                      Range score
                    </p>
                    <p className="mt-1 text-5xl font-black leading-none text-white">{a.rangeScore}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-mint">{a.position}</p>
                  </div>
                  <div className="rounded-md border border-amber/30 bg-amber/10 px-3 py-2 text-right">
                    <p className="text-[11px] font-bold uppercase text-amber">Entry quality</p>
                    <p className="text-lg font-black text-amber">{a.entryQuality}</p>
                  </div>
                </div>

                {/* Range bar */}
                <div className="range-band relative mt-5 h-14 overflow-hidden rounded-lg border border-white/10">
                  <div
                    className="absolute inset-y-0 bg-mint/20"
                    style={{ left: `${a.supportStartPct}%`, width: `${a.supportEndPct - a.supportStartPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 bg-amber/20"
                    style={{ left: `${a.resistanceStartPct}%`, width: `${a.resistanceEndPct - a.resistanceStartPct}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.7)]"
                    style={{ left: `${a.currentPct}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <RangeLabel label="Support" value={a.support} tone="mint" />
                  <RangeLabel label="Wait zone" value={a.waitZone} tone="white" />
                  <RangeLabel label="Resistance" value={a.resistance} tone="amber" />
                </div>
              </div>

                <div className="rounded-lg border border-white/10 bg-[#060a11] p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-black uppercase text-slate-500">
                    Momentum lifecycle
                  </p>
                  <p className="text-xs font-bold text-amber">{a.momentum}</p>
                </div>
                <div className="flex h-40 items-end gap-2">
                  {a.momentumBars.map((bar, index) => (
                    <span
                      key={index}
                      className={
                        index < 3
                          ? "w-full rounded-t bg-mint/55"
                          : index < 7
                            ? "w-full rounded-t bg-signal/65"
                            : "w-full rounded-t bg-amber/75"
                      }
                      style={{ height: `${bar}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span className="text-mint">Early</span>
                  <span className="text-signal">Strong</span>
                  <span className="text-amber">Extended</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {a.stats.map(([label, value, detail]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <dt className="text-[11px] font-black uppercase text-slate-500">{label}</dt>
                    <dd className="mt-1 text-xl font-black text-white">{value}</dd>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-signal/25 bg-signal/[0.08] p-4">
                <div>
                  <p className="text-[11px] font-black uppercase text-signal">Risk / reward</p>
                  <p className="mt-1 text-sm text-slate-300">Risk level: {a.riskLevel}</p>
                </div>
                <p className="text-3xl font-black text-signal">{a.riskReward}</p>
              </div>

              <div className="mt-3 rounded-lg border border-amber/25 bg-amber/10 p-4">
                <p className="text-[11px] font-black uppercase text-amber">Indicator readout</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{a.note}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function RangeLabel({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "mint" | "white" | "amber";
}) {
  const toneClass = {
    mint: "text-mint",
    white: "text-white",
    amber: "text-amber"
  }[tone];

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className={`mt-1 text-xs font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
