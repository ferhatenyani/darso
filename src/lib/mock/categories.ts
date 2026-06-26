import {
  BookOpen,
  Languages,
  Code2,
  Palette,
  Briefcase,
  Music,
  Moon,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "school"
  | "languages"
  | "code"
  | "design"
  | "business"
  | "music"
  | "religion"
  | "exams";

export const categories: { key: CategoryKey; icon: LucideIcon; teacherCount: number; accent: string }[] = [
  { key: "school", icon: BookOpen, teacherCount: 312, accent: "from-[#1C3A5E]/12 to-[#2F6BFF]/14" },
  { key: "languages", icon: Languages, teacherCount: 248, accent: "from-[#3E8FD0]/14 to-[#2F6BFF]/12" },
  { key: "code", icon: Code2, teacherCount: 184, accent: "from-[#2F6BFF]/14 to-[#1C3A5E]/12" },
  { key: "design", icon: Palette, teacherCount: 96, accent: "from-[#DD514D]/12 to-[#DDA13A]/14" },
  { key: "business", icon: Briefcase, teacherCount: 132, accent: "from-[#1C3A5E]/14 to-[#3E8FD0]/12" },
  { key: "music", icon: Music, teacherCount: 78, accent: "from-[#DDA13A]/14 to-[#DD514D]/12" },
  { key: "religion", icon: Moon, teacherCount: 156, accent: "from-[#2E9E78]/14 to-[#1C3A5E]/12" },
  { key: "exams", icon: GraduationCap, teacherCount: 204, accent: "from-[#2F6BFF]/12 to-[#2E9E78]/14" },
];

export const wilayaKeys = [
  "any",
  "alger",
  "oran",
  "constantine",
  "annaba",
  "blida",
  "setif",
  "batna",
  "tlemcen",
  "tiziOuzou",
  "bejaia",
] as const;
