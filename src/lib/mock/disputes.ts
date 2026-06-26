import { featuredTeachers, type LocalizedString, type Teacher } from "./teachers";

export type DisputeState =
  | "open"
  | "awaiting-response"
  | "in-mediation"
  | "resolved"
  | "refunded"
  | "rejected";

export type DisputeRole = "student" | "teacher" | "mediator" | "system";

export type DisputeTimelineEntry = {
  id: string;
  state: DisputeState;
  /** ISO datetime */
  at: string;
  actor: DisputeRole;
  /** Who exactly — for student / teacher use a name */
  actorName?: LocalizedString;
  actorInitials?: string;
  actorAccent?: string;
  action: LocalizedString;
  description?: LocalizedString;
  attachments?: { id: string; name: string; sizeKb: number; kind: "pdf" | "image" | "doc" | "audio" }[];
};

export type DisputeMessage = {
  id: string;
  authorId: "u-self" | "counterparty" | "mediator";
  authorName: LocalizedString;
  authorInitials: string;
  authorAccent: string;
  at: string;
  text: LocalizedString;
};

export type Dispute = {
  /** Display id, monospace, e.g. "DSP-2841" */
  id: string;
  state: DisputeState;
  openedAt: string;
  lastActivityAt: string;
  /** Counterparty: usually the teacher in student-initiated disputes */
  counterparty: Teacher;
  /** What was the session/course */
  subject: { course: LocalizedString; sessionLabel: LocalizedString };
  /** Short claim title and summary */
  title: LocalizedString;
  claim: LocalizedString;
  amountDzd: number;
  refundProposedPct?: number;
  timeline: DisputeTimelineEntry[];
  messages: DisputeMessage[];
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;
const isoDaysAgo = (d: number) => {
  const x = new Date();
  x.setDate(x.getDate() - d);
  return x.toISOString();
};
const isoHoursAgo = (h: number) => {
  const x = new Date();
  x.setHours(x.getHours() - h);
  return x.toISOString();
};

const lina = {
  name: { fr: "Lina M.", ar: "لينا م." } as LocalizedString,
  initials: "LM",
  accent: "from-[#2F6BFF] to-[#3E8FD0]",
};
const mediator = {
  name: { fr: "Médiation darso", ar: "وساطة درسو" } as LocalizedString,
  initials: "DM",
  accent: "from-[#1C3A5E] to-[#102338]",
};

export const disputes: Dispute[] = [
  {
    id: "DSP-2841",
    state: "in-mediation",
    openedAt: isoDaysAgo(4),
    lastActivityAt: isoDaysAgo(2),
    counterparty: t("t-rayan"),
    subject: {
      course: { fr: "Piano · ballade jazz", ar: "بيانو · بالاد جاز" },
      sessionLabel: { fr: "Séance du 14 mai · 17h00", ar: "حصة 14 ماي · 17:00" },
    },
    title: { fr: "Séance écourtée sans préavis", ar: "تقصير الحصة دون إشعار" },
    claim: {
      fr: "Le prof a terminé la séance après 35 min sur 60. Pas de message préalable.",
      ar: "أنهى الأستاذ الحصة بعد 35 من 60 دقيقة. دون إشعار مسبق.",
    },
    amountDzd: 1600,
    refundProposedPct: 50,
    timeline: [
      {
        id: "tl-1",
        state: "open",
        at: isoDaysAgo(4),
        actor: "student",
        actorName: lina.name,
        actorInitials: lina.initials,
        actorAccent: lina.accent,
        action: { fr: "Dossier ouvert", ar: "فتح الملفّ" },
        description: { fr: "Vous avez signalé une séance écourtée.", ar: "أبلغت عن تقصير الحصة." },
        attachments: [{ id: "f1", name: "screenshot-1730.png", sizeKb: 412, kind: "image" }],
      },
      {
        id: "tl-2",
        state: "awaiting-response",
        at: isoDaysAgo(4),
        actor: "system",
        action: { fr: "Réponse demandée au prof", ar: "تمّ طلب ردّ من الأستاذ" },
        description: { fr: "Délai de 72 h ouvré.", ar: "مهلة 72 ساعة عمل." },
      },
      {
        id: "tl-3",
        state: "awaiting-response",
        at: isoDaysAgo(3),
        actor: "teacher",
        actorName: t("t-rayan").name,
        actorInitials: t("t-rayan").initials,
        actorAccent: t("t-rayan").accent,
        action: { fr: "Réponse du prof", ar: "ردّ الأستاذ" },
        description: { fr: "« Coupure d'électricité chez moi, je propose 50% de remboursement. »", ar: "«انقطع التيار عندي، أقترح استرداد 50%.»" },
      },
      {
        id: "tl-4",
        state: "in-mediation",
        at: isoDaysAgo(2),
        actor: "mediator",
        actorName: mediator.name,
        actorInitials: mediator.initials,
        actorAccent: mediator.accent,
        action: { fr: "Médiation ouverte", ar: "فتح الوساطة" },
        description: { fr: "Un médiateur darso prend en charge.", ar: "وسيط من درسو يتولّى الملفّ." },
      },
    ],
    messages: [
      {
        id: "dm-1",
        authorId: "u-self",
        authorName: lina.name,
        authorInitials: lina.initials,
        authorAccent: lina.accent,
        at: isoDaysAgo(2),
        text: { fr: "Je veux bien comprendre, mais 50% ne couvre pas mon trajet.", ar: "أتفهّم، لكن 50% لا يغطّي تنقّلي." },
      },
      {
        id: "dm-2",
        authorId: "counterparty",
        authorName: t("t-rayan").name,
        authorInitials: t("t-rayan").initials,
        authorAccent: t("t-rayan").accent,
        at: isoDaysAgo(2),
        text: { fr: "Je peux offrir une séance de rattrapage gratuite en plus.", ar: "أستطيع تقديم حصة تعويض مجانية إضافية." },
      },
      {
        id: "dm-3",
        authorId: "mediator",
        authorName: mediator.name,
        authorInitials: mediator.initials,
        authorAccent: mediator.accent,
        at: isoHoursAgo(20),
        text: { fr: "Proposition équilibrée. Pouvez-vous confirmer chacun ?", ar: "اقتراح متوازن. هل يؤكّد كلّ طرف؟" },
      },
    ],
  },
  {
    id: "DSP-2902",
    state: "open",
    openedAt: isoDaysAgo(1),
    lastActivityAt: isoHoursAgo(4),
    counterparty: t("t-amine"),
    subject: {
      course: { fr: "React from scratch", ar: "React من الصفر" },
      sessionLabel: { fr: "Séance du 22 mai · 20h", ar: "حصة 22 ماي · 20:00" },
    },
    title: { fr: "Contenu absent de la cohorte", ar: "محتوى مفقود في الفوج" },
    claim: {
      fr: "Les ressources promises (repo GitHub, slides) ne sont pas accessibles.",
      ar: "الموارد الموعودة (مستودع GitHub، الشرائح) غير متاحة.",
    },
    amountDzd: 2200,
    timeline: [
      {
        id: "tl-1",
        state: "open",
        at: isoDaysAgo(1),
        actor: "student",
        actorName: lina.name,
        actorInitials: lina.initials,
        actorAccent: lina.accent,
        action: { fr: "Dossier ouvert", ar: "فتح الملفّ" },
        description: { fr: "Vous attendez les ressources depuis 5 jours.", ar: "بانتظار الموارد منذ 5 أيام." },
      },
    ],
    messages: [],
  },
  {
    id: "DSP-2780",
    state: "awaiting-response",
    openedAt: isoDaysAgo(6),
    lastActivityAt: isoDaysAgo(3),
    counterparty: t("t-yasmine"),
    subject: {
      course: { fr: "IELTS Speaking", ar: "IELTS التحدّث" },
      sessionLabel: { fr: "Séance du 9 mai · 18h", ar: "حصة 9 ماي · 18:00" },
    },
    title: { fr: "Pas de feedback écrit promis", ar: "غياب التغذية الراجعة الموعودة" },
    claim: { fr: "Aucun retour écrit n'a été fourni après la séance.", ar: "لم يتم تقديم أي تغذية راجعة مكتوبة بعد الحصة." },
    amountDzd: 1800,
    timeline: [
      {
        id: "tl-1",
        state: "open",
        at: isoDaysAgo(6),
        actor: "student",
        actorName: lina.name,
        actorInitials: lina.initials,
        actorAccent: lina.accent,
        action: { fr: "Dossier ouvert", ar: "فتح الملفّ" },
      },
      {
        id: "tl-2",
        state: "awaiting-response",
        at: isoDaysAgo(6),
        actor: "system",
        action: { fr: "Réponse demandée au prof", ar: "تمّ طلب ردّ من الأستاذة" },
      },
    ],
    messages: [],
  },
  {
    id: "DSP-2102",
    state: "resolved",
    openedAt: isoDaysAgo(28),
    lastActivityAt: isoDaysAgo(20),
    counterparty: t("t-amine"),
    subject: {
      course: { fr: "React from scratch", ar: "React من الصفر" },
      sessionLabel: { fr: "Séance du 19 avril", ar: "حصة 19 أفريل" },
    },
    title: { fr: "Plateforme instable en séance", ar: "مشاكل تقنية أثناء الحصة" },
    claim: { fr: "Beaucoup de coupures vidéo durant 30 min.", ar: "انقطاعات متكرّرة في الفيديو لمدّة 30 دقيقة." },
    amountDzd: 2200,
    refundProposedPct: 25,
    timeline: [
      {
        id: "tl-1",
        state: "open",
        at: isoDaysAgo(28),
        actor: "student",
        actorName: lina.name,
        actorInitials: lina.initials,
        actorAccent: lina.accent,
        action: { fr: "Dossier ouvert", ar: "فتح الملفّ" },
      },
      {
        id: "tl-2",
        state: "in-mediation",
        at: isoDaysAgo(25),
        actor: "mediator",
        actorName: mediator.name,
        actorInitials: mediator.initials,
        actorAccent: mediator.accent,
        action: { fr: "Médiation", ar: "وساطة" },
      },
      {
        id: "tl-3",
        state: "resolved",
        at: isoDaysAgo(20),
        actor: "mediator",
        actorName: mediator.name,
        actorInitials: mediator.initials,
        actorAccent: mediator.accent,
        action: { fr: "Accord trouvé · remboursement 25%", ar: "تمّ التوصّل لاتّفاق · استرداد 25%" },
      },
    ],
    messages: [],
  },
  {
    id: "DSP-2009",
    state: "refunded",
    openedAt: isoDaysAgo(45),
    lastActivityAt: isoDaysAgo(40),
    counterparty: t("t-imene"),
    subject: {
      course: { fr: "Physique · cours particulier", ar: "فيزياء · درس خاصّ" },
      sessionLabel: { fr: "Séance du 1 avril", ar: "حصة 1 أفريل" },
    },
    title: { fr: "Annulation tardive du prof", ar: "إلغاء متأخّر من الأستاذة" },
    claim: { fr: "Annulé 15 min avant le début sans alternative.", ar: "ألغيت قبل 15 دقيقة دون بديل." },
    amountDzd: 1400,
    refundProposedPct: 100,
    timeline: [
      { id: "tl-1", state: "open", at: isoDaysAgo(45), actor: "student", actorName: lina.name, actorInitials: lina.initials, actorAccent: lina.accent, action: { fr: "Dossier ouvert", ar: "فتح الملفّ" } },
      { id: "tl-2", state: "refunded", at: isoDaysAgo(40), actor: "system", action: { fr: "Remboursement 100% appliqué", ar: "استرداد 100% مطبّق" } },
    ],
    messages: [],
  },
];

export function findDispute(id: string) {
  return disputes.find((d) => d.id === id);
}

export const stateLabel: Record<DisputeState, LocalizedString> = {
  open: { fr: "Ouvert", ar: "مفتوح" },
  "awaiting-response": { fr: "En attente de réponse", ar: "بانتظار الردّ" },
  "in-mediation": { fr: "En médiation", ar: "قيد الوساطة" },
  resolved: { fr: "Résolu", ar: "محلول" },
  refunded: { fr: "Remboursé", ar: "تمّ الاسترداد" },
  rejected: { fr: "Rejeté", ar: "مرفوض" },
};

/** Linear order used to mark which states are past vs future in the timeline */
export const stateOrder: DisputeState[] = [
  "open",
  "awaiting-response",
  "in-mediation",
  "resolved",
];
