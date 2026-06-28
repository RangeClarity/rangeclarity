# RangeClarity — Runway Input Assets (read me first)

Drop these PNGs into **Runway → Image-to-Video**, paste the matching prompt, set the duration/aspect below, and generate. Everything you need is in this file.

> **Asset type:** these are **faithful RECREATED UI assets** (exact module content, values, and brand colors), **not literal live screenshots.** They are fully acceptable for the first Runway tests. Later, once the dev server runs reliably, you can swap in brand-perfect screenshots from the live routes (see `../RUNWAY_ASSET_CHECKLIST.md`). Each PNG has an editable `.svg` source beside it.

**Global rule:** the screenshot is the source of truth. The prompt only adds **motion** — keep it subtle so UI text and numbers stay crisp. Generate 5s first, extend the winners. Positive phrasing only (no "no/avoid/not" inside the Runway box).

---

## 1. Asset map

### A2_dashboard.png  ·  Dashboard reveal  ·  ⭐ run first
- **Purpose:** the hero product moment — the decision map reads as effortless intelligence.
- **Mode:** Image-to-Video  ·  **Duration:** 10s  ·  **Aspect:** 16:9
- **Prompt:**
  `Slow confident push-in with subtle depth parallax. The circular score gauge fills clockwise; panels settle gently. Numbers and text remain stable and crisp. Calm, premium, institutional.`
- **Alternative:**
  `Locked camera, gentle depth parallax; the gauge ring sweeps to its value, then a soft focus settles on the verdict line. Minimal motion, institutional.`
- **Motion strength:** LOW (≈ 2–4 / 10).
- **Must stay readable:** `78`, `1 : 2.4`, `WAIT FOR PULLBACK`, the module labels.
- **Check after gen:** numbers/verdict unchanged and sharp; gauge fill looks natural; no panel sliding off; no invented UI.

### A3_rangescore.png  ·  Range Score / verdict  ·  run second
- **Purpose:** emotional climax — calm conviction, "know when there's an edge."
- **Mode:** Image-to-Video  ·  **Duration:** 5s  ·  **Aspect:** 16:9 (also export a 1:1 for social)
- **Prompt:**
  `Slow push-in toward the verdict; the score gauge completes its sweep and the surrounding UI gently softens, holding focus on the verdict. Text stays perfectly stable. Quiet, decisive.`
- **Alternative:**
  `Locked macro shot; the accent ring settles, shallow focus rests on the verdict text. Calm and premium.`
- **Motion strength:** LOW (≈ 2–3 / 10).
- **Must stay readable:** `78`, `RANGE SCORE`, `WAIT FOR PULLBACK`.
- **Check after gen:** verdict letters unchanged; focus lands on the decision; no flicker or glow spam.

### A1_hero.png  ·  Hero landing reveal  ·  run third
- **Purpose:** premium first impression of brand + product.
- **Mode:** Image-to-Video  ·  **Duration:** 5s  ·  **Aspect:** 16:9
- **Prompt:**
  `Slow cinematic push-in with gentle parallax between layers, faint chart-grid drifting behind, calm and premium. Text stays still and sharp.`
- **Alternative:**
  `Locked camera with a very slow zoom-in; subtle floating motion on the character and a soft ambient light shift. Minimal, institutional.`
- **Motion strength:** LOW–MEDIUM (≈ 3–4 / 10).
- **Must stay readable:** the headline, the CTA buttons, the chips.
- **Check after gen:** headline/buttons don't warp; mascot face stays intact; zoom is gentle.

### A4_toolkit.png  ·  Toolkit reveal
- **Purpose:** show the system has depth (three modules, one clear call).
- **Mode:** Image-to-Video  ·  **Duration:** 5s  ·  **Aspect:** 16:9
- **Prompt:**
  `Smooth slow lateral dolly across the three cards, each easing into focus with shallow depth of field. Card text stays still and readable. Deliberate, premium.`
- **Alternative:**
  `Slow push-in toward the center card while the outer cards drift gently in parallax. Soft focus, institutional.`
- **Motion strength:** LOW (≈ 3 / 10).
- **Must stay readable:** the three card titles and the stat values.
- **Check after gen:** card text doesn't smear during the pan; dolly is even; no card stretching.

### A6_cta.png  ·  Final CTA (card)
- **Purpose:** calm, confident close with the join action.
- **Mode:** Image-to-Video  ·  **Duration:** 5s  ·  **Aspect:** 16:9
- **Prompt:**
  `Very slow push-in to the centered card; a soft highlight passes once across the headline, everything settles calm and centered. Text stays still and sharp.`
- **Alternative:**
  `Locked camera, gentle ambient light drift on the card; minimal motion, premium and restrained.`
- **Motion strength:** LOW (≈ 2–3 / 10).
- **Must stay readable:** the headline, the email field, the button text.
- **Check after gen:** button/headline text unchanged; no warping of the input field.

### A7_logo.png  ·  Final CTA (logo)
- **Purpose:** brand lock / outro.
- **Mode:** Image-to-Video  ·  **Duration:** 5s  ·  **Aspect:** 16:9
- **Prompt:**
  `A thin mint-teal line glides in and settles as the underline beneath the wordmark; everything holds calm and centered. The logo stays perfectly still and sharp.`
- **Alternative:**
  `Very slow push-in to the centered logo on deep black; a single accent line settles. Minimal, cinematic.`
- **Motion strength:** VERY LOW (≈ 1–2 / 10).
- **Must stay readable:** the `RangeClarity` wordmark.
- **Check after gen:** wordmark letters never change; only the line animates.

### Scenes with NO asset (generate from text)
- **Opening market noise** — Text-to-Video, 5s, 16:9: `Slow camera drift through a dark cloud of floating financial tickers and chart fragments, heavy depth of field. A single thin mint-teal line slowly cuts through the center. Calm, cinematic, tense but elegant.`
- **Investor desk** — Text-to-Video, 10s, 16:9: `Slow lateral dolly past a calm modern desk at dawn, soft window light, a large monitor glowing with a clean dark interface, dust in the air. Hands rest out of focus. Quiet, premium, restrained motion.`

---

## 2. Recommended first-run order

1. **A2 — Dashboard reveal** (run this first). It is the **strictest text-stability test** (lots of small numbers + the verdict) and it **sets the overall premium UI grade** for everything after. If you can keep A2 crisp, the rest will follow.
2. **A3 — Range Score** (same asset family — reuses the look you just locked).
3. **A1 — Hero landing** (establishes brand/product up top).

Then: A4 toolkit → A6 CTA → A7 logo → (text-only) opening noise → investor desk.

---

## 3. Settings guidance (practical)

- Use **subtle motion**; avoid aggressive camera moves.
- Prefer **slow push-in**, **slight parallax**, or a **soft highlight** — one motion per shot.
- **Preserve UI readability** above all else. If a shot adds energy but warps text, the slower version wins.
- Keep **motion strength LOW** (Runway "general motion"/camera sliders toward the low end).
- Generate **5s first**; only extend the takes that pass QC.
- If text distorts: lower the motion, switch to the "locked/alternative" prompt, or re-crop tighter — don't just re-roll.

---

## 4. QC checklist (reject / accept)

**Reject the take if:**
- [ ] UI text becomes unreadable or warped.
- [ ] Numbers change value (e.g. `78` morphs).
- [ ] The dashboard/UI looks fake or invented.
- [ ] Motion feels "too AI-generated" (rubbery, melting, jittery).
- [ ] The brand feels generic (blue-gradient stock fintech).
- [ ] It drifts into crypto / trading-guru style (neon, glow spam, hype).

**Accept the take if:**
- [ ] UI stays crisp and unchanged.
- [ ] Motion is subtle and eased.
- [ ] It feels premium, calm, institutional fintech.
- [ ] The product is still clearly recognizable as RangeClarity.

---

## 5. Local cleanup (scratch files — do not commit)

This folder contains harmless generator/scratch files that should **not** be committed:

- `_gen.cjs`, `_gen2.cjs`, `_gen3.cjs`, `_gen4.cjs` — SVG generator scripts
- `_t.svg`, `_t.png` — a render test

They were left here only because this environment can create but not delete files. Remove them on your machine.

**Windows PowerShell — run from this folder:**
```powershell
cd "$env:USERPROFILE\Claude\Projects\RangeClarity\docs\video-production\runway-inputs"
Remove-Item _gen*.cjs, _t.svg, _t.png -Force
```

Keep: every `A*.png` (Runway inputs), every `A*.svg` (editable sources), and this `README.md`.

> Optional: if you don't want the `.svg` sources committed either, add `docs/video-production/runway-inputs/*.svg` to `.gitignore`. The PNGs are what Runway needs.

---

## 6. Notes
- These assets are **faithful recreated UI**, not literal live screenshots — fine for first tests; replace with real screenshots later for pixel-perfect brand type.
- No website code was changed to produce these. Nothing here was committed or pushed.
