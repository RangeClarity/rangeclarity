import { toolkitModules } from "@/lib/range-data";
import { ToolkitCard } from "./ToolkitCard";

export function ToolkitSection() {
  return (
    <section
      id="indicator-modules"
      className="relative overflow-hidden border-b border-white/10 bg-[#05070d] px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="absolute inset-0 range-grid opacity-25" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-mint">Indicator modules</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Three TradingView indicators for reading range, momentum, and risk.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            RangeClarity is not a noisy signal machine. The suite is built as an overlay-first
            indicator pack: one module for range structure, one for momentum state, and one for entry
            risk.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {toolkitModules.map((module) => (
            <ToolkitCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </section>
  );
}
