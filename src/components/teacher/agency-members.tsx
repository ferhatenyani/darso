"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Sparkles, MoreHorizontal, Plus, UserMinus, PencilLine, Eye } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agencyMembers, type AgencyMember } from "@/lib/mock/agency";
import { formatPrice, cn } from "@/lib/utils";

export function AgencyMembersTable({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.agency.membersTable");
  const tSplit = useTranslations("teacher.agency.split");
  const [splits, setSplits] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(agencyMembers.map((m) => [m.id, m.splitPercent])),
  );

  const total = Object.values(splits).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
          <InviteDialog locale={locale} />
        </header>

        {/* Desktop table */}
        <div className="hidden grid-cols-[2.5fr_1.2fr_1.2fr_1.4fr_48px] gap-4 border-b border-border bg-surface/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3 md:grid">
          <span>{t("thead.member")}</span>
          <span>{t("thead.subject")}</span>
          <span className="text-end">{t("thead.revenue")}</span>
          <span>{t("thead.split")}</span>
          <span className="sr-only">{t("thead.actions")}</span>
        </div>
        <ul className="divide-y divide-border">
          {agencyMembers.map((m, i) => (
            <MemberRow
              key={m.id}
              m={m}
              i={i}
              locale={locale}
              split={splits[m.id] ?? m.splitPercent}
              onSplitChange={(v) => setSplits((s) => ({ ...s, [m.id]: v }))}
            />
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
        <header className="border-b border-border p-5">
          <h3 className="text-base font-semibold text-foreground">{tSplit("title")}</h3>
          <p className="mt-1 text-[12px] text-ink-3">{tSplit("subtitle")}</p>
        </header>
        <div className="p-5">
          <ul className="space-y-4">
            {agencyMembers.map((m) => (
              <li key={m.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={cn("text-[11px] text-primary-foreground", `bg-gradient-to-br ${m.accent}`)}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-medium text-foreground">{m.name[locale]}</span>
                </div>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={[splits[m.id] ?? m.splitPercent]}
                  onValueChange={(v) => setSplits((s) => ({ ...s, [m.id]: v[0] }))}
                  ariaLabel={tSplit("title")}
                  format={(n) => `${n}%`}
                />
                <span className="w-12 text-end font-mono text-[13px] font-semibold tabular text-foreground">
                  {splits[m.id] ?? m.splitPercent}%
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-3">{tSplit("total")}</span>
              <span
                className={cn(
                  "font-mono text-lg font-semibold tabular",
                  total === 100 ? "text-success" : "text-warning",
                )}
              >
                {total}%
              </span>
            </div>
            <Button variant="primary" size="sm" disabled={total !== 100}>
              {tSplit("save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberRow({
  m,
  i,
  locale,
  split,
  onSplitChange,
}: {
  m: AgencyMember;
  i: number;
  locale: "fr" | "ar";
  split: number;
  onSplitChange: (v: number) => void;
}) {
  const t = useTranslations("teacher.agency.membersTable");
  return (
    <li className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[2.5fr_1.2fr_1.2fr_1.4fr_48px] md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold tabular text-ink-3">
          {String(i + 1).padStart(2, "0")}
        </span>
        <Avatar className="h-10 w-10">
          <AvatarFallback className={cn("text-[13px] text-primary-foreground", `bg-gradient-to-br ${m.accent}`)}>
            {m.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-foreground">{m.name[locale]}</p>
          {m.topRated && (
            <Badge variant="warning" className="mt-1 h-[18px] gap-1 px-1.5 text-[10px] leading-3">
              <Sparkles className="h-2.5 w-2.5" aria-hidden />
              {locale === "ar" ? "الأفضل" : "Top Rated"}
            </Badge>
          )}
        </div>
      </div>
      <span className="text-[13px] text-ink-2">{m.subject[locale]}</span>
      <span className="text-end font-semibold tabular text-foreground">{formatPrice(m.monthRevenueDzd, locale)}</span>
      <div className="flex items-center gap-3">
        <span className="w-12 shrink-0 font-mono text-[13px] font-semibold tabular text-foreground">{split}%</span>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[split]}
          onValueChange={(v) => onSplitChange(v[0])}
          ariaLabel={t("thead.split")}
          format={(n) => `${n}%`}
          className="max-w-32"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("actions.editSplit")}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4" />
            {t("actions.viewProfile")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilLine className="h-4 w-4" />
            {t("actions.editSplit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger focus:text-danger">
            <UserMinus className="h-4 w-4" />
            {t("actions.remove")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

function InviteDialog({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.agency.invite");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4" />
          {locale === "ar" ? "ادعُ أستاذًا" : "Inviter un enseignant"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="inv-email">{t("email")}</Label>
            <Input id="inv-email" type="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-name">{t("name")}</Label>
            <Input id="inv-name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-subject">{t("subject")}</Label>
            <Input id="inv-subject" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-split">{t("splitDefault")}</Label>
            <Input id="inv-split" type="number" defaultValue={15} className="w-24" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">{t("cancel")}</Button>
          <Button variant="primary">{t("send")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
