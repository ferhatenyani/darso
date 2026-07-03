-- 0007_messaging.sql
-- Messaging: conversations, participants, messages.
-- Attachments and reactions are deferred (see architecture.md §7).

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null default '1to1'
               constraint conversations_kind_check check (kind in ('1to1','cohort','event')),
  title      text,
  course_id  uuid references public.courses(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- conversation_participants — membership + read cursor for unread counts.
-- ---------------------------------------------------------------------------
create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  last_read_at    timestamptz,
  joined_at       timestamptz not null default now(),
  primary key (conversation_id, profile_id)
);

create index conversation_participants_profile_idx
  on public.conversation_participants (profile_id);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now()
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- is_conversation_member(): SECURITY DEFINER helper so message/participant
-- policies can check membership without recursive RLS on participants.
-- ---------------------------------------------------------------------------
create or replace function public.is_conversation_member(conv uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conv and cp.profile_id = uid
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS — everything is participant-scoped.
-- ---------------------------------------------------------------------------
alter table public.conversations             enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages                  enable row level security;

create policy "members read their conversations"
  on public.conversations for select
  using (public.is_conversation_member(id, auth.uid()));

create policy "members read participant rows"
  on public.conversation_participants for select
  using (public.is_conversation_member(conversation_id, auth.uid()));

-- A user may set their own read cursor.
create policy "users update their own participant row"
  on public.conversation_participants for update
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "members read messages"
  on public.messages for select
  using (public.is_conversation_member(conversation_id, auth.uid()));

create policy "members send messages as themselves"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and public.is_conversation_member(conversation_id, auth.uid())
  );
