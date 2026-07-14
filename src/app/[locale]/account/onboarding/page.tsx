import { setRequestLocale } from "next-intl/server";

import { OnboardingWizard } from "@/components/student/onboarding-wizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="bg-background">
      <OnboardingWizard />
    </div>
  );
}
