# Project Plan (internal)

Internal, non-public project view for RangeClarity. Not linked from the public site.

## Files

- `rangeclarity-live-plan.md` — the single source of truth for the internal plan. **Edit this to update the page.**
- The viewer lives at `app/project-plan/page.tsx` and renders this markdown at the `/project-plan` route.

## How to update the plan

1. Edit `rangeclarity-live-plan.md` (headings, bullets, `**bold**`, inline `code`, and `>` callouts).
2. Reload `/project-plan`. In `npm run dev` it updates on reload; a production server reads the file at request time, so no rebuild is needed for content changes.

No code change is needed to update content — the markdown is the source of truth.

## How to view

- Run `npm run dev`, then open `http://localhost:3000/project-plan`.
- The route is intentionally **unlinked** from the public nav, labelled INTERNAL, and set to `noindex`.

## For Codex (QA)

- Review the same source by reading `docs/project-plan/rangeclarity-live-plan.md`.
- QA both the markdown (accuracy, guardrail language) and the rendered page.
- The page is a read-only viewer; all content changes happen in the markdown.

## Rules

- **No secrets** — no API keys, tokens, or customer data in the markdown or the page.
- **Keep task IDs stable** (e.g. `RC-6`, `O-002`, `PAY-1`, `VALUE-1`) so they can be tracked across docs and reviews. Add new IDs; do not renumber old ones.
- Keep it internal: do not link `/project-plan` from the public homepage nav.
- This is project management, not marketing — practical and direct; no hype, no customer-facing promises, no financial-advice language.
