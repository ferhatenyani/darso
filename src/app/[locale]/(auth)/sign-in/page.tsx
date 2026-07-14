import { setRequestLocale } from "next-intl/server";

import { AuthStage } from "@/components/student/auth-stage";
import { SignInForm } from "@/components/student/sign-in-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <SignInForm next={typeof next === "string" ? next : undefined} />
      <aside className="hidden lg:block">
        <AuthStage />
      </aside>
    </div>
  );
}
