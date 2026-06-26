import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Loads every JSON file under `messages/<locale>/` and merges them shallow-keyed
 * by filename (without extension). Each subagent / feature can own its own
 * namespace file without touching anyone else's.
 *
 * Example: `messages/fr/common.json` → `t("home.hero.title")`
 *          `messages/fr/student.json` → `t("student.browse.title")`
 */

const loaders: Record<string, () => Promise<Record<string, unknown>>> = {
  // Common (shared chrome, footer, brand)
  "fr/common": () => import("../../messages/fr/common.json").then((m) => m.default),
  "ar/common": () => import("../../messages/ar/common.json").then((m) => m.default),
  // Student app surfaces
  "fr/student": () => import("../../messages/fr/student.json").then((m) => m.default),
  "ar/student": () => import("../../messages/ar/student.json").then((m) => m.default),
  // Teacher dashboard
  "fr/teacher": () => import("../../messages/fr/teacher.json").then((m) => m.default),
  "ar/teacher": () => import("../../messages/ar/teacher.json").then((m) => m.default),
  // Reverse marketplace (requests)
  "fr/requests": () => import("../../messages/fr/requests.json").then((m) => m.default),
  "ar/requests": () => import("../../messages/ar/requests.json").then((m) => m.default),
  // Cross-cutting (calendar, chat, notifications, disputes)
  "fr/app": () => import("../../messages/fr/app.json").then((m) => m.default),
  "ar/app": () => import("../../messages/ar/app.json").then((m) => m.default),
  // Auth pages
  "fr/auth": () => import("../../messages/fr/auth.json").then((m) => m.default),
  "ar/auth": () => import("../../messages/ar/auth.json").then((m) => m.default),
};

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const entries = await Promise.all(
    Object.entries(loaders)
      .filter(([key]) => key.startsWith(`${locale}/`))
      .map(async ([, fn]) => fn()),
  );
  return entries.reduce<Record<string, unknown>>((acc, mod) => ({ ...acc, ...mod }), {});
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: "Africa/Algiers",
    now: new Date(),
    formats: {
      dateTime: {
        short: { day: "numeric", month: "short", year: "numeric" },
        long: { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" },
        weekday: { weekday: "long", day: "numeric", month: "long" },
      },
      number: {
        currency: { style: "currency", currency: "DZD", maximumFractionDigits: 0 },
        compact: { notation: "compact" },
      },
    },
  };
});
