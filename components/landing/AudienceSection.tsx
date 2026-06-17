import { audienceCards } from "@/lib/range-data";

export function AudienceSection() {
  return (
    <section id="who-it-is-for" className="border-b border-white/10 bg-[#070b12] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-mint">Who it is for</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
              For TradingView users who want structure without indicator chaos.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            RangeClarity is built for people who already care about price structure but want the chart
            to explain the range faster, cleaner, and with fewer lines fighting for attention.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {audienceCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-white/10 bg-[#0a111d] p-5">
              <p className="text-[11px] font-black uppercase text-signal">Built for</p>
              <h3 className="mt-3 text-lg font-black leading-tight text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
