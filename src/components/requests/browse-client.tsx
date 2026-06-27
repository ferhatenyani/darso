"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Plus, FilePlus, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "./filter-bar";
import { RequestCard } from "./request-card";
import {
  getRequests,
  subscribeRequests,
} from "@/lib/mock/learning-requests-state";
import type { LearningRequest } from "@/lib/mock/requests";
import { sortRequests } from "./helpers";

// City key → matching city display string (FR uses accents)
const CITY_KEY_TO_LABEL: Record<string, { fr: string; ar: string }> = {
  alger: { fr: "Alger", ar: "الجزائر العاصمة" },
  oran: { fr: "Oran", ar: "وهران" },
  constantine: { fr: "Constantine", ar: "قسنطينة" },
  annaba: { fr: "Annaba", ar: "عنّابة" },
  blida: { fr: "Blida", ar: "البليدة" },
  setif: { fr: "Sétif", ar: "سطيف" },
  batna: { fr: "Batna", ar: "باتنة" },
  tlemcen: { fr: "Tlemcen", ar: "تلمسان" },
  tiziOuzou: { fr: "Tizi Ouzou", ar: "تيزي وزو" },
  bejaia: { fr: "Béjaïa", ar: "بجاية" },
};

export function RequestsBrowseClient() {
  const t = useTranslations("requests");
  const locale = useLocale();
  const sp = useSearchParams();

  const lang = locale === "ar" ? "ar" : "fr";

  // Subscribe to the in-session store so newly-published requests appear
  // without a refresh. The store seeds from `learningRequests` at first
  // read so the initial paint matches the previous static behavior.
  const allRequests = useSyncExternalStore(
    subscribeRequests,
    getRequests,
    getRequests,
  );

  const subjectKey = sp.get("subject") ?? "";
  const mode = sp.get("mode") ?? "";
  const urgency = sp.get("urgency") ?? "";
  const audience = sp.get("audience") ?? "";
  const cityKey = sp.get("city") ?? "";
  const budgetMax = Number(sp.get("budgetMax") ?? 5000);
  const sort = sp.get("sort") ?? "newest";

  const filtered = useMemo(() => {
    let list = [...allRequests];
    if (subjectKey) list = list.filter((r) => r.categoryKey === subjectKey);
    if (mode) list = list.filter((r) => r.mode === mode);
    if (urgency) list = list.filter((r) => r.urgency === urgency);
    if (audience) list = list.filter((r) => r.audience === audience);
    if (cityKey) {
      const tgt = CITY_KEY_TO_LABEL[cityKey];
      if (tgt) list = list.filter((r) => r.city[lang] === tgt[lang]);
    }
    if (budgetMax < 5000) list = list.filter((r) => r.budgetDzd.min <= budgetMax);
    return sortRequests(list, sort);
  }, [allRequests, subjectKey, mode, urgency, audience, cityKey, budgetMax, sort, lang]);

  const total = allRequests.length;
  const openCount = allRequests.filter((r) => r.status === "open").length;
  const spotlight = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* EDITORIAL HEADER — newspaper masthead vibe */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid-sm opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-px bg-border"
        />
        {/* Huge editorial mark */}
        <p
          aria-hidden
          className="pointer-events-none absolute -top-4 end-4 -z-10 select-none text-[120px] font-black leading-none tracking-tighter text-foreground/[0.03] md:text-[180px]"
        >
          {t("browse.mastheadGlyph")}
        </p>

        <div className="container-narrow grid gap-10 pt-10 pb-12 md:pt-14 md:pb-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {/* Masthead rule */}
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-accent" />
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-accent">
                {t("browse.eyebrow")}
              </p>
            </div>
            <h1 className="mt-5 text-balance text-[32px] font-bold leading-[0.95] tracking-tight text-foreground sm:text-[44px] md:text-[60px]">
              {t("browse.title")}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2">
              {t("browse.subtitle")}
            </p>

            {/* CTA + open count line */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/requests/new">
                  <Plus className="h-4 w-4" />
                  {t("browse.ctaPost")}
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-success/70 live-dot" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                {t("browse.ctaPostHint")}
              </span>
            </div>
          </div>

          {/* Right column — newspaper masthead metadata block */}
          <aside
            aria-label={t("browse.eyebrow")}
            className="lg:col-span-5 lg:border-s lg:border-border lg:ps-10"
          >
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 font-mono">
              <div>
                <dd className="text-4xl font-bold leading-none tracking-tight text-foreground tabular">
                  {String(openCount).padStart(2, "0")}
                </dd>
                <dt className="mt-1.5 text-[10.5px] uppercase tracking-wider text-ink-3">
                  {t("browse.openCount", { count: openCount })}
                </dt>
              </div>
              <div>
                <dd className="text-4xl font-bold leading-none tracking-tight text-foreground tabular">
                  {String(total).padStart(2, "0")}
                </dd>
                <dt className="mt-1.5 text-[10.5px] uppercase tracking-wider text-ink-3">
                  {t("browse.totalCount", { count: total })}
                </dt>
              </div>
            </dl>
            <p className="mt-6 max-w-sm border-s-2 border-accent ps-3 text-[12.5px] leading-relaxed text-ink-2">
              <span className="font-semibold text-foreground">
                {t("browse.footnote.label")}
              </span>{" "}
              {t("browse.footnote.body")}
            </p>
          </aside>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-border bg-surface/40">
        <div className="container-narrow py-5">
          <FilterBar matchedCount={filtered.length} />
        </div>
      </section>

      {/* LISTINGS */}
      <section className="container-narrow py-10 md:py-14">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Spotlight + index header */}
            <div className="grid gap-6 lg:grid-cols-12">
              {spotlight && (
                <div className="lg:col-span-8">
                  <FeaturedSpotlight index={0} request={spotlight} />
                </div>
              )}
              <div className="lg:col-span-4">
                <SidebarIndex requests={allRequests} />
              </div>
            </div>

            {/* Asymmetric flow grid */}
            {rest.length > 0 && (
              <div className="mt-8 grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {rest.map((r, idx) => {
                  // Pattern: wide every 5th, tall every 7th, otherwise narrow
                  const i = idx + 1; // since spotlight = 0
                  const variant: "wide" | "narrow" | "tall" =
                    i % 5 === 0
                      ? "wide"
                      : i % 7 === 0
                        ? "tall"
                        : "narrow";
                  const colSpan =
                    variant === "wide"
                      ? "lg:col-span-4 sm:col-span-2"
                      : variant === "tall"
                        ? "lg:col-span-2 lg:row-span-2"
                        : "lg:col-span-2";
                  return (
                    <div key={r.id} className={colSpan}>
                      <RequestCard request={r} index={i} variant={variant} />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function FeaturedSpotlight({
  request,
  index,
}: {
  request: LearningRequest;
  index: number;
}) {
  const t = useTranslations("requests");
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute -top-4 start-0 inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-background"
      >
        <Sparkles className="h-3 w-3" />
        {t("browse.ribbon.openLabel")}
      </span>
      <RequestCard request={request} index={index} variant="wide" />
    </div>
  );
}

function SidebarIndex({
  requests,
}: {
  requests: readonly LearningRequest[];
}) {
  const t = useTranslations("requests");
  const recent = [...requests]
    .filter((r) => r.status === "open")
    .sort((a, b) => a.postedAtHours - b.postedAtHours)
    .slice(0, 6);

  return (
    <aside className="sticky top-24 rounded-[var(--radius-lg)] border border-border bg-surface/60 p-5">
      <header className="flex items-center justify-between border-b border-border pb-3">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {t("browse.eyebrow")}
        </p>
        <span className="font-mono text-[10px] tabular text-ink-3">
          {t("browse.kicker")}
        </span>
      </header>
      <ol className="mt-2 divide-y divide-border">
        {recent.map((r, i) => (
          <RecentLine key={r.id} request={r} idx={i + 1} />
        ))}
      </ol>
      <div className="mt-3 border-t border-dashed border-border pt-3">
        <Link
          href="/requests/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-accent/40 bg-accent-soft/30 px-3 py-2.5 text-[12.5px] font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-soft/60"
        >
          <FilePlus className="h-3.5 w-3.5" />
          {t("browse.ctaPost")}
        </Link>
      </div>
    </aside>
  );
}

function RecentLine({
  request,
  idx,
}: {
  request: LearningRequest;
  idx: number;
}) {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  return (
    <li className="py-2.5">
      <Link
        href={`/requests/${request.slug}` as never}
        className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-3 outline-none"
      >
        <span className="font-mono text-[10px] font-semibold tracking-wider text-ink-3 tabular">
          {String(idx).padStart(2, "0")}
        </span>
        <span className="truncate text-[12.5px] font-medium text-foreground group-hover:text-accent">
          {request.title[lang]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 tabular">
          {request.postedAtHours < 24
            ? `${request.postedAtHours}h`
            : `${Math.floor(request.postedAtHours / 24)}d`}
        </span>
      </Link>
    </li>
  );
}

function EmptyState() {
  const t = useTranslations("requests");
  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40 p-10 text-center">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-3">
        404 · 000
      </p>
      <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-foreground">
        {t("browse.empty.title")}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
        {t("browse.empty.body")}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/requests/new">{t("browse.empty.primary")}</Link>
        </Button>
        <Button asChild variant="primary">
          <Link href="/requests/new">{t("browse.empty.secondary")}</Link>
        </Button>
      </div>
    </div>
  );
}
