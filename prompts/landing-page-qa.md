# Prompt — Landing Page QA (RangeClarity)

A focused lens for auditing landing/marketing quality. Use it yourself during the Website check, or
paste it to Codex/Claude for a structured read. It **audits only** — any fix still goes through the
one-issue loop (`prompts/claude-fix-one-issue.md`). No redesign, no new features, no commit.

**Files in scope**
- Homepage: `app/designs/rangeclarity-fox-brand-v1/page.tsx` + `app/designs/rangeclarity-fox-brand-v1/foxBrandHero.module.css` (`app/page.tsx` re-exports it)
- Beta: `app/beta/page.tsx`, `app/beta/free-access/page.tsx`, `app/beta/free-access/FreeAccessForm.tsx`
- TradingView setup: `app/tradingview-setup/page.tsx`, `app/_components/TradingViewCTA.tsx`
- Global styles: `app/globals.css`

**Brand bar:** *Simple Chart. Complex Engine. No Signals. No Noise. Just Structure.* — premium, calm,
teal/magenta/slate. No buy/sell/entry/exit/wait/avoid-chase/pullback/breakout/prediction/advice language.

---

```
Audit the RangeClarity landing experience against the checklist below. For EACH item give a
verdict (✅ ok / ⚠️ weak / ❌ broken), the file + line, the specific problem, and a one-line
suggested direction. Do not edit anything. End by nominating the single highest-impact fix.

Check at ~390px (mobile) AND desktop:

1. TOO MUCH TEXT
   - Walls of copy, paragraphs that should be one line, repeated points, anything skippable.
   - Could the first screen lose 30–50% of words and read stronger?

2. WEAK FIRST VIEWPORT
   - Above the fold: is the value instantly clear in <3 seconds? Is there a strong headline +
     one supporting line + one obvious action — or a vague/slow opener?

3. MOBILE SPACING
   - Cramped or uneven padding, text touching edges, oversized hero, awkward line breaks,
     tap targets too small, horizontal scroll.

4. UNCLEAR CTA
   - Is there ONE primary action? Is its label specific ("Request 7-Day Free Access") not generic
     ("Submit"/"Learn more")? Is it visible without scrolling on mobile? Competing CTAs?

5. GENERIC COPY
   - Lines that could belong to any SaaS ("powerful platform", "take control"). Flag clichés and
     anything not specific to clean market structure.

6. DESIGN MISMATCH
   - Off-palette colors, inconsistent type scale/weights, misaligned sections, components that don't
     match the premium dark teal/magenta/slate system.

7. BROKEN RESPONSIVE LAYOUT
   - Overflow, clipped content, broken grid/flex wrapping, fixed widths causing scroll, images not scaling.

8. PREMIUM FEEL
   - Does it feel like a paid, invite-only product? Note anything cheap/templated: default shadows,
     stocky gradients, default fonts, low contrast, cluttered hierarchy.

OUTPUT:
- The checklist with verdicts + file/line + problem + direction.
- "Top 3 issues" (most damaging first).
- "Single highest-impact fix" — small, safe, no redesign — phrased as a one-issue task for Claude.
```

---

### Turn findings into action
- Keep only the **top 3** in `docs/ops/current-loop-status.md` → *Candidate issues*.
- Pick one (or let Codex's section F decide), then run the Claude fix-one-issue prompt.
- Remember: this prompt finds problems; it does not authorize a redesign.
