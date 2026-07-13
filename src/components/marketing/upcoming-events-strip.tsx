import { Link } from "@/i18n/navigation";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import { EventCard } from "@/components/marketing/event-card";
import { upcomingSessions } from "@/lib/mock/sessions";
import { routes } from "@/lib/routes";

export function UpcomingEventsStrip() {
  // Real data: only sessions that are live / soon / this-week / tomorrow.
  const events = upcomingSessions
    .filter((s) => s.state !== "later")
    .slice(0, 6);
  const hasEvents = events.length > 0;

  return (
    <section aria-labelledby="ev-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Cette semaine
            </p>
            <h2 id="ev-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
              Cours en direct & ateliers à venir
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
              Réservez une place, rejoignez en direct, ou proposez un atelier si vous enseignez.
            </p>
          </div>
          <Link
            href={routes.live()}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-accent hover:underline"
          >
            Tous les événements
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        {hasEvents ? (
          <>
            <div className="mt-8 sm:hidden">
              <div className="snap-x-carousel gap-3 -mx-4 px-4">
                {events.map((e) => (
                  <EventCard key={e.id} session={e} className="w-[78vw] max-w-[320px]" />
                ))}
              </div>
            </div>
            <div className="mt-8 hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} session={e} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 grid gap-6 rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-10 text-center sm:grid-cols-[auto_1fr] sm:items-center sm:text-start">
            <span
              aria-hidden
              className="mx-auto grid h-14 w-14 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2"
            >
              <CalendarPlus className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-foreground">
                Aucun événement en direct programmé
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                Revenez plus tard, ou proposez le vôtre si vous enseignez.
              </p>
              <Link
                href={routes.teachLanding()}
                className="mt-4 inline-flex h-10 items-center rounded-[var(--radius-xs)] bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Proposer un atelier
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
