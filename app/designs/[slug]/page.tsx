import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTAButtons } from "@/components/CTAButtons";
import { DesignNav } from "@/components/DesignNav";
import { PremiumMemeFintechLanding } from "@/components/landing/PremiumMemeFintechLanding";
import { RangeDashboard } from "@/components/RangeDashboard";
import { audiences, decisionSteps, designRoutes, problems, productCards } from "@/lib/range-data";

const slugs = ["premium-fintech", "data-terminal", "research-lab", "bold-hero"] as const;
type DesignSlug = (typeof slugs)[number];

const routeTitles: Record<DesignSlug, string> = {
  "premium-fintech": "Premium Indicators",
  "data-terminal": "Indicator Terminal",
  "research-lab": "Investor Research Lab",
  "bold-hero": "Bold Hero"
};

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = parseSlug(params.slug);
  if (!slug) {
    return {};
  }

  return {
    title: `${routeTitles[slug]} | RangeClarity`,
    description:
      "Premium TradingView indicators for reading the range before you make the move."
  };
}

export default function DesignPage({ params }: { params: { slug: string } }) {
  const slug = parseSlug(params.slug);

  if (!slug) {
    notFound();
  }

  if (slug === "premium-fintech") return <PremiumFintech />;
  if (slug === "data-terminal") return <DataTerminal />;
  if (slug === "research-lab") return <ResearchLab />;
  return <BoldHero />;
}

function parseSlug(slug: string): DesignSlug | null {
  return slugs.includes(slug as DesignSlug) ? (slug as DesignSlug) : null;
}

function PremiumFintech() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <DesignNav current="premium-fintech" />
      <PremiumMemeFintechLanding />
    </main>
  );
}

function DataTerminal() {
  return (
    <main className="min-h-screen bg-[#05070b] font-mono text-slate-100">
      <DesignNav current="data-terminal" />
      <section className="border-b border-signal/[0.15] bg-[#05070b] px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs uppercase text-slate-500">
            <span className="rounded border border-signal/20 px-2 py-1 text-signal">RangeClarity Indicators</span>
            <span>Mock TradingView overlay</span>
            <span>Long-term investor mode</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-2xl border border-signal/[0.15] bg-[#08101d] p-6 shadow-terminal">
              <p className="text-xs font-semibold uppercase text-signal">Indicator Terminal</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                TradingView indicators that show the range before you make the move.
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-300">
                RangeClarity overlays support, resistance, momentum, entry quality, and risk zones directly on your chart - so the decision map lives where you already work.
              </p>
              <div className="mt-8">
                <CTAButtons variant="terminal" />
              </div>
            </div>
            <RangeDashboard mode="terminal" dense />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {productCards.slice(0, 4).map((card) => (
              <div key={card.label} className="rounded-xl border border-signal/[0.15] bg-[#08101d] p-4">
                <p className="text-xs uppercase text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-signal">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProblemSection dark label="Market context gaps" terminal />
      <WhatItDoesSection dark terminal />
      <DecisionSection dark terminal />
      <WhoSection dark terminal />
      <EarlyAccess dark terminal />
      <Footer dark />
    </main>
  );
}

function ResearchLab() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-ink">
      <DesignNav current="research-lab" theme="light" />
      <section className="fine-grid border-b border-slate-200 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Investor Research Lab
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              TradingView indicators that show the range before you make the move.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              RangeClarity turns messy price action into clean chart overlays for support, resistance, momentum, entry quality, and risk zones.
            </p>
            <div className="mt-8">
              <CTAButtons variant="light" />
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-premium">
            <RangeDashboard mode="light" />
          </div>
        </div>
      </section>

      <ProblemSection label="Why investors need technical context" />
      <WhatItDoesSection />
      <DecisionSection />
      <WhoSection />
      <EarlyAccess />
      <Footer />
    </main>
  );
}

function BoldHero() {
  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <DesignNav current="bold-hero" />
      <section className="relative min-h-[calc(100svh-76px)] overflow-hidden border-b border-white/10">
        <img
          src="/assets/rangeclarity-hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,18,0.98)_0%,rgba(7,11,18,0.82)_44%,rgba(7,11,18,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,18,0.18)_0%,rgba(7,11,18,0.96)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100svh-76px)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Bold Hero</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-8xl">
              TradingView indicators that show the range before you make the move.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              RangeClarity turns messy price action into clean overlays for range, momentum, entry quality, and risk directly on the TradingView chart.
            </p>
            <div className="mt-8">
              <CTAButtons />
            </div>
          </div>
          <div className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              ["Range Position", "62%"],
              ["Entry Quality", "B"],
              ["Risk / Reward", "1.8x"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <RangeDashboard />
        </div>
      </section>
      <ProblemSection dark label="The decision gap" />
      <WhatItDoesSection dark />
      <DecisionSection dark />
      <WhoSection dark />
      <EarlyAccess dark />
      <Footer dark />
    </main>
  );
}

function ProblemSection({
  dark = false,
  terminal = false,
  label
}: {
  dark?: boolean;
  terminal?: boolean;
  label: string;
}) {
  return (
    <section className={dark ? "border-b border-white/10 px-5 py-16 sm:px-8 lg:py-24" : "border-b border-slate-200 px-5 py-16 sm:px-8 lg:py-24"}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className={dark ? "text-sm font-semibold uppercase text-slate-500" : "text-sm font-semibold uppercase text-slate-500"}>
            {label}
          </p>
          <h2 className={dark ? "mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl" : "mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"}>
            Fundamentals tell you what you may want to own. TradingView range context helps you decide when.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((problem, index) => (
            <article
              key={problem}
              className={
                dark
                  ? "rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                  : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              }
            >
              <span className={terminal ? "text-sm text-signal" : dark ? "text-sm text-amber" : "text-sm text-slate-500"}>
                0{index + 1}
              </span>
              <p className={dark ? "mt-4 leading-7 text-slate-300" : "mt-4 leading-7 text-slate-700"}>
                {problem}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatItDoesSection({
  dark = false,
  terminal = false
}: {
  dark?: boolean;
  terminal?: boolean;
}) {
  return (
    <section className={dark ? "border-b border-white/10 px-5 py-16 sm:px-8 lg:py-24" : "border-b border-slate-200 px-5 py-16 sm:px-8 lg:py-24"}>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className={terminal ? "text-sm font-semibold uppercase text-signal" : dark ? "text-sm font-semibold uppercase text-mint" : "text-sm font-semibold uppercase text-slate-500"}>
            What RangeClarity does
          </p>
          <h2 className={dark ? "mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl" : "mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-5xl"}>
            A TradingView indicator suite built for investors, not intraday signal chasing.
          </h2>
          <p className={dark ? "mt-5 text-lg leading-8 text-slate-300" : "mt-5 text-lg leading-8 text-slate-700"}>
            RangeClarity summarizes where price sits, which zones matter, how momentum is behaving, and whether the current setup favors action, patience, or avoidance.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {productCards.slice(0, 8).map((card) => (
            <article
              key={card.label}
              className={
                dark
                  ? "rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                  : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              }
            >
              <p className={dark ? "text-xs font-semibold uppercase text-slate-500" : "text-xs font-semibold uppercase text-slate-500"}>
                {card.label}
              </p>
              <p className={terminal ? "mt-3 text-2xl font-semibold text-signal" : dark ? "mt-3 text-2xl font-semibold text-white" : "mt-3 text-2xl font-semibold text-ink"}>
                {card.value}
              </p>
              <p className={dark ? "mt-3 text-sm leading-6 text-slate-400" : "mt-3 text-sm leading-6 text-slate-600"}>
                {card.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecisionSection({
  dark = false,
  terminal = false
}: {
  dark?: boolean;
  terminal?: boolean;
}) {
  return (
    <section className={dark ? "border-b border-white/10 px-5 py-16 sm:px-8 lg:py-24" : "border-b border-slate-200 px-5 py-16 sm:px-8 lg:py-24"}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className={terminal ? "text-sm font-semibold uppercase text-signal" : dark ? "text-sm font-semibold uppercase text-mint" : "text-sm font-semibold uppercase text-slate-500"}>
            How it helps investors decide
          </p>
          <h2 className={dark ? "mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl" : "mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-5xl"}>
            Turn technical range context into a buy, wait, or avoid conversation.
          </h2>
        </div>
        <div className="grid gap-4">
          {decisionSteps.map((step) => (
            <article
              key={step.title}
              className={
                dark
                  ? "rounded-2xl border border-white/10 bg-white/[0.035] p-6"
                  : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              }
            >
              <h3 className={dark ? "text-xl font-semibold text-white" : "text-xl font-semibold text-ink"}>{step.title}</h3>
              <p className={dark ? "mt-3 leading-7 text-slate-300" : "mt-3 leading-7 text-slate-700"}>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoSection({
  dark = false,
  terminal = false
}: {
  dark?: boolean;
  terminal?: boolean;
}) {
  return (
    <section className={dark ? "border-b border-white/10 px-5 py-16 sm:px-8 lg:py-24" : "border-b border-slate-200 px-5 py-16 sm:px-8 lg:py-24"}>
      <div className="mx-auto max-w-7xl">
        <p className={terminal ? "text-sm font-semibold uppercase text-signal" : dark ? "text-sm font-semibold uppercase text-mint" : "text-sm font-semibold uppercase text-slate-500"}>
          Who it is for
        </p>
        <h2 className={dark ? "mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl" : "mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl"}>
          Built for investors who want technical clarity without becoming full-time traders.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {audiences.map((audience) => (
            <div
              key={audience}
              className={
                dark
                  ? "rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-slate-300"
                  : "rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm"
              }
            >
              {audience}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EarlyAccess({
  dark = false,
  terminal = false
}: {
  dark?: boolean;
  terminal?: boolean;
}) {
  return (
    <section id="early-access" className={dark ? "px-5 py-16 sm:px-8 lg:py-24" : "px-5 py-16 sm:px-8 lg:py-24"}>
      <div
        className={
          dark
            ? "mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-premium sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
            : "mx-auto grid max-w-7xl gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-premium sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
        }
      >
        <div>
          <p className={terminal ? "text-sm font-semibold uppercase text-signal" : dark ? "text-sm font-semibold uppercase text-mint" : "text-sm font-semibold uppercase text-slate-500"}>
            Early access
          </p>
          <h2 className={dark ? "mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl" : "mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl"}>
            Join the waitlist for the first RangeClarity TradingView indicator suite.
          </h2>
          <p className={dark ? "mt-4 max-w-2xl leading-7 text-slate-300" : "mt-4 max-w-2xl leading-7 text-slate-700"}>
            Get sample indicator previews, setup notes, and launch access when the private beta opens.
          </p>
        </div>
        <a
          href="mailto:hello@rangeclarity.com?subject=RangeClarity%20Early%20Access"
          className={
            dark
              ? "inline-flex min-h-[52px] items-center justify-center rounded-lg bg-white px-6 py-4 text-sm font-semibold text-ink hover:bg-platinum"
              : "inline-flex min-h-[52px] items-center justify-center rounded-lg bg-ink px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800"
          }
        >
          Join Early Access
        </a>
      </div>
    </section>
  );
}

function Footer({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={dark ? "border-t border-white/10 px-5 py-8 text-sm text-slate-500 sm:px-8" : "border-t border-slate-200 px-5 py-8 text-sm text-slate-500 sm:px-8"}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className={dark ? "font-semibold text-white" : "font-semibold text-ink"}>RangeClarity</span>
        <span>Investor decision support and market education. Not financial advice.</span>
        <div className="flex flex-wrap gap-3">
          {designRoutes.map((route) => (
            <a key={route.href} href={route.href} className={dark ? "hover:text-white" : "hover:text-ink"}>
              {route.title}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
