import { featuredTeachers, type LocalizedString, type Teacher } from "./teachers";

export type NotificationType =
  | "booking"
  | "message"
  | "review"
  | "system"
  | "billing"
  | "dispute";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: LocalizedString;
  body: LocalizedString;
  /** ISO datetime */
  at: string;
  /** Bucket for display grouping */
  bucket: "today" | "week" | "earlier";
  unread: boolean;
  href: string;
  hrefLabel: LocalizedString;
  teacher?: Teacher;
  amountDzd?: number;
};

const t = (id: string) => featuredTeachers.find((x) => x.id === id)!;

const isoMinutesAgo = (m: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
};
const isoHoursAgo = (h: number) => isoMinutesAgo(h * 60);
const isoDaysAgo = (d: number) => isoHoursAgo(d * 24);

export const appNotifications: AppNotification[] = [
  {
    id: "n-1",
    type: "booking",
    bucket: "today",
    at: isoMinutesAgo(8),
    unread: true,
    teacher: t("t-khalil"),
    title: { fr: "Séance confirmée demain à 9h", ar: "تأكيد الحصة غدًا على 9:00" },
    body: { fr: "Khalil Bensaïd a confirmé · Maths · 1h30 · en ligne.", ar: "أكّد خليل بن سعيد · رياضيات · 1س30د · عبر الإنترنت." },
    href: "/calendar",
    hrefLabel: { fr: "Voir le calendrier", ar: "عرض التقويم" },
  },
  {
    id: "n-2",
    type: "message",
    bucket: "today",
    at: isoMinutesAgo(12),
    unread: true,
    teacher: t("t-khalil"),
    title: { fr: "Nouveau message", ar: "رسالة جديدة" },
    body: { fr: "« 0 — passe par la règle de L'Hôpital, ça tombe direct. »", ar: "«0 — استعملي قاعدة لوبيتال، تنحلّ مباشرة.»" },
    href: "/messages/th-khalil",
    hrefLabel: { fr: "Répondre", ar: "الرد" },
  },
  {
    id: "n-3",
    type: "billing",
    bucket: "today",
    at: isoHoursAgo(3),
    unread: true,
    amountDzd: 1500,
    title: { fr: "Paiement reçu · 1 500 DA", ar: "دفعة مستلمة · 1 500 دج" },
    body: { fr: "Reçu envoyé sur votre email — séance Math du 14.", ar: "تم إرسال الإيصال — حصة الرياضيات في 14." },
    href: "/billing",
    hrefLabel: { fr: "Voir le reçu", ar: "عرض الإيصال" },
  },
  {
    id: "n-4",
    type: "review",
    bucket: "today",
    at: isoHoursAgo(6),
    unread: false,
    teacher: t("t-yasmine"),
    title: { fr: "Laissez un avis · Yasmine Haddad", ar: "اتركي تقييمًا · ياسمين حدّاد" },
    body: { fr: "Votre dernier cours date d'hier. Un retour aide la communauté.", ar: "آخر درس كان أمس. تعليقك يفيد المجتمع." },
    href: "/teachers/yasmine-haddad",
    hrefLabel: { fr: "Donner un avis", ar: "ترك تقييم" },
  },
  // Week
  {
    id: "n-5",
    type: "dispute",
    bucket: "week",
    at: isoDaysAgo(2),
    unread: false,
    teacher: t("t-rayan"),
    title: { fr: "Mise à jour de votre dossier #DSP-2841", ar: "تحديث ملفّك #DSP-2841" },
    body: { fr: "Le prof a répondu — médiation proposée.", ar: "ردّ الأستاذ — تمّ اقتراح وساطة." },
    href: "/disputes/DSP-2841",
    hrefLabel: { fr: "Ouvrir le dossier", ar: "فتح الملف" },
  },
  {
    id: "n-6",
    type: "system",
    bucket: "week",
    at: isoDaysAgo(3),
    unread: false,
    title: { fr: "Nouveautés · paiement par CIB", ar: "جديد · الدفع عبر CIB" },
    body: { fr: "Les cartes CIB et Edahabia sont désormais acceptées.", ar: "أصبحت بطاقات CIB و الذهبية مقبولة." },
    href: "/billing",
    hrefLabel: { fr: "En savoir plus", ar: "المزيد" },
  },
  {
    id: "n-7",
    type: "booking",
    bucket: "week",
    at: isoDaysAgo(4),
    unread: false,
    teacher: t("t-amine"),
    title: { fr: "Rappel · React semaine 3 ce soir", ar: "تذكير · React الأسبوع 3 الليلة" },
    body: { fr: "Démarrage à 20h00. Connectez-vous 5 minutes en avance.", ar: "البداية على 20:00. اتصلوا قبل 5 دقائق." },
    href: "/courses/react-from-scratch",
    hrefLabel: { fr: "Aller au cours", ar: "إلى الدرس" },
  },
  {
    id: "n-8",
    type: "message",
    bucket: "week",
    at: isoDaysAgo(5),
    unread: false,
    teacher: t("t-souad"),
    title: { fr: "Souad vous a envoyé un fichier", ar: "أرسلت لك سعاد ملفًا" },
    body: { fr: "Tilāwa-revision.pdf · 312 Ko", ar: "Tilāwa-revision.pdf · 312 ك.ب" },
    href: "/messages/th-souad",
    hrefLabel: { fr: "Ouvrir", ar: "فتح" },
  },
  // Earlier
  {
    id: "n-9",
    type: "billing",
    bucket: "earlier",
    at: isoDaysAgo(9),
    unread: false,
    amountDzd: 3600,
    title: { fr: "Remboursement effectué · 3 600 DA", ar: "تمّ الاسترداد · 3 600 دج" },
    body: { fr: "Le remboursement de la séance annulée a été crédité.", ar: "تمّ تحويل مبلغ الحصة الملغاة." },
    href: "/billing",
    hrefLabel: { fr: "Détails", ar: "التفاصيل" },
  },
  {
    id: "n-10",
    type: "review",
    bucket: "earlier",
    at: isoDaysAgo(12),
    unread: false,
    teacher: t("t-khalil"),
    title: { fr: "Khalil a laissé un avis sur vous", ar: "ترك خليل تقييمًا عنك" },
    body: { fr: "« Élève rigoureuse, progrès clair en 4 séances. »", ar: "«طالبة منضبطة، تقدّم واضح في 4 حصص.»" },
    href: "/account/reviews",
    hrefLabel: { fr: "Lire l'avis", ar: "قراءة التقييم" },
  },
  {
    id: "n-11",
    type: "system",
    bucket: "earlier",
    at: isoDaysAgo(15),
    unread: false,
    title: { fr: "Vérifiez votre numéro de téléphone", ar: "أكّد رقم هاتفك" },
    body: { fr: "Une vérification ajoute un badge à votre profil.", ar: "التحقق يضيف شارة إلى حسابك." },
    href: "/account/verify",
    hrefLabel: { fr: "Vérifier", ar: "التحقق" },
  },
  {
    id: "n-12",
    type: "dispute",
    bucket: "earlier",
    at: isoDaysAgo(20),
    unread: false,
    teacher: t("t-amine"),
    title: { fr: "Dossier #DSP-2102 résolu", ar: "الملف #DSP-2102 محلول" },
    body: { fr: "Remboursement de 50% appliqué — affaire close.", ar: "تم تطبيق استرداد 50% — تمّ الإغلاق." },
    href: "/disputes/DSP-2102",
    hrefLabel: { fr: "Voir le dossier", ar: "عرض الملف" },
  },
];
