import { setRequestLocale } from "next-intl/server";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Full-bleed: NO SiteHeader/Footer per design spec. We do surface the
  // LanguageSwitcher in the top-end corner so visitors can swap FR/AR
  // without being signed in (otherwise the only locale switch lives in the
  // SiteHeader, which the auth shell intentionally strips).
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col">
      <div className="pointer-events-none absolute end-4 top-4 z-40 md:end-6 md:top-6">
        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </div>
      {children}
    </main>
  );
}
