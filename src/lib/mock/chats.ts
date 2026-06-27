/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/messages/threads        → seeds initial state for getChatThreads
 *   POST   /api/messages/threads        → ensureThread(teacherSlug) (idempotent on teacherSlug)
 *   POST   /api/messages/threads/:id    → append message to a thread
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return ChatThread[] matching the type below.
 * Cache invalidation: every mutation should invalidate the snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */
import { featuredTeachers, findTeacherById, type Teacher, type LocalizedString } from "./teachers";

export type ChatKind = "1to1" | "cohort" | "event";
export type MessageStatus = "sent" | "delivered" | "read";

export type ChatMessage = {
  id: string;
  /** "u-self" for the current student, otherwise a teacher / participant id */
  authorId: string;
  authorName?: LocalizedString;
  authorInitials?: string;
  authorAccent?: string;
  /** ISO datetime */
  at: string;
  text?: LocalizedString;
  /** A system message — no bubble, italic, centered */
  system?: LocalizedString;
  status?: MessageStatus;
  reactions?: { emoji: string; count: number; mine?: boolean }[];
  /** Attachments (read-only mock) */
  attachments?: {
    id: string;
    name: string;
    kind: "image" | "pdf" | "audio" | "doc";
    sizeKb: number;
  }[];
};

export type ChatParticipant = {
  id: string;
  name: LocalizedString;
  initials: string;
  accent: string;
  /** Optional role label inside group chats */
  role?: LocalizedString;
};

export type ChatThread = {
  id: string;
  kind: ChatKind;
  title: LocalizedString;
  /** For 1:1 threads, the single counterparty (teacher) */
  teacher?: Teacher;
  /** For group threads, all participants (excl. current user) */
  participants?: ChatParticipant[];
  /** Optional course / event link */
  courseLink?: { label: LocalizedString; href: string };
  unread: number;
  pinned?: boolean;
  muted?: boolean;
  /** Whether the counterparty is currently online */
  online?: boolean;
  lastActiveLabel?: LocalizedString;
  messages: ChatMessage[];
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;

const isoMinutesAgo = (mins: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d.toISOString();
};
const isoHoursAgo = (h: number) => isoMinutesAgo(h * 60);
const isoDaysAgo = (d: number) => isoHoursAgo(d * 24);

export const currentUser = {
  id: "u-self",
  name: { fr: "Lina M.", ar: "لينا م." } as LocalizedString,
  initials: "LM",
  accent: "from-[#2F6BFF] to-[#3E8FD0]",
};

// Seed list — held in a module-scoped `let` so the `ensureThread`
// mutator can prepend new 1:1 threads in-session. Consumers that want
// the live list should call `getChatThreads()` (and subscribe via
// `subscribeChats`); the legacy named export still points at the same
// underlying array for SSR/static callers, but is frozen-by-convention.
let chatThreads: ChatThread[] = [
  // 1:1 — Khalil (math teacher), with recent thread
  {
    id: "th-khalil",
    kind: "1to1",
    title: { fr: "Khalil Bensaïd", ar: "خليل بن سعيد" },
    teacher: t("t-khalil"),
    unread: 2,
    online: true,
    courseLink: {
      label: { fr: "Math Bac · 8 séances", ar: "رياضيات الباك · 8 حصص" },
      href: "/courses/math-bac",
    },
    messages: [
      {
        id: "m-k-1",
        authorId: "t-khalil",
        at: isoDaysAgo(2),
        text: {
          fr: "Salut Lina, on attaque les dérivées demain à 9h ?",
          ar: "أهلا لينا، نبدأ بالمشتقّات غدًا على 9 صباحًا؟",
        },
        status: "read",
      },
      {
        id: "m-k-2",
        authorId: "u-self",
        at: isoDaysAgo(2),
        text: { fr: "Parfait, j'ai révisé les limites cette semaine.", ar: "ممتاز، راجعت النهايات هذا الأسبوع." },
        status: "read",
      },
      {
        id: "m-k-3",
        authorId: "t-khalil",
        at: isoDaysAgo(1),
        text: { fr: "Voici la fiche d'exercices.", ar: "إليك ورقة التمارين." },
        attachments: [{ id: "a-1", name: "derivees-serie-3.pdf", kind: "pdf", sizeKb: 612 }],
        status: "read",
      },
      {
        id: "m-k-sys",
        authorId: "system",
        at: isoHoursAgo(20),
        system: {
          fr: "Séance confirmée pour demain · 09h00 — 10h30 (en ligne).",
          ar: "تم تأكيد الحصة لغد · 09:00 — 10:30 (عبر الإنترنت).",
        },
      },
      {
        id: "m-k-4",
        authorId: "u-self",
        at: isoHoursAgo(3),
        text: { fr: "Question rapide sur l'exercice 4 — la limite vaut 0 ou ∞ ?", ar: "سؤال سريع حول التمرين 4 — هل النهاية 0 أم ∞؟" },
        status: "delivered",
        reactions: [{ emoji: "👀", count: 1 }],
      },
      {
        id: "m-k-5",
        authorId: "t-khalil",
        at: isoMinutesAgo(12),
        text: { fr: "0 — passe par la règle de L'Hôpital, ça tombe direct.", ar: "0 — استعملي قاعدة لوبيتال، تنحلّ مباشرة." },
        status: "delivered",
      },
    ],
  },
  // 1:1 — Yasmine (IELTS) — unread
  {
    id: "th-yasmine",
    kind: "1to1",
    title: { fr: "Yasmine Haddad", ar: "ياسمين حدّاد" },
    teacher: t("t-yasmine"),
    unread: 4,
    online: false,
    lastActiveLabel: { fr: "il y a 1 h", ar: "منذ ساعة" },
    courseLink: { label: { fr: "IELTS 7+ · objectif", ar: "IELTS 7+ · الهدف" }, href: "/courses/ielts-7" },
    messages: [
      {
        id: "m-y-1",
        authorId: "t-yasmine",
        at: isoDaysAgo(1),
        text: { fr: "Hi! Ready for tonight's mock?", ar: "أهلا! جاهزة لاختبار الليلة التجريبي؟" },
        status: "read",
      },
      {
        id: "m-y-2",
        authorId: "u-self",
        at: isoDaysAgo(1),
        text: { fr: "Yes — slightly nervous though.", ar: "نعم، لكن متوتّرة قليلًا." },
        status: "read",
      },
      {
        id: "m-y-3",
        authorId: "t-yasmine",
        at: isoHoursAgo(2),
        text: { fr: "Don't worry. Try this warm-up — 1 minute, any topic.", ar: "لا تقلقي. جرّبي تمرين الإحماء — دقيقة واحدة، أي موضوع." },
        attachments: [{ id: "a-2", name: "warmup-prompt.pdf", kind: "pdf", sizeKb: 121 }],
      },
      {
        id: "m-y-4",
        authorId: "t-yasmine",
        at: isoHoursAgo(1),
        text: { fr: "And here is the rubric we'll use.", ar: "وهذه شبكة التقييم التي سنستخدمها." },
      },
    ],
  },
  // Cohort group — React
  {
    id: "th-react-cohort",
    kind: "cohort",
    title: { fr: "Cohorte React · 12 élèves", ar: "فوج React · 12 طالب" },
    participants: [
      { id: "t-amine", name: { fr: "Amine Cherif", ar: "أمين شريف" }, initials: "AC", accent: "from-[#3E8FD0] to-[#2F6BFF]", role: { fr: "Prof", ar: "أستاذ" } },
      { id: "u-rim", name: { fr: "Rim B.", ar: "ريم ب." }, initials: "RB", accent: "from-[#2E9E78] to-[#3E8FD0]" },
      { id: "u-walid", name: { fr: "Walid M.", ar: "وليد م." }, initials: "WM", accent: "from-[#DDA13A] to-[#DD514D]" },
    ],
    unread: 7,
    online: true,
    courseLink: { label: { fr: "React from scratch · sem 3/6", ar: "React من الصفر · أسبوع 3/6" }, href: "/courses/react-from-scratch" },
    messages: [
      {
        id: "m-r-sys",
        authorId: "system",
        at: isoDaysAgo(1),
        system: { fr: "Semaine 3 commence ce soir à 20h00.", ar: "يبدأ الأسبوع 3 الليلة على 20:00." },
      },
      {
        id: "m-r-1",
        authorId: "t-amine",
        authorName: { fr: "Amine Cherif", ar: "أمين شريف" },
        authorInitials: "AC",
        authorAccent: "from-[#3E8FD0] to-[#2F6BFF]",
        at: isoHoursAgo(5),
        text: { fr: "Petit recap avant ce soir : useState, useEffect, et un soupçon de useMemo.", ar: "ملخص سريع قبل الليلة: useState، useEffect، ولمسة useMemo." },
      },
      {
        id: "m-r-2",
        authorId: "u-rim",
        authorName: { fr: "Rim B.", ar: "ريم ب." },
        authorInitials: "RB",
        authorAccent: "from-[#2E9E78] to-[#3E8FD0]",
        at: isoHoursAgo(4),
        text: { fr: "J'ai pas compris useMemo honnêtement…", ar: "بصراحة لم أفهم useMemo…" },
        reactions: [{ emoji: "👍", count: 3, mine: true }],
      },
      {
        id: "m-r-3",
        authorId: "u-walid",
        authorName: { fr: "Walid M.", ar: "وليد م." },
        authorInitials: "WM",
        authorAccent: "from-[#DDA13A] to-[#DD514D]",
        at: isoHoursAgo(3),
        text: { fr: "Pareil, on peut faire un focus ?", ar: "مثلي، نقدر نركّز على هذا؟" },
      },
      {
        id: "m-r-4",
        authorId: "t-amine",
        authorName: { fr: "Amine Cherif", ar: "أمين شريف" },
        authorInitials: "AC",
        authorAccent: "from-[#3E8FD0] to-[#2F6BFF]",
        at: isoMinutesAgo(40),
        text: { fr: "Noté. 20 min dédiées à useMemo + exos en direct.", ar: "تمّ. 20 دقيقة مخصّصة لـ useMemo + تمارين مباشرة." },
      },
    ],
  },
  // Event group — IELTS workshop
  {
    id: "th-ielts-workshop",
    kind: "event",
    title: { fr: "Atelier IELTS · 12 inscrits", ar: "ورشة IELTS · 12 مشاركًا" },
    participants: [
      { id: "t-yasmine", name: { fr: "Yasmine Haddad", ar: "ياسمين حدّاد" }, initials: "YH", accent: "from-[#2E9E78] to-[#3E8FD0]", role: { fr: "Prof", ar: "أستاذة" } },
      { id: "u-self", name: { fr: "Lina M.", ar: "لينا م." }, initials: "LM", accent: "from-[#2F6BFF] to-[#3E8FD0]" },
      { id: "u-hadia", name: { fr: "Hadia K.", ar: "هادية ك." }, initials: "HK", accent: "from-[#1C3A5E] to-[#2F6BFF]" },
    ],
    unread: 0,
    online: false,
    courseLink: { label: { fr: "IELTS Speaking · workshop", ar: "IELTS التحدّث · ورشة" }, href: "/events/ielts-workshop" },
    messages: [
      {
        id: "m-w-1",
        authorId: "t-yasmine",
        authorName: { fr: "Yasmine Haddad", ar: "ياسمين حدّاد" },
        authorInitials: "YH",
        authorAccent: "from-[#2E9E78] to-[#3E8FD0]",
        at: isoDaysAgo(2),
        text: { fr: "Reminder: 30 mins early to check audio.", ar: "تذكير: تواجدوا قبل 30 دقيقة لاختبار الصوت." },
      },
    ],
  },
  // 1:1 — Souad (Coran)
  {
    id: "th-souad",
    kind: "1to1",
    title: { fr: "Souad Belkacem", ar: "سعاد بلقاسم" },
    teacher: t("t-souad"),
    unread: 0,
    online: false,
    lastActiveLabel: { fr: "hier", ar: "أمس" },
    messages: [
      {
        id: "m-s-1",
        authorId: "t-souad",
        at: isoDaysAgo(1),
        text: { fr: "Barakallahu fiki pour la récitation de la semaine.", ar: "بارك الله فيك على تلاوة هذا الأسبوع." },
        status: "read",
      },
      {
        id: "m-s-2",
        authorId: "u-self",
        at: isoDaysAgo(1),
        text: { fr: "Merci ! Sourate prochaine ?", ar: "شكرًا! ما السورة القادمة؟" },
        status: "read",
      },
      {
        id: "m-s-3",
        authorId: "t-souad",
        at: isoHoursAgo(20),
        text: { fr: "Al-Mulk — on commence vendredi.", ar: "الملك — نبدأ يوم الجمعة." },
        status: "read",
      },
    ],
  },
  // 1:1 — Rayan
  {
    id: "th-rayan",
    kind: "1to1",
    title: { fr: "Rayan Otmani", ar: "ريان عثماني" },
    teacher: t("t-rayan"),
    unread: 1,
    online: false,
    lastActiveLabel: { fr: "il y a 3 h", ar: "منذ 3 ساعات" },
    messages: [
      {
        id: "m-py-1",
        authorId: "t-rayan",
        at: isoHoursAgo(3),
        text: { fr: "Petite vidéo de l'accord à travailler.", ar: "فيديو قصير للوتر الذي سنشتغل عليه." },
        attachments: [{ id: "a-3", name: "chord-progression.mp4", kind: "audio", sizeKb: 4210 }],
      },
    ],
  },
];

/** Quick lookup */
export function findThread(id: string): ChatThread | undefined {
  return chatThreads.find((t) => t.id === id);
}

/** Common emojis for the reaction picker */
export const commonEmojis = ["👍", "❤️", "🙏", "🎯", "🔥", "✅", "👀"];

// ────────────────────────────────────────────────────────────────────────
// In-session mutator store
//
// `chatThreads` was historically a `const` array consumed directly by the
// inbox shell + thread page. To wire student → teacher "Send a message"
// CTAs into a real thread, we need to (a) look up an existing 1:1 thread
// for the given teacher, and (b) create one when missing. The new
// `ensureThread` returns the thread id and notifies subscribers so any
// component subscribed via `useSyncExternalStore` re-renders with the
// new thread visible. Mirrors the calendar-state.ts / bookings-state.ts
// snapshot-cache pattern.
// ────────────────────────────────────────────────────────────────────────

const listeners = new Set<() => void>();
let threadsCache: readonly ChatThread[] | null = null;

function invalidate() {
  threadsCache = null;
  listeners.forEach((fn) => fn());
}

/**
 * Frozen snapshot of the current thread list. Stays referentially stable
 * across renders until `ensureThread` (or any future mutator) invalidates
 * the cache. Safe for `useSyncExternalStore.getSnapshot`.
 */
export function getChatThreads(): readonly ChatThread[] {
  if (threadsCache) return threadsCache;
  threadsCache = Object.freeze(chatThreads.slice());
  return threadsCache;
}

export function subscribeChats(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Returns the id of the 1:1 thread between the current user and the
 * teacher identified by `teacherSlug`, creating one on the fly when none
 * exists. The created thread has no seeded messages — the conversation
 * starts from the student's first send.
 *
 * `currentUserId` is accepted for parity with the eventual backend shape
 * (server would scope the lookup by viewer), but in the mock there's a
 * single `currentUser` per session so the parameter is currently used
 * only for the deterministic thread id.
 */
export function ensureThread(teacherSlug: string, currentUserId: string): string {
  // 1) Existing 1:1 thread that matches by teacher.slug.
  const existing = chatThreads.find(
    (t) => t.kind === "1to1" && t.teacher?.slug === teacherSlug,
  );
  if (existing) return existing.id;

  // 2) Resolve the teacher record. featuredTeachers exposes `slug`
  //    alongside id; fall back to the first teacher only if the slug is
  //    genuinely unknown (defensive — surfaces should always pass a
  //    valid slug).
  const teacher =
    featuredTeachers.find((t) => t.slug === teacherSlug) ??
    findTeacherById(teacherSlug);
  if (!teacher) {
    // Don't create a thread for an unknown teacher — return the inbox
    // root id so the caller can route to /messages instead.
    return "";
  }

  const id = `th-${teacher.id.replace(/^t-/, "")}-${Date.now().toString(36)}`;
  const fresh: ChatThread = {
    id,
    kind: "1to1",
    title: teacher.name,
    teacher,
    unread: 0,
    online: false,
    messages: [
      {
        id: `m-${id}-sys`,
        authorId: "system",
        at: new Date().toISOString(),
        system: {
          fr: `Nouvelle conversation avec ${teacher.name.fr}.`,
          ar: `محادثة جديدة مع ${teacher.name.ar}.`,
        },
      },
    ],
  };
  // Surface the new thread at the top of the inbox so the student sees
  // it immediately on /messages.
  chatThreads = [fresh, ...chatThreads];
  void currentUserId;
  invalidate();
  return id;
}
