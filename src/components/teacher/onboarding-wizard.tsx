"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Camera,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Banknote,
  ScrollText,
  Loader2,
  Lock,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileInput } from "@/components/ui/file-input";
import { Logo } from "@/components/brand/logo";
import { useToast } from "@/lib/toast";
import { useCurrentUser } from "@/lib/auth/context";
import {
  setPayoutMethod,
  setPayoutFrequency,
  type PayoutFrequency,
} from "@/lib/mock/payouts-state";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------- */
/*  Local payout draft shape                                              */
/* --------------------------------------------------------------------- */

/**
 * Local draft shape used by Step 3. Field names mirror Agent 9b's
 * `PayoutMethod` in `@/lib/mock/payouts-state` so the wizard can submit
 * directly via `setPayoutMethod` on finish — no field renaming.
 */
type PayoutDraft = {
  accountHolder: string;
  bankName: string;
  rib: string;
  currency: "DZD" | "EUR";
  schedule: PayoutFrequency;
};

const TOTAL_STEPS = 4;
const COOKIE_NAME = "darso_teacher_onboarding_complete";

const ID_TYPES = ["passport", "national", "license"] as const;
type IdType = (typeof ID_TYPES)[number];

const SUBJECT_KEYS = [
  "math",
  "physics",
  "biology",
  "french",
  "arabic",
  "english",
  "history",
  "philosophy",
  "programming",
  "music",
  "quran",
  "ielts",
] as const;

const LANGUAGE_KEYS = ["fr", "ar", "en", "kab", "es"] as const;

const BANK_KEYS = [
  "bna",
  "bea",
  "bdl",
  "cnep",
  "cpa",
  "agb",
  "natixis",
  "sgalgerie",
] as const;

const STEP_ICONS = [ShieldCheck, GraduationCap, Banknote, ScrollText] as const;

/* --------------------------------------------------------------------- */
/*  Public island                                                         */
/* --------------------------------------------------------------------- */

export function TeacherOnboardingWizard() {
  const t = useTranslations("teacher.onboarding");
  const locale = useLocale();
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const [step, setStep] = React.useState(1);
  const [submitting, startSubmit] = React.useTransition();

  // Step 1 — identity
  const [idType, setIdType] = React.useState<IdType>("national");
  const [idNumber, setIdNumber] = React.useState("");
  const [idFiles, setIdFiles] = React.useState<File[]>([]);
  const [selfieCaptured, setSelfieCaptured] = React.useState(false);

  // Step 2 — diploma & expertise
  const [diplomaFiles, setDiplomaFiles] = React.useState<File[]>([]);
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [experience, setExperience] = React.useState("");
  const [languages, setLanguages] = React.useState<string[]>(["fr", "ar"]);

  // Step 3 — payout (draft mirrors Agent 9b's PayoutMethod field names)
  const [payout, setPayout] = React.useState<PayoutDraft>({
    accountHolder: "",
    bankName: "",
    rib: "",
    currency: "DZD",
    schedule: "weekly",
  });

  // Step 4 — terms
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptAccuracy, setAcceptAccuracy] = React.useState(false);

  const StepIcon = STEP_ICONS[step - 1];

  const canAdvance = React.useMemo(() => {
    if (step === 1) return idFiles.length > 0 && idNumber.trim().length >= 4 && selfieCaptured;
    if (step === 2) return diplomaFiles.length > 0 && subjects.length > 0 && experience.trim().length > 0 && languages.length > 0;
    if (step === 3) return payout.accountHolder.trim().length > 1 && payout.bankName.length > 0 && payout.rib.replace(/\s/g, "").length >= 16;
    if (step === 4) return acceptTerms && acceptAccuracy;
    return false;
  }, [step, idFiles, idNumber, selfieCaptured, diplomaFiles, subjects, experience, languages, payout, acceptTerms, acceptAccuracy]);

  function toggleSubject(key: string) {
    setSubjects((prev) => {
      if (prev.includes(key)) return prev.filter((x) => x !== key);
      if (prev.length >= 5) return prev;
      return [...prev, key];
    });
  }
  function toggleLanguage(key: string) {
    setLanguages((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  }

  function markComplete() {
    if (typeof document === "undefined") return;
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_NAME}=1; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
  }

  function next() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    startSubmit(() => {
      // Persist payout to 9b's store when we have an authenticated teacher.
      if (user?.id) {
        setPayoutMethod(user.id, {
          bankName: payout.bankName,
          accountHolder: payout.accountHolder,
          rib: payout.rib.replace(/\s/g, ""),
        });
        setPayoutFrequency(user.id, payout.schedule);
      }
      markComplete();
      show({
        variant: "success",
        title: t("completeToast.title"),
        description: t("completeToast.desc"),
      });
      router.push("/teach/dashboard" as never);
    });
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Top bar — minimal chrome (logo + step indicator + skip) */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-narrow flex items-center gap-4 py-4">
          <Link href="/" className="inline-flex items-center" aria-label="darso">
            <Logo />
          </Link>
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const n = i + 1;
              const Icon = STEP_ICONS[i];
              const state: "done" | "current" | "todo" =
                n < step ? "done" : n === step ? "current" : "todo";
              return (
                <React.Fragment key={n}>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                      state === "done" && "border-success/30 bg-success/10 text-success",
                      state === "current" && "border-foreground bg-foreground text-background",
                      state === "todo" && "border-border bg-background text-ink-3",
                    )}
                  >
                    {state === "done" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="tabular">{String(n).padStart(2, "0")}</span>
                    <span className="hidden lg:inline">{t(`stepNav.${stepKey(n)}` as never)}</span>
                  </div>
                  {n < TOTAL_STEPS && (
                    <span
                      className={cn(
                        "h-px w-6 transition-colors",
                        n < step ? "bg-success/50" : "bg-border",
                      )}
                      aria-hidden
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex-1 md:hidden">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("stepLabel", { n: step, total: TOTAL_STEPS })}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">
              {t(`steps.${stepKey(step)}.title` as never)}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-ink-3">
            <Link href="/teach/dashboard">{t("skip")}</Link>
          </Button>
        </div>
      </header>

      <main className="container-narrow grid gap-10 py-12 md:py-16">
        <section className="mx-auto w-full max-w-2xl">
          {/* Header block per step */}
          <div className="mb-8 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-border bg-card text-foreground shadow-e1">
              <StepIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("eyebrow")}
              </p>
              <h1 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[34px]">
                {t(`steps.${stepKey(step)}.title` as never)}
              </h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                {t(`steps.${stepKey(step)}.hint` as never)}
              </p>
            </div>
          </div>

          {/* Step body */}
          <div className="grid gap-6">
            {step === 1 && (
              <StepIdentity
                idType={idType}
                setIdType={setIdType}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                idFiles={idFiles}
                setIdFiles={setIdFiles}
                selfieCaptured={selfieCaptured}
                onCaptureSelfie={() => {
                  setSelfieCaptured(true);
                  show({
                    variant: "success",
                    title: t("steps.identity.selfieToast.title"),
                    description: t("steps.identity.selfieToast.desc"),
                  });
                }}
                onRetake={() => setSelfieCaptured(false)}
              />
            )}
            {step === 2 && (
              <StepDiploma
                diplomaFiles={diplomaFiles}
                setDiplomaFiles={setDiplomaFiles}
                subjects={subjects}
                toggleSubject={toggleSubject}
                experience={experience}
                setExperience={setExperience}
                languages={languages}
                toggleLanguage={toggleLanguage}
              />
            )}
            {step === 3 && <StepPayout payout={payout} setPayout={setPayout} />}
            {step === 4 && (
              <StepTerms
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                acceptAccuracy={acceptAccuracy}
                setAcceptAccuracy={setAcceptAccuracy}
              />
            )}
          </div>

          {/* Secure footnote */}
          <p className="mt-8 inline-flex items-center gap-1.5 text-[12px] text-ink-3">
            <Lock className="h-3.5 w-3.5" />
            {t("secureNote")}
          </p>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-2 border-t border-border pt-6">
            {step > 1 ? (
              <Button variant="ghost" size="md" onClick={back} disabled={submitting}>
                <Back className="h-4 w-4" />
                {t("back")}
              </Button>
            ) : (
              <span />
            )}
            <Button
              size="md"
              onClick={next}
              className="ms-auto"
              disabled={!canAdvance || submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              <span className={submitting ? "opacity-0" : "inline-flex items-center gap-2"}>
                {step === TOTAL_STEPS ? t("finish") : t("next")}
                <Arrow className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function stepKey(n: number): "identity" | "diploma" | "payout" | "terms" {
  return (["identity", "diploma", "payout", "terms"] as const)[n - 1];
}

/* --------------------------------------------------------------------- */
/*  Step 1 — Identity verification                                        */
/* --------------------------------------------------------------------- */

function StepIdentity({
  idType,
  setIdType,
  idNumber,
  setIdNumber,
  idFiles,
  setIdFiles,
  selfieCaptured,
  onCaptureSelfie,
  onRetake,
}: {
  idType: IdType;
  setIdType: (v: IdType) => void;
  idNumber: string;
  setIdNumber: (v: string) => void;
  idFiles: File[];
  setIdFiles: (v: File[]) => void;
  selfieCaptured: boolean;
  onCaptureSelfie: () => void;
  onRetake: () => void;
}) {
  const t = useTranslations("teacher.onboarding.steps.identity");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="id-type">{t("idTypeLabel")}</Label>
          <Select value={idType} onValueChange={(v) => setIdType(v as IdType)}>
            <SelectTrigger id="id-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">{t("idTypePassport")}</SelectItem>
              <SelectItem value="national">{t("idTypeNational")}</SelectItem>
              <SelectItem value="license">{t("idTypeLicense")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="id-number">{t("idNumberLabel")}</Label>
          <Input
            id="id-number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder={t("idNumberPlaceholder")}
            inputMode="numeric"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{t("uploadLabel")}</Label>
        <FileInput
          accept="application/pdf,image/*"
          value={idFiles}
          onValueChange={setIdFiles}
          label={t("uploadLabel")}
          hint={t("uploadHint")}
        />
      </div>

      <div className="grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-foreground">{t("selfieLabel")}</p>
            <p className="mt-1 text-[12.5px] text-ink-3">{t("selfieHint")}</p>
          </div>
          {selfieCaptured ? (
            <Button variant="ghost" size="sm" onClick={onRetake} type="button">
              <RefreshCw className="h-4 w-4" />
              {t("selfieRetake")}
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative grid h-16 w-16 shrink-0 place-items-center rounded-full border text-background transition-all",
              selfieCaptured
                ? "border-success/40 bg-primary text-primary-foreground"
                : "border-dashed border-border bg-surface text-ink-3",
            )}
            aria-hidden
          >
            {selfieCaptured ? (
              <CheckCircle2 className="h-6 w-6 text-white drop-shadow" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </div>
          <Button
            type="button"
            variant={selfieCaptured ? "secondary" : "primary"}
            size="sm"
            onClick={onCaptureSelfie}
            disabled={selfieCaptured}
          >
            <Camera className="h-4 w-4" />
            {selfieCaptured ? t("selfieDone") : t("selfieCapture")}
          </Button>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------------------- */
/*  Step 2 — Diploma & expertise                                          */
/* --------------------------------------------------------------------- */

function StepDiploma({
  diplomaFiles,
  setDiplomaFiles,
  subjects,
  toggleSubject,
  experience,
  setExperience,
  languages,
  toggleLanguage,
}: {
  diplomaFiles: File[];
  setDiplomaFiles: (v: File[]) => void;
  subjects: string[];
  toggleSubject: (k: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  languages: string[];
  toggleLanguage: (k: string) => void;
}) {
  const t = useTranslations("teacher.onboarding.steps.diploma");
  const tSubjects = useTranslations("teacher.onboarding.steps.subjects");
  const tLanguages = useTranslations("teacher.onboarding.steps.languages");

  return (
    <>
      <div className="grid gap-2">
        <Label>{t("uploadLabel")}</Label>
        <FileInput
          accept="application/pdf,image/*"
          multiple
          value={diplomaFiles}
          onValueChange={setDiplomaFiles}
          label={t("uploadLabel")}
          hint={t("uploadHint")}
        />
      </div>

      <fieldset className="grid gap-3">
        <div className="flex items-baseline justify-between">
          <legend className="text-sm font-medium text-foreground">{t("subjectsLabel")}</legend>
          <span
            className={cn(
              "text-[11px] font-semibold tabular",
              subjects.length === 0 ? "text-ink-3" : "text-foreground",
            )}
          >
            {subjects.length}/5
          </span>
        </div>
        <p className="text-[12px] text-ink-3">{t("subjectsHint")}</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_KEYS.map((key) => {
            const active = subjects.includes(key);
            const atLimit = !active && subjects.length >= 5;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSubject(key)}
                disabled={atLimit}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-ink-2 hover:border-foreground hover:text-foreground",
                  atLimit && "cursor-not-allowed opacity-50 hover:border-border hover:text-ink-2",
                )}
              >
                {tSubjects(key as never)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="experience">{t("experienceLabel")}</Label>
          <Input
            id="experience"
            type="number"
            min={0}
            max={60}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder={t("experiencePlaceholder")}
          />
        </div>
        <div className="grid gap-2">
          <Label>{t("languagesLabel")}</Label>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGE_KEYS.map((key) => {
              const active = languages.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleLanguage(key)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-[var(--radius-md)] border px-2.5 py-1.5 text-[12.5px] font-medium uppercase tracking-[0.1em] transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-ink-2 hover:border-foreground hover:text-foreground",
                  )}
                >
                  {tLanguages(key as never)}
                </button>
              );
            })}
          </div>
          <p className="text-[12px] text-ink-3">{t("languagesHint")}</p>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------------------- */
/*  Step 3 — Payout setup                                                 */
/* --------------------------------------------------------------------- */

function StepPayout({
  payout,
  setPayout,
}: {
  payout: PayoutDraft;
  setPayout: React.Dispatch<React.SetStateAction<PayoutDraft>>;
}) {
  const t = useTranslations("teacher.onboarding.steps.payout");
  const tBanks = useTranslations("teacher.onboarding.steps.banks");

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="holder">{t("holderLabel")}</Label>
        <Input
          id="holder"
          value={payout.accountHolder}
          onChange={(e) => setPayout((p) => ({ ...p, accountHolder: e.target.value }))}
          placeholder={t("holderPlaceholder")}
          autoComplete="name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <div className="grid gap-2">
          <Label htmlFor="bank">{t("bankLabel")}</Label>
          <Select
            value={payout.bankName}
            onValueChange={(v) => setPayout((p) => ({ ...p, bankName: v }))}
          >
            <SelectTrigger id="bank">
              <SelectValue placeholder={t("bankPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {BANK_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {tBanks(k as never)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="iban">{t("ibanLabel")}</Label>
          <Input
            id="iban"
            value={payout.rib}
            onChange={(e) => setPayout((p) => ({ ...p, rib: e.target.value.toUpperCase() }))}
            placeholder={t("ibanPlaceholder")}
            spellCheck={false}
            className="tabular tracking-wider"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-foreground">{t("currencyLabel")}</legend>
          <RadioGroup
            value={payout.currency}
            onValueChange={(v) => setPayout((p) => ({ ...p, currency: v as PayoutDraft["currency"] }))}
            className="grid gap-2"
          >
            <CurrencyPick value="DZD" current={payout.currency} label={t("currencyDzd")} />
            <CurrencyPick value="EUR" current={payout.currency} label={t("currencyEur")} disabled />
          </RadioGroup>
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-foreground">{t("scheduleLabel")}</legend>
          <RadioGroup
            value={payout.schedule}
            onValueChange={(v) => setPayout((p) => ({ ...p, schedule: v as PayoutFrequency }))}
            className="grid gap-2 sm:grid-cols-2"
          >
            <SchedulePick value="weekly" current={payout.schedule} label={t("scheduleWeekly")} />
            <SchedulePick value="monthly" current={payout.schedule} label={t("scheduleMonthly")} />
          </RadioGroup>
        </fieldset>
      </div>

      <p className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-[12.5px] text-ink-2">
        {t("feeNote")}
      </p>
    </>
  );
}

function CurrencyPick({
  value,
  current,
  label,
  disabled,
}: {
  value: PayoutDraft["currency"];
  current: PayoutDraft["currency"];
  label: string;
  disabled?: boolean;
}) {
  return (
    <Label
      htmlFor={`cur-${value}`}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3",
        !disabled && "hover:border-border-strong",
        current === value && !disabled && "border-foreground bg-surface",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <RadioGroupItem id={`cur-${value}`} value={value} disabled={disabled} />
      <span className="text-[13.5px] font-medium text-foreground">{label}</span>
    </Label>
  );
}

function SchedulePick({
  value,
  current,
  label,
}: {
  value: PayoutFrequency;
  current: PayoutFrequency;
  label: string;
}) {
  return (
    <Label
      htmlFor={`sch-${value}`}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3 hover:border-border-strong",
        current === value && "border-foreground bg-surface",
      )}
    >
      <RadioGroupItem id={`sch-${value}`} value={value} />
      <span className="text-[13.5px] font-medium text-foreground">{label}</span>
    </Label>
  );
}

/* --------------------------------------------------------------------- */
/*  Step 4 — Terms acceptance                                             */
/* --------------------------------------------------------------------- */

function StepTerms({
  acceptTerms,
  setAcceptTerms,
  acceptAccuracy,
  setAcceptAccuracy,
}: {
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  acceptAccuracy: boolean;
  setAcceptAccuracy: (v: boolean) => void;
}) {
  const t = useTranslations("teacher.onboarding.steps.terms");
  const paragraphs = (t.raw("agreementParagraphs") as string[]) ?? [];

  return (
    <>
      <article className="rounded-[var(--radius-lg)] border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            {t("agreementTitle")}
          </p>
          <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
            {t("scrollHint")}
          </span>
        </header>
        <div className="max-h-72 overflow-y-auto px-5 py-4">
          <div className="space-y-3 text-[13.5px] leading-relaxed text-foreground">
            {paragraphs.map((p, i) => (
              <p key={i}>
                <span className="me-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3 tabular">
                  §{String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>

      <div className="grid gap-3">
        <Label
          htmlFor="ack-terms"
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 transition-colors",
            "hover:border-border-strong",
            acceptTerms && "border-foreground bg-surface",
          )}
        >
          <Checkbox
            id="ack-terms"
            checked={acceptTerms}
            onCheckedChange={(c) => setAcceptTerms(c === true)}
            className="mt-0.5"
          />
          <span className="text-[13.5px] leading-relaxed text-foreground">{t("acceptTerms")}</span>
        </Label>
        <Label
          htmlFor="ack-accuracy"
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 transition-colors",
            "hover:border-border-strong",
            acceptAccuracy && "border-foreground bg-surface",
          )}
        >
          <Checkbox
            id="ack-accuracy"
            checked={acceptAccuracy}
            onCheckedChange={(c) => setAcceptAccuracy(c === true)}
            className="mt-0.5"
          />
          <span className="text-[13.5px] leading-relaxed text-foreground">{t("acceptAccuracy")}</span>
        </Label>
      </div>
    </>
  );
}
