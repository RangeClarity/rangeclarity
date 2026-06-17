import { earlyAccessBenefits, pricingPlans } from "@/lib/range-data";
import { LandingButton } from "./LandingButton";

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-white/10 bg-[#070b12] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-signal">Pricing and early access</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Early access pricing coming soon.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            No payments are wired into this prototype. The page should explain the future commercial
            shape without pretending checkout, subscriptions, or TradingView access management exists
            yet.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.title} className="rounded-lg border border-white/10 bg-[#0a111d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-black text-white">{plan.title}</h3>
                <span className="rounded-md border border-mint/25 bg-mint/10 px-2.5 py-1.5 text-[11px] font-black uppercase text-mint">
                  {plan.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{plan.body}</p>
              <ul className="mt-5 grid gap-2 border-t border-white/10 pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-mint" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-amber/25 bg-amber/10 p-5">
          <p className="text-sm font-semibold leading-7 text-slate-200">
            Future AI Chart Companion: planned as an explanatory add-on for selected indicator
            readings and chart context. No real AI functionality is built into this landing page.
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {earlyAccessBenefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <p className="text-sm font-semibold leading-6 text-slate-300">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <LandingButton href="#early-access">Join Early Access</LandingButton>
        </div>
      </div>
    </section>
  );
}
