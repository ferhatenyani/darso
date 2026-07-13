import { Clock, Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Session } from "@/lib/mock/sessions";

const formatLabel: Record<Session["format"], string> = {
  "1to1": "Cours 1:1",
  cohort: "Cohorte",
  event: "Atelier",
  ondemand: "À la demande",
};

export function EventCard({
  session,
  className,
}: {
  session: Session;
  className?: string;
}) {
  const isLive = session.state === "live";
  const isSoon = session.state === "soon";
  const isFull = session.capacity.taken >= session.capacity.total;

  // Extract short date parts from localized label for the badge:
  // e.g. "Aujourd'hui · 18h00" → day="Aujourd'hui", time="18h00"
  const [dayPart, timePart] = session.startsAt.fr.split(" · ");

  return (
    <Link
      href={isLive ? routes.call(session.id) : routes.course(session.id)}
      aria-label={session.title.fr}
      className={cn(
        "group card-interactive block rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-e1 focus-visible:outline-none",
        className,
      )}
    >
      {/* Header row: date badge + live indicator */}
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-14 min-w-14 place-items-center rounded-[var(--radius-md)] bg-surface p-1 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">{dayPart}</span>
          <span className="text-[14px] font-bold leading-none text-foreground tabular">{timePart}</span>
        </div>

        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-danger-foreground/70 live-dot" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-danger-foreground" />
            </span>
            En direct
          </span>
        ) : isSoon ? (
          <Badge variant="warning" shape="square">
            <Clock className="h-3 w-3" aria-hidden />
            Dans {session.startsInMin} min
          </Badge>
        ) : (
          <Badge variant="default" shape="square">{formatLabel[session.format]}</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
        {session.title.fr}
      </h3>

      {/* Teacher name */}
      <p className="mt-1 text-[13px] text-ink-2">
        par <span className="font-medium">{session.teacher.name.fr}</span>
      </p>

      {/* Duration + capacity */}
      <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-3">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden />
          {session.durationMin} min
        </span>
        <span className="tabular">
          {session.capacity.taken}/{session.capacity.total} places
        </span>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-border" aria-hidden />

      {/* Price + CTA */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold text-foreground tabular">
          {session.priceDzd === 0
            ? "Gratuit"
            : <>{session.priceDzd.toLocaleString("fr-FR")} <span className="text-[12px] font-medium text-ink-2">DA</span></>}
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent transition-colors group-hover:underline">
          {isLive ? <><Radio className="h-3.5 w-3.5" aria-hidden /> Rejoindre</> : isFull ? "Liste d'attente →" : "Réserver →"}
        </span>
      </div>
    </Link>
  );
}
