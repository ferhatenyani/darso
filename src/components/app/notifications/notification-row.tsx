"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  CalendarClock,
  MessageSquare,
  Star,
  Bell,
  Wallet,
  Scale,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn, formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/toast";
import type { AppNotification, NotificationType } from "@/lib/mock/notifications";

const iconFor: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  booking: CalendarClock,
  message: MessageSquare,
  review: Star,
  system: Bell,
  billing: Wallet,
  dispute: Scale,
};

const accentFor: Record<NotificationType, { ring: string; tile: string; text: string; rule: string }> = {
  booking: { ring: "border-accent/30", tile: "bg-accent-soft/60 text-accent", text: "text-accent", rule: "bg-accent" },
  message: { ring: "border-info/30", tile: "bg-info/10 text-info", text: "text-info", rule: "bg-info" },
  review: { ring: "border-warning/40", tile: "bg-warning/15 text-[#7a5610]", text: "text-[#7a5610]", rule: "bg-warning" },
  system: { ring: "border-border-strong", tile: "bg-surface text-ink-2", text: "text-ink-2", rule: "bg-ink-3/50" },
  billing: { ring: "border-success/30", tile: "bg-success/10 text-success", text: "text-success", rule: "bg-success" },
  dispute: { ring: "border-danger/30", tile: "bg-danger/10 text-danger", text: "text-danger", rule: "bg-danger" },
};

export function NotificationRow({
  n,
  index,
  onMarkRead,
}: {
  n: AppNotification;
  index: number;
  onMarkRead?: (id: string) => void;
}) {
  const t = useTranslations("app.notifications");
  const tc = useTranslations("app.common");
  const tt = useTranslations("app.notifications.toasts");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Icon = iconFor[n.type];
  const accent = accentFor[n.type];
  const { show } = useToast();
  const typeLabel = t(`type.${n.type}`);

  return (
    <li
      className={cn(
        "group relative grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-border/70 px-4 py-4 sm:px-6 transition-colors",
        n.unread && "bg-surface/30",
      )}
    >
      {/* Accent rule on the start side */}
      {n.unread && (
        <span aria-hidden className={cn("absolute inset-y-0 start-0 w-[2px]", accent.rule)} />
      )}

      {/* Icon tile or teacher avatar */}
      {n.teacher ? (
        <div className="relative">
          <Avatar className="h-11 w-11">
            <AvatarFallback className={cn("bg-gradient-to-br text-white", n.teacher.accent)}>
              {n.teacher.initials}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-1 -end-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-background",
              accent.tile,
            )}
          >
            <Icon className="h-3 w-3" aria-hidden />
          </span>
        </div>
      ) : (
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-[var(--radius-md)] border",
            accent.ring,
            accent.tile,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}

      {/* Body */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3 tabular">
            {String(index + 1).padStart(2, "0")} · {t(`type.${n.type}`)}
          </span>
          {n.unread && <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
        </div>
        <p
          className={cn(
            "mt-1 text-pretty text-sm leading-snug",
            n.unread ? "font-semibold text-foreground" : "text-foreground",
          )}
        >
          {n.title[lang]}
          {n.amountDzd !== undefined && (
            <span className={cn("ms-2 font-mono text-xs tabular", accent.text)}>
              · {formatPrice(n.amountDzd, locale)}
            </span>
          )}
        </p>
        <p className="mt-1 text-pretty text-[13px] text-ink-2">{n.body[lang]}</p>
        <div className="mt-2 flex items-center gap-3">
          <Link
            href={n.href as never}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline",
              accent.text,
            )}
          >
            {n.hrefLabel[lang]}
            <Arrow className="h-3 w-3 rtl-flip" />
          </Link>
          <span className="text-[11px] text-ink-3 tabular">{relativeTime(n.at, lang, t)}</span>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("row.options")} title={t("row.options")}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {n.unread && (
            <DropdownMenuItem onSelect={() => onMarkRead?.(n.id)}>{t("row.markRead")}</DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() =>
              show({
                title: tt("muted.title"),
                description: tt("muted.desc", { type: typeLabel }),
                variant: "success",
              })
            }
          >
            {t("row.muteType")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

function relativeTime(iso: string, lang: "fr" | "ar", t: ReturnType<typeof useTranslations<"app.notifications">>) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("ago.now");
  if (mins < 60) return t("ago.minutes", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("ago.hours", { n: hours });
  return t("ago.days", { n: Math.floor(hours / 24) });
}
