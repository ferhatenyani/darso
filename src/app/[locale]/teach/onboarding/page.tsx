import { setRequestLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { routes } from "@/lib/routes";
import { TeacherOnboardingWizard } from "@/components/teacher/onboarding-wizard";

/**
 * Teacher KYC / activation wizard. Lives OUTSIDE the `(dashboard)` route
 * group on purpose: onboarding is a full-bleed focused flow without the
 * dashboard sidebar / mobile bar / top bar. The wizard itself paints its
 * own minimal chrome (logo + step indicator + skip).
 *
 * Gating:
 *   - Anonymous visitors → /sign-in (the wizard needs an account to write
 *     to the payouts store).
 *   - Students who land here by accident → /account/onboarding (the
 *     student-shaped flow).
 *   - Authenticated teachers → render the wizard.
 */
export default async function TeacherOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: routes.signIn(), locale });
  } else if (user.role !== "teacher") {
    redirect({ href: routes.accountOnboarding(), locale });
  }

  return <TeacherOnboardingWizard />;
}
