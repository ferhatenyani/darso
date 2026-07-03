# darso — Backend Architecture

> Living document. Updated as the backend evolves. Describes the Supabase
> (Postgres + Auth + Storage) data model that backs the darso web app.

darso is a two-sided tutoring marketplace for Algeria: **learners** discover and
book teachers, courses and live events; **teachers** publish listings, receive
bookings, get reviewed, and are paid out in DZD. A reverse marketplace lets
learners post **requests** that teachers apply to. The UI is bilingual (fr / ar,
RTL-aware) and organised around Algeria's wilayas (provinces).

---

## 1. Design principles

1. **Only build what is stable.** This schema covers entities that are certain
   to remain. Speculative or in-flux features are intentionally left out and
   listed in §7 (Deferred). Adding columns/tables later is cheap; removing
   shipped ones that carry data is not — so we under-build on purpose.

2. **User-generated content is single-language.** The mock layer stores every
   string as `{ fr, ar }` because the demo copy is professionally translated.
   Real users author in *their own* language, once. So course titles, request
   bodies, messages, reviews, etc. are **plain `text`** plus an optional
   `content_language` marker — not dual `_fr/_ar` columns. Only the fixed
   **taxonomy** (categories, wilayas) is bilingual, and it lives in reference
   tables (§3) that mirror the frontend i18n keys.

3. **Status/type fields use `text` + named `CHECK` constraints**, not enums.
   Check constraints are trivial to drop and re-add as the product's vocabulary
   shifts; enum value removal is painful. The one structural role field
   (`profiles.role`) is the same pattern for consistency.

4. **RLS on by default.** Every table has Row Level Security enabled with
   explicit policies. Nothing is readable or writable unless a policy allows it.

5. **`auth.users` is the identity root.** Application data hangs off a
   `public.profiles` row that is created automatically on sign-up. We never
   duplicate auth state.

6. **Money is integer DZD.** All amounts are `integer` Algerian dinars
   (`*_dzd`). No sub-unit; DZD is quoted in whole dinars in the UI.

---

## 2. Conventions

- **Primary keys**: `uuid` via `gen_random_uuid()`, except reference tables
  which use their natural stable `code`/`key` text PK.
- **Timestamps**: `timestamptz`; `created_at` + `updated_at` on mutable tables.
  `updated_at` is maintained by the shared `set_updated_at()` trigger.
- **Naming**: snake_case, plural table names, `*_id` foreign keys, `*_dzd`
  money, `*_at` timestamps, boolean flags read as assertions (`is_verified`).
- **Deletes**: FKs cascade from the owning aggregate (e.g. deleting a course
  deletes its sessions) and `on delete cascade` from `auth.users` down through
  `profiles`.
- **Migrations** live in `supabase/migrations/`, numbered and ordered. Each file
  owns its tables *and* their RLS policies so a table is never live without a
  policy.

---

## 3. Reference data (seeded, read-only)

| Table        | PK     | Purpose                                                       |
|--------------|--------|--------------------------------------------------------------|
| `wilayas`    | `code` | Algeria's 58 provinces (official numbering). Bilingual names. FK target for location fields. |
| `categories` | `key`  | The 8 top-level subject families (school, languages, code, design, business, music, religion, exams). |

Both are seeded by migration and exposed **public read, no write**. The frontend
already keys off the same slugs (`src/lib/wilayas.ts`, `src/lib/mock/categories.ts`).

---

## 4. Core domain

### Identity
- **`profiles`** — 1:1 with `auth.users`. Holds `role` (`student` | `teacher`),
  `full_name`, `avatar_url`, `locale`, `wilaya`, `phone`. Auto-created on sign-up
  by the `handle_new_user()` trigger, reading `role`/`full_name` from the auth
  metadata.
- **`teacher_profiles`** — 1:1 with a teacher `profile`. The public tutor card:
  `slug`, `headline`, `bio`, `category`, `subjects text[]`, `hourly_rate_dzd`,
  `mode`, `languages text[]`, verification flags (`is_id_verified`,
  `is_contact_verified`), and denormalised `rating_avg` / `rating_count` /
  `lessons_count` kept current by trigger.

### Catalog
- **`courses`** — a teacher's listing. `format` (`1to1`|`cohort`|`event`|
  `ondemand`), `level`, `status` (`draft`|`published`|`archived`), `category`,
  `subject`, `title`, `subtitle`, `description`, `price_dzd`, `content_language`.
- **`course_sessions`** — scheduled instances of a course: `starts_at`,
  `ends_at`, `capacity`. Seats taken are derived by counting bookings (not
  stored). 1:1 and on-demand courses may have zero sessions.

### Transactions
- **`bookings`** — a learner reserves a course/session (or a 1:1 slot).
  `student_id`, `teacher_id`, `course_id?`, `session_id?`, `kind`, `price_dzd`,
  `status` (`pending`|`confirmed`|`cancelled`|`completed`), `starts_at`.
- **`reviews`** — a learner rates a teacher, optionally tied to a `booking`.
  `rating` (1–5), `body`, plus a single `reply` / `replied_at` from the teacher.
  Recomputes `teacher_profiles` rating aggregates on write.
- **`favorites`** — a user bookmarks a `teacher` or `course`
  (`target_type` + `target_id`), unique per user/target.

### Reverse marketplace
- **`learning_requests`** — a learner posts a need: `title`, `body`, `category`,
  `subject`, `level`, `audience`, `budget_min_dzd`/`budget_max_dzd`, `mode`,
  `wilaya`, `status` (`open`|`negotiating`|`awarded`|`closed`), `urgency`,
  `is_anonymous`, `deadline_label`.
- **`request_applications`** — a teacher applies once per request: `message`,
  `proposed_rate_dzd`, `availability_note`, `is_awarded`.

### Messaging
- **`conversations`** — a thread (`kind`, optional `course_id`).
- **`conversation_participants`** — membership + `last_read_at` for unread counts.
- **`messages`** — `sender_id`, `body`, `created_at`. (Reactions & attachments
  are deferred — §7.)

### Payouts
- **`payout_methods`** — a teacher's bank destination: `bank_code`,
  `account_holder`, `rib` (20 digits), `bic?`, `is_verified`.
- **`payouts`** — a disbursement record: `reference`, `amount_dzd`, `status`
  (`pending`|`paid`|`failed`), `period_label`, `paid_at?`.

### System
- **`notifications`** — per-user feed: `type`, `title`, `body`, `href`, `is_read`.

---

## 5. Storage buckets

| Bucket                | Access  | Holds                                             |
|-----------------------|---------|---------------------------------------------------|
| `avatars`             | public  | Profile & teacher avatar images.                  |
| `covers`              | public  | Teacher profile cover images.                     |
| `course-media`        | public  | Course/event cover art.                           |
| `verifications`       | private | Diplomas & ID documents (owner + admin only).     |
| `attachments`         | private | Message / dispute attachments (participants only). |

Path convention: `{user_id}/{filename}`. Write policies key off the first path
segment matching `auth.uid()`.

---

## 6. Security model (RLS)

- **Reference tables** — public read only.
- **`profiles` / `teacher_profiles`** — public read (needed to render tutor
  cards and author names); each user writes only their own row.
- **`courses` / `course_sessions`** — public read when the course is
  `published`; the owning teacher reads & writes all of their own.
- **`bookings`** — visible to the booking student and the course's teacher;
  created by the student.
- **`reviews`** — public read; written by the author; the reviewed teacher may
  edit only the `reply`.
- **`learning_requests`** — public read (open marketplace); owner writes.
- **`request_applications`** — visible to the request owner and the applicant.
- **`conversations` / `messages`** — participants only.
- **`favorites` / `payout_methods` / `payouts` / `notifications`** — owner only.

> Caveat: `profiles` is currently fully public-read for simplicity. `phone` is
> sensitive; before launch, move contact fields behind a restricted view or a
> separate `profiles_private` table. Tracked in §7.

---

## 7. Deferred — intentionally NOT in the schema yet

These exist in the mock/UI layer but are too in-flux to model. Revisit when the
product decisions settle.

- **Disputes / mediation** — full subsystem (`src/lib/mock/disputes.ts`); states
  and mediation flow not finalised.
- **Agencies / studios** — being removed from the app ("the agency rip",
  `src/lib/routes.ts`). Do not build until direction is confirmed.
- **Subscription tiers & commission config** — the tiered take-rate
  (`subscription-simulator.tsx`) is a business-model detail still moving.
- **Payment ledger / transactions** — depends on the (unchosen) DZD PSP
  (Edahabia / CIB / BaridiMob). `bookings.status` is the interim source of truth.
- **Analytics tables** — all figures are derivable from bookings/reviews; no
  storage until aggregation cost demands it.
- **Calendar availability slots** — teacher availability shape undecided.
- **Live-call rooms / tokens** — video provider not selected.
- **Message reactions & attachments** — payload shapes not settled.
- **Structured course content** (syllabus / outcomes / includes) — rich nested
  shape still evolving; add as a `jsonb` column or child table when stable.
- **`profiles_private`** — contact-field isolation (see §6 caveat).

---

## 8. Migration index

| File | Contents |
|------|----------|
| `0001_extensions_and_helpers.sql` | Extensions, `set_updated_at()`, helper fns. |
| `0002_reference.sql`              | `wilayas`, `categories` (+ seed). |
| `0003_profiles.sql`               | `profiles`, `teacher_profiles`, sign-up trigger, rating trigger. |
| `0004_catalog.sql`                | `courses`, `course_sessions`. |
| `0005_bookings_reviews.sql`       | `bookings`, `reviews`, `favorites`. |
| `0006_requests.sql`               | `learning_requests`, `request_applications`. |
| `0007_messaging.sql`              | `conversations`, `conversation_participants`, `messages`. |
| `0008_payouts.sql`                | `payout_methods`, `payouts`. |
| `0009_notifications.sql`          | `notifications`. |
| `0010_storage.sql`                | Storage buckets + object policies. |
