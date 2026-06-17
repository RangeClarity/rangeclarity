# RangeClarity — Visual Guide (Reference)

A premium, visual-first explainer of the RangeClarity indicator, built as live pages in this Next.js app. It complements the text reference in `RANGECLARITY_INDICATOR_USER_GUIDE.md` and the `RANGECLARITY_QUICK_START.md`.

## Routes

| Route | Purpose |
|---|---|
| `/indicator-guide` | The full interactive visual guide (premium dark fintech). |
| `/indicator-guide/print` | A light, A4/Letter-optimized handbook for browser Print → Save as PDF. |

Both pages are `noindex` (internal/sharing use). All visuals are **mock / illustrative** — no live market data, no APIs.

## What's on the interactive page (`/indicator-guide`)

1. **Hero / Overview** — headline, subhead, and an "At a glance" block (what it is / who it's for / what it avoids / what it is not).
2. **Capability grid** — the 7 things it detects (Regime, Structure, S/R, Range Position, Momentum, Confidence, No-Edge), each with what you see + why it matters.
3. **Visual anatomy** — an annotated mock chart (SVG) with numbered callouts (support zone, resistance zone, current price position, dashboard, momentum, confidence, context) and a legend.
4. **Dashboard explainer** — a faithful mock of the on-chart table with every row explained (means / example / don't-assume).
5. **Regime explainer** — the 5 regimes (Trend, Range, Compression, Expansion, Chop) + a note that "No Edge" is a Context result, not a regime.
6. **Structure explainer** — 6 states with mini chart thumbnails.
7. **Support/Resistance explainer** — zone-vs-line diagram and callout boxes.
8. **Momentum explainer** — 6 states with score bars and the "strong ≠ good entry" key.
9. **Confidence explainer** — meters for High/Medium/Low/Conflicting + the "alignment, not profit" message.
10. **No-Edge explainer** — a side-by-side "Clear context vs No Edge" comparison and the reasons it appears.
11. **Context label library** — all 8 labels (Watch, Wait, No Edge, Avoid Chase, Breakout Watch, Pullback Zone, Strong Context, Risk Elevated).
12. **Workflow** — a 9-step process flow.
13. **Example scenarios** — 5 hypothetical reads with mini charts, dashboard states, and context labels.
14. **What it does NOT do** — a strong "do not misunderstand" panel.
15. **One-page quick start** — condensed summary (ideal for PDF).
16. **FAQ** — including an honest repaint answer.

## Accuracy

Every label, regime, momentum/confidence state, context label, dashboard row, and the repaint explanation are taken directly from `pine/rangeclarity_ultimate_core.pine`. The single source of content is `app/indicator-guide/_components/data.ts`; update that file if the indicator changes. The chip colors mirror the indicator's own `colorFor()` color language.

## Components (reusable)

In `app/indicator-guide/_components/`:

- `data.ts` — all guide content (single source of truth).
- `ui.tsx` — `Chip`, `ScoreBar`, `Meter`, `SectionHead`, `DashboardMock`, `MiniPattern`.
- `ChartAnatomy.tsx` — the annotated chart SVG + legend data.
- `sections.tsx` — `IndicatorGuideHero`, `IndicatorCapabilityGrid`, `IndicatorVisualBreakdown`, `DashboardExplainer`, `RegimeExplainer`, `StructureExplainer`, `ChartZoneExplainer`, `MomentumExplainer`, `ConfidenceExplainer`, `NoEdgeExplainer`, `ContextLabels`, `WorkflowExplainer`, `ExampleScenarios`, `NotMeant`, `PrintSummaryPage`, `FAQSection`.
- `guide.module.css` — scoped styles (with `@media print`).

The print route lives in `app/indicator-guide/print/` (`page.tsx` + `print.module.css`) and reuses `data.ts`.

## Run locally

```bash
npm run dev
# open http://localhost:3000/indicator-guide
# print version: http://localhost:3000/indicator-guide/print
```

## Notes

- No indicator logic was changed by this guide.
- No new dependencies were added; PDF is handled by the browser (see `RANGECLARITY_PDF_EXPORT_GUIDE.md`).
- To share with testers, deploy as usual (Vercel) and send the `/indicator-guide` link, or export the print page to PDF.
