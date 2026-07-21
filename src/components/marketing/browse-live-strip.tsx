"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Clock,
  Radio,
  Users,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Card = {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  wilaya: string;
  price: string;
  meta: string;
  seats: string;
  accent: "blue" | "amber" | "ink" | "green";
};

const LIVE: Card[] = [
  {
    id: "l1",
    subject: "Mathématiques · Terminale",
    title: "Suites numériques, sans panique",
    teacher: "Karim B.",
    wilaya: "Alger · en direct",
    price: "1 400 DZD",
    meta: "En direct · démarrée il y a 12 min",
    seats: "18 élèves connectés",
    accent: "blue",
  },
  {
    id: "l2",
    subject: "Physique · 2ᵉ AS",
    title: "Mécanique — chute libre expliquée en 45 min",
    teacher: "Nadia M.",
    wilaya: "Oran · en direct",
    price: "1 200 DZD",
    meta: "En direct · démarrée il y a 3 min",
    seats: "9 élèves connectés",
    accent: "amber",
  },
  {
    id: "l3",
    subject: "Anglais · Adultes",
    title: "Speaking club — thème « job interview »",
    teacher: "Yasmine S.",
    wilaya: "Constantine · en direct",
    price: "900 DZD",
    meta: "En direct · démarrée il y a 22 min",
    seats: "24 élèves connectés",
    accent: "green",
  },
  {
    id: "l4",
    subject: "Français · Bac",
    title: "Le commentaire composé, la méthode qui marche",
    teacher: "Amine H.",
    wilaya: "Alger · en direct",
    price: "1 300 DZD",
    meta: "En direct · démarrée il y a 1 min",
    seats: "31 élèves connectés",
    accent: "ink",
  },
];

const UPCOMING: Card[] = [
  {
    id: "u1",
    subject: "Algorithmique · Prépa",
    title: "Graphe & Dijkstra pour l'entretien technique",
    teacher: "Sofiane R.",
    wilaya: "En ligne",
    price: "1 800 DZD",
    meta: "Ven. 24 juil · 19 h 00",
    seats: "6 places restantes",
    accent: "blue",
  },
  {
    id: "u2",
    subject: "Chimie · 1ère AS",
    title: "Mole, quantité de matière et tableau d'avancement",
    teacher: "Lina O.",
    wilaya: "Blida · en ligne",
    price: "1 100 DZD",
    meta: "Sam. 25 juil · 10 h 30",
    seats: "12 places restantes",
    accent: "amber",
  },
  {
    id: "u3",
    subject: "SVT · Bac",
    title: "Génétique — cartes mentales et QCM",
    teacher: "Rania T.",
    wilaya: "En ligne",
    price: "1 200 DZD",
    meta: "Dim. 26 juil · 18 h 00",
    seats: "4 places restantes",
    accent: "green",
  },
  {
    id: "u4",
    subject: "Arabe littéraire · Bac",
    title: "Analyse de poème & dissertation guidée",
    teacher: "Djamila F.",
    wilaya: "Sétif · en ligne",
    price: "1 000 DZD",
    meta: "Lun. 27 juil · 17 h 00",
    seats: "Complet — file d'attente",
    accent: "ink",
  },
];

type TabId = "live" | "upcoming";

export function BrowseLiveStrip() {
  const [tab, setTab] = useState<TabId>("live");
  const cards = tab === "live" ? LIVE : UPCOMING;

  return (
    <section
      aria-labelledby="browse-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        {/* Header + tabs — no eyebrow. Tab pill anchors bottom-left of the block on mobile so it sits in thumb range. */}
        <Reveal direction="up">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-lg">
              <h2
                id="browse-title"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[38px] md:text-[46px]"
              >
                Un cours démarre.{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span
                    aria-hidden
                    className="absolute -left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-danger live-dot"
                  />
                  <span className="pl-3 tabular text-ink-2">Toutes les 4 min</span>
                </span>
                .
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2 sm:text-[15.5px]">
                Rejoignez une session en direct, ou réservez le créneau qui
                colle à votre semaine.
              </p>
            </div>

            <TabSwitch tab={tab} setTab={setTab} liveCount={LIVE.length} />
          </div>
        </Reveal>

        {/* Card strip */}
        <div className="relative mt-8 sm:mt-10">
          {/* Mobile: snap-x scroll strip. Desktop: grid. */}
          <ul
            key={tab} // remount for a subtle fade when tab flips
            className="snap-x-carousel -mx-3 gap-3 px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
            style={{ animation: "fade-up-in 500ms cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {cards.map((c, i) => (
              <li
                key={c.id}
                className="w-[86%] shrink-0 sm:w-auto"
                style={{
                  animation: `fade-up-in 600ms cubic-bezier(0.16,1,0.3,1) ${80 + i * 60}ms both`,
                }}
              >
                <CourseCard card={c} isLive={tab === "live"} />
              </li>
            ))}
          </ul>

          {/* Fade edges on mobile */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent sm:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent sm:hidden"
          />
        </div>

        {/* All courses CTA */}
        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href={tab === "live" ? routes.live() : routes.browse()}
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-[13.5px] font-semibold tracking-tight text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_12px_28px_-14px_rgba(10,11,14,0.25)] focus-visible:outline-none focus-visible:shadow-focus sm:px-7 sm:py-3.5 sm:text-[14px]"
          >
            {tab === "live"
              ? "Voir tous les cours en direct"
              : "Parcourir le catalogue complet"}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.2}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function TabSwitch({
  tab,
  setTab,
  liveCount,
}: {
  tab: TabId;
  setTab: (t: TabId) => void;
  liveCount: number;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtre du catalogue"
      className="relative inline-flex items-center gap-1 self-start rounded-full border border-ink/10 bg-white p-1 shadow-[0_8px_20px_-14px_rgba(10,11,14,0.2)] sm:self-auto"
    >
      <TabButton
        active={tab === "live"}
        onClick={() => setTab("live")}
        id="tab-live"
      >
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tab === "live" ? "bg-danger live-dot" : "bg-ink/25",
          )}
        />
        En direct
        <span
          className={cn(
            "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular",
            tab === "live"
              ? "bg-white/15 text-white"
              : "bg-ink/[0.06] text-ink-3",
          )}
        >
          {liveCount}
        </span>
      </TabButton>
      <TabButton
        active={tab === "upcoming"}
        onClick={() => setTab("upcoming")}
        id="tab-upcoming"
      >
        <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden />
        À venir
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  id,
  children,
}: {
  active: boolean;
  onClick: () => void;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      id={id}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:shadow-focus sm:text-[13px]",
        active
          ? "bg-ink text-white shadow-[0_6px_14px_-8px_rgba(10,11,14,0.55)]"
          : "text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function CourseCard({ card, isLive }: { card: Card; isLive: boolean }) {
  const accentBg =
    card.accent === "blue"
      ? "bg-accent-soft/70"
      : card.accent === "amber"
        ? "bg-[#FEF7E5]"
        : card.accent === "green"
          ? "bg-success-soft/70"
          : "bg-ink/5";
  const accentInk =
    card.accent === "blue"
      ? "text-accent"
      : card.accent === "amber"
        ? "text-[#7A4E00]"
        : card.accent === "green"
          ? "text-success"
          : "text-ink";

  return (
    <Link
      href={isLive ? routes.live() : routes.browse()}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_20px_40px_-20px_rgba(10,11,14,0.18)] sm:rounded-[1.75rem]"
    >
      {/* Thumb area */}
      <div
        className={cn(
          "relative flex aspect-[16/10] items-end overflow-hidden p-4 sm:p-5",
          accentBg,
        )}
      >
        {/* Decorative shapes */}
        <div
          aria-hidden
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-xl"
        />
        <div
          aria-hidden
          className={cn(
            "absolute -left-8 top-4 h-16 w-16 rounded-2xl opacity-40",
            card.accent === "blue"
              ? "bg-accent/40"
              : card.accent === "amber"
                ? "bg-[#F0A014]/40"
                : card.accent === "green"
                  ? "bg-success/40"
                  : "bg-ink/25",
          )}
        />

        {/* Subject chip */}
        <div className="relative z-10 flex w-full items-end justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm",
              accentInk,
            )}
          >
            <BookOpen className="h-3 w-3" strokeWidth={2.2} aria-hidden />
            {card.subject}
          </span>

          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-danger live-dot"
              />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3
          style={{
            fontFamily: "var(--font-cabinet), system-ui, sans-serif",
          }}
          className="text-[15.5px] font-bold leading-snug tracking-[-0.015em] text-ink line-clamp-2 sm:text-[16.5px]"
        >
          {card.title}
        </h3>

        <div className="flex items-center gap-2 text-[12.5px] text-ink-2">
          {/* Avatar placeholder */}
          <span
            aria-hidden
            className={cn(
              "grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold",
              accentBg,
              accentInk,
            )}
          >
            {card.teacher.charAt(0)}
          </span>
          <span className="font-semibold text-ink">{card.teacher}</span>
          <span className="text-ink-3">·</span>
          <span>{card.wilaya}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/6 pt-3">
          <div className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
            {isLive ? (
              <Radio className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            )}
            <span>{card.meta}</span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-cabinet), system-ui, sans-serif",
            }}
            className="text-[15px] font-bold tabular text-ink sm:text-[16px]"
          >
            {card.price}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
          <Users className="h-3 w-3" strokeWidth={2} aria-hidden />
          <span>{card.seats}</span>
        </div>
      </div>
    </Link>
  );
}
