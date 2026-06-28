# Free Access Dry-Run Checklist

Use this before considering the beta/free access capture flow healthy in production.

1. Landing page CTA opens the beta/free access form.
2. Form accepts a valid email, exact TradingView username, optional full name, optional note, and checked consent.
3. Success state appears only after capture succeeds.
4. Free access form shows: "Request received. We'll review your TradingView username and manually add eligible users within 24-48 hours during beta."
5. User receives the confirmation email.
6. Admin receives the notification email with email, TradingView username, full name, selected plan, signup type, note, timestamp, source page, environment, and consent status.
7. Admin can see the saved signup record: Supabase `beta_signups` is durable when configured; otherwise admin notification email is the temporary source of truth. Local JSONL is a local-development audit record only.
8. Admin manually grants eligible users access to the invite-only RangeClarity TradingView indicator.

Before production deploy, run `npm run test:emails`. In Vercel, set `RESEND_API_KEY`,
`EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, and `NEXT_PUBLIC_SITE_URL` for the same
environment you are deploying. If Supabase is used, also set `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`, then apply `supabase/migrations/20260622_create_beta_signups.sql`.

Do not automate TradingView access in this flow.
