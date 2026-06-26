"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const steps = ["basics", "details", "format", "pricing", "publish"] as const;
type Step = (typeof steps)[number];

export function CourseWizard({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.newCourse");
  const tcommon = useTranslations("teacher.common");
  const [step, setStep] = React.useState<Step>("basics");
  const [draft, setDraft] = React.useState(false);
  const idx = steps.indexOf(step);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3">
        <div className="flex flex-1 items-center gap-2">
          {steps.map((s, i) => {
            const active = i === idx;
            const done = i < idx;
            return (
              <React.Fragment key={s}>
                <button
                  type="button"
                  onClick={() => setStep(s)}
                  className={cn(
                    "flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    active && "bg-primary text-primary-foreground",
                    done && !active && "text-success",
                    !active && !done && "text-ink-3 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] font-semibold tabular",
                      active ? "bg-background/15" : done ? "bg-success/12 text-success" : "bg-surface text-ink-3",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden sm:inline">{t(`steps.${s}`)}</span>
                </button>
                {i < steps.length - 1 && <span className="hidden h-px w-3 bg-border sm:block" aria-hidden />}
              </React.Fragment>
            );
          })}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-[12px] text-ink-2">
          <Switch checked={draft} onCheckedChange={setDraft} />
          {t("saveDraft")}
        </label>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        {step === "basics" && <BasicsStep locale={locale} />}
        {step === "details" && <DetailsStep locale={locale} />}
        {step === "format" && <FormatStep locale={locale} />}
        {step === "pricing" && <PricingStep />}
        {step === "publish" && <PublishStep />}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={idx === 0}
          onClick={() => setStep(steps[Math.max(0, idx - 1)])}
        >
          {tcommon("previous")}
        </Button>
        <span className="text-[11px] tabular text-ink-3">
          {t("step", { current: idx + 1, total: steps.length })}
        </span>
        <Button
          variant="primary"
          disabled={idx === steps.length - 1}
          onClick={() => setStep(steps[Math.min(steps.length - 1, idx + 1)])}
        >
          {tcommon("next")}
        </Button>
      </div>
    </div>
  );
}

function BasicsStep({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.newCourse.basics");
  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="t-title">{t("titleLabel")}</Label>
        <Input id="t-title" placeholder={locale === "ar" ? "رياضيات الباك · تحضير مكثّف" : "Math Bac · préparation intensive"} />
        <p className="text-[11px] text-ink-3">{t("titleHint")}</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="t-summary">{t("summary")}</Label>
        <Input id="t-summary" maxLength={140} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>{t("category")}</Label>
          <Select defaultValue="exams">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exams">{locale === "ar" ? "الامتحانات" : "Examens"}</SelectItem>
              <SelectItem value="school">{locale === "ar" ? "الدعم المدرسي" : "Soutien scolaire"}</SelectItem>
              <SelectItem value="languages">{locale === "ar" ? "اللغات" : "Langues"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>{t("audience")}</Label>
          <Select defaultValue="lycee">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kids">{locale === "ar" ? "الأطفال" : "Enfants"}</SelectItem>
              <SelectItem value="lycee">{locale === "ar" ? "الثانوي والباك" : "Lycéens & Bac"}</SelectItem>
              <SelectItem value="students">{locale === "ar" ? "الطلبة" : "Étudiants"}</SelectItem>
              <SelectItem value="adults">{locale === "ar" ? "الكبار" : "Adultes"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>{t("language")}</Label>
          <Select defaultValue="fr">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function DetailsStep({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.newCourse.details");
  const [weeks, setWeeks] = React.useState<string[]>([
    locale === "ar" ? "النهايات والاستمرار" : "Limites & continuité",
    locale === "ar" ? "المشتقات" : "Dérivées",
    locale === "ar" ? "التكاملات" : "Intégrales",
  ]);
  const [outcomes, setOutcomes] = React.useState<string[]>([
    locale === "ar" ? "حل تمارين الباك بثقة" : "Résoudre les exercices Bac avec confiance",
    locale === "ar" ? "إتقان طرق التكامل" : "Maîtriser les méthodes d'intégration",
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="desc">{t("description")}</Label>
        <Textarea id="desc" rows={5} />
        <p className="text-[11px] text-ink-3">{t("descriptionHint")}</p>
      </div>

      <div>
        <Label className="mb-3 block">{t("syllabus")}</Label>
        <ul className="space-y-2">
          {weeks.map((w, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="grid h-9 w-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface font-mono text-[11px] font-semibold tabular text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Input
                value={w}
                onChange={(e) => setWeeks((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={t("syllabusItem", { n: i + 1 })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setWeeks((arr) => arr.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setWeeks((arr) => [...arr, ""])}>
          <Plus className="h-3.5 w-3.5" />
          {t("addWeek")}
        </Button>
      </div>

      <div>
        <Label className="mb-3 block">{t("outcomes")}</Label>
        <ul className="space-y-2">
          {outcomes.map((o, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft/40 text-accent">
                <Check className="h-3.5 w-3.5" />
              </span>
              <Input
                value={o}
                onChange={(e) => setOutcomes((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setOutcomes((arr) => arr.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setOutcomes((arr) => [...arr, ""])}>
          <Plus className="h-3.5 w-3.5" />
          {t("addOutcome")}
        </Button>
      </div>
    </div>
  );
}

function FormatStep({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.newCourse.format");
  const [format, setFormat] = React.useState<"1to1" | "cohort" | "event" | "ondemand">("cohort");
  const [capacity, setCapacity] = React.useState(12);

  const options: { id: typeof format; name: string; hint: string }[] = [
    { id: "1to1", name: t("oneToOne"), hint: t("oneToOneHint") },
    { id: "cohort", name: t("cohort"), hint: t("cohortHint") },
    { id: "event", name: t("event"), hint: t("eventHint") },
    { id: "ondemand", name: t("ondemand"), hint: t("ondemandHint") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">{t("title")}</Label>
        <RadioGroup value={format} onValueChange={(v) => setFormat(v as typeof format)} className="grid gap-2 sm:grid-cols-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              htmlFor={`fmt-${opt.id}`}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border bg-background p-4 transition-colors",
                format === opt.id ? "border-accent bg-accent-soft/30" : "border-border hover:bg-surface",
              )}
            >
              <RadioGroupItem id={`fmt-${opt.id}`} value={opt.id} className="mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{opt.name}</p>
                <p className="mt-0.5 text-[12px] text-ink-3">{opt.hint}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {format !== "1to1" && format !== "ondemand" && (
        <div>
          <Label className="mb-3 block">{t("capacity")}</Label>
          <Slider min={2} max={40} step={1} value={[capacity]} onValueChange={(v) => setCapacity(v[0])} ariaLabel={t("capacity")} />
          <p className="mt-1 text-[12px] tabular text-ink-2">{capacity} {locale === "ar" ? "طالب" : "élèves"}</p>
        </div>
      )}

      <div>
        <Label className="mb-2 block">{t("schedule")}</Label>
        <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface px-4 py-6 text-center text-[12px] text-ink-3">
          {locale === "ar"
            ? "ستظهر هنا معاينة الجدول بمجرد تحديد الأوقات."
            : "Aperçu du planning généré dès que tu fixes les créneaux."}
        </div>
      </div>
    </div>
  );
}

function PricingStep() {
  const t = useTranslations("teacher.newCourse.pricing");
  const [price, setPrice] = React.useState(1500);
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="price">{t("price")}</Label>
        <div className="flex items-center gap-3">
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-40" />
          <span className="text-[12px] font-semibold tabular text-ink-3">DZD</span>
        </div>
        <p className="text-[11px] text-ink-3">{t("priceHint")}</p>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} id="promo" />
        <Label htmlFor="promo" className="font-normal">{t("discount")}</Label>
      </div>
      {enabled && (
        <div className="ms-9 grid gap-1.5">
          <Label htmlFor="promo-v">{t("discountValue")}</Label>
          <Input id="promo-v" type="number" defaultValue={15} className="w-24" />
        </div>
      )}
    </div>
  );
}

function PublishStep() {
  const t = useTranslations("teacher.newCourse.publish");
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-accent/20 bg-accent-soft/30 p-5">
        <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
        <p className="mt-2 text-[13px] text-ink-2">{t("checklist")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="lg">{t("publish")}</Button>
        <Button variant="outline" size="lg">{t("publishLater")}</Button>
      </div>
    </div>
  );
}
