import { LandingButton } from "./LandingButton";

export function CTASection() {
  return (
    <section id="early-access" className="bg-[#070b12] px-5 py-16 sm:px-8 lg:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-lg border border-mint/25 bg-[#0a111d] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 range-grid opacity-20" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="text-sm font-black uppercase text-mint">Early access</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Stop chasing candles.
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-mint via-signal to-amber bg-clip-text text-transparent">
                Start reading the range.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Join the waitlist for RangeClarity TradingView indicator access, product previews, and
              setup notes. Premium, useful, slightly unhinged in the right places, and allergic to
              fake certainty.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <LandingButton
              href="mailto:hello@rangeclarity.com?subject=RangeClarity%20Early%20Access"
              className="w-full sm:w-auto lg:w-full"
            >
              Join Early Access
            </LandingButton>
            <LandingButton href="#indicator-modules" variant="ghost" className="w-full sm:w-auto lg:w-full">
              Revisit Modules
            </LandingButton>
          </div>
        </div>

        <div className="relative grid border-t border-white/10 sm:grid-cols-3">
          {[
            ["TradingView-first", "Indicator suite positioning"],
            ["Pricing soon", "No payments in prototype"],
            ["No magic calls", "Chart context, not advice"]
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-white/10 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="text-[11px] font-black uppercase text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
