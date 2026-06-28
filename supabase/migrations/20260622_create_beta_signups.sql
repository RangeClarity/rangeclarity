create table if not exists public.beta_signups (
  id uuid primary key,
  email text not null,
  tradingview_username text not null,
  full_name text,
  selected_plan text not null,
  signup_type text not null,
  note text,
  consent boolean not null default false,
  source text,
  environment text,
  user_agent text,
  user_email_sent boolean not null default false,
  admin_email_sent boolean not null default false,
  email_error text,
  created_at timestamptz not null default now()
);

create index if not exists beta_signups_created_at_idx
  on public.beta_signups (created_at desc);

create index if not exists beta_signups_email_idx
  on public.beta_signups (email);

alter table public.beta_signups enable row level security;

-- No public read/write policies are created.
-- Server writes use SUPABASE_SERVICE_ROLE_KEY from Next.js API routes only.
