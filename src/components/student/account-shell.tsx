"use client";

import { useCallback, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
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
  Flag,
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
import { DisputeOpenDialog } from "@/components/disputes/dispute-open-dialog";
import { wilayaKeys } from "@/lib/mock/categories";
import type { PaymentMethod } from "@/lib/mock/payments-state";
import { getBookingsForAccount, subscribeBookings, type Booking } from "@/lib/mock/bookings-state";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

// Stable empty snapshot for useSyncExternalStore SSR fallback.
const EMPTY_BOOKINGS: readonly Booking[] = Object.freeze([]);
const getServerSnapshot = (): readonly Booking[] => EMPTY_BOOKINGS;

type Section = "profile" | "preferences" | "payments" | "security" | "danger";

export function AccountShell() {
  const t = useTranslations("student.account");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [section, setSection] = useState<Section>("profile");
  const { user, signOut } = useCurrentUser();

  // Surface fallback identity when no cookie (e.g. anonymous preview of /account)
  const displayName = user?.studentName ?? "Lina M.";
  const displayInitials = user?.studentInitials ?? "LM";
  const displayCity = user?.studentCity ?? "constantine";
  const displayPhone = user?.studentPhone ?? "+213 555 11 22 33";

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
                {displayInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-[32px] font-bold leading-[1.02] tracking-tight text-foreground md:text-[40px]">
                {displayName}
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
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="w-full justify-start text-ink-2"
              onClick={() => void signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span className="ms-1">{t("signOut")}</span>
              <Arrow className="ms-auto h-4 w-4" />
            </Button>
          </nav>

          {/* Section content */}
          <div>
            {section === "profile" && (
              <ProfileSection
                displayName={displayName}
                displayInitials={displayInitials}
                displayCity={displayCity}
                displayPhone={displayPhone}
              />
            )}
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
function ProfileSection({
  displayName,
  displayInitials,
  displayCity,
  displayPhone,
}: {
  displayName: string;
  displayInitials: string;
  displayCity: string;
  displayPhone: string;
}) {
  const t = useTranslations("student.account.profile");
  const tToasts = useTranslations("student.account.toasts");
  const tWilayas = useTranslations("search.wilayas");
  const { show } = useToast();
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
          show({
            title: tToasts("profileSaved.title"),
            description: tToasts("profileSaved.desc"),
            variant: "success",
          });
          setTimeout(() => setSaved(false), 2200);
        }}
      >
        <div className="grid gap-3">
          <Label>{t("avatarLabel")}</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shadow-e1">
              <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-lg text-white">
                {displayInitials}
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
            <Input id="fullName" autoComplete="name" defaultValue={displayName} placeholder={t("fullNamePlaceholder")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="displayName">{t("displayName")}</Label>
            <Input id="displayName" defaultValue={displayName} />
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
            <Select defaultValue={displayCity}>
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
            <Input id="phone" dir="ltr" inputMode="tel" defaultValue={displayPhone} placeholder={t("phonePlaceholder")} />
            <p className="text-[11.5px] text-ink-3">{t("phoneHint")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Button type="submit" size="md">
            {t("save")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setBio(
                "Bachelière à Constantine, je prépare IELTS pour mes études en Europe. Disponible en soirée.",
              );
              setAvatar([]);
              show({
                title: tToasts("profileDiscarded.title"),
                description: tToasts("profileDiscarded.desc"),
                variant: "default",
              });
            }}
          >
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
  const tToasts = useTranslations("student.account.toasts");
  const { show } = useToast();
  const [teachingLang, setTeachingLang] = useState("fr");
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
        <RadioGroup
          value={teachingLang}
          onValueChange={setTeachingLang}
          className="grid gap-2 md:grid-cols-2"
        >
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
        <Button
          size="md"
          onClick={() =>
            show({
              title: tToasts("preferencesSaved.title"),
              description: tToasts("preferencesSaved.desc"),
              variant: "success",
            })
          }
        >
          {t("save")}
        </Button>
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
  const tToasts = useTranslations("student.account.toasts");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const { show } = useToast();
  const { user } = useCurrentUser();

  const [methods, setMethods] = useState<PaymentMethod[]>(() => [
    { id: "pm-1", label: t("methodEdahabia"), last4: "4218", expiry: "12/27", isDefault: true },
    { id: "pm-2", label: t("methodCib"), last4: "9043", expiry: "06/26" },
    { id: "pm-3", label: t("methodPostalMandate") },
    { id: "pm-4", label: t("methodBaridiMob") },
  ]);

  const [history] = useState(() => [
    { id: "h-1", date: "12 sept 2025", item: lang === "ar" ? "رياضيات الباك · النهايات" : "Math Bac · Limites", amount: 4500, status: "Paid" as const },
    { id: "h-2", date: "05 sept 2025", item: lang === "ar" ? "IELTS التحدّث · ورشة" : "IELTS Speaking · workshop", amount: 1800, status: "Refunded" as const },
    { id: "h-3", date: "28 aout 2025", item: lang === "ar" ? "React من الصفر" : "React from scratch · cohort", amount: 9800, status: "Paid" as const },
  ]);

  // Live bookings — surfaced from the in-memory booking store. Filtered to
  // the current user; sorted newest first by the store itself.
  const accountId = user?.id ?? null;
  const getSnapshot = useCallback(() => getBookingsForAccount(accountId), [accountId]);
  const sessionBookings = useSyncExternalStore<readonly Booking[]>(
    subscribeBookings,
    getSnapshot,
    getServerSnapshot,
  );
  const confirmedBookings = sessionBookings.filter((b) => b.status === "confirmed");

  const bookedDateLabel = (iso: string) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const kindLabel = (kind: Booking["kind"]) =>
    tBooking(`kind.${kind}` as never);

  // Add payment method dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<"visa" | "mastercard" | "cib">("visa");
  const [newLast4, setNewLast4] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  // Report-a-problem dialog state. One shared DisputeOpenDialog at the
  // section level is opened by each row's "Report a problem" button, with
  // the booking pre-filled.
  const [reportOpen, setReportOpen] = useState(false);
  const [reportBooking, setReportBooking] = useState<Booking | undefined>(undefined);
  const tDisputeRow = useTranslations("app.disputes.recentBookings");

  const resetAddForm = () => {
    setNewBrand("visa");
    setNewLast4("");
    setNewExpiry("");
  };

  const brandLabel = (b: typeof newBrand) =>
    b === "visa" ? "Visa" : b === "mastercard" ? "MasterCard" : "CIB";

  const handleAddPayment = (e: FormEvent) => {
    e.preventDefault();
    const cleanLast4 = newLast4.replace(/\D/g, "").slice(-4);
    if (cleanLast4.length !== 4 || !/^\d{2}\/\d{2}$/.test(newExpiry)) {
      show({
        title: tToasts("paymentInvalid.title"),
        description: tToasts("paymentInvalid.desc"),
        variant: "danger",
      });
      return;
    }
    const next: PaymentMethod = {
      id: `pm-${Date.now().toString(36)}`,
      label: brandLabel(newBrand),
      last4: cleanLast4,
      expiry: newExpiry,
    };
    setMethods((prev) => [...prev, next]);
    setAddOpen(false);
    resetAddForm();
    show({
      title: tToasts("paymentAdded.title"),
      description: tToasts("paymentAdded.desc", { brand: next.label, last4: cleanLast4 }),
      variant: "success",
    });
  };

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
          {methods.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2">
                <CreditCard className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold text-foreground">{m.label}</p>
                <p className="text-[11px] text-ink-3 tabular">
                  {m.last4 ? `•••• ${m.last4}${m.expiry ? ` · ${m.expiry}` : ""}` : `№ ${String(i + 1).padStart(2, "0")}`}
                </p>
              </div>
              {m.isDefault && <Badge variant="success">●</Badge>}
            </div>
          ))}
        </div>

        <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetAddForm(); }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit">
              + {t("addMethod")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tToasts("addPaymentDialog.title")}</DialogTitle>
              <DialogDescription>{tToasts("addPaymentDialog.desc")}</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={handleAddPayment}>
              <div className="grid gap-2">
                <Label htmlFor="brand">{tToasts("addPaymentDialog.brand")}</Label>
                <Select
                  value={newBrand}
                  onValueChange={(v) => setNewBrand(v as typeof newBrand)}
                >
                  <SelectTrigger id="brand">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">MasterCard</SelectItem>
                    <SelectItem value="cib">CIB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last4">{tToasts("addPaymentDialog.last4")}</Label>
                <Input
                  id="last4"
                  dir="ltr"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  value={newLast4}
                  onChange={(e) => setNewLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
                <p className="text-[11.5px] text-ink-3">{tToasts("addPaymentDialog.last4Hint")}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiry">{tToasts("addPaymentDialog.expiry")}</Label>
                <Input
                  id="expiry"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={newExpiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^\d/]/g, "");
                    if (v.length === 2 && !v.includes("/") && newExpiry.length === 1) v += "/";
                    setNewExpiry(v.slice(0, 5));
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => { setAddOpen(false); resetAddForm(); }}
                >
                  {tToasts("addPaymentDialog.cancel")}
                </Button>
                <Button type="submit" size="md">
                  {tToasts("addPaymentDialog.submit")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      {confirmedBookings.length > 0 && (
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {tBooking("payments.recentLabel")}
          </p>
          <div className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border border-accent/30">
            <ul className="divide-y divide-border bg-card">
              {confirmedBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-2 px-4 py-3 text-[13px] md:grid md:grid-cols-[120px_1fr_120px_100px_auto_auto] md:items-center md:gap-2"
                >
                  <span className="order-2 text-[11px] tabular text-ink-3 md:order-none md:text-[13px]">
                    {bookedDateLabel(b.bookedAt)}
                  </span>
                  <span className="order-1 font-semibold text-foreground md:order-none md:font-medium">
                    {b.subjectTitle[lang]}
                    <span className="ms-2 inline-flex items-center rounded-full bg-accent/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-accent">
                      {kindLabel(b.kind)}
                    </span>
                  </span>
                  <span className="order-3 flex items-center justify-between gap-2 md:order-none md:justify-end">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-ink-3 md:hidden">
                      {t("historyAmount")}
                    </span>
                    <span className="font-semibold tabular text-foreground md:text-end">
                      {formatPrice(b.priceDzd, locale)}
                    </span>
                  </span>
                  <span className="order-4 md:order-none">
                    <Badge variant="success">
                      {tBooking("payments.statusConfirmed")}
                    </Badge>
                  </span>
                  <span className="order-5 md:order-none md:text-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        show({
                          title: tToasts("invoiceDownloaded.title"),
                          description: tToasts("invoiceDownloaded.desc", { item: b.subjectTitle[lang] }),
                          variant: "default",
                        })
                      }
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("downloadInvoice")}
                    </Button>
                  </span>
                  <span className="order-6 md:order-none md:text-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ink-3 hover:text-foreground"
                      onClick={() => {
                        setReportBooking(b);
                        setReportOpen(true);
                      }}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      {tDisputeRow("reportProblem")}
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Single shared dispute dialog — opened by every row's
              "Report a problem" button, pre-filled with that booking. */}
          <DisputeOpenDialog
            open={reportOpen}
            onOpenChange={(next) => {
              setReportOpen(next);
              if (!next) setReportBooking(undefined);
            }}
            prefillBooking={reportBooking}
          />
        </section>
      )}

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
                className="flex flex-col gap-2 px-4 py-3 text-[13px] md:grid md:grid-cols-[120px_1fr_120px_100px_100px] md:items-center md:gap-2"
              >
                {/* Mobile: item is the headline, everything else collapses under it */}
                <span className="order-2 text-[11px] tabular text-ink-3 md:order-none md:text-[13px]">
                  {h.date}
                </span>
                <span className="order-1 font-semibold text-foreground md:order-none md:font-medium">
                  {h.item}
                </span>
                <span className="order-3 flex items-center justify-between gap-2 md:order-none md:justify-end">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-ink-3 md:hidden">
                    {t("historyAmount")}
                  </span>
                  <span className="font-semibold tabular text-foreground md:text-end">
                    {formatPrice(h.amount, locale)}
                  </span>
                </span>
                <span className="order-4 md:order-none">
                  <Badge variant={h.status === "Paid" ? "success" : "warning"}>
                    {h.status === "Paid" ? t("statusPaid") : t("statusRefunded")}
                  </Badge>
                </span>
                <span className="order-5 md:order-none md:text-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      show({
                        title: tToasts("invoiceDownloaded.title"),
                        description: tToasts("invoiceDownloaded.desc", { item: h.item }),
                        variant: "default",
                      })
                    }
                  >
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
type DeviceSession = {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  current?: boolean;
};

function SecuritySection() {
  const t = useTranslations("student.account.security");
  const tToasts = useTranslations("student.account.toasts");
  const { show } = useToast();
  const [twoFa, setTwoFa] = useState(false);

  // Password dialog state
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const resetPasswordForm = () => {
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (pwNew.length < 6) {
      show({
        title: tToasts("passwordTooShort.title"),
        description: tToasts("passwordTooShort.desc"),
        variant: "danger",
      });
      return;
    }
    if (pwNew !== pwConfirm) {
      show({
        title: tToasts("passwordMismatch.title"),
        description: tToasts("passwordMismatch.desc"),
        variant: "danger",
      });
      return;
    }
    setPwOpen(false);
    resetPasswordForm();
    show({
      title: tToasts("passwordChanged.title"),
      description: tToasts("passwordChanged.desc"),
      variant: "success",
    });
  };

  // 2FA toggle with toast
  const handleTwoFa = (next: boolean) => {
    setTwoFa(next);
    show({
      title: next ? tToasts("twoFaEnabled.title") : tToasts("twoFaDisabled.title"),
      description: next ? tToasts("twoFaEnabled.desc") : tToasts("twoFaDisabled.desc"),
      variant: next ? "success" : "default",
    });
  };

  // Sessions state
  const [sessions, setSessions] = useState<DeviceSession[]>(() => [
    { id: "s-1", device: "Chrome · macOS", location: "Constantine", lastSeen: t("sessionThis"), current: true },
    { id: "s-2", device: "Safari · iPhone", location: "Constantine", lastSeen: "3h" },
  ]);

  const revokeSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    show({
      title: tToasts("sessionRevoked.title"),
      description: tToasts("sessionRevoked.desc", { device: target?.device ?? "" }),
      variant: "success",
    });
  };

  const revokeAllSessions = () => {
    const removable = sessions.filter((s) => !s.current);
    if (removable.length === 0) {
      show({
        title: tToasts("sessionsNoneRevoked.title"),
        description: tToasts("sessionsNoneRevoked.desc"),
        variant: "default",
      });
      return;
    }
    setSessions((prev) => prev.filter((s) => s.current));
    show({
      title: tToasts("sessionsAllRevoked.title"),
      description: tToasts("sessionsAllRevoked.desc", { count: removable.length }),
      variant: "success",
    });
  };

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
        <Dialog
          open={pwOpen}
          onOpenChange={(open) => {
            setPwOpen(open);
            if (!open) resetPasswordForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">{t("changePassword")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDesc")}</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={handleChangePassword}>
              <div className="grid gap-2">
                <Label htmlFor="cur">{t("currentPassword")}</Label>
                <Input
                  id="cur"
                  type="password"
                  autoComplete="current-password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nv">{t("newPassword")}</Label>
                <Input
                  id="nv"
                  type="password"
                  autoComplete="new-password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cf">{t("confirmPassword")}</Label>
                <Input
                  id="cf"
                  type="password"
                  autoComplete="new-password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setPwOpen(false);
                    resetPasswordForm();
                  }}
                >
                  {t("dialogCancel")}
                </Button>
                <Button type="submit" size="md">
                  {t("dialogSubmit")}
                </Button>
              </DialogFooter>
            </form>
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
        <Switch checked={twoFa} onCheckedChange={handleTwoFa} aria-label={t("twoFa")} />
      </section>

      {/* Sessions */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <p className="text-[13.5px] font-semibold text-foreground">{t("sessions")}</p>
        <ul className="mt-3 grid gap-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] p-3 text-[13px]",
                s.current ? "bg-surface/60" : "bg-card",
              )}
            >
              <div>
                <p className="font-semibold text-foreground">{s.device}</p>
                <p className="text-[11.5px] text-ink-3">{s.location} · {s.lastSeen}</p>
              </div>
              {s.current ? (
                <Badge variant="success">●</Badge>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => revokeSession(s.id)}>
                  {t("sessionRevoke")}
                </Button>
              )}
            </li>
          ))}
          {sessions.filter((s) => !s.current).length === 0 && (
            <li className="rounded-[var(--radius-md)] border border-dashed border-border p-3 text-[12px] text-ink-3">
              {tToasts("sessionsEmptyHint")}
            </li>
          )}
        </ul>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={revokeAllSessions}
          disabled={sessions.filter((s) => !s.current).length === 0}
        >
          {t("sessionsRevokeAll")}
        </Button>
      </section>
    </article>
  );
}

/* ============================================================
 * Section: Danger
 * ============================================================ */
function DangerSection() {
  const t = useTranslations("student.account.danger");
  const tToasts = useTranslations("student.account.toasts");
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");

  const confirmDisabled =
    word.trim().toUpperCase() !== "SUPPRIMER" && word.trim() !== "احذف";

  const handleConfirm = () => {
    if (confirmDisabled) return;
    setOpen(false);
    setWord("");
    show({
      title: tToasts("accountDeleteRequested.title"),
      description: tToasts("accountDeleteRequested.desc"),
      variant: "warning",
      durationMs: 7000,
    });
  };

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
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setWord("");
          }}
        >
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
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setOpen(false);
                  setWord("");
                }}
              >
                {t("deleteCancel")}
              </Button>
              <Button
                variant="danger"
                size="md"
                disabled={confirmDisabled}
                onClick={handleConfirm}
              >
                {t("deleteConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </article>
  );
}
