/**
 * Localized label maps for the request enumerations.
 *
 * The wizard / edit form work with key-only state (e.g. `subject: "code"`,
 * `city: "alger"`); the LearningRequest record stores localized strings
 * (`{ fr: "Programmation", ar: "البرمجة" }`). These maps bridge the two
 * so the store stays language-agnostic without forcing every consumer to
 * round-trip through next-intl.
 *
 * Keep in sync with `messages/{fr,ar}/requests.json` under
 * `requests.shared.{subjects, cities, level, audience, deadlines}` — these
 * are the canonical translations.
 */
import type { LocalizedString } from "./teachers";

export const REQUEST_SUBJECT_LABELS: Record<string, LocalizedString> = {
  school: { fr: "Soutien scolaire", ar: "الدعم المدرسي" },
  languages: { fr: "Langues", ar: "اللغات" },
  code: { fr: "Programmation", ar: "البرمجة" },
  design: { fr: "Design & créa", ar: "التصميم والإبداع" },
  business: { fr: "Business & carrière", ar: "الأعمال والمهنة" },
  music: { fr: "Musique", ar: "الموسيقى" },
  religion: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
  exams: { fr: "Examens & concours", ar: "الامتحانات والمسابقات" },
};

export const REQUEST_CITY_LABELS: Record<string, LocalizedString> = {
  alger: { fr: "Alger", ar: "الجزائر العاصمة" },
  oran: { fr: "Oran", ar: "وهران" },
  constantine: { fr: "Constantine", ar: "قسنطينة" },
  annaba: { fr: "Annaba", ar: "عنّابة" },
  blida: { fr: "Blida", ar: "البليدة" },
  setif: { fr: "Sétif", ar: "سطيف" },
  batna: { fr: "Batna", ar: "باتنة" },
  tlemcen: { fr: "Tlemcen", ar: "تلمسان" },
  tiziOuzou: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
  bejaia: { fr: "Béjaïa", ar: "بجاية" },
};

export const REQUEST_LEVEL_LABELS: Record<string, LocalizedString> = {
  any: { fr: "Tous niveaux", ar: "كل المستويات" },
  beginner: { fr: "Débutant", ar: "مبتدئ" },
  intermediate: { fr: "Intermédiaire", ar: "متوسّط" },
  advanced: { fr: "Avancé", ar: "متقدّم" },
};

export const REQUEST_AUDIENCE_LABELS: Record<string, LocalizedString> = {
  kids: { fr: "Enfants", ar: "الأطفال" },
  lycee: { fr: "Lycéens & Bac", ar: "ثانوي و باك" },
  students: { fr: "Étudiants", ar: "الطلبة" },
  adults: { fr: "Adultes & pros", ar: "كبار ومحترفون" },
};

export const REQUEST_DEADLINE_LABELS: Record<string, LocalizedString> = {
  thisWeek: { fr: "Cette semaine", ar: "هذا الأسبوع" },
  thisMonth: { fr: "Ce mois", ar: "هذا الشهر" },
  notInRush: { fr: "Pas pressé", ar: "غير مستعجل" },
};

/** Reverse lookup: localized label → key, language-agnostic. */
export function findKeyByLabel(
  map: Record<string, LocalizedString>,
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  for (const [key, label] of Object.entries(map)) {
    if (label.fr === trimmed || label.ar === trimmed) return key;
  }
  return undefined;
}
