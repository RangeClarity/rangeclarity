import { processSteps, setupHighlights } from "@/lib/range-data";

export function ProcessSection() {
  return (
    <section id="how-it-works" className="border-b border-white/10 bg-[#05070d] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-amber">How it works</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Install the indicators, read the structure, then decide with a cleaner chart.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            The flow is intentionally simple: TradingView first, indicator overlays second, decision
            context third. No backend, no brokerage flow, no magic button.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-mint/40 via-signal/40 to-amber/40 lg:block" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {processSteps.map((step) => (
              <li
                key={step.title}
                className="relative rounded-lg border border-white/10 bg-[#0a111d]/90 p-5 transition hover:border-white/25"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md border border-signal/30 bg-[#05070d] text-sm font-black text-signal">
                  {step.eyebrow}
                </span>
                <h3 className="mt-4 text-base font-black leading-tight text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {setupHighlights.map((item) => (
            <article key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] font-black uppercase text-signal">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
