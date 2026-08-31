"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type Role = "eleve" | "prof" | "parent" | "agence";
type Kind = "espoir" | "doute" | "question";

type Note = {
  id: string;
  role: Role;
  kind: Kind;
  quote: string;
  attribution: string;
};

const NOTES_A: Note[] = [
  {
    id: "a1",
    role: "eleve",
    kind: "espoir",
    quote:
      "Ce que je veux, c'est voir le prof avant. Pas juste une photo, une vraie séance de 10 minutes pour sentir si ça passe.",
    attribution: "Un élève de terminale · Alger · entretien juin 2026",
  },
  {
    id: "a2",
    role: "prof",
    kind: "doute",
    quote:
      "Ce que j'ai peur de perdre, c'est le lien direct. Sur les autres plateformes, l'élève finit par nous demander WhatsApp.",
    attribution: "Une prof de physique · Oran · entretien juin 2026",
  },
  {
    id: "a3",
    role: "parent",
    kind: "question",
    quote:
      "Et si mon fils ne s'entend pas avec le prof, qu'est-ce qu'il se passe pour l'argent que j'ai déjà versé ?",
    attribution: "Un parent · Blida · entretien juin 2026",
  },
  {
    id: "a4",
    role: "prof",
    kind: "espoir",
    quote:
      "Si je peux ouvrir mon calendrier, arrêter d'écrire des reçus à la main, et récupérer mes soirées — je signe.",
    attribution: "Un prof de français · Alger · entretien juin 2026",
  },
];

const NOTES_B: Note[] = [
  {
    id: "b1",
    role: "prof",
    kind: "doute",
    quote:
      "Les commissions, c'est là où ça coince toujours. Montrez-moi combien vous prenez avant que je vous fasse confiance.",
    attribution: "Un prof de maths · Sétif · entretien juin 2026",
  },
  {
    id: "b2",
    role: "eleve",
    kind: "question",
    quote:
      "Est-ce que le prof est vraiment prof ? Comment vous vérifiez qu'il sait ce qu'il enseigne ?",
    attribution: "Une étudiante · Constantine · entretien juin 2026",
  },
  {
    id: "b3",
    role: "agence",
    kind: "espoir",
    quote:
      "On est trois profs à travailler ensemble depuis deux ans. On veut un tableau de bord commun, pas un site web à maintenir.",
    attribution: "Un collectif de 3 enseignants · Béjaïa · entretien juin 2026",
  },
  {
    id: "b4",
    role: "eleve",
    kind: "question",
    quote:
      "Est-ce qu'on peut suivre plusieurs profs en même temps, ou il faut choisir ?",
    attribution: "Une étudiante en médecine · Tlemcen · entretien juin 2026",
  },
];

const ROLE: Record<
  Role,
  { label: string; dot: string; hoverBorder: string }
> = {
  eleve: {
    label: "Élève",
    dot: "bg-accent",
    hoverBorder: "hover:border-accent/60",
  },
  prof: {
    label: "Enseignant·e",
    dot: "bg-[#F0A014]",
    hoverBorder: "hover:border-[#F0A014]/60",
  },
  parent: {
    label: "Parent",
    dot: "bg-success",
    hoverBorder: "hover:border-success/60",
  },
  agence: {
    label: "Collectif",
    dot: "bg-ink",
    hoverBorder: "hover:border-ink/50",
  },
};

const KIND: Record<Kind, { label: string; chip: string }> = {
  espoir: {
    label: "Un espoir",
    chip: "bg-success-soft/70 text-success",
  },
  doute: {
    label: "Un doute",
    chip: "bg-[#FEF7E5] text-[#7A4E00]",
  },
  question: {
    label: "Une question",
    chip: "bg-accent-soft/70 text-accent",
  },
};

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

export function CommunityNotes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="notes-title"
      className="relative isolate overflow-hidden bg-white px-3 pt-16 sm:px-4 sm:pt-20 md:pt-28"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[520px] text-center"
        >
          <h2
            id="notes-title"
            style={{ fontFamily: CABINET }}
            className="text-[32px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[40px] md:text-[44px]"
          >
            Ce qu'on entend en bêta.
          </h2>
          <p className="mt-4 text-[14px] italic leading-relaxed text-ink-3">
            Ces notes sont pré-lancement — vraies, pas filtrées.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 not-italic">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink-3" />
            Phase bêta · Aucun avis inventé
          </p>
        </motion.div>
      </div>

      <MarqueeOrGrid rowA={NOTES_A} rowB={NOTES_B} />
    </section>
  );
}

/* ------------------------------------------------------------------ */

function MarqueeOrGrid({ rowA, rowB }: { rowA: Note[]; rowB: Note[] }) {
  return (
    <div className="mt-12 sm:mt-16">
      <div className="motion-reduce:hidden">
        <MarqueeRow notes={rowA} direction="left" />
        <div className="mt-4 sm:mt-5">
          <MarqueeRow notes={rowB} direction="right" />
        </div>
      </div>

      <div className="hidden motion-reduce:block">
        <div className="container-wide">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...rowA, ...rowB].map((n) => (
              <li key={n.id}>
                <NoteCard note={n} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  notes,
  direction,
}: {
  notes: Note[];
  direction: "left" | "right";
}) {
  const track = useMemo(() => [...notes, ...notes], [notes]);
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "flex w-max gap-4",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          "hover:[animation-play-state:paused]",
        )}
      >
        {track.map((n, i) => (
          <NoteCard key={`${n.id}-${i}`} note={n} />
        ))}
      </div>

      {/* 80px edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent"
      />

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const role = ROLE[note.role];
  const kind = KIND[note.kind];

  return (
    <article
      className={cn(
        "flex h-[200px] w-[300px] shrink-0 flex-col justify-between rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-[0_1px_2px_rgba(10,11,14,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(10,11,14,0.18)] sm:h-[210px] sm:w-[340px] sm:p-6",
        role.hoverBorder,
      )}
    >
      {/* Header: role dot top-left, MessageCircle top-right */}
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/8 bg-ink/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", role.dot)} aria-hidden />
          {role.label}
        </span>
        <MessageCircle
          className="h-4 w-4 text-ink-3"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      {/* Quote — italic Cabinet, 18-20px */}
      <p
        style={{ fontFamily: CABINET }}
        className="line-clamp-4 text-[16px] font-semibold italic leading-snug tracking-[-0.01em] text-ink sm:text-[17px]"
      >
        « {note.quote} »
      </p>

      {/* Bottom: attribution + kind chip */}
      <div className="flex items-center justify-between gap-3">
        <p className="line-clamp-1 text-[11.5px] leading-snug text-ink-3">
          {note.attribution}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
            kind.chip,
          )}
        >
          {kind.label}
        </span>
      </div>
    </article>
  );
}
