import { setRequestLocale } from "next-intl/server";

import { AuthStage } from "@/components/student/auth-stage";
import { SignInForm } from "@/components/student/sign-in-form";

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <SignInForm />
      <aside className="hidden lg:block">
        <AuthStage />
      </aside>
    </div>
  );
}
