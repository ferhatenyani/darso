-- 0003_profiles.sql
-- Identity: profiles (1:1 auth.users) and teacher_profiles (1:1 teacher profile).

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'student'
                constraint profiles_role_check check (role in ('student','teacher')),
  full_name   text,
  avatar_url  text,
  locale      text not null default 'fr'
                constraint profiles_locale_check check (locale in ('fr','ar')),
  wilaya      text references public.wilayas(code),
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- teacher_profiles — the public tutor card. One row per teacher profile.
-- ---------------------------------------------------------------------------
create table public.teacher_profiles (
  profile_id          uuid primary key references public.profiles(id) on delete cascade,
  slug                text not null unique,
  headline            text,
  bio                 text,
  category            text references public.categories(key),
  subjects            text[] not null default '{}',
  hourly_rate_dzd     integer constraint teacher_rate_check check (hourly_rate_dzd is null or hourly_rate_dzd >= 0),
  mode                text not null default 'online'
                        constraint teacher_mode_check check (mode in ('online','in-person','both')),
  languages           text[] not null default '{}',
  response_hours      integer,
  is_id_verified      boolean not null default false,
  is_contact_verified boolean not null default false,
  is_accepting        boolean not null default true,
  -- Denormalised aggregates, maintained by trigger from reviews / bookings.
  rating_avg          numeric(3,2) not null default 0,
  rating_count        integer not null default 0,
  lessons_count       integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index teacher_profiles_category_idx on public.teacher_profiles (category);

create trigger teacher_profiles_set_updated_at
  before update on public.teacher_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user(): create a profile row when someone signs up via Supabase
-- Auth. Reads role/full_name from the sign-up metadata.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student'),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- is_teacher(uid): true when the given user has the teacher role. Used by RLS
-- policies in later migrations. SECURITY DEFINER so it can read profiles
-- regardless of the caller's own RLS visibility.
-- ---------------------------------------------------------------------------
create or replace function public.is_teacher(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'teacher'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.teacher_profiles enable row level security;

-- Profiles are public-read (author names, tutor cards). See architecture.md §6
-- caveat re: isolating `phone` before launch.
create policy "profiles are readable by everyone"
  on public.profiles for select using (true);

create policy "users update their own profile"
  on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- Insert is normally done by the trigger; allow self-insert as a fallback.
create policy "users insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "teacher profiles are readable by everyone"
  on public.teacher_profiles for select using (true);

create policy "teachers manage their own teacher profile"
  on public.teacher_profiles for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
