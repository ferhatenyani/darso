import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ComingSoon } from "@/components/marketing/coming-soon";

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
  const ar = locale === "ar";

  return (
    <ComingSoon
      title={ar ? "نسيت كلمة السرّ" : "Mot de passe oublié"}
      description={
        ar
          ? "إعادة تعيين كلمة السرّ ستكون متاحة قريبًا."
          : "La réinitialisation de mot de passe arrive bientôt."
      }
      breadcrumb={[ar ? "الحساب" : "Compte", ar ? "نسيت كلمة السرّ" : "Mot de passe oublié"]}
      relatedLinks={[
        { label: ar ? "تسجيل الدخول" : "Se connecter", href: "/sign-in" },
        { label: ar ? "إنشاء حساب" : "Créer un compte", href: "/sign-up" },
      ]}
    />
  );
}
