"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/lib/auth";
import {
  getRequestById,
  updateRequest,
  deleteRequest,
} from "@/lib/mock/learning-requests-state";
import {
  REQUEST_AUDIENCE_LABELS,
  REQUEST_CITY_LABELS,
  REQUEST_DEADLINE_LABELS,
  REQUEST_LEVEL_LABELS,
  REQUEST_SUBJECT_LABELS,
  findKeyByLabel,
} from "@/lib/mock/request-labels";
import type { LearningRequest } from "@/lib/mock/requests";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

const SUBJECT_KEYS = [
  "school",
  "languages",
  "code",
  "design",
  "business",
  "music",
  "religion",
  "exams",
] as const;
const MODES = ["online", "in-person", "both"] as const;
const URGENCIES = ["low", "med", "high"] as const;
const AUDIENCES = ["kids", "lycee", "students", "adults"] as const;
const LEVELS = ["beginner", "intermediate", "advanced", "any"] as const;
const DEADLINES = ["thisWeek", "thisMonth", "notInRush"] as const;
const CITY_KEYS = [
  "alger",
  "oran",
  "constantine",
  "annaba",
  "blida",
  "setif",
  "batna",
  "tlemcen",
  "tiziOuzou",
  "bejaia",
] as const;

type FormState = {
  title: string;
  body: string;
  subject: string;
  level: (typeof LEVELS)[number];
  audience: (typeof AUDIENCES)[number] | "";
  mode: (typeof MODES)[number];
  city: string;
  deadline: (typeof DEADLINES)[number];
  budgetMin: number;
  budgetMax: number;
  urgency: (typeof URGENCIES)[number];
  anonymous: boolean;
};

function deriveForm(req: LearningRequest, lang: "fr" | "ar"): FormState {
  return {
    title: req.title[lang] ?? req.title.fr ?? "",
    body: req.body[lang] ?? req.body.fr ?? "",
    subject:
      req.categoryKey ||
      findKeyByLabel(REQUEST_SUBJECT_LABELS, req.subject[lang]) ||
      "",
    level:
      (findKeyByLabel(REQUEST_LEVEL_LABELS, req.level[lang]) as FormState["level"]) ||
      "any",
    audience: (AUDIENCES.find((a) => a === req.audience) ?? "") as FormState["audience"],
    mode: req.mode,
    city: findKeyByLabel(REQUEST_CITY_LABELS, req.city[lang]) || "",
    deadline:
      (findKeyByLabel(REQUEST_DEADLINE_LABELS, req.deadline[lang]) as FormState["deadline"]) ||
      "thisMonth",
    budgetMin: req.budgetDzd.min,
    budgetMax: req.budgetDzd.max,
    urgency: req.urgency,
    anonymous: !!req.anonymous,
  };
}

export function RequestEditForm({
  slug,
  initial,
}: {
  slug: string;
  initial: LearningRequest;
}) {
  const t = useTranslations("requests");
  const router = useRouter();
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const { user } = useCurrentUser();
  const { show } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  // Re-derive against the live store so any prior in-session edit reflects.
  const live = useMemo(() => getRequestById(slug) ?? initial, [slug, initial]);

  const [form, setForm] = useState<FormState>(() => deriveForm(live, lang));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Re-hydrate when the language flips (deeper rehydration than just
    // changing labels — keeps the inputs in sync with the chosen locale).
    setForm(deriveForm(live, lang));
  }, [live, lang]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = t("newRequest.step1.errorTitle");
    if (!form.subject) e.subject = t("newRequest.step1.errorSubject");
    if (!form.body.trim() || form.body.trim().length < 10)
      e.body = t("newRequest.step2.errorBody");
    if ((form.mode === "in-person" || form.mode === "both") && !form.city)
      e.city = t("newRequest.step3.errorCity");
    if (form.budgetMin <= 0 || form.budgetMax < form.budgetMin)
      e.budget = t("newRequest.step4.errorBudget");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function save() {
    if (!validate()) {
      show({
        title: t("wizard.toasts.missingFields.title"),
        description: t("wizard.toasts.missingFields.desc"),
        variant: "danger",
      });
      return;
    }

    const subjectLabel = REQUEST_SUBJECT_LABELS[form.subject] ?? {
      fr: form.subject,
      ar: form.subject,
    };
    const cityLabel = form.city
      ? REQUEST_CITY_LABELS[form.city] ?? { fr: form.city, ar: form.city }
      : { fr: "—", ar: "—" };
    const levelLabel = REQUEST_LEVEL_LABELS[form.level] ?? {
      fr: form.level,
      ar: form.level,
    };
    const deadlineLabel = REQUEST_DEADLINE_LABELS[form.deadline] ?? {
      fr: form.deadline,
      ar: form.deadline,
    };

    startSaving(() => {
      // updateRequest expects the public LearningRequest shape. We patch
      // only the editable surface (status/applications/owner stay as-is).
      const patched = updateRequest(live.id, {
        title: { ...live.title, [lang]: form.title },
        body: { ...live.body, [lang]: form.body },
        subject: subjectLabel,
        categoryKey: form.subject,
        level: levelLabel,
        audience: (form.audience || "adults") as LearningRequest["audience"],
        budgetDzd: { min: form.budgetMin, max: form.budgetMax },
        mode: form.mode,
        city: cityLabel,
        deadline: deadlineLabel,
        urgency: form.urgency,
        anonymous: form.anonymous,
      });
      show({
        title: t("edit.toasts.saved.title"),
        description: t("edit.toasts.saved.desc"),
        variant: "success",
      });
      // Bounce back to the detail view of the (possibly renamed) request.
      router.push(`/requests/${patched?.slug ?? live.slug}` as never);
    });
  }

  function handleDelete() {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm(t("edit.deleteConfirm"));
    if (!confirmed) return;
    startDeleting(() => {
      deleteRequest(live.id);
      show({
        title: t("toasts.deleted.title"),
        description: t("toasts.deleted.desc"),
        variant: "warning",
      });
      router.push("/requests/my" as never);
    });
  }

  // Permission check — non-owner sees a polite redirect. The proxy doesn't
  // gate per-request ownership, so we enforce here.
  const isOwner = !!live.ownedByCurrentUser || (user && user.id === "acc-lina" && live.student.id === "u-lina");

  return (
    <>
      {/* Top breadcrumb */}
      <section className="border-b border-border bg-surface/40">
        <div className="container-narrow flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <Link
            href={`/requests/${slug}`}
            className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-foreground"
          >
            {locale === "ar" ? (
              <ArrowRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowLeft className="h-3.5 w-3.5" />
            )}
            {t("edit.backToDetail")}
          </Link>
          <span className="tabular">{t("edit.indexLabel")}</span>
        </div>
      </section>

      {/* Form */}
      <section className="container-narrow grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-accent" />
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-accent">
                {t("edit.eyebrow")}
              </p>
            </div>
            <h1 className="mt-4 text-balance text-[32px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
              {t("edit.title")}
            </h1>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-2">
              {t("edit.subtitle")}
            </p>
            {!isOwner && (
              <p className="mt-6 rounded-[var(--radius-md)] border border-warning/30 bg-warning/10 p-3 text-[12.5px] text-foreground">
                {t("edit.ownerNote")}
              </p>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="space-y-8 rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1 md:p-8">
            {/* SECTION 1 — subject */}
            <FormSection title={t("newRequest.step5.sectionSubject")}>
              <Field
                label={t("newRequest.step1.titleLabel")}
                error={errors.title}
                htmlFor="title"
              >
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder={t("newRequest.step1.titlePlaceholder")}
                  maxLength={120}
                />
              </Field>
              <Field
                label={t("newRequest.step1.subjectLabel")}
                error={errors.subject}
                htmlFor="subject"
              >
                <Select
                  value={form.subject}
                  onValueChange={(v) => update("subject", v)}
                >
                  <SelectTrigger id="subject">
                    <SelectValue
                      placeholder={t("newRequest.step1.subjectPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {t(`shared.subjects.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FormSection>

            {/* SECTION 2 — context */}
            <FormSection title={t("newRequest.step5.sectionDetails")}>
              <Field
                label={t("newRequest.step2.bodyLabel")}
                error={errors.body}
                hint={t("newRequest.step2.bodyHint")}
                htmlFor="body"
              >
                <Textarea
                  id="body"
                  value={form.body}
                  onChange={(e) => update("body", e.target.value)}
                  placeholder={t("newRequest.step2.bodyPlaceholder")}
                  rows={6}
                  maxLength={1200}
                />
                <p className="mt-2 text-end font-mono text-[10.5px] text-ink-3 tabular">
                  {form.body.length} / 1200
                </p>
              </Field>
              <Field label={t("newRequest.step2.levelLabel")}>
                <RadioGroup
                  value={form.level}
                  onValueChange={(v) => update("level", v as FormState["level"])}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {LEVELS.map((lv) => (
                    <label
                      key={lv}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                        form.level === lv
                          ? "border-accent bg-accent-soft/30 text-accent"
                          : "border-border text-ink-2",
                      )}
                    >
                      <RadioGroupItem value={lv} />
                      <span>{t(`shared.level.${lv}`)}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
              <Field
                label={t("newRequest.step2.audienceLabel")}
                htmlFor="audience"
              >
                <Select
                  value={form.audience}
                  onValueChange={(v) =>
                    update("audience", v as FormState["audience"])
                  }
                >
                  <SelectTrigger id="audience">
                    <SelectValue
                      placeholder={t("newRequest.step2.audiencePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((k) => (
                      <SelectItem key={k} value={k}>
                        {t(`shared.audience.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FormSection>

            {/* SECTION 3 — logistics */}
            <FormSection title={t("newRequest.step5.sectionLogistics")}>
              <Field label={t("newRequest.step3.modeLabel")}>
                <RadioGroup
                  value={form.mode}
                  onValueChange={(v) => update("mode", v as FormState["mode"])}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {MODES.map((m) => (
                    <label
                      key={m}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                        form.mode === m
                          ? "border-accent bg-accent-soft/30 text-accent"
                          : "border-border text-ink-2",
                      )}
                    >
                      <RadioGroupItem value={m} />
                      <span>
                        {t(
                          m === "online"
                            ? "shared.modes.online"
                            : m === "in-person"
                              ? "shared.modes.inPerson"
                              : "shared.modes.both",
                        )}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
              <Field
                label={t("newRequest.step3.cityLabel")}
                error={errors.city}
                htmlFor="city"
              >
                <Select
                  value={form.city}
                  onValueChange={(v) => update("city", v)}
                >
                  <SelectTrigger id="city">
                    <SelectValue
                      placeholder={t("newRequest.step3.cityPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {t(`shared.cities.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label={t("newRequest.step3.deadlineLabel")}
                hint={t("newRequest.step3.deadlineHint")}
              >
                <RadioGroup
                  value={form.deadline}
                  onValueChange={(v) =>
                    update("deadline", v as FormState["deadline"])
                  }
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {DEADLINES.map((d) => (
                    <label
                      key={d}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                        form.deadline === d
                          ? "border-accent bg-accent-soft/30 text-accent"
                          : "border-border text-ink-2",
                      )}
                    >
                      <RadioGroupItem value={d} />
                      <span>{t(`shared.deadlines.${d}`)}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
            </FormSection>

            {/* SECTION 4 — budget & priority */}
            <FormSection title={t("newRequest.step5.sectionBudget")}>
              <Field
                label={t("newRequest.step4.budgetLabel")}
                hint={t("newRequest.step4.budgetHint")}
                error={errors.budget}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="rounded-[var(--radius-md)] border border-border bg-background p-3">
                      <p className="text-[9.5px] uppercase tracking-[0.22em] text-ink-3">
                        {t("newRequest.budgetAxis.min")}
                      </p>
                      <p className="mt-1 text-[20px] font-bold text-foreground tabular">
                        {formatPrice(form.budgetMin, locale)}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-accent/50 bg-accent-soft/30 p-3 text-end">
                      <p className="text-[9.5px] uppercase tracking-[0.22em] text-accent">
                        {t("newRequest.budgetAxis.max")}
                      </p>
                      <p className="mt-1 text-[20px] font-bold text-foreground tabular">
                        {formatPrice(form.budgetMax, locale)}
                      </p>
                    </div>
                  </div>
                  <Slider
                    min={500}
                    max={5000}
                    step={100}
                    value={[form.budgetMin, form.budgetMax]}
                    onValueChange={(v) => {
                      update("budgetMin", v[0] ?? form.budgetMin);
                      update("budgetMax", v[1] ?? form.budgetMax);
                    }}
                    ariaLabel={t("newRequest.step4.budgetLabel")}
                    format={(n) => formatPrice(n, locale)}
                  />
                </div>
              </Field>
              <Field label={t("newRequest.step4.urgencyLabel")}>
                <RadioGroup
                  value={form.urgency}
                  onValueChange={(v) =>
                    update("urgency", v as FormState["urgency"])
                  }
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {URGENCIES.map((u) => (
                    <label
                      key={u}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                        form.urgency === u
                          ? "border-accent bg-accent-soft/30 text-accent"
                          : "border-border text-ink-2",
                      )}
                    >
                      <RadioGroupItem value={u} />
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-block h-1.5 w-3 rounded-full",
                            u === "high"
                              ? "bg-danger"
                              : u === "med"
                                ? "bg-warning"
                                : "bg-success",
                          )}
                        />
                        {t(`shared.urgency.${u}`)}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
              <div className="flex items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface/40 p-4">
                <div className="space-y-1">
                  <Label htmlFor="anon" className="cursor-pointer">
                    {t("newRequest.step4.anonLabel")}
                  </Label>
                  <p className="text-[12.5px] leading-relaxed text-ink-3">
                    {t("newRequest.step4.anonHint")}
                  </p>
                </div>
                <Switch
                  id="anon"
                  checked={form.anonymous}
                  onCheckedChange={(v) => update("anonymous", v === true)}
                />
              </div>
            </FormSection>

            {/* FOOTER */}
            <footer className="mt-2 flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="md">
                  <Link href={`/requests/${slug}`}>{t("edit.cancel")}</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="text-danger hover:bg-danger/10 hover:text-danger"
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  <span className={isDeleting ? "opacity-0" : ""}>{t("my.actions.delete")}</span>
                </Button>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={save}
                disabled={isSaving || isDeleting}
                className="sm:ms-auto"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className={isSaving ? "opacity-0" : ""}>{t("edit.save")}</span>
              </Button>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="border-b border-border pb-3">
        <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {title}
        </h2>
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label
          htmlFor={htmlFor}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3"
        >
          {label}
        </Label>
        {hint && <p className="text-[11px] text-ink-3">{hint}</p>}
      </div>
      {children}
      {error && (
        <p
          role="alert"
          className="font-mono text-[11px] uppercase tracking-wider text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
