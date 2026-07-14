"use client";

import { useMemo, useState } from "react";
import {
  UserCheck,
  Receipt,
  Sparkles,
  Send,
  ArrowUpRight,
  Clock,
  Check,
  X,
  Inbox,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import {
  getActionQueue,
  kindLabelFr,
  type ActionItem,
  type ActionKind,
} from "@/lib/mock/teacher-queue";
import { formatPrice, cn } from "@/lib/utils";

// Teacher's single work surface. Merges what used to be scattered across
// separate pages (join requests, applications, invites, marketplace
// opportunities) into a time-urgency-sorted list. Each row exposes a
// primary action + optional secondary, so a teacher can burn down the
// queue without navigating away.

const kindIcon: Record<ActionKind, typeof UserCheck> = {
  approval: UserCheck,
  payment_confirmation: Receipt,
  direct_invite: Send,
  proposal_opportunity: Sparkles,
};

const kindTone: Record<ActionKind, string> = {
  approval: "bg-warning/12 text-warning",
  payment_confirmation: "bg-accent/12 text-accent",
  direct_invite: "bg-danger/12 text-danger",
  proposal_opportunity: "bg-success/12 text-success",
};

function urgencyTone(hours: number): string {
  if (hours <= 6) return "text-danger";
  if (hours <= 24) return "text-warning";
  return "text-ink-3";
}

export function UnifiedActionQueue() {
  const initial = useMemo(() => getActionQueue(), []);
  const [items, setItems] = useState<ActionItem[]>(initial);
  const { show } = useToast();

  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function onApprove(item: ActionItem) {
    remove(item.id);
    show({
      title: "Demande acceptée",
      description: `${item.actor.name} recevra la confirmation.`,
      variant: "success",
    });
  }

  function onReject(item: ActionItem) {
    remove(item.id);
    show({
      title: "Demande refusée",
      description: `${item.actor.name} sera informé.`,
      variant: "warning",
    });
  }

  function onIgnore(item: ActionItem) {
    remove(item.id);
    show({
      title: "Retiré de la file",
      description: "Vous pouvez la retrouver dans /teach/requests.",
      variant: "default",
    });
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-[var(--radius-xl)] border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-surface text-ink-2">
          <Inbox className="h-5 w-5" aria-hidden />
        </div>
        <p className="mt-4 text-[14px] font-medium text-foreground">
          File vide, respirez.
        </p>
        <p className="mt-1 text-[12.5px] text-ink-3">
          Les nouvelles approbations, invitations et opportunités arrivent ici.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => {
        const Icon = kindIcon[item.kind];
        return (
          <li
            key={item.id}
            className="rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-shadow hover:shadow-e2"
          >
            <div className="flex items-start gap-3">
              {/* Kind icon */}
              <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", kindTone[item.kind])}>
                <Icon className="h-4 w-4" aria-hidden />
              </div>

              {/* Main content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em]", kindTone[item.kind])}>
                    {kindLabelFr(item.kind)}
                  </span>
                  <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium tabular", urgencyTone(item.hoursRemaining))}>
                    <Clock className="h-3 w-3" aria-hidden />
                    {item.hoursRemaining}h restantes
                  </span>
                  {item.priceDzd !== undefined && (
                    <span className="ms-auto text-[13px] font-semibold tabular text-foreground">
                      {formatPrice(item.priceDzd, "fr")}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={cn("text-[10px] text-white font-semibold", `bg-gradient-to-br ${item.actor.accent}`)}>
                      {item.actor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-3">
                      {item.actor.name}
                      {item.actor.city ? ` · ${item.actor.city}` : ""}
                    </p>
                  </div>
                </div>

                <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink-2">
                  {item.subtitle}
                </p>

                {/* Actions per kind */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <QueueActions
                    item={item}
                    onApprove={() => onApprove(item)}
                    onReject={() => onReject(item)}
                    onIgnore={() => onIgnore(item)}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
      <li>
        <Link
          href="/teach/requests"
          className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] bg-surface px-4 py-2.5 text-[13px] font-medium text-ink-2 hover:bg-surface-2 hover:text-foreground"
        >
          Voir tout dans la boîte de réception
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </li>
    </ul>
  );
}

function QueueActions({
  item,
  onApprove,
  onReject,
  onIgnore,
}: {
  item: ActionItem;
  onApprove: () => void;
  onReject: () => void;
  onIgnore: () => void;
}) {
  switch (item.kind) {
    case "approval":
      return (
        <>
          <Button size="sm" variant="primary" onClick={onApprove}>
            <Check className="h-3.5 w-3.5" />
            Accepter
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            <X className="h-3.5 w-3.5" />
            Refuser
          </Button>
        </>
      );
    case "payment_confirmation":
      return (
        <Button size="sm" variant="primary" onClick={onApprove}>
          <Check className="h-3.5 w-3.5" />
          Confirmer la réception
        </Button>
      );
    case "direct_invite":
      return (
        <>
          <Button size="sm" variant="primary" asChild>
            <Link href={item.primaryHref as never}>
              <Send className="h-3.5 w-3.5" />
              Envoyer une proposition
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={onIgnore}>
            Décliner
          </Button>
        </>
      );
    case "proposal_opportunity":
      return (
        <>
          <Button size="sm" variant="primary" asChild>
            <Link href={item.primaryHref as never}>
              <Send className="h-3.5 w-3.5" />
              Répondre
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={onIgnore}>
            Ignorer
          </Button>
        </>
      );
  }
}
