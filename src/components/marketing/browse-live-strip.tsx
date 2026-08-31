"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, CalendarClock, Clock, Radio, Users } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Accent = "blue" | "amber" | "ink" | "green";

type Card = {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  wilaya: string;
  price: string;
  meta: string;
  seats: string;
  accent: Accent;
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
const CABINET = "var(--font-cabinet), system-ui, sans-serif";

const ACCENTS: Record<Accent, { bg: string; text: string; border: string; ring: string }> = {
  blue: {
    bg: "bg-accent-soft/70",
    text: "text-accent",
    border: "hover:border-accent/60",
    ring: "rgba(47,111,235,0.4)",
  },
  amber: {
    bg: "bg-[#FEF7E5]",
    text: "text-[#7A4E00]",
    border: "hover:border-[#F0A014]/60",
    ring: "rgba(240,160,20,0.4)",
  },
  green: {
    bg: "bg-success-soft/70",
    text: "text-success",
    border: "hover:border-success/60",
    ring: "rgba(46,139,107,0.4)",
  },
  ink: {
    bg: "bg-ink/5",
    text: "text-ink",
    border: "hover:border-ink/40",
    ring: "rgba(10,11,14,0.35)",
  },
};

export function BrowseLiveStrip() {
  const [tab, setTab] = useState<TabId>("live");
  const cards = tab === "live" ? LIVE : UPCOMING;

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="browse-title"
      className="relative isolate bg-white px-3 pt-16 sm:px-4 sm:pt-20 md:pt-28"
    >
      <div className="container-wide">
        {/* Header row: title left, live-dot counter right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <h2
              id="browse-title"
              style={{ fontFamily: CABINET }}
              className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[36px] md:text-[40px]"
            >
              Un cours démarre.{" "}
              <span className="relative inline-block whitespace-nowrap pl-4">
                <PingDot />
                <span className="tabular text-ink-2">Toutes les 4 min</span>
              </span>
              .
            </h2>
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-3 sm:text-[15.5px]">
              Rejoignez une session en direct, ou réservez le créneau qui
              colle à votre semaine.
            </p>
          </div>

          <TabSwitch tab={tab} setTab={setTab} liveCount={LIVE.length} />
        </motion.div>

        {/* Card strip: mobile snap carousel, desktop 4-col grid */}
        <div className="relative mt-10 sm:mt-12">
          <AnimatePresence mode="wait">
            <motion.ul
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="snap-x-carousel -mx-3 gap-3 px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
            >
              {cards.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-[86%] shrink-0 sm:w-auto"
                >
                  <CourseCard card={c} isLive={tab === "live"} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {/* Edge fades on mobile */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent sm:hidden"
          />
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
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

/* ------------------- PingDot: scale 1→1.4 + opacity fade (animate-ping style) */

function PingDot() {
  return (
    <span
      aria-hidden
      className="absolute left-0 top-1/2 inline-flex h-2 w-2 -translate-y-1/2"
    >
      <span
        className="absolute inline-flex h-full w-full rounded-full bg-danger"
        style={{
          animation: "browse-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
      <style jsx>{`
        @keyframes browse-ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}

/* ------------------- Sliding-pill tab switcher */

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
      className="relative inline-flex items-center self-start rounded-full border border-ink/10 bg-white p-1 shadow-[0_8px_20px_-14px_rgba(10,11,14,0.2)] sm:self-auto"
    >
      {/* Sliding dark background pill */}
      <motion.span
        aria-hidden
        layout
        initial={false}
        animate={{ x: tab === "live" ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute left-1 top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-ink shadow-[0_6px_14px_-8px_rgba(10,11,14,0.55)]"
      />
      <TabButton active={tab === "live"} onClick={() => setTab("live")}>
        <PingDotSmall active={tab === "live"} />
        En direct
        <span
          className={cn(
            "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular transition-colors",
            tab === "live"
              ? "bg-white/15 text-white"
              : "bg-ink/[0.06] text-ink-3",
          )}
        >
          {liveCount}
        </span>
      </TabButton>
      <TabButton active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
        <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden />
        À venir
      </TabButton>
    </div>
  );
}

function PingDotSmall({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-1.5 w-1.5"
    >
      {active && (
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-danger"
          style={{
            animation: "tab-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-1.5 w-1.5 rounded-full",
          active ? "bg-danger" : "bg-ink/25",
        )}
      />
      <style jsx>{`
        @keyframes tab-ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:shadow-focus sm:px-4",
        active ? "text-white" : "text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------- CourseCard */

function CourseCard({ card, isLive }: { card: Card; isLive: boolean }) {
  const a = ACCENTS[card.accent];

  return (
    <Link
      href={isLive ? routes.live() : routes.browse()}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(10,11,14,0.18)]",
        a.border,
      )}
    >
      {/* Solid colored thumbnail area (~160px) */}
      <div
        className={cn(
          "relative flex h-[160px] items-end overflow-hidden p-4",
          a.bg,
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

        {/* Subject chip bottom-left, LIVE badge top-right (positioned via absolute) */}
        <span
          className={cn(
            "relative z-10 inline-flex items-center rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm",
            a.text,
          )}
        >
          {card.subject}
        </span>

        {isLive && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            <PingDotSmall active />
            EN DIRECT
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          style={{ fontFamily: CABINET }}
          className="line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em] text-ink"
        >
          {card.title}
        </h3>

        <div className="flex items-center gap-2 text-[13px] text-ink-2">
          <span
            aria-hidden
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold",
              a.bg,
              a.text,
            )}
          >
            {card.teacher.charAt(0)}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-ink">{card.teacher}</span>
            <span className="text-[11.5px] text-ink-3">{card.wilaya}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/6 pt-3">
          <div className="flex items-center gap-1.5 text-[12px] text-ink-3">
            {isLive ? (
              <Radio className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            )}
            <span>{card.meta}</span>
          </div>
          <span
            style={{ fontFamily: CABINET }}
            className="text-[18px] font-bold tabular text-ink"
          >
            {card.price}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
          <Users className="h-3 w-3" strokeWidth={2} aria-hidden />
          <span>{card.seats}</span>
        </div>
      </div>
    </Link>
  );
}
