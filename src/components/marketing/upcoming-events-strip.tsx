"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import { EventCard } from "@/components/marketing/event-card";
import { MarketingCarousel } from "@/components/ui/marketing-carousel";
import { Reveal } from "@/components/ui/reveal";
import { upcomingSessions } from "@/lib/mock/sessions";
import { routes } from "@/lib/routes";

export function UpcomingEventsStrip() {
  const events = upcomingSessions.filter((s) => s.state !== "later").slice(0, 6);
  const hasEvents = events.length > 0;

  return (
    <section
      aria-labelledby="ev-title"
      className="border-t border-border py-14 md:py-20 lg:py-24"
    >
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-danger/60 live-dot" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
                </span>
                Cette semaine
              </p>
              <h2
                id="ev-title"
                className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]"
              >
                Cours en direct & ateliers à venir
              </h2>
              <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
                Réservez une place, rejoignez en direct, ou proposez un atelier si vous enseignez.
              </p>
            </div>
            <Link
              href={routes.live()}
              className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent"
            >
              <span className="accent-underline">Tous les événements</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        {hasEvents ? (
          <Reveal delay={80} className="mt-8 md:mt-10">
            <MarketingCarousel
              items={events}
              keyFor={(e) => e.id}
              ariaLabel="Événements à venir"
              slideClassName="w-[80vw] max-w-[320px] sm:w-[52vw] sm:max-w-[340px] md:w-[calc((100%-2rem)/2)] md:max-w-none lg:w-[calc((100%-3rem)/3)]"
              gap="gap-4"
              renderItem={(e) => <EventCard session={e} className="h-full" />}
            />
          </Reveal>
        ) : (
          <Reveal className="mt-10">
            <div className="grid gap-6 rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-10 text-center sm:grid-cols-[auto_1fr] sm:items-center sm:text-start">
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
                  className="mt-4 inline-flex h-10 items-center rounded-[var(--radius-xs)] bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
                >
                  Proposer un atelier
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
