import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, locale: string, currency = "DZD") {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ").format(value);
}

export function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", { notation: "compact" }).format(value);
}
