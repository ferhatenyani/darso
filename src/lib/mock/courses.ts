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
  // ────────────────────────────────────────────────────────────────────────
  // Session-instance courses — each `s-*` id matches a Session in sessions.ts
  // so that `Link href={`/courses/${session.id}`}` resolves to a real course.
  // These mirror the canonical course catalog above but are individual
  // scheduled instances (the live one tonight, the workshop tomorrow, etc.).
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "s-live-math",
    slug: "s-live-math",
    teacher: t("t-khalil"),
    title: { fr: "Math Bac · Limites & continuité (live)", ar: "رياضيات الباك · النهايات والاستمرار (مباشر)" },
    subtitle: {
      fr: "Séance live ce soir — révision chapitre 1 avec exercices type Bac.",
      ar: "حصة مباشرة هذا المساء — مراجعة الفصل 1 مع تمارين نمط الباك.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "Live · 90 min", ar: "مباشر · 90 د" },
    priceDzd: 1500,
    rating: 4.9,
    reviews: 96,
    outcomes: [
      { fr: "Réviser limites et formes indéterminées", ar: "مراجعة النهايات والأشكال غير المحدّدة" },
      { fr: "Repartir avec une fiche méthode prête à imprimer", ar: "الحصول على بطاقة منهجية جاهزة للطباعة" },
    ],
    includes: [
      { fr: "Séance live 90 min", ar: "جلسة مباشرة 90 د" },
      { fr: "Replay 7 jours", ar: "إعادة بثّ 7 أيام" },
      { fr: "Fiche méthode PDF", ar: "بطاقة منهجية PDF" },
    ],
    syllabus: [
      {
        title: { fr: "Au programme ce soir", ar: "برنامج الليلة" },
        items: [
          { fr: "Rappels — limites de référence", ar: "مراجعات — نهايات مرجعية" },
          { fr: "Les 4 formes indéterminées en pratique", ar: "الأشكال غير المحدّدة الأربعة في التطبيق" },
          { fr: "Q&R en direct", ar: "أسئلة وأجوبة مباشرة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "En cours · ce soir 18h", ar: "جارٍ الآن · الليلة 18:00" },
        startISO: "2026-06-27T18:00:00+01:00",
        spotsTaken: 12,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "s-soon-english",
    slug: "s-soon-english",
    teacher: t("t-yasmine"),
    title: { fr: "IELTS Speaking · workshop intensif", ar: "IELTS التحدّث · ورشة مكثّفة" },
    subtitle: {
      fr: "Workshop unique de 90 min — mock noté et feedback détaillé.",
      ar: "ورشة فريدة 90 د — امتحان تجريبي وتقييم مفصّل.",
    },
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    format: "event",
    level: "advanced",
    durationLabel: { fr: "Événement live · 90 min", ar: "حدث مباشر · 90 د" },
    priceDzd: 1800,
    rating: 4.88,
    reviews: 64,
    outcomes: [
      { fr: "Mock Part 2 noté sur la grille officielle", ar: "تجربة Part 2 وفق سلّم التقييم الرسمي" },
      { fr: "Feedback fluency / lexical / grammar / pron", ar: "تقييم الطلاقة / المعجم / القواعد / النطق" },
    ],
    includes: [
      { fr: "Session live 90 min", ar: "جلسة مباشرة 90 د" },
      { fr: "Feedback audio personnalisé", ar: "تقييم صوتي شخصي" },
      { fr: "Replay 14 jours", ar: "إعادة بثّ 14 يومًا" },
    ],
    syllabus: [
      {
        title: { fr: "Au programme du workshop", ar: "برنامج الورشة" },
        items: [
          { fr: "Échauffement Part 1 (15 min)", ar: "إحماء Part 1 (15 د)" },
          { fr: "Mock Part 2 noté (45 min)", ar: "تجربة Part 2 (45 د)" },
          { fr: "Debrief et plan d'action (30 min)", ar: "تحليل وخطة عمل (30 د)" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Aujourd'hui · 19h30", ar: "اليوم · 19:30" },
        startISO: "2026-06-27T19:30:00+01:00",
        spotsTaken: 8,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["EN", "FR"], ar: ["EN", "FR"] },
  },
  {
    id: "s-tomorrow-code",
    slug: "s-tomorrow-code",
    teacher: t("t-amine"),
    title: { fr: "React from scratch · semaine 3 / 6", ar: "React من الصفر · الأسبوع 3 / 6" },
    subtitle: {
      fr: "Hooks et state — useState, useEffect, useMemo en pratique.",
      ar: "Hooks والحالة — useState و useEffect و useMemo في التطبيق.",
    },
    subject: { fr: "Programmation Web", ar: "برمجة الويب" },
    format: "cohort",
    level: "beginner",
    durationLabel: { fr: "Live · 2h", ar: "مباشر · 2 سا" },
    priceDzd: 2200,
    rating: 4.85,
    reviews: 38,
    outcomes: [
      { fr: "Maîtriser useState et useEffect", ar: "إتقان useState و useEffect" },
      { fr: "Comprendre quand utiliser useMemo", ar: "فهم متى نستخدم useMemo" },
    ],
    includes: [
      { fr: "Séance live 2h", ar: "جلسة مباشرة 2 سا" },
      { fr: "Code source de la séance", ar: "الكود المصدري للحصة" },
      { fr: "Replay HD", ar: "إعادة بثّ HD" },
    ],
    syllabus: [
      {
        title: { fr: "Plan de la séance", ar: "خطة الحصة" },
        items: [
          { fr: "useState — patterns courants", ar: "useState — الأنماط الشائعة" },
          { fr: "useEffect — dependencies et cleanup", ar: "useEffect — التبعيات والتنظيف" },
          { fr: "useMemo — focus de 20 min", ar: "useMemo — تركيز 20 د" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Demain · 20h00", ar: "غدًا · 20:00" },
        startISO: "2026-06-28T20:00:00+01:00",
        spotsTaken: 14,
        spotsTotal: 18,
      },
    ],
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
    language: { fr: ["FR", "EN"], ar: ["AR", "FR", "EN"] },
  },
  {
    id: "s-week-piano",
    slug: "s-week-piano",
    teacher: t("t-rayan"),
    title: { fr: "Piano pour débutants · jeudi à Annaba", ar: "البيانو للمبتدئين · الخميس بعنّابة" },
    subtitle: {
      fr: "Premier cours collectif découverte — accords de base et lecture.",
      ar: "أول درس جماعي للاكتشاف — أوتار أساسية وقراءة.",
    },
    subject: { fr: "Piano", ar: "البيانو" },
    format: "event",
    level: "beginner",
    durationLabel: { fr: "Atelier · 60 min", ar: "ورشة · 60 د" },
    priceDzd: 1600,
    rating: 4.81,
    reviews: 22,
    outcomes: [
      { fr: "Lire 5 accords majeurs et mineurs", ar: "قراءة 5 أوتار كبرى وصغرى" },
      { fr: "Jouer une grille blues simple", ar: "عزف مقطع بلوز بسيط" },
    ],
    includes: [
      { fr: "Atelier en présentiel à Annaba", ar: "ورشة حضورية بعنّابة" },
      { fr: "Partitions débutants PDF", ar: "نوتات للمبتدئين PDF" },
    ],
    syllabus: [
      {
        title: { fr: "Au programme", ar: "البرنامج" },
        items: [
          { fr: "Position des mains, posture", ar: "وضعية اليدين والجسم" },
          { fr: "5 accords majeurs / mineurs", ar: "5 أوتار كبرى / صغرى" },
          { fr: "Improvisation blues à 4 mains", ar: "ارتجال بلوز بأربع أيدٍ" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Jeudi · 17h00", ar: "الخميس · 17:00" },
        startISO: "2026-07-02T17:00:00+01:00",
        spotsTaken: 4,
        spotsTotal: 8,
      },
    ],
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
    language: { fr: ["FR", "EN"], ar: ["FR", "EN"] },
  },
  {
    id: "s-week-coran",
    slug: "s-week-coran",
    teacher: t("t-souad"),
    title: { fr: "Tajwid · cohorte hebdomadaire", ar: "التجويد · فوج أسبوعي" },
    subtitle: {
      fr: "Séance hebdo de la cohorte mixte — révision sourate de la semaine.",
      ar: "حصّة أسبوعية للفوج المختلط — مراجعة سورة الأسبوع.",
    },
    subject: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
    format: "cohort",
    level: "any",
    durationLabel: { fr: "Séance · 60 min", ar: "حصّة · 60 د" },
    priceDzd: 900,
    rating: 4.97,
    reviews: 84,
    outcomes: [
      { fr: "Revoir les makharij de la semaine", ar: "مراجعة مخارج الأسبوع" },
      { fr: "Réciter la sourate du jour collectivement", ar: "تلاوة سورة اليوم جماعيًا" },
    ],
    includes: [
      { fr: "Séance live 60 min", ar: "جلسة مباشرة 60 د" },
      { fr: "Enregistrement audio modèle", ar: "تسجيل صوتي نموذجي" },
    ],
    syllabus: [
      {
        title: { fr: "Déroulé de la séance", ar: "محاور الحصّة" },
        items: [
          { fr: "Rappel des règles vues", ar: "تذكير بالأحكام السابقة" },
          { fr: "Récitation guidée", ar: "تلاوة موجَّهة" },
          { fr: "Q&R", ar: "أسئلة وأجوبة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Samedi · 10h00", ar: "السبت · 10:00" },
        startISO: "2026-07-04T10:00:00+01:00",
        spotsTaken: 9,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#DDA13A] to-[#DD514D]",
    language: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
  },
  {
    id: "s-week-physics",
    slug: "s-week-physics",
    teacher: t("t-imene"),
    title: { fr: "Bac Physique · marathon mécanique", ar: "فيزياء الباك · ماراطون الميكانيك" },
    subtitle: {
      fr: "3h pour clore la mécanique — 6 exercices type Bac corrigés en direct.",
      ar: "3 ساعات لإغلاق الميكانيك — 6 تمارين باك مع التصحيح المباشر.",
    },
    subject: { fr: "Physique", ar: "الفيزياء" },
    format: "event",
    level: "advanced",
    durationLabel: { fr: "Événement live · 3h", ar: "حدث مباشر · 3 سا" },
    priceDzd: 1400,
    rating: 4.9,
    reviews: 31,
    outcomes: [
      { fr: "Résoudre 6 exercices type Bac", ar: "حلّ 6 تمارين باك" },
      { fr: "Maîtriser les pièges classiques", ar: "إتقان الفخاخ الكلاسيكية" },
    ],
    includes: [
      { fr: "Live 3h", ar: "مباشر 3 سا" },
      { fr: "PDF des exercices", ar: "ملف PDF للتمارين" },
      { fr: "Replay 30 jours", ar: "إعادة بثّ 30 يومًا" },
    ],
    syllabus: [
      {
        title: { fr: "Programme du marathon", ar: "برنامج الماراطون" },
        items: [
          { fr: "Cinématique du point (45 min)", ar: "حركية النقطة (45 د)" },
          { fr: "Dynamique et énergie (90 min)", ar: "الديناميكا والطاقة (90 د)" },
          { fr: "Examen blanc (45 min)", ar: "باك أبيض (45 د)" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Dimanche · 14h00", ar: "الأحد · 14:00" },
        startISO: "2026-07-05T14:00:00+01:00",
        spotsTaken: 22,
        spotsTotal: 30,
      },
    ],
    accent: "from-[#2F6BFF] to-[#1C3A5E]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  // ────────────────────────────────────────────────────────────────────────
  // Chat-context courses — referenced by chat threads' courseLink.href
  // (`/courses/math-bac`, `/courses/ielts-7`, `/events/ielts-workshop`).
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "math-bac",
    slug: "math-bac",
    teacher: t("t-khalil"),
    title: { fr: "Math Bac · pack 8 séances", ar: "رياضيات الباك · باقة 8 حصص" },
    subtitle: {
      fr: "Programme de 8 séances 1:1 — analyse, géométrie, probas.",
      ar: "برنامج 8 حصص فردية — تحليل، هندسة، احتمالات.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "1to1",
    level: "advanced",
    durationLabel: { fr: "8 séances · 12h cumul", ar: "8 حصص · 12 سا تراكميًا" },
    priceDzd: 18000,
    rating: 4.92,
    reviews: 64,
    outcomes: [
      { fr: "Couvrir tout le programme Bac SE en 8 séances", ar: "تغطية كامل برنامج الباك علوم تجريبية في 8 حصص" },
      { fr: "Plan personnalisé selon vos points faibles", ar: "خطة مخصّصة وفق نقاط ضعفك" },
      { fr: "Examen blanc corrigé en fin de pack", ar: "باك أبيض مصحَّح في نهاية الباقة" },
    ],
    includes: [
      { fr: "8 séances 1:1 · 90 min", ar: "8 حصص فردية · 90 د" },
      { fr: "Plan d'action sur 8 semaines", ar: "خطة عمل على 8 أسابيع" },
      { fr: "Suivi WhatsApp entre séances", ar: "متابعة واتساب بين الحصص" },
    ],
    syllabus: [
      {
        title: { fr: "Bloc 1 — Analyse (3 séances)", ar: "كتلة 1 — التحليل (3 حصص)" },
        items: [
          { fr: "Limites et continuité", ar: "النهايات والاستمرار" },
          { fr: "Dérivation et étude de fonctions", ar: "الاشتقاق ودراسة الدوال" },
          { fr: "Intégrales et primitives", ar: "التكاملات والأصلية" },
        ],
      },
      {
        title: { fr: "Bloc 2 — Géométrie & probas (3 séances)", ar: "كتلة 2 — هندسة واحتمالات (3 حصص)" },
        items: [
          { fr: "Géométrie dans l'espace", ar: "الهندسة في الفضاء" },
          { fr: "Probabilités conditionnelles", ar: "الاحتمالات الشرطية" },
          { fr: "Lois de probabilité", ar: "قوانين الاحتمال" },
        ],
      },
      {
        title: { fr: "Bloc 3 — Examen blanc (2 séances)", ar: "كتلة 3 — باك أبيض (حصّتان)" },
        items: [
          { fr: "Sujet complet en conditions réelles", ar: "موضوع كامل في ظروف حقيقية" },
          { fr: "Correction détaillée et plan d'amélioration", ar: "تصحيح مفصّل وخطة تحسين" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : à fixer ensemble", ar: "البداية: نتفق عليها معًا" },
        startISO: "2026-07-01T09:00:00+01:00",
        spotsTaken: 3,
        spotsTotal: 6,
      },
    ],
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "ielts-7",
    slug: "ielts-7",
    teacher: t("t-yasmine"),
    title: { fr: "IELTS · objectif 7+ toutes épreuves", ar: "IELTS · هدف 7+ لكل الاختبارات" },
    subtitle: {
      fr: "Programme complet 4 modules — Listening, Reading, Writing, Speaking.",
      ar: "برنامج شامل لـ 4 وحدات — الاستماع والقراءة والكتابة والتحدّث.",
    },
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    format: "cohort",
    level: "advanced",
    durationLabel: { fr: "8 semaines · 24h", ar: "8 أسابيع · 24 سا" },
    priceDzd: 14000,
    rating: 4.9,
    reviews: 48,
    outcomes: [
      { fr: "Atteindre Band 7+ sur les 4 modules", ar: "بلوغ Band 7+ في الوحدات الأربع" },
      { fr: "5 mocks complets corrigés", ar: "5 امتحانات تجريبية كاملة مصحَّحة" },
      { fr: "Stratégies time-management dédiées", ar: "استراتيجيات إدارة الوقت المخصّصة" },
    ],
    includes: [
      { fr: "24 séances live · 60 min", ar: "24 جلسة مباشرة · 60 د" },
      { fr: "5 mocks complets notés", ar: "5 امتحانات تجريبية كاملة مع التقييم" },
      { fr: "Banque de questions illimitée", ar: "بنك أسئلة بلا حدود" },
      { fr: "Coaching final 1:1 avant le test", ar: "كوتشينغ نهائي فردي قبل الامتحان" },
    ],
    syllabus: [
      {
        title: { fr: "Semaines 1-2 — Listening & Reading", ar: "الأسبوعان 1-2 — الاستماع والقراءة" },
        items: [
          { fr: "Stratégies de scan et skim", ar: "استراتيجيات المسح والقراءة السريعة" },
          { fr: "Pièges classiques de Listening", ar: "فخاخ الاستماع الكلاسيكية" },
        ],
      },
      {
        title: { fr: "Semaines 3-5 — Writing Task 1 & 2", ar: "الأسابيع 3-5 — الكتابة Task 1 و 2" },
        items: [
          { fr: "Task 1 — graphs et processus", ar: "Task 1 — الرسوم والعمليات" },
          { fr: "Task 2 — essai d'opinion", ar: "Task 2 — مقال رأي" },
          { fr: "Connecteurs et lexique Band 7+", ar: "روابط ومعجم Band 7+" },
        ],
      },
      {
        title: { fr: "Semaines 6-8 — Speaking & mocks", ar: "الأسابيع 6-8 — التحدّث والامتحانات التجريبية" },
        items: [
          { fr: "Speaking Part 1, 2, 3", ar: "التحدّث Part 1, 2, 3" },
          { fr: "5 mocks complets", ar: "5 امتحانات تجريبية كاملة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Lun. 7 juil · 19h", ar: "البداية: الإثنين 7 جويلية · 19:00" },
        startISO: "2026-07-07T19:00:00+01:00",
        spotsTaken: 6,
        spotsTotal: 10,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["EN", "FR"], ar: ["EN", "FR"] },
  },
  {
    id: "ielts-workshop",
    slug: "ielts-workshop",
    teacher: t("t-yasmine"),
    title: { fr: "Atelier IELTS Speaking · session unique", ar: "ورشة IELTS التحدّث · جلسة فريدة" },
    subtitle: {
      fr: "90 min en groupe — mock noté, feedback détaillé, plan personnalisé.",
      ar: "90 د جماعيًا — تجربة مع التقييم، تقييم مفصّل، خطة شخصية.",
    },
    subject: { fr: "Anglais & IELTS", ar: "الإنجليزية و IELTS" },
    format: "event",
    level: "advanced",
    durationLabel: { fr: "Événement live · 90 min", ar: "حدث مباشر · 90 د" },
    priceDzd: 1800,
    rating: 4.88,
    reviews: 28,
    outcomes: [
      { fr: "Identifier vos 3 points d'amélioration prioritaires", ar: "تحديد 3 نقاط للتحسين ذات الأولوية" },
      { fr: "Mock Part 2 noté sur la grille officielle", ar: "تجربة Part 2 وفق سلّم التقييم الرسمي" },
    ],
    includes: [
      { fr: "Atelier live 90 min", ar: "ورشة مباشرة 90 د" },
      { fr: "Feedback audio individuel", ar: "تقييم صوتي فردي" },
      { fr: "Replay 14 jours", ar: "إعادة بثّ 14 يومًا" },
    ],
    syllabus: [
      {
        title: { fr: "Déroulé de l'atelier", ar: "محاور الورشة" },
        items: [
          { fr: "Briefing & échauffement Part 1 (15 min)", ar: "تقديم وإحماء Part 1 (15 د)" },
          { fr: "Mock Part 2 noté (45 min)", ar: "تجربة Part 2 (45 د)" },
          { fr: "Debrief individuel + plan (30 min)", ar: "تقييم فردي + خطة (30 د)" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Sam. 5 juil · 16h", ar: "السبت 5 جويلية · 16:00" },
        startISO: "2026-07-05T16:00:00+01:00",
        spotsTaken: 12,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["EN", "FR"], ar: ["EN", "FR"] },
  },
  // ────────────────────────────────────────────────────────────────────────
  // Teacher-catalog courses — referenced by dashboard.ts `teacherCourses`
  // and by `todaySessions` hrefs. Adding them here unblocks the "View public"
  // button on `/teach/courses/[id]` and any direct `/courses/c-*` link.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "c-trigo",
    slug: "trigonometrie-1-to-1",
    teacher: t("t-khalil"),
    title: { fr: "Trigonométrie · 1:1 personnalisé", ar: "علم المثلثات · فردي مخصص" },
    subtitle: {
      fr: "Sessions 1:1 sur mesure — formules, identités, équations trigo.",
      ar: "حصص فردية مخصّصة — الصيغ والمتطابقات ومعادلات المثلثات.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "1to1",
    level: "intermediate",
    durationLabel: { fr: "Sessions de 60 min", ar: "جلسات 60 د" },
    priceDzd: 1500,
    rating: 4.88,
    reviews: 42,
    outcomes: [
      { fr: "Maîtriser les formules d'addition et duplication", ar: "إتقان صيغ الجمع والتضعيف" },
      { fr: "Résoudre toute équation trigonométrique du Bac", ar: "حلّ أي معادلة مثلّثية في الباك" },
      { fr: "Lecture du cercle trigonométrique sans hésiter", ar: "قراءة الدائرة المثلّثية بثقة" },
    ],
    includes: [
      { fr: "Suivi WhatsApp entre séances", ar: "متابعة واتساب بين الحصص" },
      { fr: "Fiches méthode PDF", ar: "بطاقات منهجية PDF" },
    ],
    syllabus: [
      {
        title: { fr: "Programme personnalisé", ar: "برنامج مخصّص" },
        items: [
          { fr: "Évaluation initiale", ar: "تقييم مبدئي" },
          { fr: "Cercle trigo, formules de base", ar: "الدائرة المثلّثية والصيغ الأساسية" },
          { fr: "Équations et identités", ar: "المعادلات والمتطابقات" },
          { fr: "Sujets type Bac", ar: "مواضيع نمط الباك" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Créneaux : Mar/Jeu 17h-21h", ar: "الفترات: الثلاثاء/الخميس 17:00-21:00" },
        startISO: "2026-10-15T17:00:00+01:00",
        spotsTaken: 6,
        spotsTotal: 8,
      },
    ],
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-bac-prep",
    slug: "bac-prep-simulations",
    teacher: t("t-khalil"),
    title: { fr: "Préparation Bac · simulations d'épreuves", ar: "تحضير الباك · محاكاة الامتحانات" },
    subtitle: {
      fr: "Cohorte intensive — un sujet de Bac complet par semaine, corrigé en direct.",
      ar: "فوج مكثّف — موضوع باك كامل أسبوعيًا مع تصحيح مباشر.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "cohort",
    level: "advanced",
    durationLabel: { fr: "8 semaines · 16h", ar: "8 أسابيع · 16 سا" },
    priceDzd: 8000,
    rating: 4.91,
    reviews: 56,
    outcomes: [
      { fr: "Faire 8 sujets de Bac complets en conditions réelles", ar: "إنجاز 8 مواضيع باك كاملة في ظروف حقيقية" },
      { fr: "Recevoir une note prévisionnelle hebdo", ar: "الحصول على علامة توقعية أسبوعيًا" },
      { fr: "Identifier vos pièges récurrents", ar: "تحديد فخاخك المتكرّرة" },
    ],
    includes: [
      { fr: "8 séances live · 2h", ar: "8 جلسات مباشرة · 2 سا" },
      { fr: "8 sujets de Bac avec barème", ar: "8 مواضيع باك مع السلّم" },
      { fr: "Correction commentée en direct", ar: "تصحيح موجَّه مباشرة" },
      { fr: "Note prévisionnelle hebdo", ar: "علامة توقعية أسبوعية" },
    ],
    syllabus: [
      {
        title: { fr: "Format hebdomadaire", ar: "النظام الأسبوعي" },
        items: [
          { fr: "Sujet de Bac complet (3h en autonomie)", ar: "موضوع باك كامل (3 سا فردية)" },
          { fr: "Séance correction (2h en direct)", ar: "حصّة تصحيح (2 سا مباشرة)" },
          { fr: "Feedback personnalisé + note", ar: "تقييم شخصي + علامة" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Lun. 7 juil · 21h", ar: "البداية: الإثنين 7 جويلية · 21:00" },
        startISO: "2026-07-07T21:00:00+01:00",
        spotsTaken: 9,
        spotsTotal: 14,
      },
    ],
    accent: "from-[#2F6BFF] to-[#1C3A5E]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-analysis",
    slug: "analyse-complexe-avancee",
    teacher: t("t-khalil"),
    title: { fr: "Analyse complexe · post-Bac", ar: "التحليل المركّب · ما بعد الباك" },
    subtitle: {
      fr: "Brouillon — cours on-demand pour étudiants en prépa et MP.",
      ar: "مسوّدة — درس عند الطلب لطلاب التحضيرية و MP.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "ondemand",
    level: "advanced",
    durationLabel: { fr: "12 modules · 18h vidéo", ar: "12 وحدة · 18 سا فيديو" },
    priceDzd: 9500,
    rating: 0,
    reviews: 0,
    outcomes: [
      { fr: "Maîtriser les fonctions holomorphes", ar: "إتقان الدوال الهولومورفية" },
      { fr: "Calculer une intégrale par résidus", ar: "حساب التكامل بطريقة البواقي" },
    ],
    includes: [
      { fr: "12 vidéos HD à votre rythme", ar: "12 فيديو HD على إيقاعك" },
      { fr: "Exercices corrigés en PDF", ar: "تمارين مع التصحيح PDF" },
      { fr: "Accès illimité 1 an", ar: "وصول غير محدود لسنة" },
    ],
    syllabus: [
      {
        title: { fr: "Modules prévus", ar: "الوحدات المخطّطة" },
        items: [
          { fr: "Nombres complexes — rappels", ar: "الأعداد المركّبة — مراجعات" },
          { fr: "Fonctions holomorphes", ar: "الدوال الهولومورفية" },
          { fr: "Théorème des résidus", ar: "مبرهنة البواقي" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Disponible dès publication", ar: "متاح فور النشر" },
        startISO: "2026-09-01T00:00:00+01:00",
        spotsTaken: 0,
        spotsTotal: 0,
      },
    ],
    accent: "from-[#1C3A5E] to-[#3E8FD0]",
    language: { fr: ["FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-geometry",
    slug: "geometrie-espace-2024",
    teacher: t("t-khalil"),
    title: { fr: "Géométrie dans l'espace · 2024", ar: "الهندسة في الفضاء · 2024" },
    subtitle: {
      fr: "Cohorte archivée — programme complet de géométrie spatiale Bac.",
      ar: "فوج مؤرشف — برنامج كامل للهندسة الفضائية للباك.",
    },
    subject: { fr: "Mathématiques", ar: "الرياضيات" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "6 semaines · 12h", ar: "6 أسابيع · 12 سا" },
    priceDzd: 7500,
    rating: 4.86,
    reviews: 68,
    outcomes: [
      { fr: "Maîtriser la représentation paramétrique", ar: "إتقان التمثيل البارامتري" },
      { fr: "Calculer distances et angles dans l'espace", ar: "حساب المسافات والزوايا في الفضاء" },
    ],
    includes: [
      { fr: "12 séances enregistrées", ar: "12 جلسة مسجَّلة" },
      { fr: "Annales 2018-2024 corrigées", ar: "مواضيع 2018-2024 مع التصحيح" },
    ],
    syllabus: [
      {
        title: { fr: "Programme (archivé)", ar: "البرنامج (مؤرشف)" },
        items: [
          { fr: "Vecteurs et produit scalaire", ar: "الشعاع والجداء السلّمي" },
          { fr: "Droites et plans", ar: "المستقيمات والمستويات" },
          { fr: "Sphères et intersections", ar: "الكرات والتقاطعات" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Cohorte clôturée — replays disponibles", ar: "الفوج مغلق — الإعادات متوفّرة" },
        startISO: "2024-09-15T18:00:00+01:00",
        spotsTaken: 11,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#3E8FD0] to-[#1C3A5E]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
];

export function courseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug || c.id === slug);
}

export function coursesForTeacher(teacherId: string) {
  return courses.filter((c) => c.teacher.id === teacherId);
}
