import { setRequestLocale, getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { AnalyticsDashboard } from "@/components/teacher/analytics-dashboard";
import { getCurrentUser } from "@/lib/auth/server";
import { findTeacherById } from "@/lib/mock/teachers";
import { routes } from "@/lib/routes";
import type { AnalyticsPeriod } from "@/lib/mock/analytics-state";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ period?: string }>;
};

const VALID_PERIODS: AnalyticsPeriod[] = [7, 30, 90, 365];

function parsePeriod(raw: string | undefined): AnalyticsPeriod {
  const parsed = Number(raw);
  return (VALID_PERIODS as number[]).includes(parsed)
    ? (parsed as AnalyticsPeriod)
    : 30;
}

export default async function AgencyAnalyticsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Two-layer gate. First: must be a signed-in teacher. Second: must belong
  // to a studio (mirrors /teach/agency's gate). Solo teachers fall back to
  // their own analytics surface so the URL isn't a dead-end.
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") {
    redirect({ href: routes.teachLanding(), locale });
    return null;
  }

  const teacher = findTeacherById(user.teacherId);
  if (!teacher?.parentAgencyId) {
    redirect({ href: routes.teachAnalytics(), locale });
    return null;
  }

  const sp = (await searchParams) ?? {};
  const period = parsePeriod(sp.period);

  const t = await getTranslations("analytics");
  // Scope the seed to the agency itself so all members of the same studio
  // see the same aggregate figures (mirrors how a real backend would group).
  const accountId = `agency:${teacher.parentAgencyId}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <header className="mb-10">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          <span className="ink-rule" aria-hidden />
          {t("scopeAgency")}
        </p>
        <h1 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[44px] md:text-[56px]">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-[15px] text-ink-2">
          {t("subtitle")}
        </p>
      </header>

      <AnalyticsDashboard accountId={accountId} initialPeriod={period} scope="agency" />
    </div>
  );
}
