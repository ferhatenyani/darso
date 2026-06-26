import type { LocalizedString } from "./teachers";

export type Review = {
  id: string;
  teacherId: string;
  studentName: LocalizedString;
  studentInitials: string;
  studentAccent: string; // tailwind gradient
  rating: number;
  date: { fr: string; ar: string };
  body: LocalizedString;
  subjectTag?: LocalizedString;
};

export const reviews: Review[] = [
  {
    id: "r-1",
    teacherId: "t-khalil",
    studentName: { fr: "Yacine M.", ar: "ياسين م." },
    studentInitials: "YM",
    studentAccent: "from-[#2F6BFF] to-[#3E8FD0]",
    rating: 5,
    date: { fr: "Il y a 3 jours", ar: "منذ 3 أيام" },
    body: {
      fr: "Méthode hyper claire pour les limites. J'ai gagné 4 points sur le BB en deux mois. Ponctuel, patient, et il prend le temps de répondre sur WhatsApp entre les cours.",
      ar: "طريقة شرح واضحة جدًا للنهايات. تحسّنت نقطتي بـ 4 درجات في شهرين. منضبط، صبور، ويجيب عبر واتساب بين الدروس.",
    },
    subjectTag: { fr: "Math Bac", ar: "رياضيات الباك" },
  },
  {
    id: "r-2",
    teacherId: "t-khalil",
    studentName: { fr: "Hadjer R.", ar: "هاجر ر." },
    studentInitials: "HR",
    studentAccent: "from-[#DDA13A] to-[#DD514D]",
    rating: 5,
    date: { fr: "Il y a 1 semaine", ar: "منذ أسبوع" },
    body: {
      fr: "Excellent prof pour le post-bac. Il m'a remis à niveau en algèbre linéaire avant ma rentrée en prépa.",
      ar: "أستاذ ممتاز لما بعد الباك. أعاد لي مستواي في الجبر الخطي قبل دخولي للأقسام التحضيرية.",
    },
    subjectTag: { fr: "Algèbre", ar: "الجبر" },
  },
  {
    id: "r-3",
    teacherId: "t-khalil",
    studentName: { fr: "Brahim K.", ar: "إبراهيم ك." },
    studentInitials: "BK",
    studentAccent: "from-[#2E9E78] to-[#1C3A5E]",
    rating: 4,
    date: { fr: "Il y a 2 semaines", ar: "منذ أسبوعين" },
    body: {
      fr: "Très bon contact. Un peu rapide parfois, mais il s'adapte si on lui dit.",
      ar: "تواصل ممتاز. أحيانًا يسرع قليلًا، لكنه يتكيّف إذا طلبتَ منه ذلك.",
    },
  },
  {
    id: "r-4",
    teacherId: "t-yasmine",
    studentName: { fr: "Lina M.", ar: "لينا م." },
    studentInitials: "LM",
    studentAccent: "from-[#3E8FD0] to-[#2F6BFF]",
    rating: 5,
    date: { fr: "Il y a 4 jours", ar: "منذ 4 أيام" },
    body: {
      fr: "Je visais 6.5 à l'IELTS, j'ai eu 7.5. La partie Speaking était mon point faible, elle m'a vraiment débloquée.",
      ar: "كنت أستهدف 6.5 في IELTS فحصلت على 7.5. كانت نقطة ضعفي في التحدّث، وفكّت لي العقدة.",
    },
    subjectTag: { fr: "IELTS Speaking", ar: "IELTS التحدّث" },
  },
  {
    id: "r-5",
    teacherId: "t-yasmine",
    studentName: { fr: "Mehdi B.", ar: "مهدي ب." },
    studentInitials: "MB",
    studentAccent: "from-[#1C3A5E] to-[#2F6BFF]",
    rating: 5,
    date: { fr: "Il y a 1 semaine", ar: "منذ أسبوع" },
    body: {
      fr: "Cours structuré, support PDF impeccable. Elle ne perd pas de temps, c'est ce que je voulais.",
      ar: "دروس منظّمة، ووثائق PDF متقنة. لا تضيّع الوقت، وهذا ما أردته.",
    },
  },
  {
    id: "r-6",
    teacherId: "t-amine",
    studentName: { fr: "Selma A.", ar: "سلمى أ." },
    studentInitials: "SA",
    studentAccent: "from-[#DD514D] to-[#DDA13A]",
    rating: 5,
    date: { fr: "Il y a 2 jours", ar: "منذ يومين" },
    body: {
      fr: "On a construit une vraie app React en 6 semaines. Pas de slides ennuyeux, on code dès la première heure.",
      ar: "بنينا تطبيق React حقيقيًا في 6 أسابيع. لا شرائح مملّة، نبدأ بالكتابة من الساعة الأولى.",
    },
    subjectTag: { fr: "React", ar: "React" },
  },
  {
    id: "r-7",
    teacherId: "t-souad",
    studentName: { fr: "Amel D.", ar: "أمل د." },
    studentInitials: "AD",
    studentAccent: "from-[#2E9E78] to-[#3E8FD0]",
    rating: 5,
    date: { fr: "Il y a 3 jours", ar: "منذ 3 أيام" },
    body: {
      fr: "Sœur Souad est patiente et douce avec les enfants. Ma fille de 8 ans a vraiment progressé.",
      ar: "الأستاذة سعاد صبورة ولطيفة مع الأطفال. ابنتي ذات 8 سنوات تقدّمت كثيرًا.",
    },
    subjectTag: { fr: "Tajwid enfants", ar: "تجويد الأطفال" },
  },
  {
    id: "r-8",
    teacherId: "t-imene",
    studentName: { fr: "Walid B.", ar: "وليد ب." },
    studentInitials: "WB",
    studentAccent: "from-[#1C3A5E] to-[#3E8FD0]",
    rating: 5,
    date: { fr: "Il y a 5 jours", ar: "منذ 5 أيام" },
    body: {
      fr: "Le marathon mécanique du dimanche m'a sauvé pour le Bac blanc. Très claire sur les forces.",
      ar: "ماراطون الميكانيك يوم الأحد أنقذني في الباك الأبيض. شرح واضح جدًا للقوى.",
    },
  },
];

export function reviewsForTeacher(teacherId: string) {
  return reviews.filter((r) => r.teacherId === teacherId);
}
