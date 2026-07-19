import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing, localeMeta, type Locale } from "@/i18n/routing";
import { CurrentUserProvider, signOutAction } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth/server";
import { ToastHost } from "@/lib/toast";
import { ScenarioSwitcher } from "@/components/dev/scenario-switcher";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C1F26",
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "darso — Apprenez de l'Algérie. Enseignez à l'Algérie.",
      template: "%s · darso",
    },
    description:
      "La marketplace algérienne de l'apprentissage. Trouvez un professeur, réservez un cours, ou enseignez ce que vous savez.",
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

  const currentUser = await getCurrentUser();

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      suppressHydrationWarning
      className={`${inter.variable} ${caveat.variable} ${montserrat.variable}`}
    >
      <body
        className="min-h-dvh bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Africa/Algiers">
          <CurrentUserProvider initialUser={currentUser} signOut={signOutAction}>
            <ToastHost>
              <div className="flex min-h-dvh flex-col">{children}</div>
              {process.env.NODE_ENV !== "production" && <ScenarioSwitcher />}
            </ToastHost>
          </CurrentUserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
