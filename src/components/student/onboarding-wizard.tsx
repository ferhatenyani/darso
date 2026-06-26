"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Users,
  Wifi,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";
import { interestSeeds } from "@/lib/mock/students";
import { wilayaKeys } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

const TOTAL = 4;

export function OnboardingWizard() {
  const t = useTranslations("student.onboarding");
  const tWilayas = useTranslations("search.wilayas");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"learn" | "teach" | "both">("learn");
  const [interests, setInterests] = useState<string[]>([]);
  const [audience, setAudience] = useState<"kids" | "lycee" | "student" | "adult">("lycee");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | "mixed">("intermediate");
  const [wilaya, setWilaya] = useState<string>("constantine");
  const [mode, setMode] = useState<"online" | "in-person" | "both">("both");

  const progress = (step / TOTAL) * 100;

  function next() {
    if (step < TOTAL) {
      setStep(step + 1);
    } else {
      router.push("/browse" as never);
    }
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-narrow flex items-center gap-4 py-4">
          <Link href="/" className="inline-flex items-center">
            <Logo />
          </Link>
          <div className="flex-1 px-2">
            <div className="flex items-baseline justify-between text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              <span>{t("step", { n: step, total: TOTAL })}</span>
              <span className="tabular text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="mt-1.5" />
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-ink-3"
          >
            <Link href="/browse">{t("skipAll")}</Link>
          </Button>
        </div>
      </header>

      <main className="container-narrow grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_320px] lg:gap-16">
        <section>
          {/* Editorial step rail */}
          <div className="mb-6 flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    "tabular",
                    i + 1 === step
                      ? "text-accent"
                      : i + 1 < step
                        ? "text-foreground"
                        : "text-ink-3",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < TOTAL - 1 && <span className="h-px w-6 bg-border" aria-hidden />}
              </span>
            ))}
          </div>

          {step === 1 && (
            <Step1 role={role} setRole={setRole} />
          )}
          {step === 2 && (
            <Step2 interests={interests} setInterests={setInterests} />
          )}
          {step === 3 && (
            <Step3
              audience={audience}
              setAudience={setAudience}
              level={level}
              setLevel={setLevel}
            />
          )}
          {step === 4 && (
            <Step4
              wilaya={wilaya}
              setWilaya={setWilaya}
              mode={mode}
              setMode={setMode}
              role={role}
              interests={interests}
              audience={audience}
              level={level}
            />
          )}

          {/* Footer controls */}
          <div className="mt-10 flex items-center gap-2">
            {step > 1 && (
              <Button variant="ghost" size="md" onClick={back}>
                <Back className="h-4 w-4" />
                {t("back")}
              </Button>
            )}
            <Button asChild variant="link" size="md" className="text-ink-3">
              <Link href="/browse">{t("skip")}</Link>
            </Button>
            <Button
              size="md"
              onClick={next}
              className="ms-auto"
              disabled={step === 2 && interests.length < 3}
            >
              {step === TOTAL ? t("finish") : t("next")}
              <Arrow className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Right rail: recap */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-e1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("step4.summaryTitle")}
            </p>
            <ul className="mt-4 grid gap-3 text-[13px]">
              <SummaryRow label={t("step4.summaryRole")} value={t(`step1.role${role.charAt(0).toUpperCase()}${role.slice(1)}` as never)} />
              <SummaryRow
                label={t("step4.summaryInterests")}
                value={interests.length === 0 ? "—" : `${interests.length}`}
              />
              <SummaryRow
                label={t("step4.summaryAudience")}
                value={t(`step3.audience${audience.charAt(0).toUpperCase()}${audience.slice(1)}` as never)}
              />
              <SummaryRow
                label={t("step4.summaryLevel")}
                value={t(`step3.level${level.charAt(0).toUpperCase()}${level.slice(1)}` as never)}
              />
              <SummaryRow label={t("step4.summaryWilaya")} value={tWilayas(wilaya as never)} />
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-2 border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </li>
  );
}

/* ============================================================
 * Step 1 — Role
 * ============================================================ */
function Step1({ role, setRole }: { role: "learn" | "teach" | "both"; setRole: (v: "learn" | "teach" | "both") => void }) {
  const t = useTranslations("student.onboarding.step1");
  const options = [
    { key: "learn" as const, icon: <Sparkles className="h-5 w-5" />, title: t("roleLearn"), blurb: t("roleLearnBlurb") },
    { key: "teach" as const, icon: <GraduationCap className="h-5 w-5" />, title: t("roleTeach"), blurb: t("roleTeachBlurb") },
    { key: "both" as const, icon: <Users className="h-5 w-5" />, title: t("roleBoth"), blurb: t("roleBothBlurb") },
  ];
  return (
    <article>
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[42px]">
        <span className="block">{t("title")}</span>
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>

      <RadioGroup
        value={role}
        onValueChange={(v) => setRole(v as typeof role)}
        className="mt-8 grid gap-3 md:grid-cols-3"
        aria-label={t("roleLabel")}
      >
        {options.map((opt) => (
          <Label
            key={opt.key}
            htmlFor={`r-${opt.key}`}
            className={cn(
              "relative flex cursor-pointer flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-all",
              "hover:border-accent/60 hover:shadow-e1",
              role === opt.key && "border-accent bg-accent-soft/40 shadow-e1",
            )}
          >
            <RadioGroupItem id={`r-${opt.key}`} value={opt.key} className="absolute end-4 top-4" />
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-[var(--radius-md)]",
                role === opt.key ? "bg-accent text-accent-foreground" : "bg-surface text-ink-2",
              )}
            >
              {opt.icon}
            </span>
            <span className="text-[16px] font-semibold text-foreground">{opt.title}</span>
            <span className="text-[12.5px] leading-snug text-ink-3">{opt.blurb}</span>
          </Label>
        ))}
      </RadioGroup>
    </article>
  );
}

/* ============================================================
 * Step 2 — Interests
 * ============================================================ */
function Step2({ interests, setInterests }: { interests: string[]; setInterests: (v: string[]) => void }) {
  const t = useTranslations("student.onboarding.step2");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  function toggle(k: string) {
    setInterests(interests.includes(k) ? interests.filter((x) => x !== k) : [...interests, k]);
  }

  return (
    <article>
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[42px]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>

      <div className="mt-3 inline-flex items-center gap-2 text-[12px] text-ink-3">
        <span className="tabular text-foreground font-semibold">{interests.length}</span>
        <span>{t("minHint", { selected: interests.length })}</span>
      </div>

      <ul className="mt-7 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {interestSeeds.map((it, i) => {
          const active = interests.includes(it.key);
          return (
            <li key={it.key}>
              <Label
                htmlFor={`int-${it.key}`}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3 transition-all",
                  "hover:border-accent/60 hover:shadow-e1",
                  active && "border-accent bg-accent-soft/40",
                )}
              >
                <Checkbox
                  id={`int-${it.key}`}
                  checked={active}
                  onCheckedChange={() => toggle(it.key)}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium text-foreground">{it.label[lang]}</span>
              </Label>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/* ============================================================
 * Step 3 — Audience + Level
 * ============================================================ */
function Step3({
  audience,
  setAudience,
  level,
  setLevel,
}: {
  audience: "kids" | "lycee" | "student" | "adult";
  setAudience: (v: typeof audience) => void;
  level: "beginner" | "intermediate" | "advanced" | "mixed";
  setLevel: (v: typeof level) => void;
}) {
  const t = useTranslations("student.onboarding.step3");
  return (
    <article>
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[42px]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>

      <div className="mt-8 grid gap-3">
        <Label>{t("audienceLabel")}</Label>
        <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kids">{t("audienceKids")}</SelectItem>
            <SelectItem value="lycee">{t("audienceLycee")}</SelectItem>
            <SelectItem value="student">{t("audienceStudent")}</SelectItem>
            <SelectItem value="adult">{t("audienceAdult")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <fieldset className="mt-7 grid gap-3">
        <legend className="text-sm font-medium text-foreground">{t("levelLabel")}</legend>
        <RadioGroup
          value={level}
          onValueChange={(v) => setLevel(v as typeof level)}
          className="grid gap-2 md:grid-cols-2"
        >
          {(["beginner", "intermediate", "advanced", "mixed"] as const).map((lv) => (
            <Label
              key={lv}
              htmlFor={`lv-${lv}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3",
                "hover:border-border-strong",
                level === lv && "border-accent bg-accent-soft/40",
              )}
            >
              <RadioGroupItem id={`lv-${lv}`} value={lv} />
              <span className="text-[14px] font-medium text-foreground">
                {t(`level${lv.charAt(0).toUpperCase()}${lv.slice(1)}` as never)}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
    </article>
  );
}

/* ============================================================
 * Step 4 — Location preference + recap
 * ============================================================ */
function Step4({
  wilaya,
  setWilaya,
  mode,
  setMode,
  role,
  interests,
  audience,
  level,
}: {
  wilaya: string;
  setWilaya: (v: string) => void;
  mode: "online" | "in-person" | "both";
  setMode: (v: "online" | "in-person" | "both") => void;
  role: string;
  interests: string[];
  audience: string;
  level: string;
}) {
  const t = useTranslations("student.onboarding.step4");
  const tWilayas = useTranslations("search.wilayas");

  return (
    <article>
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[42px]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>

      <div className="mt-8 grid gap-3">
        <Label>{t("wilayaLabel")}</Label>
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger>
            <SelectValue placeholder={t("wilayaPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {wilayaKeys.filter((w) => w !== "any").map((w) => (
              <SelectItem key={w} value={w}>
                {tWilayas(w as never)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="mt-7 grid gap-3">
        <legend className="text-sm font-medium text-foreground">{t("modeLabel")}</legend>
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as "online" | "in-person" | "both")}
          className="grid gap-2 md:grid-cols-3"
        >
          <ModePick value="online" current={mode} icon={<Wifi className="h-4 w-4" />} label={t("modeOnline")} />
          <ModePick value="in-person" current={mode} icon={<MapPin className="h-4 w-4" />} label={t("modeInPerson")} />
          <ModePick value="both" current={mode} icon={<><Wifi className="h-3 w-3" /><MapPin className="h-3 w-3" /></>} label={t("modeBoth")} />
        </RadioGroup>
      </fieldset>

      <section className="mt-10 rounded-[var(--radius-lg)] border border-success/30 bg-success/[0.06] p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-success">
            {t("summaryTitle")}
          </p>
        </div>
        <p className="mt-2 text-[14.5px] leading-relaxed text-foreground">{t("summaryReady")}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="success">{role}</Badge>
          <Badge variant="primary">{audience}</Badge>
          <Badge variant="info">{level}</Badge>
          {interests.slice(0, 3).map((it) => (
            <Badge key={it} variant="accent">
              {it}
            </Badge>
          ))}
          {interests.length > 3 && <Badge variant="default">+{interests.length - 3}</Badge>}
        </div>
      </section>
    </article>
  );
}

function ModePick({
  value,
  current,
  icon,
  label,
}: {
  value: "online" | "in-person" | "both";
  current: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Label
      htmlFor={`m-${value}`}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card p-3",
        "hover:border-border-strong",
        current === value && "border-accent bg-accent-soft/40",
      )}
    >
      <RadioGroupItem id={`m-${value}`} value={value} />
      <span className="text-ink-3">{icon}</span>
      <span className="text-[14px] font-medium text-foreground">{label}</span>
    </Label>
  );
}
