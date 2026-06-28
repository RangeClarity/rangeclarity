# RangeClarity — Roadmap Package

Two investor / product-strategy PDFs and their editable sources.

| Deliverable | File |
|---|---|
| Overall Project Roadmap (PDF, 17 pages) | `RangeClarity_Overall_Roadmap.pdf` |
| Next Sprint Taskbook (PDF, 14 pages) | `RangeClarity_Next_Sprint_Taskbook.pdf` |
| Overall Roadmap — editable text | `RangeClarity_Overall_Roadmap.md` |
| Next Sprint Taskbook — editable text | `RangeClarity_Next_Sprint_Taskbook.md` |
| Assembled HTML (design source, regenerated each build) | `RangeClarity_Overall_Roadmap.html`, `RangeClarity_Next_Sprint_Taskbook.html` |

## Design

Premium fintech dark theme, A4 landscape, built to read like a product-strategy deck. Tokens mirror the app's `app/globals.css` (void background `#05060a`, neon cyan/lime/magenta/violet/gold accents, bull-green / bear-red). Language follows the RangeClarity guardrails — *clarity, structure, range, weak structure, strong zone, visual verdict* — and never uses buy/sell, profit, or prediction framing.

## How to regenerate the PDFs

The PDFs are rendered from HTML/CSS with [WeasyPrint](https://weasyprint.org/) (no browser required).

```bash
# from this folder: docs/roadmap/
pip install weasyprint            # one-time (Pango/Cairo system libs required)
python3 build_pdfs.py             # writes both .pdf and .html
```

That single command rebuilds `RangeClarity_Overall_Roadmap.pdf` and `RangeClarity_Next_Sprint_Taskbook.pdf`.

## Source layout

| File | Role |
|---|---|
| `build_pdfs.py` | Entry point — composes slides and renders both PDFs. |
| `deck.py` | Shared framework: slide shell, header/footer, page numbers, components (`kpi`, `chip`, `phase_badge`), `build_doc`. |
| `assets/roadmap.css` | The full design system (the look lives here — edit colours, spacing, components here). |
| `content_overall.py` | Overall Roadmap slide content (17 slides). |
| `svg_overall.py` | Overall visuals: timeline, Gantt, architecture diagram, dependency map, risk heatmap. |
| `cs_part1.py`, `cs_part2.py` | Sprint Taskbook slide content (14 slides, split for maintainability). |
| `content_sprint.py` | Aggregator that joins `cs_part1` + `cs_part2`. |
| `svg_sprint.py` | Sprint visuals: activation-flow diagram, conversion funnel, risk/effort matrix, daily calendar, kanban board. |

## Editing tips

- **Copy / wording:** edit the `*.md` files for text, or the matching `content_*.py` / `cs_part*.py` for the in-deck copy, then rerun `build_pdfs.py`.
- **Look & feel:** edit `assets/roadmap.css` (colours are CSS variables at the top).
- **A diagram:** edit the relevant function in `svg_overall.py` / `svg_sprint.py` (plain inline SVG).
- **Preview without a PDF viewer:** open the generated `*.html` in any browser.

## Notes

- Rendering uses the installed **Liberation Sans** (body) and **DejaVu Sans Mono** (labels). Both ship with most Linux font packages; swap in `assets/roadmap.css` if you prefer.
- These documents are **planning artifacts**. They are consistent with the approved decisions in `docs/decisions.md` (D-002 Whop-first, D-003 direct paid beta, D-006 Pine-first canonical core) and do not authorise live payments, deploys, or Linear writes.
