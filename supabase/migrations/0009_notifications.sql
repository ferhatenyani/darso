-- 0009_notifications.sql
-- Per-user notification feed.

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null
               constraint notifications_type_check check (type in ('booking','message','review','system','billing')),
  title      text not null,
  body       text,
  href       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where is_read = false;

-- ---------------------------------------------------------------------------
-- RLS — owner only. Rows are typically created server-side (service role).
-- ---------------------------------------------------------------------------
alter table public.notifications enable row level security;

create policy "users read their own notifications"
  on public.notifications for select using (auth.uid() = user_id);

-- Allow the owner to mark read / delete.
create policy "users update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users delete their own notifications"
  on public.notifications for delete using (auth.uid() = user_id);
