import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing, localeMeta, type Locale } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C3A5E",
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "darso — Apprenez de l'Algérie. Enseignez à l'Algérie.",
    ar: "درسو — تعلّم من الجزائر. علّم الجزائر.",
  };
  const descs: Record<string, string> = {
    fr: "La marketplace algérienne de l'apprentissage. Trouvez un professeur, réservez un cours, ou enseignez ce que vous savez.",
    ar: "منصّة التعلّم في الجزائر. ابحث عن أستاذ، احجز درسًا، أو علّم ما تتقنه.",
  };
  return {
    title: { default: titles[locale] ?? titles.fr, template: "%s · darso" },
    description: descs[locale] ?? descs.fr,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const meta = localeMeta[locale as Locale];

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      suppressHydrationWarning
      className={`${inter.variable} ${plexArabic.variable}`}
    >
      <body
        className="min-h-dvh bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Africa/Algiers">
          <div className="flex min-h-dvh flex-col">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
