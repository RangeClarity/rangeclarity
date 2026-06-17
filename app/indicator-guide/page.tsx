import type { Metadata } from "next";
import Link from "next/link";
import s from "./_components/guide.module.css";
import {
  IndicatorGuideHero,
  IndicatorCapabilityGrid,
  IndicatorVisualBreakdown,
  DashboardExplainer,
  RegimeExplainer,
  StructureExplainer,
  ChartZoneExplainer,
  MomentumExplainer,
  ConfidenceExplainer,
  NoEdgeExplainer,
  ContextLabels,
  WorkflowExplainer,
  ExampleScenarios,
  NotMeant,
  PrintSummaryPage,
  FAQSection,
} from "./_components/sections";

export const metadata: Metadata = {
  title: "RangeClarity — Indicator Visual Guide",
  description:
    "A premium visual breakdown of the RangeClarity TradingView indicator: regime, structure, support/resistance, momentum, confidence and no-edge.",
  robots: { index: false, follow: false },
};

export default function IndicatorGuidePage() {
  return (
    <div className={s.page}>
      <div className={s.bgGrid} aria-hidden="true" />
      <div className={s.glow} aria-hidden="true" />

      <nav className={s.topbar}>
        <div className={s.topInner}>
          <span className={s.brand}>
            <span className={s.brandDot} /> RangeClarity
          </span>
          <div className={s.topLinks}>
            <Link href="/indicator-guide/print" className={s.topLink}>Print / PDF version →</Link>
          </div>
        </div>
      </nav>

      <main className={s.wrap}>
        <IndicatorGuideHero />
        <IndicatorCapabilityGrid />
        <IndicatorVisualBreakdown />
        <DashboardExplainer />
        <RegimeExplainer />
        <StructureExplainer />
        <ChartZoneExplainer />
        <MomentumExplainer />
        <ConfidenceExplainer />
        <NoEdgeExplainer />
        <ContextLabels />
        <WorkflowExplainer />
        <ExampleScenarios />
        <NotMeant />
        <PrintSummaryPage />
        <FAQSection />

        <footer className={s.footer}>
          <p className={s.footNote}>
            RangeClarity Ultimate Core · visual guide. Educational and analytical only — not financial advice.
          </p>
          <Link href="/indicator-guide/print" className={s.btnGhost}>Open print / PDF version →</Link>
        </footer>
      </main>
    </div>
  );
}
