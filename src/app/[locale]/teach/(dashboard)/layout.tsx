import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { routes } from "@/lib/routes";
import { TeacherSidebar } from "@/components/teacher/sidebar";
import { TeacherMobileBar, } from "@/components/teacher/mobile-bar";
import { TeacherTopBar, TeacherDesktopHeader } from "@/components/teacher/top-bar";

/**
 * Cookie set by the teacher onboarding wizard once KYC is complete.
 * Mirrors the student equivalent (`darso_onboarding_complete`).
 */
const TEACHER_ONBOARDING_COOKIE = "darso_teacher_onboarding_complete";

export default async function TeachLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Onboarding gate: signed-in teachers who haven't completed KYC are
  // bounced to /teach/onboarding. The onboarding route lives OUTSIDE this
  // `(dashboard)` group, so it never re-enters this layout — no risk of a
  // redirect loop. Anonymous visitors and students are left alone here
  // (sub-pages enforce their own auth shape).
  const user = await getCurrentUser();
  if (user?.role === "teacher") {
    const store = await cookies();
    const completed = store.get(TEACHER_ONBOARDING_COOKIE)?.value === "1";
    if (!completed) {
      redirect({ href: routes.teachOnboarding(), locale });
    }
  }

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-[260px] lg:shrink-0">
        <div className="fixed inset-y-0 start-0 w-[260px]">
          <TeacherSidebar />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherTopBar />
        <TeacherDesktopHeader />
        <main className="flex-1 pb-[88px] lg:pb-0">{children}</main>
      </div>

      <TeacherMobileBar />
    </div>
  );
}
