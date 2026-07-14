"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, Sparkles } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LivePanel } from "@/components/marketing/live-panel";
import { featuredTeachers } from "@/lib/mock/teachers";
import { liveCount, startingInHour } from "@/lib/mock/sessions";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const [q, setQ] = useState("");

  const popular: string[] = t.raw("popularChips");
  const topRated = featuredTeachers.filter((x) => x.topRated).slice(0, 6);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}` as never);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Background composition: dotted grid, fading; a thin accent rule at top */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(80%_80%_at_50%_15%,black,transparent_85%)] opacity-70" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-accent/60" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 mx-auto h-[3px] w-28 translate-y-[-1px] bg-accent" />

      {/* Editorial background mark (very faint) */}
      <p
        aria-hidden
        className="pointer-events-none absolute -top-6 end-6 -z-10 select-none text-[140px] font-black leading-none tracking-tighter text-foreground/[0.035] md:text-[220px]"
      >
        DARSO
      </p>

      <div className="container-narrow grid gap-10 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-12 lg:gap-12 lg:pt-20 lg:pb-24">
        {/* LEFT — Editorial composition */}
        <div className="lg:col-span-7">
          {/* Now strip */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card py-1.5 ps-1.5 pe-4 shadow-e1">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-danger px-2.5 text-[11px] font-bold uppercase tracking-wider text-danger-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-danger-foreground/70 live-dot" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-danger-foreground" />
              </span>
              {t("nowLabel")}
            </span>
            <span className="text-[12.5px] font-medium text-ink-2">
              {t("nowDetail", { live: liveCount, soon: startingInHour })}
            </span>
          </div>

          {/* Editorial headline */}
          <h1 className="mt-7 text-[34px] font-bold leading-[0.96] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[64px] lg:text-[68px] xl:text-[78px]">
            <span className="block">{t("titleLead")}</span>
            <span className="block font-light italic text-ink-2 tracking-tight">
              {t("titleAccent")}
            </span>
            <span className="mt-2 block">
              <span className="relative inline-block">
                <span className="relative z-10">{t("titleTail")}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1.5 -z-0 h-[10px] bg-accent/35"
                />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-2 md:text-[16px]">
            {t("subtitle")}
          </p>

          {/* Search */}
          <form
            onSubmit={onSubmit}
            className="mt-8 flex items-center gap-2 rounded-[var(--radius-xl)] border border-border-strong bg-card p-1.5 shadow-e1 transition-shadow focus-within:shadow-e2 focus-within:border-accent max-w-2xl"
            aria-label={t("searchPlaceholder")}
          >
            <span className="ms-2 grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-11 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span className="hidden sm:inline">{t("searchHint")}</span>
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-primary-foreground/25 bg-primary-dark/30 px-1.5 text-[10px] font-semibold text-primary-foreground/90 tabular">
                {t("searchHintKey")}
              </kbd>
              <Search className="h-4 w-4 sm:hidden" />
              <span className="sm:hidden">{t("searchHintTail")}</span>
            </button>
          </form>

          {/* Popular chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {popular.map((p) => (
              <Link
                key={p}
                href={`/browse?q=${encodeURIComponent(p)}` as never}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink-2 transition-colors hover:border-accent hover:bg-accent-soft/40 hover:text-accent"
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Top-rated avatar row */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex flex-nowrap items-center -space-x-2 rtl:space-x-reverse">
              {topRated.map((tch, i) => {
                // Below `sm`, drop the trailing avatar so the row never
                // wraps to two lines on 360px viewports. The first five are
                // always visible; the sixth only appears from `sm` up.
                const isOverflow = i === topRated.length - 1 && topRated.length > 5;
                return (
                  <Avatar
                    key={tch.id}
                    className={cn(
                      "h-9 w-9 ring-2 ring-background",
                      isOverflow && "hidden sm:inline-flex",
                    )}
                  >
                    <AvatarFallback className={cn("bg-gradient-to-br text-xs text-white", tch.accent)}>
                      {tch.initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            <div className="flex items-baseline gap-2">
              <Sparkles className="h-4 w-4 text-warning" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-3">
                {t("topRatedLabel")}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Live marketplace panel */}
        <div className="lg:col-span-5">
          <LivePanel />
        </div>
      </div>
    </section>
  );
}
