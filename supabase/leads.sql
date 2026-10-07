-- ─────────────────────────────────────────────────────────────────────────────
--  PriceNova — quote requests ("Teklif al" form on /iletisim)
--
--  Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--  Idempotent, safe to re-run.
--
--  Anyone may INSERT a request (the public form uses the anon key), but nobody
--  can read them through the API: there is no SELECT policy. You read them in
--  Dashboard → Table Editor → leads, which bypasses RLS.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  plan           text check (plan in ('Starter', 'Growth', 'Scale')),
  name           text not null check (char_length(name) between 2 and 120),
  company        text check (char_length(company) <= 160),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  phone          text not null check (char_length(phone) between 7 and 30),
  product_count  text check (char_length(product_count) <= 40),
  message        text check (char_length(message) <= 2000),
  consent        boolean not null check (consent),
  lang           text check (lang in ('tr', 'en')),
  status         text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost'))
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can submit a quote request" on public.leads;
create policy "Anyone can submit a quote request"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new');

create index if not exists leads_created_at_idx on public.leads (created_at desc);
