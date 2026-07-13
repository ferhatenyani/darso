"use client";

import { useState, useTransition } from "react";
import {
  ArrowRight,
  Building2,
  Wallet,
  Coins,
  ShieldCheck,
  Info,
} from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { advanceBookingStage, type Booking } from "@/lib/mock/bookings-state";
import type { DirectPayMethod, DirectPayMethodKind } from "@/lib/mock/direct-pay-methods";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Fresh checkout state: student was just approved (or just enrolled on a
// catalog listing) and is at the direct-pay arrangement step. Picks one of
// the teacher's advertised methods, follows the instructions, then flips the
// booking to `pending_teacher_confirmation` so the teacher can confirm
// receipt. Routes to /success after the flip.

const kindIcons: Record<DirectPayMethodKind, typeof Building2> = {
  bank_transfer: Building2,
  baridimob: Wallet,
  cash: Coins,
};

type Props = {
  booking: Booking;
  methods: DirectPayMethod[];
};

export function CheckoutClient({ booking, methods }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(methods[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const method = methods.find((m) => m.id === selected);

  function onArrange() {
    if (!method) return;
    // Cache the human method label on the booking so the receipt / detail
    // page can name the payment path without re-looking it up.
    startTransition(() => {
      advanceBookingStage(booking.id, "pending_teacher_confirmation");
      router.push(`/checkout/${booking.id}/success` as never);
    });
  }

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Left column — arrangement flow */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Étape 2 sur 2
          </p>
          <h1 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[36px]">
            Arrangez le paiement avec votre professeur
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Sur darso, le paiement se fait directement entre vous et le professeur. Choisissez une méthode, suivez les instructions, puis confirmez ci-dessous.
          </p>

          {/* Method picker */}
          <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-card p-2 shadow-e1">
            <RadioGroup value={selected} onValueChange={setSelected} className="gap-0">
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

          {/* Explainer */}
          <div className="mt-6 flex gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden />
            <div className="text-[13.5px] leading-relaxed text-ink-2">
              <p className="font-semibold text-foreground">Comment cela fonctionne</p>
              <p className="mt-1">
                Marquez le paiement comme effectué ci-dessous. Votre professeur confirmera la réception sous 48 h et votre place sera verrouillée. En cas de non-confirmation dans les délais, vous pourrez retirer la demande ou signaler un problème.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={onArrange}
              disabled={!method || isPending}
              className="min-w-[220px]"
            >
              {isPending ? "…" : "J'ai effectué le paiement"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Label
              htmlFor={`pm-${method?.id}`}
              className="text-[13px] text-ink-3"
            >
              Vous choisirez avec {booking.teacherName.fr}
            </Label>
          </div>
        </div>

        {/* Right column — booking summary card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              Récapitulatif
            </p>
            <h2 className="mt-3 text-[18px] font-semibold leading-tight text-foreground">
              {booking.subjectTitle.fr || booking.subjectTitle.ar || "Réservation"}
            </h2>
            <p className="mt-1 text-[13px] text-ink-2">
              Avec {booking.teacherName.fr}
            </p>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-[13.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-ink-3">Format</dt>
                <dd className="font-medium text-foreground">
                  {formatBookingKind(booking.kind)}
                </dd>
              </div>
              {booking.start && (
                <div className="flex items-center justify-between">
                  <dt className="text-ink-3">Début</dt>
                  <dd className="font-medium text-foreground">
                    {new Intl.DateTimeFormat("fr-DZ", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(booking.start))}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-ink-3">Total à régler</dt>
                <dd className="text-[16px] font-semibold tabular text-foreground">
                  {formatPrice(booking.priceDzd, "fr")}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-start gap-2 rounded-md bg-surface px-3 py-2.5 text-[12px] text-ink-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" aria-hidden />
              <p>
                Aucun paiement n'est débité par darso. Vous réglez directement le professeur.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
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
