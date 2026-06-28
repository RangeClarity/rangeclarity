# RC Daily Routine (Dean)

The exact sequence to run each day. ~20–30 minutes. One fix per day. Copy-paste the commands.
Full explanation of *why* each step exists: `docs/ops/continuous-improvement-loop.md`.

> Golden rule: **one issue in flight.** Don't start a second fix until today's is approved and logged.

## Current Recovery Override - 2026-06-25

Today's question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

Until workspace drift is resolved, do not start the normal health/build/website QA loop. Use this order:

1. Confirm canonical repo and branch.
2. Verify visual review artifacts.
3. Verify founder labeling files.
4. Founder labels `clean_but_capped` only after paths are verified.
5. Only after labels, decide Broken Zone A/B.
6. Website QA remains paused until repo/branch drift is resolved.
7. Revenue track stays visible daily: content, waitlist, and first 10 beta users.

Blocked during recovery: founder labeling until paths are verified, Broken Zone A/B until founder labels exist, Pine, scoring/cap changes, `agree3` loosening, website QA/commits, payment/Lemon, push, and external Linear/Hermes sync while the local source of truth is unstable.

---

## ☀️ Morning — Health (5 min)

```bash
git status --short            # what's already dirty?
npm run health               # typecheck → lint → qa:rc → build (must be green)
npm run qa:rc                # refresh the indicator QA report
```

Then read the indicator report:

```
docs/qa/live-qa-report.md
```

- **Green health?** Continue.
- **Red health?** That *is* today's issue — skip to the Agent loop and have Claude fix it first.
- Note anything new in the QA report (ignore the `SENTINEL` / intentional fixture findings).

---

## 🖥️ Website check (10 min)

```bash
npm run dev                  # then open http://localhost:3000
```

Look at, in this order:
1. **Homepage on mobile** — resize to ~390px (DevTools device toolbar). Source: `app/designs/rangeclarity-fox-brand-v1/page.tsx`.
2. **Homepage on desktop** — first viewport only: is the message instant and premium?
3. **Beta free-access flow** — `http://localhost:3000/beta/free-access` (form: `app/beta/free-access/FreeAccessForm.tsx`).

Use the lens in `prompts/landing-page-qa.md`. Then:

> **Write down the TOP 3 issues only.** Not a backlog — the three that hurt most today.
> Put them at the bottom of `docs/ops/current-loop-status.md` under *Candidate issues*.

---

## 🤖 Agent loop (10–15 min)

**Step 1 — Codex critiques.** Paste `prompts/codex-daily-critic.md` to Codex.
Read its section **F (what Claude should fix first)** and **G (what not to touch)**.
Pick **one** issue. Write it into `docs/ops/current-loop-status.md` → *Next Claude task*.

**Step 2 — Claude fixes one.** Paste `prompts/claude-fix-one-issue.md` and name the single approved issue.
Claude makes the smallest change and stops. Do **not** let it chain into a second fix.

**Step 3 — Re-check health.**

```bash
npm run health
```

**Step 4 — Approve visually.** Re-open `npm run dev`, view the change on mobile + desktop. Brand/calm OK?
- **Approve** → continue. **Reject** → note why in the status file; ask Claude to revise the *same* issue.

**Step 5 — Update the board.**

```
docs/kanban.md                       # move the issue to Done
docs/ops/current-loop-status.md      # update phase, last health, next tasks
```

Commit/push only if **you** decide to — that is never automatic:

```bash
# optional, your call, when you're ready:
# git add -p && git commit -m "..."   # then push manually
```

---

## Daily checklist (tick it)

- [ ] `git status --short` reviewed
- [ ] `npm run health` green (or red = today's fix)
- [ ] `npm run qa:rc` + report reviewed
- [ ] Homepage checked on mobile + desktop
- [ ] `/beta/free-access` checked
- [ ] Top 3 issues written down
- [ ] Codex critique run → one issue chosen
- [ ] Claude fixed exactly one issue → `npm run health` green
- [ ] Change visually approved
- [ ] `kanban.md` + `current-loop-status.md` updated
- [ ] Commit/push only if I chose to

---

### Notes
- `npm run health` runs `build` last; it is the slowest step. If you only want the fast checks while
  iterating, run `npm run typecheck && npm run lint && npm run qa:rc` and save `build` for the end.
- `qa:rc` needs dev deps installed once: `npm install` (brings in `tsx`).
