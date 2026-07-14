import { featuredTeachers, type Teacher, type LocalizedString } from "./teachers";

export type SessionState = "live" | "soon" | "later" | "tomorrow" | "this-week";
export type SessionFormat = "1to1" | "cohort" | "event" | "ondemand";

export type Session = {
  id: string;
  state: SessionState;
  format: SessionFormat;
  teacher: Teacher;
  title: LocalizedString;
  startsAt: { fr: string; ar: string };   // localized human label, e.g. "Aujourd'hui · 18h"
  startsInMin?: number;                   // for "soon" / "live"
  durationMin: number;
  capacity: { taken: number; total: number };
  priceDzd: number;
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;

export const upcomingSessions: Session[] = [
  {
    id: "s-live-math",
    state: "live",
    format: "cohort",
    teacher: t("t-khalil"),
    title: { fr: "Math Bac · Limites & continuité", ar: "رياضيات الباك · النهايات والاستمرار" },
    startsAt: { fr: "En cours · 18h00", ar: "جارٍ الآن · 18:00" },
    startsInMin: -12,
    durationMin: 90,
    capacity: { taken: 12, total: 12 },
    priceDzd: 1500,
  },
  {
    id: "s-soon-english",
    state: "soon",
    format: "event",
    teacher: t("t-yasmine"),
    title: { fr: "IELTS Speaking · workshop intensif", ar: "IELTS التحدّث · ورشة مكثّفة" },
    startsAt: { fr: "Aujourd'hui · 19h30", ar: "اليوم · 19:30" },
    startsInMin: 42,
    durationMin: 90,
    capacity: { taken: 8, total: 12 },
    priceDzd: 1800,
  },
  {
    id: "s-tomorrow-code",
    state: "tomorrow",
    format: "cohort",
    teacher: t("t-amine"),
    title: { fr: "React from scratch · semaine 3 / 6", ar: "React من الصفر · الأسبوع 3 / 6" },
    startsAt: { fr: "Demain · 20h00", ar: "غدًا · 20:00" },
    durationMin: 120,
    capacity: { taken: 14, total: 18 },
    priceDzd: 2200,
  },
  {
    id: "s-week-piano",
    state: "this-week",
    format: "event",
    teacher: t("t-rayan"),
    title: { fr: "Piano pour débutants · jeudi à Annaba", ar: "البيانو للمبتدئين · الخميس بعنّابة" },
    startsAt: { fr: "Jeudi · 17h00", ar: "الخميس · 17:00" },
    durationMin: 60,
    capacity: { taken: 4, total: 8 },
    priceDzd: 1600,
  },
  {
    id: "s-week-coran",
    state: "this-week",
    format: "cohort",
    teacher: t("t-souad"),
    title: { fr: "Tajwid · cohorte hebdomadaire", ar: "التجويد · فوج أسبوعي" },
    startsAt: { fr: "Samedi · 10h00", ar: "السبت · 10:00" },
    durationMin: 60,
    capacity: { taken: 9, total: 12 },
    priceDzd: 900,
  },
  {
    id: "s-week-physics",
    state: "this-week",
    format: "event",
    teacher: t("t-imene"),
    title: { fr: "Bac Physique · marathon mécanique", ar: "فيزياء الباك · ماراطون الميكانيك" },
    startsAt: { fr: "Dimanche · 14h00", ar: "الأحد · 14:00" },
    durationMin: 180,
    capacity: { taken: 22, total: 30 },
    priceDzd: 1400,
  },
];

export const liveCount = 8;
export const startingInHour = 4;
