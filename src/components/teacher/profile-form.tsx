"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, ShieldCheck, Sparkles, Languages as LanguagesIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { currentTeacher, topRatedCriteria } from "@/lib/mock/dashboard";
import { wilayaKeys } from "@/lib/wilayas";
import { cn } from "@/lib/utils";

const HOURLY_MIN = 500;
const HOURLY_MAX = 5000;

export function ProfileForm({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.profile");
  const tWilayas = useTranslations("search.wilayas");
  const [hourly, setHourly] = React.useState(currentTeacher.hourlyRate);
  const [discount, setDiscount] = React.useState(false);
  const [instantBook, setInstantBook] = React.useState(true);
  const [mode, setMode] = React.useState<"online" | "in-person" | "both">(currentTeacher.mode);
  const [avatar, setAvatar] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File[]>([]);
  const [diploma, setDiploma] = React.useState<File[]>([]);
  const [diplomaToastOpen, setDiplomaToastOpen] = React.useState(false);

  const initialSubjects = React.useMemo(
    () =>
      locale === "ar"
        ? ["الرياضيات", "التحليل", "الجبر", "الهندسة", "الإحصاء"]
        : ["Mathématiques", "Analyse", "Algèbre", "Géométrie", "Statistiques"],
    [locale],
  );
  const [subjectTags, setSubjectTags] = React.useState<string[]>(initialSubjects);
  React.useEffect(() => {
    setSubjectTags(initialSubjects);
  }, [initialSubjects]);

  function clampHourly(n: number) {
    if (Number.isNaN(n)) return HOURLY_MIN;
    return Math.min(HOURLY_MAX, Math.max(HOURLY_MIN, Math.round(n)));
  }

  return (
    <ToastProvider swipeDirection={locale === "ar" ? "left" : "right"}>
    <Tabs defaultValue="profile">
      <TabsList className="flex h-auto flex-wrap gap-1 bg-surface p-1">
        <TabsTrigger value="profile">{t("tabs.profile")}</TabsTrigger>
        <TabsTrigger value="verification">{t("tabs.verification")}</TabsTrigger>
        <TabsTrigger value="pricing">{t("tabs.pricing")}</TabsTrigger>
        <TabsTrigger value="languages">{t("tabs.languages")}</TabsTrigger>
        <TabsTrigger value="topRated">{t("tabs.topRated")}</TabsTrigger>
      </TabsList>

      {/* Profile */}
      <TabsContent value="profile" className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-2">
              <Label htmlFor="displayName">{t("fields.displayName")}</Label>
              <Input id="displayName" defaultValue={currentTeacher.name[locale]} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="headline">{t("fields.headline")}</Label>
              <Input id="headline" defaultValue={currentTeacher.headline[locale]} maxLength={120} />
              <p className="text-[11px] text-ink-3">{t("fields.headlineHint")}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">{t("fields.bio")}</Label>
              <Textarea
                id="bio"
                rows={6}
                placeholder={t("fields.bioHint")}
                defaultValue={locale === "ar"
                  ? "أحضّر طلابي لباك العلوم منذ 12 عامًا. أركّز على البناء التدريجي للفهم بدلًا من الحفظ."
                  : "Je prépare des élèves au Bac SE depuis 12 ans. J'insiste sur la compréhension construite plutôt que la mémorisation."}
              />
              <p className="text-[11px] text-ink-3">{t("fields.bioHint")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>{t("fields.city")}</Label>
                <Select defaultValue="alger">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayaKeys
                      .filter((w) => w !== "any")
                      .map((w) => (
                        <SelectItem key={w} value={w}>
                          {tWilayas(w as never)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t("fields.mode")}</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="grid grid-cols-3 gap-2">
                  {(["online", "in-person", "both"] as const).map((m) => (
                    <label
                      key={m}
                      htmlFor={`mode-${m}`}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] border bg-background px-2 py-2 text-[12px] font-medium transition-colors",
                        mode === m ? "border-accent bg-accent-soft/60 text-foreground" : "border-border text-ink-2 hover:bg-surface",
                      )}
                    >
                      <RadioGroupItem id={`mode-${m}`} value={m} className="sr-only" />
                      {m === "online" && t("fields.modeOnline")}
                      {m === "in-person" && t("fields.modeInPerson")}
                      {m === "both" && t("fields.modeBoth")}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarFallback className={cn("text-base text-primary-foreground", `bg-gradient-to-br ${currentTeacher.accent}`)}>
                  {currentTeacher.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{currentTeacher.name[locale]}</p>
                <p className="text-[12px] text-ink-3">{currentTeacher.subject[locale]}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{t("fields.avatar")}</Label>
              <FileInput
                accept="image/*"
                value={avatar}
                onValueChange={setAvatar}
                label={t("fields.avatar")}
                hint={t("fields.avatarHint")}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("fields.cover")}</Label>
              <FileInput
                accept="image/*"
                value={cover}
                onValueChange={setCover}
                label={t("fields.cover")}
                hint={t("fields.coverHint")}
              />
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Verification */}
      <TabsContent value="verification" className="space-y-4">
        <div className="grid gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <VerifRow
            done
            icon={<ShieldCheck className="h-4 w-4" />}
            title={t("verification.id")}
            actionLabel={t("verification.idDone")}
          />
          <VerifRow
            done
            icon={<ShieldCheck className="h-4 w-4" />}
            title={t("verification.contact")}
            actionLabel={t("verification.contactDone")}
          />
          <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{t("verification.diploma")}</span>
            </div>
            <p className="mb-3 text-[12px] text-ink-3">{t("verification.diplomaHint")}</p>
            <FileInput
              accept="application/pdf,image/*"
              value={diploma}
              onValueChange={setDiploma}
              label={t("verification.diploma")}
            />
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={diploma.length === 0}
                onClick={() => {
                  setDiplomaToastOpen(false);
                  // re-open on next tick so the same toast can be re-triggered
                  requestAnimationFrame(() => setDiplomaToastOpen(true));
                }}
              >
                {t("verification.diplomaSubmit")}
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Pricing & availability */}
      <TabsContent value="pricing" className="space-y-6">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourly">{t("pricing.hourly")}</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    id="hourly"
                    type="number"
                    min={HOURLY_MIN}
                    max={HOURLY_MAX}
                    step={100}
                    value={hourly}
                    onChange={(e) => setHourly(Number(e.target.value))}
                    onBlur={(e) => setHourly(clampHourly(Number(e.target.value)))}
                    className="w-32"
                  />
                  <span className="text-[12px] font-medium tabular text-ink-3">DZD</span>
                </div>
                <p className="mt-1 text-[11px] text-ink-3">{t("pricing.hourlyHint")}</p>
              </div>
              <Slider
                min={HOURLY_MIN}
                max={HOURLY_MAX}
                step={100}
                value={[clampHourly(hourly)]}
                onValueChange={(v) => setHourly(v[0])}
                ariaLabel={t("pricing.hourly")}
              />
            </div>

            <div className="space-y-3">
              <Row>
                <Switch checked={discount} onCheckedChange={setDiscount} id="discount" />
                <Label htmlFor="discount" className="font-normal">{t("pricing.discount")}</Label>
              </Row>
              {discount && (
                <div className="ms-9 grid gap-1.5">
                  <Label htmlFor="disc">{t("pricing.discountValue")}</Label>
                  <Input id="disc" type="number" defaultValue={10} className="w-24" />
                </div>
              )}
              <Row>
                <Switch checked={instantBook} onCheckedChange={setInstantBook} id="ib" />
                <Label htmlFor="ib" className="font-normal">{t("pricing.instantBook")}</Label>
              </Row>
              <p className="ms-9 text-[11px] text-ink-3">{t("pricing.instantBookHint")}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              {t("pricing.availability")}
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { id: "wk", label: t("pricing.weekdays") },
                { id: "we", label: t("pricing.weekends") },
                { id: "ev", label: t("pricing.evenings") },
              ].map((opt) => (
                <label
                  key={opt.id}
                  htmlFor={opt.id}
                  className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-surface"
                >
                  <Checkbox id={opt.id} defaultChecked />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Languages */}
      <TabsContent value="languages" className="space-y-6">
        <div className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-card p-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <LanguagesIcon className="h-4 w-4" aria-hidden />
              {t("languages.title")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: "fr", labelFr: "Français", labelAr: "الفرنسية" },
                { code: "ar", labelFr: "Arabe", labelAr: "العربية" },
                { code: "en", labelFr: "Anglais", labelAr: "الإنجليزية" },
                { code: "kab", labelFr: "Kabyle", labelAr: "القبائلية" },
                { code: "es", labelFr: "Espagnol", labelAr: "الإسبانية" },
              ].map((l) => (
                <label
                  key={l.code}
                  htmlFor={`lang-${l.code}`}
                  className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-[13px] hover:bg-surface"
                >
                  <Checkbox id={`lang-${l.code}`} defaultChecked={l.code !== "es" && l.code !== "kab"} />
                  {locale === "ar" ? l.labelAr : l.labelFr}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">{t("languages.subjectsTitle")}</p>
            <div className="flex flex-wrap gap-2">
              {subjectTags.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] text-ink-2">
                  {s}
                  <button
                    type="button"
                    className="rounded text-ink-3 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={locale === "ar" ? `إزالة ${s}` : `Retirer ${s}`}
                    onClick={() => setSubjectTags((prev) => prev.filter((x) => x !== s))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("languages.audience")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: "kids", label: t("languages.kids") },
              { id: "teens", label: t("languages.teens") },
              { id: "adults", label: t("languages.adults") },
              { id: "pros", label: t("languages.pros") },
            ].map((a) => (
              <label
                key={a.id}
                htmlFor={`aud-${a.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-[13px] hover:bg-surface"
              >
                <Checkbox id={`aud-${a.id}`} defaultChecked={a.id !== "kids"} />
                {a.label}
              </label>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Top Rated */}
      <TabsContent value="topRated">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_2fr]">
            <div className="border-e border-border bg-surface/60 p-6">
              <Badge variant="warning" className="gap-1.5">
                <Sparkles className="h-3 w-3" aria-hidden />
                {t("tabs.topRated")}
              </Badge>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{t("topRated.title")}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{t("topRated.subtitle")}</p>
              <p className="mt-4 text-[12px] font-medium text-warning">
                {t("topRated.remaining", { count: topRatedCriteria.filter((c) => c.progress < 100).length })}
              </p>
              <p className="mt-3 text-[12px] text-ink-3">{t("topRated.tip")}</p>
            </div>
            <ul className="divide-y divide-border">
              {topRatedCriteria.map((c, i) => (
                <li key={c.id} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-surface font-mono text-[10px] font-semibold tabular text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {locale === "ar" ? c.labelAr : c.labelFr}
                      </span>
                    </div>
                    {c.progress >= 100 ? (
                      <Badge variant="success" className="gap-1">
                        <Check className="h-3 w-3" aria-hidden />
                        {locale === "ar" ? "تمّ" : "Validé"}
                      </Badge>
                    ) : (
                      <span className="text-[12px] font-semibold tabular text-ink-2">{c.progress}%</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <Progress value={c.progress} tone={c.progress >= 100 ? "success" : "warning"} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <Toast
      open={diplomaToastOpen}
      onOpenChange={setDiplomaToastOpen}
      variant="success"
      duration={4000}
    >
      <div className="flex-1">
        <ToastTitle>{t("verification.diplomaToastTitle")}</ToastTitle>
        <ToastDescription>{t("verification.diplomaToastDesc")}</ToastDescription>
      </div>
    </Toast>
    <ToastViewport />
    </ToastProvider>
  );
}

function VerifRow({ done, icon, title, actionLabel }: { done: boolean; icon: React.ReactNode; title: string; actionLabel: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full",
          done ? "bg-success/12 text-success" : "bg-warning/12 text-warning",
        )}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      {done ? (
        <Badge variant="success" className="gap-1">
          <Check className="h-3 w-3" aria-hidden />
          {actionLabel}
        </Badge>
      ) : (
        <Button variant="outline" size="sm">{actionLabel}</Button>
      )}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}
