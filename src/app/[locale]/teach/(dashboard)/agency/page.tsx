import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Inbox, Sparkles } from "lucide-react";

import { Link, redirect } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { AgencyProfileEditor } from "@/components/teacher/agency-profile";
import { AgencyMembersTable } from "@/components/teacher/agency-members";
import { agency, agencyInboxThreads, agencyMembers } from "@/lib/mock/agency";
import { getCurrentUser } from "@/lib/auth/server";
import { findTeacherById } from "@/lib/mock/teachers";
import { formatPrice, cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export default async function AgencyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Agency RIP guard: only teachers whose record carries a `parentAgencyId`
  // (i.e. who actually belong to a studio) can reach this surface. Anyone
  // else — solo teachers, anonymous previewers — is redirected back to the
  // teacher dashboard so they never see the misleading "studio" surface.
  const user = await getCurrentUser();
  const teacher = findTeacherById(user?.teacherId);
  if (!teacher?.parentAgencyId) {
    redirect({ href: "/teach/dashboard", locale });
  }

  const t = await getTranslations("teacher.agency");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {/* Editorial header */}
      <header className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <span className="ink-rule" aria-hidden />
            {loc === "ar" ? "وكالتك" : "Votre studio"}
          </p>
          <h1 className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[56px]">
            {agency.name[loc]}
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-[15px] text-ink-2">{t("subtitle")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] tabular text-ink-3">
            <Badge variant="primary">{t("members", { count: agency.memberCount })}</Badge>
            <span>·</span>
            <span>{t("founded", { months: agency.joinedMonthsAgo })}</span>
          </div>
        </div>

        <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            {t("totalMonth")}
          </p>
          <p className="mt-2 text-4xl font-semibold tabular tracking-tight text-foreground">
            {formatPrice(agency.totalRevenueDzd, locale)}
          </p>
          <div className="mt-4 flex -space-x-2 rtl:space-x-reverse rtl:-space-x-2">
            {agencyMembers.slice(0, 5).map((m) => (
              <Avatar key={m.id} className="h-7 w-7 ring-2 ring-card">
                <AvatarFallback className={cn("text-[10px] text-primary-foreground", `bg-gradient-to-br ${m.accent}`)}>
                  {m.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Profile editor */}
        <section className="lg:col-span-5">
          <SectionIndex num="01" label={t("title")} title={t("profile.title")} />
          <div className="mt-5">
            <AgencyProfileEditor locale={loc} />
          </div>
        </section>

        {/* Joint inbox */}
        <section className="lg:col-span-7">
          <SectionIndex
            num="02"
            label={t("title")}
            title={t("inbox.title")}
            description={t("inbox.subtitle")}
          />
          <div className="mt-5 space-y-3">
            {agencyInboxThreads.map((th) => (
              <article
                key={th.id}
                className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Inbox className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {th.unread && <Badge variant="accent">{t("inbox.unread")}</Badge>}
                    <h4 className="truncate text-[14px] font-semibold text-foreground">{th.subject[loc]}</h4>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] text-ink-2">{th.preview[loc]}</p>
                  <p className="mt-1 text-[11px] tabular text-ink-3">
                    {t("inbox.participants", { count: th.participantsCount })} · {th.ago[loc]}
                  </p>
                </div>
              </article>
            ))}
            <Link
              href="/messages"
              className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-dashed border-border bg-card px-4 py-3 text-[13px] font-medium text-ink-2 hover:bg-surface"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                {t("inbox.openInMessages")}
              </span>
              <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Members table */}
        <section className="lg:col-span-12">
          <SectionIndex
            num="03"
            label={t("title")}
            title={t("membersTable.title")}
            description={t("membersTable.subtitle")}
          />
          <div className="mt-5">
            <AgencyMembersTable locale={loc} />
          </div>
        </section>
      </div>
    </div>
  );
}
