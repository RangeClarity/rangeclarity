# Founder Decision Queue

Decisions waiting on Dean. The Command Center reads this file. Tick a box when resolved and log the
outcome in `docs/decisions.md`.

- [ ] **Canonical repo** — confirm `C:\Users\USER\Claude\Projects\RangeClarity` is the ONLY working checkout.
- [ ] **OneDrive checkout** — do NOT push from `C:\Users\USER\OneDrive\Documents\RangeClarity`; decide whether to port or abandon its commits.
- [ ] **Linear** — keep the Linear API / board hidden or disabled until auth / gating exists (no public issue data).
- [ ] **Lemon checkout** — confirm live checkout links are set (env / Vercel) in the canonical repo; never commit secrets.
- [ ] **Next build focus** — confirm Indicator Core V2 before new marketing features.
- [ ] **RC-1 broken-zone review (P0, new 2026-06-25)** — open `clean_but_capped` in `research/reports/visual_review/index.html`, label 20–40 cases via `research/reports/visual_review/founder_labels_template.csv` (`true_broken` / `stale_zone_false_cap` / `normal_pullback_false_cap` / `genuinely_unclear` / `unsure`). This is the go/no-go on **RC-11 / O-008** and the broken-zone A/B (`docs/research/rc1-ab-test-broken-zone-v0.md`). No scoring/Pine change until then; BLOCK Pine; conviction RED.

_Add new decisions as one-line checkboxes. Keep resolved ones for one cycle, then archive to `docs/decisions.md`._
