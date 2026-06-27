import { setRequestLocale } from "next-intl/server";

import { TeacherSidebar } from "@/components/teacher/sidebar";
import { TeacherMobileBar, } from "@/components/teacher/mobile-bar";
import { TeacherTopBar, TeacherDesktopHeader } from "@/components/teacher/top-bar";

export default async function TeachLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
