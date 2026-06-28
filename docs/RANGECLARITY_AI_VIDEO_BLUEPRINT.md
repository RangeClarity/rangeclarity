# RangeClarity — AI Video Production Blueprint

*A world-class promotional campaign, executable by a small team using modern generative video/audio models (T2V, I2V, V2V, extension, in/outpainting, T2A, foley, A2V, AV2AV, IC-LoRA control adapters).*

Brief: launch RangeClarity — a premium chart-context intelligence platform that helps serious investors **think clearly, cut noise, build conviction, and make better long-term decisions.** Not signals. Not hype. The campaign must feel **Apple × Bloomberg × Stripe × Linear** — calm, intelligent, institutional, data-driven, trustworthy.

---

## 0. Brand & motion system (the guardrails every shot obeys)

These constraints are what make AI output read as premium rather than generic. Lock them before generating anything.

- **Palette:** near-black navy base `#05060A`/`#060A12`; surface `#0C1322`; primary accent mint-teal `#34F5B0` / `#2FFFD6`; secondary cyan `#38E1FF`; signal gold `#FFCF5C`; restraint — accent never exceeds ~10% of frame.
- **Type:** geometric grotesk for headlines (heavy, tight tracking); **monospace for all data/labels** (the "terminal truth" signal). White `#F2F6FF` text; dim `#9AA6C4` for secondary.
- **Light:** soft, directional, low-key. Volumetric haze only in establishing shots. No lens flares, no neon glow spam. One key light, gentle rim.
- **Motion:** slow, deliberate, weighted. Dolly/parallax over cuts. Ease-in-out, never linear. 24fps cinematic; UI animates at a calmer cadence than reality (confidence reads as control).
- **Grid motif:** the faint chart grid is the connective tissue across every scene (echoes the product). Use it as transition material.
- **Hard nos:** crypto-bro gold chains, Lambos, rocket emojis, fake "AI hologram" UI, candlestick confetti, hype VO, stock-music EDM drops, cluttered dashboards, more than 6 colors on screen.

Reusable **style suffix** (append to every visual prompt) and **negative prompt** are in the Appendix.

---

## Deliverable 1 — Three creative concepts

### Concept A — "Signal in the Noise" *(recommended flagship)*
- **Story:** We open inside overwhelming market noise — a storm of tickers, headlines, alerts, fragmentary charts. One calm element (a clean RangeClarity line/zone) cuts through; the chaos resolves into a single, legible decision view. The arc is *noise → clarity → conviction*.
- **Emotional hook:** relief. The physical exhale of a smart person who finally has a quiet place to think.
- **Target audience:** self-directed long-term investors, RIAs, family-office analysts, sophisticated retail who already use TradingView and are tired of guru noise.
- **Visual language:** macro-cinematic abstraction (particles, depth-of-field data fields) resolving into crisp product UI. Dark, spacious, institutional.
- **Voiceover:** sparse, lower-register, unhurried — a single trusted analyst, not a hype man. ~12–18 words per 10s.
- **Music:** ambient-minimal; a low drone + sparse piano/Rhodes notes; one swell at the clarity turn. Think Stripe Sessions / Apple keynote bed.
- **Duration:** 60s flagship (45s and 90s variants).

### Concept B — "The Quiet Desk"
- **Story:** A single investor at a calm desk at dawn. No frenzy. They open RangeClarity; the screen does the heavy thinking; they nod, close the laptop, and walk away — decision made, day reclaimed. *Discipline as a lifestyle.*
- **Emotional hook:** aspiration + calm authority. "This is how serious people operate."
- **Target audience:** time-constrained professionals and investors who value process over screen-time.
- **Visual language:** restrained live-action feel (achieved via I2V from photoreal stills), warm-cool contrast, real hands/real light, product as the hero on screen.
- **Voiceover:** first-person-adjacent, reflective; or no VO — just ambient + on-screen text.
- **Music:** warm minimal piano, intimate room tone.
- **Duration:** 45–60s. Best for LinkedIn / brand trust.

### Concept C — "Read the Range"
- **Story:** A visual thesis on the core idea: every move has a range, a structure, a moment. We literally *teach the eye* to see regime, support/resistance, momentum, and the "no-edge / wait" state — culminating in the dashboard that makes it effortless. *Education as marketing.*
- **Emotional hook:** competence/mastery — "I understand the market better after 60 seconds."
- **Target audience:** the analytically curious; high-intent prospects who convert on substance.
- **Visual language:** elegant data-viz explainer; annotated charts, zone overlays, clean motion graphics over real dashboard footage.
- **Voiceover:** instructive, confident, plain-spoken (the "smart friend who's a PM").
- **Music:** rhythmic minimal pulse synced to data reveals (A2V-driven).
- **Duration:** 75–90s. Best for YouTube / product page.

> **Pick:** lead with **Concept A** as the flagship (broadest emotional pull + clearest before/after), harvest **C** as the YouTube long-form explainer, and **B** as the LinkedIn brand cut. All three share footage (see Deliverable 6).

---

## Deliverable 2 — The flagship launch video (60s, "Signal in the Noise")

Seven scenes. Total ≈ 60s (timings scale to 45s/90s). Each scene below: **objective · camera · visual · transition · audio · VO · on-screen text.**

### Scene 1 — Opening cinematic (0:00–0:08)
- **Objective:** establish calm authority and intrigue; brand world before brand name.
- **Camera:** slow push-in (dolly), shallow DOF, micro-parallax.
- **Visual:** a vast dark space; faint chart-grid floor receding to horizon; a single thin mint line of price action drifts in volumetric haze. Dust/data motes drift.
- **Transition:** match-cut on the line → it becomes the edge of the chaos in Scene 2.
- **Audio:** low drone fades up; distant room tone; a single soft piano note.
- **VO:** *"Markets don't reward noise. They reward clarity."*
- **On-screen text:** (none yet) — or a faint mono timestamp `09:31:00 ET`.

### Scene 2 — Market chaos (0:08–0:18)
- **Objective:** make the audience *feel* information overload.
- **Camera:** handheld-subtle, faster drift, rack focus between fragments.
- **Visual:** a swirling sphere/wall of tickers, red/green flickers, headlines, alert toasts, broken candlesticks — overwhelming but tasteful (motion-blurred, depth-layered, never garish).
- **Transition:** a hard but soft-edged whip/■blur as one clean line slices through the noise.
- **Audio:** layered chatter, alert pings, rising tension riser; sudden partial duck.
- **VO:** *"Every day, more data. More opinions. More ways to be wrong."*
- **On-screen text:** fragments only ("BUY?", "TOP IN?", "−4.2%") fading fast.

### Scene 3 — Investor research / the turn (0:18–0:28)
- **Objective:** introduce the human + the moment of seeking clarity.
- **Camera:** slow lateral dolly past a calm desk; rim-lit; reflection of clean UI in the screen/glasses.
- **Visual:** an analyst (or just hands + screen) at a quiet desk at dawn; the chaos compresses into the monitor and resolves into a clean chart.
- **Transition:** screen-as-portal push-in into the UI (Scene 4).
- **Audio:** chaos collapses to a single tone; first warm chord; soft keyboard foley.
- **VO:** *"RangeClarity was built for the part that actually matters — thinking."*
- **On-screen text:** (none).

### Scene 4 — Dashboard reveal (0:28–0:40) — *the hero moment*
- **Objective:** the product payoff; legibility as a feeling.
- **Camera:** locked, then a slow confident push; subtle 3D parallax on UI layers.
- **Visual:** the RangeClarity decision map assembles element by element — **Range Score 78**, support/resistance zone bar, **Momentum: Strong · Extended**, **Risk/Reward 1:2.4**, verdict **"WAIT FOR PULLBACK."** Clean, dark, mono labels, one mint accent.
- **Transition:** elements snap in on the music's downbeat; grid lines draw on.
- **Audio:** music opens up (the swell); crisp UI foley (soft ticks, a single confident chime on the verdict).
- **VO:** *"Regime. Structure. Support. Momentum. Confidence — in one honest view."*
- **On-screen text:** module labels animate in mono; `RANGE SCORE · 78`.

### Scene 5 — Toolkit reveal (0:40–0:48)
- **Objective:** show depth/credibility (the system, not a gimmick).
- **Camera:** orchestrated dolly across three floating module panels (Range · Momentum · Risk), each in focus in turn.
- **Visual:** the three modules as elegant cards/panels in a dark command-center space; a sample read on a real ticker.
- **Transition:** cards align into a single row → collapse into the decision line.
- **Audio:** rhythmic data ticks (A2V-synced); music steady, purposeful.
- **VO:** *"Three modules. One clear call. No black-box signals — just structure you can read."*
- **On-screen text:** `SUPPORT / RESISTANCE · MOMENTUM LIFECYCLE · RISK / REWARD`.

### Scene 6 — Decision-making (0:48–0:55)
- **Objective:** the emotional climax — calm conviction; "and sometimes, do nothing."
- **Camera:** slow push to the verdict; everything else gently defocuses.
- **Visual:** the verdict line holds: **WAIT FOR PULLBACK** → then a second beat shows **STRONG CONTEXT** on another setup. The "no-edge / wait" state is shown as a *feature*.
- **Transition:** gentle fade of surrounding UI; accent line breathes.
- **Audio:** music thins to a single sustained note; one exhale of room tone.
- **VO:** *"Clarity isn't knowing everything. It's knowing when there's an edge — and when to wait."*
- **On-screen text:** `KNOW WHEN THERE'S AN EDGE.`

### Scene 7 — Final CTA (0:55–0:60)
- **Objective:** brand lock + clear next step + trust line.
- **Camera:** settle to a centered, locked logo composition.
- **Visual:** RangeClarity wordmark + the thin mint line resolving under it on the chart-grid; deep black space.
- **Transition:** the price line draws the underline of the logo.
- **Audio:** final warm resolve; tail room tone; no hype sting.
- **VO:** *"RangeClarity. See the range before you move."*
- **On-screen text:** `rangeclarity.com · Join early access` and small disclaimer `Educational chart context. Not financial advice.`

---

## Deliverable 3 — Optimal AI generation pipeline (per scene)

Principle: **I2V for anything that must stay brand-true (real UI, logo, landing page). T2V for abstract worlds that don't exist yet. V2V (IC-LoRA) to cinematically grade real screen recordings. Foley/V2A for sound on every generated (silent) shot. Outpainting to reframe for vertical formats.**

| Scene | Primary method | Why |
|---|---|---|
| 1 Opening | **T2V** + forward **extension** | No real footage of an abstract "data void" exists; T2V invents it. Extend to nail the 8s hold without re-rolling. |
| 2 Chaos | **T2V** driven by **A2V** | Generate the noise-storm from text, then use **audio-to-video** so the swirl pulses to the tension riser — motion married to sound feels intentional, not stocky. |
| 3 The turn | **I2V** from a photoreal still (desk/analyst) + **V2V** to grade | I2V keeps a believable human/desk; V2V (IC-LoRA control adapter) locks the exact brand color/lighting so it matches the UI scenes. |
| 4 Dashboard | **I2V** from real dashboard exports + **video inpainting** | Animate the actual UI screenshots (brand fidelity is non-negotiable). Inpaint to swap ticker/values or replace placeholder cells with final data without re-rendering the whole shot. |
| 5 Toolkit | **I2V** (module cards) + **V2V** for camera move | Animate real module panels; V2V adds the consistent dolly/parallax grade across the three cards. |
| 6 Decision | **I2V** + **inpainting** | Hold real UI; inpaint the verdict text transition (`WAIT FOR PULLBACK` → `STRONG CONTEXT`) cleanly in-frame. |
| 7 CTA | **I2V** from the logo lockup + backward **extension** | Animate the real wordmark; **backward extension** generates a graceful lead-in so the line "draws" into the logo. |

Cross-cutting:
- **Outpainting** every hero shot from 16:9 → 9:16 and 1:1 for the content engine (Deliverable 6) instead of re-generating.
- **AV2AV (IC-LoRA)** to produce localized masters (e.g., EN→ES VO) while keeping motion + foley aligned with the new audio.
- **A2A** to restyle a scratch VO into the final warm timbre, and to adapt the music stem to each platform's energy (calmer for LinkedIn, punchier for TikTok) without re-scoring.

---

## Deliverable 4 — Production-ready generation prompts

Append the **Style Suffix** (Appendix) to each. Use the **Negative Prompt** on every generation. Realism level noted per shot.

**1) Opening cinematic sequence (T2V)**
> Cinematic wide shot of an infinite dark navy void, a faint luminous chart-grid floor receding to a low horizon, volumetric haze, fine drifting data particles catching soft light. A single thin mint-teal line of price action drifts slowly through the center. Slow dolly push-in, shallow depth of field, anamorphic 40mm lens, low-key directional key light with gentle teal rim, deep blacks, filmic contrast, 24fps, photoreal abstract, ultra-detailed, calm and intelligent mood. Realism: photoreal-abstract.

**2) Market chaos sequence (T2V, A2V-driven)**
> A towering, slowly rotating sphere of financial information — hundreds of small tickers, faint red and green flickers, blurred headlines, alert toasts, fragmented candlestick charts — suspended in dark space, layered with depth and heavy motion blur, tasteful not garish. Subtle handheld drift, rack focus between fragments, 35mm lens, cool desaturated palette with restrained red/green accents, volumetric dust, tense but elegant. One clean mint line begins to slice through. 24fps, cinematic, high detail. Realism: stylized-photoreal.

**3) Investor research sequence (I2V from photoreal still + V2V grade)**
> A calm modern desk at dawn, a single analyst seen from behind / hands on a keyboard, a large monitor glowing with a clean dark trading interface, soft window light, dust in the air, warm-cool contrast, reflection of the UI in their glasses. Slow lateral dolly, 50mm lens, shallow DOF, rim-lit, premium and quiet, institutional. Subtle, restrained motion. 24fps, photoreal. Realism: photoreal.

**4) RangeClarity dashboard reveal (I2V from real UI export)**
> The RangeClarity decision-map dashboard assembling element by element on a deep navy background: a circular Range Score gauge reading 78, a support/resistance zone bar with a marker at 78%, monospace labels, a Momentum card reading "Strong · Extended" in cyan, a Risk/Reward card "1 : 2.4", and a verdict line "WAIT FOR PULLBACK". Locked camera with a slow confident push and subtle 3D parallax between UI layers, crisp edges, one mint accent, soft drop shadows, premium product-film lighting. 24fps, ultra-clean, hyalographic UI clarity. Realism: photoreal UI (animate the real screenshot — do not invent UI).

**5) Toolkit section reveal (I2V module panels)**
> Three elegant dark UI module panels — "Range / Support-Resistance", "Momentum lifecycle", "Risk / Reward" — floating in a dark command-center space, each with clean monospace data and a single mint or cyan accent, soft volumetric glow behind. Orchestrated dolly gliding left-to-right, each panel pulling into focus in turn, 35mm, shallow DOF, institutional and sophisticated. 24fps, premium. Realism: photoreal UI.

**6) Decision-making sequence (I2V + inpaint)**
> Extreme focus on a single dark UI verdict line that reads "WAIT FOR PULLBACK", surrounding dashboard gently defocusing, a thin mint accent line softly breathing, then the verdict cleanly transitions to "STRONG CONTEXT" on a second setup. Slow push-in, 85mm, very shallow DOF, calm, decisive, cinematic. 24fps. Realism: photoreal UI (inpaint the text change in-frame).

**7) Final CTA scene (I2V logo + backward extension)**
> The RangeClarity wordmark centered in deep black space on a faint chart-grid; a single thin mint-teal price line draws itself along the bottom and resolves into the underline of the logo. Locked, perfectly centered composition, soft key light, subtle vignette, premium and restrained, generous negative space. 24fps, photoreal-graphic. Realism: photoreal-graphic. (Generate a backward extension so the line "arrives" into the logo.)

---

## Deliverable 5 — Complete audio system

The audio is 50% of the premium feel. Generated visuals are silent — **every shot needs deliberate sound.**

- **Music strategy (T2A):** one through-composed bed in three movements — *(1) tension/void* (low drone + sparse piano, Scenes 1–2), *(2) clarity swell* (warm pad + Rhodes, arrives on the dashboard reveal, Scene 4), *(3) resolve* (single sustained warm note, Scenes 6–7). Generate via T2A as stems (drone, keys, pad, sub) so you can mix per platform. Use **audio extension** to fit the bed exactly to the locked cut; **audio inpainting** to swap the Scene-2 riser or remove a clashing transient without re-generating the whole track. No drops, no EDM, no stock builds.
- **Foley strategy (V2A on each shot):** generate synced SFX for every silent generated clip — soft keyboard taps and a mouse click (Scene 3), UI tick/snap as cards assemble + one confident chime on the verdict (Scenes 4–6), a low sub-whoosh on each major transition, faint room tone everywhere. Keep foley *quiet and precise* — institutional restraint.
- **Voiceover strategy:** one voice, lower register, unhurried, dry and close-mic'd. Record a scratch VO, then use **A2A** to refine timbre/consistency if needed. ~90–110 wpm. Leave silence; let lines land. End line is the only "brand" moment.
- **Sound transitions:** crossfade room tones, never hard-cut silence; use a sub-whoosh + brief duck at each scene change; the chaos→clarity turn (Scene 2→3) is the one dramatic moment — collapse the noise to a single tone, then breathe.
- **Emotional pacing:** loud-but-controlled tension (0–18s) → collapse to near-silence (18–28s, the exhale) → warm open (28–48s) → intimate resolve (48–60s). Dynamic range *is* the message: noise vs. clarity.
- **Localization (AV2AV):** for non-English masters, transform the audio+video jointly so VO, music, and foley stay aligned with the picture.

---

## Deliverable 6 — Reusable content engine

Shoot/generate **once at 16:9, master clean**, then derive everything. Use **outpainting** to reframe (not re-generate), **A2A** to re-energize music per platform, and trim/re-order scenes.

| Output | Aspect · Length | Hook (first frames) | Footage reuse |
|---|---|---|---|
| **Website hero (loop)** | 16:9 · 8–12s silent loop | Scene 4 dashboard assembling, seamless loop | Scene 4 only, muted, looped; poster = last frame |
| **Launch trailer** | 16:9 · 60s | Full Concept A | The full flagship master |
| **YouTube** | 16:9 · 75–90s | Cold-open Scene 2 chaos (3s) → logo | Flagship + extra Concept-C explainer beats |
| **LinkedIn** | 1:1 or 16:9 · 30–45s | Scene 3 human + a single value line | Scenes 3→4→6→7, calmer music (A2A), captions burned in |
| **X/Twitter** | 16:9 or 1:1 · 20–30s | Verdict line first ("WAIT — and that's the point") | Scenes 4 + 6 + 7; punchy text |
| **YouTube Shorts** | 9:16 · ≤60s | Outpainted Scene 2 chaos vertical | Flagship outpainted to 9:16, trimmed |
| **Instagram Reels** | 9:16 · 20–35s | Scene 4 reveal, big captions | Outpaint Scenes 4–6, snappy cut, A2A punchier bed |
| **TikTok** | 9:16 · 15–30s | "Everyone's chasing signals. Watch this." text-hook over Scene 2 | Outpaint + faster cut; native captions; slightly warmer/looser tone |
| **Product teaser** | 1:1 · 6–10s | Logo line-draw (Scene 7) | Scene 7 + a 1s flash of Scene 4 |

Efficiency rules: lock the 16:9 master first; never re-generate for aspect — **outpaint**; keep one captions style (mono, bottom-third); export stems so each platform mix differs without new score; maintain a single color LUT across all cuts.

---

## Deliverable 7 — Asset preparation plan & checklist

What the team must produce *before* generation (clean source = clean output). Most already exist in the RangeClarity project.

**Screenshots / UI exports needed**
- Full decision-map dashboard (Range Score 78, S/R bar, Momentum, Risk/Reward, verdict) — from `premium-fintech` hero dashboard, exported at 2× on transparent/dark.
- Verdict states: `RETEST AREA`, `STRONG CONTEXT`, `NO EDGE`, `STRETCHED` (from the core indicator labels).
- The three module panels (Range / Momentum / Risk) from `range-command-v2`.
- A real sample chart read (ASTS mock) with zones drawn.

**Dashboard visuals**
- Layered export (background grid / panels / labels / accent line on separate layers) so I2V can parallax them.
- A clean looping state for the website hero.

**Landing page sections**
- Hero, Toolkit, "What it's not", pricing, FAQ captures (for B-roll and the YouTube explainer).

**Logos**
- Wordmark (light), monogram `RC`, and an SVG of the thin price-line underline for the Scene 7 draw-on.

**Charts**
- 3–5 clean annotated charts (trend, range, compression, breakout, failed breakout) matching brand colors — usable as I2V inputs and Concept-C explainer plates.

**UI animations**
- Native (code) micro-animations of the dashboard assembling and the range-position meter filling — capture as screen recordings to feed **V2V** for the cinematic grade (more brand-true than fully synthetic UI).

**Production checklist**
1. [ ] Lock brand kit (palette, type, LUT, motion rules) — Section 0.
2. [ ] Export all UI assets at 2×, layered, on dark + transparent.
3. [ ] Capture native UI screen recordings (for V2V).
4. [ ] Approve flagship script + scene timings (Deliverable 2).
5. [ ] Generate Scenes 1–2 (T2V), 3 (I2V+V2V), 4–6 (I2V+inpaint), 7 (I2V+backward extension).
6. [ ] Generate music stems (T2A) + extend to cut; generate foley (V2A) per shot.
7. [ ] Record + refine VO (A2A); mix with stems + foley; set dynamics (Section 5).
8. [ ] Picture lock 16:9 master; apply single LUT.
9. [ ] Outpaint to 9:16 + 1:1; derive all platform cuts (Deliverable 6).
10. [ ] QC pass against the benchmark (Deliverable 8); ship with disclaimer.

---

## Deliverable 8 — Quality benchmark (premium vs. amateur)

Measure the final cut against the best, and copy *what they actually do*:

- **Apple product launches:** obsessive negative space, one idea per shot, motion that eases and settles, sound design that "thunks" with intent. → *We adopt:* generous black space, one message per scene, settle-to-rest camera, deliberate foley.
- **Bloomberg visuals:** data is the hero and it's *legible*; monospace authority; restrained palette. → *We adopt:* mono labels, real values (Range Score 78), no decorative clutter.
- **Stripe marketing:** calm confidence, subtle gradients, premium typography, "we don't need to shout." → *We adopt:* low-key lighting, quiet VO, type-led storytelling.
- **Linear product videos:** crisp UI motion, dark mode elegance, tight tempo, zero filler. → *We adopt:* snappy on-beat UI assembly, no wasted frames, dark-mode hero.
- **Notion launches:** human warmth + clarity, friendly but not childish. → *We adopt:* the Scene-3 human moment and warm resolve so it isn't cold.

**What separates premium from amateur (the QC rubric):**
- *Restraint:* ≤6 colors, accent <10% of frame, one idea per shot. (Amateur over-decorates.)
- *Weighted motion:* eased, settling, parallax — not linear slides or shaky zooms.
- *Legibility:* every data point readable; type aligned to a grid; mono for data.
- *Sound intentionality:* nothing is silent by accident; foley is precise and quiet; dynamic range tells the story.
- *Brand fidelity:* real UI (I2V/V2V), never invented "AI UI"; consistent LUT across all cuts.
- *Honesty:* shows the "wait / no-edge" state — confidence through candor, not hype. Includes the not-advice disclaimer.
- *Finish:* consistent grade, clean kerning on titles, no generation artifacts (fixed via inpainting), seamless loops where used.

If a shot fails any rubric line, fix with the matching tool (inpaint artifacts, V2V to re-grade, A2A to fix VO, outpaint to reframe) rather than re-rolling — that's how a small team hits world-class.

---

## Appendix

### A. Reusable style suffix (append to every visual prompt)
> …deep navy `#05060A` background, restrained mint-teal `#34F5B0` and cyan `#38E1FF` accents, monospace data labels, low-key directional lighting, soft volumetric haze, faint chart-grid motif, shallow depth of field, 24fps cinematic, filmic contrast, premium institutional fintech mood, calm and intelligent, ultra-detailed, color-graded, no on-screen logos except where specified.

### B. Universal negative prompt
> crypto-bro aesthetics, gold chains, sports cars, rocket/“to the moon”, neon glow spam, lens flares, garish candlestick confetti, cluttered UI, fake holographic interfaces, hype text, EDM drop energy, oversaturated colors, more than six colors, watermark, stock-footage look, low-resolution, jittery camera, warped text, extra fingers, uncanny faces, distorted UI numbers.

### C. Control-adapter usage (IC-LoRA)
- **V2V:** condition a real UI screen recording on the brand LUT/lighting to get cinematic, brand-true product shots (Scenes 3–6) — preserves true motion/structure, restyles look.
- **A2A:** restyle scratch VO → final timbre; adapt one music bed into per-platform energies without re-scoring.
- **AV2AV:** localized/alt masters — transform audio+video jointly so VO, foley, and picture stay in sync (e.g., language variants, or a "calm" vs "energetic" master).

### D. Realistic small-team schedule (≈2 weeks, 3 people)
- **Days 1–2:** brand kit + asset exports + script lock (designer + creative lead).
- **Days 3–6:** generate all scenes (T2V/I2V/V2V/extension/inpaint); iterate (AI producer).
- **Days 7–9:** music (T2A) + foley (V2A) + VO + mix (sound + producer).
- **Days 10–11:** picture lock, grade, QC vs. benchmark.
- **Days 12–14:** outpaint + derive all platform cuts; captions; ship.

### E. Compliance guardrail (every cut)
Always include, small and legible at the end: **"Educational chart context. Not financial advice. No signals or performance guarantees."** This is brand-on (honesty = the premium signal) and protects the launch.
