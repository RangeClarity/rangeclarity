# RangeClarity — Runway Asset Export Checklist

Everything you must export **before** running the Runway prompt pack. All assets are real RangeClarity UI — no fabricated dashboards. Capture from the running dev site (`npm run dev`) at the routes below, export at **2× / Retina** for crisp Image-to-Video inputs.

> Capture tips: hide the browser chrome (use device toolbar / full-page screenshot), set zoom to 100%, use a dark OS theme, and export PNG. For Image-to-Video, Runway likes the input image already in the **target aspect ratio** — crop to 16:9 (or 9:16 for verticals) before uploading.

| # | Asset | Capture from (route / element) | Export spec | Used by scene |
|---|---|---|---|---|
| A1 | **Landing hero (mascot)** | `/` (homepage hero, RangeBot + headline + CTAs) | 2×, 16:9 crop of hero | Hero landing page reveal |
| A2 | **Premium decision-map dashboard** | `/designs/premium-fintech` hero right panel, or `/range-command-premium` hero (Range Score 78, S/R bar, Momentum, Risk/Reward, "WAIT FOR PULLBACK") | 2×, tight 16:9 + a 1:1 crop | Dashboard reveal |
| A3 | **Range Score gauge + verdict (close-up)** | Same dashboard — crop just the circular `78` gauge + the verdict line | 2×, 1:1 and 16:9 | Range Score / decision clarity |
| A4 | **Toolkit — 3 module cards** | `/designs/range-command-v2` `#modules` ("Three modules. One clear call.") or `/range-command-premium` `#modules` | 2×, 16:9 (all three cards in frame) | Toolkit section reveal |
| A5 | **Sample chart read (ASTS)** | `/designs/range-command-v2` `#chart` (MockTradingViewChartV2) | 2×, 16:9 | (optional B-roll; dashboard alt) |
| A6 | **Final CTA card** | `/designs/range-command-v2` `#join` ("Stop chasing candles. Start reading the range.") | 2×, 16:9 | Final CTA |
| A7 | **Logo / wordmark** | Nav wordmark "RangeClarity" + `app/icon.svg` (monogram). Export wordmark on transparent + on dark | 2×, transparent PNG + SVG | Final CTA |
| A8 | **Mascot (RangeBot) standalone** | `/` hero mascot, or existing `public/assets/rangeclarity-hero.png` | PNG, transparent if possible | Social cuts only (not institutional flagship) |
| A9 | **Footer lockup** | `/designs/range-command-v2` footer | 2×, 16:9 | Final CTA alt / outro |

### No-asset scenes (Text-to-Video — nothing to export)
- **Opening market noise** — generated from text (abstract). No input image.
- **Investor desk / research workflow** — generated from text (or optionally I2V from a licensed desk photo you provide; not in the repo).

### Pre-flight checklist
1. [ ] `npm run dev` running; dark theme; 100% zoom.
2. [ ] Export A1–A9 at 2×, PNG, cropped to 16:9 (plus 1:1 for A2/A3).
3. [ ] Make a 9:16 crop of A1, A2, A4 if you want native verticals (else outpaint later).
4. [ ] Put all exports in one folder named `runway-inputs/` and label them `A1_hero.png`, `A2_dashboard.png`, etc.
5. [ ] Confirm no placeholder text/lorem and the verdict reads correctly ("WAIT FOR PULLBACK").
6. [ ] Optional: export a layered version of A2 (background grid / panels / accent line separate) for stronger parallax.
