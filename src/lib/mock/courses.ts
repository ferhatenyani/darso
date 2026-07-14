// Batch 11 expansion — new courses for t-mounir, t-nadia, t-farid, t-kahina,
// t-leila, t-bilal, t-djamila plus extra catalog entries with varied formats,
// dates (past archived / now in-progress / future / always-on) and seat
// counts (sold-out / nearly-full / spacious / empty).
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
  // ────────────────────────────────────────────────────────────────────────
  // Batch 11 — additional catalogue across the broadened teacher roster
  // ────────────────────────────────────────────────────────────────────────
  {
    id: "c-chimie-bac",
    slug: "chimie-bac-acide-base",
    teacher: t("t-mounir"),
    title: {
      fr: "Chimie Bac · acido-basique en 4 semaines",
      ar: "كيمياء الباك · حمض-قاعدة في 4 أسابيع",
    },
    subtitle: {
      fr: "Cohorte courte avec expériences filmées et tableaux d'avancement guidés.",
      ar: "فوج قصير مع تجارب مصوّرة وجداول تقدّم موجَّهة.",
    },
    subject: { fr: "Chimie", ar: "الكيمياء" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "4 semaines · 8h", ar: "4 أسابيع · 8 سا" },
    priceDzd: 3200,
    rating: 4.84,
    reviews: 26,
    outcomes: [
      { fr: "Construire un tableau d'avancement sans erreur", ar: "بناء جدول تقدّم بلا أخطاء" },
      { fr: "Identifier les couples acido-basiques d'une réaction", ar: "تحديد الأزواج حمض-قاعدة في تفاعل" },
      { fr: "Tracer et lire une courbe de titrage pH-mètrique", ar: "رسم وقراءة منحنى المعايرة pH" },
      { fr: "Rédiger une copie type bac sur un dosage", ar: "تحرير ورقة باك على معايرة" },
    ],
    includes: [
      { fr: "8 séances live · 60 min", ar: "8 جلسات مباشرة · 60 د" },
      { fr: "12 vidéos d'expériences en HD", ar: "12 فيديو تجارب HD" },
      { fr: "Fiches méthode pH-mètre / indicateurs", ar: "بطاقات منهجية pH/كواشف" },
      { fr: "Annales Bac 2020-2025 corrigées", ar: "مواضيع باك 2020-2025 مع التصحيح" },
    ],
    syllabus: [
      {
        title: { fr: "Semaine 1 — Acides et bases", ar: "الأسبوع 1 — الأحماض والقواعد" },
        items: [
          { fr: "Définitions Brönsted et couples", ar: "تعاريف برونستد والأزواج" },
          { fr: "Calculs de pH simples", ar: "حساب pH بسيط" },
        ],
      },
      {
        title: { fr: "Semaines 2-3 — Titrage et équivalence", ar: "الأسبوعان 2-3 — المعايرة ونقطة التكافؤ" },
        items: [
          { fr: "Choisir l'indicateur coloré", ar: "اختيار الكاشف الملوّن" },
          { fr: "Lire une courbe pH-mètrique", ar: "قراءة منحنى pH" },
        ],
      },
      {
        title: { fr: "Semaine 4 — Sujets type Bac", ar: "الأسبوع 4 — مواضيع نمط الباك" },
        items: [
          { fr: "Exercices d'annales en autonomie", ar: "تمارين مواضيع سابقة فردية" },
          { fr: "Correction commentée en direct", ar: "تصحيح موجَّه مباشر" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Sam. 11 juil · 16h", ar: "البداية: السبت 11 جويلية · 16:00" },
        startISO: "2026-07-11T16:00:00+01:00",
        spotsTaken: 11,
        spotsTotal: 12,
      },
      {
        id: "d-2",
        label: { fr: "Démarrage : Sam. 15 août · 16h", ar: "البداية: السبت 15 أوت · 16:00" },
        startISO: "2026-08-15T16:00:00+01:00",
        spotsTaken: 2,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#2E9E78] to-[#1C3A5E]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-chimie-ondemand",
    slug: "chimie-organique-on-demand",
    teacher: t("t-mounir"),
    title: {
      fr: "Chimie organique · cours on-demand",
      ar: "الكيمياء العضوية · درس عند الطلب",
    },
    subtitle: {
      fr: "10h de vidéos pour réviser les fonctions organiques à votre rythme.",
      ar: "10 ساعات فيديو لمراجعة المجموعات العضوية على إيقاعك.",
    },
    subject: { fr: "Chimie", ar: "الكيمياء" },
    format: "ondemand",
    level: "intermediate",
    durationLabel: { fr: "10h vidéo · accès 1 an", ar: "10 سا فيديو · وصول لسنة" },
    priceDzd: 4500,
    rating: 4.7,
    reviews: 18,
    outcomes: [
      { fr: "Reconnaître les fonctions organiques principales", ar: "تمييز المجموعات العضوية الرئيسية" },
      { fr: "Maîtriser les mécanismes SN1 / SN2 / E1 / E2", ar: "إتقان الميكانيزمات SN1 / SN2 / E1 / E2" },
    ],
    includes: [
      { fr: "20 vidéos HD", ar: "20 فيديو HD" },
      { fr: "Exercices auto-corrigés", ar: "تمارين مع تصحيح ذاتي" },
      { fr: "Accès illimité 1 an", ar: "وصول غير محدود لسنة" },
    ],
    syllabus: [
      {
        title: { fr: "Modules disponibles", ar: "الوحدات المتاحة" },
        items: [
          { fr: "Fonctions oxygénées", ar: "المجموعات الأكسجينية" },
          { fr: "Mécanismes réactionnels", ar: "آليات التفاعل" },
          { fr: "Stéréochimie", ar: "الكيمياء الفراغية" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Toujours disponible", ar: "متاح دائمًا" },
        startISO: "2026-01-01T00:00:00+01:00",
        spotsTaken: 0,
        spotsTotal: 0,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-tcf-prepa",
    slug: "tcf-prepa-canada",
    teacher: t("t-nadia"),
    title: {
      fr: "TCF Canada · objectif NCLC 7 garanti",
      ar: "TCF كندا · هدف NCLC 7 مضمون",
    },
    subtitle: {
      fr: "Cohorte intensive 8 semaines pour décrocher votre dossier d'immigration.",
      ar: "فوج مكثّف لـ 8 أسابيع لضمان ملفّ الهجرة.",
    },
    subject: { fr: "Français · TCF", ar: "الفرنسية · TCF" },
    format: "cohort",
    level: "advanced",
    durationLabel: { fr: "8 semaines · 24h", ar: "8 أسابيع · 24 سا" },
    priceDzd: 12000,
    rating: 4.93,
    reviews: 72,
    outcomes: [
      { fr: "Atteindre NCLC 7 sur les 4 épreuves", ar: "بلوغ NCLC 7 في الاختبارات الأربعة" },
      { fr: "Maîtriser la grille de notation officielle", ar: "إتقان سلّم التقييم الرسمي" },
      { fr: "3 mocks complets corrigés à l'oral", ar: "3 امتحانات تجريبية كاملة مع تصحيح شفهي" },
    ],
    includes: [
      { fr: "24 séances · 60 min", ar: "24 جلسة · 60 د" },
      { fr: "Banque de sujets TCF 2024-2026", ar: "بنك مواضيع TCF 2024-2026" },
      { fr: "Coaching final 1:1 avant le test", ar: "كوتشينغ نهائي فردي قبل الامتحان" },
    ],
    syllabus: [
      {
        title: { fr: "Semaines 1-3 — Compréhension écrite/orale", ar: "الأسابيع 1-3 — الفهم الكتابي والشفهي" },
        items: [
          { fr: "Stratégies de lecture rapide", ar: "استراتيجيات القراءة السريعة" },
          { fr: "Pièges audio courants", ar: "فخاخ الاستماع الشائعة" },
        ],
      },
      {
        title: { fr: "Semaines 4-6 — Expression écrite", ar: "الأسابيع 4-6 — التعبير الكتابي" },
        items: [
          { fr: "Tâche 1 message et tâche 2 article", ar: "المهمّة 1 رسالة والمهمّة 2 مقال" },
          { fr: "Tâche 3 essai argumenté", ar: "المهمّة 3 مقال حجاجي" },
        ],
      },
      {
        title: { fr: "Semaines 7-8 — Expression orale + mocks", ar: "الأسبوعان 7-8 — التعبير الشفهي + امتحانات تجريبية" },
        items: [
          { fr: "Les 3 tâches orales en conditions réelles", ar: "المهام الشفهية الثلاث في ظروف حقيقية" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Lun. 7 juil · 19h", ar: "البداية: الإثنين 7 جويلية · 19:00" },
        startISO: "2026-07-07T19:00:00+01:00",
        spotsTaken: 12,
        spotsTotal: 12,
      },
      {
        id: "d-2",
        label: { fr: "Démarrage : Lun. 1 sept · 19h", ar: "البداية: الإثنين 1 سبتمبر · 19:00" },
        startISO: "2026-09-01T19:00:00+01:00",
        spotsTaken: 4,
        spotsTotal: 12,
      },
    ],
    accent: "from-[#DD514D] to-[#2F6BFF]",
    language: { fr: ["FR"], ar: ["FR", "AR"] },
  },
  {
    id: "c-redaction-college",
    slug: "redaction-college-methode",
    teacher: t("t-nadia"),
    title: {
      fr: "Rédaction CEM · méthode introduction-développement-conclusion",
      ar: "التحرير في المتوسط · منهج مقدّمة-عرض-خاتمة",
    },
    subtitle: {
      fr: "1:1 personnalisé pour passer la moyenne en français au CEM.",
      ar: "حصص فردية مخصّصة لتجاوز معدّل الفرنسية في المتوسط.",
    },
    subject: { fr: "Français · rédaction", ar: "الفرنسية · التعبير الكتابي" },
    format: "1to1",
    level: "beginner",
    durationLabel: { fr: "Sessions de 60 min", ar: "جلسات 60 د" },
    priceDzd: 1500,
    rating: 4.9,
    reviews: 41,
    outcomes: [
      { fr: "Structurer toute rédaction en 3 paragraphes", ar: "بناء أي إنشاء في 3 فقرات" },
      { fr: "Enrichir le lexique avec 50 mots-clés par mois", ar: "إثراء المعجم بـ 50 كلمة شهريًا" },
    ],
    includes: [
      { fr: "Correction écrite à chaque séance", ar: "تصحيح كتابي في كل حصّة" },
      { fr: "Suivi WhatsApp entre les cours", ar: "متابعة واتساب بين الحصص" },
    ],
    syllabus: [
      {
        title: { fr: "Programme personnalisé", ar: "برنامج مخصّص" },
        items: [
          { fr: "Évaluation initiale d'une rédaction", ar: "تقييم أوّلي لإنشاء" },
          { fr: "Plan d'action sur 8 séances", ar: "خطّة عمل على 8 حصص" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Créneaux : Mer 16h-19h", ar: "الفترات: الأربعاء 16:00-19:00" },
        startISO: "2026-07-08T16:00:00+01:00",
        spotsTaken: 5,
        spotsTotal: 8,
      },
    ],
    accent: "from-[#DD514D] to-[#DDA13A]",
    language: { fr: ["FR"], ar: ["FR", "AR"] },
  },
  {
    id: "c-fiqh-essentials",
    slug: "fiqh-essentials-ramadan",
    teacher: t("t-farid"),
    title: {
      fr: "Fiqh essentiel · ahkam du quotidien",
      ar: "أساسيات الفقه · أحكام الحياة اليومية",
    },
    subtitle: {
      fr: "Cohorte de 6 semaines sur les piliers du fiqh malékite — accessible à tous.",
      ar: "فوج لـ 6 أسابيع حول أركان الفقه المالكي — متاح للجميع.",
    },
    subject: { fr: "Sciences religieuses", ar: "العلوم الشرعية" },
    format: "cohort",
    level: "any",
    durationLabel: { fr: "6 semaines · 12h", ar: "6 أسابيع · 12 سا" },
    priceDzd: 2400,
    rating: 4.95,
    reviews: 58,
    outcomes: [
      { fr: "Maîtriser tahara, salat et zakat", ar: "إتقان الطهارة والصلاة والزكاة" },
      { fr: "Distinguer fard, sunna et nafl", ar: "التمييز بين الفرض والسنّة والنفل" },
    ],
    includes: [
      { fr: "12 séances live", ar: "12 جلسة مباشرة" },
      { fr: "Polycopié bilingue FR/AR", ar: "ملخّص ثنائي اللغة FR/AR" },
    ],
    syllabus: [
      {
        title: { fr: "Modules", ar: "الوحدات" },
        items: [
          { fr: "Tahara et nawaqid", ar: "الطهارة والنواقض" },
          { fr: "Salat — conditions et piliers", ar: "الصلاة — شروط وأركان" },
          { fr: "Zakat et siyam", ar: "الزكاة والصيام" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Dim. 13 juil · 21h", ar: "البداية: الأحد 13 جويلية · 21:00" },
        startISO: "2026-07-13T21:00:00+01:00",
        spotsTaken: 18,
        spotsTotal: 24,
      },
    ],
    accent: "from-[#2E9E78] to-[#DDA13A]",
    language: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-coran-tahfeedh",
    slug: "coran-tahfeedh-juz-amma",
    teacher: t("t-farid"),
    title: {
      fr: "Tahfeedh · juz 'Amma en 12 semaines",
      ar: "تحفيظ · جزء عمّ في 12 أسبوعًا",
    },
    subtitle: {
      fr: "Cohorte de mémorisation guidée, suivi audio quotidien.",
      ar: "فوج حفظ موجَّه، متابعة صوتية يومية.",
    },
    subject: { fr: "Coran · mémorisation", ar: "القرآن · حفظ" },
    format: "cohort",
    level: "any",
    durationLabel: { fr: "12 semaines · 24h", ar: "12 أسبوعًا · 24 سا" },
    priceDzd: 3600,
    rating: 4.96,
    reviews: 92,
    outcomes: [
      { fr: "Mémoriser juz 'Amma avec tajwid", ar: "حفظ جزء عمّ بالتجويد" },
      { fr: "Auto-évaluation hebdo guidée", ar: "تقييم ذاتي أسبوعي موجَّه" },
    ],
    includes: [
      { fr: "24 séances live", ar: "24 جلسة مباشرة" },
      { fr: "Récitations audio modèles", ar: "تلاوات صوتية نموذجية" },
    ],
    syllabus: [
      {
        title: { fr: "Programme par semaine", ar: "البرنامج الأسبوعي" },
        items: [
          { fr: "Sourate de la semaine + révision", ar: "سورة الأسبوع + مراجعة" },
          { fr: "Audio de validation hebdo", ar: "صوت تثبيت أسبوعي" },
        ],
      },
    ],
    dates: [
      {
        id: "d-past",
        label: { fr: "Cohorte du printemps · clôturée", ar: "فوج الربيع · مغلق" },
        startISO: "2026-03-01T20:00:00+01:00",
        spotsTaken: 22,
        spotsTotal: 24,
      },
      {
        id: "d-summer",
        label: { fr: "Démarrage : Sam. 5 juil · 20h", ar: "البداية: السبت 5 جويلية · 20:00" },
        startISO: "2026-07-05T20:00:00+01:00",
        spotsTaken: 23,
        spotsTotal: 24,
      },
    ],
    accent: "from-[#DDA13A] to-[#2E9E78]",
    language: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-svt-bac",
    slug: "svt-bac-genetique",
    teacher: t("t-kahina"),
    title: {
      fr: "SVT Bac · génétique humaine",
      ar: "علوم طبيعية للباك · الوراثة البشرية",
    },
    subtitle: {
      fr: "Cohorte de 6 semaines sur le chapitre le plus piégeur du Bac SE.",
      ar: "فوج لـ 6 أسابيع حول أكثر فصل تعقيدًا في الباك علوم تجريبية.",
    },
    subject: { fr: "SVT", ar: "علوم الحياة والأرض" },
    format: "cohort",
    level: "advanced",
    durationLabel: { fr: "6 semaines · 12h", ar: "6 أسابيع · 12 سا" },
    priceDzd: 3800,
    rating: 4.78,
    reviews: 22,
    outcomes: [
      { fr: "Construire un arbre généalogique sans erreur", ar: "بناء شجرة عائلة بلا أخطاء" },
      { fr: "Maîtriser la transmission liée au sexe", ar: "إتقان النقل المرتبط بالجنس" },
      { fr: "Rédiger 5 exercices type Bac corrigés", ar: "تحرير 5 تمارين باك مع التصحيح" },
    ],
    includes: [
      { fr: "12 séances live · 60 min", ar: "12 جلسة مباشرة · 60 د" },
      { fr: "Planches schématiques en couleur", ar: "لوحات مخطّطة ملوّنة" },
    ],
    syllabus: [
      {
        title: { fr: "Programme", ar: "البرنامج" },
        items: [
          { fr: "Lois de Mendel", ar: "قوانين مندل" },
          { fr: "Arbres généalogiques", ar: "أشجار العائلة" },
          { fr: "Maladies génétiques humaines", ar: "الأمراض الوراثية البشرية" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Mar. 22 juil · 18h", ar: "البداية: الثلاثاء 22 جويلية · 18:00" },
        startISO: "2026-07-22T18:00:00+01:00",
        spotsTaken: 5,
        spotsTotal: 16,
      },
    ],
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-oud-debutant",
    slug: "oud-debutant-tlemcen",
    teacher: t("t-leila"),
    title: {
      fr: "Oud débutant · à Tlemcen, en présentiel",
      ar: "العود للمبتدئين · بتلمسان، حضوريًا",
    },
    subtitle: {
      fr: "Atelier mensuel de 3h pour découvrir l'oud — instrument fourni.",
      ar: "ورشة شهرية 3 ساعات لاكتشاف العود — الآلة متوفّرة.",
    },
    subject: { fr: "Oud", ar: "العود" },
    format: "event",
    level: "beginner",
    durationLabel: { fr: "Atelier · 3h", ar: "ورشة · 3 سا" },
    priceDzd: 2500,
    rating: 4.86,
    reviews: 14,
    outcomes: [
      { fr: "Découvrir la tenue et l'accordage", ar: "اكتشاف الإمساك والدوزان" },
      { fr: "Jouer 2 mélodies traditionnelles", ar: "عزف لحنين تقليديين" },
    ],
    includes: [
      { fr: "Atelier en présentiel à Tlemcen", ar: "ورشة حضورية بتلمسان" },
      { fr: "Instrument fourni pendant l'atelier", ar: "الآلة متوفّرة خلال الورشة" },
    ],
    syllabus: [
      {
        title: { fr: "Au programme", ar: "البرنامج" },
        items: [
          { fr: "Tenue et accordage (45 min)", ar: "الإمساك والدوزان (45 د)" },
          { fr: "Doigtés de base (1h)", ar: "أساسيات اللمس (ساعة)" },
          { fr: "2 mélodies traditionnelles (1h15)", ar: "لحنان تقليديان (ساعة و15)" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Sam. 19 juil · 15h", ar: "السبت 19 جويلية · 15:00" },
        startISO: "2026-07-19T15:00:00+01:00",
        spotsTaken: 7,
        spotsTotal: 8,
      },
    ],
    accent: "from-[#DDA13A] to-[#DD514D]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-chant-andalou",
    slug: "chant-andalou-nouba",
    teacher: t("t-leila"),
    title: {
      fr: "Chant andalou · cohorte nouba",
      ar: "الغناء الأندلسي · فوج النوبة",
    },
    subtitle: {
      fr: "10 semaines pour apprendre une nouba complète, en présentiel à Tlemcen.",
      ar: "10 أسابيع لتعلّم نوبة كاملة، حضوريًا بتلمسان.",
    },
    subject: { fr: "Chant", ar: "غناء" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "10 semaines · 20h", ar: "10 أسابيع · 20 سا" },
    priceDzd: 6800,
    rating: 4.92,
    reviews: 19,
    outcomes: [
      { fr: "Interpréter une nouba complète", ar: "أداء نوبة كاملة" },
      { fr: "Maîtriser le tab' de l'école tlemcénienne", ar: "إتقان الطّبع لمدرسة تلمسان" },
    ],
    includes: [
      { fr: "10 séances présentielles", ar: "10 جلسات حضورية" },
      { fr: "Partitions et paroles", ar: "نوتات وكلمات" },
    ],
    syllabus: [
      {
        title: { fr: "Programme", ar: "البرنامج" },
        items: [
          { fr: "Mishaliyat et touchya", ar: "المشاليات والتوشية" },
          { fr: "Inshad et m'sader", ar: "الإنشاد والمصادر" },
          { fr: "Khlas final", ar: "الخلاص الختامي" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Sam. 6 sept · 17h", ar: "البداية: السبت 6 سبتمبر · 17:00" },
        startISO: "2026-09-06T17:00:00+01:00",
        spotsTaken: 0,
        spotsTotal: 10,
      },
    ],
    accent: "from-[#DDA13A] to-[#1C3A5E]",
    language: { fr: ["AR", "FR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-flutter-cohort",
    slug: "flutter-cohorte-app-meteo",
    teacher: t("t-bilal"),
    title: {
      fr: "Flutter · app météo en 4 semaines",
      ar: "Flutter · تطبيق طقس في 4 أسابيع",
    },
    subtitle: {
      fr: "Code, débogue et publie une app Flutter sur le Play Store — pas de slides.",
      ar: "اكتب، صحّح وانشر تطبيق Flutter على Play Store — بلا شرائح.",
    },
    subject: { fr: "Programmation Mobile", ar: "برمجة الموبايل" },
    format: "cohort",
    level: "beginner",
    durationLabel: { fr: "4 semaines · 16h", ar: "4 أسابيع · 16 سا" },
    priceDzd: 8400,
    rating: 4.79,
    reviews: 12,
    outcomes: [
      { fr: "Maîtriser les widgets Flutter essentiels", ar: "إتقان widgets الأساسية في Flutter" },
      { fr: "Connecter une API REST avec gestion d'erreurs", ar: "ربط REST API مع إدارة الأخطاء" },
      { fr: "Publier sur le Play Store de A à Z", ar: "النشر على Play Store من الألف إلى الياء" },
    ],
    includes: [
      { fr: "16 séances live · 60 min", ar: "16 جلسة مباشرة · 60 د" },
      { fr: "Repo GitHub du projet", ar: "مستودع GitHub للمشروع" },
      { fr: "Revue de code 1:1 hebdo", ar: "مراجعة كود فردية أسبوعية" },
    ],
    syllabus: [
      {
        title: { fr: "Plan du sprint", ar: "خطّة السبرنت" },
        items: [
          { fr: "Setup Flutter + 1er widget", ar: "إعداد Flutter + الـ widget الأول" },
          { fr: "State management avec Provider", ar: "إدارة الحالة بـ Provider" },
          { fr: "API + persistance locale", ar: "API + تخزين محلّي" },
          { fr: "Build APK et publication", ar: "بناء APK والنشر" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Mar. 29 juil · 20h", ar: "البداية: الثلاثاء 29 جويلية · 20:00" },
        startISO: "2026-07-29T20:00:00+01:00",
        spotsTaken: 9,
        spotsTotal: 14,
      },
    ],
    accent: "from-[#3E8FD0] to-[#2E9E78]",
    language: { fr: ["FR", "EN"], ar: ["AR", "FR", "EN"] },
  },
  {
    id: "c-bem-maths",
    slug: "bem-maths-revision-finale",
    teacher: t("t-djamila"),
    title: {
      fr: "BEM Maths · révision finale 5 semaines",
      ar: "رياضيات BEM · مراجعة نهائية 5 أسابيع",
    },
    subtitle: {
      fr: "Cohorte mixte pour la 4e année moyenne — sujets BEM et fiches méthode.",
      ar: "فوج مختلط للسنة 4 متوسط — مواضيع BEM وبطاقات منهجية.",
    },
    subject: { fr: "Mathématiques · BEM", ar: "الرياضيات · BEM" },
    format: "cohort",
    level: "intermediate",
    durationLabel: { fr: "5 semaines · 10h", ar: "5 أسابيع · 10 سا" },
    priceDzd: 2800,
    rating: 4.4,
    reviews: 18,
    outcomes: [
      { fr: "Maîtriser fractions, équations et géométrie", ar: "إتقان الكسور والمعادلات والهندسة" },
      { fr: "Faire 4 sujets BEM en conditions réelles", ar: "إنجاز 4 مواضيع BEM في ظروف حقيقية" },
    ],
    includes: [
      { fr: "10 séances live · 60 min", ar: "10 جلسات مباشرة · 60 د" },
      { fr: "Annales BEM 2021-2025", ar: "مواضيع BEM 2021-2025" },
    ],
    syllabus: [
      {
        title: { fr: "Programme", ar: "البرنامج" },
        items: [
          { fr: "Calcul numérique et littéral", ar: "الحساب العددي والحرفي" },
          { fr: "Équations et inéquations", ar: "المعادلات والمتراجحات" },
          { fr: "Géométrie plane", ar: "الهندسة المستوية" },
          { fr: "4 sujets BEM corrigés", ar: "4 مواضيع BEM مع التصحيح" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Démarrage : Sam. 6 sept · 14h", ar: "البداية: السبت 6 سبتمبر · 14:00" },
        startISO: "2026-09-06T14:00:00+01:00",
        spotsTaken: 3,
        spotsTotal: 16,
      },
    ],
    accent: "from-[#1C3A5E] to-[#DDA13A]",
    language: { fr: ["FR", "AR"], ar: ["AR", "FR"] },
  },
  {
    id: "c-react-archived",
    slug: "react-cohorte-printemps-2025",
    teacher: t("t-amine"),
    title: {
      fr: "React from scratch · cohorte du printemps (archivée)",
      ar: "React من الصفر · فوج الربيع (مؤرشف)",
    },
    subtitle: {
      fr: "Cohorte clôturée — replays disponibles avec accès à vie pour les inscrits.",
      ar: "فوج مغلق — الإعادات متاحة مدى الحياة للمسجَّلين.",
    },
    subject: { fr: "Programmation Web", ar: "برمجة الويب" },
    format: "cohort",
    level: "beginner",
    durationLabel: { fr: "6 semaines · 18h", ar: "6 أسابيع · 18 سا" },
    priceDzd: 9800,
    rating: 4.88,
    reviews: 26,
    outcomes: [
      { fr: "Tout le programme de la cohorte 6 semaines", ar: "كامل برنامج فوج 6 أسابيع" },
    ],
    includes: [
      { fr: "Replays HD à vie", ar: "إعادات HD مدى الحياة" },
      { fr: "Code source du projet final", ar: "الكود المصدري للمشروع النهائي" },
    ],
    syllabus: [
      {
        title: { fr: "Programme (archivé)", ar: "البرنامج (مؤرشف)" },
        items: [
          { fr: "Voir cohorte courante pour le détail", ar: "راجع الفوج الحالي للتفاصيل" },
        ],
      },
    ],
    dates: [
      {
        id: "d-1",
        label: { fr: "Cohorte clôturée — 12 mar. 2026", ar: "فوج مغلق — 12 مارس 2026" },
        startISO: "2026-03-12T20:00:00+01:00",
        spotsTaken: 16,
        spotsTotal: 18,
      },
    ],
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
    language: { fr: ["FR", "EN"], ar: ["AR", "FR", "EN"] },
  },
];

export function courseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug || c.id === slug);
}

export function coursesForTeacher(teacherId: string) {
  return courses.filter((c) => c.teacher.id === teacherId);
}
