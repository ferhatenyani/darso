"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star, Sparkles, Users, ShieldCheck, Wifi, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { featuredTeachers } from "@/lib/mock/teachers";
import { upcomingSessions } from "@/lib/mock/sessions";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Right-side "stage" of the auth screen. Shows real darso content — a live
 * session card, a request snippet, top-rated teachers. NOT a stock illustration.
 */
export function AuthStage() {
  const t = useTranslations("auth.shared");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const liveSession = upcomingSessions.find((s) => s.state === "soon") ?? upcomingSessions[0]!;
  const stars = featuredTeachers.slice(0, 4);

  return (
    <div
      aria-hidden="false"
      className="relative isolate h-full overflow-hidden bg-primary text-primary-foreground"
    >
      {/* Background composition — restrained: grid + one soft accent light. Never a rainbow gradient. */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.08]" />
      <div
        aria-hidden
        className="absolute -end-32 -top-32 h-80 w-80 rounded-full bg-accent/15 blur-[110px] float-slow"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -end-6 select-none text-[220px] font-black leading-none tracking-tighter text-white/[0.05]"
      >
        darso
      </span>

      <div className="relative flex h-full flex-col gap-8 p-8 md:p-12">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-danger px-2.5 text-[11px] font-bold uppercase tracking-wider text-danger-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-danger-foreground/70 live-dot" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-danger-foreground" />
            </span>
            {t("stageBadgeLive")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
            {t("stageEyebrow")}
          </span>
        </div>

        {/* Editorial headline */}
        <div className="max-w-md">
          <h2 className="text-[28px] font-bold leading-[1.05] tracking-tight md:text-[34px]">
            <span className="block">{t("stageHeadline")}</span>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-white/75">{t("stageBody")}</p>
        </div>

        {/* Live session card — uses real session data */}
        <div className="rounded-[var(--radius-xl)] border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {t("stageSessionEyebrow")}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              <Clock className="h-2.5 w-2.5" />
              42m
            </span>
          </div>
          <h3 className="mt-2 text-[15px] font-semibold leading-snug">{liveSession.title[lang]}</h3>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar className="h-7 w-7 ring-2 ring-white/15">
              <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", liveSession.teacher.accent)}>
                {liveSession.teacher.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium">{liveSession.teacher.name[lang]}</p>
              <p className="truncate text-[10.5px] text-white/55">
                {liveSession.teacher.city[lang]} · <Wifi className="inline h-2.5 w-2.5" />{" "}
                {locale === "ar" ? "بثّ مباشر" : "Live"}
              </p>
            </div>
            <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold tabular">
              {formatPrice(liveSession.priceDzd, locale)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10.5px] text-white/55 tabular">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {liveSession.capacity.taken}/{liveSession.capacity.total}
            </span>
            <span>{liveSession.startsAt[lang]}</span>
          </div>
        </div>

        {/* Request snippet card */}
        <div className="rounded-[var(--radius-xl)] border border-warning/30 bg-warning/[0.08] p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-warning/30 px-2 text-[10px] font-bold uppercase tracking-wider">
              {t("stageBadgeStudent")}
            </span>
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/55">
              {t("stageRequestEyebrow")}
            </p>
          </div>
          <h3 className="mt-1.5 text-[14px] font-semibold leading-snug">{t("stageRequestTitle")}</h3>
          <p className="mt-1 text-[11.5px] text-white/65">{t("stageRequestMeta")}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
              {stars.slice(0, 3).map((tch) => (
                <Avatar key={tch.id} className="h-6 w-6 ring-2 ring-primary-dark">
                  <AvatarFallback className={cn("bg-gradient-to-br text-[9px] text-white", tch.accent)}>
                    {tch.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-warning">
              {t("stageRequestApplicants", { count: 6 })}
            </p>
          </div>
        </div>

        {/* Trust promise strip — honest, no fake counters */}
        <div className="mt-auto space-y-3">
          <TrustLine icon={<ShieldCheck className="h-3.5 w-3.5" />}>
            Paiement retenu jusqu'à la fin du cours
          </TrustLine>
          <TrustLine icon={<Star className="h-3.5 w-3.5" />}>
            Enseignants vérifiés — identité et coordonnées validées
          </TrustLine>
          <TrustLine icon={<Sparkles className="h-3.5 w-3.5" />}>
            Support humain en français, sous 24 h
          </TrustLine>
        </div>
      </div>
    </div>
  );
}

function TrustLine({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[12.5px] text-white/75">
      <span aria-hidden className="grid h-6 w-6 place-items-center rounded-[var(--radius-xs)] bg-white/10 text-accent">
        {icon}
      </span>
      {children}
    </p>
  );
}
