"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { demoAccounts } from "@/lib/mock/students";
import { signInWithAccountId, signInWithEmail } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * Map the public demo-account entries (which carry email + role) to the
 * mock auth account ids. The Lina / Khalil rows are the in-catalog demos;
 * any agency entry is filtered out as part of the agency rip.
 */
const DEMO_ACCOUNT_MAP: Record<string, string> = {
  "demo-student": "acc-lina",
  "demo-teacher": "acc-khalil",
};

export function SignInForm({ next }: { next?: string }) {
  const t = useTranslations("auth.signIn");
  const tCommon = useTranslations("auth.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Only show the in-catalog demos — drops `demo-agency` per agency RIP.
  const visibleDemos = demoAccounts.filter((d) => DEMO_ACCOUNT_MAP[d.id]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmail(email, next);
      // server action redirects on success; only returns on error
      if (result && result.ok === false) {
        setError(t("errorUnknownEmail"));
      }
    });
  }

  function signInAs(accountId: string) {
    setError(null);
    startTransition(async () => {
      const result = await signInWithAccountId(accountId, next);
      if (result && result.ok === false) {
        setError(t("errorUnknownEmail"));
      }
    });
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      {/* Top bar: logo + back */}
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

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 md:px-12 md:py-14">
        <div className="w-full max-w-md">
          {/* Editorial header */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
            <span className="block">{t("title")}</span>
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2 text-pretty">
            {t("subtitle")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5" noValidate>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link href={"/forgot" as never} className="text-[12.5px] font-medium text-accent hover:underline">
                  {t("forgot")}
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 ms-3 -translate-y-1/2 text-ink-3"
                  size={16}
                  aria-hidden
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder={t("passwordPlaceholder")}
                  className="ps-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <Label htmlFor="remember" className="cursor-pointer text-[13px] font-normal text-ink-2">
                {t("remember")}
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

            <Button type="submit" size="lg" disabled={pending} className="w-full">
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

          {/* Demo accounts — a real darso pattern */}
          <section
            aria-labelledby="demo-heading"
            className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface/60 p-4"
          >
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="demo-heading" className="text-[13px] font-semibold text-foreground">
                {t("demoHeading")}
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-3">
                {t("demoIntro")}
              </span>
            </div>
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
                        <p className="truncate text-[13px] font-semibold text-foreground">
                          {a.name[lang]}
                        </p>
                        <p className="truncate text-[11.5px] text-ink-3">{a.hint[lang]}</p>
                      </div>
                      <Arrow className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Footer */}
          <p className="mt-8 text-[13px] text-ink-2">
            {t("noAccount")}{" "}
            <Link href="/sign-up" className="font-semibold text-accent hover:underline">
              {t("createAccount")}
            </Link>
          </p>
          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-3">{t("footerLegal")}</p>
        </div>
      </div>
    </div>
  );
}
