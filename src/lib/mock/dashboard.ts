// Batch 11 expansion — added more action items (8 total), pending requests
// (7 total) and extended the revenue trend to 16 data points with more
// realistic seasonality (Ramadan dip, summer slowdown, autumn pickup).
import { featuredTeachers } from "./teachers";

export const currentTeacher = featuredTeachers.find((t) => t.id === "t-khalil")!;

export type DashboardSessionState = "live" | "upcoming" | "later";

export type DashboardSession = {
  id: string;
  state: DashboardSessionState;
  title: { fr: string; ar: string };
  format: "cohort" | "1to1" | "event" | "ondemand";
  startTime: { fr: string; ar: string };
  startsInMin: number;
  durationMin: number;
  capacity: { taken: number; total: number };
  href: string;
};

export const todaySessions: DashboardSession[] = [
  {
    id: "today-1",
    state: "live",
    title: { fr: "Math Bac · Limites & continuité", ar: "رياضيات الباك · النهايات والاستمرار" },
    format: "cohort",
    startTime: { fr: "Commencé à 18:00", ar: "بدأ في 18:00" },
    startsInMin: -12,
    durationMin: 90,
    capacity: { taken: 12, total: 12 },
    href: "/teach/courses/c-math-bac",
  },
  {
    id: "today-2",
    state: "upcoming",
    title: { fr: "Trigonométrie · révision express", ar: "علم المثلثات · مراجعة سريعة" },
    format: "1to1",
    startTime: { fr: "Aujourd'hui · 19:30", ar: "اليوم · 19:30" },
    startsInMin: 42,
    durationMin: 60,
    capacity: { taken: 1, total: 1 },
    href: "/teach/courses/c-trigo",
  },
  {
    id: "today-3",
    state: "upcoming",
    title: { fr: "Préparation Bac · simulation d'épreuve", ar: "تحضير الباك · محاكاة الامتحان" },
    format: "cohort",
    startTime: { fr: "Aujourd'hui · 21:00", ar: "اليوم · 21:00" },
    startsInMin: 132,
    durationMin: 120,
    capacity: { taken: 9, total: 14 },
    href: "/teach/courses/c-bac-prep",
  },
];

export type JoinRequest = {
  id: string;
  student: {
    name: { fr: string; ar: string };
    initials: string;
    location: { fr: string; ar: string };
    accent: string;
  };
  course: { fr: string; ar: string };
  excerpt: { fr: string; ar: string };
  sentAt: { fr: string; ar: string };
  status: "pending" | "accepted" | "rejected";
};

export const recentRequests: JoinRequest[] = [
  {
    id: "r-1",
    student: {
      name: { fr: "Lina Mansouri", ar: "لينا منصوري" },
      initials: "LM",
      location: { fr: "Alger", ar: "الجزائر" },
      accent: "from-[#2F6BFF] to-[#3E8FD0]",
    },
    course: { fr: "Math Bac · cohorte de mai", ar: "رياضيات الباك · فوج ماي" },
    excerpt: {
      fr: "Salam, je passe le Bac SE et j'ai besoin d'aide en analyse. Mon niveau actuel est 12/20…",
      ar: "السلام، سأجتاز باك علوم تجريبية وأحتاج للمساعدة في التحليل. مستواي الحالي 12/20…",
    },
    sentAt: { fr: "il y a 12 min", ar: "منذ 12 د" },
    status: "pending",
  },
  {
    id: "r-2",
    student: {
      name: { fr: "Mehdi Ouali", ar: "مهدي والي" },
      initials: "MO",
      location: { fr: "Blida", ar: "البليدة" },
      accent: "from-[#2E9E78] to-[#1C3A5E]",
    },
    course: { fr: "Trigonométrie · 1:1", ar: "علم المثلثات · فردي" },
    excerpt: {
      fr: "Bonsoir, est-ce que vous proposez des séances le week-end ? Je suis en terminale.",
      ar: "مساء الخير، هل تقدم حصصًا في عطلة نهاية الأسبوع؟ أنا في النهائي.",
    },
    sentAt: { fr: "il y a 1 h", ar: "منذ ساعة" },
    status: "pending",
  },
  {
    id: "r-3",
    student: {
      name: { fr: "Sirine Kacem", ar: "سيرين قاسم" },
      initials: "SK",
      location: { fr: "Oran", ar: "وهران" },
      accent: "from-[#DDA13A] to-[#DD514D]",
    },
    course: { fr: "Préparation Bac · simulation", ar: "تحضير الباك · محاكاة" },
    excerpt: {
      fr: "J'aimerais rejoindre votre cohorte de mai. Quel est le programme exact des séances ?",
      ar: "أرغب في الانضمام إلى فوج ماي. ما هو البرنامج التفصيلي للحصص؟",
    },
    sentAt: { fr: "il y a 3 h", ar: "منذ 3 س" },
    status: "pending",
  },
  // ──────────────────────────────────────────────────────────────────────
  // Batch 11 — additional pending requests so the teacher inbox feels
  // active without overflowing.
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "r-7",
    student: {
      name: { fr: "Yacine Belhadj", ar: "ياسين بلحاج" },
      initials: "YB",
      location: { fr: "Constantine", ar: "قسنطينة" },
      accent: "from-[#2E9E78] to-[#3E8FD0]",
    },
    course: { fr: "Trigonométrie · 1:1", ar: "علم المثلثات · فردي" },
    excerpt: {
      fr: "Bonjour, mes parents souhaitent un suivi régulier pour le 2e trimestre. Avez-vous encore des créneaux ?",
      ar: "السلام، يرغب والداي في متابعة منتظمة للفصل 2. هل لديك أوقات شاغرة؟",
    },
    sentAt: { fr: "il y a 6 h", ar: "منذ 6 س" },
    status: "pending",
  },
  {
    id: "r-8",
    student: {
      name: { fr: "Hadjer Mansouri", ar: "هاجر منصوري" },
      initials: "HM",
      location: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
      accent: "from-[#DD514D] to-[#DDA13A]",
    },
    course: { fr: "Préparation Bac · simulations", ar: "تحضير الباك · محاكاة" },
    excerpt: {
      fr: "Salam, je cherche un prof pour 6 semaines intensives avant le Bac. Mon niveau est 13-14 actuellement.",
      ar: "السلام، أبحث عن أستاذ لـ 6 أسابيع مكثّفة قبل الباك. مستواي حاليًا 13-14.",
    },
    sentAt: { fr: "il y a 9 h", ar: "منذ 9 س" },
    status: "pending",
  },
  {
    id: "r-9",
    student: {
      name: { fr: "Amine Tabet", ar: "أمين تابت" },
      initials: "AT",
      location: { fr: "Annaba", ar: "عنابة" },
      accent: "from-[#1C3A5E] to-[#DDA13A]",
    },
    course: { fr: "Math Bac · cohorte", ar: "رياضيات الباك · فوج" },
    excerpt: {
      fr: "Bonsoir, est-ce qu'il reste de la place pour rejoindre la cohorte en cours ? Je peux rattraper le retard rapidement.",
      ar: "مساء الخير، هل ما تزال هناك أماكن للانضمام للفوج الجاري؟ يمكنني تدارك التأخّر سريعًا.",
    },
    sentAt: { fr: "il y a 14 h", ar: "منذ 14 س" },
    status: "pending",
  },
];

/** Mini-trend used by the revenue snapshot (last 16 weeks of DZD earnings).
 *  Includes a Ramadan dip and summer slowdown for visual variety. */
export const revenueTrend: number[] = [
  68000, 74000, 82000, 91000, 88000, 64000, 71000, 102000, 116000, 124000, 119000, 132000, 145000,
  138000, 156000, 168000,
];

export const revenueSnapshot = {
  currentMonthDzd: 168000,
  lastMonthDzd: 156000,
  rate: 0.08, // 8 %
  nextTierThresholdDzd: 250000,
  nextTierRate: 0.12,
  currentTierLabel: { fr: "Palier Pro", ar: "الفئة برو" },
  nextTierLabel: { fr: "Palier Studio", ar: "فئة استوديو" },
};

export type DashboardReview = {
  id: string;
  studentName: { fr: string; ar: string };
  initials: string;
  rating: number; // 1-5
  postedAt: { fr: string; ar: string };
  excerpt: { fr: string; ar: string };
  hasReply: boolean;
};

export const recentDashboardReviews: DashboardReview[] = [
  {
    id: "rv-1",
    studentName: { fr: "Yacine A.", ar: "ياسين ع." },
    initials: "YA",
    rating: 5,
    postedAt: { fr: "il y a 2 j", ar: "منذ يومين" },
    excerpt: {
      fr: "Le cours sur les intégrales était limpide. Khalil prend le temps d'expliquer.",
      ar: "كان الدرس عن التكاملات واضحًا جدًا. خليل يأخذ الوقت ليشرح.",
    },
    hasReply: false,
  },
  {
    id: "rv-2",
    studentName: { fr: "Nour H.", ar: "نور ح." },
    initials: "NH",
    rating: 5,
    postedAt: { fr: "il y a 5 j", ar: "منذ 5 أيام" },
    excerpt: {
      fr: "Excellent prof, méthode claire et ressources de qualité. Recommandé à 100 %.",
      ar: "أستاذ ممتاز، طريقة واضحة وموارد عالية الجودة. أنصح به 100٪.",
    },
    hasReply: true,
  },
  {
    id: "rv-3",
    studentName: { fr: "Riad B.", ar: "رياض ب." },
    initials: "RB",
    rating: 4,
    postedAt: { fr: "il y a 1 sem", ar: "منذ أسبوع" },
    excerpt: {
      fr: "Très bon contenu. J'aimerais juste un peu plus d'exercices à faire en autonomie.",
      ar: "محتوى جيد جدًا. أتمنى فقط المزيد من التمارين للقيام بها بشكل مستقل.",
    },
    hasReply: false,
  },
  // Batch 11 — additional dashboard review rows
  {
    id: "rv-4",
    studentName: { fr: "Manel K.", ar: "منال ك." },
    initials: "MK",
    rating: 5,
    postedAt: { fr: "il y a 2 sem", ar: "منذ أسبوعين" },
    excerpt: {
      fr: "Le pack 8 séances vaut chaque dinar. 16 au Bac.",
      ar: "باقة 8 حصص تستحق كل دينار. 16 في الباك.",
    },
    hasReply: true,
  },
  {
    id: "rv-5",
    studentName: { fr: "Sofiane R.", ar: "سفيان ر." },
    initials: "SR",
    rating: 4,
    postedAt: { fr: "il y a 3 sem", ar: "منذ 3 أسابيع" },
    excerpt: {
      fr: "Très clair sur l'analyse, j'aimerais juste une cohorte spéciale géométrie dans l'espace.",
      ar: "واضح في التحليل، أتمنّى فوجًا مخصّصًا للهندسة في الفضاء.",
    },
    hasReply: true,
  },
];

export type ActionItem = {
  id: string;
  label: { fr: string; ar: string };
  done: boolean;
  href: string;
};

export const actionItems: ActionItem[] = [
  {
    id: "a-1",
    label: { fr: "Compléter votre profil (vidéo de présentation manquante)", ar: "أكمل ملفك الشخصي (ينقصك فيديو التعريف)" },
    done: false,
    href: "/teach/profile",
  },
  {
    id: "a-2",
    label: { fr: "Ajouter un deuxième cours pour diversifier vos revenus", ar: "أضف درسًا ثانيًا لتنويع مداخيلك" },
    done: false,
    href: "/teach/courses/new",
  },
  {
    id: "a-3",
    label: { fr: "Répondre aux 3 demandes en attente", ar: "ردّ على 3 طلبات معلقة" },
    done: false,
    href: "/teach/requests",
  },
  {
    id: "a-4",
    label: { fr: "Définir vos disponibilités pour la semaine prochaine", ar: "حدد توفّرك للأسبوع القادم" },
    done: true,
    href: "/teach/profile",
  },
  // Batch 11 — additional action items
  {
    id: "a-5",
    label: {
      fr: "Configurer votre RIB pour recevoir vos paiements mensuels",
      ar: "أعدّ معلومات حسابك البنكي لتلقّي دفعاتك الشهرية",
    },
    done: false,
    href: "/teach/payouts",
  },
  {
    id: "a-6",
    label: {
      fr: "Répondre aux 4 avis sans réponse de ce mois",
      ar: "ردّ على 4 تقييمات لم يُجَب عنها هذا الشهر",
    },
    done: false,
    href: "/teach/reviews",
  },
  {
    id: "a-7",
    label: {
      fr: "Publier un événement « Marathon » avant la rentrée",
      ar: "انشر فعالية «ماراطون» قبل الموسم الدراسي",
    },
    done: false,
    href: "/teach/events",
  },
  {
    id: "a-8",
    label: {
      fr: "Compléter les attestations diplômes (1/2 téléversées)",
      ar: "أكمل تحميل الشهادات (1/2 مرفوع)",
    },
    done: true,
    href: "/teach/onboarding",
  },
];

export type TeacherCourse = {
  id: string;
  status: "draft" | "published" | "archived";
  title: { fr: string; ar: string };
  format: "cohort" | "1to1" | "event" | "ondemand";
  capacity: { taken: number; total: number };
  nextSession: { fr: string; ar: string } | null;
  monthRevenueDzd: number;
  priceDzd: number;
  studentCount: number;
  // ──────────────────────────────────────────────────────────────────
  // Wizard-collected fields (Batch 5a → Batch 8 persistence). All
  // optional so the seeded `teacherCourses` array below stays
  // backwards-compatible — surfaces that don't render these (the
  // dashboard listing) keep working unchanged.
  // ──────────────────────────────────────────────────────────────────
  /** Long-form course description shown in the wizard's "Details" step
   *  and editable from the edit form's Content tab. */
  description?: string;
  /** Weekly syllabus headings, one per learning week. */
  weeks?: string[];
  /** Bulleted learning outcomes ("you'll learn"). */
  outcomes?: string[];
  /** Eyebrow category — exams / school / languages. */
  category?: "exams" | "school" | "languages";
  /** Primary audience for the course. */
  audience?: "kids" | "lycee" | "students" | "adults";
  /** Primary teaching language. */
  language?: "fr" | "ar" | "en";
  /** Short marketing summary (≤140 chars) — the wizard "summary" field. */
  summary?: string;
  /** Optional active promotional discount percentage. */
  promoPct?: number;
};

export const teacherCourses: TeacherCourse[] = [
  {
    id: "c-math-bac",
    status: "published",
    title: { fr: "Math Bac · cohorte intensive", ar: "رياضيات الباك · فوج مكثّف" },
    format: "cohort",
    capacity: { taken: 14, total: 18 },
    nextSession: { fr: "Demain · 18:00", ar: "غدًا · 18:00" },
    monthRevenueDzd: 84000,
    priceDzd: 12000,
    studentCount: 14,
  },
  {
    id: "c-trigo",
    status: "published",
    title: { fr: "Trigonométrie · 1:1 personnalisé", ar: "علم المثلثات · فردي مخصص" },
    format: "1to1",
    capacity: { taken: 6, total: 8 },
    nextSession: { fr: "Aujourd'hui · 19:30", ar: "اليوم · 19:30" },
    monthRevenueDzd: 36000,
    priceDzd: 1500,
    studentCount: 6,
  },
  {
    id: "c-bac-prep",
    status: "published",
    title: { fr: "Préparation Bac · simulations d'épreuves", ar: "تحضير الباك · محاكاة الامتحانات" },
    format: "cohort",
    capacity: { taken: 9, total: 14 },
    nextSession: { fr: "Aujourd'hui · 21:00", ar: "اليوم · 21:00" },
    monthRevenueDzd: 42000,
    priceDzd: 8000,
    studentCount: 9,
  },
  {
    id: "c-analysis",
    status: "draft",
    title: { fr: "Analyse complexe · brouillon", ar: "التحليل المركّب · مسودّة" },
    format: "ondemand",
    capacity: { taken: 0, total: 0 },
    nextSession: null,
    monthRevenueDzd: 0,
    priceDzd: 9500,
    studentCount: 0,
  },
  {
    id: "c-geometry",
    status: "archived",
    title: { fr: "Géométrie dans l'espace · 2024", ar: "الهندسة في الفضاء · 2024" },
    format: "cohort",
    capacity: { taken: 11, total: 12 },
    nextSession: null,
    monthRevenueDzd: 0,
    priceDzd: 7500,
    studentCount: 11,
  },
];

export type TeacherEvent = {
  id: string;
  status: "draft" | "published" | "archived";
  title: { fr: string; ar: string };
  date: { day: string; monthFr: string; monthAr: string };
  hour: string;
  capacity: { taken: number; total: number };
  priceDzd: number;
};

export const teacherEvents: TeacherEvent[] = [
  {
    id: "e-marathon",
    status: "published",
    title: { fr: "Marathon Bac · 6 h non-stop", ar: "ماراطون الباك · 6 ساعات متواصلة" },
    date: { day: "14", monthFr: "Juin", monthAr: "جوان" },
    hour: "09:00",
    capacity: { taken: 24, total: 40 },
    priceDzd: 2500,
  },
  {
    id: "e-workshop",
    status: "published",
    title: { fr: "Atelier dérivées · niveau Bac SE", ar: "ورشة المشتقات · مستوى باك علوم" },
    date: { day: "22", monthFr: "Juin", monthAr: "جوان" },
    hour: "17:00",
    capacity: { taken: 8, total: 20 },
    priceDzd: 1800,
  },
  {
    id: "e-fall",
    status: "draft",
    title: { fr: "Lancement rentrée · pré-Bac", ar: "إطلاق الموسم · ما قبل الباك" },
    date: { day: "05", monthFr: "Sept", monthAr: "سبتمبر" },
    hour: "10:00",
    capacity: { taken: 0, total: 30 },
    priceDzd: 0,
  },
];

export type StudentRequest = {
  id: string;
  student: {
    name: { fr: string; ar: string };
    initials: string;
    location: { fr: string; ar: string };
    accent: string;
  };
  course: { fr: string; ar: string };
  message: { fr: string; ar: string };
  sentAt: { fr: string; ar: string };
  status: "pending" | "accepted" | "rejected";
};

export const studentRequests: StudentRequest[] = [
  ...recentRequests.map((r) => ({
    id: r.id,
    student: r.student,
    course: r.course,
    message: r.excerpt,
    sentAt: r.sentAt,
    status: r.status,
  })),
  {
    id: "r-4",
    student: {
      name: { fr: "Anis Berkani", ar: "أنيس برقاني" },
      initials: "AB",
      location: { fr: "Sétif", ar: "سطيف" },
      accent: "from-[#1C3A5E] to-[#2F6BFF]",
    },
    course: { fr: "Math Bac · cohorte de mai", ar: "رياضيات الباك · فوج ماي" },
    message: {
      fr: "Salam, j'aimerais m'inscrire à votre cohorte. Quels prérequis demandez-vous ?",
      ar: "السلام، أرغب في التسجيل في فوجكم. ما هي المتطلبات؟",
    },
    sentAt: { fr: "il y a 1 j", ar: "منذ يوم" },
    status: "accepted",
  },
  {
    id: "r-5",
    student: {
      name: { fr: "Imane Drissi", ar: "إيمان دريسي" },
      initials: "ID",
      location: { fr: "Bejaïa", ar: "بجاية" },
      accent: "from-[#2E9E78] to-[#3E8FD0]",
    },
    course: { fr: "Trigonométrie · 1:1", ar: "علم المثلثات · فردي" },
    message: {
      fr: "Mon fils est en seconde et a besoin de cours réguliers. Pouvez-vous proposer un planning ?",
      ar: "ابني في الثانية ويحتاج لدروس منتظمة. هل يمكنكم اقتراح برنامج؟",
    },
    sentAt: { fr: "il y a 2 j", ar: "منذ يومين" },
    status: "accepted",
  },
  {
    id: "r-6",
    student: {
      name: { fr: "Walid Tahar", ar: "وليد طاهر" },
      initials: "WT",
      location: { fr: "Annaba", ar: "عنابة" },
      accent: "from-[#DD514D] to-[#DDA13A]",
    },
    course: { fr: "Cours particulier", ar: "درس خصوصي" },
    message: {
      fr: "Bonjour, je cherche un prof pour 2 h/semaine pendant l'été.",
      ar: "مرحبًا، أبحث عن أستاذ لساعتين/أسبوع خلال الصيف.",
    },
    sentAt: { fr: "il y a 4 j", ar: "منذ 4 أيام" },
    status: "rejected",
  },
];

export type Invoice = {
  id: string;
  date: { fr: string; ar: string };
  description: { fr: string; ar: string };
  amountDzd: number;
  status: "paid" | "pending";
};

export const invoices: Invoice[] = [
  { id: "INV-2026-06", date: { fr: "1 juin 2026", ar: "1 جوان 2026" }, description: { fr: "Commission 8 % · mai", ar: "عمولة 8٪ · ماي" }, amountDzd: 12480, status: "paid" },
  { id: "INV-2026-05", date: { fr: "1 mai 2026", ar: "1 ماي 2026" }, description: { fr: "Commission 8 % · avril", ar: "عمولة 8٪ · أفريل" }, amountDzd: 11200, status: "paid" },
  { id: "INV-2026-04", date: { fr: "1 avril 2026", ar: "1 أفريل 2026" }, description: { fr: "Commission 8 % · mars", ar: "عمولة 8٪ · مارس" }, amountDzd: 10560, status: "paid" },
  { id: "INV-2026-03", date: { fr: "1 mars 2026", ar: "1 مارس 2026" }, description: { fr: "Commission 8 % · février", ar: "عمولة 8٪ · فيفري" }, amountDzd: 9760, status: "paid" },
  { id: "INV-2026-02", date: { fr: "1 février 2026", ar: "1 فيفري 2026" }, description: { fr: "Commission 7 % · janvier", ar: "عمولة 7٪ · جانفي" }, amountDzd: 8120, status: "paid" },
  { id: "INV-2026-01", date: { fr: "1 janvier 2026", ar: "1 جانفي 2026" }, description: { fr: "Commission 7 % · décembre", ar: "عمولة 7٪ · ديسمبر" }, amountDzd: 7560, status: "paid" },
];

export const tiers = [
  { id: "free", thresholdDzd: 0, rate: 0, nameFr: "Découverte", nameAr: "اكتشاف" },
  { id: "starter", thresholdDzd: 30000, rate: 0.05, nameFr: "Démarrage", nameAr: "بداية" },
  { id: "pro", thresholdDzd: 100000, rate: 0.08, nameFr: "Pro", nameAr: "برو" },
  { id: "studio", thresholdDzd: 250000, rate: 0.12, nameFr: "Studio", nameAr: "استوديو" },
  { id: "agency", thresholdDzd: 500000, rate: 0.15, nameFr: "Agence", nameAr: "وكالة" },
];

/** Profile completion criteria for Top Rated tier */
export const topRatedCriteria = [
  { id: "rating", labelFr: "Note ≥ 4,9", labelAr: "تقييم ≥ 4,9", value: 4.92, target: 4.9, progress: 100 },
  { id: "sessions", labelFr: "≥ 25 sessions données", labelAr: "≥ 25 جلسة مقدّمة", value: 1240, target: 25, progress: 100 },
  { id: "response", labelFr: "Réponse < 2 h", labelAr: "ردّ < 2 س", value: 2, target: 2, progress: 92 },
];
