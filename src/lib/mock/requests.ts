import { featuredTeachers, type LocalizedString, type Teacher } from "./teachers";

export type RequestStatus = "open" | "negotiating" | "awarded" | "closed";
export type RequestMode = "online" | "in-person" | "both";
export type RequestUrgency = "low" | "med" | "high";
export type RequestAudience = "kids" | "lycee" | "students" | "adults";

export type RequestStudent = {
  id: string;
  name: LocalizedString;
  initials: string;
  /** Tailwind gradient classes for avatar */
  accent: string;
  city: LocalizedString;
  joinedYear: number;
};

export type RequestApplication = {
  id: string;
  teacher: Teacher;
  proposalMessage: LocalizedString;
  proposedRateDzd: number;
  availabilityNote: LocalizedString;
  /** Hours since posting */
  createdAtHours: number;
  isAwarded?: boolean;
};

export type LearningRequest = {
  id: string;
  slug: string;
  student: RequestStudent;
  /** True if request was posted anonymously */
  anonymous?: boolean;
  title: LocalizedString;
  body: LocalizedString;
  subject: LocalizedString;
  /** Maps to category key in mock/categories.ts */
  categoryKey: string;
  level: LocalizedString;
  audience: RequestAudience;
  budgetDzd: { min: number; max: number };
  mode: RequestMode;
  city: LocalizedString;
  /** Hours since posted, for relative time labels */
  postedAtHours: number;
  /** Localized deadline label like "Cette semaine" */
  deadline: LocalizedString;
  status: RequestStatus;
  urgency: RequestUrgency;
  applicationCount: number;
  applications: RequestApplication[];
  /** Whether the currently signed-in mock user owns this request */
  ownedByCurrentUser?: boolean;
};

const mockStudents: Record<string, RequestStudent> = {
  lina: {
    id: "u-lina",
    name: { fr: "Lina M.", ar: "لينا م." },
    initials: "LM",
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    city: { fr: "Constantine", ar: "قسنطينة" },
    joinedYear: 2024,
  },
  walid: {
    id: "u-walid",
    name: { fr: "Walid B.", ar: "وليد ب." },
    initials: "WB",
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    city: { fr: "Alger", ar: "الجزائر العاصمة" },
    joinedYear: 2025,
  },
  myriam: {
    id: "u-myriam",
    name: { fr: "Myriam K.", ar: "مريم ك." },
    initials: "MK",
    accent: "from-[#DDA13A] to-[#DD514D]",
    city: { fr: "Oran", ar: "وهران" },
    joinedYear: 2023,
  },
  reda: {
    id: "u-reda",
    name: { fr: "Réda H.", ar: "رضا ه." },
    initials: "RH",
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
    city: { fr: "Annaba", ar: "عنابة" },
    joinedYear: 2025,
  },
  nedjma: {
    id: "u-nedjma",
    name: { fr: "Nedjma A.", ar: "نجمة ع." },
    initials: "NA",
    accent: "from-[#2F6BFF] to-[#2E9E78]",
    city: { fr: "Tlemcen", ar: "تلمسان" },
    joinedYear: 2024,
  },
  karim: {
    id: "u-karim",
    name: { fr: "Karim D.", ar: "كريم د." },
    initials: "KD",
    accent: "from-[#3E8FD0] to-[#1C3A5E]",
    city: { fr: "Sétif", ar: "سطيف" },
    joinedYear: 2023,
  },
  sara: {
    id: "u-sara",
    name: { fr: "Sara T.", ar: "سارة ت." },
    initials: "ST",
    accent: "from-[#DD514D] to-[#DDA13A]",
    city: { fr: "Blida", ar: "البليدة" },
    joinedYear: 2025,
  },
  hocine: {
    id: "u-hocine",
    name: { fr: "Hocine R.", ar: "حسين ر." },
    initials: "HR",
    accent: "from-[#2E9E78] to-[#1C3A5E]",
    city: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
    joinedYear: 2024,
  },
  amina: {
    id: "u-amina",
    name: { fr: "Amina F.", ar: "أمينة ف." },
    initials: "AF",
    accent: "from-[#2F6BFF] to-[#DDA13A]",
    city: { fr: "Béjaïa", ar: "بجاية" },
    joinedYear: 2025,
  },
  zaki: {
    id: "u-zaki",
    name: { fr: "Zaki O.", ar: "زكي ع." },
    initials: "ZO",
    accent: "from-[#1C3A5E] to-[#DD514D]",
    city: { fr: "Batna", ar: "باتنة" },
    joinedYear: 2024,
  },
};

/** Mock current user — used by /requests/my and to flag owner controls. */
export const currentMockUser = mockStudents.lina;

const t = (id: string) =>
  featuredTeachers.find((x) => x.id === id) ?? featuredTeachers[0]!;

export const learningRequests: LearningRequest[] = [
  {
    id: "r-001",
    slug: "math-bac-revision-intensive",
    student: mockStudents.lina,
    title: {
      fr: "Cherche prof de Math pour Bac scientifique — révision intensive sur 6 semaines",
      ar: "أبحث عن أستاذ رياضيات لباك علمي — مراجعة مكثّفة على 6 أسابيع",
    },
    body: {
      fr: "Je passe le Bac en juin et je dois solidifier limites, dérivées et probabilités. Cherche quelqu'un de patient, qui explique avec des exercices guidés. 2 sessions / semaine, le soir si possible. Disponible en ligne ou à Constantine centre.",
      ar: "أجتاز الباك في جوان، وأحتاج إلى تثبيت النهايات والمشتقّات والاحتمالات. أبحث عن أستاذ صبور يشرح بتمارين موجَّهة. حصّتان أسبوعيًا، مساءً إن أمكن. متاحة على الإنترنت أو في وسط قسنطينة.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    categoryKey: "school",
    level: { fr: "Terminale · Bac scientifique", ar: "السنة النهائية · باك علمي" },
    audience: "lycee",
    budgetDzd: { min: 1200, max: 1800 },
    mode: "both",
    city: { fr: "Constantine", ar: "قسنطينة" },
    postedAtHours: 6,
    deadline: { fr: "Cette semaine", ar: "هذا الأسبوع" },
    status: "negotiating",
    urgency: "high",
    applicationCount: 7,
    ownedByCurrentUser: true,
    applications: [
      {
        id: "a-001-1",
        teacher: t("t-khalil"),
        proposalMessage: {
          fr: "Bonjour Lina, je prépare des élèves au Bac scientifique depuis 9 ans. Je peux te proposer un plan en 12 séances avec un bilan chaque semaine. On commence par les limites, on enchaîne avec les dérivées et on termine par 2 séances d'annales. Sessions de 90 min, mardi & vendredi 19h. À bientôt.",
          ar: "مرحبا لينا، أحضّر طلبة الباك العلمي منذ 9 سنوات. أقترح خطّة من 12 حصّة مع تقييم أسبوعي. نبدأ بالنهايات، ثم المشتقّات، وننهي بحصّتين على مواضيع سابقة. مدة الحصّة 90 د، الثلاثاء والجمعة 19:00. إلى اللقاء.",
        },
        proposedRateDzd: 1500,
        availabilityNote: {
          fr: "Mar/Ven 19h–21h (en ligne) — sam. matin si besoin",
          ar: "الثلاثاء والجمعة 19:00–21:00 (عبر الإنترنت) — السبت صباحًا عند الحاجة",
        },
        createdAtHours: 4,
        isAwarded: false,
      },
      {
        id: "a-001-2",
        teacher: t("t-imene"),
        proposalMessage: {
          fr: "Salut, je suis prof de physique mais je couvre aussi les maths du Bac. Mon approche : on identifie tes lacunes en 1h de diagnostic, puis on construit un plan. Je propose 1500 DZD/h et un suivi WhatsApp entre les séances.",
          ar: "أهلًا، أنا أستاذة فيزياء لكنّي أدرّس أيضًا رياضيات الباك. منهجي: نشخّص ثغراتك في حصّة ساعة، ثم نبني خطّة. السعر 1500 د.ج/سا مع متابعة عبر واتساب بين الحصص.",
        },
        proposedRateDzd: 1500,
        availabilityNote: {
          fr: "Soirs en semaine, 18h–20h30",
          ar: "أمسيات أيّام الأسبوع، 18:00–20:30",
        },
        createdAtHours: 5,
      },
      {
        id: "a-001-3",
        teacher: t("t-amine"),
        proposalMessage: {
          fr: "Bonjour, je donne aussi des cours de maths pour le Bac sciences. Si on travaille les probas, je peux ajouter un mini-projet Python pour visualiser — c'est souvent un déclic. Tarif souple selon le rythme.",
          ar: "مرحبًا، أقدّم أيضًا دروس رياضيات للباك العلمي. عند العمل على الاحتمالات، أضيف مشروعًا صغيرًا بالبايثون لتسهيل التصوّر — كثيرًا ما يكون اللحظة الحاسمة. السعر مرن حسب الإيقاع.",
        },
        proposedRateDzd: 1700,
        availabilityNote: {
          fr: "Lun/Mer/Sam, créneaux du soir",
          ar: "الاثنين والأربعاء والسبت، فترات مسائية",
        },
        createdAtHours: 5,
      },
    ],
  },
  {
    id: "r-002",
    slug: "ielts-7-plus-preparation",
    student: mockStudents.walid,
    title: {
      fr: "Préparation IELTS — objectif 7.5, départ Canada en septembre",
      ar: "تحضير IELTS — هدف 7.5، السفر إلى كندا في سبتمبر",
    },
    body: {
      fr: "Niveau actuel ~6.5 d'après un mock test. Le speaking et le writing me tirent vers le bas. Je veux 2 sessions / semaine pendant 3 mois, plus des corrections de tâches écrites entre les cours. Je préfère en ligne, le matin (avant le travail).",
      ar: "مستواي الحالي حوالي 6.5 وفق اختبار تجريبي. التحدّث والكتابة يخفضان معدّلي. أريد حصّتين أسبوعيًا لمدّة 3 أشهر، مع تصحيح كتابات بين الحصص. أفضّل الإنترنت، صباحًا قبل العمل.",
    },
    subject: { fr: "Anglais · IELTS", ar: "الإنجليزية · IELTS" },
    categoryKey: "exams",
    level: { fr: "Avancé (B2+)", ar: "متقدّم (B2+)" },
    audience: "adults",
    budgetDzd: { min: 1800, max: 2500 },
    mode: "online",
    city: { fr: "Alger", ar: "الجزائر العاصمة" },
    postedAtHours: 14,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 4,
    applications: [
      {
        id: "a-002-1",
        teacher: t("t-yasmine"),
        proposalMessage: {
          fr: "Hi Walid! 7.5 est tout à fait atteignable en 3 mois. On peut faire 1 session writing (analyse de tes essais) + 1 session speaking (mock + feedback structuré bandes 1 à 9). Je donne aussi un planning de vocabulaire ciblé.",
          ar: "أهلًا وليد! تحقيق 7.5 ممكن خلال 3 أشهر. حصّة كتابة (تحليل مقالاتك) + حصّة تحدّث (محاكاة + تغذية راجعة من 1 إلى 9). أضمّ خطّة مفردات موجَّهة.",
        },
        proposedRateDzd: 2000,
        availabilityNote: {
          fr: "Mar/Jeu 7h–8h30 (heure d'Alger)",
          ar: "الثلاثاء والخميس 7:00–8:30 (توقيت الجزائر)",
        },
        createdAtHours: 10,
      },
      {
        id: "a-002-2",
        teacher: t("t-amine"),
        proposalMessage: {
          fr: "Hello Walid, je suis dev mais bilingue EN/FR — j'ai passé l'IELTS l'an dernier (8.0). Je peux t'aider sur le speaking technique (interviews) si tu vises le Canada. Tarif d'ami.",
          ar: "مرحبًا وليد، أنا مطوّر لكنّي ثنائي اللغة EN/FR — اجتزت IELTS العام الماضي (8.0). أساعدك في التحدّث التقني (مقابلات) إذا كنت تستهدف كندا. سعر صديق.",
        },
        proposedRateDzd: 1800,
        availabilityNote: {
          fr: "Week-ends — matinée libre",
          ar: "نهايات الأسبوع — صباحية متاحة",
        },
        createdAtHours: 12,
      },
    ],
  },
  {
    id: "r-003",
    slug: "python-debutant-data",
    student: mockStudents.myriam,
    title: {
      fr: "Python débutant — pour la data analyse marketing",
      ar: "بايثون للمبتدئين — لتحليل بيانات التسويق",
    },
    body: {
      fr: "Marketing manager, zéro code. Je veux apprendre Python pour automatiser mes rapports Excel et explorer les données de campagnes. Pas besoin de devenir dev — juste autonome sur pandas et matplotlib. 1 session/semaine, 90 min.",
      ar: "مديرة تسويق بدون أي خلفية برمجية. أريد تعلّم بايثون لأتمتة تقارير إكسيل وتحليل بيانات الحملات. لا أحتاج أن أصبح مطوّرة — فقط الاستقلالية في pandas و matplotlib. حصّة أسبوعية، 90 د.",
    },
    subject: { fr: "Python · Data", ar: "بايثون · بيانات" },
    categoryKey: "code",
    level: { fr: "Débutant", ar: "مبتدئ" },
    audience: "adults",
    budgetDzd: { min: 2000, max: 2800 },
    mode: "online",
    city: { fr: "Oran", ar: "وهران" },
    postedAtHours: 32,
    deadline: { fr: "Pas pressé", ar: "غير مستعجل" },
    status: "open",
    urgency: "low",
    applicationCount: 2,
    applications: [
      {
        id: "a-003-1",
        teacher: t("t-amine"),
        proposalMessage: {
          fr: "Bonjour Myriam, exactement mon profil. On part de zéro avec un mini-projet : analyse de 1000 campagnes simulées. Tu seras autonome sur pandas en 6 séances et sur matplotlib en 3 de plus. Code et notebooks fournis.",
          ar: "مرحبًا مريم، هذا تخصّصي. نبدأ من الصفر بمشروع صغير: تحليل 1000 حملة محاكاة. ستكونين مستقلّة في pandas خلال 6 حصص و matplotlib في 3 أخرى. الأكواد والـ notebooks مرفقة.",
        },
        proposedRateDzd: 2400,
        availabilityNote: {
          fr: "Mercredi soir, samedi matin",
          ar: "مساء الأربعاء، صباح السبت",
        },
        createdAtHours: 20,
      },
    ],
  },
  {
    id: "r-004",
    slug: "piano-debutant-enfant",
    student: mockStudents.reda,
    title: {
      fr: "Cours de piano pour ma fille de 8 ans — Annaba uniquement",
      ar: "دروس بيانو لابنتي ذات 8 سنوات — عنّابة فقط",
    },
    body: {
      fr: "Ma fille débute le piano et adore la musique classique. Elle a un clavier de 61 touches à la maison. Je cherche un prof patient, idéalement avec expérience pédagogique pour enfants. 1 session de 45 min / semaine, à la maison ou chez le prof.",
      ar: "ابنتي تبدأ البيانو وتعشق الموسيقى الكلاسيكية. لديها لوحة 61 مفتاحًا في البيت. أبحث عن أستاذ صبور، يفضَّل أن يكون له تجربة مع الأطفال. حصّة واحدة 45 د أسبوعيًا، في البيت أو عند الأستاذ.",
    },
    subject: { fr: "Piano", ar: "البيانو" },
    categoryKey: "music",
    level: { fr: "Débutant · enfant", ar: "مبتدئة · طفلة" },
    audience: "kids",
    budgetDzd: { min: 1200, max: 2000 },
    mode: "in-person",
    city: { fr: "Annaba", ar: "عنّابة" },
    postedAtHours: 48,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "awarded",
    urgency: "low",
    applicationCount: 3,
    applications: [
      {
        id: "a-004-1",
        teacher: t("t-rayan"),
        proposalMessage: {
          fr: "Bonjour, je donne des cours à des enfants depuis 5 ans. Méthode douce, on commence par le rythme et la posture avant la lecture. J'ai un piano droit et un coin enfant. Je peux aussi me déplacer si vous êtes vers la corniche.",
          ar: "مرحبًا، أدرّس الأطفال منذ 5 سنوات. أسلوب لطيف، نبدأ بالإيقاع والوضعية قبل قراءة النوتة. لديّ بيانو منتصب وركن للأطفال. يمكنني التنقّل أيضًا إذا كنتم قرب الكورنيش.",
        },
        proposedRateDzd: 1600,
        availabilityNote: {
          fr: "Mer/Sam après-midi · à mon studio",
          ar: "الأربعاء والسبت بعد الزوال · في الاستوديو",
        },
        createdAtHours: 30,
        isAwarded: true,
      },
    ],
  },
  {
    id: "r-005",
    slug: "tajwid-debutant-adulte",
    student: mockStudents.nedjma,
    title: {
      fr: "Cours de tajwid pour adulte débutante — calme et bienveillant",
      ar: "دروس تجويد لمبتدئة بالغة — بأسلوب هادئ ومتعاطف",
    },
    body: {
      fr: "Je veux apprendre le tajwid pour bien réciter, je débute vraiment. Quelqu'un de patient, qui corrige sans juger. 2 sessions de 30 min par semaine, en ligne pour commencer. Je peux passer au présentiel si on est sur Tlemcen.",
      ar: "أريد تعلّم التجويد لأتقن التلاوة، أنا مبتدئة فعلًا. أحتاج إلى من يصوّب بصبر دون انتقاد. حصّتان 30 د أسبوعيًا، عن بُعد للبدء. يمكنني الانتقال إلى الحضوري إذا كنّا في تلمسان.",
    },
    subject: { fr: "Coran · Tajwid", ar: "القرآن · التجويد" },
    categoryKey: "religion",
    level: { fr: "Débutant", ar: "مبتدئ" },
    audience: "adults",
    budgetDzd: { min: 700, max: 1100 },
    mode: "both",
    city: { fr: "Tlemcen", ar: "تلمسان" },
    postedAtHours: 72,
    deadline: { fr: "Pas pressé", ar: "غير مستعجل" },
    status: "open",
    urgency: "low",
    applicationCount: 5,
    applications: [
      {
        id: "a-005-1",
        teacher: t("t-souad"),
        proposalMessage: {
          fr: "السلام عليكم، je prends souvent des adultes débutantes. On commence par les makharij (points d'articulation) avec audio comparatif, puis on enchaîne lettre par lettre. Aucune pression, à ton rythme.",
          ar: "السلام عليكم، أستقبل غالبًا مبتدئات بالغات. نبدأ بمخارج الحروف مع تسجيلات مقارنة، ثم نتقدّم حرفًا حرفًا. لا ضغط، على إيقاعك.",
        },
        proposedRateDzd: 900,
        availabilityNote: {
          fr: "Tous les soirs sauf vendredi",
          ar: "كل المساءات ما عدا الجمعة",
        },
        createdAtHours: 50,
      },
    ],
  },
  {
    id: "r-006",
    slug: "physique-bac-mecanique",
    student: mockStudents.karim,
    title: {
      fr: "Soutien physique-mécanique — Bac sciences expérimentales",
      ar: "دعم في الفيزياء — الميكانيك للباك علوم تجريبية",
    },
    body: {
      fr: "Je décroche sur la mécanique du point et les oscillateurs. J'aimerais 1 session/semaine + des exercices corrigés entre les cours. Disponible à Sétif ou en ligne, peu importe.",
      ar: "أتعثّر في ميكانيك النقطة والمذبذبات. أريد حصّة أسبوعية + تمارين مصحَّحة بين الحصص. متاح في سطيف أو على الإنترنت.",
    },
    subject: { fr: "Physique", ar: "الفيزياء" },
    categoryKey: "school",
    level: { fr: "Terminale · sc. expérimentales", ar: "السنة النهائية · علوم تجريبية" },
    audience: "lycee",
    budgetDzd: { min: 1100, max: 1500 },
    mode: "both",
    city: { fr: "Sétif", ar: "سطيف" },
    postedAtHours: 5,
    deadline: { fr: "Cette semaine", ar: "هذا الأسبوع" },
    status: "open",
    urgency: "high",
    applicationCount: 6,
    applications: [
      {
        id: "a-006-1",
        teacher: t("t-imene"),
        proposalMessage: {
          fr: "Bonjour Karim, la mécanique du point devient claire avec une bonne représentation des forces. On va décomposer chaque exercice : schéma → bilan → équation → résolution. Je fournis 30 exercices d'annales corrigés.",
          ar: "مرحبًا كريم، ميكانيك النقطة تتّضح بتمثيل جيّد للقوى. سنفكّك كل تمرين: رسم → موازنة → معادلة → حلّ. أرفق 30 تمرينًا من مواضيع سابقة مصحَّحة.",
        },
        proposedRateDzd: 1400,
        availabilityNote: {
          fr: "Mar/Jeu 17h–19h",
          ar: "الثلاثاء والخميس 17:00–19:00",
        },
        createdAtHours: 3,
      },
    ],
  },
  {
    id: "r-007",
    slug: "francais-cem-redaction",
    student: mockStudents.sara,
    title: {
      fr: "Aide rédaction · CEM 4e année — moyenne en français à remonter",
      ar: "دعم في التعبير الكتابي · سنة 4 متوسط — رفع المعدّل في الفرنسية",
    },
    body: {
      fr: "Mon fils a du mal avec les rédactions au CEM. Il comprend les textes mais bloque à l'écrit. Je cherche quelqu'un de structuré, qui peut donner une méthode (introduction, développement, conclusion) avec exercices guidés. À Blida ou en ligne le mercredi.",
      ar: "ابني يجد صعوبة في الإنشاء بالفرنسية في 4 متوسط. يفهم النصوص لكن يتعثّر في الكتابة. أبحث عن أستاذ منهجي يلقّن طريقة (مقدّمة، عرض، خاتمة) مع تمارين موجَّهة. في البليدة أو عبر الإنترنت يوم الأربعاء.",
    },
    subject: { fr: "Français · rédaction", ar: "الفرنسية · التعبير الكتابي" },
    categoryKey: "school",
    level: { fr: "CEM · 4ᵉ année", ar: "متوسط · سنة 4" },
    audience: "kids",
    budgetDzd: { min: 900, max: 1300 },
    mode: "both",
    city: { fr: "Blida", ar: "البليدة" },
    postedAtHours: 96,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "negotiating",
    urgency: "med",
    applicationCount: 4,
    applications: [
      {
        id: "a-007-1",
        teacher: t("t-yasmine"),
        proposalMessage: {
          fr: "Bonjour, j'enseigne aussi le français pour le CEM. Pour la rédaction, ma méthode est très visuelle : on construit ensemble un schéma de paragraphe par paragraphe, puis on rédige. Je corrige avec un code couleur. Mer 16h–17h30 ?",
          ar: "مرحبًا، أدرّس الفرنسية أيضًا للمتوسط. في التعبير الكتابي، أعتمد منهجًا بصريًا: نبني معًا مخطّطًا لكل فقرة، ثم نحرّر. أصحّح بترميز ألوان. الأربعاء 16:00–17:30 ؟",
        },
        proposedRateDzd: 1200,
        availabilityNote: {
          fr: "Mer 16h–17h30 · en ligne",
          ar: "الأربعاء 16:00–17:30 · عن بُعد",
        },
        createdAtHours: 80,
      },
    ],
  },
  {
    id: "r-008",
    slug: "ui-ux-portfolio-junior",
    student: mockStudents.hocine,
    title: {
      fr: "Mentorat UI/UX — préparer un portfolio junior pour postuler en agence",
      ar: "إرشاد UI/UX — تحضير حافظة أعمال للمستوى المبتدئ للترشّح للوكالات",
    },
    body: {
      fr: "Autodidacte, j'ai 2 ans d'expérience freelance mais mon portfolio est faible. Je veux un mentor pour structurer 3 case studies en 6 semaines, avec des feedbacks honnêtes sur Figma et la narration. En ligne, créneaux flexibles.",
      ar: "متعلّم ذاتيًا، لديّ سنتان من العمل الحرّ لكن حافظتي ضعيفة. أبحث عن مرشد لبناء 3 دراسات حالة خلال 6 أسابيع، مع ملاحظات صادقة على Figma والسرد. عن بُعد، فترات مرنة.",
    },
    subject: { fr: "Design · UI/UX", ar: "التصميم · UI/UX" },
    categoryKey: "design",
    level: { fr: "Intermédiaire", ar: "متوسّط" },
    audience: "adults",
    budgetDzd: { min: 2500, max: 4000 },
    mode: "online",
    city: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
    postedAtHours: 18,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 3,
    applications: [],
  },
  {
    id: "r-009",
    slug: "guitare-acoustique-debutant",
    student: mockStudents.amina,
    title: {
      fr: "Guitare acoustique débutante — apprendre 5 chansons cet été",
      ar: "غيتار صوتي للمبتدئات — تعلّم 5 أغانٍ هذا الصيف",
    },
    body: {
      fr: "Étudiante, j'ai une guitare offerte mais je ne sais pas en jouer. Objectif fun : apprendre 5 chansons faciles d'ici septembre, des accords ouverts au strumming basique. Budget serré.",
      ar: "طالبة، عندي غيتار هدية لكنّي لا أعرف العزف. هدف ممتع: تعلّم 5 أغانٍ سهلة قبل سبتمبر، من الأوتار المفتوحة إلى الإيقاع الأساسي. الميزانية محدودة.",
    },
    subject: { fr: "Guitare", ar: "الغيتار" },
    categoryKey: "music",
    level: { fr: "Débutant total", ar: "مبتدئة تمامًا" },
    audience: "students",
    budgetDzd: { min: 500, max: 900 },
    mode: "both",
    city: { fr: "Béjaïa", ar: "بجاية" },
    postedAtHours: 200,
    deadline: { fr: "Pas pressé", ar: "غير مستعجل" },
    status: "closed",
    urgency: "low",
    applicationCount: 8,
    applications: [],
  },
  {
    id: "r-010",
    slug: "ens-prepa-mathematiques",
    student: mockStudents.zaki,
    title: {
      fr: "Préparation concours ENS Maths — niveau exigeant requis",
      ar: "تحضير لمسابقة ENS رياضيات — مستوى عالٍ مطلوب",
    },
    body: {
      fr: "Je vise l'ENS Kouba en septembre. J'ai besoin d'un prof qui a déjà préparé des candidats au concours, pas un prof de Bac. Travail sur les annales, démonstrations rigoureuses, suivi serré. 3 séances / semaine pendant l'été.",
      ar: "أستهدف ENS كوبا في سبتمبر. أحتاج إلى أستاذ سبق أن حضّر مترشّحين للمسابقة، لا أستاذ باك. عمل على المواضيع السابقة، براهين دقيقة، متابعة مكثّفة. 3 حصص أسبوعيًا خلال الصيف.",
    },
    subject: { fr: "Mathématiques · ENS", ar: "الرياضيات · ENS" },
    categoryKey: "exams",
    level: { fr: "Concours post-bac", ar: "مسابقة ما بعد الباك" },
    audience: "students",
    budgetDzd: { min: 2500, max: 3500 },
    mode: "online",
    city: { fr: "Batna", ar: "باتنة" },
    postedAtHours: 12,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "high",
    applicationCount: 1,
    applications: [
      {
        id: "a-010-1",
        teacher: t("t-khalil"),
        proposalMessage: {
          fr: "J'ai préparé 7 candidats à l'ENS Kouba ces 3 dernières années, dont 5 admis. Je propose un plan en 36 séances, avec un test blanc toutes les 4 semaines. Tarif : 3000 DZD/h, 3 séances/sem comme demandé.",
          ar: "حضّرت 7 مترشّحين لـ ENS كوبا خلال 3 سنوات، نجح منهم 5. أقترح خطّة من 36 حصّة، مع امتحان تجريبي كل 4 أسابيع. السعر 3000 د.ج/سا، 3 حصص أسبوعيًا كما طلبت.",
        },
        proposedRateDzd: 3000,
        availabilityNote: {
          fr: "Lun/Mer/Ven 18h–20h",
          ar: "الاثنين والأربعاء والجمعة 18:00–20:00",
        },
        createdAtHours: 6,
      },
    ],
  },
  {
    id: "r-011",
    slug: "espagnol-conversation-niveau-a2",
    student: mockStudents.lina,
    title: {
      fr: "Conversation espagnole · niveau A2 — pour préparer un voyage",
      ar: "محادثة إسبانية · مستوى A2 — للتحضير لسفر",
    },
    body: {
      fr: "J'ai pris des cours d'espagnol au lycée, je veux remettre en marche pour un voyage en septembre. Surtout du parlé : phrases utiles, vocabulaire voyage. 2 sessions / semaine, en ligne.",
      ar: "درست الإسبانية في الثانوية، أريد تنشيطها لسفر في سبتمبر. أساسًا محادثة: جمل عملية ومفردات السفر. حصّتان أسبوعيًا، عبر الإنترنت.",
    },
    subject: { fr: "Espagnol", ar: "الإسبانية" },
    categoryKey: "languages",
    level: { fr: "A2", ar: "A2" },
    audience: "adults",
    budgetDzd: { min: 1200, max: 1800 },
    mode: "online",
    city: { fr: "Constantine", ar: "قسنطينة" },
    postedAtHours: 24,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 2,
    ownedByCurrentUser: true,
    applications: [],
  },
  {
    id: "r-012",
    slug: "arabe-classique-adulte",
    student: mockStudents.walid,
    title: {
      fr: "Arabe classique pour adulte arabophone — renforcer la grammaire",
      ar: "العربية الفصحى لبالغ متحدّث بالعامية — تعزيز القواعد",
    },
    body: {
      fr: "Je parle l'algérien tous les jours mais je suis faible en grammaire classique. Je veux pouvoir écrire des emails formels propres et lire des articles sans bloquer. 1 session/semaine.",
      ar: "أتحدّث الجزائرية يوميًا لكنّي ضعيف في القواعد الفصحى. أريد أن أكتب رسائل رسمية سليمة وأقرأ المقالات دون توقّف. حصّة أسبوعية.",
    },
    subject: { fr: "Arabe classique", ar: "العربية الفصحى" },
    categoryKey: "languages",
    level: { fr: "Intermédiaire", ar: "متوسّط" },
    audience: "adults",
    budgetDzd: { min: 1000, max: 1500 },
    mode: "online",
    city: { fr: "Alger", ar: "الجزائر العاصمة" },
    postedAtHours: 40,
    deadline: { fr: "Pas pressé", ar: "غير مستعجل" },
    status: "open",
    urgency: "low",
    applicationCount: 2,
    applications: [],
  },
  {
    id: "r-013",
    slug: "marketing-digital-pme",
    student: mockStudents.myriam,
    title: {
      fr: "Marketing digital pour ma PME — stratégie complète sur 2 mois",
      ar: "تسويق رقمي لشركتي الصغيرة — استراتيجية كاملة على شهرين",
    },
    body: {
      fr: "Je dirige une boutique de cosmétique bio à Oran. Présence Insta correcte mais conversions faibles. Je veux travailler funnel, content plan, basics SEO et publicité Meta. Sessions individuelles, en ligne, le soir.",
      ar: "أدير متجر مستحضرات تجميل عضوية بوهران. حضور جيّد على إنستغرام لكن المبيعات ضعيفة. أريد العمل على القمع، خطّة المحتوى، أساسيات SEO وإعلانات Meta. حصص فردية، عن بُعد، مساءً.",
    },
    subject: { fr: "Marketing · stratégie", ar: "تسويق · استراتيجية" },
    categoryKey: "business",
    level: { fr: "Avancé", ar: "متقدّم" },
    audience: "adults",
    budgetDzd: { min: 3000, max: 5000 },
    mode: "online",
    city: { fr: "Oran", ar: "وهران" },
    postedAtHours: 8,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 5,
    applications: [],
  },
  {
    id: "r-014",
    slug: "soutien-primaire-lecture",
    student: mockStudents.reda,
    title: {
      fr: "Soutien lecture · primaire 3e année — fluidité et compréhension",
      ar: "دعم القراءة · ابتدائي سنة 3 — الطلاقة والفهم",
    },
    body: {
      fr: "Mon fils lit lentement et bute sur des mots simples. Je veux 2 séances courtes par semaine, à la maison à Annaba, avec un cahier de jeux de lecture. Pas trop scolaire — il a déjà l'école.",
      ar: "ابني يقرأ ببطء ويتوقّف عند كلمات بسيطة. أريد حصّتين قصيرتين أسبوعيًا، في البيت بعنّابة، مع كرّاس ألعاب قراءة. ليس مدرسيًا — لديه المدرسة بالفعل.",
    },
    subject: { fr: "Français · lecture", ar: "الفرنسية · القراءة" },
    categoryKey: "school",
    level: { fr: "Primaire · 3ᵉ année", ar: "ابتدائي · سنة 3" },
    audience: "kids",
    budgetDzd: { min: 800, max: 1200 },
    mode: "in-person",
    city: { fr: "Annaba", ar: "عنّابة" },
    postedAtHours: 60,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "negotiating",
    urgency: "med",
    applicationCount: 3,
    applications: [],
  },
  {
    id: "r-015",
    slug: "react-fullstack-projet-portfolio",
    student: mockStudents.nedjma,
    title: {
      fr: "Stack React/Node — un vrai projet pour mon portfolio dev",
      ar: "React/Node — مشروع حقيقي لحافظة عمل مطوّرة",
    },
    body: {
      fr: "Je sors d'une formation bootcamp, je veux construire UN projet sérieux (auth + DB + tests + déploiement). Idée : marketplace pour artisans locaux. Je cherche un mentor pour 8 séances + revues de code asynchrones.",
      ar: "تخرّجت من تدريب مكثّف، أريد بناء مشروع واحد جدّي (مصادقة + قاعدة + اختبارات + نشر). الفكرة: منصّة للحرفيين المحلّيين. أبحث عن مرشد لـ 8 حصص + مراجعات أكواد لاتزامنية.",
    },
    subject: { fr: "Dev web · React/Node", ar: "تطوير الويب · React/Node" },
    categoryKey: "code",
    level: { fr: "Intermédiaire", ar: "متوسّط" },
    audience: "adults",
    budgetDzd: { min: 2200, max: 3200 },
    mode: "online",
    city: { fr: "Tlemcen", ar: "تلمسان" },
    postedAtHours: 30,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 4,
    applications: [
      {
        id: "a-015-1",
        teacher: t("t-amine"),
        proposalMessage: {
          fr: "Bonjour Nedjma, projet pile dans mon créneau. Plan : sprint 1 auth + DB Postgres, sprint 2 logique métier + tests, sprint 3 UI + déploiement Vercel/Railway. Revues async sur GitHub entre les séances.",
          ar: "مرحبًا نجمة، مشروع في صميم اختصاصي. الخطّة: سبرنت 1 مصادقة + قاعدة Postgres، سبرنت 2 المنطق + اختبارات، سبرنت 3 الواجهة + النشر Vercel/Railway. مراجعات لاتزامنية على GitHub.",
        },
        proposedRateDzd: 2800,
        availabilityNote: {
          fr: "Sam/Dim, 2h par séance",
          ar: "السبت والأحد، ساعتان لكل حصّة",
        },
        createdAtHours: 22,
      },
    ],
  },
  {
    id: "r-016",
    slug: "comptabilite-entreprise-basics",
    student: mockStudents.karim,
    title: {
      fr: "Comptabilité de base — gestion d'une petite entreprise",
      ar: "محاسبة أساسية — إدارة شركة صغيرة",
    },
    body: {
      fr: "J'ouvre une petite imprimerie. Aucune notion de compta. Je veux comprendre journal, grand livre, bilan, et savoir lire mon banquier. Cours pragmatique sur 5 séances.",
      ar: "أفتح مطبعة صغيرة. لا فكرة لديّ عن المحاسبة. أريد فهم اليومية، الأستاذ، الميزانية، وقراءة كشف البنك. درس عملي على 5 حصص.",
    },
    subject: { fr: "Comptabilité", ar: "المحاسبة" },
    categoryKey: "business",
    level: { fr: "Débutant", ar: "مبتدئ" },
    audience: "adults",
    budgetDzd: { min: 1500, max: 2200 },
    mode: "both",
    city: { fr: "Sétif", ar: "سطيف" },
    postedAtHours: 70,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 1,
    applications: [],
  },
  {
    id: "r-017",
    slug: "violin-classique-enfant",
    student: mockStudents.sara,
    anonymous: true,
    title: {
      fr: "Violon classique enfant 10 ans — Blida ou environs",
      ar: "كمان كلاسيكي طفل 10 سنوات — البليدة أو الجوار",
    },
    body: {
      fr: "Mon fils veut apprendre le violon depuis 2 ans. Je cherche un prof avec une vraie pédagogie enfant, idéalement méthode Suzuki ou similaire. À domicile uniquement.",
      ar: "ابني يرغب في تعلّم الكمان منذ سنتين. أبحث عن أستاذ بمنهج طفوليّ حقيقي، يفضَّل سوزوكي أو ما يشبهها. في البيت فقط.",
    },
    subject: { fr: "Violon", ar: "الكمان" },
    categoryKey: "music",
    level: { fr: "Débutant · enfant", ar: "مبتدئ · طفل" },
    audience: "kids",
    budgetDzd: { min: 1500, max: 2500 },
    mode: "in-person",
    city: { fr: "Blida", ar: "البليدة" },
    postedAtHours: 36,
    deadline: { fr: "Pas pressé", ar: "غير مستعجل" },
    status: "open",
    urgency: "low",
    applicationCount: 2,
    applications: [],
  },
  {
    id: "r-018",
    slug: "anglais-business-cadre",
    student: mockStudents.hocine,
    title: {
      fr: "Anglais business — pour réunions internationales hebdo",
      ar: "إنجليزية الأعمال — لاجتماعات دولية أسبوعية",
    },
    body: {
      fr: "Cadre, j'anime déjà des réunions en français. Je veux switcher partiellement en anglais : phrases pros, gestion du désaccord poliment, présenter des chiffres. 1 session/semaine, 90 min, en ligne.",
      ar: "إطار، أنشّط اجتماعات بالفرنسية. أريد التحوّل جزئيًا إلى الإنجليزية: جمل احترافية، إدارة الخلاف بأدب، تقديم الأرقام. حصّة أسبوعية، 90 د، عن بُعد.",
    },
    subject: { fr: "Anglais · business", ar: "إنجليزية · أعمال" },
    categoryKey: "languages",
    level: { fr: "Avancé", ar: "متقدّم" },
    audience: "adults",
    budgetDzd: { min: 2000, max: 3000 },
    mode: "online",
    city: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
    postedAtHours: 26,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "negotiating",
    urgency: "med",
    applicationCount: 3,
    applications: [],
  },
  {
    id: "r-019",
    slug: "arabe-coranique-tahfeedh",
    student: mockStudents.amina,
    title: {
      fr: "Tahfeedh — mémorisation du Coran, juz 'Amma pour mon enfant",
      ar: "تحفيظ القرآن — جزء عمّ لطفلي",
    },
    body: {
      fr: "Je voudrais que mon fils de 9 ans mémorise juz 'Amma cet été. 3 séances courtes par semaine, en présentiel à Béjaïa ou en ligne si bonne pédagogie enfant.",
      ar: "أريد لابني (9 سنوات) أن يحفظ جزء عمّ هذا الصيف. 3 حصص قصيرة أسبوعيًا، حضوريًا في بجاية أو عن بُعد إذا كانت الطريقة ملائمة للأطفال.",
    },
    subject: { fr: "Coran · mémorisation", ar: "القرآن · حفظ" },
    categoryKey: "religion",
    level: { fr: "Enfant", ar: "طفل" },
    audience: "kids",
    budgetDzd: { min: 700, max: 1100 },
    mode: "both",
    city: { fr: "Béjaïa", ar: "بجاية" },
    postedAtHours: 16,
    deadline: { fr: "Ce mois", ar: "هذا الشهر" },
    status: "open",
    urgency: "med",
    applicationCount: 4,
    applications: [
      {
        id: "a-019-1",
        teacher: t("t-souad"),
        proposalMessage: {
          fr: "Bonjour, je travaille beaucoup avec les enfants. Pour juz 'Amma en été, je propose 3 séances de 30 min par semaine, avec un cahier de suivi et de courtes vidéos de révision le week-end. À ton rythme.",
          ar: "مرحبًا، أعمل كثيرًا مع الأطفال. لحفظ جزء عمّ في الصيف، أقترح 3 حصص 30 د أسبوعيًا، مع كرّاس متابعة وفيديوهات مراجعة قصيرة في نهاية الأسبوع. على إيقاع طفلك.",
        },
        proposedRateDzd: 900,
        availabilityNote: {
          fr: "Sam/Lun/Mer matins",
          ar: "صباح السبت والاثنين والأربعاء",
        },
        createdAtHours: 12,
      },
    ],
  },
  {
    id: "r-020",
    slug: "informatique-bases-senior",
    student: mockStudents.zaki,
    title: {
      fr: "Informatique de base pour ma mère (60 ans) — patience requise",
      ar: "أساسيات الإعلام الآلي لوالدتي (60 سنة) — يلزم الصبر",
    },
    body: {
      fr: "Ma mère veut envoyer des emails à mes frères à l'étranger et passer des appels vidéo. Tout est à faire : souris, clavier, navigation, Gmail, WhatsApp web. Quelqu'un de très patient, idéalement bilingue arabe/français. À Batna ou en ligne.",
      ar: "تريد أمّي إرسال رسائل لإخوتي في الخارج وإجراء مكالمات فيديو. كل شيء يجب تعلّمه: الفأرة، لوحة المفاتيح، التصفّح، Gmail، WhatsApp web. شخص صبور جدًا، يفضَّل ثنائي اللغة عربي/فرنسي. في باتنة أو عن بُعد.",
    },
    subject: { fr: "Informatique · bases", ar: "الإعلام الآلي · الأساسيات" },
    categoryKey: "code",
    level: { fr: "Débutant absolu", ar: "مبتدئ تمامًا" },
    audience: "adults",
    budgetDzd: { min: 800, max: 1300 },
    mode: "both",
    city: { fr: "Batna", ar: "باتنة" },
    postedAtHours: 4,
    deadline: { fr: "Cette semaine", ar: "هذا الأسبوع" },
    status: "open",
    urgency: "high",
    applicationCount: 0,
    applications: [],
  },
];

export function getRequestBySlug(slug: string): LearningRequest | undefined {
  return learningRequests.find((r) => r.slug === slug || r.id === slug);
}

export function getRequestsByOwner(): LearningRequest[] {
  return learningRequests.filter((r) => r.ownedByCurrentUser);
}
