import { heroProofPoints, heroStats, trustSignals } from "@/lib/range-data";
import { LandingButton } from "./LandingButton";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-73px)] overflow-hidden border-b border-white/10 bg-[#05070d]">
      <img
        src="/assets/rangeclarity-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-70 sm:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.99)_0%,rgba(5,7,13,0.92)_36%,rgba(5,7,13,0.52)_70%,rgba(5,7,13,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.12)_0%,rgba(5,7,13,0.46)_58%,rgba(5,7,13,0.97)_100%)]" />
      <div className="absolute inset-0 range-grid opacity-30" />

      <div className="relative mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col px-5 py-10 sm:px-8 lg:py-12">
        <div className="flex flex-1 items-center py-8 sm:py-10">
          <div className="max-w-4xl">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2 text-[11px] font-bold uppercase text-amber sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_10px_rgba(217,180,108,0.8)]" />
              <span>Premium TradingView indicator suite</span>
              <span className="hidden h-1 w-1 rounded-full bg-amber/70 sm:inline-block" />
              <span className="hidden sm:inline">Range reading mode</span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              TradingView indicators that show the range before you make the{" "}
              <span className="bg-gradient-to-r from-mint via-signal to-amber bg-clip-text text-transparent">
                move.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              RangeClarity overlays support, resistance, momentum, entry quality, and risk zones
              directly on your TradingView chart - so you can stop chasing candles and start reading
              structure.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LandingButton href="#early-access" className="w-full sm:w-auto">
                Join Early Access
              </LandingButton>
              <LandingButton href="#indicator-modules" variant="secondary" className="w-full sm:w-auto">
                View Indicator Modules
              </LandingButton>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-300">
              No repaint hype. No guaranteed signals. Just cleaner chart context.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur"
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-3">
              {heroProofPoints.map((point) => (
                <div
                  key={point.label}
                  className="rounded-lg border border-white/[0.1] bg-[#07111f]/70 p-3 backdrop-blur"
                >
                  <p className="text-[10px] font-black uppercase text-slate-500">{point.label}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{point.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-lg border border-white/[0.12] bg-[#07111f]/80 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:border-white/25"
            >
              <p className="text-[11px] font-bold uppercase text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-black text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{stat.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
