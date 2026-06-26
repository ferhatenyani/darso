import { setRequestLocale } from "next-intl/server";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Full-bleed: NO SiteHeader/Footer per design spec.
  return <main className="flex min-h-dvh flex-1 flex-col">{children}</main>;
}
