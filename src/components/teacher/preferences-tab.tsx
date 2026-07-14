"use client";

import { useSyncExternalStore, useTransition } from "react";
import {
  Wallet,
  Building2,
  UserCheck,
  Zap,
  Repeat,
  PlaneTakeoff,
  Info,
  Bell,
  BellOff,
  Mail,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/lib/toast";
import {
  getTeacherSettings,
  subscribeTeacherSettings,
  updateTeacherSettings,
  updateVacation,
  updateNotificationPreference,
  type ApprovalMode,
  type NotificationCategory,
  type NotificationDelivery,
  type PaymentRouting,
  type TeacherSettings,
} from "@/lib/mock/teacher-settings-state";
import { cn } from "@/lib/utils";

// Teacher operational preferences — where the four "set-once" defaults
// live. Aligns with decisions 2, 3, 14 and the UX directive on auto-
// approve for returning students. Per-listing overrides on wizard forms
// consume these as their defaults.

function useSettings(): TeacherSettings {
  return useSyncExternalStore(
    subscribeTeacherSettings,
    () => getTeacherSettings(),
    () => getTeacherSettings(),
  );
}

export function TeacherPreferencesTab() {
  const s = useSettings();
  const [, startTransition] = useTransition();
  const { show } = useToast();

  function updateAndToast(patch: Partial<TeacherSettings>, message: string) {
    startTransition(() => {
      updateTeacherSettings(patch);
      show({ title: "Préférences enregistrées", description: message, variant: "success" });
    });
  }

  return (
    <div className="space-y-6">
      {/* Payment routing default */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        <SectionHeader
          Icon={Wallet}
          title="Routage de paiement par défaut"
          hint="Sera pré-sélectionné à la création d'une nouvelle fiche. Vous pourrez toujours changer par fiche."
        />
        <RadioGroup
          value={s.defaultPaymentRouting}
          onValueChange={(v) =>
            updateAndToast(
              { defaultPaymentRouting: v as PaymentRouting },
              v === "direct" ? "Paiement direct par défaut." : "Paiement plateforme par défaut.",
            )
          }
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <RoutingOption
            id="pr-direct"
            value="direct"
            selected={s.defaultPaymentRouting === "direct"}
            Icon={Wallet}
            title="Paiement direct"
            body="Le paiement se fait directement entre vous et l'élève (virement, BaridiMob, espèces). Vous confirmez la réception."
          />
          <RoutingOption
            id="pr-platform"
            value="platform"
            selected={s.defaultPaymentRouting === "platform"}
            Icon={Building2}
            title="Paiement plateforme"
            body="L'élève paie darso, nous vous versons ensuite (moins les frais du palier). Disponible bientôt en v1."
            disabled
          />
        </RadioGroup>
      </section>

      {/* Approval mode default */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        <SectionHeader
          Icon={UserCheck}
          title="Mode d'inscription par défaut"
          hint="Sera pré-sélectionné pour vos nouvelles fiches. Réservez l'approbation manuelle aux cours qui l'exigent."
        />
        <RadioGroup
          value={s.defaultApprovalMode}
          onValueChange={(v) =>
            updateAndToast(
              { defaultApprovalMode: v as ApprovalMode },
              v === "instant" ? "Réservation instantanée par défaut." : "Approbation manuelle par défaut.",
            )
          }
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <RoutingOption
            id="am-instant"
            value="instant"
            selected={s.defaultApprovalMode === "instant"}
            Icon={Zap}
            title="Réservation instantanée"
            body="L'élève paie et sa place est verrouillée immédiatement. Idéal pour les cours et événements ouverts."
          />
          <RoutingOption
            id="am-approval"
            value="approval"
            selected={s.defaultApprovalMode === "approval"}
            Icon={UserCheck}
            title="Approbation manuelle"
            body="Vous examinez chaque demande avant que l'élève ne paie. Utile pour les cours avec prérequis."
          />
        </RadioGroup>
      </section>

      {/* Auto-approve returning students */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SectionHeader
              Icon={Repeat}
              title="Auto-approuver les élèves de retour"
              hint="Si activé, un élève qui a déjà terminé une session avec vous saute automatiquement l'étape d'approbation."
              inline
            />
          </div>
          <Switch
            checked={s.autoApproveReturning}
            onCheckedChange={(v) =>
              updateAndToast(
                { autoApproveReturning: v },
                v ? "Auto-approbation activée." : "Auto-approbation désactivée.",
              )
            }
          />
        </div>
      </section>

      {/* Vacation mode */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SectionHeader
              Icon={PlaneTakeoff}
              title="Mode vacances"
              hint="Suspend temporairement les nouvelles réservations sur toutes vos fiches. Les sessions confirmées restent honorées."
              inline
            />
          </div>
          <Switch
            checked={s.vacation.active}
            onCheckedChange={(active) => {
              startTransition(() => {
                updateVacation({
                  active,
                  startsAt: active ? new Date().toISOString().slice(0, 10) : undefined,
                });
                show({
                  title: active ? "Mode vacances activé" : "Mode vacances désactivé",
                  description: active
                    ? "Vos fiches n'acceptent plus de nouvelles réservations."
                    : "Les réservations reprennent normalement.",
                  variant: active ? "warning" : "success",
                });
              });
            }}
          />
        </div>

        {s.vacation.active && (
          <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-[1fr_1fr_2fr]">
            <div>
              <Label htmlFor="vac-start" className="text-[12px] uppercase tracking-[0.12em] text-ink-3">
                Date de début
              </Label>
              <Input
                id="vac-start"
                type="date"
                value={s.vacation.startsAt ?? ""}
                onChange={(e) => updateVacation({ startsAt: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="vac-end" className="text-[12px] uppercase tracking-[0.12em] text-ink-3">
                Retour (optionnel)
              </Label>
              <Input
                id="vac-end"
                type="date"
                value={s.vacation.endsAt ?? ""}
                onChange={(e) => updateVacation({ endsAt: e.target.value || undefined })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="vac-msg" className="text-[12px] uppercase tracking-[0.12em] text-ink-3">
                Message affiché
              </Label>
              <Textarea
                id="vac-msg"
                value={s.vacation.message ?? ""}
                onChange={(e) => updateVacation({ message: e.target.value || undefined })}
                placeholder="Je suis en vacances, je reviens le…"
                rows={2}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {!s.vacation.active && (
          <p className="mt-4 flex items-start gap-2 rounded-md bg-surface px-3 py-2.5 text-[12.5px] text-ink-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" aria-hidden />
            <span>
              Utile pour les vacances scolaires, un déplacement, ou toute période où vous ne pouvez pas prendre de nouveaux élèves.
            </span>
          </p>
        )}
      </section>

      {/* Notification preferences — decision 15 (category-driven).
          Financial + approvals are real-time by default because timing
          matters; reviews/marketing are batched into a daily digest. */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
        <SectionHeader
          Icon={Bell}
          title="Notifications"
          hint="Choisissez comment vous voulez être notifié pour chaque catégorie. Les événements financiers restent en temps réel par défaut — le retard coûte."
        />
        <ul className="mt-4 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-background">
          <NotifRow
            category="approvals"
            label="Approbations à traiter"
            hint="Demandes d'inscription et paiements à confirmer."
            value={s.notifications.approvals}
            onChange={(v) => handleNotifChange("approvals", v, show, startTransition)}
          />
          <NotifRow
            category="financial"
            label="Paiements & versements"
            hint="Paiements reçus, versements traités, remboursements."
            value={s.notifications.financial}
            onChange={(v) => handleNotifChange("financial", v, show, startTransition)}
          />
          <NotifRow
            category="messages"
            label="Messages"
            hint="Nouveaux messages d'élèves."
            value={s.notifications.messages}
            onChange={(v) => handleNotifChange("messages", v, show, startTransition)}
          />
          <NotifRow
            category="reviews"
            label="Avis reçus"
            hint="Nouveaux avis d'élèves après une session."
            value={s.notifications.reviews}
            onChange={(v) => handleNotifChange("reviews", v, show, startTransition)}
          />
          <NotifRow
            category="marketing"
            label="Actualités darso"
            hint="Nouvelles fonctionnalités, promotions, digest hebdomadaire."
            value={s.notifications.marketing}
            onChange={(v) => handleNotifChange("marketing", v, show, startTransition)}
          />
        </ul>
      </section>
    </div>
  );
}

function handleNotifChange(
  category: NotificationCategory,
  value: NotificationDelivery,
  show: ReturnType<typeof useToast>["show"],
  startTransition: (cb: () => void) => void,
) {
  startTransition(() => {
    updateNotificationPreference(category, value);
    show({
      title: "Préférence enregistrée",
      description:
        value === "realtime"
          ? "En temps réel activé."
          : value === "digest"
            ? "Digest quotidien activé."
            : "Notifications désactivées.",
      variant: "success",
    });
  });
}

const deliveryOptions: { value: NotificationDelivery; label: string; Icon: typeof Bell }[] = [
  { value: "realtime", label: "Temps réel", Icon: Bell },
  { value: "digest", label: "Digest", Icon: Mail },
  { value: "off", label: "Désactivé", Icon: BellOff },
];

function NotifRow({
  label,
  hint,
  value,
  onChange,
}: {
  category: NotificationCategory;
  label: string;
  hint: string;
  value: NotificationDelivery;
  onChange: (v: NotificationDelivery) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0 max-w-md">
        <p className="text-[13.5px] font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{hint}</p>
      </div>
      <div className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
        {deliveryOptions.map(({ value: v, label: l, Icon }) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                active
                  ? "bg-card text-foreground shadow-e1"
                  : "text-ink-2 hover:text-foreground",
              )}
              aria-pressed={active}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {l}
            </button>
          );
        })}
      </div>
    </li>
  );
}

function SectionHeader({
  Icon,
  title,
  hint,
  inline,
}: {
  Icon: typeof Wallet;
  title: string;
  hint: string;
  inline?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" aria-hidden />
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      </div>
      <p className={cn("text-[13px] leading-relaxed text-ink-2", inline ? "mt-1" : "mt-1.5")}>{hint}</p>
    </div>
  );
}

function RoutingOption({
  id,
  value,
  selected,
  Icon,
  title,
  body,
  disabled,
}: {
  id: string;
  value: string;
  selected: boolean;
  Icon: typeof Wallet;
  title: string;
  body: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-4 transition-colors",
        selected ? "border-accent bg-accent-soft/40" : "border-border bg-background hover:border-accent/40",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <RadioGroupItem id={id} value={value} disabled={disabled} className="mt-1" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-ink-2" aria-hidden />
          <span className="text-[14px] font-semibold text-foreground">{title}</span>
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">{body}</p>
      </div>
    </label>
  );
}
