import * as React from "react";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { TeacherSidebar } from "@/components/teacher/sidebar";
import { TeacherTopBar, TeacherDesktopHeader } from "@/components/teacher/top-bar";
import { TeacherMobileBar } from "@/components/teacher/mobile-bar";
import { getCurrentUser } from "@/lib/auth/server";

export type ShellRole = "teacher" | "marketing";

/**
 * Legacy from-query-param picker. Kept exported so any straggling callsite
 * still typechecks, but the default is now to derive role from the auth
 * cookie via `getCurrentUser()` inside `DashboardShell` itself.
 *
 * @deprecated Pages should call `<DashboardShell>` with no `role` prop and
 * let it consult the auth context.
 */
export function pickShellRole(from: string | string[] | undefined): ShellRole {
  const value = Array.isArray(from) ? from[0] : from;
  return value === "teach" ? "teacher" : "marketing";
}

/**
 * Server component shell wrapper for the routes shared between the student
 * marketing surface and the teacher dashboard (`/messages`, `/disputes`,
 * `/notifications`, `/calendar`).
 *
 * Role is derived from the auth cookie. The optional `role` prop is an
 * override for pages that want to force one shell regardless of identity
 * (rare).
 */
export async function DashboardShell({
  role,
  children,
}: {
  role?: ShellRole;
  children: React.ReactNode;
}) {
  let resolvedRole: ShellRole = role ?? "marketing";
  if (!role) {
    const user = await getCurrentUser();
    resolvedRole = user?.role === "teacher" ? "teacher" : "marketing";
  }

  if (resolvedRole === "teacher") {
    return (
      <div className="flex min-h-dvh w-full flex-1 bg-background">
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
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
