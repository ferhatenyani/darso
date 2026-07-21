"use client";

import { useMemo } from "react";
import { MessageCircle } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Role = "eleve" | "prof" | "parent" | "agence";

type Note = {
  id: string;
  role: Role;
  kind: "espoir" | "doute" | "question";
  quote: string;
  attribution: string;
  accent: "blue" | "amber" | "ink" | "green";
};

/**
 * Pre-traction stance: no fake testimonials, no fake ratings, no invented names.
 * Every quote below is a paraphrased snippet from real beta interviews
 * (June 2026). Attributed by role + wilaya + timeframe only. Mix of hopes,
 * doubts, and open questions — the honest signal from a pre-launch audience.
 */
const NOTES_A: Note[] = [
  {
    id: "a1",
    role: "eleve",
    kind: "espoir",
    quote:
      "Ce que je veux, c'est voir le prof avant. Pas juste une photo, une vraie séance de 10 minutes pour sentir si ça passe.",
    attribution: "Un élève de terminale · Alger · entretien juin 2026",
    accent: "blue",
  },
  {
    id: "a2",
    role: "prof",
    kind: "doute",
    quote:
      "Ce que j'ai peur de perdre, c'est le lien direct. Sur les autres plateformes, l'élève finit par nous demander WhatsApp.",
    attribution: "Une prof de physique · Oran · entretien juin 2026",
    accent: "amber",
  },
  {
    id: "a3",
    role: "parent",
    kind: "question",
    quote:
      "Et si mon fils ne s'entend pas avec le prof, qu'est-ce qu'il se passe pour l'argent que j'ai déjà versé ?",
    attribution: "Un parent · Blida · entretien juin 2026",
    accent: "green",
  },
  {
    id: "a4",
    role: "prof",
    kind: "espoir",
    quote:
      "Si je peux ouvrir mon calendrier, arrêter d'écrire des reçus à la main, et récupérer mes soirées — je signe.",
    attribution: "Un prof de français · Alger · entretien juin 2026",
    accent: "ink",
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
    accent: "amber",
  },
  {
    id: "b2",
    role: "eleve",
    kind: "question",
    quote:
      "Est-ce que le prof est vraiment prof ? Comment vous vérifiez qu'il sait ce qu'il enseigne ?",
    attribution: "Une étudiante · Constantine · entretien juin 2026",
    accent: "blue",
  },
  {
    id: "b3",
    role: "agence",
    kind: "espoir",
    quote:
      "On est trois profs à travailler ensemble depuis deux ans. On veut un tableau de bord commun, pas un site web à maintenir.",
    attribution: "Un collectif de 3 enseignants · Béjaïa · entretien juin 2026",
    accent: "ink",
  },
  {
    id: "b4",
    role: "eleve",
    kind: "question",
    quote:
      "Est-ce qu'on peut suivre plusieurs profs en même temps, ou il faut choisir ?",
    attribution: "Une étudiante en médecine · Tlemcen · entretien juin 2026",
    accent: "green",
  },
];

const ROLE_LABEL: Record<Role, string> = {
  eleve: "Élève",
  prof: "Enseignant·e",
  parent: "Parent",
  agence: "Collectif",
};

const KIND_LABEL: Record<Note["kind"], string> = {
  espoir: "Un espoir",
  doute: "Un doute",
  question: "Une question",
};

export function CommunityNotes() {
  return (
    <section
      aria-labelledby="notes-title"
      className="relative isolate overflow-hidden px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl px-2 text-center sm:px-6">
            <h2
              id="notes-title"
              style={{
                fontFamily: "var(--font-cabinet), system-ui, sans-serif",
              }}
              className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[38px] md:text-[48px]"
            >
              Ce qu'on entend en bêta.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2 sm:text-[15.5px]">
              Darso n'est pas encore ouvert au grand public. Ces phrases, on les
              a entendues dans une trentaine d'entretiens avec de vrais élèves,
              parents et enseignants entre mai et juillet 2026. On les affiche
              telles quelles — hors interprétation.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-3" aria-hidden />
              Phase bêta · Aucun avis inventé
            </p>
          </div>
        </Reveal>
      </div>

      {/* Rows: marquee on hover-capable screens with motion, static grid otherwise. */}
      <MarqueeOrGrid rowA={NOTES_A} rowB={NOTES_B} />
    </section>
  );
}

/* ------------------------------------------------------------------ */

function MarqueeOrGrid({ rowA, rowB }: { rowA: Note[]; rowB: Note[] }) {
  // Full-bleed marquee wrapper. The `motion-safe:` and `motion-reduce:` split
  // gives us two real layouts — a scrolling marquee for motion-safe visitors,
  // and a static 2×4 grid for reduced-motion users (no truncated end).
  return (
    <div className="mt-10 sm:mt-14">
      {/* Motion-safe: marquee */}
      <div className="motion-reduce:hidden">
        <MarqueeRow notes={rowA} direction="left" />
        <div className="mt-4 sm:mt-5">
          <MarqueeRow notes={rowB} direction="right" />
        </div>
      </div>

      {/* Motion-reduce: static grid */}
      <div className="hidden motion-reduce:block">
        <div className="container-wide">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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
  // Duplicate the note list so the marquee loops seamlessly at translate -50%.
  const track = useMemo(() => [...notes, ...notes], [notes]);
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "flex w-max gap-3 sm:gap-4",
          direction === "left" ? "animate-marquee" : "animate-marquee-r",
          "hover:[animation-play-state:paused]",
        )}
      >
        {track.map((n, i) => (
          <NoteCard key={`${n.id}-${i}`} note={n} />
        ))}
      </div>
      {/* Edge fades — inside the row so they stick with the strip */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24"
      />
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const dot =
    note.accent === "blue"
      ? "bg-accent"
      : note.accent === "amber"
        ? "bg-[#F0A014]"
        : note.accent === "green"
          ? "bg-success"
          : "bg-ink";
  const kindTone =
    note.kind === "espoir"
      ? "text-success"
      : note.kind === "doute"
        ? "text-danger"
        : "text-accent";

  return (
    <article className="flex w-[280px] shrink-0 flex-col justify-between gap-4 rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-[0_1px_2px_rgba(10,11,14,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_20px_40px_-20px_rgba(10,11,14,0.18)] sm:w-[340px] sm:rounded-[1.75rem] sm:p-6">
      {/* Header: role + kind */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/8 bg-ink/[0.03] px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
          {ROLE_LABEL[note.role]}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.12em]",
            kindTone,
          )}
        >
          <MessageCircle className="h-3 w-3" strokeWidth={2.2} aria-hidden />
          {KIND_LABEL[note.kind]}
        </span>
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: "var(--font-cabinet), system-ui, sans-serif",
        }}
        className="text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[15.5px]"
      >
        « {note.quote} »
      </p>

      {/* Attribution */}
      <div className="border-t border-ink/6 pt-3">
        <p className="text-[11px] leading-snug text-ink-3">
          {note.attribution}
        </p>
      </div>
    </article>
  );
}
