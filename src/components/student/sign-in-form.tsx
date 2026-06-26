"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, Lock } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { demoAccounts } from "@/lib/mock/students";
import { cn } from "@/lib/utils";

export function SignInForm() {
  const t = useTranslations("auth.signIn");
  const tCommon = useTranslations("auth.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      router.push("/account" as never);
    }, 700);
  }

  function signInAs(email: string) {
    setEmail(email);
    setPassword("demo-darso-2026");
    setSubmitting(true);
    setTimeout(() => router.push("/account" as never), 400);
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
                  onChange={(e) => setEmail(e.target.value)}
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

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? tCommon("loading") : t("submit")}
              {!submitting && <Arrow className="h-4 w-4" />}
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
              {demoAccounts.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => signInAs(a.email)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-2.5 text-start transition-all",
                      "hover:border-accent hover:shadow-e1",
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
              ))}
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
