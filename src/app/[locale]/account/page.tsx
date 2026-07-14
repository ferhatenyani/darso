import { setRequestLocale } from "next-intl/server";

import { AccountShell } from "@/components/student/account-shell";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AccountShell />;
}
