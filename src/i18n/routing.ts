import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "ar"] as const,
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeMeta: Record<Locale, { label: string; dir: "ltr" | "rtl"; htmlLang: string; nativeLabel: string }> = {
  fr: { label: "Français", nativeLabel: "Français", dir: "ltr", htmlLang: "fr-DZ" },
  ar: { label: "العربية", nativeLabel: "العربية", dir: "rtl", htmlLang: "ar-DZ" },
};
