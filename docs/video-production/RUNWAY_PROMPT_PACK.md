# RangeClarity — Runway Prompt Pack

Production-ready prompts for **Runway Gen-3/Gen-4** to build the premium RangeClarity marketing video using **real project UI** (see `RUNWAY_ASSET_CHECKLIST.md`). Pairs with `docs/RANGECLARITY_AI_VIDEO_BLUEPRINT.md`.

### How to use this pack
- **Image-to-Video (I2V) is the default** for any shot showing product UI — upload the real screenshot and let the prompt describe **only motion, camera, timing, and atmosphere**. Do **not** re-describe the UI; the image already contains it. Don't ask Runway to invent dashboards or text.
- **Text-to-Video (T2V)** only for abstract shots with no real asset (opening noise, investor desk).
- Keep prompts **short and motion-led**. Runway responds best to: *camera move + what changes + mood.* One clear motion per shot.
- **Brand tag (optional, append sparingly):** `premium fintech, dark navy, subtle mint-teal accent, calm, cinematic, slow deliberate motion`.
- **Duration:** use **5s** for single-motion shots, **10s** only when the motion needs room (dashboard assembly). Generate 5s first; extend the winners.
- **Aspect:** master at **16:9**. Make 9:16/1:1 by re-cropping the input image or outpainting later — don't re-prompt blindly.

---

## Scene 1 — Opening market noise
- **Goal:** establish overwhelming market noise that one clean line cuts through.
- **Mode:** Text-to-Video
- **Input:** none
- **Duration:** 5s · **Aspect:** 16:9
- **Prompt:**
  > Slow camera drift through a dark cloud of floating financial tickers, faint red and green flickers, blurred headlines and chart fragments, heavy depth of field and motion blur. A single thin mint-teal line slowly cuts through the center. Calm, cinematic, tense but elegant.
- **Alternative:**
  > Abstract dark data-storm rotating slowly in deep space, tiny price numbers and broken candlesticks swirling, one clean glowing line emerging from the chaos. Subtle handheld drift, shallow focus, premium and restrained.
- **Check after gen:** noise reads as "information overload," not garish; the clean line is visible; no readable fake logos/text.
- **Failure signs:** neon/crypto look, cartoonish candles, warped text that draws the eye, frantic camera.
- **Iterate:** if too busy, add "fewer elements, more negative space, slower"; if flat, add "more depth layers, volumetric haze."

---

## Scene 2 — Hero landing page reveal
- **Goal:** premium first impression of the real product/brand.
- **Mode:** Image-to-Video
- **Input:** **A1 — landing hero (mascot)**
- **Duration:** 5s · **Aspect:** 16:9
- **Prompt:**
  > Slow cinematic push-in with gentle parallax between foreground and background layers. The scene breathes subtly; faint chart-grid drifts behind. Calm, premium, confident.
- **Alternative:**
  > Locked camera with a very slow zoom-in; subtle floating motion on the character and soft ambient light shift. Minimal, institutional, cinematic.
- **Check after gen:** UI/text stays sharp and undistorted; motion is subtle (not warping the logo or headline).
- **Failure signs:** wobbling text, melting UI edges, mascot face distortion, over-fast zoom.
- **Iterate:** if text warps, reduce motion ("very subtle, slow") or use the locked alternative; if static, add "gentle parallax."

---

## Scene 3 — Dashboard reveal *(the hero moment)*
- **Goal:** the payoff — the decision map reads as effortless intelligence.
- **Mode:** Image-to-Video
- **Input:** **A2 — premium decision-map dashboard**
- **Duration:** 10s · **Aspect:** 16:9
- **Prompt:**
  > Slow confident push-in with subtle 3D parallax between the dashboard panels. The circular score gauge animates filling clockwise; UI elements settle gently into place. Crisp, calm, premium product film.
- **Alternative:**
  > Locked camera, gentle depth parallax; the gauge ring sweeps to its value, then a soft focus settles on the verdict line. Minimal motion, institutional, cinematic.
- **Check after gen:** numbers (78, 1:2.4) and the verdict text remain legible and unchanged; the gauge fill looks natural.
- **Failure signs:** numbers morphing/scrambling, panels sliding too far, flicker, invented UI.
- **Iterate:** if values distort, lower motion and add "keep text stable, only the gauge animates"; if lifeless, add "subtle parallax and a slow push-in."

---

## Scene 4 — Toolkit section reveal
- **Goal:** show the system has depth (three modules, one clear call).
- **Mode:** Image-to-Video
- **Input:** **A4 — toolkit (3 module cards)**
- **Duration:** 5s · **Aspect:** 16:9
- **Prompt:**
  > Smooth lateral dolly gliding left to right across the three cards, each pulling into focus in turn with shallow depth of field. Calm, premium, deliberate.
- **Alternative:**
  > Slow push-in toward the center card while the outer cards drift gently in parallax. Soft focus, institutional, cinematic.
- **Check after gen:** card labels stay readable; the dolly feels even; no card warps.
- **Failure signs:** cards stretching, text smearing during the pan, jittery move.
- **Iterate:** if smearing, slow the dolly ("slower, smoother"); if flat, add "shallow depth of field, rack focus between cards."

---

## Scene 5 — Range Score / decision clarity moment
- **Goal:** the emotional climax — calm conviction, "know when there's an edge."
- **Mode:** Image-to-Video
- **Input:** **A3 — Range Score gauge + verdict (close-up)**
- **Duration:** 5s · **Aspect:** 16:9 (also export a 1:1 for social)
- **Prompt:**
  > Extreme slow push-in toward the verdict line; the score gauge ring completes its sweep and the surrounding UI gently defocuses, holding on the verdict. Quiet, decisive, cinematic.
- **Alternative:**
  > Locked macro shot; the accent line softly pulses once, the gauge settles, shallow focus rests on the verdict text. Calm and premium.
- **Check after gen:** the verdict text is crisp and unchanged; focus lands on the decision; no flicker.
- **Failure signs:** verdict text changing letters, harsh glow, distracting background motion.
- **Iterate:** add "keep all text stable, motion only in focus and the gauge"; soften any glow with "subtle, restrained."

---

## Scene 6 — Investor desk / research workflow
- **Goal:** the human moment — a calm professional thinking clearly.
- **Mode:** Text-to-Video *(or I2V if you supply a licensed desk photo)*
- **Input:** none (optional: a desk still you own)
- **Duration:** 10s · **Aspect:** 16:9
- **Prompt:**
  > Slow lateral dolly past a calm modern desk at dawn, hands resting on a keyboard, a large monitor glowing with a clean dark interface, soft window light and dust in the air. Quiet, premium, institutional. Subtle, restrained motion.
- **Alternative:**
  > Over-the-shoulder slow push toward a glowing dark dashboard on a monitor in a quiet office, warm-cool light, shallow depth of field, reflective calm.
- **Check after gen:** hands/face look natural (or keep them out of frame); the on-screen UI is abstract/clean, not gibberish; mood is calm.
- **Failure signs:** uncanny hands/faces, scrambled fake UI on the monitor, busy/cluttered desk.
- **Iterate:** if hands look wrong, prompt "hands out of frame, focus on the screen and light"; reduce people to silhouette/back-of-head.

---

## Scene 7 — Final CTA
- **Goal:** brand lock + clear, calm close.
- **Mode:** Image-to-Video
- **Input:** **A6 — final CTA card** (or **A7 — logo/wordmark** on dark)
- **Duration:** 5s · **Aspect:** 16:9
- **Prompt:**
  > A thin mint-teal line draws itself along the bottom and resolves into an underline beneath the wordmark; everything settles to a calm, centered hold. Premium, restrained, generous negative space.
- **Alternative:**
  > Very slow push-in to the centered logo on deep black; a single accent line glides in and settles. Minimal, cinematic, institutional.
- **Check after gen:** wordmark stays perfectly legible and undistorted; the line motion is smooth; ends on a clean hold.
- **Failure signs:** logo warping/letters changing, line jitter, over-busy background.
- **Iterate:** if the logo distorts, use A7 on plain dark and prompt "logo stays perfectly still, only the line animates."

---

## Recommended production order
1. **Scene 3 — Dashboard reveal (run this first).** It's the hero shot and the hardest (text stability). Nail it before anything else; it sets the look/grade for the rest.
2. **Scene 5 — Range Score clarity** (same asset family; reuses the look you locked in #1).
3. **Scene 4 — Toolkit reveal.**
4. **Scene 2 — Hero landing reveal.**
5. **Scene 7 — Final CTA.**
6. **Scene 1 — Opening market noise** (T2V; iterate freely, low risk).
7. **Scene 6 — Investor desk** (T2V; most variable — generate several, pick the calmest).

Then assemble in the blueprint's scene order (1 → 2 → 6 → 3 → 4 → 5 → 7), add the T2A music + foley + VO from the blueprint's audio system, picture-lock at 16:9, and outpaint/crop to 9:16 + 1:1 for social.

### Global do / don't (Runway)
- **Do:** one motion per shot, slow and eased; upload real UI; keep prompts short; generate 5s first; extend winners.
- **Don't:** describe UI that's already in the image; ask for fake dashboards/charts; stack multiple camera moves; use hype/crypto language; rely on Runway to render readable brand text (always start from a real screenshot).
