// Batch 11 expansion — broadened featured roster to 11 teachers across more
// subjects, wilayas, price tiers, formats, response times and verification
// states. Two teachers (t-yasmine, t-mounir) are pinned to ag-numidia so the
// agency members surface has multiple rows beyond the founder.
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
  /**
   * When set, the teacher belongs to a studio/agency; gates the studio-members
   * surface and any agency-only affordances. Optional — most teachers are solo.
   */
  parentAgencyId?: string;
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
    // Affiliated to Studio Numidia (the mock agency in src/lib/mock/agency.ts)
    // so the Studio Members surface is testable when signed in as this teacher.
    parentAgencyId: "ag-numidia",
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
  // ──────────────────────────────────────────────────────────────────────
  // Batch 11 — additional roster
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "t-mounir",
    slug: "mounir-tabet",
    name: { fr: "Mounir Tabet", ar: "منير تابت" },
    initials: "MT",
    headline: {
      fr: "Prof de chimie · expériences filmées et fiches méthode",
      ar: "أستاذ كيمياء · تجارب مصوَّرة وبطاقات منهجية",
    },
    subject: { fr: "Chimie", ar: "الكيمياء" },
    city: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
    mode: "both",
    rating: 4.84,
    reviews: 89,
    lessons: 412,
    hourlyRate: 1300,
    responseHours: 3,
    tier: "verified",
    speaks: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
    idVerified: true,
    contactVerified: true,
    // Second teacher pinned to Studio Numidia so the agency surface lists
    // more than one member when viewed as the agency owner.
    parentAgencyId: "ag-numidia",
    accent: "from-[#2E9E78] to-[#1C3A5E]",
  },
  {
    id: "t-nadia",
    slug: "nadia-belarbi",
    name: { fr: "Nadia Belarbi", ar: "نادية بلعربي" },
    initials: "NB",
    headline: {
      fr: "Prof de français · TCF, expression écrite & rédaction",
      ar: "أستاذة فرنسية · TCF، التعبير الكتابي والتحرير",
    },
    subject: { fr: "Français & TCF", ar: "الفرنسية و TCF" },
    city: { fr: "Béjaïa", ar: "بجاية" },
    mode: "online",
    rating: 4.93,
    reviews: 201,
    lessons: 1120,
    hourlyRate: 1900,
    responseHours: 1,
    tier: "top-rated",
    speaks: { fr: ["FR", "AR", "EN"], ar: ["FR", "AR", "EN"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#DD514D] to-[#2F6BFF]",
  },
  {
    id: "t-farid",
    slug: "farid-zenati",
    name: { fr: "Farid Zenati", ar: "فريد الزيناتي" },
    initials: "FZ",
    headline: {
      fr: "Cheikh · Coran, Fiqh & sciences islamiques",
      ar: "الشيخ · قرآن، فقه وعلوم شرعية",
    },
    subject: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
    city: { fr: "Ghardaïa", ar: "غرداية" },
    mode: "online",
    rating: 4.95,
    reviews: 168,
    lessons: 940,
    hourlyRate: 1100,
    responseHours: 2,
    tier: "top-rated",
    speaks: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
    topRated: true,
    idVerified: true,
    contactVerified: true,
    accent: "from-[#2E9E78] to-[#DDA13A]",
  },
  {
    id: "t-kahina",
    slug: "kahina-amrane",
    name: { fr: "Kahina Amrane", ar: "كاهنة عمران" },
    initials: "KA",
    headline: {
      fr: "Prof de SVT · biologie, géologie, méthode bac",
      ar: "أستاذة العلوم الطبيعية · بيولوجيا، جيولوجيا، منهج الباك",
    },
    subject: { fr: "SVT · Biologie", ar: "علوم الحياة والأرض" },
    city: { fr: "Batna", ar: "باتنة" },
    mode: "both",
    rating: 4.78,
    reviews: 74,
    lessons: 310,
    hourlyRate: 1250,
    responseHours: 4,
    tier: "verified",
    speaks: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
    idVerified: true,
    contactVerified: true,
    accent: "from-[#2E9E78] to-[#3E8FD0]",
  },
  {
    id: "t-leila",
    slug: "leila-saidi",
    name: { fr: "Leïla Saïdi", ar: "ليلى سعيدي" },
    initials: "LS",
    headline: {
      fr: "Coach voix & chant · technique, oud & nouba andalouse",
      ar: "مدرّبة صوت وغناء · تقنية، عود والنوبة الأندلسية",
    },
    subject: { fr: "Chant & Oud", ar: "غناء وعود" },
    city: { fr: "Tlemcen", ar: "تلمسان" },
    mode: "in-person",
    rating: 4.86,
    reviews: 53,
    lessons: 180,
    hourlyRate: 2200,
    responseHours: 3,
    tier: "rising",
    speaks: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
    idVerified: true,
    contactVerified: true,
    accent: "from-[#DDA13A] to-[#DD514D]",
  },
  {
    id: "t-bilal",
    slug: "bilal-rahmani",
    name: { fr: "Bilal Rahmani", ar: "بلال رحماني" },
    initials: "BR",
    headline: {
      fr: "Dev mobile · Flutter & Kotlin · projets concrets",
      ar: "مطوّر تطبيقات · Flutter و Kotlin · مشاريع ملموسة",
    },
    subject: { fr: "Programmation Mobile", ar: "برمجة الموبايل" },
    city: { fr: "Alger", ar: "الجزائر العاصمة" },
    mode: "online",
    rating: 4.79,
    reviews: 47,
    lessons: 165,
    hourlyRate: 2600,
    responseHours: 4,
    tier: "rising",
    speaks: { fr: ["FR", "EN", "AR"], ar: ["AR", "FR", "EN"] },
    // Newer profile — paperwork still in review.
    idVerified: false,
    contactVerified: true,
    accent: "from-[#3E8FD0] to-[#2E9E78]",
  },
  {
    id: "t-djamila",
    slug: "djamila-haouari",
    name: { fr: "Djamila Haouari", ar: "جميلة هواري" },
    initials: "DH",
    headline: {
      fr: "Prof de mathématiques · BEM & 4e année moyenne",
      ar: "أستاذة رياضيات · شهادة التعليم المتوسط والسنة 4 متوسط",
    },
    subject: { fr: "Mathématiques · BEM", ar: "الرياضيات · BEM" },
    city: { fr: "Oran", ar: "وهران" },
    mode: "both",
    rating: 4.43,
    reviews: 38,
    lessons: 124,
    hourlyRate: 1200,
    responseHours: 6,
    tier: "rising",
    speaks: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
    // Returning teacher with mixed early reviews — kept as the catalogue's
    // 4-something outlier so card variation is visible in the grid.
    idVerified: false,
    contactVerified: true,
    accent: "from-[#1C3A5E] to-[#DDA13A]",
  },
];

/** Lookup a teacher record by id. Returns undefined when not found. */
export const findTeacherById = (id: string | null | undefined) =>
  id ? featuredTeachers.find((t) => t.id === id) : undefined;
