"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCurrentUser } from "@/lib/auth/context";
import { addCourse } from "@/lib/mock/teacher-courses-state";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const steps = ["basics", "details", "format", "pricing", "publish"] as const;
type Step = (typeof steps)[number];
type CourseFormat = "1to1" | "cohort" | "event" | "ondemand";

/**
 * Wizard state lifted into the parent so the Publish step can build a
 * NewCourseInput payload from the user's input across all 5 steps.
 *
 * Each step component is controlled — values flow down via props, edits
 * flow up via setters on the same state object. Keeps the public API of
 * each step small (one `value` + one `onChange`).
 */
export type CourseDraft = {
  // Basics
  title: string;
  summary: string;
  category: "exams" | "school" | "languages";
  audience: "kids" | "lycee" | "students" | "adults";
  language: "fr" | "ar" | "en";
  // Details
  description: string;
  weeks: string[];
  outcomes: string[];
  // Format
  format: CourseFormat;
  capacity: number;
  // Pricing
  priceDzd: number;
  promoEnabled: boolean;
  promoPct: number;
};

function defaultDraft(locale: "fr" | "ar"): CourseDraft {
  return {
    title: "",
    summary: "",
    category: "exams",
    audience: "lycee",
    language: "fr",
    description: "",
    weeks: [
      locale === "ar" ? "النهايات والاستمرار" : "Limites & continuité",
      locale === "ar" ? "المشتقات" : "Dérivées",
      locale === "ar" ? "التكاملات" : "Intégrales",
    ],
    outcomes: [
      locale === "ar" ? "حل تمارين الباك بثقة" : "Résoudre les exercices Bac avec confiance",
      locale === "ar" ? "إتقان طرق التكامل" : "Maîtriser les méthodes d'intégration",
    ],
    format: "cohort",
    capacity: 12,
    priceDzd: 1500,
    promoEnabled: false,
    promoPct: 15,
  };
}

export function CourseWizard({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.newCourse");
  const tcommon = useTranslations("teacher.common");
  const twiz = useTranslations("teacher.courses.wizard");
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();

  const [step, setStep] = React.useState<Step>("basics");
  const [draft, setDraft] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<CourseDraft>(() => defaultDraft(locale));
  const idx = steps.indexOf(step);

  const update = React.useCallback(<K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const publish = React.useCallback(
    (status: "draft" | "published") => {
      // Validate required fields. Title is the only string we hard-require —
      // category/audience/language all have safe defaults and price defaults
      // to 1500 so the only other realistic miss is a zero/negative price.
      const missing: string[] = [];
      if (!form.title.trim()) missing.push("title");
      if (!Number.isFinite(form.priceDzd) || form.priceDzd <= 0) missing.push("price");

      if (missing.length > 0) {
        show({
          title: twiz("toasts.missingFields.title"),
          description: twiz("toasts.missingFields.desc"),
          variant: "danger",
        });
        // Jump back to the first step containing a missing field so the
        // user can see what to fix.
        if (missing.includes("title")) setStep("basics");
        else if (missing.includes("price")) setStep("pricing");
        return;
      }

      // Localized title — we only have the user's primary locale, mirror
      // the same string into the other locale so listing pages don't show
      // an empty cell when viewed in the opposite language.
      const localizedTitle = locale === "ar"
        ? { fr: form.title, ar: form.title }
        : { fr: form.title, ar: form.title };

      setSubmitting(true);
      try {
        addCourse({
          title: localizedTitle,
          format: form.format,
          status,
          priceDzd: form.priceDzd,
          capacity:
            form.format === "1to1" || form.format === "ondemand"
              ? { taken: 0, total: 0 }
              : { taken: 0, total: form.capacity },
          nextSession: null,
          monthRevenueDzd: 0,
          studentCount: 0,
          accountId: user?.id,
          // Persist the full Details/Basics/Pricing payload so the edit
          // form's Content tab can read these back. Empty strings/arrays
          // are filtered so we don't pollute the store with placeholders.
          description: form.description.trim() || undefined,
          weeks: form.weeks.map((w) => w.trim()).filter(Boolean),
          outcomes: form.outcomes.map((o) => o.trim()).filter(Boolean),
          category: form.category,
          audience: form.audience,
          language: form.language,
          summary: form.summary.trim() || undefined,
          promoPct: form.promoEnabled ? form.promoPct : undefined,
        });

        show({
          title:
            status === "published"
              ? twiz("toasts.published.title")
              : twiz("toasts.savedAsDraft.title"),
          description:
            status === "published"
              ? twiz("toasts.published.desc")
              : twiz("toasts.savedAsDraft.desc"),
          variant: "success",
        });
        router.push("/teach/courses");
      } catch (err) {
        // Mock store can't really fail but keep the safety net for future-proofing.
        console.error("addCourse failed", err);
        show({
          title: twiz("toasts.publishFailed.title"),
          description: twiz("toasts.publishFailed.desc"),
          variant: "danger",
        });
        setSubmitting(false);
      }
    },
    [form, locale, router, show, twiz, user?.id],
  );

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
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
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
        {step === "basics" && <BasicsStep locale={locale} value={form} update={update} />}
        {step === "details" && <DetailsStep value={form} update={update} />}
        {step === "format" && <FormatStep locale={locale} value={form} update={update} />}
        {step === "pricing" && <PricingStep value={form} update={update} />}
        {step === "publish" && (
          <PublishStep
            submitting={submitting}
            onPublish={() => publish("published")}
            onPublishLater={() => publish("draft")}
          />
        )}
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

function BasicsStep({
  locale,
  value,
  update,
}: {
  locale: "fr" | "ar";
  value: CourseDraft;
  update: <K extends keyof CourseDraft>(key: K, v: CourseDraft[K]) => void;
}) {
  const t = useTranslations("teacher.newCourse.basics");
  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="t-title">{t("titleLabel")}</Label>
        <Input
          id="t-title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder={locale === "ar" ? "رياضيات الباك · تحضير مكثّف" : "Math Bac · préparation intensive"}
        />
        <p className="text-[11px] text-ink-3">{t("titleHint")}</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="t-summary">{t("summary")}</Label>
        <Input
          id="t-summary"
          maxLength={140}
          value={value.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>{t("category")}</Label>
          <Select value={value.category} onValueChange={(v) => update("category", v as CourseDraft["category"])}>
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
          <Select value={value.audience} onValueChange={(v) => update("audience", v as CourseDraft["audience"])}>
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
          <Select value={value.language} onValueChange={(v) => update("language", v as CourseDraft["language"])}>
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

function DetailsStep({
  value,
  update,
}: {
  value: CourseDraft;
  update: <K extends keyof CourseDraft>(key: K, v: CourseDraft[K]) => void;
}) {
  const t = useTranslations("teacher.newCourse.details");

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="desc">{t("description")}</Label>
        <Textarea
          id="desc"
          rows={5}
          value={value.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <p className="text-[11px] text-ink-3">{t("descriptionHint")}</p>
      </div>

      <div>
        <Label className="mb-3 block">{t("syllabus")}</Label>
        <ul className="space-y-2">
          {value.weeks.map((w, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="grid h-9 w-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface font-mono text-[11px] font-semibold tabular text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Input
                value={w}
                onChange={(e) =>
                  update(
                    "weeks",
                    value.weeks.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                placeholder={t("syllabusItem", { n: i + 1 })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  update(
                    "weeks",
                    value.weeks.filter((_, j) => j !== i),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => update("weeks", [...value.weeks, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("addWeek")}
        </Button>
      </div>

      <div>
        <Label className="mb-3 block">{t("outcomes")}</Label>
        <ul className="space-y-2">
          {value.outcomes.map((o, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft/40 text-accent">
                <Check className="h-3.5 w-3.5" />
              </span>
              <Input
                value={o}
                onChange={(e) =>
                  update(
                    "outcomes",
                    value.outcomes.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  update(
                    "outcomes",
                    value.outcomes.filter((_, j) => j !== i),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => update("outcomes", [...value.outcomes, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("addOutcome")}
        </Button>
      </div>
    </div>
  );
}

function FormatStep({
  locale,
  value,
  update,
}: {
  locale: "fr" | "ar";
  value: CourseDraft;
  update: <K extends keyof CourseDraft>(key: K, v: CourseDraft[K]) => void;
}) {
  const t = useTranslations("teacher.newCourse.format");

  const options: { id: CourseFormat; name: string; hint: string }[] = [
    { id: "1to1", name: t("oneToOne"), hint: t("oneToOneHint") },
    { id: "cohort", name: t("cohort"), hint: t("cohortHint") },
    { id: "event", name: t("event"), hint: t("eventHint") },
    { id: "ondemand", name: t("ondemand"), hint: t("ondemandHint") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">{t("title")}</Label>
        <RadioGroup
          value={value.format}
          onValueChange={(v) => update("format", v as CourseFormat)}
          className="grid gap-2 sm:grid-cols-2"
        >
          {options.map((opt) => (
            <label
              key={opt.id}
              htmlFor={`fmt-${opt.id}`}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border bg-background p-4 transition-colors",
                value.format === opt.id ? "border-accent bg-accent-soft/30" : "border-border hover:bg-surface",
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

      {value.format !== "1to1" && value.format !== "ondemand" && (
        <div>
          <Label className="mb-3 block">{t("capacity")}</Label>
          <Slider
            min={2}
            max={40}
            step={1}
            value={[value.capacity]}
            onValueChange={(v) => update("capacity", v[0])}
            ariaLabel={t("capacity")}
          />
          <p className="mt-1 text-[12px] tabular text-ink-2">
            {value.capacity} {locale === "ar" ? "طالب" : "élèves"}
          </p>
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

function PricingStep({
  value,
  update,
}: {
  value: CourseDraft;
  update: <K extends keyof CourseDraft>(key: K, v: CourseDraft[K]) => void;
}) {
  const t = useTranslations("teacher.newCourse.pricing");

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="price">{t("price")}</Label>
        <div className="flex items-center gap-3">
          <Input
            id="price"
            type="number"
            value={value.priceDzd}
            onChange={(e) => update("priceDzd", Number(e.target.value))}
            className="w-40"
          />
          <span className="text-[12px] font-semibold tabular text-ink-3">DZD</span>
        </div>
        <p className="text-[11px] text-ink-3">{t("priceHint")}</p>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={value.promoEnabled}
          onCheckedChange={(c) => update("promoEnabled", c)}
          id="promo"
        />
        <Label htmlFor="promo" className="font-normal">{t("discount")}</Label>
      </div>
      {value.promoEnabled && (
        <div className="ms-9 grid gap-1.5">
          <Label htmlFor="promo-v">{t("discountValue")}</Label>
          <Input
            id="promo-v"
            type="number"
            value={value.promoPct}
            onChange={(e) => update("promoPct", Number(e.target.value))}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
}

function PublishStep({
  submitting,
  onPublish,
  onPublishLater,
}: {
  submitting: boolean;
  onPublish: () => void;
  onPublishLater: () => void;
}) {
  const t = useTranslations("teacher.newCourse.publish");
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-accent/20 bg-accent-soft/30 p-5">
        <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
        <p className="mt-2 text-[13px] text-ink-2">{t("checklist")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="lg" disabled={submitting} onClick={onPublish}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={submitting ? "opacity-0" : ""}>{t("publish")}</span>
        </Button>
        <Button variant="outline" size="lg" disabled={submitting} onClick={onPublishLater}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={submitting ? "opacity-0" : ""}>{t("publishLater")}</span>
        </Button>
      </div>
    </div>
  );
}
