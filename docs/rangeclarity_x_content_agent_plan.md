# RangeClarity — X/Twitter Content Agent Plan

Status: active plan. A **draft-only, human-approved** content workflow for the RangeClarity X account. This is not a bot. It generates high-quality drafts and ideas; a human reviews and posts manually. v1 has **no X API, no automation of engagement.**

## 1. Purpose of the agent
Help RangeClarity post consistently and on-brand without spam. The agent turns the brand message, product concepts, and recent build progress into a daily set of ready-to-review drafts (posts, replies, meme/image prompts, a chart breakdown idea, and a follower question). It removes the blank-page problem and keeps the voice consistent, while leaving every posting decision to a human.

## 2. What the agent IS allowed to do
- Generate **draft** posts, reply suggestions, meme/image prompts, chart-breakdown prompts, and follower questions.
- Read local strategy docs (`content/x/*`) and optional project notes (`docs/project-state.md`, `docs/current-sprint.md`, recent patch notes) to ground "build in public" updates.
- Write daily markdown draft files to `content/x/drafts/`.
- Organize a content calendar and reusable templates.
- Flag anything that may violate the approval checklist.

## 3. What the agent must NEVER do
- **Never auto-post** to X (no posting in v1; later only with explicit per-post human approval).
- Never auto-like, auto-follow, auto-DM, auto-reply, or automate any engagement.
- Never create/store X credentials or API keys, or ask the user for them.
- Never write financial advice, buy/sell signals, price targets, or performance/return claims.
- Never use pump/hype language, fake urgency, or engagement-bait spam.
- Never copy others' content or use copyrighted logos/brand marks.
- Never post about a specific person's account without human review.

## 4. Content categories
- **Meme** — smart, visual, slightly funny; clarity-vs-noise humor.
- **Build in public** — honest progress on the indicator/Website Brain.
- **Chart breakdown** — structure-only read of an anonymized chart (Local S/R, Key Zone, Strong S/R, Soft Channel, Market Bias). No calls.
- **Product philosophy** — "show fewer things, score what matters," "no clean setup, say less."
- **Question / poll** — invite followers to share charts/opinions on structure.
- **Behind the scenes** — tooling, process, design choices.
- **Website Brain concept** — Market Room, Watchlist Radar, RangeClarity Score teasers.
- **Indicator progress** — new states, cleaner rendering, dashboard updates.

## 5. Daily workflow
1. (Optional) jot a one-line progress note in `docs/current-sprint.md` or `docs/project-state.md`.
2. Run `python scripts/generate_x_drafts.py` (optionally `--date YYYY-MM-DD`).
3. Open the generated `content/x/drafts/<date>_x_drafts.md`.
4. Review against `content/x/approval_checklist.md`.
5. Edit/keep the few you like; discard the rest.
6. Manually post the approved ones from the X app/site. (No automation.)
7. Mark calendar status; save any winners as new template variants.

## 6. Approval workflow
- Every draft file opens with a **"MANUAL APPROVAL REQUIRED"** banner and a compliance reminder.
- A post is eligible only after **every** item in `approval_checklist.md` passes.
- The human is the only actor that posts. The agent never has posting capability in v1.
- Keep an audit trail: approved posts can be copied into a `content/x/posted/` log (optional, manual) with date + link for future reference.

## 7. File / folder structure
```
content/
  x/
    content_calendar.md        # 14-day starter plan (rotating)
    templates.md               # 10 reusable draft templates
    approval_checklist.md      # pre-post gate
    drafts/
      YYYY-MM-DD_x_drafts.md   # generated daily drafts (review here)
    posted/                    # (optional, manual) log of what went live
scripts/
  generate_x_drafts.py         # local generator (no API, no posting)
docs/
  rangeclarity_x_content_agent_plan.md   # this file
```

## 8. Future X API integration plan (later, optional, still human-gated)
Phased and conservative — engagement is never automated:
- **Phase 0 (now):** local drafts only. No API, no keys.
- **Phase 1 — read-only research (optional):** a separate, clearly-scoped script could read public timelines/news accounts to *suggest reply contexts*. Keys stored only in a gitignored `.env`, never in repo. Still no posting.
- **Phase 2 — assisted single-post publish:** a "publish this one approved draft" command that posts exactly one human-selected, human-edited draft via the API, with a confirmation prompt and a logged record. No batching, no scheduling of unreviewed content.
- **Phase 3 — scheduling of pre-approved posts:** queue only items a human already approved; still no auto-engagement, no auto-replies, no auto-follow/like/DM.
- **Never:** auto-generated replies posted without review, mass actions, follow/unfollow loops, DM automation.
Auth uses OAuth via official X API only; secrets in environment, rotated; least-privilege scopes; rate-limit aware; kill-switch documented.

## 9. Safety / compliance notes
- **Not financial advice.** RangeClarity describes *structure*, never direction or trades. Include a light, non-spammy disclaimer where relevant.
- **No performance claims** (no win rates, no "this called the top").
- **No buy/sell, target/defense, or prediction wording.**
- **Anonymize chart breakdowns** unless the symbol is clearly educational and uncontroversial; never imply a trade.
- **Respect IP:** original memes/wording only; no copyrighted logos.
- **Privacy/security:** no credentials in repo; `.env` gitignored; see `PRIVACY_AND_DEV_SECURITY_CHECKLIST.md`.
- **Tone guardrails:** smart, visual, slightly funny, premium, never hype.

## 10. Example outputs
**Original post (philosophy):**
> Most indicators scream. Ours whispers.
> Strong structure → a zone. Medium/weak → a faint line. No clean setup → it says less.
> Clean chart. Clear setup. That's the whole pitch.

**Build in public:**
> This week on RangeClarity: the chart stopped going empty on strong trends. If there's a real level below price, you now see it — quietly. Simple chart, complex engine. 🧱

**Meme prompt:**
> Split image. Left: a chart with 14 indicators, arrows, and rainbow clouds — caption "Your setup." Right: one clean RangeClarity level + bias — caption "The setup." Minimal, premium, slightly funny.

**Reply (to a "what do you see on $X?" chart account):**
> Structurally: bias looks [Bullish/Sideways], price sitting near a Key zone with a Soft Channel holding. Not a call — just the map. (RangeClarity reads structure, not signals.)

**Follower question:**
> Show me a chart where the *structure* is obvious but everyone's overcomplicating it. Bias + nearest level only — no signals.

> ⚠️ All examples are drafts. Nothing posts without human approval and an approval-checklist pass.
