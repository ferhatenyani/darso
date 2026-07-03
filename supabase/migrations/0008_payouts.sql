-- 0008_payouts.sql
-- Teacher payouts: bank destination methods and disbursement records.

-- ---------------------------------------------------------------------------
-- payout_methods — a teacher's bank destination (Algerian RIB, 20 digits).
-- ---------------------------------------------------------------------------
create table public.payout_methods (
  id             uuid primary key default gen_random_uuid(),
  teacher_id     uuid not null references public.profiles(id) on delete cascade,
  bank_code      text not null,   -- e.g. bna, bea, cpa, badr, bdl, agb, sga, trust, ccp
  account_holder text not null,
  rib            text not null constraint payout_rib_check check (rib ~ '^[0-9]{20}$'),
  bic            text,
  is_verified    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index payout_methods_teacher_idx on public.payout_methods (teacher_id);

create trigger payout_methods_set_updated_at
  before update on public.payout_methods
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- payouts — a disbursement record.
-- ---------------------------------------------------------------------------
create table public.payouts (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references public.profiles(id) on delete cascade,
  method_id    uuid references public.payout_methods(id) on delete set null,
  reference    text not null unique,
  amount_dzd   integer not null constraint payouts_amount_check check (amount_dzd >= 0),
  status       text not null default 'pending'
                 constraint payouts_status_check check (status in ('pending','paid','failed')),
  period_label text,
  paid_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index payouts_teacher_idx on public.payouts (teacher_id);

create trigger payouts_set_updated_at
  before update on public.payouts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — owner-only reads; writes are performed server-side (service role),
-- which bypasses RLS. Teachers may manage their own bank methods.
-- ---------------------------------------------------------------------------
alter table public.payout_methods enable row level security;
alter table public.payouts        enable row level security;

create policy "teachers manage their own payout methods"
  on public.payout_methods for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create policy "teachers read their own payouts"
  on public.payouts for select using (auth.uid() = teacher_id);
