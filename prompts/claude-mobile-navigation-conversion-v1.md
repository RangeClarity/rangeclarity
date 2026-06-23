# Claude Prompt: Mobile Navigation + Conversion Redesign v1

You are working on RangeClarity.

Implement Mobile Navigation + Conversion Redesign v1.

## Context

The current mobile view feels weak and hard to navigate. Dean rates it 1/10.
We need the mobile experience to feel easier, more market-wise, more premium,
and more conversion-focused.

Do not edit Pine.  
Do not change product logic.  
Do not add new features.  
Do not break desktop.  
Do not redesign the whole brand from scratch.  
Focus on mobile UX, navigation, first viewport, and conversion clarity.

## Competitive Direction

Trading tools sell best with:

- One sharp promise above the fold.
- Clear product visual / chart preview early.
- One primary CTA.
- Free/trial/low-friction CTA visible.
- Simple mobile navigation.
- Benefits grouped into 3-4 scannable cards.
- Less text, more structure.
- Trust/compliance copy kept short.
- "What this helps you understand" instead of generic feature lists.

## RangeClarity Positioning

Simple chart. Complex engine.

No signals. No noise. Just structure.

A calm structure-reading system for TradingView.

## Target Mobile Feeling

Premium, compact, easy to understand in 5 seconds.

Not a long text page.
Not generic SaaS.
Not crypto hype.
Not signal-tool style.

## Scope

Improve mobile design for:

- Homepage `/`
- `/beta`
- `/beta/free-access`
- Shared beta header/nav if relevant.

## Primary Fixes

### 1. Mobile Nav

- Make navigation easier on phone.
- Add a compact mobile menu or simplified top bar if needed.
- Primary CTA must be obvious.
- Avoid too many top links.
- Keep brand fox visible but not oversized.

### 2. First Viewport

- Reduce text.
- Clear headline.
- One short supporting sentence.
- Product/chart visual or dashboard proof visible early.
- Primary CTA and secondary CTA visible without scrolling too much.

### 3. CTA Hierarchy

Use:

- Primary: `Get Beta Access`
- Secondary: `Try 7-Day Free Access`

Keep paid-first if currently intentional, but make free access easy to find on
mobile.

### 4. Section Simplification

On mobile:

- Collapse long text.
- Use short cards.
- Use 3-second scan blocks.
- Avoid huge paragraphs.
- Avoid repeated claims.
- Avoid generic marketing fluff.

### 5. Mobile Usability

Check:

- No horizontal overflow.
- No clipped text.
- Buttons easy to tap.
- Spacing tight but readable.
- No giant hero taking the whole screen without value.
- Forms usable on phone.

### 6. Compliance

Keep language safe:

- No buy/sell signals.
- No predictions.
- No profit claims.
- No "avoid chase", "pullback zone", or "wait" directive language.

Negating compliance copy like "no buy/sell signals" is okay.

## Implementation Rules

- Prefer editing existing components/styles.
- Keep changes scoped.
- No broad refactor.
- No new dependency unless absolutely necessary.
- No image asset compression in this batch unless trivial.
- Do not touch unrelated dirty files.
- Do not commit or push.

## Deliverables

### A. Inspect

First inspect current files and identify exact homepage/beta components.

### B. Implement

Implement the mobile redesign batch.

### C. Run

Run:

```bash
npm run health
npm run build
```

### D. Visual Check

If possible, start the dev server and visually check:

- 390px mobile.
- 430px mobile.
- 1440px desktop.

### E. Report

Report:

- Files changed.
- Mobile UX changes made.
- Before/after behavior.
- Routes checked.
- Health/build result.
- Remaining mobile issues.

## Acceptance Criteria

- Mobile homepage is at least 7/10 usable.
- First viewport is clear in 5 seconds.
- CTA is obvious.
- Free access is easy to find.
- Beta/free-access flow feels connected to the brand.
- Desktop is not broken.
- `npm run health` passes.
