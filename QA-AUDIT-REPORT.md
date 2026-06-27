# Darso — QA Audit Report

> **🔄 RESUME WORK:** A multi-batch fix sweep is in progress. Read the [Progress Log](#progress-log) below before doing anything else — it has the batching plan, locked-in defaults, what's done, and exactly where to pick up.

**Date:** 2026-06-27
**Scope:** Full app surface (40 routes, all components, marketing + student + teacher + agency surfaces, responsiveness mobile/tablet/desktop).
**Method:** Five parallel agents — (1) structural / dead-end, (2) responsiveness, (3) student flow, (4) teacher flow, (5) agency flow — followed by deduplication.

---

## Progress Log

_Last updated: 2026-06-27 — Phase 1 (Batches 1-6) complete. **Phase 2 — Frontend Completion Pass open** (8 batches: 7-14). Ready for the next worker to pick up from "Phase 2 — RESUME HERE"._

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

### Batch 1 — Done

**Agent A (UI primitives)** — ✓ complete
- [src/components/ui/dialog.tsx:37](src/components/ui/dialog.tsx#L37) — added `max-h-[calc(100dvh-2rem)] overflow-y-auto` to DialogContent
- [src/components/ui/tabs.tsx:16](src/components/ui/tabs.tsx#L16) — TabsList default now `flex min-h-10 flex-wrap items-center justify-center gap-1 …` (wraps on mobile)
- [src/components/app/calendar/week-view.tsx](src/components/app/calendar/week-view.tsx) — wrapped header + body grids in `ScrollArea` with shared `min-w-[640px]` so weekday header stays column-aligned
- [src/components/nav/site-footer.tsx:52](src/components/nav/site-footer.tsx#L52) — `md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]` (5 cols only at lg)

**Agent B (Mock data slug normalization)** — ✓ complete (`tsc --noEmit` + `next build` both clean)
- [src/lib/mock/courses.ts](src/lib/mock/courses.ts) — added 13 new Course records: 6 session-instance (`s-live-math`, `s-soon-english`, `s-tomorrow-code`, `s-week-piano`, `s-week-coran`, `s-week-physics`), 3 chat-context (`math-bac`, `ielts-7`, `ielts-workshop`), 4 teacher-catalog (`c-trigo`, `c-bac-prep`, `c-analysis` draft/ondemand, `c-geometry` archived). File grew from ~430 → ~1050 lines. Side-effects: `chats.ts` and `dashboard.ts` slug references now resolve without editing those files.
- [src/lib/mock/notifications.ts](src/lib/mock/notifications.ts) — `/billing` → `/teach/subscription` (n-3, n-6, n-9); `/account/reviews` → `/teachers/khalil-bensaid` (n-10 body rewritten so teacher replies to student review, not the inverse); `/account/verify` → `/account/onboarding`

**Agent C (Marketing + nav layer alignment)** — ✓ complete (typecheck clean)
- [src/components/nav/discover-menu.tsx](src/components/nav/discover-menu.tsx) — format/audience links repointed to plain `/browse` (BrowseClient has no URL contract for those — better than fake-looking params); `?category=` → `?subject=` at line 133
- [src/components/marketing/categories-grid.tsx](src/components/marketing/categories-grid.tsx) — `?category=` → `?subject=` (all instances)
- [src/components/marketing/hero.tsx:64](src/components/marketing/hero.tsx#L64) — `text-[40px] sm:text-[56px]` → `text-[34px] sm:text-[44px]`
- [messages/fr/common.json:64](messages/fr/common.json#L64), [messages/ar/common.json:64](messages/ar/common.json#L64) — popularChips rewritten so they hit mock data: FR `["Maths","IELTS","Physique","Coran","Piano"]`, AR `["الرياضيات","IELTS","الفيزياء","القرآن","البيانو"]`
- [src/components/marketing/testimonials.tsx:18](src/components/marketing/testimonials.tsx#L18) — `md:grid-cols-3` → `md:grid-cols-2 lg:grid-cols-3`
- Canonical browse URL contract: `subject`, `wilaya`, `mode=online|in-person|both`, `q`. All WRITE-side URL builders aligned to this.

**Agent E (Stub missing route pages)** — ✓ complete (typecheck clean)
- Created [src/components/marketing/coming-soon.tsx](src/components/marketing/coming-soon.tsx) — server component, accepts `title`, `description`, optional `breadcrumb: string[]`, optional `eta`, optional `relatedLinks: {label, href}[]`. Uses `Badge` + `Button` from `src/components/ui/`. RTL-aware. Pulls shared chrome strings from new `common.comingSoon` i18n namespace.
- Added `common.comingSoon` namespace to [messages/fr/common.json](messages/fr/common.json) and [messages/ar/common.json](messages/ar/common.json)
- Created 16 stub pages, all using `next-intl` (`setRequestLocale` + `generateMetadata`), params shape `Promise<{ locale: string }>` per Next.js 16 docs:
  - `[locale]/(auth)/forgot/page.tsx` (inside auth group for full-bleed layout)
  - `[locale]/{how-it-works,about,press,careers,blog,help,trust,contact}/page.tsx` (public shell with SiteHeader/SiteFooter)
  - `[locale]/legal/{terms,privacy,cookies}/page.tsx` (public shell)
  - `[locale]/teach/{pricing,resources,events/new,events/[id]}/page.tsx` (under teach layout — already provides sidebar/topbar)

**Out-of-scope bonus (main thread, pre-Progress-Log-aware)** — typecheck clean
- Created [src/components/nav/dashboard-shell.tsx](src/components/nav/dashboard-shell.tsx) — server component exporting `DashboardShell({role})` (renders teacher chrome — sidebar + top-bar + mobile-bar — when `role === "teacher"`, else `SiteHeader`/`SiteFooter`) and `pickShellRole(from)` helper.
- Rewrote 6 page files to use it: [src/app/[locale]/messages/page.tsx](src/app/[locale]/messages/page.tsx), [src/app/[locale]/messages/[threadId]/page.tsx](src/app/[locale]/messages/[threadId]/page.tsx), [src/app/[locale]/disputes/page.tsx](src/app/[locale]/disputes/page.tsx), [src/app/[locale]/disputes/[id]/page.tsx](src/app/[locale]/disputes/[id]/page.tsx), [src/app/[locale]/notifications/page.tsx](src/app/[locale]/notifications/page.tsx), [src/app/[locale]/calendar/page.tsx](src/app/[locale]/calendar/page.tsx) — each now reads `searchParams.from` and wraps content in `<DashboardShell role={pickShellRole(from)}>`.
- **No callsite sends `?from=teach` yet** — teacher sidebar/mobile-bar/dashboards still link bare. So this is dormant scaffolding: it preserves current student-shell behavior unchanged and provides a switch Batch 2 can flip.
- **Batch 2 directive:** drop the `?from=teach` query-param picker and feed `DashboardShell role={…}` from the real `currentUser.role` context. Then teacher links to these shared routes no longer need any query param — the shell follows identity, not URL state.
- Addresses the MAJOR "Page chrome inconsistency (teacher loses teacher shell)" finding (lines 260-263 of this report) at the wrapper layer only; deeper fixes (teacher-only widgets, calendar role-shape branching of content not just chrome) belong to Batch 5.

**Agent D (Student/teacher shell copy + responsive sweep)** — ✓ complete (typecheck clean)

Most of the 20 tasks turned out to be already implemented by earlier sweeps; Agent D's role was to verify each against current state and fill the remaining gaps.

Edits made in this run:
- **T1** — Created [src/lib/wilayas.ts](src/lib/wilayas.ts) (48 wilaya keys + `"any"` sentinel), added `search.wilayas` namespace to [messages/fr/common.json](messages/fr/common.json) + [messages/ar/common.json](messages/ar/common.json), switched [src/components/teacher/profile-form.tsx](src/components/teacher/profile-form.tsx) import to the shared module. Teacher city Select now offers all 48.
- **T12** — [src/components/student/teachers-leaderboard.tsx:136](src/components/student/teachers-leaderboard.tsx#L136) — wilaya Select went from `min-w-44` → `min-w-0 flex-1 sm:min-w-44 sm:flex-none`. Line 122 already had the equivalent treatment.
- **T18 (DEFERRED to Batch 2)** — Verified hard-coded `/teachers/khalil-bensaid` still present at [src/app/[locale]/teach/profile/page.tsx:22](src/app/[locale]/teach/profile/page.tsx#L22). Added `// TODO: Batch 2 — pull from currentUser.slug` comment on the preceding line.

Tasks T2–T11, T13–T17, T19–T20 — verified already implemented (precise locations below; the audit's line numbers had shifted from earlier sweeps):
- T2 hourly Input↔Slider sync — wired with controlled `value={hourly}`, onBlur clamp, slider `onValueChange` ([profile-form.tsx:231-253](src/components/teacher/profile-form.tsx#L231-L253))
- T3 eyebrow renumbering — no `num="00"` anywhere; teacher pages start at 01 and use sequential indices
- T4 stray "Loading…" — teach/page.tsx L350-354 renders `v 1.0`, no `tcommon("loading")` rule
- T5 heading scale — already `text-[34px] sm:text-[44px] md:text-[56px] lg:text-[64px]`
- T6 "Studio Numidia" → generic — both locales already `"Agence"`/`"وكالة"`; sidebar reads i18n key, not hard-coded. (The actual "Studio Numidia" literal lives in `src/lib/mock/agency.ts`, Agent B's territory — out of scope for this batch.)
- T7 price slider — single 0–20 000 DZD scale (step 500) shared by teacher rate and course price filter ([browse-client.tsx:82-83](src/components/student/browse-client.tsx#L82-L83))
- T8 mode toggle — `deriveMode(online, inPerson)` at [browse-client.tsx:230-249](src/components/student/browse-client.tsx#L230-L249); toggling off in-person from "both" returns to "online". URL contract `mode=online|in-person|both` preserved.
- T9 filter URL sync — `commit()` at [browse-client.tsx:164-183](src/components/student/browse-client.tsx#L164-L183) serializes `q, subject, wilaya, mode, rating, level, formats, priceMin, priceMax` (camelCase, matches existing reader)
- T10 live mobile grid — `grid-cols-[64px_1fr] sm:grid-cols-[80px_1fr_auto]` with price/CTA row spanning 2 cols below `sm` ([live-page.tsx:75](src/components/student/live-page.tsx#L75))
- T11 payments mobile — header `hidden md:grid`, rows `flex flex-col gap-2 ... md:grid md:grid-cols-...` ([account-shell.tsx:404-438](src/components/student/account-shell.tsx#L404-L438))
- T13 interests hint — "Choisissez au moins 3 sujets (vous en avez {selected})" / "اختر 3 مواضيع على الأقلّ (اخترتَ {selected})"
- T14 wizard `skip()` validation — calls `validate(step)` before advancing ([wizard-client.tsx:143-146](src/components/requests/wizard-client.tsx#L143-L146))
- T15 requests heading — already `text-[32px] sm:text-[44px] md:text-[60px]`
- T16 filter chips sheet — below-`sm` Sheet trigger, inline chips above ([filter-bar.tsx:235-261](src/components/requests/filter-bar.tsx#L235-L261)); mirrors browse pattern
- T17 tier ticks — non-active ticks `hidden sm:inline` ([subscription-simulator.tsx:46-52](src/components/teacher/subscription-simulator.tsx#L46-L52))
- T19 verify-diploma — toast wired via local-state + RAF re-trigger pattern; FR/AR copy at `verification.diplomaToastTitle`/`Desc` ([profile-form.tsx:205-217](src/components/teacher/profile-form.tsx#L205-L217)). Batch 3 will replace with shared toast utility.
- T20 subject-tag remove — `onClick={() => setSubjectTags((prev) => prev.filter((x) => x !== s))}` ([profile-form.tsx:336](src/components/teacher/profile-form.tsx#L336))

### Batch 1 — Closed

5 of 5 sub-agents done. `npx tsc --noEmit` clean at end. Two orphan worktrees remain under `.claude/worktrees/agent-*/` — empty, not tracked; harmless leftovers from sub-agent isolation that can be cleaned later.

### Batch 2 — Done

Mock auth foundation landed end-to-end. `npx tsc --noEmit` clean. `npx next build` succeeds (213 static pages, proxy registered as middleware).

**Auth module** ([src/lib/auth/](src/lib/auth/), 368 LOC total):
- [accounts.ts](src/lib/auth/accounts.ts) — in-memory mock catalog with two accounts (`acc-lina` student / `acc-khalil` teacher). Sign-up extends the array in-session. No agency account per locked-in default 3.
- [constants.ts](src/lib/auth/constants.ts) — `AUTH_COOKIE_NAME` only (safe for proxy/middleware runtime).
- [cookies.ts](src/lib/auth/cookies.ts) — `server-only`. `readAuthCookie / setAuthCookie / clearAuthCookie` using async `cookies()` from `next/headers` per Next 16.
- [server.ts](src/lib/auth/server.ts) — `server-only`. `getCurrentUser()` resolves cookie → account.
- [actions.ts](src/lib/auth/actions.ts) — `"use server"`. `signInWithAccountId`, `signInWithEmail`, `signUpWithEmail`, `signOutAction`. Honor `next?` redirect param.
- [role-home.ts](src/lib/auth/role-home.ts) — sync helper extracted out of `actions.ts` (a `"use server"` module forbids non-async exports).
- [context.tsx](src/lib/auth/context.tsx) — `CurrentUserProvider` + `useCurrentUser()` hook. Accepts `signOut` as a prop so the client doesn't import "use server" code directly.
- [index.ts](src/lib/auth/index.ts) — client-safe barrel. Server-only stuff lives only in `@/lib/auth/server` to avoid `'server-only' cannot be imported from a Client Component module` poisoning every client surface.

**Proxy** ([proxy.ts](proxy.ts)) — Next.js 16 uses `proxy.ts` (the `middleware.ts` convention is deprecated). Gates `/account`, `/teach/{dashboard,agency,applications,courses,events,ondemand,profile,requests,reviews,subscription}`, `/messages`, `/calendar`, `/requests/my`, `/disputes`, `/notifications`. Bare `/teach` plus `/teach/{pricing,resources}` stay public. On missing cookie redirects to `/{locale}/sign-in?next={originalPath}`.

**Sign-in/sign-up** ([sign-in-form.tsx](src/components/student/sign-in-form.tsx), [sign-up-form.tsx](src/components/student/sign-up-form.tsx)) — wired to `signInWithEmail` / `signUpWithEmail` via `useTransition`. Demo picker filters out `demo-agency` (locked-in default 3) and only renders the two in-catalog demos. Inline `errorUnknownEmail` shown when email doesn't match.

**Identity replacements** — `useCurrentUser` / `getCurrentUser` derived everywhere:
- chat sender id ([chat-thread.tsx](src/components/app/chat/chat-thread.tsx)) — falls back to legacy `u-self` mock
- teacher card in sidebar ([sidebar.tsx](src/components/teacher/sidebar.tsx)) — pulls teacher record from `featuredTeachers` by `user.teacherId`
- account-shell header/inputs ([account-shell.tsx](src/components/student/account-shell.tsx)) — name, initials, city, phone hydrated from user; defaults to Lina if unauthenticated
- dispute-detail outbound messages ([dispute-detail.tsx](src/app/[locale]/disputes/[id]/dispute-detail.tsx)) — name+initials from user, `authorId` constrained to `"u-self"` enum (the DisputeMessage type only allows that for the viewer)

**`/teach` split (Option B)** — route group `(dashboard)`:
- [src/app/[locale]/teach/page.tsx](src/app/[locale]/teach/page.tsx) — public marketing landing with hero, benefits, 3-step explainer, CTA strip; redirects teachers to `/teach/dashboard`. New `teacher.landing` i18n namespace (FR+AR).
- [src/app/[locale]/teach/(dashboard)/dashboard/page.tsx](src/app/[locale]/teach/(dashboard)/dashboard/page.tsx) — the existing dashboard content
- [src/app/[locale]/teach/(dashboard)/layout.tsx](src/app/[locale]/teach/(dashboard)/layout.tsx) — teacher chrome (Sidebar + TopBar + MobileBar)
- 9 teacher sub-routes moved into `(dashboard)/` (URLs unchanged)
- `/teach/{pricing,resources}` stay public — kept outside the group and self-shell with SiteHeader/SiteFooter
- Teacher nav (sidebar/topbar/mobile-bar) updated to link `/teach/dashboard` instead of `/teach`

**SiteHeader auth-aware** ([user-menu.tsx](src/components/nav/user-menu.tsx)) — new client island. Anonymous: classic Sign in / Sign up. Authed: avatar (initials) + Radix dropdown with role-aware Account/Dashboard link, email line, and Sign out item that calls `signOutAction`. New `nav.userMenu` i18n keys (FR+AR).

**Sign-out wired** in:
- [account-shell.tsx:128](src/components/student/account-shell.tsx#L128) — was mislabelled "Back"; now `t("signOut")` calling `signOut()`
- [teacher/sidebar.tsx:194](src/components/teacher/sidebar.tsx#L194) — bottom logout button
- [teacher/mobile-bar.tsx:121](src/components/teacher/mobile-bar.tsx#L121) — logout in more-sheet
- i18n key `student.account.signOut` added in both locales (`teacher.shell.logout` already existed)

**dashboard-shell.tsx refactor** ([dashboard-shell.tsx](src/components/nav/dashboard-shell.tsx)) — now an `async` server component that calls `getCurrentUser()` and picks the shell. `pickShellRole(from)` kept as `@deprecated` for any straggling caller. 6 page files dropped `searchParams.from` plumbing: [messages/page.tsx](src/app/[locale]/messages/page.tsx), [messages/[threadId]/page.tsx](src/app/[locale]/messages/[threadId]/page.tsx), [disputes/page.tsx](src/app/[locale]/disputes/page.tsx), [disputes/[id]/page.tsx](src/app/[locale]/disputes/[id]/page.tsx), [notifications/page.tsx](src/app/[locale]/notifications/page.tsx), [calendar/page.tsx](src/app/[locale]/calendar/page.tsx).

**T18 fixed** ([teach/(dashboard)/profile/page.tsx](src/app/[locale]/teach/(dashboard)/profile/page.tsx)) — preview link now `currentUser.teacherSlug ?? "khalil-bensaid"`. TODO comment removed.

**Out-of-batch fix bonus** — fixed `useTranslations("common.comingSoon")` → `useTranslations("comingSoon")` in [coming-soon.tsx](src/components/marketing/coming-soon.tsx). The keys were always at the top-level `comingSoon` (request.ts merges shallow), not nested under `common`. Build was emitting `MISSING_MESSAGE: common.comingSoon (ar)` warnings even though both messages contained the right data.

**Deferred to later batches:**
- Top-bar title map ([top-bar.tsx](src/components/teacher/top-bar.tsx)) — still missing `/teach/applications`, `/teach/ondemand`, `/messages` cases (audit MINOR finding, not in scope here).
- Dashboard sub-pages still link to `/teach/courses/c-trigo` etc. — Batch 1's Agent B fix added those records, but the dashboard mock at [src/lib/mock/dashboard.ts:29](src/lib/mock/dashboard.ts#L29) still points to `/teach/courses/c-math-bac`. Leaving for Batch 3's behavior sweep.
- The proxy redirects to sign-in but the sign-in form `next` field is currently just used to push the user back; no toast or "you were signed out / please sign in" indicator. Fine for now.

### Pre-Batch-3 main-thread bonus

**Shared toast utility** ([src/lib/toast/index.tsx](src/lib/toast/index.tsx)) — `<ToastHost>` (mounted in root layout next to `CurrentUserProvider`) and `useToast()` hook. Imperative API: `const { show, dismiss } = useToast(); show({ title, description, variant: "default|success|danger|warning", durationMs })`. Built on the existing Radix `src/components/ui/toast.tsx` primitives — no new dependencies. Use `swipeDirection="right"` for RTL-safe interaction; viewport sits bottom-end. All Batch 3+ buttons should import from `@/lib/toast` instead of rolling their own RAF-toggle pattern.

### Batch 3 — PENDING — RESUME HERE

**Behavior-layer sweep.** Four parallel sub-agents on disjoint surfaces, each turning dead buttons into local-mock mutations + `useToast()` feedback. **Wizards and lifecycle (course wizard Publish / course edit page rebuild / request wizard Publish / dispute open flow) stay with Batch 5** — Batch 3 only wires buttons that already exist and currently dead-end.

- **Agent 3a — account-shell behaviors**: every save / discard / cancel / delete on [src/components/student/account-shell.tsx](src/components/student/account-shell.tsx) becomes a local-state mutation + toast. Includes payments "+ Add payment method", per-row "Download invoice", change-password dialog Cancel/Submit, "Revoke session" / "Revoke all sessions", delete-account dialog Cancel/Confirm, preferences "Save". Profile fields already save to local state (Batch 2 wired them to `useCurrentUser`); just confirm and toast.
- **Agent 3b — teacher dashboards behaviors**: profile-form Save ([src/app/[locale]/teach/(dashboard)/profile/page.tsx:27](src/app/[locale]/teach/(dashboard)/profile/page.tsx#L27)), courses-view dropdown items Edit/Duplicate/Publish/Archive/Unarchive ([src/components/teacher/courses-view.tsx:188-213](src/components/teacher/courses-view.tsx#L188-L213)), reviews-list "Send reply" ([src/components/teacher/reviews-list.tsx:113-119](src/components/teacher/reviews-list.tsx#L113-L119)), agency-profile Save ([src/components/teacher/agency-profile.tsx:32](src/components/teacher/agency-profile.tsx#L32)), agency-members "Save revenue split" + row dropdown + invite Cancel/Send ([src/components/teacher/agency-members.tsx:115-117,182-195,234-237](src/components/teacher/agency-members.tsx#L115-L237)), subscription page Select/Download/Change payment ([src/app/[locale]/teach/(dashboard)/subscription/page.tsx:133-189](src/app/[locale]/teach/(dashboard)/subscription/page.tsx#L133-L189)), cancel-subscription dialog Keep/Confirm ([src/components/teacher/cancel-subscription.tsx:35-37](src/components/teacher/cancel-subscription.tsx#L35-L37)), events page Modifier + kebab ([src/app/[locale]/teach/(dashboard)/events/page.tsx:77-82](src/app/[locale]/teach/(dashboard)/events/page.tsx#L77-L82)), ondemand "Create a series" ([src/app/[locale]/teach/(dashboard)/ondemand/page.tsx:26-29](src/app/[locale]/teach/(dashboard)/ondemand/page.tsx#L26-L29)), dashboard pending-request Accept/Reject ([src/app/[locale]/teach/(dashboard)/dashboard/page.tsx:204-213](src/app/[locale]/teach/(dashboard)/dashboard/page.tsx#L204-L213)), requests-tabs Accept/Reject dialog ([src/components/teacher/requests-tabs.tsx:88-98,175-179](src/components/teacher/requests-tabs.tsx#L88-L179)) — and fix the static `/teachers/student` URL while at it.
- **Agent 3c — requests behaviors**: detail-client per-application "Message" ([src/components/requests/detail-client.tsx:448-451](src/components/requests/detail-client.tsx#L448-L451)), owner rail Edit/Close/Reopen ([detail-client.tsx:646-664](src/components/requests/detail-client.tsx#L646-L664)), accept dialog footer ([detail-client.tsx:294](src/components/requests/detail-client.tsx#L294)), Discussion tab locked empty state ([detail-client.tsx:486-503](src/components/requests/detail-client.tsx#L486-L503) — wire to a minimal "post message" + render), my-requests dropdown Edit/Share/Reopen/Close/Delete ([src/components/requests/my-client.tsx:265-289](src/components/requests/my-client.tsx#L265-L289)), browse empty-state CTA self-loop ([browse-client.tsx:296-318](src/components/requests/browse-client.tsx#L296-L318) — repoint to `/requests/new`).
- **Agent 3d — dialogs / disputes / calendar / chat / notifications**: dispute mediation dialog submit + "Submit refund proposal" ([src/app/[locale]/disputes/[id]/dispute-detail.tsx:261-266,292-295](src/app/[locale]/disputes/[id]/dispute-detail.tsx#L261-L295)), calendar block-form submit ([src/app/[locale]/calendar/block-form.tsx:32-37](src/app/[locale]/calendar/block-form.tsx#L32-L37)), chat-thread "Join video call" icon ([src/components/app/chat/chat-thread.tsx:156-158](src/components/app/chat/chat-thread.tsx#L156-L158) — toast "Coming soon"), notification-row "Mute notification type" ([src/components/app/notifications/notification-row.tsx:152](src/components/app/notifications/notification-row.tsx#L152)). **Defer to Batch 5**: calendar event cells in week-view / month-view (clickable detail open), "+ Open a dispute" CTA on disputes-shell (audit-flagged but it's a new flow, Batch 5 "dispute open flow" owns it).

Cross-cutting constraints (every agent):
1. **Use the existing shared toast** at `@/lib/toast` — `import { useToast } from "@/lib/toast"`. Don't roll your own.
2. **Mutations**: keep them component-local React state when the scope is one component, OR add a small mutator to the relevant mock module (`src/lib/mock/*.ts`) that holds state in a closure exported alongside the read-only data. Mutations survive in-session, reset on refresh — same model as auth (locked-in default 2).
3. **Every wired button**: `e.preventDefault()` (if in a form), perform the mock mutation, toast success/failure. If the mutation affects data shown on another page, optionally `router.refresh()` (next-intl `useRouter`).
4. **Don't touch Batch 4 / Batch 5 territory**: no booking funnel (teacher-profile reserve / availability cells / course Reserve / event Reserve / Live Join now), no wizard Publish (course-wizard, request wizard-client), no course edit page rebuild, no "+ Open a dispute" flow, no calendar role-branching.
5. **i18n**: any new strings go into both `messages/fr/*.json` and `messages/ar/*.json` under a sensible namespace. Use **Read → Edit** for the JSON files (not Write) to avoid clobbering parallel agents' additions.
6. After your own work: `npx tsc --noEmit` must be clean before you report.

Reporting: each agent returns a markdown summary listing the wired buttons (file:line if useful), the mutator names if any, the i18n keys added, and `typecheck: clean`. After all four return, main thread runs `npx tsc --noEmit` again, `npx next build`, appends summaries to this Progress Log, and proceeds to Batch 4.

### Batch 3 — Done

All four sub-agents reported in; combined `npx tsc --noEmit` clean, `npx next build` clean (~45 routes, proxy registered, no `MISSING_MESSAGE`).

**Agent 3a (account-shell)** — 13 buttons wired on [src/components/student/account-shell.tsx](src/components/student/account-shell.tsx):
- Profile Save / Discard, Preferences Save
- Payments: Add payment dialog (typed `PaymentMethod` state, brand/last4/expiry inputs), per-row Download invoice
- Security: Change password dialog (length + match validation, error toasts), 2FA toggle, Revoke session per-row + Revoke all (disabled when none non-current)
- Danger: Delete account confirm dialog (type-the-word pattern, no actual logout — mock UX rule)
- 17 toast keys under `student.account.toasts.*` (FR + AR); state conversions: payments/sessions array literals → `useState`, RadioGroup made controlled, dialog open states centralized

**Agent 3b (teacher dashboards)** — 28 buttons wired across 11 files + 5 new client islands:
- New client islands: [profile-save-button.tsx](src/components/teacher/profile-save-button.tsx), [create-series-button.tsx](src/components/teacher/create-series-button.tsx), [event-row-actions.tsx](src/components/teacher/event-row-actions.tsx), [pending-requests-inbox.tsx](src/components/teacher/pending-requests-inbox.tsx), [subscription-actions.tsx](src/components/teacher/subscription-actions.tsx) — keep parent pages as server components
- courses-view.tsx — `setCourses` state, Edit (`router.push` + toast), Duplicate (clones as draft with `-copy-{ts}` id), Publish/Archive/Unarchive (`updateStatus`)
- reviews-list.tsx — per-review `drafts` + `replies` state, replies render with `CornerDownRight` accent stripe; empty-reply toast
- agency-members.tsx — `members`/`invites` state, `MEMBER_TO_TEACHER_SLUG` map for View profile, scroll-to-split-panel for Edit, Remove + Send invite (email regex validation, pending ghost row with `pendingBadge` chip)
- agency-profile.tsx — controlled `name`/`bio` inputs + Save toast
- cancel-subscription.tsx — Keep (close + toast), Confirm cancel (warning toast with computed end-of-period date)
- subscription page — Select plan, Download invoice, Change payment (opens dialog with `payment.changeTitle`/`Body` copy)
- events page — Modifier links to `/teach/events/[id]`, kebab Duplicate/Cancel toasts
- ondemand — Create series → "Coming soon" toast (Batch 5 wizard owns the real flow)
- dashboard pending-request inbox → `setRequests(prev.filter(...))` on Accept/Reject
- requests-tabs — Accept/Reject status flips, Cancel dialog close, View profile repointed `/teachers/student` → `/teachers/khalil-bensaid` (via `FALLBACK_PROFILE_SLUG`)
- ~24 toast keys under `teacher.{courses,reviews,agency,subscription,events,ondemand,home,requests,toasts}.*` (FR + AR)

**Agent 3c (requests)** — 12 buttons wired across 3 files:
- detail-client: per-application Message (best-effort `/messages/th-{firstSlug}` push), Accept dialog (`setAwardedId` + status → `"awarded"`), owner Edit/Close/Reopen, Discussion composer (new `DiscussionPanel` replaces locked empty state, posts to local `messages` state with `useCurrentUser` author label)
- my-client: Edit (toast), Share (clipboard + locale-aware URL build), Reopen/Close (status flips), Delete (confirm Dialog + `setOwned(prev.filter(...))`)
- browse-client empty-state CTA repointed `/requests` → `/requests/new`
- Toast keys under `requests.{toasts,detail.discussion.composer,my.deleteDialog}.*` (FR + AR); identity via `useCurrentUser()`

**Agent 3d (dialogs/disputes/calendar/chat/notifications)** — 6 surfaces wired:
- dispute-detail.tsx — mediation dialog Cancel/Submit (appends to local `messages`), Submit refund proposal (`setProposedPct` + visible "current proposal" label)
- calendar/block-form.tsx — start/end parse + validate (`from<to`), recurring + reason fields preserved; mutations go through new **module store [src/lib/mock/calendar-state.ts](src/lib/mock/calendar-state.ts)** (`getBlocks`/`addBlock`/`subscribeBlocks`) so the dual-mount form (Sheet + sidebar) stays in sync
- chat-thread Join video call → toast "Coming soon"
- notification-row Mute → toast (interpolates type label via existing `type.*` keys)
- New i18n namespace [messages/{fr,ar}/app.json](messages/fr/app.json) with `app.{disputes,calendar,chat,notifications}.toasts.*` (FR + AR)

Cross-batch:
- All 4 agents used the shared [src/lib/toast](src/lib/toast/index.tsx) imperative API — no RAF re-trigger hacks added.
- All used `Read → Edit` for locale JSON files; no clobbering across parallel agents.
- 7 transient typecheck errors flagged by 3a/3d while 3c was mid-edit cleared once 3c finished. Final combined run is clean.

**Deferred to Batch 5 (calendar role-branching / dispute open flow / wizards):**
- Calendar week-view / month-view event-cell click-to-detail (audit MAJOR; Batch 5 calendar role-branching owns)
- "+ Open a dispute" CTA on disputes-shell (audit MAJOR; Batch 5 dispute open flow owns)
- Course wizard Publish / Publish later, course edit page rebuild, request wizard Publish (Batch 5 wizards & lifecycle owns)
- Per-application Message ensure-thread mutator in `src/lib/mock/chats.ts` (Agent B territory; can be added when needed)
- profile-form.tsx still uses RAF re-trigger toast pattern; migrating to `useToast()` is optional polish.

### Batch 4 — PENDING — RESUME HERE

**Booking funnel.** Single sequential agent. The single most important verb on the platform: turn anonymous "Reserve / Book / Apply / Join" CTAs into a real (mock) checkout flow with writeback to `/account` payments and `/calendar`. Use the in-memory module-store pattern Agent 3d established at [src/lib/mock/calendar-state.ts](src/lib/mock/calendar-state.ts) for shared state.

Scope:

1. **Mock booking store** — create [src/lib/mock/bookings-state.ts](src/lib/mock/bookings-state.ts) with: `Booking` type (`id`, `kind: "1to1" | "course" | "event" | "live"`, `subjectTitle`, `teacherSlug`, `priceDzd`, `bookedAt`, `start`, `end`, `status: "confirmed" | "pending" | "cancelled"`, `invoiceUrl?`), `getBookings()`, `addBooking()`, `subscribeBookings()` mirroring `calendar-state.ts` patterns. Tag bookings by `accountId` so we can filter to the current user.
2. **Mock checkout flow** — create a shared `<CheckoutDialog>` component under [src/components/booking/](src/components/booking/) that takes `{ kind, subjectTitle, teacherSlug, priceDzd, start?, end? }` as props, renders summary + payment-method picker (reuse the account-shell `PaymentMethod` shape) + "Confirm and pay" button. On confirm: `addBooking()`, toast success, push to `/account?tab=payments` or close. Validate required props; show inline error on missing inputs.
3. **Wire booking CTAs** — at each callsite, render `<CheckoutDialog>` wrapped around the trigger button:
   - [src/components/student/teacher-profile.tsx](src/components/student/teacher-profile.tsx) — Book 1-to-1 (hero CTA, side rail CTA, sticky rail CTA — all three trigger the same dialog), Apply to course, Send a message (routes to `/messages?to={teacherId}` — create thread if missing in `chats.ts`).
   - [src/components/student/teacher-profile.tsx](src/components/student/teacher-profile.tsx) `AvailabilityGrid` cells — free `<button>` slots should call `setPickedSlot({day, hour})` then open the same `<CheckoutDialog>` pre-filled with `start`/`end` for that slot. Booked slots stay disabled.
   - [src/components/student/course-detail.tsx](src/components/student/course-detail.tsx) — Reserve CTA opens dialog with `kind: "course"`; Ask a question routes to `/messages?to={teacher}`.
   - [src/components/student/event-detail.tsx](src/components/student/event-detail.tsx) — Reserve spot CTA opens dialog with `kind: "event"`.
   - [src/components/marketing/live-panel.tsx](src/components/marketing/live-panel.tsx) + [src/components/student/live-page.tsx](src/components/student/live-page.tsx) — "Join now"/"Reserve" — for "live now" sessions, button reads "Open room" and toasts "Joining live room…" (we don't have a real WebRTC stub); for upcoming sessions, opens `<CheckoutDialog>` with `kind: "live"`.
4. **Writeback surfaces**:
   - **/account payments tab** — extend the existing payments section in [account-shell.tsx](src/components/student/account-shell.tsx) (Batch 3a already converted to `useState`) to ALSO subscribe to `bookings-state` and render confirmed bookings as invoice rows alongside the seeded `history`. Sort newest first.
   - **/calendar** — [src/app/[locale]/calendar/calendar-shell.tsx](src/app/[locale]/calendar/calendar-shell.tsx) (student perspective — already in marketing shell when student per Batch 2) should subscribe to bookings and render each confirmed booking as a calendar event. Teacher perspective stays focused on availability blocks.
5. **i18n** — new strings under `booking.checkout.*` namespace (use a new [messages/{fr,ar}/booking.json](messages/fr/booking.json) file if cleanest, or fold into existing `student.json` — pick whichever keeps the message tree shallow). Add FR + AR.

Constraints:
- Use [@/lib/toast](src/lib/toast/index.tsx) for all feedback.
- Use `useCurrentUser()` to tag bookings; redirect to `/sign-in?next=...` when an anonymous visitor clicks Reserve (proxy already redirects, but the CTA should also surface this gracefully — toast "Sign in to reserve" + `router.push("/sign-in?next=...")`).
- Don't add real payment-gateway hooks or webhooks — keep it mock.
- `npx tsc --noEmit` + `npx next build` must be clean.
- Append closeout summary to this Progress Log when done, proceed to Batch 5.

### Batch 4 — Done

Single sequential agent. `npx tsc --noEmit` clean, `npx next build` clean (213 static pages, proxy registered, no `MISSING_MESSAGE`).

**Mock booking store** ([src/lib/mock/bookings-state.ts](src/lib/mock/bookings-state.ts)) — `Booking` type with `id`, `accountId`, `kind: "1to1" | "course" | "event" | "live"`, `subjectTitle`, `teacherSlug`, `teacherName`, `priceDzd`, `start?`, `end?`, `status`, `paymentLabel?`, `bookedAt`, `invoiceUrl?`. Exports `getBookings()`, `getBookingsForAccount(id)`, `addBooking()`, `subscribeBookings()`. Per-account snapshot cache (frozen arrays) for `useSyncExternalStore` referential stability; cache invalidated on every mutation. Mirrors `calendar-state.ts`.

**PaymentMethod lift** ([src/lib/mock/payments-state.ts](src/lib/mock/payments-state.ts)) — new file. `PaymentMethod` type + `defaultMockPaymentMethods(labels)` seed helper (Edahabia / CIB / Postal Mandate / BaridiMob). [account-shell.tsx](src/components/student/account-shell.tsx) imports the type only — Agent 3a's `useState<PaymentMethod[]>` ownership untouched.

**CheckoutDialog** ([src/components/booking/checkout-dialog.tsx](src/components/booking/checkout-dialog.tsx), 312 LOC). Two render modes: `trigger`-driven (clones via `React.cloneElement` injecting gated `onClick`) OR `open`/`onOpenChange` controlled (the AvailabilityGrid uses this so all 56+ free cells share one dialog instance). Summary card → payment-method radio list → secure-payment hint → total → Confirm/Cancel footer. **Anonymous gate**: when `!user`, click handler `preventDefault` + `stopPropagation`, toasts `signInRequired` (warning), `router.push("/sign-in?next={localized path}")`. Dialog never opens.

**CTAs wired across 6 files**:
- [teacher-profile.tsx](src/components/student/teacher-profile.tsx) — Book 1-to-1 (hero L172, side rail L235, sticky L402), Apply to course (rail L249, sticky L416, disabled when no courses), Send a message (hero L186, sticky L434 → toast + `router.push("/messages?to={slug}")`), AvailabilityGrid free cells (L610) → `setPickedSlot` → controlled dialog at L475 with `start`/`end` anchored to current Monday + localized `scheduleLabel`
- [course-detail.tsx](src/components/student/course-detail.tsx) — Reserve hero L203 + per-date L322, Ask a question L440 → toast + `/messages` push
- [event-detail.tsx](src/components/student/event-detail.tsx) — Reserve spot hero L91 + sticky L172 (disabled when `left <= 0`)
- [live-panel.tsx](src/components/marketing/live-panel.tsx) (converted to `"use client"`) + [live-page.tsx](src/components/student/live-page.tsx) — live rows → toast "Joining live room…" (mock WebRTC), upcoming rows → CheckoutDialog `kind: "live"`

**Writebacks**:
- [account-shell.tsx](src/components/student/account-shell.tsx) payments tab L456 → `useSyncExternalStore` on bookings; new "Recent bookings" subsection at L621 (only when `confirmedBookings.length > 0`), kind pill / subject / localized date / price / Confirmed badge / Download invoice ghost button. Purely additive — doesn't touch Agent 3a's `methods`/`history`/`addPayment`.
- [calendar-shell.tsx](src/app/[locale]/calendar/calendar-shell.tsx) L61 subscribes to bookings when `user?.role !== "teacher"`; `bookingsToCalendarEvents` helper maps `Booking → CalendarEvent` (status `"booked"`, mode `"online"`, format from `kind`). Merged into `weekEvents`/`monthEvents` before `<WeekView>`/`<MonthView>`/`<ListView>`. Teacher perspective unchanged — Agent 3d's `calendar-state.ts` integration intact.

**i18n** — new namespace [messages/{fr,ar}/booking.json](messages/fr/booking.json); loader [src/i18n/request.ts](src/i18n/request.ts) extended at L33-34. Keys: `booking.checkout.{title,subtitle,withTeacher,methodLabel,addMethod,totalLabel,confirm,confirming,cancel,secureNote,signedOutHint}`, `booking.kind.{1to1,course,event,live}`, `booking.methods.{edahabia,cib,postalMandate,baridiMob}`, `booking.payments.{recentLabel,statusConfirmed}`, `booking.toasts.{bookingConfirmed,bookingFailed,signInRequired,joiningLive,openingConversation}`. FR + AR.

**Deferred to later batches:**
- No `ensureThread(teacherSlug)` mutator in `chats.ts` — "Send a message" / "Ask a question" land on `/messages?to={slug}`; the `?to=` param is dropped by `inbox-shell.tsx`. Per agent's spec ("don't deeply modify mock chats"), opening the inbox + a toast is the contract. Can be added later if needed.
- AvailabilityGrid still uses deterministic `(di*31+hi*7)%5<2` pseudo-availability (audit MINOR). Slot pre-fill uses current Monday as week anchor; teacher-profile has no visible week picker yet.
- `Booking.invoiceUrl` field exists but is unset; Download button reuses seeded `invoiceDownloaded` toast — fine for mock.

### Batch 5 — PENDING — RESUME HERE

**Wizards + lifecycle.** Four parallel sub-agents on disjoint surfaces. After Batch 3, several lifecycle items already shipped (request close/reopen/delete via my-client; course Edit/Duplicate/Publish dropdown via courses-view); Batch 5 focuses on the **wizard final steps** (where 5 steps of user input still discard today) and the remaining lifecycle gaps (course edit page rebuild, request edit page, dispute open flow, calendar role-aware content + event interactivity).

- **Agent 5a — Course wizard Publish + Course edit page rebuild**:
  - [src/components/teacher/course-wizard.tsx](src/components/teacher/course-wizard.tsx) — final "Publish" / "Publish later" buttons (~L325-339) currently do nothing. Wire them: build a `NewCourse` payload from the wizard's accumulated state, `addCourse()` into a new mock store, toast success, `router.push("/teach/courses")`. "Publish later" sets status `"draft"`; "Publish" sets status `"published"`.
  - [src/app/[locale]/teach/(dashboard)/courses/[id]/page.tsx](src/app/[locale]/teach/(dashboard)/courses/[id]/page.tsx) — currently renders literal placeholder text. Rebuild as an actual edit form reusing the wizard step contents (each step becomes a section/tab on the edit page). Save persists to the same store. Delete removes the course and redirects to `/teach/courses`.
  - New mock store: [src/lib/mock/teacher-courses-state.ts](src/lib/mock/teacher-courses-state.ts) — `getTeacherCourses(accountId)`, `getCourseById(id)`, `addCourse(input)`, `updateCourse(id, patch)`, `deleteCourse(id)`, `subscribeTeacherCourses(cb)`. Seed from existing [src/lib/mock/courses.ts](src/lib/mock/courses.ts) teacher catalog at first read.
  - Have [src/components/teacher/courses-view.tsx](src/components/teacher/courses-view.tsx) subscribe to the new store so new wizard-published courses appear in the listing immediately.

- **Agent 5b — Request wizard Publish + Request edit page + lifecycle gap-fill**:
  - [src/components/requests/wizard-client.tsx](src/components/requests/wizard-client.tsx) — Publish (~L135-138) hard-codes `router.push("/requests/math-bac-revision-intensive")`. Wire it: build a `LearningRequest` payload from form state, `addRequest()` into a new mock store, `router.push("/requests/${newRequest.slug}")`, toast success.
  - Create `/requests/[id]/edit/page.tsx` — reuses the wizard step contents as an editable form (mirrors 5a's pattern for courses). The Edit toast Batch 3c emitted ("Coming soon") becomes a real navigate.
  - New mock store: [src/lib/mock/learning-requests-state.ts](src/lib/mock/learning-requests-state.ts) — `getRequests()`, `getRequestById(id)`, `addRequest(input)`, `updateRequest(id, patch)`, `deleteRequest(id)`, `subscribeRequests(cb)`. Seed from existing [src/lib/mock/requests.ts](src/lib/mock/requests.ts).
  - Have [src/components/requests/browse-client.tsx](src/components/requests/browse-client.tsx), [src/components/requests/my-client.tsx](src/components/requests/my-client.tsx), and [src/components/requests/detail-client.tsx](src/components/requests/detail-client.tsx) subscribe to the store so newly-published requests show up.

- **Agent 5c — Dispute open flow**:
  - [src/app/[locale]/disputes/disputes-shell.tsx](src/app/[locale]/disputes/disputes-shell.tsx) — add "+ Start a dispute" primary CTA at the top of the list. Opens a dialog (`Dialog` from `@/components/ui/dialog`) with a small form: which booking/session (Select populated from `bookings-state` + chat threads), reason category (Select), free-text description (Textarea), optional file uploads (no real upload — placeholder).
  - Add per-booking "Report a problem" action on the [account-shell.tsx](src/components/student/account-shell.tsx) "Recent bookings" subsection that Batch 4 created — opens the same dialog pre-filled with the booking.
  - New mock store: [src/lib/mock/disputes-state.ts](src/lib/mock/disputes-state.ts) — `getDisputes(accountId)`, `addDispute(input)`, `subscribeDisputes(cb)`. Seed from existing [src/lib/mock/disputes.ts](src/lib/mock/disputes.ts).
  - Have [disputes-shell.tsx](src/app/[locale]/disputes/disputes-shell.tsx) subscribe so new disputes appear in the list.

- **Agent 5d — Calendar role-branching + event interactivity**:
  - [src/app/[locale]/calendar/calendar-shell.tsx](src/app/[locale]/calendar/calendar-shell.tsx) — branch UI shell on `user?.role`. Teacher: keep current "Block time" sheet + sidebar block-form. Student: hide "Block time" affordance entirely, replace with a "Upcoming bookings" sidebar listing the user's confirmed bookings (already merged into events by Batch 4 — surface them as a list too).
  - [src/components/app/calendar/week-view.tsx](src/components/app/calendar/week-view.tsx) AND [src/components/app/calendar/month-view.tsx](src/components/app/calendar/month-view.tsx) — wire event-cell `onClick`: open a `Popover` (week-view already uses Popover; month-view already has popover scaffolding) with details + a CTA appropriate to the event kind (Reschedule for teacher availability blocks, Open booking for student bookings, Cancel for either).
  - Note: week-view is Batch 1 Agent A territory for scroll behavior — preserve that scroll behavior; only add click handlers, don't restructure the grid.

Cross-cutting constraints (every agent):
1. Use `@/lib/toast` `useToast()`.
2. Mutations through new module stores following [src/lib/mock/calendar-state.ts](src/lib/mock/calendar-state.ts) / [src/lib/mock/bookings-state.ts](src/lib/mock/bookings-state.ts) shape. Subscribers via `useSyncExternalStore`.
3. Identity via `useCurrentUser()` (client) or `getCurrentUser()` (server).
4. i18n: new keys go into appropriate namespace files (or new `messages/{fr,ar}/wizards.json` if a new namespace is cleaner; remember to register in [src/i18n/request.ts](src/i18n/request.ts)). Read → Edit for shared JSON files so parallel agents don't clobber.
5. Don't touch other agents' files. Don't touch Batch 6 territory (agency RIP, POLISH).
6. After your own work: `npx tsc --noEmit` clean.

After all four return: main thread runs final `tsc` + `next build`, appends summaries, marks Batch 5 done, proceeds to Batch 6.

### Batch 5 — Done

Four parallel sub-agents. Combined `npx tsc --noEmit` clean, `npx next build` clean.

**Agent 5a (course wizard + edit page)**:
- New store [src/lib/mock/teacher-courses-state.ts](src/lib/mock/teacher-courses-state.ts) — `getTeacherCourses(accountId)` / `getCourseById` / `addCourse` / `updateCourse` / `deleteCourse` / `subscribeTeacherCourses`. Per-account snapshot cache (frozen arrays). Seeded from `teacherCourses` in [src/lib/mock/dashboard.ts](src/lib/mock/dashboard.ts); seed rows tagged `accountId: "acc-khalil"`.
- [course-wizard.tsx](src/components/teacher/course-wizard.tsx) — lifted per-step state into a single parent `CourseDraft`; Publish/Publish later → `addCourse({status: "published"|"draft"})` + toast + `router.push("/teach/courses")`. Required-field validation (title + price) with jump-to-step on miss.
- [(dashboard)/courses/[id]/page.tsx](src/app/[locale]/teach/(dashboard)/courses/[id]/page.tsx) rebuilt: thin server component → `notFound()` if missing → mounts new [course-edit-form.tsx](src/components/teacher/course-edit-form.tsx) Tabs island (Basic/Format/Pricing/Description) with Save → `updateCourse` and Delete → confirm Dialog → `deleteCourse` + redirect.
- [courses-view.tsx](src/components/teacher/courses-view.tsx) — converted `useState` → `useSyncExternalStore`, mutators (Publish/Archive/Unarchive/Duplicate) repointed through the store. Agent 3b's dropdown handlers preserved end-to-end.
- i18n under `teacher.courses.wizard.*` and `teacher.courses.edit.*` (FR + AR).

**Agent 5b (request wizard + edit page)**:
- New store [src/lib/mock/learning-requests-state.ts](src/lib/mock/learning-requests-state.ts) — `getRequests` / `getRequestsByOwner` / `getRequestById` / `addRequest` / `updateRequest` / `deleteRequest` / `subscribeRequests`. Per-owner snapshot cache. Seeded from `learningRequests` in [src/lib/mock/requests.ts](src/lib/mock/requests.ts); `ownedByCurrentUser` rows pinned to `acc-lina`. Adjunct [src/lib/mock/request-labels.ts](src/lib/mock/request-labels.ts) for bilingual subject/city/level/audience/deadline label maps.
- [wizard-client.tsx](src/components/requests/wizard-client.tsx) — Publish now builds a real `NewRequestInput`, calls `addRequest({...payload, ownedBy: user.id})`, redirects to the new slug. Required-field validation with jump-to-step + danger toast. Wrapped in `useTransition`.
- New [requests/[id]/edit/page.tsx](src/app/[locale]/requests/[id]/edit/page.tsx) server component + [edit-form.tsx](src/components/requests/edit-form.tsx) client island (4 sections: Subject / Context / Logistics / Budget). Save → `updateRequest` + redirect; Cancel link; bonus Delete → `deleteRequest` + redirect to `/requests/my`.
- [proxy.ts](proxy.ts) — added regex `/^\/requests\/[^/]+\/edit\/?$/` to a new `GATED_REGEXES` array.
- [browse-client.tsx](src/components/requests/browse-client.tsx) / [my-client.tsx](src/components/requests/my-client.tsx) / [detail-client.tsx](src/components/requests/detail-client.tsx) — all subscribe via `useSyncExternalStore`; my-client + detail-client Edit handlers repoint from `editComingSoon` toast → `router.push("/requests/[slug]/edit")`. Close/Reopen/Accept/Delete handlers from Agent 3c repointed through `updateRequest` / `deleteRequest`.
- i18n under `requests.wizard.*` and `requests.edit.*` (FR + AR).

**Agent 5c (dispute open flow)**:
- New store [src/lib/mock/disputes-state.ts](src/lib/mock/disputes-state.ts) — `getDisputes(accountId?)` / `getDisputeById` / `addDispute` / `subscribeDisputes` / `EMPTY_DISPUTES`. Per-account snapshot cache. Seeded from `disputes` in [src/lib/mock/disputes.ts](src/lib/mock/disputes.ts); seed rows tagged `acc-lina`. New disputes get a `DSP-{base36 timestamp}` ID + one-entry timeline + counterparty resolved from optional `teacherSlug`.
- New [src/components/disputes/dispute-open-dialog.tsx](src/components/disputes/dispute-open-dialog.tsx) (370 LOC). Same trigger / controlled-open dual mode as `CheckoutDialog`. Form: Subject Select (current user's bookings + "Other"), Reason Select (4 categories), Description Textarea (min 20 chars, live counter), Attachments placeholder. Anonymous-gate via toast + `/sign-in` push. Submit → `addDispute` + toast + `router.push("/disputes/${id}")`.
- [disputes-shell.tsx](src/app/[locale]/disputes/disputes-shell.tsx) — added "+ Start a dispute" primary CTA at the header (controlled-open). List now `useSyncExternalStore`-subscribed.
- [account-shell.tsx](src/components/student/account-shell.tsx) — Recent bookings rows grew a `Flag`-icon "Report a problem" ghost button per row; single shared `DisputeOpenDialog` with `prefillBooking` driven by row-click state. Grid template extended `[...100px_auto_auto]` to give the new action its own column.
- i18n under `app.disputes.open.*` + `app.disputes.recentBookings.reportProblem` (FR + AR). Agent 3d's `app.disputes.toasts.*` block untouched.

**Agent 5d (calendar role-branching + event interactivity)**:
- [calendar-shell.tsx](src/app/[locale]/calendar/calendar-shell.tsx) — role branch: teacher keeps the existing "Block time" sheet + sidebar block-form; student gets a new `StudentBookingsRail` subcomponent (sort by soonest, kind pill, localized weekday-day-month-time, teacher name, online/in-person icon, each row a Popover trigger that mounts `EventPopover`). Block-form file untouched (Agent 3d's territory).
- New [event-popover.tsx](src/components/app/calendar/event-popover.tsx) (215 LOC). Props `{event, onAddBlock?}`. Renders popover body only (consumer wraps in `PopoverContent`). Action row branches by `event.status` × `user.role` — booked+student gets Open booking + Cancel booking (Cancel = "Coming soon" toast); blocked+teacher gets Edit/Remove (both "Coming soon" toasts — would need mutators on Agent 3d's calendar-state).
- [week-view.tsx](src/components/app/calendar/week-view.tsx) — wrapped `EventBlock`'s root in `<Popover><PopoverTrigger asChild><button>…</button></PopoverTrigger><PopoverContent><EventPopover/></PopoverContent></Popover>`. **Batch 1 Agent A's ScrollArea wrapping + `min-w-[640px]` + grid columns preserved**.
- [month-view.tsx](src/components/app/calendar/month-view.tsx) — each event `<li>` inside the existing `DayPopover` is now a nested Popover whose content is `EventPopover`. Day-cell popover scaffolding preserved.
- i18n under `app.calendar.event.{kind, actions, toasts}` + `app.calendar.studentRail.*` (FR + AR). Agent 3d's `app.calendar.toasts.*` untouched.

**Architectural item raised by 5c (folded into Batch 6)**: server-rendered detail pages that still read from the original static mocks won't see in-memory store mutations. Specifically [src/app/[locale]/disputes/[id]/page.tsx](src/app/[locale]/disputes/[id]/page.tsx) calls `findDispute` from `src/lib/mock/disputes.ts` — brand-new in-session disputes will 404 there. Same architectural pattern: any detail page that imports the original static mock instead of the new in-memory store needs the swap. Batch 6 should sweep:
- `/disputes/[id]/page.tsx` → `getDisputeById` (from disputes-state)
- `/requests/[id]/page.tsx` → `getRequestById` (from learning-requests-state) — 5b already swapped detail-CLIENT subscription but the server `findRequest` on the page may still need attention; verify.
- `/courses/[id]/page.tsx` (public course detail) → if a new wizard course is browsable publicly, may need `getCourseById` swap; verify.
- Cross-check `/teach/(dashboard)/courses/[id]/page.tsx` — 5a's rebuild uses `getCourseById` from the new store; should be fine.

**Deferred to Batch 6 or beyond:**
- Cancel booking / Remove block / Edit block — need new mutators on bookings-state / calendar-state; rendered as "Coming soon" toasts for now.
- `prefillThreadId` prop on `DisputeOpenDialog` accepted but unused — Batch 6 could wire a chat-thread → dispute entry point.
- Wizard fields (description, weeks, outcomes) collected into `CourseDraft` but not yet persisted because original `TeacherCourse` shape lacks them. Adding a superset type is a refactor that could land in polish.
- Edit-page bilingual title editing: edits only the active locale's field; the other locale keeps seeded text (acceptable for mock).
- `requests.toasts.editComingSoon` keys still in locale files but no longer referenced — safe to garbage-collect.

### Batch 6 — PENDING — RESUME HERE

**Agency rip + POLISH sweep.** Final batch. Single sequential agent (the polish scope is wide but the agency rip is tightly contained, so one agent can do both cleanly).

**Locked-in defaults that drive this batch:**
- 3. Agency RIP: remove `demo-agency` button (already done in Batch 2 sign-in form — verify), remove "Agency" subscription tier, fold `/teach/agency` into a teacher-side "Studio members" tab visible only if teacher has `parentAgencyId`. Drop footer "Agency" link. Keep `AgencyMember` type for future. No public `/agencies/[slug]`, no agency dashboard, no payouts.
- 4. Subscription model: keep the progressive revenue tier, rip the three Starter/Pro/Agency plans.

**Tasks:**

1. **Agency rip** (touches several files):
   - [src/components/nav/site-footer.tsx](src/components/nav/site-footer.tsx) — remove the "Agency" / "Studios" link from the footer columns.
   - [src/app/[locale]/teach/(dashboard)/agency/page.tsx](src/app/[locale]/teach/(dashboard)/agency/page.tsx) — convert from a standalone page to a tab/section on the teacher profile (or remove the page entirely if the audit allows). Simplest: keep the page accessible only when `user.teacherId` exists in `featuredTeachers` AND that record has `parentAgencyId`; show a "Members of {agency.name}" panel reusing the existing `AgencyMembers` component. Anonymous/non-agency-affiliated teachers visiting `/teach/agency` get a redirect to `/teach/dashboard` or a `notFound()`.
   - Drop the `/teach/agency` link from teacher sidebar/mobile-bar if `user.teacherId` not in any agency.
   - [src/app/[locale]/teach/(dashboard)/subscription/page.tsx](src/app/[locale]/teach/(dashboard)/subscription/page.tsx) — remove the Starter/Pro/Agency three-plan cards entirely; the progressive revenue tier visualization (already in [src/components/teacher/subscription-simulator.tsx](src/components/teacher/subscription-simulator.tsx)) stays. Drop the dialog-based plan Select that Agent 3b wired (or repurpose it for the tier selection if natural).
   - Verify [src/components/student/sign-in-form.tsx](src/components/student/sign-in-form.tsx) and [src/components/student/sign-up-form.tsx](src/components/student/sign-up-form.tsx) have no `demo-agency` button (Batch 2 should have already done this).
   - Search for any other agency references (`/teach/agency`, `parentAgencyId`, "Agency" tier copy in i18n, etc.) and surface or remove them.

2. **Detail-page store-swap sweep** (the 5c architectural finding):
   - [src/app/[locale]/disputes/[id]/page.tsx](src/app/[locale]/disputes/[id]/page.tsx) — swap `findDispute` import → `getDisputeById` from `@/lib/mock/disputes-state`.
   - [src/app/[locale]/requests/[id]/page.tsx](src/app/[locale]/requests/[id]/page.tsx) — verify it reads via `getRequestById`; if it still reads `findRequest`/`learningRequests` directly, swap.
   - [src/app/[locale]/courses/[id]/page.tsx](src/app/[locale]/courses/[id]/page.tsx) — if it should show wizard-published teacher courses, swap to read the store. If it's intentionally limited to the curated public catalog, document the decision.

3. **POLISH items from the audit** (cherry-pick from the POLISH list around lines 338-353 of this report — original):
   - Tabs underline animation / hover states for tap-only mobile (likely a CSS-only change to `src/components/ui/tabs.tsx`)
   - `Button size="sm"` (h-9, 36px) borderline tap target in dense kebab rows — bump to h-10 OR pad dense rows with `gap-1`
   - Account section sidebar full-width on tablet (768-1023) feels verbose — width tweak in [account-shell.tsx](src/components/student/account-shell.tsx)
   - Avatar stack on hero — wrap-to-two-lines on narrow viewports — Hero adjustment
   - Discover-menu popover collision behavior at 1024-1280px — Radix collisionPadding tweak
   - Top Rated tab in teacher profile is read-only with no "improve this" affordances — link to /teach/dashboard tips OR document as future
   - Onboarding-wizard reachable directly by URL; replayable forever — add a "completed onboarding" cookie/check, route past wizard if set
   - LanguageSwitcher not visible on `(auth)` pages — `(auth)/layout.tsx` strips SiteHeader — add a minimal language switcher in the auth layout
   - No "View public" icon next to course rows in `/teach/courses` — link icon → `/courses/{slug}`
   - Cancel-subscription dialog has no destructive-action confirmation pattern — Agent 3b wired it; consider adding type-the-word like Account Delete (might be polish-overkill — judgment call)

4. **Top-bar title map** ([src/components/teacher/top-bar.tsx](src/components/teacher/top-bar.tsx)) — add missing cases for `/teach/applications`, `/teach/ondemand`, `/messages` (audit MINOR; Batch 2 deferred).

5. **Stale `editComingSoon` keys** in [messages/{fr,ar}/requests.json](messages/fr/requests.json) — garbage-collect if no callsites remain.

6. **Out-of-batch from earlier**: dashboard mock at [src/lib/mock/dashboard.ts:29](src/lib/mock/dashboard.ts#L29) still pointing first session to `/teach/courses/c-math-bac` — verify this still resolves (Agent B added that slug to the mock); fix if not.

Constraints:
- Use `@/lib/toast` `useToast()`.
- Use `useCurrentUser()` / `getCurrentUser()`.
- Preserve all prior batches' work; this is the polish sweep.
- After: final `npx tsc --noEmit` + `npx next build` clean.
- Append closeout summary to this Progress Log when done, mark all 6 batches complete.

### Batch 6 — Done

One sequential agent (after a first crashed-at-socket attempt that finished Phase 1a/1b). Combined `npx tsc --noEmit` clean, `npx next build` clean (253 routes, proxy registered as middleware, no `MISSING_MESSAGE`).

**Phase 1 — Agency rip:**
- [src/components/nav/site-footer.tsx](src/components/nav/site-footer.tsx) — Agency / Studios link removed
- [src/lib/mock/teachers.ts](src/lib/mock/teachers.ts) — `Teacher.parentAgencyId?: string` added; new `findTeacherById(id)` helper. Yasmine Haddad (`t-yasmine`) seeded with `parentAgencyId: "ag-numidia"` so the Studio Members surface is testable
- [src/components/teacher/sidebar.tsx](src/components/teacher/sidebar.tsx) + [src/components/teacher/mobile-bar.tsx](src/components/teacher/mobile-bar.tsx) — `/teach/agency` nav link gated behind `findTeacherById(user?.teacherId)?.parentAgencyId`
- [src/app/[locale]/teach/(dashboard)/agency/page.tsx](src/app/[locale]/teach/(dashboard)/agency/page.tsx) — top-of-page server guard: redirects via next-intl `redirect({ href: "/teach/dashboard", locale })` if the teacher isn't affiliated
- [src/components/student/sign-in-form.tsx](src/components/student/sign-in-form.tsx) + [src/components/student/sign-up-form.tsx](src/components/student/sign-up-form.tsx) — `demo-agency` already filtered out via a 2-entry `DEMO_ACCOUNT_MAP` (verified)
- [src/app/[locale]/teach/(dashboard)/subscription/page.tsx](src/app/[locale]/teach/(dashboard)/subscription/page.tsx) — Starter/Pro/Agency three-card section removed (~60 LOC); progressive revenue tier (`subscription-simulator.tsx`) is the sole pricing model
- [src/components/teacher/subscription-actions.tsx](src/components/teacher/subscription-actions.tsx) — `PlanSelectButton` removed (no longer referenced)
- i18n cleanup: `teacher.subscription.compare.*` + `teacher.subscription.toasts.planChanged.*` dropped from both `messages/{fr,ar}/teacher.json`
- Grep verification: only expected residues — type field + seed, gating constants, no orphan navigation

**Phase 2 — Detail-page store-swap (architectural finding from 5c):**
- [src/app/[locale]/disputes/[id]/page.tsx](src/app/[locale]/disputes/[id]/page.tsx) — `findDispute` → `getDisputeById` from `@/lib/mock/disputes-state`. New in-session disputes opened via Batch 5c's "+ Start a dispute" now resolve.
- [src/app/[locale]/requests/[id]/page.tsx](src/app/[locale]/requests/[id]/page.tsx) — `getRequestBySlug` from `@/lib/mock/requests` → `getRequestById` from `@/lib/mock/learning-requests-state` (store accepts slug-or-id). `learningRequests` import kept only for `generateStaticParams` SSG seeding.
- [src/app/[locale]/courses/[id]/page.tsx](src/app/[locale]/courses/[id]/page.tsx) — **intentionally NOT swapped**. Public `Course` shape carries fields (`outcomes`, `syllabus`, `dates`, `teacher`, `language`, `includes`, `accent`) that `TeacherCourse` doesn't; wizard-published courses would crash `CourseDetail`. Documented inline. Teacher edit page already reads the store.
- [src/app/[locale]/teach/(dashboard)/courses/[id]/page.tsx](src/app/[locale]/teach/(dashboard)/courses/[id]/page.tsx) — verified Agent 5a wiring intact (reads `getCourseById` from `teacher-courses-state`).

**Phase 3 — POLISH (7 items shipped):**
- [src/components/teacher/top-bar.tsx](src/components/teacher/top-bar.tsx) — title map cases added for `/teach/applications`, `/teach/ondemand`, `/messages` (audit MINOR; Batch 2 deferred)
- [src/app/[locale]/(auth)/layout.tsx](src/app/[locale]/(auth)/layout.tsx) — `LanguageSwitcher` added in top-end corner (`absolute end-4 top-4 z-40`, pointer-events isolated)
- [src/components/teacher/courses-view.tsx](src/components/teacher/courses-view.tsx) — `ViewPublicLink` (lucide `ExternalLink`) per course row in both desktop table and mobile card; opens `/courses/{slug}` in new tab; table grid `48px` → `88px` action column. i18n key `teacher.courses.actions.viewPublic` (FR + AR)
- Stale `requests.toasts.editComingSoon` removed from `messages/{fr,ar}/requests.json` (no callsites left; calendar's own `app.calendar.event.toasts.editComingSoon` kept — still referenced by event-popover)
- [src/components/nav/discover-menu.tsx](src/components/nav/discover-menu.tsx) — `collisionPadding={16}` on `PopoverContent`
- [src/components/teacher/cancel-subscription.tsx](src/components/teacher/cancel-subscription.tsx) — type-the-word confirmation: Input with `dir="ltr"` placeholder, Confirm disabled until input matches `confirmWord` (case-insensitive); state reset on dialog open. i18n keys `teacher.subscription.cancel.{typeToConfirm,confirmWord}` (FR: "ANNULER", AR: "إلغاء")
- [src/components/marketing/hero.tsx](src/components/marketing/hero.tsx) — avatar stack `flex-nowrap`; trailing 6th avatar `hidden sm:inline-flex` (no 2-line wrap at 360px)
- [src/components/student/onboarding-wizard.tsx](src/components/student/onboarding-wizard.tsx) — sets `darso_onboarding_complete=1` cookie (1-year Max-Age, SameSite=Lax) on Finish; `useEffect` mount check → `router.replace("/browse")` if set

**Phase 4 — Verification:**
- `npx tsc --noEmit` clean
- `npx next build` clean (253 routes, proxy registered, no `MISSING_MESSAGE`)
- Final agency grep: only expected residues (type field + seed, gating logic, data-only `demo-agency` row filtered at UI layer)

**Deferred (per locked-in defaults or design judgment):**
- Public agency surfaces (`/agencies`, `/agencies/[slug]`) intentionally not created (locked-in default 3 — agency RIP)
- `AgencyMember` type retained in `src/lib/mock/agency.ts` for future
- `/courses/[id]/page.tsx` store-swap not done due to shape mismatch (documented inline)
- POLISH items intentionally skipped: Button size tap-target reshuffle, Top Rated tab improvements, Featured studios block, avatar tap-target audit, account-section sidebar tablet-width tweak, tabs underline animation — all judgment-heavy / design-call items for a future pass

---

## All Batches — Closed

| Batch | Scope | Status |
|---|---|---|
| 1 | Mechanical sweep — 5 parallel sub-agents (UI primitives, mock-data slugs, marketing/nav alignment, student/teacher copy + responsive, missing-route stubs) | ✓ Done |
| 2 | Mock auth foundation — cookie + context + proxy, sign-in/up wired, identity replacements, `/teach` split (Option B), authenticated SiteHeader, sign-out everywhere, `DashboardShell` refactor | ✓ Done |
| 3 | Behavior-layer sweep — 4 parallel sub-agents (account-shell, teacher dashboards, requests, dialogs/disputes/calendar/chat) — every dead button now mutates local state + toasts | ✓ Done |
| 4 | Booking funnel — 1 sequential (bookings store, shared CheckoutDialog with anonymous-gate, all 5 surfaces wired, writeback to /account + /calendar) | ✓ Done |
| 5 | Wizards + lifecycle — 4 parallel sub-agents (course wizard + edit page, request wizard + edit page, dispute open flow, calendar role-branching + event popovers) | ✓ Done |
| 6 | Agency rip + detail-page store-swap + POLISH cherry-picks | ✓ Done |

Final state: `npx tsc --noEmit` clean, `npx next build` clean (253 routes, proxy registered as middleware). The mockup is now a coherent, behaviorally-alive demo with mock auth, role-gated routes, working sign-out, end-to-end booking flow with writeback, wizards that persist input, working lifecycle on courses/requests/disputes, calendar role-branching, and the agency surface fully ripped.

---

## Phase 2 — Frontend Completion Pass

**Goal redefined:** the user wants a **polished, frontend-only mockup with mock data**, ready to be wired to real backend logic later. The bar shifted from Phase 1's "no broken buttons" to "every screen looks complete, the demo flow is seamless end-to-end, and nothing reads as a placeholder."

### Phase 2 — Design constraints (apply to ALL Phase 2 work)

These are **mandatory** for every agent working in Phase 2. Audit existing pages too — if a violation already exists, fix it.

1. **No bento grids.** Some pages currently use bento-style asymmetric tile grids (overlapping rectangles of varied sizes that look like a Notion landing page). Refactor to clean grids (`grid-cols-N`) or stacks. If a section needs visual rhythm, use scale/typography contrast, not bento tessellation.

2. **No AI-looking "underlined cards" or "side accent bar" cards.** Specifically: no `border-l-{color}` accent stripes on cards (e.g., the `border-l-accent` / `border-s-accent` / `before:` pseudo-element accent bars that appear in some agent-rail components), no cards whose only visual identity is a single bold underline at the top, no purple/blue gradient strips along card edges. These read as AI-template slop. Use the existing design tokens (`border-border`, `bg-card`, `shadow-e1/e2/e3`, accent colors used as fills or text only) for variation.

3. **Invoke the `impeccable` skill on every visual surface touched in Phase 2.** The skill exists to "design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface" — use it explicitly before declaring a surface "done." Apply its rules: visual hierarchy, information architecture, cognitive load, typography pairing, spacing rhythm, anti-pattern detection. If a page reads as generic / AI-template-y after your work, you didn't apply the skill hard enough.

**Concretely for the agents:** before considering any page complete, run a self-critique pass against these three constraints. List specific violations you found and removed in your closeout report. If you only changed behavior and didn't touch visual hierarchy, say so explicitly.

### Phase 2 — Stack / convention reminders (carry over from Phase 1)

- Next.js 16.2.9, React 19, Tailwind v4, Radix primitives, shadcn-style components, `next-intl` for i18n (FR + AR).
- AGENTS.md: "this is NOT the Next.js you know" — consult `node_modules/next/dist/docs/` for framework specifics.
- Toast: `import { useToast } from "@/lib/toast"`.
- Auth: client `useCurrentUser()` from `@/lib/auth`; server `getCurrentUser()` from `@/lib/auth/server`.
- next-intl `Link`/`useRouter`/`redirect` from `@/i18n/navigation`.
- i18n loader [src/i18n/request.ts](src/i18n/request.ts) registers files EXPLICITLY — new JSON namespaces must be added there.
- Locale JSON files: Read → Edit, never Write (avoids parallel-agent clobbering).
- Mock store pattern: see [src/lib/mock/bookings-state.ts](src/lib/mock/bookings-state.ts), [src/lib/mock/calendar-state.ts](src/lib/mock/calendar-state.ts), [src/lib/mock/teacher-courses-state.ts](src/lib/mock/teacher-courses-state.ts), [src/lib/mock/learning-requests-state.ts](src/lib/mock/learning-requests-state.ts), [src/lib/mock/disputes-state.ts](src/lib/mock/disputes-state.ts) — `get*`/`add*`/`update*`/`delete*`/`subscribe*` with per-account snapshot cache, frozen arrays for `useSyncExternalStore` referential stability. Subscribers via `useSyncExternalStore`.
- Backend-readiness: when adding a mock store, leave a `// TODO(backend): replace with fetch` comment at the top of the file so the future backend wiring is grep-friendly.

### Phase 2 — Locked-in defaults (still active from Phase 1)

1. Mock-only auth (cookie + React context).
2. In-memory + cookie persistence; resets on refresh.
3. Agency RIP (don't reintroduce; `AgencyMember` type kept for future).
4. Progressive revenue tier sole pricing model.
5. Missing routes use `<ComingSoon />` — **REVERSED in Phase 2 for the 16 stubbed pages**: Batch 7 replaces stubs with real layouts. New routes still use ComingSoon as a temporary fallback.
6. `/calendar` branched on role.
7. Demo identity fully role-aware.
8. **NEW** — Phase 2 design constraints above (no bento, no accent-bar cards, impeccable skill applied).

### Phase 2 — Batch plan (8 batches: 7-14)

Some can run in parallel within a tier. Tier ordering matters: Tier 1 unblocks Tier 2/3.

#### Tier 1 — Eliminate visible incompleteness

- **Batch 7** — Replace 16 ComingSoon stub pages with real layouts (parallel-safe: 1 agent per route family).
- **Batch 8** — Kill remaining "Coming soon" toasts where the in-session action could be real (cancel booking, remove block, edit block, `ensureThread`, course wizard field persistence, public `/courses/[id]` reading from store).
- **Batch 9** — Build the 4 missing feature surfaces (notifications bell in teacher chrome, `/teach/payouts`, analytics dashboards, teacher onboarding KYC, working `/search`).

#### Tier 2 — Deepen the demo

- **Batch 10** — Empty-state design pass + loading/transition states across every list view.
- **Batch 11** — Mock-data depth (8-10 teachers, 20+ courses, 10+ requests, 15+ reviews per top teacher; varied wilayas/subjects/price ranges).
- **Batch 12** — Invoice "view" mock (HTML invoice rendering as Dialog or `/account/invoices/[id]` page) + full-screen mock video-call room.

#### Tier 3 — Craft

- **Batch 13** — Visual polish + accessibility audit + responsive QA pass (manually walk every page at 360/768/1024/1440 in FR + AR).
- **Batch 14** — Backend-readiness scaffolding: `// TODO(backend)` comments on every mock store, type-safe `routes.ts` URL builder, error boundary + friendly error page, sign-in form polish (password strength meter, show/hide toggle, format validation, social-auth visual placeholders).

---

### Batch 7 — PENDING — RESUME HERE

**Replace 16 ComingSoon stub pages with real layouts.** Run as **3 parallel sub-agents** split by content family. Each agent owns its routes end-to-end (page composition + i18n + any new layout components scoped to the family).

**Apply Phase 2 design constraints rigorously.** Use the `impeccable` skill on every page. No bento grids. No accent-bar cards. Audit existing components (`hero.tsx`, `categories-grid.tsx`, etc.) — if they already violate the constraints, fix them; if you compose new sections, design them clean.

Routes to rebuild (currently `<ComingSoon />`):

- **Agent 7a — Marketing / about pages**: `/about`, `/how-it-works`, `/press`, `/careers`, `/blog`, `/teach/pricing`, `/teach/resources`. Each gets a real layout (hero block, content sections, CTAs). For `/blog` and `/press`, render 3-6 mock article cards. For `/careers`, render 4-8 mock job listings. For `/about`, tell the Darso story (mission, founding year, location, team). For `/teach/pricing`, surface the progressive revenue tier visually (no fake tier cards — use the existing `subscription-simulator.tsx` content). For `/teach/resources`, render a library of mock guides/templates (PDFs, video links — non-functional).
- **Agent 7b — Help / trust / contact / legal pages**: `/help`, `/trust`, `/contact`, `/legal/terms`, `/legal/privacy`, `/legal/cookies`. Help gets a help-center index (search bar + categorized FAQ accordion). Trust gets a trust-center layout (safety policies, verification badges, dispute process). Contact gets a contact form (form-only — submission toasts success, no real send). Legal pages get long-form legal text (mock Lorem-but-coherent FR + AR).
- **Agent 7c — Auth-adjacent + teacher event pages**: `/forgot` (password-reset request form — email input, validates, toasts "Reset link sent to {email}"), `/teach/events/new` (event-creation wizard — mirror the request wizard structure: title/date/format/capacity/price + Publish → toast + redirect to `/teach/events`), `/teach/events/[id]` (event edit page — Tabs form like Agent 5a's course-edit pattern).

**Cross-cutting per Agent 7x:**
- Reuse existing primitives (`SiteHeader`, `SiteFooter`, `Container`, `Badge`, `Button`, `Card`, `Tabs`, `Accordion`). Do NOT create one-off page-specific section components unless a pattern emerges across 3+ pages.
- All copy in FR + AR (add to appropriate locale namespace; create new `messages/{fr,ar}/marketing.json` namespace if shared marketing copy gets dense — register in [src/i18n/request.ts](src/i18n/request.ts)).
- Final: `npx tsc --noEmit` + `npx next build` clean. Append closeout to this Progress Log.

### Batch 8 — PENDING

**Kill remaining "Coming soon" toasts** that gate real in-session behavior. Single sequential agent (small scope).

1. **Calendar mutators** — extend [src/lib/mock/calendar-state.ts](src/lib/mock/calendar-state.ts) with `removeBlock(id)`, `updateBlock(id, patch)`. Extend [src/lib/mock/bookings-state.ts](src/lib/mock/bookings-state.ts) with `cancelBooking(id)` (flip status `"confirmed" → "cancelled"`). Then update [src/components/app/calendar/event-popover.tsx](src/components/app/calendar/event-popover.tsx) to wire Cancel/Remove/Edit to the new mutators instead of "Coming soon" toasts.
2. **`ensureThread(teacherSlug)`** — add to [src/lib/mock/chats.ts](src/lib/mock/chats.ts). Either returns the existing thread id for that teacher, or creates a new one + returns its id. Update CTAs that today do `router.push("/messages?to={slug}")` to call `ensureThread` then push to `/messages/[threadId]`. Surfaces: [teacher-profile.tsx](src/components/student/teacher-profile.tsx) "Send a message" (hero + sticky rail), [course-detail.tsx](src/components/student/course-detail.tsx) "Ask a question", [requests/detail-client.tsx](src/components/requests/detail-client.tsx) per-application "Message".
3. **Wizard course field persistence** — Batch 5a collected description/weeks/outcomes into `CourseDraft` but didn't persist (existing `TeacherCourse` shape lacked the fields). Decide: extend `TeacherCourse` to optionally carry those fields, or create a `TeacherCourseFull` superset. Update [src/lib/mock/teacher-courses-state.ts](src/lib/mock/teacher-courses-state.ts) and [src/components/teacher/course-wizard.tsx](src/components/teacher/course-wizard.tsx) accordingly. Update [src/components/teacher/course-edit-form.tsx](src/components/teacher/course-edit-form.tsx) to edit the full set.
4. **Public `/courses/[id]` shape reconciliation** — Batch 6 deferred this. Decide: (a) extend `TeacherCourse` with the public-shape fields (outcomes/syllabus/dates/teacher/language/includes/accent), defaulting to empty arrays where the wizard doesn't fill them; (b) write a `teacherCourseToPublicCourse(tc, teacher)` adapter; (c) build a separate `/courses/draft/[id]` for in-session courses. Pick (b) — it keeps the public catalog shape stable and lets the public page render either source. Update [src/app/[locale]/courses/[id]/page.tsx](src/app/[locale]/courses/[id]/page.tsx) to fall back to the adapter when not found in the curated catalog.

Final: `npx tsc --noEmit` + `npx next build` clean. Append closeout.

### Batch 9 — PENDING

**Build the 4 missing feature surfaces** flagged by Phase 1 audit. Run as **4 parallel sub-agents** (independent surfaces).

- **Agent 9a — Notifications bell in teacher chrome**: extend [src/components/teacher/top-bar.tsx](src/components/teacher/top-bar.tsx) with a notifications bell (lucide `Bell`) showing unread-count badge + Radix Popover with the same `notifications` list the student notifications page renders. Click any row → mark read + navigate. "View all" link → `/notifications`. Apply impeccable: don't use accent bars, do use density variation.
- **Agent 9b — `/teach/(dashboard)/payouts/page.tsx`**: new route. Sections: bank/RIB management (form with bank name, account holder, IBAN, BIC — mock validation), payout schedule (monthly cadence display, next payout date), payout history table (mock 6-12 past payouts with amounts, dates, status). Use the existing `useSyncExternalStore` pattern + new [src/lib/mock/payouts-state.ts](src/lib/mock/payouts-state.ts) (`getPayouts(accountId)`, `getPayoutMethod(accountId)`, `setPayoutMethod`). Add `/teach/payouts` to teacher sidebar nav.
- **Agent 9c — Analytics dashboards**: new routes `/teach/(dashboard)/analytics/page.tsx` and `/teach/(dashboard)/agency/analytics/page.tsx` (the latter gated by `parentAgencyId` like the agency page). KPI cards (Conversion rate, Retention, Refund rate, No-show rate) + time-series chart (use [src/components/teacher/revenue-trend.tsx](src/components/teacher/revenue-trend.tsx) as visual reference; if there's no charting lib installed, build a minimal SVG sparkline component — keep it tasteful, not bento, not AI-template). Period picker (7/30/90/365 days). Mock data via [src/lib/mock/analytics-state.ts](src/lib/mock/analytics-state.ts). Add link in teacher sidebar.
- **Agent 9d — Teacher onboarding + working `/search`**:
  - Teacher onboarding at `/teach/onboarding/page.tsx` (NEW): 4-step wizard — Identity verification (ID upload mock + selfie mock), Diploma & expertise (drag-drop file mock + subject pickers), Payout setup (bank form — same shape as 9b's), Terms acceptance (legal scroll + checkbox). Finish → `addAccount` updates teacher status + `router.push("/teach/dashboard")`. Add a gate on `/teach/(dashboard)` layout: if signed-in teacher hasn't completed onboarding, redirect there.
  - `/search/page.tsx`: verify what's currently there; if non-functional, wire as a global free-text search across teachers + courses + events. Single Input → debounced filter across the three stores → grouped results (sectioned by type). Empty state with category jump-links.

Final: combined `npx tsc --noEmit` + `npx next build` clean. Append closeouts.

### Batch 10 — PENDING

**Empty-state + loading/transition pass.** 2 parallel sub-agents.

- **Agent 10a — Empty-state audit & design**: walk every list view in the app and audit empty states. Where missing or weak, design a proper empty state: illustration/icon + headline + supporting copy + primary CTA. Surfaces to verify:
  - bookings empty (no upcoming, no past), payments history empty, disputes empty, notifications empty, reviews empty, applications empty, ondemand series empty, agency members empty (when no `parentAgencyId`), calendar empty (no events this week), favorites empty, search results empty, requests browse empty, my-requests empty, teacher courses-view empty, teacher events empty
  - Each empty state copy in FR + AR
  - Use the `impeccable` skill: empty states are a common AI-template tell (centered illustration + generic copy) — make them feel intentional, on-brand
- **Agent 10b — Loading / transition pass**: every store mutation (forms, wizards, dialogs, deletes) gets `useTransition` pending state with disabled buttons + spinner. Long-rendering server components get skeleton fallbacks via `loading.tsx` files where appropriate. Examples to wire:
  - All wizard Publish/Save buttons (course, request, event)
  - Account-shell change-password Submit, delete-account Confirm
  - DisputeOpenDialog Submit
  - CheckoutDialog Confirm (already partially wired — verify)
  - `loading.tsx` for `/teach/(dashboard)`, `/account`, `/messages/[threadId]`, `/disputes/[id]`, `/requests/[id]`
  - Skeleton component primitive: add [src/components/ui/skeleton.tsx](src/components/ui/skeleton.tsx) if missing (simple `<div className="animate-pulse rounded bg-surface" />` pattern)

Final: `npx tsc --noEmit` + `npx next build` clean.

### Batch 11 — PENDING

**Mock-data depth.** Single sequential agent (heavy editing in one area: `src/lib/mock/`).

Currently the seed data feels thin in demos (2 teachers, a handful of courses, etc.). Expand:
- [src/lib/mock/teachers.ts](src/lib/mock/teachers.ts): 8-10 featured teachers across subjects (math, languages, programming, music, sciences) and wilayas (Alger, Oran, Constantine, Annaba, Tizi Ouzou, Tlemcen, Sétif, Béjaïa, Ghardaïa). Mix of price ranges, ratings, response times, formats (online-only / hybrid / in-person-only), top-rated badges, verification states. One additional teacher pinned to `parentAgencyId: "ag-numidia"`.
- [src/lib/mock/courses.ts](src/lib/mock/courses.ts): 20+ courses spread across the teachers, varied formats (1-to-1, cohort, event, on-demand), varied dates (past/now/future), varied seat counts (sold-out / nearly-full / spacious / empty).
- [src/lib/mock/requests.ts](src/lib/mock/requests.ts): 10+ learning requests with varied subjects, budgets, wilayas, deadlines, statuses.
- [src/lib/mock/reviews.ts](src/lib/mock/reviews.ts) (or wherever teacher reviews live): 15+ reviews per top-rated teacher; mix of star ratings (mostly 4-5, some 3); responses from teacher to some reviews; some long-form, some short.
- [src/lib/mock/dashboard.ts](src/lib/mock/dashboard.ts): more action items, more pending requests, varied teacher dashboard inbox.
- [src/lib/mock/disputes.ts](src/lib/mock/disputes.ts): one dispute per state (`open`, `awaiting_other_party`, `mediation`, `resolved`, `cancelled`) so the demo shows each status visually.

Don't touch the in-memory stores' mutation logic (they seed from these mocks at module load). Just expand the seeds.

Final: `npx tsc --noEmit` + `npx next build` clean.

### Batch 12 — PENDING

**Invoice mock + video-call mock.** Single sequential agent.

1. **Invoice view**: new route `/account/invoices/[id]/page.tsx` rendering a styled HTML invoice (Darso letterhead, line items, totals, payment method footer). Looks like a real printable invoice. Wire from the existing "Download invoice" toast (Batch 3a) — instead of just toasting, open the invoice in a new tab. New i18n keys `student.account.invoice.*` (FR + AR).
2. **Video-call full-screen mock**: new route `/call/[sessionId]/page.tsx`. Full-bleed dark UI with: participant tile grid (2-4 mock tiles with avatar fallbacks), mute/camera/screen-share/leave buttons (non-functional, just visual + tooltips), chat sidebar (mock messages), participant list. "Join video call" CTA in [chat-thread.tsx](src/components/app/chat/chat-thread.tsx) (Batch 3d) currently toasts; change to `router.push("/call/{sessionId}")`. Live page "Open room" same. New i18n keys `app.call.*` (FR + AR).

Apply impeccable: video-call UI is a common AI-template trap (purple gradients, glassmorphism overload). Keep it editorial: clean dark surface, restrained accents, real typography hierarchy.

Final: `npx tsc --noEmit` + `npx next build` clean.

### Batch 13 — PENDING

**Visual polish + accessibility + responsive QA.** 3 parallel sub-agents.

- **Agent 13a — Visual polish + design-constraint enforcement sweep**: walk every page; check for bento grids, accent-bar cards, AI-looking sections. Specifically audit (and refactor):
  - Calendar `StudentBookingsRail` (Batch 5d) — verify it doesn't use accent-bar styling
  - Reviews "replies" rendering with `CornerDownRight` accent stripe (Batch 3b reviews-list) — refactor to non-stripe pattern
  - Any `border-l-` / `border-s-` accent stripes on cards across student/teacher/marketing components
  - Any bento-tile sections in marketing pages (hero, categories grid, testimonials)
  - Tabs underline animation (audit POLISH)
  - Button `size="sm"` tap-targets in dense kebab rows
  - Top Rated tab in teacher profile — add tasteful "improve this" affordances
  - Account section sidebar tablet-width tweak
  - Featured studios block? — SKIP per agency RIP. Not adding any agency-marketing surface.
- **Agent 13b — Accessibility audit**: focus rings on every interactive element, ARIA labels on icon-only buttons, alt text on every `<img>`, color contrast against tokens, keyboard navigation for all custom widgets (popovers, dialogs, dropdowns, tabs), screen-reader-friendly empty states, semantic HTML (proper `<main>`, `<section>`, `<article>`, heading hierarchy), `prefers-reduced-motion` honored on animations, RTL parity check (every layout works in `dir="rtl"` — caught issues at the actual browser level).
- **Agent 13c — Responsive QA pass**: manually walk every route at 360/768/1024/1440 in FR + AR. Catalog overflow, wrap, truncation issues. Fix per page. Cover: marketing pages, student app, teacher dashboard, account, calendar, messages, requests, disputes, notifications, all wizards, all dialogs.

Final: combined `npx tsc --noEmit` + `npx next build` clean.

### Batch 14 — PENDING

**Backend-readiness scaffolding.** Single sequential agent.

1. **`// TODO(backend)` markers**: on every mock store at [src/lib/mock/*-state.ts](src/lib/mock/) add a top-of-file comment block explaining: what shape the backend should return, which endpoint(s) map to which exports, what the cache invalidation contract is. Format consistent across all stores. This makes the backend wiring a grep-and-replace per store, not a hunt.
2. **Type-safe `routes.ts`**: new [src/lib/routes.ts](src/lib/routes.ts) exporting helpers like `routes.teacher(slug)`, `routes.course(slug)`, `routes.request(id)`, `routes.disputeDetail(id)`, etc. Refactor existing string-literal `/teachers/${slug}` etc. across the codebase to use the helpers. Reduces broken-link risk during future refactors.
3. **Error boundary**: add [src/app/[locale]/error.tsx](src/app/[locale]/error.tsx) (Next.js 16 convention) — friendly error page with "Try again" button + link home. Plus a global [src/app/[locale]/not-found.tsx](src/app/[locale]/not-found.tsx) if missing.
4. **Sign-in / sign-up form polish**: password strength meter component, show/hide password toggle, inline email format validation, social-auth visual placeholder buttons (Google + Apple — non-functional, just visual). Apply impeccable: don't make these look like the standard shadcn auth template.

Final: `npx tsc --noEmit` + `npx next build` clean. After Batch 14 lands, Phase 2 is closed.

---

### Maintenance rule

After each agent or batch completes, append a short summary to this Progress Log (what was done, what was deferred, typecheck status). The Progress Log is the durable handoff — if a chat session ends mid-work, the next chat reads this file and resumes from "PENDING — RESUME HERE" (currently **Batch 7 in Phase 2**).

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
