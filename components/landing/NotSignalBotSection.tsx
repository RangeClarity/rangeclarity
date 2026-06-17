import { notForItems } from "@/lib/range-data";

export function NotSignalBotSection() {
  return (
    <section id="what-it-is-not" className="border-b border-white/10 bg-[#05070d] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-amber">What RangeClarity is not</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            No fake certainty. No casino chart cosplay.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            The product should be funny enough to feel alive, but serious enough to say the quiet
            compliance part clearly: this is chart context, not a promise.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {notForItems.map((item) => (
            <article key={item.title} className="rounded-lg border border-white/10 bg-[#0a111d] p-5">
              <h3 className="text-lg font-black text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
