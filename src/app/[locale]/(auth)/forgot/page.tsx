import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/student/forgot-password-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "نسيت كلمة السرّ" : "Mot de passe oublié",
  };
}

export default async function ForgotPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ForgotPasswordForm />;
}
