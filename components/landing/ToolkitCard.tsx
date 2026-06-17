import { toolkitModules } from "@/lib/range-data";

type ToolkitModule = (typeof toolkitModules)[number];

const dotClasses = {
  mint: "bg-mint",
  signal: "bg-signal",
  amber: "bg-amber"
} as const;

export function ToolkitCard({ module }: { module: ToolkitModule }) {
  return (
    <article
      className={`group relative flex min-h-full flex-col overflow-hidden rounded-lg border bg-[#0a111d]/90 p-5 transition duration-300 hover:-translate-y-1.5 hover:bg-[#0c1422] ${module.borderClass} ${module.glowClass}`}
    >
      {/* faint module index watermark */}
      <span className="pointer-events-none absolute right-4 top-3 text-[11px] font-bold uppercase text-white/15">
        Indicator
      </span>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-md border px-2.5 py-1.5 text-[11px] font-black uppercase ${module.pillClass}`}>
          {module.category}
        </span>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-bold text-slate-400">
          {module.indicatorLabel}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-500">{module.status}</p>
          <h3 className="text-2xl font-black leading-tight text-white">{module.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
        </div>
        <div className="flex-none text-right">
          <p className={`text-4xl font-black leading-none ${module.metricClass}`}>{module.metric}</p>
          <p className="mt-1 text-[10px] font-bold uppercase text-slate-500">{module.metricLabel}</p>
        </div>
      </div>

      <ModuleVisual module={module} />

      <div className="mt-4 grid gap-2">
        <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
          <p className="text-[10px] font-black uppercase text-slate-500">Included layer</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{module.packageLine}</p>
        </div>
        <div className="rounded-md border border-mint/20 bg-mint/[0.06] p-3">
          <p className="text-[10px] font-black uppercase text-mint">Chart output</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{module.setupOutput}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        {module.stats.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
            <dt className="text-[10px] font-bold uppercase leading-tight text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-black text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 flex flex-1 flex-col gap-3 border-t border-white/10 pt-5">
        {module.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-6 text-slate-300">
            <span className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${dotClasses[module.accent]}`} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-5">
        <div className="rounded-md border border-amber/20 bg-amber/10 p-3">
          <p className="text-[10px] font-black uppercase text-amber">What it helps you avoid</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{module.avoid}</p>
        </div>
        <div className="rounded-md border border-signal/20 bg-signal/[0.08] p-3">
          <p className="text-[10px] font-black uppercase text-signal">Best for</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{module.bestFor}</p>
        </div>
      </div>
    </article>
  );
}

function ModuleVisual({ module }: { module: ToolkitModule }) {
  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-4">
      {module.visual === "range" && <RangeVisual />}
      {module.visual === "momentum" && <MomentumVisual />}
      {module.visual === "risk" && <RiskVisual />}
    </div>
  );
}

function RangeVisual() {
  return (
    <div>
      <div className="relative h-12 overflow-hidden rounded-md border border-white/10 range-band">
        <div className="absolute inset-y-0 left-0 w-[24%] bg-mint/20" />
        <div className="absolute inset-y-0 right-0 w-[20%] bg-amber/20" />
        <div className="absolute left-[78%] top-0 h-full w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]" />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase text-slate-500">
        <span className="text-mint">Support</span>
        <span>Wait</span>
        <span className="text-amber">Resistance</span>
      </div>
    </div>
  );
}

const momentumBars = [20, 30, 26, 42, 52, 60, 74, 86, 90, 78];
const currentStage = 6; // zero-indexed -> stage 07

function MomentumVisual() {
  return (
    <div>
      <div className="flex h-16 items-end gap-1.5">
        {momentumBars.map((height, index) => {
          const tone =
            index < 3 ? "bg-mint/45" : index < 7 ? "bg-signal/65" : "bg-amber/75";
          const active = index === currentStage;
          return (
            <span
              key={index}
              className={`w-full rounded-t ${tone} ${active ? "outline outline-1 outline-white/70" : ""}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase text-slate-500">
        <span className="text-mint">Early</span>
        <span className="text-signal">Strong</span>
        <span className="text-amber">Extended</span>
      </div>
    </div>
  );
}

function RiskVisual() {
  return (
    <div className="space-y-3">
      <Meter label="Reward" value="+18%" tone="text-mint" width="64%" bar="from-mint to-signal" />
      <Meter label="Downside risk" value="-10%" tone="text-amber" width="36%" bar="from-amber to-rose-300" />
    </div>
  );
}

function Meter({
  label,
  value,
  tone,
  width,
  bar
}: {
  label: string;
  value: string;
  tone: string;
  width: string;
  bar: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
        <span>{label}</span>
        <span className={tone}>{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${bar}`} style={{ width }} />
      </div>
    </div>
  );
}
