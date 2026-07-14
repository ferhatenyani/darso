"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

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
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visibleDemos = demoAccounts.filter((d) => DEMO_ACCOUNT_MAP[d.id]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmail(email, next);
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
        <Link
          href="/"
          className="inline-flex items-center transition-transform hover:-translate-y-[0.5px] focus-visible:outline-none focus-visible:shadow-focus focus-visible:rounded-[var(--radius-xs)]"
        >
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus focus-visible:rounded-[var(--radius-xs)]"
        >
          <Back className="h-4 w-4" />
          {tCommon("back")}
        </Link>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 md:px-12 md:py-14">
        <div className="w-full max-w-md">
          {/* Editorial header */}
          <p
            className="anim-fade-up text-[10px] font-semibold uppercase tracking-[0.22em] text-accent"
            style={{ animationDelay: "0ms" }}
          >
            {t("eyebrow")}
          </p>
          <h1
            className="anim-fade-up mt-3 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]"
            style={{ animationDelay: "90ms" }}
          >
            <span className="block">{t("title")}</span>
          </h1>
          <p
            className="anim-fade-up mt-3 text-[14.5px] leading-relaxed text-ink-2 text-pretty"
            style={{ animationDelay: "180ms" }}
          >
            {t("subtitle")}
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="anim-fade-up mt-8 grid gap-5"
            style={{ animationDelay: "260ms" }}
            noValidate
          >
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
                <Link
                  href={"/forgot" as never}
                  className="text-[12.5px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:shadow-focus focus-visible:rounded-[var(--radius-xs)]"
                >
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
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder={t("passwordPlaceholder")}
                  className="ps-9 pe-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPw}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute end-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-[var(--radius-xs)] text-ink-3 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
                >
                  {showPw ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
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
                className="anim-fade-up flex items-start gap-2 rounded-[var(--radius-md)] border border-danger/30 bg-danger/[0.06] px-3 py-2.5 text-[12.5px] text-danger"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{error}</span>
              </p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending ? tCommon("loading") : t("submit")}
              {!pending && <Arrow className="h-4 w-4 rtl-flip" />}
            </Button>
          </form>

          {/* Divider */}
          <div
            className="anim-fade-up my-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-3"
            style={{ animationDelay: "340ms" }}
          >
            <Separator className="flex-1" />
            <span>{tCommon("or")}</span>
            <Separator className="flex-1" />
          </div>

          {/* Demo accounts */}
          <section
            aria-labelledby="demo-heading"
            className="anim-fade-up rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface/60 p-4"
            style={{ animationDelay: "420ms" }}
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
                        "group relative flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius-md)] border border-border bg-card p-2.5 text-start transition-all duration-300",
                        "hover:-translate-y-[1px] hover:border-accent hover:shadow-e2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                        "focus-visible:outline-none focus-visible:shadow-focus",
                      )}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-2.5 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-accent transition-transform duration-500 group-hover:scale-x-100"
                      />
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
                      <Arrow className="h-4 w-4 text-ink-3 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 rtl-flip" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Footer */}
          <p
            className="anim-fade-up mt-8 text-[13px] text-ink-2"
            style={{ animationDelay: "500ms" }}
          >
            {t("noAccount")}{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:shadow-focus focus-visible:rounded-[var(--radius-xs)]"
            >
              {t("createAccount")}
            </Link>
          </p>
          <p
            className="anim-fade-up mt-4 text-[11.5px] leading-relaxed text-ink-3"
            style={{ animationDelay: "560ms" }}
          >
            {t("footerLegal")}
          </p>
        </div>
      </div>
    </div>
  );
}
