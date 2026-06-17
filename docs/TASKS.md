# Tasks

Phased task tracker for RangeClarity. We work one phase at a time and do not
jump ahead.

## Phase 0 - Foundation

- [x] Choose app type, stack, and first-step scope
- [x] Tooling config (`package.json`, `tsconfig.json`, `next.config.mjs`,
  ESLint, `.gitignore`, `.env.example`, `.nvmrc`)
- [x] Minimal App Router skeleton (`app/layout.tsx`, `app/page.tsx`,
  `app/globals.css`)
- [x] Core docs (`README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`)
- [x] Product brief / master plan - see
  [../RANGECLARITY_MASTER_PLAN.md](../RANGECLARITY_MASTER_PLAN.md)
- [x] First landing/waitlist slice (`app/page.tsx`, `components/*`,
  `app/api/waitlist`, `lib/waitlist.ts`)
- [x] Basic Terms and Privacy pages for the public waitlist flow
- [ ] Initialize git locally. The current `.git/` folder is partial/corrupt;
  delete it, then run `git init && git add -A && git commit -m "chore: scaffold foundation"`.
- [ ] Verify locally: `npm install`, then `npm run dev` starts and the page
  renders

## Master Plan

The full product/strategy/execution plan lives in
[RANGECLARITY_MASTER_PLAN.md](../RANGECLARITY_MASTER_PLAN.md).

## Phase 1 - Planning & Foundation Gate

The web landing/waitlist slice now exists, but Pine Script, Pro access, payments,
accounts, Discord automation, and backend automation remain deferred.

- [ ] P1-1 Approve and finalize master plan; answer the open questions
- [ ] P1-2 Detailed Starter indicator spec on paper
- [ ] P1-3 Support/resistance + scoring spec finalized
- [ ] P1-4 Brand and compliance kit
- [ ] P1-5 Tooling and accounts readiness

## Notes

- Dependencies are installed in the active project folder and `package-lock.json`
  is present. Commit it when the repository is initialized.
- Keep changes minimal and update this file after each meaningful change.
