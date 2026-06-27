"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Sparkles, MoreHorizontal, Plus, UserMinus, PencilLine, Eye } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
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
import { useToast } from "@/lib/toast";
import { formatPrice, cn } from "@/lib/utils";

// AgencyMember has no `slug`. Map known member ids to the teacher-catalog
// slug so "View profile" navigates somewhere meaningful for the demo.
const MEMBER_TO_TEACHER_SLUG: Record<string, string> = {
  "m-khalil": "khalil-bensaid",
  "m-yasmine": "yasmine-haddad",
  "m-imene": "imene-laribi",
  "m-amine": "amine-cherif",
  "m-rayan": "rayan-otmani",
};

type PendingInvite = {
  id: string;
  email: string;
  name: string;
  subject: string;
};

export function AgencyMembersTable({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.agency.membersTable");
  const tSplit = useTranslations("teacher.agency.split");
  const tAgency = useTranslations("teacher.agency");
  const tt = useTranslations("teacher.agency.toasts");
  const { show } = useToast();

  const [members, setMembers] = React.useState<AgencyMember[]>(agencyMembers);
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [splits, setSplits] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(agencyMembers.map((m) => [m.id, m.splitPercent])),
  );
  const splitPanelRef = React.useRef<HTMLDivElement>(null);

  const total = members.reduce((sum, m) => sum + (splits[m.id] ?? m.splitPercent), 0);

  const removeMember = (m: AgencyMember) => {
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
    setSplits((prev) => {
      const next = { ...prev };
      delete next[m.id];
      return next;
    });
    show({
      title: tt("memberRemoved.title"),
      description: tt("memberRemoved.desc", { name: m.name[locale] }),
      variant: "warning",
    });
  };

  const focusSplitEditor = () => {
    splitPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    show({
      title: tt("editingSplit.title"),
      description: tt("editingSplit.desc"),
      variant: "default",
    });
  };

  const saveSplits = () => {
    // Persist into the members array (in-session mutation).
    setMembers((prev) => prev.map((m) => ({ ...m, splitPercent: splits[m.id] ?? m.splitPercent })));
    show({
      title: tt("splitSaved.title"),
      description: tt("splitSaved.desc"),
      variant: "success",
    });
  };

  const sendInvite = (invite: PendingInvite) => {
    setInvites((prev) => [...prev, invite]);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
          <InviteDialog locale={locale} onSend={sendInvite} />
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
          {members.map((m, i) => (
            <MemberRow
              key={m.id}
              m={m}
              i={i}
              locale={locale}
              split={splits[m.id] ?? m.splitPercent}
              onSplitChange={(v) => setSplits((s) => ({ ...s, [m.id]: v }))}
              onRemove={() => removeMember(m)}
              onEditSplit={focusSplitEditor}
            />
          ))}

          {/* Pending invites — rendered as ghost rows */}
          {invites.map((inv, i) => (
            <li
              key={inv.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[2.5fr_1.2fr_1.2fr_1.4fr_48px] md:items-center md:gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-semibold tabular text-ink-3">
                  {String(members.length + i + 1).padStart(2, "0")}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-surface text-[13px] text-ink-2">
                    {(inv.name || inv.email).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-foreground">{inv.name || inv.email}</p>
                  <Badge variant="warning" className="mt-1 h-[18px] gap-1 px-1.5 text-[10px] leading-3">
                    {tAgency("pendingBadge")}
                  </Badge>
                </div>
              </div>
              <span className="text-[13px] text-ink-3">{inv.subject || "—"}</span>
              <span className="text-end text-ink-3">—</span>
              <span className="text-[12px] text-ink-3">{inv.email}</span>
              <span />
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={splitPanelRef}
        className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card"
      >
        <header className="border-b border-border p-5">
          <h3 className="text-base font-semibold text-foreground">{tSplit("title")}</h3>
          <p className="mt-1 text-[12px] text-ink-3">{tSplit("subtitle")}</p>
        </header>
        <div className="p-5">
          <ul className="space-y-4">
            {members.map((m) => (
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
            <Button variant="primary" size="sm" disabled={total !== 100} onClick={saveSplits}>
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
  onRemove,
  onEditSplit,
}: {
  m: AgencyMember;
  i: number;
  locale: "fr" | "ar";
  split: number;
  onSplitChange: (v: number) => void;
  onRemove: () => void;
  onEditSplit: () => void;
}) {
  const t = useTranslations("teacher.agency.membersTable");
  const router = useRouter();
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
          <DropdownMenuItem
            onSelect={() => {
              const slug = MEMBER_TO_TEACHER_SLUG[m.id] ?? "khalil-bensaid";
              router.push(`/teachers/${slug}`);
            }}
          >
            <Eye className="h-4 w-4" />
            {t("actions.viewProfile")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onEditSplit}>
            <PencilLine className="h-4 w-4" />
            {t("actions.editSplit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger focus:text-danger" onSelect={onRemove}>
            <UserMinus className="h-4 w-4" />
            {t("actions.remove")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function InviteDialog({
  locale,
  onSend,
}: {
  locale: "fr" | "ar";
  onSend: (invite: PendingInvite) => void;
}) {
  const t = useTranslations("teacher.agency.invite");
  const tt = useTranslations("teacher.agency.toasts");
  const { show } = useToast();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [subject, setSubject] = React.useState("");

  const reset = () => {
    setEmail("");
    setName("");
    setSubject("");
  };

  const handleSend = () => {
    if (!isValidEmail(email)) {
      show({
        title: tt("inviteInvalid.title"),
        description: tt("inviteInvalid.desc"),
        variant: "warning",
      });
      return;
    }
    onSend({
      id: `inv-${Date.now().toString(36)}`,
      email: email.trim(),
      name: name.trim(),
      subject: subject.trim(),
    });
    show({
      title: tt("invitePending.title"),
      description: tt("invitePending.desc", { email: email.trim() }),
      variant: "success",
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
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
            <Input
              id="inv-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-name">{t("name")}</Label>
            <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-subject">{t("subject")}</Label>
            <Input id="inv-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="inv-split">{t("splitDefault")}</Label>
            <Input id="inv-split" type="number" defaultValue={15} className="w-24" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); setOpen(false); }}>{t("cancel")}</Button>
          <Button variant="primary" onClick={handleSend}>{t("send")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
