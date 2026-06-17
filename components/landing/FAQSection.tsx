import { faqItems } from "@/lib/range-data";

export function FAQSection() {
  return (
    <section id="faq" className="border-b border-white/10 bg-[#05070d] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-mint">FAQ and trust notes</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
            The serious stuff, without the compliance fog machine.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Inspired by the strongest indicator landing pages: answer access, platform, markets,
            and risk questions before the visitor has to hunt for them.
          </p>
          <div className="mt-6 rounded-lg border border-amber/25 bg-amber/10 p-4">
            <p className="text-sm font-semibold leading-7 text-slate-200">
              RangeClarity provides educational chart context only. It is not financial advice, not
              a signal bot, and not a guarantee of results.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-lg border border-white/10 bg-[#0a111d] p-5">
              <h3 className="text-base font-black leading-tight text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
