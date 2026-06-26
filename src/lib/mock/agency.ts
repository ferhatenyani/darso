export type AgencyMember = {
  id: string;
  name: { fr: string; ar: string };
  initials: string;
  subject: { fr: string; ar: string };
  topRated: boolean;
  monthRevenueDzd: number;
  splitPercent: number; // 0-100
  accent: string;
};

export const agency = {
  id: "ag-numidia",
  name: { fr: "Studio Numidia", ar: "استوديو نوميديا" },
  bio: {
    fr: "Collectif de cinq enseignants spécialisés en sciences exactes et langues, basé à Alger.",
    ar: "تجمّع لخمسة أساتذة متخصّصين في العلوم الدقيقة واللغات، مقرّه الجزائر العاصمة.",
  },
  memberCount: 5,
  totalRevenueDzd: 642000,
  joinedMonthsAgo: 14,
  founderId: "t-khalil",
};

export const agencyMembers: AgencyMember[] = [
  {
    id: "m-khalil",
    name: { fr: "Khalil Bensaïd", ar: "خليل بن سعيد" },
    initials: "KB",
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    topRated: true,
    monthRevenueDzd: 168000,
    splitPercent: 28,
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
  },
  {
    id: "m-yasmine",
    name: { fr: "Yasmine Haddad", ar: "ياسمين حدّاد" },
    initials: "YH",
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    topRated: true,
    monthRevenueDzd: 142000,
    splitPercent: 24,
    accent: "from-[#2E9E78] to-[#3E8FD0]",
  },
  {
    id: "m-imene",
    name: { fr: "Imène Laribi", ar: "إيمان العريبي" },
    initials: "IL",
    subject: { fr: "Physique", ar: "الفيزياء" },
    topRated: true,
    monthRevenueDzd: 132000,
    splitPercent: 22,
    accent: "from-[#2F6BFF] to-[#1C3A5E]",
  },
  {
    id: "m-amine",
    name: { fr: "Amine Cherif", ar: "أمين شريف" },
    initials: "AC",
    subject: { fr: "Programmation", ar: "البرمجة" },
    topRated: false,
    monthRevenueDzd: 124000,
    splitPercent: 16,
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
  },
  {
    id: "m-rayan",
    name: { fr: "Rayan Otmani", ar: "ريان عثماني" },
    initials: "RO",
    subject: { fr: "Piano", ar: "البيانو" },
    topRated: false,
    monthRevenueDzd: 76000,
    splitPercent: 10,
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
  },
];

export type AgencyInboxThread = {
  id: string;
  subject: { fr: string; ar: string };
  preview: { fr: string; ar: string };
  participantsCount: number;
  unread: boolean;
  ago: { fr: string; ar: string };
};

export const agencyInboxThreads: AgencyInboxThread[] = [
  {
    id: "ag-th-1",
    subject: { fr: "Pack Bac · proposition d'un parent", ar: "حزمة الباك · اقتراح من ولي أمر" },
    preview: {
      fr: "Une famille demande une formule combinant maths, physique et anglais pour trois enfants.",
      ar: "عائلة تطلب صيغة تجمع بين الرياضيات والفيزياء والإنجليزية لثلاثة أبناء.",
    },
    participantsCount: 3,
    unread: true,
    ago: { fr: "il y a 27 min", ar: "منذ 27 د" },
  },
  {
    id: "ag-th-2",
    subject: { fr: "Lycée El Mokrani · partenariat", ar: "ثانوية المقراني · شراكة" },
    preview: {
      fr: "Le proviseur souhaite organiser des ateliers communs pendant les vacances.",
      ar: "يرغب المدير في تنظيم ورشات مشتركة خلال العطل.",
    },
    participantsCount: 4,
    unread: false,
    ago: { fr: "il y a 2 h", ar: "منذ ساعتين" },
  },
];
