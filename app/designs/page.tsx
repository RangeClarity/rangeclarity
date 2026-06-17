import Link from "next/link";
import { DesignNav } from "@/components/DesignNav";
import { designRoutes } from "@/lib/range-data";

export default function DesignsIndex() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <DesignNav />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <p className="text-sm font-semibold uppercase text-mint">RangeClarity concepts</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          Four premium directions for TradingView range intelligence.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          The primary route now positions RangeClarity as a premium TradingView indicator suite for reading range, momentum, and entry risk before making the move.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {designRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-premium transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <p className="text-sm font-semibold uppercase text-slate-400">Design direction</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{route.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{route.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-mint group-hover:text-white">
                Open route
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
