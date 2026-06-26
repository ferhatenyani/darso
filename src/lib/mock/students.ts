import type { LocalizedString } from "./teachers";

export type DemoAccount = {
  id: string;
  role: "student" | "teacher" | "agency";
  name: LocalizedString;
  email: string;
  initials: string;
  accent: string;
  hint: LocalizedString;
};

export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-student",
    role: "student",
    name: { fr: "Lina M. (étudiante)", ar: "لينا م. (طالبة)" },
    email: "lina@darso.dz",
    initials: "LM",
    accent: "from-[#2F6BFF] to-[#3E8FD0]",
    hint: { fr: "Bac · Constantine · cherche IELTS", ar: "الباك · قسنطينة · تبحث عن IELTS" },
  },
  {
    id: "demo-teacher",
    role: "teacher",
    name: { fr: "Khalil B. (professeur)", ar: "خليل ب. (أستاذ)" },
    email: "khalil@darso.dz",
    initials: "KB",
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    hint: { fr: "Maths Bac · Alger · 218 avis", ar: "رياضيات الباك · الجزائر العاصمة · 218 رأيًا" },
  },
  {
    id: "demo-agency",
    role: "agency",
    name: { fr: "Nour H. (manager d'agence)", ar: "نور ه. (مديرة وكالة)" },
    email: "nour@academie-rayan.dz",
    initials: "NH",
    accent: "from-[#2E9E78] to-[#1C3A5E]",
    hint: { fr: "Académie Rayan · 12 professeurs", ar: "أكاديمية ريّان · 12 أستاذًا" },
  },
];

export type Wishlisted = {
  type: "teacher" | "course";
  id: string;
};

export const savedItems: Wishlisted[] = [
  { type: "teacher", id: "t-khalil" },
  { type: "teacher", id: "t-yasmine" },
  { type: "course", id: "c-react-cohort" },
];

export type Interest = { key: string; label: LocalizedString };
export const interestSeeds: Interest[] = [
  { key: "math-bac", label: { fr: "Math Bac", ar: "رياضيات الباك" } },
  { key: "english-ielts", label: { fr: "IELTS / TOEFL", ar: "IELTS / TOEFL" } },
  { key: "french-pro", label: { fr: "Français pro", ar: "الفرنسية المهنية" } },
  { key: "arabic-classical", label: { fr: "Arabe classique", ar: "العربية الفصحى" } },
  { key: "web-dev", label: { fr: "Dév. web", ar: "تطوير الويب" } },
  { key: "data-ai", label: { fr: "Data & IA", ar: "البيانات والذكاء الاصطناعي" } },
  { key: "design-ux", label: { fr: "Design & UX", ar: "التصميم وتجربة المستخدم" } },
  { key: "music-piano", label: { fr: "Piano", ar: "البيانو" } },
  { key: "music-guitar", label: { fr: "Guitare / Oud", ar: "غيتار / عود" } },
  { key: "religion", label: { fr: "Coran & Tajwid", ar: "القرآن والتجويد" } },
  { key: "physics-bac", label: { fr: "Physique Bac", ar: "فيزياء الباك" } },
  { key: "business-skills", label: { fr: "Business & soft skills", ar: "الأعمال والمهارات الناعمة" } },
];
