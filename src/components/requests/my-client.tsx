"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeft,
  Edit3,
  Eye,
  FilePlus,
  MoreHorizontal,
  Share2,
  Trash2,
  X as XIcon,
  RotateCcw,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getRequestsByOwner,
  type LearningRequest,
  type RequestStatus,
  currentMockUser,
} from "@/lib/mock/requests";
import { cn, formatPrice } from "@/lib/utils";
import { formatPostedAt, statusVariant, urgencyStripClass } from "./helpers";

const TAB_KEYS: ("all" | RequestStatus)[] = [
  "all",
  "open",
  "negotiating",
  "awarded",
  "closed",
];

export function MyRequestsClient() {
  const t = useTranslations("requests");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const owned = useMemo(() => getRequestsByOwner(), []);

  // Bucket counts
  const counts = useMemo(() => {
    const c = { all: owned.length, open: 0, negotiating: 0, awarded: 0, closed: 0 };
    owned.forEach((r) => {
      c[r.status] += 1;
    });
    return c;
  }, [owned]);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-background">
        <div className="container-narrow grid gap-8 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-accent" />
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-accent">
                {t("my.eyebrow")}
              </p>
            </div>
            <h1 className="mt-5 text-balance text-[36px] font-bold leading-[1] tracking-tight text-foreground md:text-[48px]">
              {t("my.title")}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-[14.5px] leading-relaxed text-ink-2">
              {t("my.subtitle")}
            </p>
          </div>

          <div className="md:col-span-5 md:flex md:items-end md:justify-end">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 shadow-e1">
                  <AvatarFallback
                    className={cn(
                      "bg-gradient-to-br text-sm text-white",
                      currentMockUser.accent,
                    )}
                  >
                    {currentMockUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">
                    {currentMockUser.name[lang]}
                  </p>
                  <p className="font-mono text-[11px] text-ink-3">
                    {currentMockUser.city[lang]} · {currentMockUser.joinedYear}
                  </p>
                </div>
              </div>
              <Button asChild variant="primary" size="md" className="mt-4 w-full">
                <Link href="/requests/new">
                  <FilePlus className="h-4 w-4" />
                  {t("my.newRequest")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + list */}
      <section className="container-narrow py-10 md:py-14">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex h-auto flex-wrap items-center justify-start gap-1 rounded-[var(--radius-md)] bg-surface/60 p-1">
            {TAB_KEYS.map((k) => (
              <TabsTrigger
                key={k}
                value={k}
                className="px-3 font-mono text-[11px] uppercase tracking-wider"
              >
                {t(`my.tabs.${k}`, { count: counts[k] })}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_KEYS.map((k) => {
            const filtered =
              k === "all" ? owned : owned.filter((r) => r.status === k);
            return (
              <TabsContent key={k} value={k}>
                {filtered.length === 0 ? (
                  <MyEmpty kind={owned.length === 0 ? "all" : "filtered"} />
                ) : (
                  <ul className="mt-6 space-y-3">
                    {filtered.map((r, i) => (
                      <li key={r.id}>
                        <MyRequestRow request={r} index={i + 1} Arrow={Arrow} />
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>
    </>
  );
}

function MyRequestRow({
  request,
  index,
  Arrow,
}: {
  request: LearningRequest;
  index: number;
  Arrow: typeof ArrowRight;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  return (
    <article className="group relative isolate overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-colors hover:border-accent/40">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 start-0 w-1",
          urgencyStripClass(request.urgency),
        )}
      />
      <div className="grid items-center gap-4 p-5 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-6 ps-6">
        {/* Index + status pill */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-center">
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-ink-3">
              {t("my.card.indexLabel")}
            </p>
            <p className="text-[18px] font-bold leading-none text-foreground tabular">
              {String(index).padStart(2, "0")}
            </p>
          </div>
          <Badge variant={statusVariant(request.status)}>
            {t(`shared.status.${request.status}`)}
          </Badge>
        </div>

        {/* Title + meta */}
        <div className="min-w-0">
          <Link
            href={`/requests/${request.slug}` as never}
            className="text-[15.5px] font-semibold text-foreground transition-colors hover:text-accent line-clamp-2"
          >
            {request.title[lang]}
          </Link>
          <p className="mt-1 font-mono text-[11px] text-ink-3">
            {request.subject[lang]} · {request.city[lang]} ·{" "}
            {t(
              request.mode === "online"
                ? "shared.modes.online"
                : request.mode === "in-person"
                  ? "shared.modes.inPerson"
                  : "shared.modes.both",
            )}
          </p>
        </div>

        {/* Apps + budget */}
        <div className="hidden text-end sm:block">
          <p className="text-[12.5px] font-medium text-foreground">
            {t("my.card.applicationCount", { count: request.applicationCount })}
          </p>
          <p className="font-mono text-[10.5px] text-ink-3">
            {t("my.card.lastActivity")} ·{" "}
            {request.applications.length > 0
              ? formatPostedAt(
                  Math.min(...request.applications.map((a) => a.createdAtHours)),
                  t,
                )
              : t("my.card.noActivity")}
          </p>
          <p className="mt-1 font-mono text-[11.5px] tabular text-foreground">
            {formatPrice(request.budgetDzd.min, locale)}
            <span className="px-1 text-ink-3">–</span>
            {formatPrice(request.budgetDzd.max, locale)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={`/requests/${request.slug}` as never}>
              {t("my.card.openDetail")}
              <Arrow className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={t("my.actions.label")}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuLabel>{t("my.actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/requests/${request.slug}` as never}>
                  <Eye className="h-4 w-4" />
                  {t("my.actions.view")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit3 className="h-4 w-4" />
                {t("my.actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4" />
                {t("my.actions.share")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {request.status === "closed" ? (
                <DropdownMenuItem>
                  <RotateCcw className="h-4 w-4" />
                  {t("my.actions.reopen")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <XIcon className="h-4 w-4" />
                  {t("my.actions.close")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-danger focus:text-danger">
                <Trash2 className="h-4 w-4" />
                {t("my.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}

function MyEmpty({ kind }: { kind: "all" | "filtered" }) {
  const t = useTranslations("requests");
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40 p-10 text-center">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-3">
        000 · 000
      </p>
      <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-foreground">
        {t(`my.empty.${kind}.title`)}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
        {t(`my.empty.${kind}.body`)}
      </p>
      <Button asChild variant="primary" className="mt-6">
        <Link href="/requests/new">
          <FilePlus className="h-4 w-4" />
          {t("my.empty.primary")}
        </Link>
      </Button>
    </div>
  );
}
