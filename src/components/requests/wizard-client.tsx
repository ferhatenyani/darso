"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Edit3, Send } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const TOTAL_STEPS = 5;

type Draft = {
  title: string;
  subject: string;
  categories: string[];
  body: string;
  level: (typeof LEVELS)[number];
  audience: string;
  mode: (typeof MODES)[number];
  city: string;
  deadline: (typeof DEADLINES)[number];
  budgetMin: number;
  budgetMax: number;
  urgency: (typeof URGENCIES)[number];
  anonymous: boolean;
};

const DEFAULT_DRAFT: Draft = {
  title: "",
  subject: "",
  categories: [],
  body: "",
  level: "any",
  audience: "",
  mode: "both",
  city: "",
  deadline: "thisMonth",
  budgetMin: 1000,
  budgetMax: 2000,
  urgency: "med",
  anonymous: false,
};

export function RequestWizardClient() {
  const t = useTranslations("requests");
  const router = useRouter();
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stepLabels = useMemo(
    () => [
      t("newRequest.step1.label"),
      t("newRequest.step2.label"),
      t("newRequest.step3.label"),
      t("newRequest.step4.label"),
      t("newRequest.step5.label"),
    ],
    [t],
  );

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!draft.title.trim()) e.title = t("newRequest.step1.errorTitle");
      if (!draft.subject) e.subject = t("newRequest.step1.errorSubject");
    }
    if (s === 2) {
      if (!draft.body.trim() || draft.body.trim().length < 10)
        e.body = t("newRequest.step2.errorBody");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }
  function skip() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function publish() {
    // mock: route to a known existing slug for preview
    router.push("/requests/math-bac-revision-intensive" as never);
  }

  return (
    <>
      {/* Top breadcrumb */}
      <section className="border-b border-border bg-surface/40">
        <div className="container-narrow flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-foreground"
          >
            {locale === "ar" ? (
              <ArrowRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowLeft className="h-3.5 w-3.5" />
            )}
            {t("newRequest.backToList")}
          </Link>
          <span className="tabular">
            {t("newRequest.stepLabel", { current: step, total: TOTAL_STEPS })}
          </span>
        </div>
      </section>

      {/* Wizard */}
      <section className="container-narrow grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
        {/* LEFT — progress index */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-accent" />
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-accent">
                {t("newRequest.eyebrow")}
              </p>
            </div>
            <h1 className="mt-4 text-balance text-[32px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
              {t("newRequest.title")}
            </h1>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-2">
              {t("newRequest.subtitle")}
            </p>

            <ol className="mt-8 space-y-2">
              {stepLabels.map((label, i) => {
                const idx = i + 1;
                const isCurrent = step === idx;
                const isDone = step > idx;
                return (
                  <li
                    key={label}
                    className={cn(
                      "grid grid-cols-[auto_1fr] items-center gap-3 rounded-[var(--radius-md)] border border-transparent p-2.5 transition-colors",
                      isCurrent && "border-border bg-card shadow-e1",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-[6px] border font-mono text-[11px] font-semibold tabular",
                        isDone &&
                          "border-success bg-success text-success-foreground",
                        isCurrent && "border-accent bg-accent text-accent-foreground",
                        !isDone && !isCurrent &&
                          "border-border bg-surface text-ink-3",
                      )}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : idx}
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px] font-semibold",
                        isCurrent ? "text-foreground" : "text-ink-2",
                      )}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* RIGHT — current step content */}
        <div className="lg:col-span-8">
          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 md:p-8 shadow-e1">
            {step === 1 && (
              <Step1
                draft={draft}
                update={update}
                errors={errors}
              />
            )}
            {step === 2 && (
              <Step2
                draft={draft}
                update={update}
                errors={errors}
              />
            )}
            {step === 3 && (
              <Step3 draft={draft} update={update} />
            )}
            {step === 4 && (
              <Step4 draft={draft} update={update} />
            )}
            {step === 5 && (
              <Step5 draft={draft} onJump={setStep} />
            )}

            {/* FOOTER */}
            <footer className="mt-8 flex flex-col-reverse items-stretch gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {step > 1 && (
                  <Button variant="ghost" onClick={back}>
                    {locale === "ar" ? (
                      <ArrowRight className="h-4 w-4" />
                    ) : (
                      <ArrowLeft className="h-4 w-4" />
                    )}
                    {t("newRequest.footer.back")}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 sm:ms-auto">
                {step >= 2 && step <= 4 && (
                  <Button variant="link" onClick={skip}>
                    {t("newRequest.footer.skip")}
                  </Button>
                )}
                {step < TOTAL_STEPS ? (
                  <Button variant="primary" size="lg" onClick={next}>
                    {t("newRequest.footer.next")}
                    {locale === "ar" ? (
                      <ArrowLeft className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <Button variant="success" size="lg" onClick={publish}>
                    <Send className="h-4 w-4" />
                    {t("newRequest.footer.publish")}
                  </Button>
                )}
              </div>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
}

// === STEPS ===

function StepHeader({ no, total, name, hint }: { no: number; total: number; name: string; hint: string }) {
  const t = useTranslations("requests");
  return (
    <div className="border-b border-border pb-6">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-3 tabular">
        {t("newRequest.stepHeader.label", {
          n: String(no).padStart(2, "0"),
          total: String(total).padStart(2, "0"),
        })}
      </p>
      <h2 className="mt-2 text-[24px] font-bold tracking-tight text-foreground">
        {name}
      </h2>
      <p className="mt-1.5 text-[13.5px] text-ink-3 leading-relaxed">{hint}</p>
    </div>
  );
}

function Step1({
  draft,
  update,
  errors,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslations("requests");
  return (
    <div className="space-y-7">
      <StepHeader
        no={1}
        total={TOTAL_STEPS}
        name={t("newRequest.step1.title")}
        hint={t("newRequest.step1.hint")}
      />
      <Field
        label={t("newRequest.step1.titleLabel")}
        error={errors.title}
        htmlFor="title"
      >
        <Input
          id="title"
          value={draft.title}
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
          value={draft.subject}
          onValueChange={(v) => update("subject", v)}
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder={t("newRequest.step1.subjectPlaceholder")} />
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
      <Field
        label={t("newRequest.step1.categoryLabel")}
        hint={t("newRequest.step1.categoryHint")}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {SUBJECT_KEYS.map((k) => {
            const checked = draft.categories.includes(k);
            return (
              <label
                key={k}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium transition-colors",
                  checked
                    ? "border-accent bg-accent-soft/30 text-accent"
                    : "border-border text-ink-2 hover:border-border-strong",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    const next = v
                      ? [...draft.categories, k]
                      : draft.categories.filter((x) => x !== k);
                    update("categories", next);
                  }}
                />
                <span>{t(`shared.subjects.${k}`)}</span>
              </label>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function Step2({
  draft,
  update,
  errors,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslations("requests");
  return (
    <div className="space-y-7">
      <StepHeader
        no={2}
        total={TOTAL_STEPS}
        name={t("newRequest.step2.title")}
        hint={t("newRequest.step2.hint")}
      />
      <Field
        label={t("newRequest.step2.bodyLabel")}
        error={errors.body}
        hint={t("newRequest.step2.bodyHint")}
        htmlFor="body"
      >
        <Textarea
          id="body"
          value={draft.body}
          onChange={(e) => update("body", e.target.value)}
          placeholder={t("newRequest.step2.bodyPlaceholder")}
          rows={7}
          maxLength={1200}
        />
        <p className="mt-2 text-end font-mono text-[10.5px] text-ink-3 tabular">
          {draft.body.length} / 1200
        </p>
      </Field>
      <Field label={t("newRequest.step2.levelLabel")}>
        <RadioGroup
          value={draft.level}
          onValueChange={(v) => update("level", v as Draft["level"])}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {LEVELS.map((lv) => (
            <label
              key={lv}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                draft.level === lv
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
      <Field label={t("newRequest.step2.audienceLabel")} htmlFor="audience">
        <Select
          value={draft.audience}
          onValueChange={(v) => update("audience", v)}
        >
          <SelectTrigger id="audience">
            <SelectValue placeholder={t("newRequest.step2.audiencePlaceholder")} />
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
    </div>
  );
}

function Step3({
  draft,
  update,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const t = useTranslations("requests");
  return (
    <div className="space-y-7">
      <StepHeader
        no={3}
        total={TOTAL_STEPS}
        name={t("newRequest.step3.title")}
        hint={t("newRequest.step3.hint")}
      />
      <Field label={t("newRequest.step3.modeLabel")}>
        <RadioGroup
          value={draft.mode}
          onValueChange={(v) => update("mode", v as Draft["mode"])}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {MODES.map((m) => (
            <label
              key={m}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                draft.mode === m
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
      <Field label={t("newRequest.step3.cityLabel")} htmlFor="city">
        <Select value={draft.city} onValueChange={(v) => update("city", v)}>
          <SelectTrigger id="city">
            <SelectValue placeholder={t("newRequest.step3.cityPlaceholder")} />
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
          value={draft.deadline}
          onValueChange={(v) => update("deadline", v as Draft["deadline"])}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {DEADLINES.map((d) => (
            <label
              key={d}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                draft.deadline === d
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
    </div>
  );
}

function Step4({
  draft,
  update,
}: {
  draft: Draft;
  update: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();
  return (
    <div className="space-y-7">
      <StepHeader
        no={4}
        total={TOTAL_STEPS}
        name={t("newRequest.step4.title")}
        hint={t("newRequest.step4.hint")}
      />

      <Field
        label={t("newRequest.step4.budgetLabel")}
        hint={t("newRequest.step4.budgetHint")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="rounded-[var(--radius-md)] border border-border bg-background p-3">
              <p className="text-[9.5px] uppercase tracking-[0.22em] text-ink-3">
                {t("newRequest.budgetAxis.min")}
              </p>
              <p className="mt-1 text-[20px] font-bold text-foreground tabular">
                {formatPrice(draft.budgetMin, locale)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-accent/50 bg-accent-soft/30 p-3 text-end">
              <p className="text-[9.5px] uppercase tracking-[0.22em] text-accent">
                {t("newRequest.budgetAxis.max")}
              </p>
              <p className="mt-1 text-[20px] font-bold text-foreground tabular">
                {formatPrice(draft.budgetMax, locale)}
              </p>
            </div>
          </div>
          <Slider
            min={500}
            max={5000}
            step={100}
            value={[draft.budgetMin, draft.budgetMax]}
            onValueChange={(v) => {
              update("budgetMin", v[0] ?? draft.budgetMin);
              update("budgetMax", v[1] ?? draft.budgetMax);
            }}
            ariaLabel={t("newRequest.step4.budgetLabel")}
            format={(n) => formatPrice(n, locale)}
          />
        </div>
      </Field>

      <Field label={t("newRequest.step4.urgencyLabel")}>
        <RadioGroup
          value={draft.urgency}
          onValueChange={(v) => update("urgency", v as Draft["urgency"])}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {URGENCIES.map((u) => (
            <label
              key={u}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border bg-background px-3 py-2.5 text-[12.5px] font-medium",
                draft.urgency === u
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
          checked={draft.anonymous}
          onCheckedChange={(v) => update("anonymous", v === true)}
        />
      </div>
    </div>
  );
}

function Step5({
  draft,
  onJump,
}: {
  draft: Draft;
  onJump: (step: number) => void;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();

  function display(value: string, fallback = t("newRequest.step5.summaryEmpty")) {
    return value || fallback;
  }

  return (
    <div className="space-y-7">
      <StepHeader
        no={5}
        total={TOTAL_STEPS}
        name={t("newRequest.step5.title")}
        hint={t("newRequest.step5.hint")}
      />
      <Section
        title={t("newRequest.step5.sectionSubject")}
        onEdit={() => onJump(1)}
        editLabel={t("newRequest.step5.editStep")}
      >
        <Row label={t("newRequest.step1.titleLabel")} value={display(draft.title)} />
        <Row
          label={t("newRequest.step1.subjectLabel")}
          value={draft.subject ? t(`shared.subjects.${draft.subject}`) : "—"}
        />
        <Row
          label={t("newRequest.step1.categoryLabel")}
          value={
            draft.categories.length === 0
              ? "—"
              : draft.categories
                  .map((k) => t(`shared.subjects.${k}`))
                  .join(" · ")
          }
        />
      </Section>

      <Section
        title={t("newRequest.step5.sectionDetails")}
        onEdit={() => onJump(2)}
        editLabel={t("newRequest.step5.editStep")}
      >
        <p className="whitespace-pre-line text-pretty text-[13.5px] leading-relaxed text-ink-2">
          {display(draft.body)}
        </p>
        <Row label={t("newRequest.step2.levelLabel")} value={t(`shared.level.${draft.level}`)} />
        <Row
          label={t("newRequest.step2.audienceLabel")}
          value={draft.audience ? t(`shared.audience.${draft.audience}`) : "—"}
        />
      </Section>

      <Section
        title={t("newRequest.step5.sectionLogistics")}
        onEdit={() => onJump(3)}
        editLabel={t("newRequest.step5.editStep")}
      >
        <Row
          label={t("newRequest.step3.modeLabel")}
          value={t(
            draft.mode === "online"
              ? "shared.modes.online"
              : draft.mode === "in-person"
                ? "shared.modes.inPerson"
                : "shared.modes.both",
          )}
        />
        <Row
          label={t("newRequest.step3.cityLabel")}
          value={draft.city ? t(`shared.cities.${draft.city}`) : "—"}
        />
        <Row
          label={t("newRequest.step3.deadlineLabel")}
          value={t(`shared.deadlines.${draft.deadline}`)}
        />
      </Section>

      <Section
        title={t("newRequest.step5.sectionBudget")}
        onEdit={() => onJump(4)}
        editLabel={t("newRequest.step5.editStep")}
      >
        <Row
          label={t("newRequest.step4.budgetLabel")}
          value={
            <span className="tabular">
              {formatPrice(draft.budgetMin, locale)}
              <span className="px-1 text-ink-3">–</span>
              {formatPrice(draft.budgetMax, locale)}
            </span>
          }
        />
        <Row
          label={t("newRequest.step4.urgencyLabel")}
          value={t(`shared.urgency.${draft.urgency}`)}
        />
        <Row
          label={t("newRequest.step4.anonLabel")}
          value={draft.anonymous ? "✓" : "—"}
        />
      </Section>
    </div>
  );
}

// === Shared form sub-pieces ===

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
        <Label htmlFor={htmlFor} className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
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

function Section({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-border bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {title}
        </h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit3 className="h-3.5 w-3.5" />
          {editLabel}
        </Button>
      </header>
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-b border-dashed border-border pb-2 last:border-0 last:pb-0">
      <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-3">
        {label}
      </dt>
      <dd className="text-end text-[13px] font-medium text-foreground">{value}</dd>
    </div>
  );
}
