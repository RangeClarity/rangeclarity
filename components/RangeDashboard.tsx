import { productCards } from "@/lib/range-data";

const bars = [32, 46, 38, 58, 62, 74, 66, 82, 72, 88, 79, 92];

export function RangeDashboard({
  mode = "dark",
  dense = false
}: {
  mode?: "dark" | "light" | "terminal";
  dense?: boolean;
}) {
  const dark = mode !== "light";

  return (
    <div
      id="tradingview-preview"
      className={
        dark
          ? "overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b1220] shadow-terminal"
          : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium"
      }
    >
      <div
        className={
          dark
            ? "flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4"
            : "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"
        }
      >
        <div>
          <p className={dark ? "text-xs font-semibold uppercase text-slate-400" : "text-xs font-semibold uppercase text-slate-500"}>
            Mock indicator preview
          </p>
          <h3 className={dark ? "mt-1 text-lg font-semibold text-white" : "mt-1 text-lg font-semibold text-ink"}>
            MSFT TradingView range overlay
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={dark ? "rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint" : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"}>
            Decision map active
          </span>
          <span className={dark ? "rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber" : "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"}>
            Mock data
          </span>
        </div>
      </div>

      <div className={dense ? "grid gap-0 lg:grid-cols-[1.08fr_0.92fr]" : "grid gap-0 lg:grid-cols-[1.15fr_0.85fr]"}>
        <div className={dark ? "border-b border-white/10 p-5 lg:border-b-0 lg:border-r" : "border-b border-slate-200 p-5 lg:border-b-0 lg:border-r"}>
          <div className={dark ? "rounded-xl border border-white/10 bg-white/[0.025] p-4" : "rounded-xl border border-slate-200 bg-slate-50 p-4"}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className={dark ? "text-xs font-semibold uppercase text-slate-400" : "text-xs font-semibold uppercase text-slate-500"}>
                  Current range position
                </p>
                <p className={dark ? "mt-1 text-3xl font-semibold text-white" : "mt-1 text-3xl font-semibold text-ink"}>
                  62%
                </p>
              </div>
              <div className={dark ? "rounded-lg border border-white/10 px-3 py-2 text-right" : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-right"}>
                <p className={dark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>Entry quality</p>
                <p className={dark ? "text-xl font-semibold text-mint" : "text-xl font-semibold text-emerald-700"}>B</p>
              </div>
            </div>

            <div className={dark ? "range-band relative h-12 overflow-hidden rounded-lg border border-white/10" : "range-band relative h-12 overflow-hidden rounded-lg border border-slate-200"}>
              <div className="absolute left-[18%] top-0 h-full w-px bg-mint"></div>
              <div className="absolute left-[62%] top-0 h-full w-1 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]"></div>
              <div className="absolute left-[86%] top-0 h-full w-px bg-amber"></div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className={dark ? "text-slate-500" : "text-slate-500"}>Support</p>
                <p className={dark ? "font-semibold text-mint" : "font-semibold text-emerald-700"}>$182-186</p>
              </div>
              <div>
                <p className={dark ? "text-slate-500" : "text-slate-500"}>Wait zone</p>
                <p className={dark ? "font-semibold text-white" : "font-semibold text-ink"}>$199-204</p>
              </div>
              <div>
                <p className={dark ? "text-slate-500" : "text-slate-500"}>Resistance</p>
                <p className={dark ? "font-semibold text-amber" : "font-semibold text-amber-800"}>$211-216</p>
              </div>
            </div>
          </div>

          <div className={dark ? "mt-5 h-48 rounded-xl border border-white/10 bg-[#080d17] p-4" : "mt-5 h-48 rounded-xl border border-slate-200 bg-white p-4"}>
            <div className="flex h-full items-end gap-2">
              {bars.map((bar, index) => (
                <div
                  key={index}
                  className={
                    index < 4
                      ? "w-full rounded-t bg-mint/50"
                      : index > 8
                        ? "w-full rounded-t bg-amber/70"
                        : "w-full rounded-t bg-signal/60"
                  }
                  style={{ height: `${bar}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          {productCards.slice(0, dense ? 8 : 6).map((card) => (
            <div
              key={card.label}
              className={
                dark
                  ? "border-b border-white/10 p-4 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-r-0"
                  : "border-b border-slate-200 p-4 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-r-0"
              }
            >
              <p className={dark ? "text-xs font-semibold uppercase text-slate-400" : "text-xs font-semibold uppercase text-slate-500"}>
                {card.label}
              </p>
              <p className={dark ? "mt-1 text-xl font-semibold text-white" : "mt-1 text-xl font-semibold text-ink"}>
                {card.value}
              </p>
              <p className={dark ? "mt-2 text-sm leading-6 text-slate-400" : "mt-2 text-sm leading-6 text-slate-600"}>
                {card.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
