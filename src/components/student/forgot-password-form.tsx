"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Mail, AlertCircle, Loader2, MailCheck, KeyRound } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { useToast } from "@/lib/toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_COOLDOWN_S = 60;

/**
 * Password-reset request screen. Mock-only — no real email is sent.
 *
 * Two visual states managed via in-page state (not navigation):
 *   1. "request" — Email input + submit
 *   2. "sent"    — Confirmation panel with email + resend cooldown
 *
 * Mirrors the visual language of sign-in-form.tsx (top header with logo +
 * back, editorial eyebrow + title + subtitle, single-column form, demo
 * panel below) so the auth shell reads as one coherent flow.
 */
export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot");
  const tCommon = useTranslations("auth.common");
  const { show } = useToast();
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"request" | "sent">("request");
  const [sentTo, setSentTo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("errorRequired"));
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError(t("errorFormat"));
      return;
    }
    setError(null);
    startTransition(() => {
      // Simulated network round-trip; toast + stage transition happen
      // synchronously so the demo flow stays snappy.
      show({
        title: t("toastTitle"),
        description: t("toastDesc", { email: trimmed }),
        variant: "success",
      });
      setSentTo(trimmed);
      setStage("sent");
      setCooldown(RESEND_COOLDOWN_S);
    });
  }

  function resend() {
    if (cooldown > 0 || pending) return;
    startTransition(() => {
      show({
        title: t("toastResentTitle"),
        description: t("toastDesc", { email: sentTo }),
        variant: "success",
      });
      setCooldown(RESEND_COOLDOWN_S);
    });
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-12">
        <Link href={routes.home()} className="inline-flex items-center">
          <Logo />
        </Link>
        <Link
          href={routes.signIn()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-foreground"
        >
          <Back className="h-4 w-4" />
          {tCommon("back")}
        </Link>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 md:px-12 md:py-14">
        <div className="w-full max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
            {stage === "request" ? t("title") : t("titleSent")}
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2 text-pretty">
            {stage === "request" ? t("subtitle") : t("subtitleSent")}
          </p>

          {stage === "request" ? (
            <form onSubmit={submit} className="mt-8 grid gap-5" noValidate>
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
                <p className="text-[12px] text-ink-3">{t("helper")}</p>
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
                {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                <span className={pending ? "opacity-0 inline-flex items-center gap-2" : "inline-flex items-center gap-2"}>
                  {t("submit")}
                  <Arrow className="h-4 w-4" />
                </span>
              </Button>
            </form>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                    <MailCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-foreground">{t("confirmHeading")}</p>
                    <p
                      dir="ltr"
                      className="mt-0.5 break-all text-[13px] font-mono text-ink-2"
                    >
                      {sentTo}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 text-[12.5px] text-ink-2">
                  <li className="flex gap-2">
                    <span className="text-ink-3 tabular">01</span>
                    <span>{t("step1")}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-ink-3 tabular">02</span>
                    <span>{t("step2")}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-ink-3 tabular">03</span>
                    <span>{t("step3")}</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                <span className="text-ink-2">{t("notReceived")}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={cooldown > 0 || pending}
                  onClick={resend}
                >
                  {pending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  ) : (
                    <KeyRound className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span className={pending ? "opacity-0" : ""}>
                    {cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resend")}
                  </span>
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="md"
                className="w-full"
                onClick={() => {
                  setStage("request");
                  setEmail("");
                }}
              >
                {t("useDifferent")}
              </Button>
            </div>
          )}

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-[13px] text-ink-2">
              {t("remembered")}{" "}
              <Link href={routes.signIn()} className="font-semibold text-accent hover:underline">
                {t("backToSignIn")}
              </Link>
            </p>
            <p className="mt-4 text-[11.5px] leading-relaxed text-ink-3">{t("footerLegal")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
