# RangeClarity

Premium TradingView indicator-suite landing page for RangeClarity.

## Local Development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Check

```powershell
npm run typecheck
npm run build
```

## Vercel Deployment

Use these settings when importing the GitHub repo into Vercel:

- Framework preset: `Next.js`
- Root directory: project root
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Next.js default

No environment variables are required for the current static landing page build.

## Main Route

The homepage redirects to:

```text
/designs/premium-fintech
```
