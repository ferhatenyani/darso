"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Wallet,
  Coins,
  ShieldCheck,
  Info,
  Calendar,
  User,
  Banknote,
  ClipboardCheck,
  BadgeCheck,
} from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { advanceBookingStage, type Booking } from "@/lib/mock/bookings-state";
import type { DirectPayMethod, DirectPayMethodKind } from "@/lib/mock/direct-pay-methods";
import { formatPrice, cn } from "@/lib/utils";
import { CheckoutShell } from "@/components/checkout/checkout-shell";

// Four-step checkout: Détails · Confirmation · Paiement · Confirmé.
// The Confirmé step lives on /checkout/[id]/success — this component owns
// the first three. Payment logic itself is unchanged from the pre-redesign
// flow: pick one of the teacher's direct-pay methods, follow the
// instructions, then flip the booking to `pending_teacher_confirmation`
// and route to the success page for step 4.

const kindIcons: Record<DirectPayMethodKind, typeof Building2> = {
  bank_transfer: Building2,
  baridimob: Wallet,
  cash: Coins,
};

type Step = 0 | 1 | 2;

type Props = {
  booking: Booking;
  methods: DirectPayMethod[];
};

export function CheckoutClient({ booking, methods }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<string>(methods[0]?.id ?? "");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const method = methods.find((m) => m.id === selected);

  function goNext() {
    if (step === 0) return setStep(1);
    if (step === 1) return setStep(2);
    // step === 2 : commit the payment arrangement and continue to step 4
    if (!method) return;
    startTransition(() => {
      advanceBookingStage(booking.id, "pending_teacher_confirmation");
      router.push(`/checkout/${booking.id}/success` as never);
    });
  }

  function goBack() {
    if (step === 0) {
      router.push(`/bookings/${booking.id}` as never);
      return;
    }
    setStep((s) => (s - 1) as Step);
  }

  const canContinue =
    step === 0
      ? true
      : step === 1
        ? termsAccepted
        : Boolean(method) && !isPending;

  const primaryLabel =
    step === 2 ? "Confirmer le paiement" : "Continuer";

  // Desktop action row lives inside the step content. Mobile uses the sticky
  // bottom bar via CheckoutShell — same buttons, same handlers.
  const actionsInline = (
    <div className="mt-8 hidden flex-wrap items-center gap-3 lg:flex">
      <Button variant="ghost" size="lg" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      <Button
        variant="accent"
        size="lg"
        onClick={goNext}
        disabled={!canContinue}
        className="min-w-[200px]"
      >
        {isPending ? "…" : primaryLabel}
        {!isPending && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );

  const actionsMobile = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="lg"
        onClick={goBack}
        className="min-w-[92px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      <Button
        variant="accent"
        size="lg"
        block
        onClick={goNext}
        disabled={!canContinue}
      >
        {isPending ? "…" : primaryLabel}
        {!isPending && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <CheckoutShell currentIndex={step} mobileActionBar={actionsMobile}>
      {/* Content */}
      {step === 0 && <DetailsStep booking={booking} />}
      {step === 1 && (
        <ConfirmationStep
          booking={booking}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
        />
      )}
      {step === 2 && (
        <PaymentStep
          booking={booking}
          methods={methods}
          selected={selected}
          onSelect={setSelected}
        />
      )}
      {actionsInline}
    </CheckoutShell>
  );
}

/* ---------------------------------------------------------------- *
 * Step 1 — Détails
 * ---------------------------------------------------------------- */

function DetailsStep({ booking }: { booking: Booking }) {
  const start = booking.start
    ? new Intl.DateTimeFormat("fr-DZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(booking.start))
    : "À convenir avec le professeur";

  return (
    <section aria-labelledby="step-details-heading">
      <StepHeader
        eyebrow="Étape 1"
        id="step-details-heading"
        title="Vérifions les détails"
        body="Ce sont les informations transmises au professeur. Vous pourrez ajuster le créneau par message si nécessaire."
      />

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 md:p-6">
        <dl className="divide-y divide-border">
          <DetailRow
            Icon={ClipboardCheck}
            label="Format"
            value={formatBookingKind(booking.kind)}
          />
          <DetailRow
            Icon={BadgeCheck}
            label="Sujet"
            value={booking.subjectTitle.fr || booking.subjectTitle.ar || "—"}
          />
          <DetailRow
            Icon={User}
            label="Professeur"
            value={booking.teacherName.fr}
          />
          <DetailRow Icon={Calendar} label="Début" value={start} />
          <DetailRow
            Icon={Banknote}
            label="Montant"
            value={formatPrice(booking.priceDzd, "fr")}
            valueClassName="tabular font-semibold text-[16px]"
          />
        </dl>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
        Un besoin particulier ou une contrainte d'horaire ? Vous pourrez
        l'écrire au professeur dès la réservation confirmée.
      </p>
    </section>
  );
}

function DetailRow({
  Icon,
  label,
  value,
  valueClassName,
}: {
  Icon: typeof Calendar;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface text-ink-2">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <dt className="text-[13.5px] text-ink-3">{label}</dt>
      <dd
        className={cn(
          "ml-auto max-w-[60%] text-right text-[14.5px] font-medium text-foreground",
          valueClassName,
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Step 2 — Confirmation
 * ---------------------------------------------------------------- */

function ConfirmationStep({
  booking,
  termsAccepted,
  onTermsChange,
}: {
  booking: Booking;
  termsAccepted: boolean;
  onTermsChange: (v: boolean) => void;
}) {
  return (
    <section aria-labelledby="step-confirm-heading">
      <StepHeader
        eyebrow="Étape 2"
        id="step-confirm-heading"
        title="Confirmez le récapitulatif"
        body="Relisez ces informations avant de passer au paiement. Aucun montant n'est encore engagé."
      />

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
          Récapitulatif
        </p>
        <h2 className="mt-3 text-[18px] font-semibold leading-tight text-foreground">
          {booking.subjectTitle.fr || booking.subjectTitle.ar || "Réservation"}
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-2">
          avec {booking.teacherName.fr}
        </p>

        <dl className="mt-6 space-y-3 border-t border-border pt-6 text-[13.5px]">
          <SummaryLine label="Format" value={formatBookingKind(booking.kind)} />
          {booking.start && (
            <SummaryLine
              label="Début"
              value={new Intl.DateTimeFormat("fr-DZ", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(booking.start))}
            />
          )}
          <SummaryLine
            label="Total à régler"
            value={formatPrice(booking.priceDzd, "fr")}
            valueClassName="text-[16px] font-semibold tabular text-foreground"
          />
        </dl>
      </div>

      {/* Terms card */}
      <label
        htmlFor="checkout-terms"
        className={cn(
          "mt-6 flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-4 transition-colors",
          termsAccepted
            ? "border-accent bg-accent-soft/40"
            : "border-border bg-card hover:border-border-strong",
        )}
      >
        <Checkbox
          id="checkout-terms"
          checked={termsAccepted}
          onCheckedChange={(v) => onTermsChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-[13.5px] leading-relaxed text-ink-2">
          <span className="font-semibold text-foreground">
            J'accepte les conditions de réservation.
          </span>{" "}
          Le paiement est arrangé directement avec le professeur. En cas de
          litige, darso peut intervenir sous 48 h.
        </span>
      </label>

      <div className="mt-6 flex gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />
        <p className="text-[13px] leading-relaxed text-ink-2">
          Votre place est réservée uniquement une fois le paiement confirmé
          par le professeur. Vous pouvez annuler à tout moment avant.
        </p>
      </div>
    </section>
  );
}

function SummaryLine({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-3">{label}</dt>
      <dd className={cn("font-medium text-foreground", valueClassName)}>
        {value}
      </dd>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Step 3 — Paiement
 * ---------------------------------------------------------------- */

function PaymentStep({
  booking,
  methods,
  selected,
  onSelect,
}: {
  booking: Booking;
  methods: DirectPayMethod[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="step-payment-heading">
      <StepHeader
        eyebrow="Étape 3"
        id="step-payment-heading"
        title="Arrangez le paiement"
        body={`Choisissez une méthode proposée par ${booking.teacherName.fr}, suivez les instructions, puis confirmez ci-dessous.`}
      />

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-2 shadow-e1">
        <RadioGroup value={selected} onValueChange={onSelect} className="gap-0">
          {methods.map((m, i) => {
            const Icon = kindIcons[m.kind];
            const isActive = selected === m.id;
            return (
              <label
                key={m.id}
                htmlFor={`pm-${m.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] px-4 py-4 transition-colors",
                  isActive
                    ? "bg-accent-soft/40"
                    : i !== 0
                      ? "border-t border-border"
                      : "",
                )}
              >
                <RadioGroupItem
                  id={`pm-${m.id}`}
                  value={m.id}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-ink-2" aria-hidden />
                    <span className="text-[15px] font-semibold text-foreground">
                      {m.label}
                    </span>
                  </div>
                  {isActive && (
                    <pre className="mt-3 whitespace-pre-wrap rounded-md border border-border bg-background px-3 py-2.5 font-sans text-[13.5px] leading-relaxed text-ink-2">
                      {m.instructions}
                    </pre>
                  )}
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="mt-6 flex gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
        <Info className="h-5 w-5 shrink-0 text-ink-3" aria-hidden />
        <div className="text-[13px] leading-relaxed text-ink-2">
          <p className="font-semibold text-foreground">
            Aucun paiement n'est débité par darso.
          </p>
          <p className="mt-1">
            Marquez le paiement comme effectué après l'avoir arrangé.
            {" "}
            {booking.teacherName.fr} confirmera la réception sous 48 h.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Shared step header
 * ---------------------------------------------------------------- */

function StepHeader({
  eyebrow,
  id,
  title,
  body,
}: {
  eyebrow: string;
  id: string;
  title: string;
  body: string;
}) {
  return (
    <header>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h1
        id={id}
        className="mt-3 text-balance text-[26px] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[32px]"
      >
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
        {body}
      </p>
    </header>
  );
}

function formatBookingKind(kind: Booking["kind"]): string {
  switch (kind) {
    case "1to1":
      return "Cours particulier";
    case "course":
      return "Cours en cohorte";
    case "event":
      return "Événement";
    case "live":
      return "Session en direct";
  }
}
