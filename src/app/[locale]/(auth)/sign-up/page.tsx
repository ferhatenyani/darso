import { setRequestLocale } from "next-intl/server";

import { AuthStage } from "@/components/student/auth-stage";
import { SignUpForm } from "@/components/student/sign-up-form";

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <SignUpForm />
      <aside className="hidden lg:block">
        <AuthStage />
      </aside>
    </div>
  );
}
