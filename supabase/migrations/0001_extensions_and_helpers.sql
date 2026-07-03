-- 0001_extensions_and_helpers.sql
-- Extensions and shared helper functions used across the schema.

-- gen_random_uuid() and crypto helpers.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- set_updated_at(): generic BEFORE UPDATE trigger that stamps updated_at.
-- Attached per-table in later migrations.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
