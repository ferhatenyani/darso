/**
 * Adapter from the teacher-authored `TeacherCourse` shape (held in
 * teacher-courses-state.ts) to the public-facing `Course` shape used by
 * `/courses/[id]` and the marketing CourseCard. The wizard collects a
 * subset of the public fields (title, format, price, description, weeks,
 * outcomes) — everything else falls back to empty arrays / sensible
 * defaults so the public page renders without blowing up.
 *
 * Trade-off: wizard-published courses render with minimal data; curated
 * `src/lib/mock/courses.ts` courses keep their richer presentation
 * (syllabus, dates, includes, accent). This is acceptable for the mock
 * and lets the public detail page resolve any in-session course id
 * without the catalog growing.
 *
 * Used by `src/app/[locale]/courses/[id]/page.tsx` as the fallback when
 * the curated catalog lookup misses.
 */
import { findTeacherById, featuredTeachers, type Teacher, type LocalizedString } from "./teachers";
import type { TeacherCourse } from "./teacher-courses-state";
import type { Course, CourseFormat, CourseLevel } from "./courses";

const DEFAULT_ACCENT = "from-[#1C3A5E] to-[#2F6BFF]";

function mirroredLocalized(text: string | undefined): LocalizedString | null {
  if (!text || !text.trim()) return null;
  return { fr: text, ar: text };
}

function inferLevel(audience: TeacherCourse["audience"]): CourseLevel {
  switch (audience) {
    case "kids":
      return "beginner";
    case "lycee":
      return "intermediate";
    case "students":
      return "advanced";
    case "adults":
    default:
      return "any";
  }
}

function inferLanguageList(language: TeacherCourse["language"]): { fr: string[]; ar: string[] } {
  // Match the existing curated catalog convention: list the primary
  // teaching language first, then fall back to the bilingual default.
  switch (language) {
    case "fr":
      return { fr: ["FR"], ar: ["FR"] };
    case "ar":
      return { fr: ["AR"], ar: ["AR"] };
    case "en":
      return { fr: ["EN", "FR"], ar: ["EN", "FR"] };
    default:
      return { fr: ["FR", "AR"], ar: ["AR", "FR"] };
  }
}

/**
 * Project a wizard-published course onto the public `Course` shape so
 * the marketing detail page can render it. Pass an explicit `teacher`
 * when the caller already has the record; otherwise we look it up by
 * the `accountId → teacherId` convention used by the seeded mock
 * (`acc-khalil` ↔ `t-khalil`). Falls back to the first featured teacher
 * if no association is found, so the page still renders rather than 404.
 */
export function teacherCourseToPublicCourse(
  tc: TeacherCourse,
  teacher?: Teacher,
): Course {
  const resolvedTeacher: Teacher =
    teacher ?? findTeacherById(deriveTeacherId(tc)) ?? featuredTeachers[0]!;

  const format = tc.format as CourseFormat;
  const language = inferLanguageList(tc.language);

  const titleLocalized = tc.title;
  const subtitleLocalized: LocalizedString =
    mirroredLocalized(tc.summary) ?? {
      fr: tc.title.fr,
      ar: tc.title.ar,
    };

  const outcomesLocalized: LocalizedString[] = (tc.outcomes ?? [])
    .map((o) => mirroredLocalized(o))
    .filter((x): x is LocalizedString => !!x);

  // `weeks` becomes a single syllabus section listing each week as a
  // line item — keeps the Accordion happy without forcing the wizard to
  // collect nested per-week items.
  const syllabus =
    tc.weeks && tc.weeks.length > 0
      ? [
          {
            title: { fr: "Programme", ar: "البرنامج" } as LocalizedString,
            items: tc.weeks
              .map((w) => mirroredLocalized(w))
              .filter((x): x is LocalizedString => !!x),
          },
        ]
      : [];

  const durationLabel: { fr: string; ar: string } = tc.weeks && tc.weeks.length > 0
    ? {
        fr: `${tc.weeks.length} semaine${tc.weeks.length > 1 ? "s" : ""}`,
        ar: `${tc.weeks.length} أسابيع`,
      }
    : format === "1to1"
      ? { fr: "Sessions de 60 min", ar: "جلسات 60 د" }
      : { fr: "Programme à venir", ar: "البرنامج قريبًا" };

  return {
    id: tc.id,
    slug: tc.id, // teacher-courses-state uses `c-<slug>-<ts>` as id; no separate slug
    teacher: resolvedTeacher,
    title: titleLocalized,
    subtitle: subtitleLocalized,
    subject: resolvedTeacher.subject,
    format,
    level: inferLevel(tc.audience),
    durationLabel,
    priceDzd: tc.priceDzd,
    rating: 0,
    reviews: 0,
    outcomes: outcomesLocalized,
    includes: [],
    syllabus,
    dates: [],
    accent: DEFAULT_ACCENT,
    language,
  };
}

// teacher-courses-state stores an `accountId` (e.g. "acc-khalil") on
// each StoredCourse, but strips it before returning the public read.
// Public callers therefore can't see the link directly; we mirror the
// seeded mock's convention (`acc-<id>` ↔ `t-<id>`) as a best-effort
// fallback so single-tenant demo accounts still resolve to a teacher.
function deriveTeacherId(_tc: TeacherCourse): string | null {
  // No accountId leaks out, so we can't reverse-resolve precisely. Let
  // the caller pass an explicit `teacher`; this fallback returns null
  // so the adapter substitutes featuredTeachers[0] as last resort.
  void _tc;
  return null;
}
