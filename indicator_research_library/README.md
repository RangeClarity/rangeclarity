# Indicator Research Library

A research and inspiration archive for the RangeClarity indicator system. This is where we study open-source TradingView / Pine Script work, distil the *concepts* worth keeping, and record exactly what we may and may not reuse.

## Ground rules (read before adding anything)

- **This folder is for research and inspiration — not a code dump.** The goal is to understand *how* good indicators solve problems, then build our own clean implementation.
- **Do not blindly copy code.** Copying implementation creates licensing risk, repaint bugs we don't understand, and a product we can't explain. Extract the *idea*, then re-implement it ourselves.
- **Respect licenses.** Every source must have an entry in `license_ledger.md` before any of its ideas inform production code.
- **Keep attribution.** Even for inspiration-only sources, record the author and URL. Credit is cheap and correct.
- **Only reuse code when the license clearly allows it.** MPL-2.0, MIT, Apache-2.0, CC-BY, public domain → reuse is generally allowed *with* attribution and license compliance. Anything else is inspiration only.
- **If the license is unclear, mark it "inspiration only."** No exceptions. Unclear = do not copy into production.
- **Prefer extracting concepts over copying implementation.** A one-paragraph plain-English description of the logic is more valuable to us than a pasted script.

## What NOT to do

- Do not scrape TradingView in bulk.
- Do not copy proprietary, closed-source, or protected/invite-only scripts.
- Do not paste code with an unknown or restrictive license into `RangeClarity_Core.pine` or any production file.
- Do not reproduce large verbatim chunks of someone else's script, even if the license technically allows it — re-implement in our own style and structure.

## Folder structure

```
indicator_research_library/
├── README.md                  ← you are here
├── license_ledger.md          ← source-by-source license + reuse decisions (the gate)
├── sources/                   ← downloaded / manually added open-source files for study
├── notes/                     ← one analysis note per indicator (use the template)
│   └── INDICATOR_REVIEW_TEMPLATE.md
└── patterns/                  ← distilled, reusable concepts grouped by module
    ├── regime_patterns.md
    ├── structure_patterns.md
    ├── support_resistance_patterns.md
    ├── momentum_patterns.md
    ├── confidence_patterns.md
    └── no_edge_patterns.md
```

## Workflow

1. Add the source file to `sources/` (or just record the link if you won't store the file).
2. Create an entry in `license_ledger.md` and decide: **reuse allowed** or **inspiration only**.
3. Write an analysis note in `notes/` using `INDICATOR_REVIEW_TEMPLATE.md`.
4. Distil the genuinely useful idea into the relevant `patterns/` file, with attribution.
5. Only then let it influence the production indicator.

## Relationship to `tradingview-research/`

This library supersedes and consolidates the earlier `tradingview-research/` folder, which remains in the repo as an archive. Substance from that folder (Pine v6 constraints, repainting rules, the MVP spec, the pattern library) has been carried forward here and into the root spec documents. When in doubt, this library and the root `RANGECLARITY_*` docs are the source of truth.
