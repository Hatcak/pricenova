-- ─────────────────────────────────────────────────────────────────────────────
--  PriceNova — database schema
--
--  Run this once in your Supabase project: Dashboard → SQL Editor → New query →
--  paste → Run. It is idempotent, so re-running it is safe.
--
--  The tables mirror the shapes in lib/demo/data.ts, so swapping demo data for
--  real queries is a matter of changing where the rows come from, not what they
--  look like.
--
--  Every table is row-level-secured to the owner: a signed-in user can only
--  ever see and change their own rows. Nothing is readable anonymously.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type match_method as enum ('gtin', 'model', 'title', 'manual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('pending', 'confirmed', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rule_mode as enum ('auto', 'approval');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rule_status as enum ('active', 'paused');
exception when duplicate_object then null; end $$;

-- pending  → suggested, store untouched
-- applied  → written to the store, still undoable
-- reverted → put back to from_price
-- rejected → you dismissed the suggestion
do $$ begin
  create type reprice_status as enum ('pending', 'applied', 'reverted', 'rejected');
exception when duplicate_object then null; end $$;

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  store_name  text,
  created_at  timestamptz not null default now()
);

-- Give every new auth user a profile row automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Workspace settings (the Settings screen writes here) ─────────────────────
create table if not exists public.workspace_settings (
  user_id    uuid primary key references auth.users on delete cascade,
  -- false = the emergency stop is engaged; no rule may write a price
  autopilot  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Added after the first release. `add column if not exists` means you can
-- safely paste this whole file again to pick them up.
alter table public.workspace_settings
  -- Pricing defaults applied to newly created rules
  add column if not exists default_rule_mode   rule_mode     not null default 'approval',
  add column if not exists floor_margin_pct    numeric(5,2)  not null default 10,
  add column if not exists max_daily_changes   integer       not null default 50,
  -- Where alerts go
  add column if not exists notify_email        boolean       not null default true,
  add column if not exists notify_slack        boolean       not null default false,
  -- What counts as worth telling you about
  add column if not exists notify_drop_pct     numeric(5,2)  not null default 1,
  add column if not exists notify_lost_lead    boolean       not null default true,
  add column if not exists notify_stock_out    boolean       not null default true,
  -- 'off' | 'daily' | 'weekly'
  add column if not exists digest_frequency    text          not null default 'weekly';

-- ── Competitors ──────────────────────────────────────────────────────────────
create table if not exists public.competitors (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  domain     text not null,
  color      text,
  created_at timestamptz not null default now()
);
create index if not exists competitors_user_idx on public.competitors (user_id);

-- ── Products ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  sku        text not null,
  category   text,
  gtin       text,
  -- your unit cost, the basis for every floor rule
  cost       numeric(12,2) not null default 0,
  price      numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, sku)
);
create index if not exists products_user_idx on public.products (user_id);

-- ── Competitor matches ───────────────────────────────────────────────────────
create table if not exists public.product_matches (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  product_id    uuid not null references public.products on delete cascade,
  competitor_id uuid not null references public.competitors on delete cascade,
  rival_title   text not null,
  rival_url     text not null,
  -- 0–100; anything below 90 stays 'pending' until a human confirms it
  confidence    smallint not null default 0 check (confidence between 0 and 100),
  method        match_method not null default 'title',
  status        match_status not null default 'pending',
  evidence      text,
  created_at    timestamptz not null default now(),
  unique (product_id, competitor_id)
);
create index if not exists matches_user_status_idx on public.product_matches (user_id, status);

-- ── Observed prices (yours and theirs, over time) ────────────────────────────
create table if not exists public.price_points (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users on delete cascade,
  product_id    uuid not null references public.products on delete cascade,
  -- null means this is your own price
  competitor_id uuid references public.competitors on delete cascade,
  price         numeric(12,2) not null,
  in_stock      boolean not null default true,
  observed_at   timestamptz not null default now()
);
create index if not exists price_points_lookup_idx
  on public.price_points (product_id, competitor_id, observed_at desc);

-- ── Repricing rules ──────────────────────────────────────────────────────────
create table if not exists public.reprice_rules (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  name          text not null,
  formula       text not null,
  scope         text,
  status        rule_status not null default 'active',
  -- 'approval' is the safe default: suggest, never write
  mode          rule_mode not null default 'approval',
  last_fired_at timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists rules_user_idx on public.reprice_rules (user_id);

-- ── Repricing events (the approval queue and the undo history) ───────────────
create table if not exists public.reprice_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  product_id  uuid not null references public.products on delete cascade,
  rule_id     uuid references public.reprice_rules on delete set null,
  -- from_price is what makes undo possible: never overwrite it
  from_price  numeric(12,2) not null,
  to_price    numeric(12,2) not null,
  cost        numeric(12,2) not null default 0,
  reason      text,
  status      reprice_status not null default 'pending',
  created_at  timestamptz not null default now(),
  applied_at  timestamptz,
  reverted_at timestamptz
);
create index if not exists events_user_status_idx on public.reprice_events (user_id, status, created_at desc);

-- ── Row-level security ───────────────────────────────────────────────────────
-- One policy shape for every table: you may touch a row only if it's yours.
alter table public.profiles           enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.competitors        enable row level security;
alter table public.products           enable row level security;
alter table public.product_matches    enable row level security;
alter table public.price_points       enable row level security;
alter table public.reprice_rules      enable row level security;
alter table public.reprice_events     enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array[
    'workspace_settings', 'competitors', 'products',
    'product_matches', 'price_points', 'reprice_rules', 'reprice_events'
  ] loop
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format(
      'create policy "own rows" on public.%I for all
         using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;
