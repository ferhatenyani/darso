"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, Lock, User, GraduationCap, Sparkles, AlertCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { demoAccounts } from "@/lib/mock/students";
import { signInWithAccountId, signUpWithEmail } from "@/lib/auth";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNT_MAP: Record<string, string> = {
  "demo-student": "acc-lina",
  "demo-teacher": "acc-khalil",
};

export function SignUpForm({ next }: { next?: string }) {
  const t = useTranslations("auth.signUp");
  const tCommon = useTranslations("auth.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learn" | "teach">("learn");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Filter out any agency demo account per the agency-RIP default.
  const visibleDemos = demoAccounts.filter((d) => DEMO_ACCOUNT_MAP[d.id]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(t("errorRequired"));
      return;
    }
    const accountRole = role === "teach" ? "teacher" : "student";
    startTransition(async () => {
      await signUpWithEmail({
        role: accountRole,
        email: email.trim(),
        name: name.trim() || undefined,
        next,
      });
      // server action redirects, so no follow-up here
    });
  }

  function signInAs(accountId: string) {
    setError(null);
    startTransition(async () => {
      const result = await signInWithAccountId(accountId, next);
      if (result && result.ok === false) {
        setError(t("errorRequired"));
      }
    });
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-12">
        <Link href="/" className="inline-flex items-center">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-foreground"
        >
          <Back className="h-4 w-4" />
          {tCommon("back")}
        </Link>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 md:px-12 md:py-12">
        <div className="w-full max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
            <span className="block">{t("title")}</span>
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2 text-pretty">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-7 grid gap-5" noValidate>
            {/* Role choice — distinct editorial cards instead of a flat radio list */}
            <div className="grid gap-2">
              <Label asChild>
                <p>{t("roleLabel")}</p>
              </Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as "learn" | "teach")}
                className="grid grid-cols-2 gap-2"
                aria-label={t("roleLabel")}
              >
                <RoleCard
                  value="learn"
                  icon={<Sparkles className="h-4 w-4" />}
                  title={t("roleLearn")}
                  blurb={t("roleLearnBlurb")}
                  selected={role === "learn"}
                />
                <RoleCard
                  value="teach"
                  icon={<GraduationCap className="h-4 w-4" />}
                  title={t("roleTeach")}
                  blurb={t("roleTeachBlurb")}
                  selected={role === "teach"}
                />
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 ms-3 -translate-y-1/2 text-ink-3"
                  size={16}
                  aria-hidden
                />
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  placeholder={t("fullNamePlaceholder")}
                  className="ps-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 ms-3 -translate-y-1/2 text-ink-3"
                  size={16}
                  aria-hidden
                />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  dir="ltr"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="ps-9"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 ms-3 -translate-y-1/2 text-ink-3"
                  size={16}
                  aria-hidden
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder={t("passwordPlaceholder")}
                  className="ps-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-[11.5px] text-ink-3">{t("passwordHint")}</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
                className="mt-0.5"
                required
              />
              <Label htmlFor="consent" className="cursor-pointer text-[13px] font-normal leading-snug text-ink-2">
                {t("consent")}
              </Label>
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-[var(--radius-md)] border border-danger/30 bg-danger/[0.06] px-3 py-2.5 text-[12.5px] text-danger"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{error}</span>
              </p>
            )}

            <Button type="submit" size="lg" disabled={pending || !consent} className="w-full">
              {pending ? tCommon("loading") : t("submit")}
              {!pending && <Arrow className="h-4 w-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-3">
            <Separator className="flex-1" />
            <span>{tCommon("or")}</span>
            <Separator className="flex-1" />
          </div>

          <section
            aria-labelledby="demo-heading"
            className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface/60 p-4"
          >
            <h2 id="demo-heading" className="mb-3 text-[13px] font-semibold text-foreground">
              {t("demoHeading")}
            </h2>
            <ul className="grid gap-2">
              {visibleDemos.map((a, i) => {
                const accountId = DEMO_ACCOUNT_MAP[a.id];
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => signInAs(accountId)}
                      disabled={pending}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-2.5 text-start transition-all",
                        "hover:border-accent hover:shadow-e1 disabled:opacity-60",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      )}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={cn("bg-gradient-to-br text-xs text-white", a.accent)}>
                          {a.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-foreground">{a.name[lang]}</p>
                        <p className="truncate text-[11.5px] text-ink-3">{a.hint[lang]}</p>
                      </div>
                      <Arrow className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="mt-8 text-[13px] text-ink-2">
            {t("haveAccount")}{" "}
            <Link href="/sign-in" className="font-semibold text-accent hover:underline">
              {t("signIn")}
            </Link>
          </p>
          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-3">{t("footerLegal")}</p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  value,
  icon,
  title,
  blurb,
  selected,
}: {
  value: string;
  icon: React.ReactNode;
  title: string;
  blurb: string;
  selected: boolean;
}) {
  return (
    <Label
      htmlFor={`role-${value}`}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-3 text-start transition-all",
        "hover:border-accent/60 hover:shadow-e1",
        selected && "border-accent bg-accent-soft/40 shadow-e1",
      )}
    >
      <RadioGroupItem id={`role-${value}`} value={value} className="absolute end-3 top-3" />
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[var(--radius-sm)]",
          selected ? "bg-accent text-accent-foreground" : "bg-surface text-ink-2",
        )}
      >
        {icon}
      </span>
      <span className="block text-[14px] font-semibold text-foreground">{title}</span>
      <span className="block text-[11.5px] leading-snug text-ink-3">{blurb}</span>
    </Label>
  );
}
