import { featuredTeachers, type Teacher, type LocalizedString } from "./teachers";

export type BookingStatus = "booked" | "available" | "blocked" | "pending";
export type BookingMode = "online" | "in-person";

export type CalendarEvent = {
  id: string;
  /** ISO date in Africa/Algiers — use YYYY-MM-DD */
  date: string;
  /** Hour in 24h, e.g. 14.5 = 14:30 */
  startHour: number;
  endHour: number;
  status: BookingStatus;
  mode: BookingMode;
  teacher?: Teacher;
  title: LocalizedString;
  location?: LocalizedString;
  /** Whether the event involves a cohort (group) or 1:1 */
  format: "1to1" | "cohort" | "event";
  meta?: { studentName?: LocalizedString; sessionsLeft?: number };
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;

/**
 * Anchored to a sliding "this week" frame. We compute dates relative to
 * a stable anchor (today @ midnight local) so the layout stays predictable.
 */
function todayIso(offsetDays: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const weekEvents: CalendarEvent[] = [
  // — Monday-ish (offset 0)
  {
    id: "ev-1",
    date: todayIso(0),
    startHour: 9,
    endHour: 10.5,
    status: "booked",
    mode: "online",
    teacher: t("t-khalil"),
    title: { fr: "Maths · révision dérivées", ar: "رياضيات · مراجعة المشتقّات" },
    format: "1to1",
    meta: { sessionsLeft: 3 },
  },
  {
    id: "ev-2",
    date: todayIso(0),
    startHour: 14,
    endHour: 15,
    status: "available",
    mode: "online",
    title: { fr: "Plage libre", ar: "وقت متاح" },
    format: "1to1",
  },
  {
    id: "ev-3",
    date: todayIso(0),
    startHour: 18,
    endHour: 19.5,
    status: "booked",
    mode: "online",
    teacher: t("t-yasmine"),
    title: { fr: "IELTS Speaking · mock test", ar: "IELTS تحدّث · اختبار تجريبي" },
    format: "cohort",
    meta: { sessionsLeft: 5 },
  },
  // — Tuesday-ish
  {
    id: "ev-4",
    date: todayIso(1),
    startHour: 10,
    endHour: 11.5,
    status: "booked",
    mode: "in-person",
    teacher: t("t-souad"),
    title: { fr: "Tajwid · sourate Al-Mulk", ar: "التجويد · سورة الملك" },
    location: { fr: "Tlemcen, centre culturel", ar: "تلمسان، المركز الثقافي" },
    format: "1to1",
  },
  {
    id: "ev-5",
    date: todayIso(1),
    startHour: 20,
    endHour: 22,
    status: "booked",
    mode: "online",
    teacher: t("t-amine"),
    title: { fr: "React · semaine 3 / 6", ar: "React · الأسبوع 3 / 6" },
    format: "cohort",
  },
  // — Wednesday-ish
  {
    id: "ev-6",
    date: todayIso(2),
    startHour: 8,
    endHour: 10,
    status: "blocked",
    mode: "online",
    title: { fr: "Indisponible · trajet", ar: "غير متاح · تنقّل" },
    format: "1to1",
  },
  {
    id: "ev-7",
    date: todayIso(2),
    startHour: 16,
    endHour: 17,
    status: "available",
    mode: "online",
    title: { fr: "Plage libre", ar: "وقت متاح" },
    format: "1to1",
  },
  {
    id: "ev-8",
    date: todayIso(2),
    startHour: 19,
    endHour: 20.5,
    status: "pending",
    mode: "online",
    teacher: t("t-imene"),
    title: { fr: "Physique · cinématique (en attente)", ar: "فيزياء · الحركة (قيد التأكيد)" },
    format: "1to1",
  },
  // — Thursday-ish
  {
    id: "ev-9",
    date: todayIso(3),
    startHour: 11,
    endHour: 12,
    status: "available",
    mode: "online",
    title: { fr: "Plage libre", ar: "وقت متاح" },
    format: "1to1",
  },
  {
    id: "ev-10",
    date: todayIso(3),
    startHour: 17,
    endHour: 18,
    status: "booked",
    mode: "in-person",
    teacher: t("t-rayan"),
    title: { fr: "Piano · ballade jazz", ar: "بيانو · بالاد جاز" },
    location: { fr: "Annaba", ar: "عنّابة" },
    format: "1to1",
  },
  // — Friday-ish
  {
    id: "ev-11",
    date: todayIso(4),
    startHour: 9,
    endHour: 10.5,
    status: "booked",
    mode: "online",
    teacher: t("t-khalil"),
    title: { fr: "Maths · intégrales", ar: "رياضيات · التكاملات" },
    format: "1to1",
  },
  {
    id: "ev-12",
    date: todayIso(4),
    startHour: 15,
    endHour: 18,
    status: "blocked",
    mode: "online",
    title: { fr: "Indisponible · prière", ar: "غير متاح · صلاة" },
    format: "1to1",
  },
  // — Saturday-ish
  {
    id: "ev-13",
    date: todayIso(5),
    startHour: 10,
    endHour: 11,
    status: "booked",
    mode: "online",
    teacher: t("t-souad"),
    title: { fr: "Cohorte Tajwid", ar: "فوج التجويد" },
    format: "cohort",
  },
  // — Sunday-ish
  {
    id: "ev-14",
    date: todayIso(6),
    startHour: 14,
    endHour: 17,
    status: "booked",
    mode: "online",
    teacher: t("t-imene"),
    title: { fr: "Marathon Physique Bac", ar: "ماراطون فيزياء الباك" },
    format: "event",
  },
];

/** Larger month-wide dataset for the month view. Derived by replicating week events
 * + extra ones across the surrounding ±2 weeks. */
export const monthEvents: CalendarEvent[] = [
  ...weekEvents,
  {
    id: "ev-m1",
    date: todayIso(-2),
    startHour: 16,
    endHour: 17.5,
    status: "booked",
    mode: "online",
    teacher: t("t-amine"),
    title: { fr: "React · semaine 2 / 6", ar: "React · الأسبوع 2 / 6" },
    format: "cohort",
  },
  {
    id: "ev-m2",
    date: todayIso(-4),
    startHour: 10,
    endHour: 11,
    status: "booked",
    mode: "in-person",
    teacher: t("t-rayan"),
    title: { fr: "Piano · gammes", ar: "بيانو · سلالم" },
    format: "1to1",
  },
  {
    id: "ev-m3",
    date: todayIso(8),
    startHour: 18,
    endHour: 19,
    status: "booked",
    mode: "online",
    teacher: t("t-yasmine"),
    title: { fr: "IELTS Writing · task 2", ar: "IELTS كتابة · مهمّة 2" },
    format: "1to1",
  },
  {
    id: "ev-m4",
    date: todayIso(10),
    startHour: 20,
    endHour: 22,
    status: "booked",
    mode: "online",
    teacher: t("t-amine"),
    title: { fr: "React · semaine 4 / 6", ar: "React · الأسبوع 4 / 6" },
    format: "cohort",
  },
  {
    id: "ev-m5",
    date: todayIso(11),
    startHour: 14,
    endHour: 15,
    status: "available",
    mode: "online",
    title: { fr: "Plage libre", ar: "وقت متاح" },
    format: "1to1",
  },
  {
    id: "ev-m6",
    date: todayIso(13),
    startHour: 9,
    endHour: 11,
    status: "blocked",
    mode: "online",
    title: { fr: "Indisponible · examen", ar: "غير متاح · امتحان" },
    format: "1to1",
  },
];

export const dayStartHour = 8;
export const dayEndHour = 22;
