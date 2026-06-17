# RangeClarity — PDF Export Guide

How to turn the visual guide into a clean, shareable PDF. No PDF library is used — the browser's built-in "Save as PDF" produces the best result with the print-optimized page.

## 1. Which page to export

Open the **print route**:

```
/indicator-guide/print
```

Locally: `http://localhost:3000/indicator-guide/print`.

This is a **light, A4/Letter-optimized handbook** with controlled page breaks. (You *can* also export the dark `/indicator-guide` page — it has print styles that flip it to a light layout — but the dedicated print route is cleaner and recommended for sharing.)

## 2. How to export (Chrome / Edge — recommended)

1. Open `/indicator-guide/print`.
2. Press **Ctrl/Cmd + P**.
3. **Destination:** "Save as PDF".
4. **Paper size:** A4 or Letter.
5. **Layout:** Portrait.
6. **Margins:** Default (the page sets its own `@page` margins).
7. **Background graphics:** **ON** (important — keeps the colored status tags and panels). In Chrome this is under "More settings → Background graphics".
8. **Scale:** 100% (use "Fit to page width" only if something clips).
9. Click **Save**.

### Safari
File → Export as PDF, or Print → PDF dropdown → "Save as PDF". Enable "Print backgrounds" in the print dialog.

### Firefox
Ctrl/Cmd + P → Destination "Save to PDF" → enable "Print backgrounds" under "More settings".

## 3. Recommended settings summary

| Setting | Recommendation |
|---|---|
| Page to open | `/indicator-guide/print` |
| Paper size | A4 or Letter |
| Orientation | Portrait |
| Margins | Default |
| Background graphics | **Enabled** |
| Scale | 100% (or "fit to width" if needed) |
| Headers/footers | Off (cleaner) |

## 4. Quality tips

- **Always enable background graphics** — otherwise the colored context tags and section panels print as plain text.
- The quick-start summary starts on its **own page** (a deliberate page break) so you can hand someone a single sheet.
- Cards and tables are set to avoid breaking across pages (`break-inside: avoid`); if a long table still splits, reduce scale slightly.
- For the sharpest result, export at 100% scale rather than zooming the browser first.
- Want a dark-themed PDF for screen viewing? Export `/indicator-guide` instead and keep background graphics on — but note dark backgrounds use more ink if physically printed.

## 5. Sharing

- **Testers / onboarding:** the print PDF works as a standalone handbook.
- **Experts (QuantNomad / Daveatt):** pair the PDF with `RANGECLARITY_EXPERT_REVIEW_BRIEF.md` and the Pine file.
- **Web:** deploy (Vercel) and share the live `/indicator-guide` link for the interactive version.

## 6. Troubleshooting

- *Colors missing:* background graphics is off — turn it on.
- *Everything is one color / dark:* you exported the dark page without backgrounds; use `/indicator-guide/print`.
- *Table cut between pages:* lower the scale to ~90% or switch to Letter.
- *Fonts look off:* the guide uses system fonts; this is expected and renders cleanly in PDF.
