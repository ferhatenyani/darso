-- 0004_catalog.sql
-- Catalog: courses and their scheduled sessions.

-- ---------------------------------------------------------------------------
-- courses — a teacher's listing (1:1, cohort, event, or on-demand).
-- ---------------------------------------------------------------------------
create table public.courses (
  id               uuid primary key default gen_random_uuid(),
  teacher_id       uuid not null references public.profiles(id) on delete cascade,
  slug             text not null unique,
  format           text not null
                     constraint courses_format_check check (format in ('1to1','cohort','event','ondemand')),
  level            text not null default 'any'
                     constraint courses_level_check check (level in ('beginner','intermediate','advanced','any')),
  status           text not null default 'draft'
                     constraint courses_status_check check (status in ('draft','published','archived')),
  category         text references public.categories(key),
  subject          text,
  title            text not null,
  subtitle         text,
  description      text,
  price_dzd        integer not null default 0
                     constraint courses_price_check check (price_dzd >= 0),
  content_language text not null default 'fr'
                     constraint courses_lang_check check (content_language in ('fr','ar','en')),
  cover_url        text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index courses_teacher_idx  on public.courses (teacher_id);
create index courses_category_idx on public.courses (category);
create index courses_status_idx   on public.courses (status);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- course_sessions — scheduled instances. Seats taken are derived from bookings.
-- ---------------------------------------------------------------------------
create table public.course_sessions (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses(id) on delete cascade,
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  capacity   integer constraint sessions_capacity_check check (capacity is null or capacity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_time_order check (ends_at is null or ends_at >= starts_at)
);

create index course_sessions_course_idx on public.course_sessions (course_id);
create index course_sessions_start_idx  on public.course_sessions (starts_at);

create trigger course_sessions_set_updated_at
  before update on public.course_sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.courses         enable row level security;
alter table public.course_sessions enable row level security;

-- Anyone can read published courses; the owner sees all of their own.
create policy "published courses are public"
  on public.courses for select
  using (status = 'published' or auth.uid() = teacher_id);

create policy "teachers manage their own courses"
  on public.courses for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- Sessions inherit visibility from their course.
create policy "sessions of visible courses are readable"
  on public.course_sessions for select
  using (exists (
    select 1 from public.courses c
    where c.id = course_id
      and (c.status = 'published' or c.teacher_id = auth.uid())
  ));

create policy "teachers manage their own course sessions"
  on public.course_sessions for all
  using (exists (
    select 1 from public.courses c
    where c.id = course_id and c.teacher_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.courses c
    where c.id = course_id and c.teacher_id = auth.uid()
  ));
