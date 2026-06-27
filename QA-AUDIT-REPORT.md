# Darso — QA Audit Report

> **🔄 RESUME WORK:** A multi-batch fix sweep is in progress. Read the [Progress Log](#progress-log) below before doing anything else — it has the batching plan, locked-in defaults, what's done, and exactly where to pick up.

**Date:** 2026-06-27
**Scope:** Full app surface (40 routes, all components, marketing + student + teacher + agency surfaces, responsiveness mobile/tablet/desktop).
**Method:** Five parallel agents — (1) structural / dead-end, (2) responsiveness, (3) student flow, (4) teacher flow, (5) agency flow — followed by deduplication.

---

## Progress Log

_Last updated: 2026-06-27 — Phase 1 (Batches 1-6) complete. **Phase 2 pending**: Batches 7-14 still to do. Pick up from "Phase 2 — Frontend Completion Pass"._

### The 6-batch plan

Sub-agents are spawned in parallel within each batch wherever the work is on disjoint files. Each agent must **verify the audit claim against current code before editing** — audit is dated 2026-06-27 and some items may have been resolved by earlier batches.

1. **Batch 1 — Mechanical sweep** (5 parallel sub-agents A/B/C/D/E): responsiveness primitives, slug mismatches, copy bugs, missing-route stubs, marketing/nav alignment.
2. **Batch 2 — Mock auth foundation** (1 sequential agent): mock auth context + cookie + middleware, single `currentUser` store replacing every hard-coded "Lina"/"Khalil", role-gated route guards, demo-account picker wired, sign-in/sign-up functional, `/teach` split into public marketing + role-gated dashboard, authenticated SiteHeader with avatar + sign-out.
3. **Batch 3 — Behavior-layer sweep** (4 parallel sub-agents): every save/submit/publish/cancel/accept/reject becomes a local-mock mutation + toast. Split by shell: (a) account-shell, (b) teacher dashboards, (c) requests, (d) dialogs + disputes + calendar block-form + chat.
4. **Batch 4 — Booking funnel** (1-2 sequential): teacher profile CTAs + availability cells, course/event Reserve, Live "Join now", mock checkout + confirmation, writeback to `/calendar` + `/account` payments.
5. **Batch 5 — Wizards + lifecycle** (4 parallel): course wizard Publish + edit page rebuild; request wizard Publish + lifecycle (close/reopen/edit/delete/share); dispute open flow; calendar role-branching.
6. **Batch 6 — Agency rip + POLISH sweep**: execute the agency-rip default; sweep all POLISH items from the audit.

### Locked-in defaults (do not re-ask the user on these)

1. **Auth**: mock-only (cookie + React context). No NextAuth/Clerk install.
2. **Persistence**: in-memory module state + toast feedback. No localStorage/SQLite. Mutations survive in-session, reset on refresh.
3. **Agency**: **RIP** the misleading surface — remove `demo-agency` button, remove "Agency" subscription tier, fold `/teach/agency` into a teacher-side "Studio members" tab visible only if the teacher has `parentAgencyId`. Drop footer "Agency" link. Keep `AgencyMember` type for future. No public `/agencies/[slug]`, no agency dashboard, no payouts.
4. **Subscription model**: keep the **progressive revenue tier**, rip the three Starter/Pro/Agency plans.
5. **Missing routes**: stub with `<ComingSoon />` shell page (title + breadcrumb + "we're building this"). Keep nav links intact.
6. **Calendar**: branch existing `/calendar` on role (one route, two shells), not split into two URLs.
7. **Demo identity**: fully role-aware. Each demo button → correct shell + currentUser. Hard-coded "Lina"/"Khalil" goes away.

### Stack reminders

- Next.js 16.2.9, React 19, Tailwind v4, Radix primitives, shadcn-style components, `next-intl` for i18n (FR/AR).
- `CLAUDE.md`/`AGENTS.md` warns "this is NOT the Next.js you know" — consult `node_modules/next/dist/docs/` before writing code that depends on framework specifics (params shape, layout interactions, etc.).
- Permissions config at `.claude/settings.local.json` should allow autonomous file edits, npm/npx/git (read + non-destructive write), and sub-agent spawning. If permission prompts still appear, paste the prompt text and diagnose before continuing.



### Batch 14 — PENDING

**Backend-readiness scaffolding.** Single sequential agent.

1. **`// TODO(backend)` markers**: on every mock store at [src/lib/mock/*-state.ts](src/lib/mock/) add a top-of-file comment block explaining: what shape the backend should return, which endpoint(s) map to which exports, what the cache invalidation contract is. Format consistent across all stores. This makes the backend wiring a grep-and-replace per store, not a hunt.
2. **Type-safe `routes.ts`**: new [src/lib/routes.ts](src/lib/routes.ts) exporting helpers like `routes.teacher(slug)`, `routes.course(slug)`, `routes.request(id)`, `routes.disputeDetail(id)`, etc. Refactor existing string-literal `/teachers/${slug}` etc. across the codebase to use the helpers. Reduces broken-link risk during future refactors.
3. **Error boundary**: add [src/app/[locale]/error.tsx](src/app/[locale]/error.tsx) (Next.js 16 convention) — friendly error page with "Try again" button + link home. Plus a global [src/app/[locale]/not-found.tsx](src/app/[locale]/not-found.tsx) if missing.
4. **Sign-in / sign-up form polish**: password strength meter component, show/hide password toggle, inline email format validation, social-auth visual placeholder buttons (Google + Apple — non-functional, just visual). Apply impeccable: don't make these look like the standard shadcn auth template.

Final: `npx tsc --noEmit` + `npx next build` clean. After Batch 14 lands, Phase 2 is closed.

---

### Maintenance rule

After each agent or batch completes, append a short summary to this Progress Log (what was done, what was deferred, typecheck status). The Progress Log is the durable handoff — if a chat session ends mid-work, the next chat reads this file and resumes from "PENDING — RESUME HERE" (currently **Batch 10 in Phase 2**).

---

## Overall State

Darso is a polished visual mockup with very little behind the visuals. The information architecture, type system, copy, i18n (FR/AR), Tailwind v4 design tokens, and component library all look production-ready. **The behavior layer is almost entirely missing.**

Two systemic problems explain ~80% of every flagged issue:

1. **No authentication and no role concept.** Every "protected" route is publicly reachable. The "signed-in user" is hard-coded as the teacher `t-khalil` for `/teach/*`, the student `Lina M.` for `/account` and `/disputes`, and `currentUser = u-self` ("Lina") for `/messages`. Sign-in / sign-up forms `setTimeout` then `router.push` — no session, no validation, no error handling. Logout buttons exist but are inert. The `RoleToggle` component is never rendered. Demo accounts carry a `role` field on disk that nothing reads.
2. **No data layer.** Every list/detail is rendered from `src/lib/mock/*` (13 files). There is no POST/PATCH/DELETE anywhere in the codebase. Every form discards its input. The course wizard, profile editor, request publisher, dispute mediator, agency invite, subscription select, cancel-subscription, change-password, delete-account, save-preferences and "Save split" all submit to nothing.

On top of those, the **agency role** barely exists as a feature — it's a single teacher-flavored "studio owner" page (`/teach/agency`), a `demo-agency` button that lands in student onboarding, a 15% commission tier, and one footer link. There is no agency identity, no public agency surface, no `/agencies/[slug]`, no agency-aware billing, no payouts, no agency-routed inbox/disputes, no member roles/permissions, no invite acceptance flow.

The user's instinct in the brief is correct: **landing the user straight into the app with no sign-up or role gate is the root cause of most disorientation.** The same UI carries student, teacher and agency assumptions simultaneously, none of them tagged or guarded.

---

## Top 10 Issues to Fix First

1. **Add real (or even mock-session) auth + role gating.** Without it, every other fix is cosmetic. Gate `/account`, `/teach/*`, `/messages`, `/calendar`, `/requests/my`, `/disputes`, `/notifications`. Make `SiteHeader` render an authenticated user menu and a working sign-out. Have the demo-account picker actually set a role-tagged session (student → `/account`, teacher → `/teach`, agency → an agency dashboard).
2. **Split `/teach` into a public marketing page and a role-gated dashboard.** Today, "Become a teacher" drops anonymous visitors directly into `t-khalil`'s populated dashboard with mock revenue and member splits — visible PII and confusing context.
3. **Wire the booking funnel.** `teacher-profile.tsx` (Book 1-to-1, Apply to course, Message, every availability cell), `course-detail.tsx` (Reserve), `event-detail.tsx` (Reserve spot) — all dead. There is no checkout, no confirmation, no entry on `/calendar` or `/account` payments. This is the single most important verb on the platform.
4. **Fix the slug mismatches that produce 404s from the home page.** Live session IDs (`s-live-math`, …) → `/courses/${id}` 404. Chat info-panel courseLinks (`math-bac`, `ielts-7`, `ielts-workshop`) → 404. DiscoverMenu / categories-grid query keys (`?category`, `?audience`, `mode=1to1`) don't match what `BrowseClient` reads. Notifications mock has `/billing`, `/account/reviews`, `/account/verify` (all 404). Dashboard action-items target `/teach/courses/c-trigo`, `c-bac-prep`, etc. — none exist.
5. **Build the missing routes referenced from header/footer/nav.** `/forgot`, `/how-it-works`, `/about`, `/press`, `/careers`, `/blog`, `/help`, `/trust`, `/contact`, `/legal/{terms,privacy,cookies}`, `/teach/pricing`, `/teach/resources`, `/teach/events/new`, `/teach/events/[id]`. Either stub them or remove the links.
6. **Implement the course edit page.** `/teach/courses/[id]` currently renders a literal placeholder paragraph ("Édition du panneau « X »… identiques au wizard"). No fields, no save, no delete. Reuse `CourseWizard` step contents as editable forms.
7. **Wire the course wizard's Publish step.** After 5 steps the "Publish" / "Publish later" buttons discard everything. Same for the request wizard, which hard-codes a push to `/requests/math-bac-revision-intensive` regardless of input.
8. **Fix the calendar week view on mobile.** `src/components/app/calendar/week-view.tsx` uses `grid-cols-[68px_repeat(7,minmax(0,1fr))]` with no horizontal scroll — day columns become ~40px on a 360px viewport, events unreadable. Wrap in `<ScrollArea>` with `min-w-[640px]` (mirror of `AvailabilityGrid` in `teacher-profile.tsx`).
9. **Cap modal dialog height.** `src/components/ui/dialog.tsx` `DialogContent` has no `max-h` / `overflow-y-auto`. Long-form dialogs (mediation, password change, agency invite, accept-request) clip on short viewports. Add `max-h-[calc(100dvh-2rem)] overflow-y-auto`.
10. **Decide what the agency role actually is.** Either build it (agency onboarding, `/agencies/[slug]` public profile, member roles, payouts, agency-aware invoicing, request routing, agency-tagged threads) or drop it from the demo until later. Right now the agency tier and `/teach/agency` page mislead users into thinking the feature exists.

---

## Findings by Severity

Below, every finding is deduplicated across the five audits. Format:

> **Where** · what's wrong → expected · roles affected

### BLOCKERS

#### Auth, role and identity

- **All `src/app/[locale]/(auth)/*` + `proxy.ts`** · No middleware/guard anywhere; sign-in/sign-up are `setTimeout` → `router.push`. Demo accounts carry a `role` field that's never read — every demo button lands on `/account` (student shell) regardless of role. → Real auth that sets a role-tagged session; route guards on `/account`, `/teach/*`, `/messages`, `/calendar`, `/requests/my`, `/disputes`, `/notifications`. · All roles.
- **`src/components/nav/site-header.tsx:62-68`** · Header always shows "Sign in / Sign up" even on protected pages. No user menu, no avatar, no sign-out anywhere in chrome. → Authenticated header with avatar dropdown. · All.
- **`src/components/student/account-shell.tsx:123-128`, `teacher/sidebar.tsx:186-192`, `teacher/mobile-bar.tsx:117-123`** · "Logout" buttons have no `onClick` and no `href` (the account-shell one is even labelled "Back"). → Working sign-out. · All.
- **`src/app/[locale]/teach/layout.tsx`** · Entire teacher dashboard publicly reachable. "Become a teacher" link drops anonymous visitors onto t-khalil's populated dashboard with revenue figures. → Marketing landing at `/teach`, dashboard moves behind auth. · Teacher / Student.
- **`src/components/student/sign-up-form.tsx:35-41, 86-100`** · `role` radio limited to `learn | teach` (no agency); both routes go to `/account/onboarding` which is exclusively student-shaped. → Role-aware routing; agency option in radio. · All.
- **`src/lib/mock/chats.ts:67-72`** · `currentUser = { id: "u-self", name: "Lina M." }` hard-coded — every outbound message stamps the viewer as student "Lina", even when arriving from the teacher dashboard. → Identity from session. · All.

#### Booking funnel (student → teacher conversion is 0%)

- **`src/components/student/teacher-profile.tsx:138-145, 192-198, 334-343`** · "Book 1-to-1", "Apply to course", "Send a message" CTAs (hero + side rail + sticky rail) have no handler / no href. · Student.
- **`src/components/student/teacher-profile.tsx:411-462`** · `AvailabilityGrid` cells render as `<button>` but free slots have no `onClick`. · Student.
- **`src/components/student/course-detail.tsx:187-190, 385-388`** · "Reserve" and "Ask a question" CTAs have no handler. · Student.
- **`src/components/student/event-detail.tsx:90-93, 160-163`** · "Reserve spot" CTA dead on hero and side rail. · Student.
- **`src/components/marketing/live-panel.tsx:45`, `src/components/student/live-page.tsx:124-129`** · "Join now" / "Reserve" links build `/courses/${session.id}` from `s-live-*` IDs that `courseBySlug` never matches → every link 404s. · All (Live is a hero feature).

#### Missing or stub pages

- **`src/app/[locale]/teach/courses/[id]/page.tsx:60-94`** · Edit page tabs render only the sentence "Édition du panneau « X ». Les champs sont identiques au wizard de création." Zero functional fields. → Reuse `CourseWizard` step contents as editable forms. · Teacher.
- **`/teach/events/new`** · Linked from `teach/events/page.tsx:26` but route does not exist (404). · Teacher.
- **`/teach/events/[id]`** · Edit buttons in events list have no destination route. · Teacher.
- **`/teach/applications`** · Permanent empty state ("Voir les demandes ouvertes") with a CTA dumping the teacher into the student `/requests` shell. No application data, no flow. · Teacher.
- **`/teach/ondemand`** · "Coming soon" empty state. "Créer une série" button has no handler. Overlaps with the course wizard's `ondemand` format option, creating confusion. · Teacher.
- **`/agencies` and `/agencies/[slug]`** · Do not exist. There is no public agency profile anywhere. · Agency.
- **`/teach/payouts` (or any payouts surface)** · Does not exist. No RIB management, no payout schedule, no per-teacher payout history. Agency revenue-split slider is purely cosmetic. · Teacher / Agency.
- **`/teach/agency/analytics`, `/teach/analytics`** · Do not exist. No conversion, retention, refund-rate, no-show analytics anywhere. · Teacher / Agency.
- **No agency onboarding** · `/account/onboarding` is student-shaped only. No `/teach/onboarding` for teacher KYC or `/onboarding/agency` for legal entity setup. · Teacher / Agency.
- **No invite acceptance flow** · `/teach/invites/[token]` does not exist; the agency invite dialog sends to nothing. · Agency.

#### Course wizard / request wizard / request lifecycle

- **`src/components/teacher/course-wizard.tsx:325-339`** · Final "Publish" / "Publish later" buttons have no handler — 5 steps of input are discarded. · Teacher.
- **`src/components/requests/wizard-client.tsx:135-138`** · "Publish" hard-codes `router.push("/requests/math-bac-revision-intensive")`. User's draft is completely discarded; they land on someone else's request. The new request never appears in `/requests/my` (filters on `ownedByCurrentUser` on fixed mock data). · Student.
- **`src/app/[locale]/disputes/disputes-shell.tsx`** · No way for a student (or anyone) to open a dispute. No "Open a dispute" CTA. → Add "Start a dispute" + per-session "Report a problem". · Student.

#### Calendar mis-scoped for students; mobile week view unreadable

- **`src/app/[locale]/calendar/page.tsx` + `calendar-shell.tsx`** · Whole calendar is teacher-shaped ("Block time" sheet, "Block time" form on the right rail). Linked from student nav and rendered with `SiteHeader`/`SiteFooter`. Makes no sense for a student perspective. → Either branch on role or build a student-flavored `/calendar`. · Student.
- **`src/components/app/calendar/week-view.tsx:84,121`** · `grid-cols-[68px_repeat(7,minmax(0,1fr))]` never collapses; at 360px viewport each day column is ~40px and events become unreadable. → Wrap inner grid in `<ScrollArea>` with `min-w-[640px]`. · Teacher (and students, mobile).

#### Subscription model contradiction; payouts entirely missing

- **`src/app/[locale]/teach/subscription/page.tsx:34-139`** · Page presents two incompatible pricing models: progressive revenue tier ("no fixed subscription") and three selectable plans (Starter/Pro/Agency) on the same page. → Pick one. · Teacher / Agency.
- **No agency-aware billing logic** · "Agence" is just a row in the per-teacher tier table; nothing aggregates revenue across an agency's members. · Agency.

#### Agency data model is missing

- **`src/lib/mock/teachers.ts:5-26`** · `Teacher` type has no `parentAgencyId`. No way to associate a teacher to Studio Numidia. · Agency.
- **`src/lib/mock/agency.ts:1-23`** · One global mock agency, no `Agency` type exported, no slug catalog. Designed for one agency, not many. · Agency.
- **`src/lib/mock/agency.ts:1-10`** · `AgencyMember` is a different shape from `Teacher` (lacks slug, rating, headline, hourlyRate, idVerified) — members cannot be linked back to discoverable teacher profiles. · Agency.

---

### MAJOR

#### Dead buttons (no `onClick`, no `href`) — by surface

Account shell — `src/components/student/account-shell.tsx`:
- L389-391 "+ Add payment method" · L421-425 per-row "Download invoice" · L488-489 dialog Cancel/Submit on Change password · L523-528 "Revoke session" / "Revoke all sessions" · L567-572 Delete dialog Cancel/Confirm · L319-321 Preferences "Save" · L122-128 mislabelled "Sign out".

Request detail — `src/components/requests/detail-client.tsx`:
- L448-451 per-application "Message" · L646-664 owner rail "Edit" (re-links to same detail page), "Close request", "Reopen request" · L294 accept dialog footer.

My requests — `src/components/requests/my-client.tsx:265-289`:
- Edit / Share / Reopen / Close / Delete dropdown items.

Teacher profile / courses / events:
- `teach/profile/page.tsx:27` "Save" · `teacher/profile-form.tsx:373-376` "Verify diploma" · `profile-form.tsx:274-278` subject-tag remove (×).
- `teacher/courses-view.tsx:188-213` Edit / Duplicate / Publish / Archive / Unarchive dropdown items.
- `teach/events/page.tsx:77-82` per-event "Modifier" + kebab.
- `teach/ondemand/page.tsx:26-29` "Create a series".
- `teacher/course-wizard.tsx:284-289` Schedule editor stubbed ("Aperçu du planning généré dès que tu fixes les créneaux").

Reviews, agency, subscription:
- `teacher/reviews-list.tsx:113-119` "Send reply" only closes the form; reply discarded.
- `teacher/agency-profile.tsx:32` "Save".
- `teacher/agency-members.tsx:115-117` "Save revenue split" · L182-195 row dropdown (View profile / Edit split / Remove) · L234-237 invite dialog Cancel/Send.
- `teach/subscription/page.tsx:133-135` plan "Select" · L171-173 per-invoice "Download" icon · L189 "Change payment method".
- `teacher/cancel-subscription.tsx:35-37` both Keep / Confirm-cancel buttons.

Calendar / disputes / messaging:
- `calendar/block-form.tsx:32-37` form submit only calls `preventDefault()`.
- Calendar event cells in `week-view.tsx` / `month-view.tsx` not clickable (no detail open).
- `disputes/[id]/dispute-detail.tsx:261-266, 292-295` mediation dialog Cancel/Submit + "Submit refund proposal".
- `app/chat/chat-thread.tsx:156-158` "Join video call" icon.
- `app/notifications/notification-row.tsx:152` "Mute notification type" dropdown item.
- `teach/page.tsx:204-213` dashboard Accept/Reject on pending request cards.
- `teacher/requests-tabs.tsx:88-98, 175-179` accept/reject dialog buttons; "View profile" links to static `/teachers/student` URL.

Sign-in: `src/components/student/sign-in-form.tsx:103` "Forgot password" → `/forgot` (404).

#### Broken navigation / 404 link destinations

- **Footer** `src/components/nav/site-footer.tsx:10-47` · 14 link destinations missing: `/how-it-works`, `/teach/pricing`, `/teach/resources`, `/about`, `/press`, `/careers`, `/blog`, `/help`, `/trust`, `/contact`, `/legal/terms`, `/legal/privacy`, `/legal/cookies`.
- **Mobile nav** `src/components/nav/mobile-nav.tsx:22` → `/how-it-works` (404).
- **Marketing CTA** `src/components/marketing/teacher-cta.tsx:62-63` "Discover pricing" → `/teach/pricing` (404).
- **Chat info panel** `src/lib/mock/chats.ts:83-85, 148, 250` · `courseLink.href` uses `math-bac` / `ielts-7` / `ielts-workshop` slugs that don't match real course slugs.
- **Notifications mock** `src/lib/mock/notifications.ts:71, 108, 119, 167` · `/billing`, `/account/reviews`, `/account/verify` all 404. Plus `n-10` represents "teacher reviewed student" which is conceptually inverted.
- **Dashboard action items** in `src/lib/mock/dashboard.ts` · `/teach/courses/c-trigo`, `c-bac-prep`, `c-analysis`, `c-geometry` not present in `courses.ts` (3 of 5 teacher courses 404 when previewed).
- **DiscoverMenu / Categories grid** `src/components/nav/discover-menu.tsx:25-34, 73-74, 99-102, 133` and `marketing/categories-grid.tsx:48,87` · Build URLs with `?category`, `?audience`, `mode=1to1|cohort|event|ondemand` — `BrowseClient` only reads `subject`, `wilaya`, `mode (online|in-person|both)`, `q`. All filters silently dropped.
- **Teach profile preview** `src/app/[locale]/teach/profile/page.tsx:22-26` · "Preview" link hard-coded `/teachers/khalil-bensaid` — desyncs if the name changes.
- **Teach home "Start live session"** `src/app/[locale]/teach/page.tsx:158-162` · Routes to `/teach/courses/c-math-bac` (edit page), not a live-room URL.
- **Inbox empty state** `src/app/[locale]/messages/inbox-shell.tsx:62-66` · "Find a teacher" → `/teachers`, but `teachers/[slug]` "Message" button is dead → cul-de-sac.

#### Identity / data leakage from hard-coded mocks

- **`src/components/student/account-shell.tsx:53-95, 173-181, 359-363`** · Header hard-codes "Lina M." / "Lina Mokhtar" / Constantine / phone `+213 555 11 22 33`; payment history and active sessions all fake constants. Edits on the form don't propagate to other surfaces.
- **`src/app/[locale]/disputes/[id]/dispute-detail.tsx:52-58, 107-117`** · Posted dispute messages stamp `authorId: "u-self"`, `authorName: "Lina M."`, `LM` avatar, regardless of viewer.
- **`src/lib/mock/dashboard.ts:3`** · `currentTeacher` is `t-khalil` everywhere — the teacher's sidebar shows "Khalil Bensaïd · Top Rated" for any visitor.

#### Page chrome inconsistency (teacher loses teacher shell)

- **`/messages`, `/messages/[threadId]`, `/disputes`, `/disputes/[id]`, `/notifications`, `/calendar`** all wrap in `SiteHeader`/`SiteFooter` (student/marketing shell). A teacher arriving from `TeacherSidebar` loses the dashboard chrome entirely. → Branch on role or add "Back to teacher dashboard" link.
- **`/messages` from anywhere** · No notifications bell anywhere in `TeacherTopBar`. Teachers running a business need payout / dispute alerts.

#### Workflow breakage

- **Live page** entire feature broken (slug mismatch); "Join now" doesn't enter a live room, only attempts an invalid course slug.
- **Favorites** `src/components/student/favorites-page.tsx:22-29` · `savedItems` hard-coded; heart toggles never persist. Empty state unreachable.
- **Onboarding** discards every selection on Finish and routes to `/browse`; a "teach" choice in step 1 still ends on `/browse`.
- **Account profile save** doesn't persist (student is local state; teacher is purely visual).
- **Subscription cancel** dialog opens but neither button does anything; dialog won't even close.
- **Calendar block-time** submit `preventDefault` only.

#### Responsiveness — Major

- **`src/components/ui/dialog.tsx:37`** · `DialogContent` has no `max-h` / `overflow-y-auto`. Long-form dialogs clip on short viewports. → Add `max-h-[calc(100dvh-2rem)] overflow-y-auto`. Affects accept/reject, mediation, change password, agency invite, cancel subscription.
- **`src/components/ui/tabs.tsx:16`** · Default `TabsList` is `inline-flex h-10` with no wrap/scroll. Pages with 4+ tabs overflow on narrow phones: `notifications-shell.tsx:70` (5 tabs), `teacher-profile.tsx:213` (4 tabs), `requests-tabs.tsx`, `browse-client.tsx:417`, `disputes-shell.tsx:54`. → Default to `flex-wrap` or `overflow-x-auto`.
- **`src/components/nav/site-footer.tsx:52`** · `md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]` cramps 5 columns into ~135px each at 768px tablet. → `md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]`.
- **`src/components/student/live-page.tsx:75`** · Session list `grid-cols-[80px_1fr_auto]` never collapses on mobile; title cell squeezed to ~110px at 360px viewport. → Stack below `sm` or shrink the time tile.

#### Agency-only majors (not duplicated above)

- **Agency dashboard scoping** · `/teach/agency` is the *teacher's* view of "their studio" ("Votre studio"), rendered inside the teacher shell with `currentTeacher` (Khalil) in the sidebar. There is no agency-admin shell separate from a teacher dashboard.
- **Members table** · `agency-members.tsx` has no row roles (admin/teacher/observer), no pending-invite list, no resend, no email validation on invite, no contract/commission artifact, no historical splits, no founder protection (you can "remove yourself" from your own agency).
- **No public agency surface** in `categories`, `search`, `browse`. No agency facet, no "Other teachers from Studio X" on teacher profiles, no agency badge on teacher cards.
- **No course `agencyId` / `publishedBy`** · Cannot publish a course as the agency; cannot co-brand. The mock thread "Pack Bac · proposition d'un parent" hints at multi-teacher bundles but no construct supports them.
- **Agency request routing** · `studentRequests` schema has no `targetAgencyId` / `assigneeId` / `claimedBy`. No "agency receives a request, dispatches to a teacher" flow.
- **Agency-scoped messaging / disputes / notifications** · No agency-tag filter, no internal team thread, no audit log of admin actions.
- **No Org switcher** · A manager who runs two agencies cannot switch contexts.
- **No branded URL** · Agency has `name` but no slug.

---

### MINOR

- **`src/components/student/teacher-profile.tsx:188, 360`** · Hard-coded `98%` completion.
- **`src/components/student/teacher-profile.tsx:417-418`** · Availability uses a deterministic `(di*31+hi*7)%5<2` — same fake availability every render.
- **`src/components/teacher/profile-form.tsx:73-83`** · City Select limited to 5 wilayas; student onboarding has 48 (`wilayaKeys`).
- **`src/components/teacher/profile-form.tsx:181-195`** · Hourly rate Input/Slider don't sync ranges — typing `12000` exceeds slider max silently.
- **`src/components/marketing/hero.tsx:11` / `lib/mock/sessions.ts:92-93`** · Live counts (`8 / 4`) are exported constants, not derived.
- **`src/components/student/browse-client.tsx:70,128`** · Price slider scale mismatch — courses use `priceRange[1]*4`, teachers use raw range. Inconsistent.
- **`src/components/student/browse-client.tsx:208-217`** · Mode toggle (online/in-person/both) has backwards branching; cannot return to "online only" once in "both".
- **`src/components/student/browse-client.tsx:146-155`** · Filters only sync to URL on Apply — rating/level/formats/price never reflect in URL.
- **`src/components/marketing/hero.tsx:113-125`** · Popular search chips link to `/browse?q=<chip>` but chip text doesn't match any mock data → empty state every time.
- **`src/components/student/account-shell.tsx:281-296, 298-307`** · Default teaching language hard-coded `fr`; currency "DZD" badge has no editor.
- **`src/components/student/onboarding-wizard.tsx:158`** · "Next" disabled at step 2 with `interests.length < 3` but hint shows count, not required minimum.
- **`src/components/requests/wizard-client.tsx:113-123`** · Validation runs only on steps 1 & 2; Skip bypasses required state.
- **`src/components/requests/browse-client.tsx:296-318`** · Empty-state primary CTA links to `/requests` (self) — circular.
- **`src/components/requests/detail-client.tsx:486-503`** · Discussion tab permanently locked empty state.
- **`src/components/app/chat/chat-thread.tsx`** · Sent messages don't persist after navigation — re-supplied from `chatThreads` mock.
- **`src/components/app/chat/thread-list.tsx:28-39`** · Search matches title + last message only — not earlier messages or participant names.
- **`src/components/teacher/cancel-subscription.tsx:35-38`** · Button order swapped (destructive looks secondary); no "type CANCEL to confirm".
- **`src/components/teacher/courses-view.tsx:21`, profile-form section index, etc.** · Section eyebrow passes hard-coded `num="00"` on Courses, Profile, Requests, Reviews, OnDemand, Applications.
- **`src/components/teacher/top-bar.tsx:18-29`** · Title map missing cases for `/teach/applications`, `/teach/ondemand`, `/messages` — falls through to "home".
- **`messages/fr/teacher.json:24`** · Sidebar label hard-coded to "Studio Numidia" (specific name) instead of generic "Agence".
- **`src/app/[locale]/teach/page.tsx:351-355`** · Footer rule shows `tcommon("loading")` as static text — looks like stray "Loading…" label.
- **`src/components/teacher/agency-members.tsx:88-102`** · Duplicate split editors (inline slider + dedicated panel) — pick one.
- **`src/components/teacher/sidebar.tsx:53`** · Inbox badge "3" hard-coded constant; no unread count for `/messages`.

#### Responsiveness — Minor

- **`src/components/marketing/testimonials.tsx:18`** · `md:grid-cols-3` cramps 3 cards into ~230px each at 768px. → `md:grid-cols-2 lg:grid-cols-3`.
- **`src/components/marketing/hero.tsx:64`** · `text-[40px]` headline + long FR/AR strings on 360px viewports. → `text-[34px] sm:text-[44px]`.
- **`src/components/requests/browse-client.tsx:92`** · `text-[40px] sm:text-[52px] md:text-[60px]` aggressive on mobile.
- **`src/components/teacher/profile-form.tsx:88`** · Mode `grid-cols-3` shrinks labels below readable width on mobile.
- **`src/app/[locale]/teach/page.tsx:58`** · `text-[44px] sm:text-[56px]` large for 360px viewport.
- **`src/components/student/teacher-profile.tsx:213`** · 4 tabs overflow on narrow phones (TabsList default doesn't wrap).
- **`src/components/student/account-shell.tsx:397-410`** · Payments rows wrap to 3 visual rows on mobile (5 cells in 2-col grid).
- **`src/components/student/teachers-leaderboard.tsx:122,136`** · Two Selects with `min-w-44` (176px) waste mobile space.
- **`src/components/requests/filter-bar.tsx:99`** · 6+ chip selects wrap to many lines on mobile; consider mobile sheet trigger like `browse-client.tsx`.
- **`src/components/teacher/subscription-simulator.tsx:29`** · Tier-tick labels overlap at narrow widths.
- **`src/app/[locale]/calendar/block-form.tsx:19-22`** · Hours hard-coded 08:00–21:00 in whole-hour steps (teachers want 30-min granularity).
- **`src/components/app/calendar/month-view.tsx`** · Day-name row 7 columns become unreadable on very small widths.
- **Heading scale audit** · Multiple pages use `text-4xl sm:text-5xl` or `text-[44px]+` without sufficient mobile down-scaling: notifications, disputes, calendar, requests browse, teach home, agency, subscription.

---

### POLISH

- Categories-grid hero category asymmetry at `sm:grid-cols-3`.
- Tabs underline animation, hover states for tap-only mobile.
- `Button size="sm"` (h-9, 36px) borderline tap target in dense kebab rows.
- Account section sidebar full-width on tablet (768-1023) feels verbose.
- Avatar stack on hero can wrap to two lines on narrow viewports.
- Discover-menu popover collision behavior at 1024-1280px.
- Top Rated tab in teacher profile is read-only with no "improve this" affordances.
- No "Featured studios" / agency marketing block.
- No agencies leaderboard at `/teachers` (or alternative).
- No "live multi-room dispatcher" for agencies.
- Cancel-subscription dialog has no destructive-action confirmation pattern.
- Onboarding-wizard reachable directly by URL; can be replayed forever.
- LanguageSwitcher not visible on `(auth)` pages — `(auth)/layout.tsx:13` strips `SiteHeader`.
- No "View public" icon next to course rows in `/teach/courses`.

---

## Routes Audited

40 page files in `src/app/[locale]/`:

```
/ · /(auth)/sign-in · /(auth)/sign-up · /account · /account/onboarding ·
/browse · /calendar · /categories · /courses/[id] · /disputes · /disputes/[id] ·
/events/[id] · /favorites · /live · /messages · /messages/[threadId] ·
/notifications · /requests · /requests/my · /requests/new · /requests/[id] ·
/search · /teach · /teach/agency · /teach/applications · /teach/courses ·
/teach/courses/new · /teach/courses/[id] · /teach/events · /teach/ondemand ·
/teach/profile · /teach/requests · /teach/reviews · /teach/subscription ·
/teachers · /teachers/[slug]
```

Components audited across `src/components/{app,brand,i18n,marketing,nav,requests,student,teacher,ui}/`.

---

## Closing Note

The cleanest near-term path:

1. **Mock-auth context + cookie + middleware** so layouts can gate `/account` and `/teach`. This unblocks most identity issues.
2. **A single `currentUser` store** (with `role`) read everywhere — `chats.ts`, `dashboard.ts`, `account-shell.tsx`, `dispute-detail.tsx`.
3. **One pass to fix every cross-component slug mismatch**: sessions↔courses, chats↔courses, dashboard↔teacherCourses, BrowseClient query keys.
4. **A "behavior layer" sweep**: at minimum every save/submit/publish/cancel/accept/reject button should mutate local mock state and show a toast, so the demo doesn't visibly dead-end on every screen.
5. **Decide on the agency role** — build it properly or remove the misleading surface.
6. **Two responsiveness primitives**: cap `DialogContent` height, make `TabsList` wrap by default. Two changes, app-wide improvement.

Everything else is incremental polish.
