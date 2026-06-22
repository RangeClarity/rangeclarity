-- RangeClarity manual fulfilment: access state on beta_signups.
-- Idempotent; safe to run on an existing table. Existing rows default to 'pending'.
alter table public.beta_signups add column if not exists status text not null default 'pending';
alter table public.beta_signups add column if not exists invited_at timestamptz;

create index if not exists beta_signups_status_idx on public.beta_signups (status);
