import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr"] as const,
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeMeta: Record<Locale, { label: string; dir: "ltr"; htmlLang: string; nativeLabel: string }> = {
  fr: { label: "Français", nativeLabel: "Français", dir: "ltr", htmlLang: "fr-DZ" },
};
