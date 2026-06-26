"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  User as UserIcon,
  Settings,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Camera,
  Bell,
  LogOut,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileInput } from "@/components/ui/file-input";
import { wilayaKeys } from "@/lib/mock/categories";
import { cn, formatPrice } from "@/lib/utils";

type Section = "profile" | "preferences" | "payments" | "security" | "danger";

export function AccountShell() {
  const t = useTranslations("student.account");
  const tCommon = useTranslations("student.common");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [section, setSection] = useState<Section>("profile");

  const navItems: { key: Section; label: string; icon: ReactNode }[] = [
    { key: "profile", label: t("navProfile"), icon: <UserIcon className="h-4 w-4" /> },
    { key: "preferences", label: t("navPreferences"), icon: <Settings className="h-4 w-4" /> },
    { key: "payments", label: t("navPayments"), icon: <CreditCard className="h-4 w-4" /> },
    { key: "security", label: t("navSecurity"), icon: <Shield className="h-4 w-4" /> },
    { key: "danger", label: t("navDanger"), icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Header strip */}
      <section className="relative isolate border-b border-border bg-background">
        <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(70%_60%_at_30%_0%,black,transparent_80%)]" />
        <div className="container-narrow py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
          <div className="mt-3 flex flex-wrap items-end gap-6">
            <Avatar className="h-16 w-16 shadow-e1">
              <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-lg text-white">
                LM
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-[32px] font-bold leading-[1.02] tracking-tight text-foreground md:text-[40px]">
                Lina M.
              </h1>
              <p className="mt-1.5 text-[13px] text-ink-2">
                {t("memberSince", { date: t("memberSinceValue") })}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                {t("verifiedLine")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-narrow grid gap-8 py-10 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Sidebar nav */}
          <nav aria-label={t("title")}>
            <ul className="grid gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-2">
              {navItems.map((it) => (
                <li key={it.key}>
                  <button
                    type="button"
                    onClick={() => setSection(it.key)}
                    aria-current={section === it.key ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5 text-[13.5px] text-ink-2 transition-colors",
                      section === it.key
                        ? "bg-surface text-foreground font-semibold"
                        : "hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <span className={cn("text-ink-3", section === it.key && "text-accent")}>{it.icon}</span>
                    <span className="flex-1 text-start">{it.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
            <Separator className="my-5" />
            <Button variant="ghost" size="md" className="w-full justify-start text-ink-2">
              <LogOut className="h-4 w-4" />
              <span className="ms-1">{tCommon("back")}</span>
              <Arrow className="ms-auto h-4 w-4" />
            </Button>
          </nav>

          {/* Section content */}
          <div>
            {section === "profile" && <ProfileSection />}
            {section === "preferences" && <PreferencesSection />}
            {section === "payments" && <PaymentsSection />}
            {section === "security" && <SecuritySection />}
            {section === "danger" && <DangerSection />}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
 * Section: Profile
 * ============================================================ */
function ProfileSection() {
  const t = useTranslations("student.account.profile");
  const tWilayas = useTranslations("search.wilayas");
  const [bio, setBio] = useState(
    "Bachelière à Constantine, je prépare IELTS pour mes études en Europe. Disponible en soirée.",
  );
  const [avatar, setAvatar] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);

  return (
    <article className="grid gap-8">
      <header className="border-b border-border pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-2">{t("subtitle")}</p>
      </header>

      <form
        className="grid gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2200);
        }}
      >
        <div className="grid gap-3">
          <Label>{t("avatarLabel")}</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shadow-e1">
              <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-lg text-white">
                LM
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-1.5">
              <FileInput
                accept="image/png,image/jpeg"
                value={avatar}
                onValueChange={setAvatar}
                label={t("avatarChange")}
                hint={t("avatarHint")}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input id="fullName" autoComplete="name" defaultValue="Lina Mokhtar" placeholder={t("fullNamePlaceholder")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="displayName">{t("displayName")}</Label>
            <Input id="displayName" defaultValue="Lina M." />
            <p className="text-[11.5px] text-ink-3">{t("displayNameHint")}</p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">{t("bio")}</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={280}
            placeholder={t("bioPlaceholder")}
          />
          <p className="text-[11.5px] text-ink-3 tabular">
            {bio.length} / 280 · {t("bioHint")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="wilaya">{t("wilaya")}</Label>
            <Select defaultValue="constantine">
              <SelectTrigger id="wilaya">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wilayaKeys.map((w) => (
                  <SelectItem key={w} value={w}>
                    {tWilayas(w as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" dir="ltr" inputMode="tel" defaultValue="+213 555 11 22 33" placeholder={t("phonePlaceholder")} />
            <p className="text-[11.5px] text-ink-3">{t("phoneHint")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Button type="submit" size="md">
            {t("save")}
          </Button>
          <Button type="button" variant="ghost" size="md">
            {t("discard")}
          </Button>
          {saved && (
            <span className="ms-auto inline-flex items-center gap-1.5 text-[12.5px] text-success">
              <CheckCircle2 className="h-4 w-4" />
              {t("saved")}
            </span>
          )}
        </div>
      </form>
    </article>
  );
}

/* ============================================================
 * Section: Preferences
 * ============================================================ */
function PreferencesSection() {
  const t = useTranslations("student.account.preferences");
  const [emailDigest, setEmailDigest] = useState(true);
  const [sms, setSms] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);

  return (
    <article className="grid gap-8">
      <header className="border-b border-border pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-2">{t("subtitle")}</p>
      </header>

      <section className="grid gap-3">
        <Label>{t("teachingLanguage")}</Label>
        <RadioGroup defaultValue="fr" className="grid gap-2 md:grid-cols-2">
          {([
            ["ar", t("langArabic")],
            ["fr", t("langFrench")],
            ["en", t("langEnglish")],
            ["any", t("langAny")],
          ] as const).map(([v, label]) => (
            <Label
              key={v}
              htmlFor={`tl-${v}`}
              className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3 hover:border-border-strong"
            >
              <RadioGroupItem id={`tl-${v}`} value={v} />
              <span className="text-[13.5px] font-medium text-foreground">{label}</span>
            </Label>
          ))}
        </RadioGroup>
      </section>

      <section className="grid gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-semibold text-foreground">{t("currency")}</p>
            <p className="text-[12px] text-ink-3">{t("currencyHint")}</p>
          </div>
          <span className="rounded-[var(--radius-sm)] bg-surface px-2.5 py-1 text-[12px] font-semibold tabular text-foreground">
            {formatPrice(1500, "fr").replace(/\d/g, "").trim()} DZD
          </span>
        </div>
      </section>

      <section className="grid gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{t("notifications")}</p>
        <ul className="grid divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-card">
          <NotifRow icon={<Bell className="h-4 w-4" />} title={t("notifEmailDigest")} body={t("notifEmailDigestHint")} checked={emailDigest} onChange={setEmailDigest} />
          <NotifRow icon={<Bell className="h-4 w-4" />} title={t("notifSMS")} body={t("notifSMSHint")} checked={sms} onChange={setSms} />
          <NotifRow icon={<Bell className="h-4 w-4" />} title={t("notifWhatsapp")} body={t("notifWhatsappHint")} checked={whatsapp} onChange={setWhatsapp} />
        </ul>
      </section>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button size="md">{t("save")}</Button>
      </div>
    </article>
  );
}

function NotifRow({
  icon,
  title,
  body,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-start gap-3 p-4">
      <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[12px] text-ink-3">{body}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </li>
  );
}

/* ============================================================
 * Section: Payments
 * ============================================================ */
function PaymentsSection() {
  const t = useTranslations("student.account.payments");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const history = [
    { id: "h-1", date: "12 sept 2025", item: lang === "ar" ? "رياضيات الباك · النهايات" : "Math Bac · Limites", amount: 4500, status: "Paid" as const },
    { id: "h-2", date: "05 sept 2025", item: lang === "ar" ? "IELTS التحدّث · ورشة" : "IELTS Speaking · workshop", amount: 1800, status: "Refunded" as const },
    { id: "h-3", date: "28 aout 2025", item: lang === "ar" ? "React من الصفر" : "React from scratch · cohort", amount: 9800, status: "Paid" as const },
  ];

  return (
    <article className="grid gap-8">
      <header className="border-b border-border pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-2">{t("subtitle")}</p>
      </header>

      <section className="grid gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{t("methodsLabel")}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {[t("methodEdahabia"), t("methodCib"), t("methodPostalMandate"), t("methodBaridiMob")].map((m, i) => (
            <div key={m} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3">
              <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2">
                <CreditCard className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold text-foreground">{m}</p>
                <p className="text-[11px] text-ink-3 tabular">№ {String(i + 1).padStart(2, "0")}</p>
              </div>
              {i === 0 && <Badge variant="success">●</Badge>}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-fit">
          + {t("addMethod")}
        </Button>
      </section>

      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{t("historyLabel")}</p>
        <div className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <div className="hidden md:grid grid-cols-[120px_1fr_120px_100px_100px] gap-2 border-b border-border bg-surface/40 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <span>{t("historyDate")}</span>
            <span>{t("historyItem")}</span>
            <span className="text-end">{t("historyAmount")}</span>
            <span>{t("historyStatus")}</span>
            <span className="text-end">{t("invoiceLabel")}</span>
          </div>
          <ul className="divide-y divide-border bg-card">
            {history.map((h) => (
              <li
                key={h.id}
                className="grid grid-cols-2 gap-2 px-4 py-3 text-[13px] md:grid-cols-[120px_1fr_120px_100px_100px]"
              >
                <span className="text-ink-3 tabular">{h.date}</span>
                <span className="font-medium text-foreground">{h.item}</span>
                <span className="text-end font-semibold tabular text-foreground">
                  {formatPrice(h.amount, locale)}
                </span>
                <span>
                  <Badge variant={h.status === "Paid" ? "success" : "warning"}>
                    {h.status === "Paid" ? t("statusPaid") : t("statusRefunded")}
                  </Badge>
                </span>
                <span className="text-end">
                  <Button variant="ghost" size="sm">
                    <Download className="h-3.5 w-3.5" />
                    {t("downloadInvoice")}
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="flex items-start gap-1.5 rounded-[var(--radius-md)] border border-success/30 bg-success/10 p-3 text-[12px] text-success">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5" />
        {t("secureNote")}
      </p>
    </article>
  );
}

/* ============================================================
 * Section: Security
 * ============================================================ */
function SecuritySection() {
  const t = useTranslations("student.account.security");
  const [twoFa, setTwoFa] = useState(false);

  return (
    <article className="grid gap-8">
      <header className="border-b border-border pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-2">{t("subtitle")}</p>
      </header>

      {/* Password card */}
      <section className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
          <Shield className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-foreground">{t("password")}</p>
          <p className="text-[11.5px] text-ink-3">{t("passwordHint")}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">{t("changePassword")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDesc")}</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cur">{t("currentPassword")}</Label>
                <Input id="cur" type="password" autoComplete="current-password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nv">{t("newPassword")}</Label>
                <Input id="nv" type="password" autoComplete="new-password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cf">{t("confirmPassword")}</Label>
                <Input id="cf" type="password" autoComplete="new-password" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="ghost" size="md">{t("dialogCancel")}</Button>
              <Button size="md">{t("dialogSubmit")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* 2FA */}
      <section className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
          <Shield className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-foreground">{t("twoFa")}</p>
          <p className="text-[11.5px] text-ink-3">{t("twoFaHint")}</p>
        </div>
        <Switch checked={twoFa} onCheckedChange={setTwoFa} aria-label={t("twoFa")} />
      </section>

      {/* Sessions */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <p className="text-[13.5px] font-semibold text-foreground">{t("sessions")}</p>
        <ul className="mt-3 grid gap-2">
          <li className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface/60 p-3 text-[13px]">
            <div>
              <p className="font-semibold text-foreground">Chrome · macOS</p>
              <p className="text-[11.5px] text-ink-3">Constantine · {t("sessionThis")}</p>
            </div>
            <Badge variant="success">●</Badge>
          </li>
          <li className="flex items-center justify-between rounded-[var(--radius-md)] bg-card p-3 text-[13px]">
            <div>
              <p className="font-semibold text-foreground">Safari · iPhone</p>
              <p className="text-[11.5px] text-ink-3">Constantine · 3h</p>
            </div>
            <Button variant="ghost" size="sm">
              {t("sessionRevoke")}
            </Button>
          </li>
        </ul>
        <Button variant="outline" size="sm" className="mt-4">{t("sessionsRevokeAll")}</Button>
      </section>
    </article>
  );
}

/* ============================================================
 * Section: Danger
 * ============================================================ */
function DangerSection() {
  const t = useTranslations("student.account.danger");
  const [word, setWord] = useState("");

  return (
    <article className="grid gap-6">
      <header className="border-b border-border pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-danger">{t("title")}</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-2">{t("subtitle")}</p>
      </header>
      <section className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger/[0.04] p-5">
        <p className="text-[14px] font-semibold text-foreground">{t("deleteAccount")}</p>
        <p className="mt-1 text-[12.5px] text-ink-2">{t("deleteAccountHint")}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="danger" size="md" className="mt-4">
              {t("deleteAccount")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("deleteDialogTitle")}</DialogTitle>
              <DialogDescription>{t("deleteDialogBody")}</DialogDescription>
            </DialogHeader>
            <Input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={t("deleteWordPlaceholder")}
            />
            <DialogFooter>
              <Button variant="ghost" size="md">{t("deleteCancel")}</Button>
              <Button variant="danger" size="md" disabled={word.trim().toUpperCase() !== "SUPPRIMER" && word.trim() !== "احذف"}>
                {t("deleteConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </article>
  );
}
