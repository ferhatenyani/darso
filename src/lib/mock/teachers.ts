export type TeacherTier = "top-rated" | "verified" | "rising";

export type LocalizedString = { fr: string; ar: string };

export type Teacher = {
  id: string;
  slug: string;
  name: LocalizedString;
  initials: string;
  headline: LocalizedString;
  subject: LocalizedString;
  city: LocalizedString;
  mode: "online" | "in-person" | "both";
  rating: number;
  reviews: number;
  lessons: number;
  hourlyRate: number; // DZD
  responseHours: number;
  tier: TeacherTier;
  speaks: { fr: string[]; ar: string[] };
  topRated?: boolean;
  idVerified: boolean;
  contactVerified: boolean;
  /** Tailwind classes for the avatar gradient (consistent palette per teacher) */
  accent: string;
};

export const featuredTeachers: Teacher[] = [
  {
    id: "t-khalil",
    slug: "khalil-bensaid",
    name: { fr: "Khalil Bensaïd", ar: "خليل بن سعيد" },
    initials: "KB",
    headline: {
      fr: "Prof de Maths · Bac & post-bac, méthode douce",
      ar: "أستاذ رياضيات · للباك وما بعده، بأسلوب هادئ",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    city: { fr: "Alger", ar: "الجزائر العاصمة" },
    mode: "both",
    rating: 4.92,
    reviews: 218,
    lessons: 1240,
    hourlyRate: 1500,
    responseHours: 2,
    tier: "top-rated",
    speaks: { fr: ["FR", "AR", "EN"], ar: ["AR", "FR", "EN"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
  },
  {
    id: "t-yasmine",
    slug: "yasmine-haddad",
    name: { fr: "Yasmine Haddad", ar: "ياسمين حدّاد" },
    initials: "YH",
    headline: {
      fr: "Prof d'anglais certifiée IELTS · objectif 7+",
      ar: "أستاذة إنجليزية معتمَدة IELTS · هدف 7+",
    },
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    city: { fr: "Oran", ar: "وهران" },
    mode: "online",
    rating: 4.88,
    reviews: 174,
    lessons: 980,
    hourlyRate: 1800,
    responseHours: 1,
    tier: "top-rated",
    speaks: { fr: ["EN", "FR", "AR"], ar: ["EN", "FR", "AR"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#2E9E78] to-[#3E8FD0]",
  },
  {
    id: "t-amine",
    slug: "amine-cherif",
    name: { fr: "Amine Cherif", ar: "أمين شريف" },
    initials: "AC",
    headline: {
      fr: "Dev React & Node · des projets, pas des slides",
      ar: "مطوّر React و Node · مشاريع، لا شرائح",
    },
    subject: { fr: "Programmation Web", ar: "برمجة الويب" },
    city: { fr: "Constantine", ar: "قسنطينة" },
    mode: "online",
    rating: 4.85,
    reviews: 96,
    lessons: 410,
    hourlyRate: 2200,
    responseHours: 3,
    tier: "verified",
    speaks: { fr: ["FR", "EN", "AR"], ar: ["AR", "FR", "EN"] },
    idVerified: true,
    contactVerified: true,
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
  },
  {
    id: "t-souad",
    slug: "souad-belkacem",
    name: { fr: "Souad Belkacem", ar: "سعاد بلقاسم" },
    initials: "SB",
    headline: {
      fr: "Coran & tajwid · pour enfants et adultes",
      ar: "القرآن والتجويد · للأطفال والكبار",
    },
    subject: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
    city: { fr: "Tlemcen", ar: "تلمسان" },
    mode: "both",
    rating: 4.97,
    reviews: 312,
    lessons: 2050,
    hourlyRate: 900,
    responseHours: 4,
    tier: "top-rated",
    speaks: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#DDA13A] to-[#DD514D]",
  },
  {
    id: "t-rayan",
    slug: "rayan-otmani",
    name: { fr: "Rayan Otmani", ar: "ريان عثماني" },
    initials: "RO",
    headline: {
      fr: "Prof de piano · jazz & classique, tous niveaux",
      ar: "أستاذ بيانو · جاز وكلاسيكي، لكل المستويات",
    },
    subject: { fr: "Piano", ar: "البيانو" },
    city: { fr: "Annaba", ar: "عنابة" },
    mode: "in-person",
    rating: 4.81,
    reviews: 62,
    lessons: 210,
    hourlyRate: 1600,
    responseHours: 5,
    tier: "rising",
    speaks: { fr: ["FR", "EN"], ar: ["FR", "EN"] },
    idVerified: true,
    contactVerified: true,
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
  },
  {
    id: "t-imene",
    slug: "imene-laribi",
    name: { fr: "Imène Laribi", ar: "إيمان العريبي" },
    initials: "IL",
    headline: {
      fr: "Prof de physique · prépa Bac & ENS",
      ar: "أستاذة فيزياء · تحضير الباك و ENS",
    },
    subject: { fr: "Physique", ar: "الفيزياء" },
    city: { fr: "Sétif", ar: "سطيف" },
    mode: "both",
    rating: 4.9,
    reviews: 147,
    lessons: 760,
    hourlyRate: 1400,
    responseHours: 2,
    tier: "top-rated",
    speaks: { fr: ["FR", "AR", "EN"], ar: ["AR", "FR", "EN"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#2F6BFF] to-[#1C3A5E]",
  },
];
