"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, CalendarClock, Users, Wallet, ListChecks, Clock3, Languages, Loader2 } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCurrentUser } from "@/lib/auth/context";
import { addEvent, type TeacherEventFormat } from "@/lib/mock/teacher-events-state";
import {
  getTeacherSettings,
  type ApprovalMode,
  type PaymentRouting,
} from "@/lib/mock/teacher-settings-state";
import { useToast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type AudienceKey = "students" | "parents" | "teachers";
const AUDIENCES: AudienceKey[] = ["students", "parents", "teachers"];

const steps = ["basics", "schedule", "audience", "pricing", "review"] as const;
type Step = (typeof steps)[number];

type EventDraft = {
  titleFr: string;
  titleAr: string;
  format: TeacherEventFormat;
  description: string;
  start: string; // datetime-local value
  end: string;
  capacity: number;
  targetAudience: AudienceKey[];
  language: string;
  isFree: boolean;
  priceDzd: number;
  refundPolicy: string;
  // Payment routing + approval — pre-filled from teacher settings,
  // overridable per event.
  paymentRouting: PaymentRouting;
  approvalMode: ApprovalMode;
};

function defaultDraft(routing: PaymentRouting, approval: ApprovalMode): EventDraft {
  // Default start: next round hour, +90 min end.
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 2);
  const end = new Date(d.getTime() + 90 * 60_000);
  return {
    titleFr: "",
    titleAr: "",
    format: "live-workshop",
    description: "",
    start: toLocalInput(d),
    end: toLocalInput(end),
    capacity: 30,
    targetAudience: ["students"],
    language: "fr",
    isFree: false,
    priceDzd: 1500,
    refundPolicy: "moderate",
    paymentRouting: routing,
    approvalMode: approval,
  };
}

/** Convert a Date to the value expected by <input type="datetime-local">. */
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local string → ISO with current timezone offset. */
function localInputToISO(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const STEP_ICONS: Record<Step, React.ComponentType<{ className?: string }>> = {
  basics: ListChecks,
  schedule: CalendarClock,
  audience: Users,
  pricing: Wallet,
  review: Check,
};

export function EventWizard({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("events.wizard");
  const tcommon = useTranslations("teacher.common");
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();

  const [step, setStep] = React.useState<Step>("basics");
  const [submitting, startSubmit] = React.useTransition();
  const [form, setForm] = React.useState<EventDraft>(() => {
    const s = getTeacherSettings();
    return defaultDraft(s.defaultPaymentRouting, s.defaultApprovalMode);
  });
  const idx = steps.indexOf(step);

  const update = React.useCallback(
    <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const validateAndPublish = React.useCallback(
    (status: "published" | "draft") => {
      const missing: { step: Step; field: string }[] = [];
      if (!form.titleFr.trim() && !form.titleAr.trim()) missing.push({ step: "basics", field: "title" });
      if (!form.start || !localInputToISO(form.start)) missing.push({ step: "schedule", field: "start" });
      if (!Number.isFinite(form.capacity) || form.capacity <= 0)
        missing.push({ step: "audience", field: "capacity" });
      if (!form.isFree && (!Number.isFinite(form.priceDzd) || form.priceDzd < 0))
        missing.push({ step: "pricing", field: "price" });

      // Status only enforces validation for published. Draft can save with
      // incomplete data — but we still ask for at least a title so the row
      // is recognizable in the listing.
      if (status === "published" && missing.length > 0) {
        show({
          title: t("toasts.missing.title"),
          description: t("toasts.missing.desc"),
          variant: "danger",
        });
        setStep(missing[0].step);
        return;
      }
      if (status === "draft" && !form.titleFr.trim() && !form.titleAr.trim()) {
        show({
          title: t("toasts.missing.title"),
          description: t("toasts.draftNeedsTitle"),
          variant: "danger",
        });
        setStep("basics");
        return;
      }

      const fr = form.titleFr.trim() || form.titleAr.trim();
      const ar = form.titleAr.trim() || form.titleFr.trim();

      startSubmit(() => {
        addEvent({
          title: { fr, ar },
          format: form.format,
          description: form.description.trim() || undefined,
          start: localInputToISO(form.start),
          end: localInputToISO(form.end) || undefined,
          timezone: "Africa/Algiers",
          capacity: form.capacity,
          targetAudience: form.targetAudience,
          language: form.language,
          priceDzd: form.isFree ? 0 : form.priceDzd,
          isFree: form.isFree,
          refundPolicy: form.refundPolicy,
          status,
          accountId: user?.id,
        });
        show({
          title:
            status === "published"
              ? t("toasts.published.title")
              : t("toasts.draftSaved.title"),
          description:
            status === "published"
              ? t("toasts.published.desc")
              : t("toasts.draftSaved.desc"),
          variant: "success",
        });
        router.push("/teach/events");
      });
    },
    [form, locale, router, show, t, user?.id],
  );

  // Lift navigation so each step's body stays focused on its own fields.
  const goPrev = () => setStep(steps[Math.max(0, idx - 1)]);
  const goNext = () => setStep(steps[Math.min(steps.length - 1, idx + 1)]);

  return (
    <div className="space-y-8">
      <StepIndicator current={step} onJump={setStep} locale={locale} />

      <section className="rounded-[var(--radius-xl)] border border-border bg-card">
        <header className="flex items-baseline justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3 tabular">
              {t("stepLabel", { current: idx + 1, total: steps.length })}
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-foreground">
              {t(`steps.${step}.title`)}
            </h2>
          </div>
          <p className="hidden max-w-sm text-end text-[12.5px] text-ink-3 sm:block">
            {t(`steps.${step}.hint`)}
          </p>
        </header>

        <div className="px-6 py-6">
          {step === "basics" && <BasicsStep form={form} update={update} />}
          {step === "schedule" && <ScheduleStep form={form} update={update} />}
          {step === "audience" && <AudienceStep form={form} update={update} />}
          {step === "pricing" && <PricingStep form={form} update={update} />}
          {step === "review" && (
            <ReviewStep
              form={form}
              locale={locale}
              submitting={submitting}
              onPublish={() => validateAndPublish("published")}
              onPublishLater={() => validateAndPublish("draft")}
              onJump={setStep}
            />
          )}
        </div>
      </section>

      <footer className="flex items-center justify-between gap-3">
        <Button variant="outline" disabled={idx === 0 || submitting} onClick={goPrev}>
          {tcommon("previous")}
        </Button>
        {step !== "review" ? (
          <Button variant="primary" onClick={goNext}>
            {tcommon("next")}
          </Button>
        ) : (
          <Button variant="primary" disabled={submitting} onClick={() => validateAndPublish("published")}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            <span className={submitting ? "opacity-0" : ""}>{t("publish")}</span>
          </Button>
        )}
      </footer>
    </div>
  );
}

/**
 * Custom step indicator. Avoids the generic shadcn stepper look — connects
 * steps with a single hairline rail, places the active step in a filled
 * pill, completed steps as outlined check chips, future steps as muted
 * monospace numerals. Clickable to allow free navigation.
 */
function StepIndicator({
  current,
  onJump,
  locale,
}: {
  current: Step;
  onJump: (s: Step) => void;
  locale: "fr" | "ar";
}) {
  const t = useTranslations("events.wizard.steps");
  const currentIdx = steps.indexOf(current);
  const progressPct = (currentIdx / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Wizard steps" className="rounded-[var(--radius-lg)] border border-border bg-card px-4 py-4 sm:px-6">
      {/* Rail with progress fill */}
      <div className="relative mb-4 h-px bg-border" aria-hidden>
        <div
          className="absolute inset-y-0 start-0 bg-accent transition-[width]"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <ol className="grid gap-2 sm:grid-cols-5">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[s];
          const active = i === currentIdx;
          const done = i < currentIdx;
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => onJump(s)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-[var(--radius-md)] px-2.5 py-2 text-start transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active && "bg-accent-soft/40",
                  !active && "hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold tabular transition-colors",
                    active && "bg-accent text-accent-foreground shadow-e1",
                    done && !active && "bg-success/14 text-success",
                    !active && !done && "bg-surface text-ink-3 group-hover:text-foreground",
                  )}
                  aria-hidden
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="min-w-0 pt-1">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                    {String(i + 1).padStart(2, "0")} {locale === "ar" ? "/" : "·"} {String(steps.length).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-[13px] font-semibold",
                      active ? "text-foreground" : "text-ink-2",
                    )}
                  >
                    {t(`${s}.title`)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BasicsStep({
  form,
  update,
}: {
  form: EventDraft;
  update: <K extends keyof EventDraft>(key: K, v: EventDraft[K]) => void;
}) {
  const t = useTranslations("events.wizard.basics");
  return (
    <div className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="e-title-fr">{t("titleFr")}</Label>
          <Input
            id="e-title-fr"
            dir="ltr"
            value={form.titleFr}
            onChange={(e) => update("titleFr", e.target.value)}
            placeholder={t("titleFrPlaceholder")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="e-title-ar">{t("titleAr")}</Label>
          <Input
            id="e-title-ar"
            dir="rtl"
            value={form.titleAr}
            onChange={(e) => update("titleAr", e.target.value)}
            placeholder={t("titleArPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-2 max-w-md">
        <Label>{t("format")}</Label>
        <Select
          value={form.format}
          onValueChange={(v) => update("format", v as TeacherEventFormat)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live-workshop">{t("formatOptions.liveWorkshop")}</SelectItem>
            <SelectItem value="cohort">{t("formatOptions.cohort")}</SelectItem>
            <SelectItem value="open-house">{t("formatOptions.openHouse")}</SelectItem>
            <SelectItem value="recording-premiere">{t("formatOptions.recordingPremiere")}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[11.5px] text-ink-3">{t("formatHint")}</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="e-desc">{t("description")}</Label>
        <Textarea
          id="e-desc"
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder={t("descriptionPlaceholder")}
        />
        <p className="text-[11.5px] text-ink-3">{t("descriptionHint")}</p>
      </div>
    </div>
  );
}

function ScheduleStep({
  form,
  update,
}: {
  form: EventDraft;
  update: <K extends keyof EventDraft>(key: K, v: EventDraft[K]) => void;
}) {
  const t = useTranslations("events.wizard.schedule");
  return (
    <div className="grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="start">{t("start")}</Label>
          <Input
            id="start"
            type="datetime-local"
            dir="ltr"
            value={form.start}
            onChange={(e) => update("start", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end">{t("end")}</Label>
          <Input
            id="end"
            type="datetime-local"
            dir="ltr"
            value={form.end}
            onChange={(e) => update("end", e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface/60 px-3 py-2.5 text-[12.5px] text-ink-2">
        <Clock3 className="h-4 w-4 text-ink-3" aria-hidden />
        <span>{t("timezoneNotice")}</span>
        <span className="ms-auto font-mono text-[11px] font-semibold tabular text-foreground">Africa/Algiers</span>
      </div>
    </div>
  );
}

function AudienceStep({
  form,
  update,
}: {
  form: EventDraft;
  update: <K extends keyof EventDraft>(key: K, v: EventDraft[K]) => void;
}) {
  const t = useTranslations("events.wizard.audience");

  function toggle(key: AudienceKey) {
    const has = form.targetAudience.includes(key);
    update(
      "targetAudience",
      has ? form.targetAudience.filter((k) => k !== key) : [...form.targetAudience, key],
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="capacity">{t("capacity")}</Label>
        <Input
          id="capacity"
          type="number"
          min={1}
          max={500}
          value={form.capacity}
          onChange={(e) => update("capacity", Number(e.target.value) || 0)}
        />
        <p className="text-[11.5px] text-ink-3">{t("capacityHint")}</p>
      </div>

      <div className="grid gap-3">
        <Label>{t("target")}</Label>
        <ul className="grid gap-2 sm:grid-cols-3">
          {AUDIENCES.map((key) => {
            const checked = form.targetAudience.includes(key);
            return (
              <li key={key}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-md)] border bg-background p-3 transition-colors",
                    checked ? "border-accent bg-accent-soft/30" : "border-border hover:bg-surface",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(key)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{t(`audiences.${key}`)}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-3">{t(`audienceHints.${key}`)}</p>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label>{t("language")}</Label>
        <Select value={form.language} onValueChange={(v) => update("language", v)}>
          <SelectTrigger>
            <span className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-ink-3" aria-hidden />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="mixed">{t("languageMixed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PricingStep({
  form,
  update,
}: {
  form: EventDraft;
  update: <K extends keyof EventDraft>(key: K, v: EventDraft[K]) => void;
}) {
  const t = useTranslations("events.wizard.pricing");
  return (
    <div className="grid gap-6">
      <label
        className={cn(
          "flex cursor-pointer items-start justify-between gap-4 rounded-[var(--radius-md)] border bg-background p-4 transition-colors",
          form.isFree ? "border-accent bg-accent-soft/30" : "border-border hover:bg-surface",
        )}
      >
        <div>
          <p className="text-[14px] font-semibold text-foreground">{t("free")}</p>
          <p className="mt-0.5 text-[12px] text-ink-3">{t("freeHint")}</p>
        </div>
        <Switch checked={form.isFree} onCheckedChange={(v) => update("isFree", v)} />
      </label>

      <div
        className={cn(
          "grid gap-2 max-w-xs transition-opacity",
          form.isFree && "pointer-events-none opacity-50",
        )}
      >
        <Label htmlFor="e-price">{t("price")}</Label>
        <div className="flex items-center gap-3">
          <Input
            id="e-price"
            type="number"
            min={0}
            value={form.priceDzd}
            onChange={(e) => update("priceDzd", Number(e.target.value) || 0)}
            disabled={form.isFree}
            className="w-40"
          />
          <span className="font-mono text-[12px] font-semibold tabular text-ink-3">DZD</span>
        </div>
        <p className="text-[11.5px] text-ink-3">{t("priceHint")}</p>
      </div>

      <div className="grid gap-2 max-w-md">
        <Label>{t("refundPolicy")}</Label>
        <Select value={form.refundPolicy} onValueChange={(v) => update("refundPolicy", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flexible">{t("refundOptions.flexible")}</SelectItem>
            <SelectItem value="moderate">{t("refundOptions.moderate")}</SelectItem>
            <SelectItem value="strict">{t("refundOptions.strict")}</SelectItem>
            <SelectItem value="none">{t("refundOptions.none")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Approval mode — per-event override of teacher-level default */}
      <div className="border-t border-border pt-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">
          Inscription
        </p>
        <p className="mt-1 text-[12.5px] text-ink-2">
          Comment les élèves réservent-ils leur place ?
        </p>
        <RadioGroup
          value={form.approvalMode}
          onValueChange={(v) => update("approvalMode", v as ApprovalMode)}
          className="mt-3 grid gap-2 md:grid-cols-2"
        >
          <label
            htmlFor="ev-am-instant"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 transition-colors",
              form.approvalMode === "instant" ? "border-accent bg-accent-soft/40" : "border-border",
            )}
          >
            <RadioGroupItem id="ev-am-instant" value="instant" className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">Réservation instantanée</p>
              <p className="mt-0.5 text-[11.5px] text-ink-2">Recommandé pour les événements ouverts.</p>
            </div>
          </label>
          <label
            htmlFor="ev-am-approval"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 transition-colors",
              form.approvalMode === "approval" ? "border-accent bg-accent-soft/40" : "border-border",
            )}
          >
            <RadioGroupItem id="ev-am-approval" value="approval" className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">Approbation manuelle</p>
              <p className="mt-0.5 text-[11.5px] text-ink-2">Si prérequis ou VIP.</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Payment routing */}
      <div className="border-t border-border pt-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">
          Paiement
        </p>
        <p className="mt-1 text-[12.5px] text-ink-2">
          Où le paiement doit-il transiter ?
        </p>
        <RadioGroup
          value={form.paymentRouting}
          onValueChange={(v) => update("paymentRouting", v as PaymentRouting)}
          className="mt-3 grid gap-2 md:grid-cols-2"
        >
          <label
            htmlFor="ev-pr-direct"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 transition-colors",
              form.paymentRouting === "direct" ? "border-accent bg-accent-soft/40" : "border-border",
            )}
          >
            <RadioGroupItem id="ev-pr-direct" value="direct" className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">Paiement direct</p>
              <p className="mt-0.5 text-[11.5px] text-ink-2">L'élève vous paie directement.</p>
            </div>
          </label>
          <label
            htmlFor="ev-pr-platform"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 transition-colors opacity-60",
              form.paymentRouting === "platform" ? "border-accent bg-accent-soft/40" : "border-border",
            )}
          >
            <RadioGroupItem id="ev-pr-platform" value="platform" disabled className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground">Paiement plateforme</p>
              <p className="mt-0.5 text-[11.5px] text-ink-2">Bientôt disponible (v2).</p>
            </div>
          </label>
        </RadioGroup>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  locale,
  submitting,
  onPublish,
  onPublishLater,
  onJump,
}: {
  form: EventDraft;
  locale: "fr" | "ar";
  submitting: boolean;
  onPublish: () => void;
  onPublishLater: () => void;
  onJump: (s: Step) => void;
}) {
  const t = useTranslations("events.wizard.review");
  const tw = useTranslations("events.wizard");
  const tb = useTranslations("events.wizard.basics");
  const tp = useTranslations("events.wizard.pricing");
  const ta = useTranslations("events.wizard.audience");

  const title = locale === "ar" ? form.titleAr || form.titleFr : form.titleFr || form.titleAr;
  const formatLabel = tb(`formatOptions.${formatToKey(form.format)}` as const);

  return (
    <div className="grid gap-6">
      <div className="rounded-[var(--radius-lg)] bg-surface/50 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          {tw(`steps.review.title`)}
        </p>
        <h3 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
          {title || tw("review.untitled")}
        </h3>
        <p className="mt-1 text-[12.5px] text-ink-3">{formatLabel}</p>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border [&>div]:bg-card">
        <SummaryRow label={t("when")} onEdit={() => onJump("schedule")}>
          <span className="font-mono tabular">{formatRange(form.start, form.end, locale)}</span>
        </SummaryRow>
        <SummaryRow label={t("audience")} onEdit={() => onJump("audience")}>
          <span>
            {form.capacity} {ta("capacityUnit")} ·{" "}
            {form.targetAudience.map((k) => ta(`audiences.${k}`)).join(" · ") || "—"}
          </span>
        </SummaryRow>
        <SummaryRow label={t("language")} onEdit={() => onJump("audience")}>
          <span>{form.language === "mixed" ? ta("languageMixed") : form.language.toUpperCase()}</span>
        </SummaryRow>
        <SummaryRow label={t("price")} onEdit={() => onJump("pricing")}>
          <span className="font-mono tabular">
            {form.isFree ? tp("free") : formatPrice(form.priceDzd, locale)}
          </span>
        </SummaryRow>
        <SummaryRow label={t("refund")} onEdit={() => onJump("pricing")}>
          <span>{tp(`refundOptions.${form.refundPolicy as "flexible" | "moderate" | "strict" | "none"}`)}</span>
        </SummaryRow>
      </dl>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
        <Button variant="primary" size="lg" disabled={submitting} onClick={onPublish}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={submitting ? "opacity-0" : ""}>{tw("publish")}</span>
        </Button>
        <Button variant="outline" size="lg" disabled={submitting} onClick={onPublishLater}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={submitting ? "opacity-0" : ""}>{tw("publishLater")}</span>
        </Button>
        <p className="ms-auto max-w-xs text-end text-[11.5px] text-ink-3">{t("legalNote")}</p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  const t = useTranslations("events.wizard.review");
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</dt>
      <dd className="flex flex-1 items-center justify-end gap-3 text-[13.5px] text-foreground">
        {children}
        <button
          type="button"
          onClick={onEdit}
          className="rounded text-[12px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("edit")}
        </button>
      </dd>
    </div>
  );
}

function formatToKey(f: TeacherEventFormat): "liveWorkshop" | "cohort" | "openHouse" | "recordingPremiere" {
  if (f === "live-workshop") return "liveWorkshop";
  if (f === "open-house") return "openHouse";
  if (f === "recording-premiere") return "recordingPremiere";
  return "cohort";
}

function formatRange(startLocal: string, endLocal: string, locale: "fr" | "ar"): string {
  if (!startLocal) return "—";
  const start = new Date(startLocal);
  if (Number.isNaN(start.getTime())) return "—";
  const dateFmt: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  const timeFmt: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const intlLocale = locale === "ar" ? "ar-DZ" : "fr-DZ";
  const left = `${start.toLocaleDateString(intlLocale, dateFmt)} · ${start.toLocaleTimeString(intlLocale, timeFmt)}`;
  if (!endLocal) return left;
  const end = new Date(endLocal);
  if (Number.isNaN(end.getTime())) return left;
  return `${left} → ${end.toLocaleTimeString(intlLocale, timeFmt)}`;
}
