-- 0006_requests.sql
-- Reverse marketplace: learning requests and teacher applications.

-- ---------------------------------------------------------------------------
-- learning_requests — a learner posts a need for teachers to apply to.
-- ---------------------------------------------------------------------------
create table public.learning_requests (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid not null references public.profiles(id) on delete cascade,
  slug             text not null unique,
  title            text not null,
  body             text,
  category         text references public.categories(key),
  subject          text,
  level            text,
  audience         text
                     constraint requests_audience_check check (audience is null or audience in ('kids','lycee','students','adults')),
  budget_min_dzd   integer constraint requests_budget_min_check check (budget_min_dzd is null or budget_min_dzd >= 0),
  budget_max_dzd   integer constraint requests_budget_max_check check (budget_max_dzd is null or budget_max_dzd >= 0),
  mode             text not null default 'both'
                     constraint requests_mode_check check (mode in ('online','in-person','both')),
  wilaya           text references public.wilayas(code),
  status           text not null default 'open'
                     constraint requests_status_check check (status in ('open','negotiating','awarded','closed')),
  urgency          text not null default 'med'
                     constraint requests_urgency_check check (urgency in ('low','med','high')),
  is_anonymous     boolean not null default false,
  deadline_label   text,
  content_language text not null default 'fr'
                     constraint requests_lang_check check (content_language in ('fr','ar','en')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint requests_budget_order check (
    budget_min_dzd is null or budget_max_dzd is null or budget_max_dzd >= budget_min_dzd
  )
);

create index requests_student_idx  on public.learning_requests (student_id);
create index requests_category_idx on public.learning_requests (category);
create index requests_status_idx   on public.learning_requests (status);

create trigger learning_requests_set_updated_at
  before update on public.learning_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- request_applications — a teacher applies once per request.
-- ---------------------------------------------------------------------------
create table public.request_applications (
  id                uuid primary key default gen_random_uuid(),
  request_id        uuid not null references public.learning_requests(id) on delete cascade,
  teacher_id        uuid not null references public.profiles(id) on delete cascade,
  message           text,
  proposed_rate_dzd integer constraint applications_rate_check check (proposed_rate_dzd is null or proposed_rate_dzd >= 0),
  availability_note text,
  is_awarded        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (request_id, teacher_id)
);

create index applications_request_idx on public.request_applications (request_id);
create index applications_teacher_idx on public.request_applications (teacher_id);

create trigger request_applications_set_updated_at
  before update on public.request_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.learning_requests    enable row level security;
alter table public.request_applications enable row level security;

-- Requests are a public marketplace; the owner manages their own.
create policy "learning requests are public"
  on public.learning_requests for select using (true);

create policy "students manage their own requests"
  on public.learning_requests for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- Applications: visible to the request owner and the applicant teacher.
create policy "request owner and applicant can read applications"
  on public.request_applications for select
  using (
    auth.uid() = teacher_id
    or exists (
      select 1 from public.learning_requests lr
      where lr.id = request_id and lr.student_id = auth.uid()
    )
  );

create policy "teachers create their own applications"
  on public.request_applications for insert
  with check (auth.uid() = teacher_id and public.is_teacher(auth.uid()));

create policy "teachers update their own applications"
  on public.request_applications for update
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- The request owner may update applications (e.g. mark one awarded).
create policy "request owner can update applications"
  on public.request_applications for update
  using (exists (
    select 1 from public.learning_requests lr
    where lr.id = request_id and lr.student_id = auth.uid()
  ));

create policy "teachers delete their own applications"
  on public.request_applications for delete using (auth.uid() = teacher_id);
