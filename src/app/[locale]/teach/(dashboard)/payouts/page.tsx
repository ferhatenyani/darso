import { setRequestLocale, getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { SectionIndex } from "@/components/teacher/section-index";
import { PayoutMethodForm } from "@/components/teacher/payout-method-form";
import { PayoutScheduleCard } from "@/components/teacher/payout-schedule-card";
import { PayoutHistoryTable } from "@/components/teacher/payout-history-table";
import { getCurrentUser } from "@/lib/auth/server";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export default async function PayoutsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth gate — unauthenticated → sign-in (with return path), non-teacher
  // → /account. The (dashboard) group's layout already provides the teacher
  // chrome (sidebar / top-bar / mobile-bar), so we render section content
  // only here.
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: routes.signIn(routes.teachPayouts()), locale });
    return null;
  }
  if (user.role !== "teacher") {
    redirect({ href: routes.account(), locale });
    return null;
  }

  const t = await getTranslations("payouts");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {/* Editorial header — matches the subscription page convention */}
      <header className="mb-12 max-w-3xl">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          <span className="ink-rule" aria-hidden />
          {loc === "ar" ? "الخزينة" : "Trésorerie"}
        </p>
        <h1 className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] md:text-[52px]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-[15px] text-ink-2 sm:text-base">
          {t("subtitle")}
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {/* A. Bank / RIB management */}
        <section className="space-y-5">
          <SectionIndex
            num={t("method.indexNum")}
            label={t("method.title")}
            title={t("method.title")}
            description={t("method.subtitle")}
          />
          <PayoutMethodForm />
        </section>

        {/* B. Payout schedule */}
        <section className="space-y-5">
          <SectionIndex
            num={t("schedule.indexNum")}
            label={t("schedule.title")}
            title={t("schedule.title")}
            description={t("schedule.subtitle")}
          />
          <PayoutScheduleCard />
        </section>

        {/* C. Payout history */}
        <section className="space-y-5">
          <SectionIndex
            num={t("history.indexNum")}
            label={t("history.title")}
            title={t("history.title")}
            description={t("history.subtitle")}
          />
          <PayoutHistoryTable />
        </section>
      </div>
    </div>
  );
}
