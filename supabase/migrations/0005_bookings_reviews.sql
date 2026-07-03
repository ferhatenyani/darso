-- 0005_bookings_reviews.sql
-- Transactions: bookings, reviews (with rating rollup), favorites.

-- ---------------------------------------------------------------------------
-- bookings — a learner reserves a course/session or a 1:1 slot.
-- ---------------------------------------------------------------------------
create table public.bookings (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  teacher_id  uuid not null references public.profiles(id) on delete cascade,
  course_id   uuid references public.courses(id) on delete set null,
  session_id  uuid references public.course_sessions(id) on delete set null,
  kind        text not null
                constraint bookings_kind_check check (kind in ('1to1','course','event','live')),
  price_dzd   integer not null default 0
                constraint bookings_price_check check (price_dzd >= 0),
  status      text not null default 'pending'
                constraint bookings_status_check check (status in ('pending','confirmed','cancelled','completed')),
  starts_at   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index bookings_student_idx on public.bookings (student_id);
create index bookings_teacher_idx on public.bookings (teacher_id);
create index bookings_course_idx  on public.bookings (course_id);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- reviews — a learner rates a teacher, optionally tied to a booking.
-- ---------------------------------------------------------------------------
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.profiles(id) on delete cascade,
  student_id  uuid not null references public.profiles(id) on delete cascade,
  booking_id  uuid unique references public.bookings(id) on delete set null,
  rating      smallint not null constraint reviews_rating_check check (rating between 1 and 5),
  body        text,
  subject_tag text,
  reply       text,
  replied_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index reviews_teacher_idx on public.reviews (teacher_id);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- Keep teacher_profiles.rating_avg / rating_count in sync with reviews.
create or replace function public.refresh_teacher_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.teacher_id, old.teacher_id);
begin
  update public.teacher_profiles tp
  set rating_avg = coalesce((
        select round(avg(r.rating)::numeric, 2) from public.reviews r where r.teacher_id = target
      ), 0),
      rating_count = (
        select count(*) from public.reviews r where r.teacher_id = target
      )
  where tp.profile_id = target;
  return null;
end;
$$;

create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_teacher_rating();

-- ---------------------------------------------------------------------------
-- favorites — bookmark a teacher or course.
-- ---------------------------------------------------------------------------
create table public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  target_type text not null constraint favorites_type_check check (target_type in ('teacher','course')),
  target_id   uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index favorites_user_idx on public.favorites (user_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.bookings  enable row level security;
alter table public.reviews   enable row level security;
alter table public.favorites enable row level security;

-- Bookings: the student and the teacher on the booking can see it.
create policy "booking parties can read"
  on public.bookings for select
  using (auth.uid() = student_id or auth.uid() = teacher_id);

create policy "students create their own bookings"
  on public.bookings for insert with check (auth.uid() = student_id);

create policy "booking parties can update"
  on public.bookings for update
  using (auth.uid() = student_id or auth.uid() = teacher_id);

-- Reviews: public read; author writes; reviewed teacher may edit (reply).
create policy "reviews are public"
  on public.reviews for select using (true);

create policy "students write their own reviews"
  on public.reviews for insert with check (auth.uid() = student_id);

create policy "author or reviewed teacher can update"
  on public.reviews for update
  using (auth.uid() = student_id or auth.uid() = teacher_id);

create policy "authors delete their own reviews"
  on public.reviews for delete using (auth.uid() = student_id);

-- Favorites: strictly owner-scoped.
create policy "users manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
