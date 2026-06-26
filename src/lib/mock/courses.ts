import { featuredTeachers, type Teacher, type LocalizedString } from "./teachers";

export type CourseFormat = "1to1" | "cohort" | "event" | "ondemand";
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "any";

export type CourseDate = {
  id: string;
  label: { fr: string; ar: string };
  startISO: string;
  spotsTaken: number;
  spotsTotal: number;
};

export type SyllabusSection = {
  title: LocalizedString;
  items: LocalizedString[];
};

export type Course = {
  id: string;
  slug: string;
  teacher: Teacher;
  title: LocalizedString;
  subtitle: LocalizedString;
  subject: LocalizedString;
  format: CourseFormat;
  level: CourseLevel;
  durationLabel: { fr: string; ar: string };
  priceDzd: number;
  rating: number;
  reviews: number;
  /** localized 4-6 bullets — "you'll learn" */
  outcomes: LocalizedString[];
  /** localized "includes" mini-list */
  includes: LocalizedString[];
  syllabus: SyllabusSection[];
  dates: CourseDate[];
  /** Visual accent class (gradient) for the editorial header */
  accent: string;
  language: { fr: string[]; ar: string[] };
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;

export const courses: Course[] = [
  {
    id: "c-math-bac",
    slug: "math-bac-limites-continuite",
    teacher: t("t-khalil"),
    title: {
      fr: "Math Bac · Limites & continuité de A à Z",
      ar: "رياضيات الباك · النهايات والاستمرار من الألف إلى الياء",
    },
    subtitle: {
      fr: "Maîtrisez le premier chapitre du programme et démarrez l'année du bon pied.",
      ar: "أتقن أوّل فصول البرنامج وابدأ السنة بأفضل قدم.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "6 semaines · 12h cumul", ar: "6 أسابيع · 12 سا تراكميًا" },
    priceDzd: 4500,
    rating: 4.9,
    reviews: 96,
    outcomes: [
      {
        fr: "Calculer les limites usuelles sans hésitation, formes indéterminées comprises",
        ar: "حساب النهايات المعتادة بثقة، بما في ذلك الأشكال غير المحدّدة",
      },
      {
        fr: "Identifier la continuité d'une fonction sur un intervalle ou en un point",
        ar: "تمييز استمرارية دالة على مجال أو في نقطة محدّدة",
      },
      {
        fr: "Appliquer le théorème des valeurs intermédiaires sur sujets type Bac",
        ar: "تطبيق مبرهنة القيم الوسيطية على نماذج باك",
      },
      {
        fr: "Rédiger une copie propre — méthode, justification, conclusion",
        ar: "تحرير ورقة نظيفة — منهج، تبرير، خلاصة",
      },
    ],
    includes: [
      { fr: "12 séances live · 90 min", ar: "12 جلسة مباشرة · 90 د" },
      { fr: "Replay HD pendant 1 an", ar: "إعادة بثّ HD لمدّة سنة" },
      { fr: "30 fiches méthode PDF", ar: "30 بطاقة منهجية PDF" },
      { fr: "Annales corrigées 2018-2024", ar: "مواضيع الباك مع التصحيح 2018-2024" },
      { fr: "Groupe WhatsApp avec le prof", ar: "مجموعة واتساب مع الأستاذ" },
      { fr: "Examen blanc + correction perso", ar: "باك أبيض + تصحيح شخصي" },
    ],
    syllabus: [
      {
        title: { fr: "Semaine 1 — Rappels et premières limites", ar: "الأسبوع 1 — مراجعات والنهايات الأولى" },
        items: [
          { fr: "Notion intuitive de limite, lecture graphique", ar: "المفهوم البديهي للنهاية والقراءة البيانية" },
          { fr: "Limites de référence — racine, exponentielle, ln", ar: "نهايات مرجعية — الجذر، الأسّ، اللوغاريتم" },
          { fr: "Exercices d'échauffement (4 niveaux)", ar: "تمارين تمهيدية (4 مستويات)" },
        ],
      },
      {
        title: { fr: "Semaine 2 — Formes indéterminées", ar: "الأسبوع 2 — الأشكال غير المحدّدة" },
        items: [
          { fr: "Les 4 FI classiques : 0/0, ∞/∞, ∞-∞, 0×∞", ar: "الأشكال الأربعة الكلاسيكية: 0/0، ∞/∞، ∞-∞، 0×∞" },
          { fr: "Factorisation et conjuguée — techniques de bac", ar: "التحليل والمرافق — تقنيات الباك" },
          { fr: "Limites par croissances comparées", ar: "النهايات عبر مقارنة النموّ" },
        ],
      },
      {
        title: { fr: "Semaine 3 — Continuité", ar: "الأسبوع 3 — الاستمرارية" },
        items: [
          { fr: "Continuité en un point et sur un intervalle", ar: "الاستمرار في نقطة وعلى مجال" },
          { fr: "Prolongement par continuité", ar: "التمديد بالاستمرار" },
        ],
      },
      {
        title: { fr: "Semaines 4-6 — Sujets type Bac", ar: "الأسابيع 4-6 — مواضيع نمط الباك" },
        items: [
          { fr: "Théorème des valeurs intermédiaires (TVI)", ar: "مبرهنة القيم الوسيطية (TVI)" },
          { fr: "Études de fonctions complètes", ar: "دراسات دوال كاملة" },
          { fr: "Examen blanc — correction commentée", ar: "باك أبيض — تصحيح موجَّه" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Sam. 12 oct · 18h", ar: "البداية: السبت 12 أكتوبر · 18:00" },
        startISO: "2026-10-12T18:00:00+01:00",
        spotsTaken: 14,
        spotsTotal: 18,
      },
      {
        id: "d-2",
        label: { fr: "Démarrage : Sam. 9 nov · 18h", ar: "البداية: السبت 9 نوفمبر · 18:00" },
        startISO: "2026-11-09T18:00:00+01:00",
        spotsTaken: 4,
        spotsTotal: 18,
      },
    ],
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-ielts-speaking",
    slug: "ielts-speaking-7-plus",
    teacher: t("t-yasmine"),
    title: {
      fr: "IELTS Speaking · objectif 7+ en 4 semaines",
      ar: "IELTS التحدّث · هدف 7+ في 4 أسابيع" ,
    },
    subtitle: {
      fr: "Workshop intensif avec deux mocks notés et feedback détaillé.",
      ar: "ورشة مكثّفة مع امتحانين تجريبيّين وتقييم مفصّل.",
    },
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    format: "cohort",
    level: "advanced",
    durationLabel: { fr: "4 semaines · 8h", ar: "4 أسابيع · 8 سا" },
    priceDzd: 6800,
    rating: 4.88,
    reviews: 64,
    outcomes: [
      { fr: "Structurer une réponse Part 2 en moins de 60s", ar: "بناء إجابة Part 2 في أقلّ من 60 ثانية" },
      { fr: "Élargir votre lexique avec 120 collocations C1", ar: "توسيع المعجم بـ 120 تركيبًا من مستوى C1" },
      { fr: "Corriger les fautes typiques d'algériens en Speaking", ar: "تصحيح الأخطاء الشائعة للجزائريين في التحدّث" },
      { fr: "Gérer le stress du jour J et les questions imprévues", ar: "تجاوز توتر يوم الامتحان والأسئلة غير المتوقّعة" },
    ],
    includes: [
      { fr: "8 séances live · 60 min", ar: "8 جلسات مباشرة · 60 د" },
      { fr: "2 mocks notés sur la grille officielle", ar: "امتحانان تجريبيّان وفق سلّم التقييم الرسمي" },
      { fr: "Banque de questions Part 1/2/3", ar: "بنك أسئلة Part 1/2/3" },
      { fr: "Feedback audio personnalisé", ar: "تقييم صوتي شخصي" },
    ],
    syllabus: [
      {
        title: { fr: "Semaine 1 — Part 1, micro-réponses", ar: "الأسبوع 1 — Part 1، إجابات قصيرة" },
        items: [
          { fr: "Sujets familiers : work, hometown, hobbies", ar: "مواضيع مألوفة: العمل، المسقط، الهوايات" },
          { fr: "Connecteurs et hesitation fillers", ar: "روابط وكلمات توقف طبيعية" },
        ],
      },
      {
        title: { fr: "Semaine 2 — Part 2, monologue de 2 min", ar: "الأسبوع 2 — Part 2، مونولوغ 2 د" },
        items: [
          { fr: "Cartes mentales en 1 min", ar: "خرائط ذهنية في دقيقة" },
          { fr: "Storytelling structuré", ar: "السرد المنظّم" },
        ],
      },
      {
        title: { fr: "Semaine 3 — Part 3, opinions abstraites", ar: "الأسبوع 3 — Part 3، آراء مجرّدة" },
        items: [
          { fr: "Donner un avis nuancé", ar: "إبداء رأي متوازن" },
          { fr: "Vocab academic vs colloquial", ar: "مفردات أكاديمية مقابل عامّية" },
        ],
      },
      {
        title: { fr: "Semaine 4 — Mocks et debrief", ar: "الأسبوع 4 — امتحانات تجريبية ومراجعة" },
        items: [
          { fr: "Mock 1 — feedback fluency/lexical/grammar/pron", ar: "تجريب 1 — تقييم الطلاقة والمعجم والقواعد والنطق" },
          { fr: "Mock 2 — conditions réelles", ar: "تجريب 2 — في ظروف حقيقية" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Lun. 14 oct · 19h30", ar: "البداية: الإثنين 14 أكتوبر · 19:30" },
        startISO: "2026-10-14T19:30:00+01:00",
        spotsTaken: 8,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["EN", "FR"], ar: ["EN", "FR"] },
  },
  {
    id: "c-react-cohort",
    slug: "react-from-scratch",
    teacher: t("t-amine"),
    title: {
      fr: "React from scratch · une vraie app en 6 semaines",
      ar: "React من الصفر · تطبيق حقيقي في 6 أسابيع",
    },
    subtitle: {
      fr: "Pas de slides. On code une app de A à Z, on la déploie, on la livre.",
      ar: "بلا شرائح. نكتب تطبيقًا من الألف إلى الياء، ننشره، ونسلّمه.",
    },
    subject: { fr: "Programmation Web", ar: "برمجة الويب" },
    format: "cohort",
    level: "beginner",
    durationLabel: { fr: "6 semaines · 18h", ar: "6 أسابيع · 18 سا" },
    priceDzd: 9800,
    rating: 4.85,
    reviews: 38,
    outcomes: [
      { fr: "Maîtriser JSX, hooks et state local", ar: "إتقان JSX، hooks، والحالة المحلية" },
      { fr: "Connecter une API REST et gérer les erreurs proprement", ar: "ربط REST API وإدارة الأخطاء باحتراف" },
      { fr: "Déployer sur Vercel — pipeline complet", ar: "نشر على Vercel — مسار كامل" },
      { fr: "Construire un portfolio crédible", ar: "بناء معرض أعمال موثوق" },
    ],
    includes: [
      { fr: "12 séances live · 90 min", ar: "12 جلسة مباشرة · 90 د" },
      { fr: "Code source du projet final", ar: "الكود المصدري للمشروع النهائي" },
      { fr: "Review de code 1:1 hebdo", ar: "مراجعة كود فردية أسبوعية" },
      { fr: "Certificat de complétion", ar: "شهادة إتمام" },
    ],
    syllabus: [
      {
        title: { fr: "Semaine 1 — Setup et JSX", ar: "الأسبوع 1 — الإعداد و JSX" },
        items: [
          { fr: "Vite + TypeScript en 10 min", ar: "Vite + TypeScript في 10 د" },
          { fr: "Composants et props", ar: "المكوّنات و props" },
        ],
      },
      {
        title: { fr: "Semaine 2-3 — Hooks et state", ar: "الأسبوع 2-3 — Hooks والحالة" },
        items: [
          { fr: "useState, useEffect, useMemo", ar: "useState، useEffect، useMemo" },
          { fr: "Custom hooks", ar: "Hooks مخصّصة" },
        ],
      },
      {
        title: { fr: "Semaine 4-5 — API + Forms", ar: "الأسبوع 4-5 — API + النماذج" },
        items: [
          { fr: "Fetch, error handling, loading states", ar: "Fetch، إدارة الأخطاء، حالات التحميل" },
          { fr: "Form validation avec Zod", ar: "تحقّق النماذج باستخدام Zod" },
        ],
      },
      {
        title: { fr: "Semaine 6 — Deploy + portfolio", ar: "الأسبوع 6 — النشر + معرض الأعمال" },
        items: [
          { fr: "Vercel + DNS + analytics", ar: "Vercel + DNS + التحليلات" },
          { fr: "Présenter son projet sur LinkedIn", ar: "تقديم المشروع على LinkedIn" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Mar. 22 oct · 20h", ar: "البداية: الثلاثاء 22 أكتوبر · 20:00" },
        startISO: "2026-10-22T20:00:00+01:00",
        spotsTaken: 14,
        spotsTotal: 18,
      },
    ],
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
    language: { fr: ["FR", "EN"], ar: ["AR", "FR", "EN"] },
  },
  {
    id: "c-tajwid",
    slug: "tajwid-cohorte-hebdo",
    teacher: t("t-souad"),
    title: { fr: "Tajwid · cohorte hebdomadaire mixte", ar: "التجويد · فوج أسبوعي مختلط" },
    subtitle: {
      fr: "Apprentissage en douceur, sans pression, en arabe et français.",
      ar: "تعلّم بهدوء، دون ضغط، بالعربية والفرنسية.",
    },
    subject: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
    format: "cohort",
    level: "any",
    durationLabel: { fr: "10 semaines · 10h", ar: "10 أسابيع · 10 سا" },
    priceDzd: 2800,
    rating: 4.97,
    reviews: 84,
    outcomes: [
      { fr: "Articuler les makharij correctement", ar: "إخراج المخارج بدقّة" },
      { fr: "Réviser une sourte avec un cadre", ar: "مراجعة سورة بأسلوب منهجي" },
    ],
    includes: [
      { fr: "10 séances · 60 min", ar: "10 جلسات · 60 د" },
      { fr: "Enregistrements audio modèles", ar: "تسجيلات صوتية نموذجية" },
    ],
    syllabus: [
      {
        title: { fr: "Bases", ar: "الأساسيات" },
        items: [
          { fr: "Makharij et sifat", ar: "المخارج والصفات" },
          { fr: "Madd et ghounna", ar: "المدّ والغنّة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Sam. 18 oct · 10h", ar: "البداية: السبت 18 أكتوبر · 10:00" },
        startISO: "2026-10-18T10:00:00+01:00",
        spotsTaken: 9,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#DDA13A] to-[#DD514D]",
    language: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-piano-1to1",
    slug: "piano-1-to-1-annaba",
    teacher: t("t-rayan"),
    title: { fr: "Piano 1:1 · à Annaba ou en visio", ar: "بيانو فردي · في عنّابة أو عبر الفيديو" },
    subtitle: {
      fr: "Programme sur mesure, jazz ou classique. Premier cours offert.",
      ar: "برنامج مخصّص، جاز أو كلاسيكي. الدرس الأول مجاني.",
    },
    subject: { fr: "Piano", ar: "البيانو" },
    format: "1to1",
    level: "any",
    durationLabel: { fr: "Sessions de 60 min", ar: "جلسات 60 د" },
    priceDzd: 1600,
    rating: 4.81,
    reviews: 22,
    outcomes: [
      { fr: "Lecture de partitions de base à intermédiaire", ar: "قراءة نوتة من المبتدئ إلى المتوسّط" },
      { fr: "Improvisation jazz I-VI-II-V", ar: "ارتجال جاز I-VI-II-V" },
    ],
    includes: [
      { fr: "Premier cours offert", ar: "الدرس الأول مجاني" },
      { fr: "Suivi WhatsApp entre cours", ar: "متابعة واتساب بين الدروس" },
    ],
    syllabus: [
      {
        title: { fr: "Programme personnalisé", ar: "برنامج مخصّص" },
        items: [
          { fr: "Évaluation initiale", ar: "تقييم مبدئي" },
          { fr: "Objectifs sur 8 semaines", ar: "أهداف على 8 أسابيع" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Créneaux : Mar/Jeu 17h-21h", ar: "الفترات: الثلاثاء/الخميس 17:00-21:00" },
        startISO: "2026-10-15T17:00:00+01:00",
        spotsTaken: 3,
        spotsTotal: 8,
      },
    ],
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
    language: { fr: ["FR", "EN"], ar: ["FR", "EN"] },
  },
  {
    id: "c-physique-marathon",
    slug: "bac-physique-marathon-mecanique",
    teacher: t("t-imene"),
    title: { fr: "Bac Physique · marathon mécanique", ar: "فيزياء الباك · ماراطون الميكانيك" },
    subtitle: { fr: "3h pour clore le chapitre mécanique, exercices type Bac.", ar: "3 ساعات لإغلاق فصل الميكانيك، تمارين نمط الباك." },
    subject: { fr: "Physique", ar: "الفيزياء" },
    format: "event",
    level: "advanced",
    durationLabel: { fr: "Événement live · 3h", ar: "حدث مباشر · 3 سا" },
    priceDzd: 1400,
    rating: 4.9,
    reviews: 31,
    outcomes: [
      { fr: "Résoudre 6 exercices Bac sur la mécanique", ar: "حلّ 6 تمارين باك في الميكانيك" },
      { fr: "Pièges classiques détectés", ar: "كشف الفخاخ الكلاسيكية" },
    ],
    includes: [
      { fr: "Session live 3h", ar: "جلسة مباشرة 3 سا" },
      { fr: "PDF des exercices", ar: "ملف PDF للتمارين" },
      { fr: "Replay 30 jours", ar: "إعادة بثّ لمدّة 30 يومًا" },
    ],
    syllabus: [
      {
        title: { fr: "Programme du marathon", ar: "برنامج الماراطون" },
        items: [
          { fr: "Cinématique du point", ar: "حركية النقطة" },
          { fr: "Dynamique et énergie", ar: "الديناميكا والطاقة" },
          { fr: "Examen blanc 1h", ar: "باك أبيض ساعة واحدة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Dim. 20 oct · 14h", ar: "الأحد 20 أكتوبر · 14:00" },
        startISO: "2026-10-20T14:00:00+01:00",
        spotsTaken: 22,
        spotsTotal: 30,
      },
    ],
    accent: "from-[#2F6BFF] to-[#1C3A5E]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
];

export function courseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug || c.id === slug);
}

export function coursesForTeacher(teacherId: string) {
  return courses.filter((c) => c.teacher.id === teacherId);
}
