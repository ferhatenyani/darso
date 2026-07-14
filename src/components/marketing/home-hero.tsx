"use client";

import { useState } from "react";
import { Search, GraduationCap, Sparkles, ArrowRight } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const POPULAR: { label: string; q: string }[] = [
  { label: "Maths Bac", q: "Maths Bac" },
  { label: "IELTS", q: "IELTS" },
  { label: "Physique", q: "Physique" },
  { label: "Coran & tajwid", q: "Coran" },
  { label: "Programmation Web", q: "React" },
  { label: "Piano", q: "Piano" },
];

export function HomeHero() {
  const router = useRouter();
  const [mode, setMode] = useState<"learn" | "teach">("learn");
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "teach") {
      router.push(routes.teachLanding() as never);
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}` as never);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Backgrounds: dotted grid + accent hairline + editorial corner tick */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots opacity-70 [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_80%)]"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-border" />
      <div aria-hidden className="absolute start-8 top-0 -z-10 h-[3px] w-24 bg-accent md:start-12" />

      <div className="container-wide grid gap-10 pt-10 pb-14 md:pt-16 md:pb-20 lg:grid-cols-12 lg:gap-16 lg:pt-24 lg:pb-28">
        {/* LEFT — Copy + search + dual toggle */}
        <div className="lg:col-span-7 xl:col-span-7">
          {/* Eyebrow */}
          <div
            className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[12px] font-medium text-ink-2"
            style={{ animationDelay: "0ms" }}
          >
            <span className="ink-rule" />
            La marketplace de l'apprentissage
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up mt-6 text-[38px] font-bold leading-[1.02] tracking-[-0.02em] text-foreground sm:text-[46px] md:text-[54px] lg:text-[60px] xl:text-[68px] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            Apprenez ce qui vous fait avancer,{" "}
            <span className="relative inline-block">
              <span className="relative z-10">avec des enseignants</span>
              <span
                aria-hidden
                className="anim-underline absolute inset-x-0 bottom-1 -z-0 h-[10px] bg-accent-soft"
              />
            </span>{" "}
            qui s'engagent.
          </h1>

          {/* Subtitle */}
          <p
            className="anim-fade-up mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-2 md:text-[17px]"
            style={{ animationDelay: "180ms" }}
          >
            Trouvez un cours particulier, une cohorte en ligne ou un atelier en direct. Payez en sécurité,
            réservez sans engagement, et changez de professeur si nécessaire.
          </p>

          {/* Dual-path toggle */}
          <div
            role="tablist"
            aria-label="Vous voulez apprendre ou enseigner ?"
            className="anim-fade-up mt-8 inline-flex rounded-[var(--radius-md)] border border-border bg-surface p-1"
            style={{ animationDelay: "260ms" }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "learn"}
              onClick={() => setMode("learn")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-[var(--radius-xs)] px-4 text-[13.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:shadow-focus",
                mode === "learn"
                  ? "bg-background text-foreground shadow-e1"
                  : "text-ink-2 hover:text-foreground",
              )}
            >
              <GraduationCap className="h-4 w-4" aria-hidden />
              Je veux apprendre
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "teach"}
              onClick={() => setMode("teach")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-[var(--radius-xs)] px-4 text-[13.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:shadow-focus",
                mode === "teach"
                  ? "bg-background text-foreground shadow-e1"
                  : "text-ink-2 hover:text-foreground",
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Je veux enseigner
            </button>
          </div>

          {/* Search (only in learn mode) OR CTA (in teach mode) */}
          {mode === "learn" ? (
            <>
              <form
                onSubmit={onSubmit}
                aria-label="Rechercher un cours ou un professeur"
                className="anim-fade-up mt-4 flex items-stretch gap-2 rounded-[var(--radius-lg)] border border-border-strong bg-card p-1.5 shadow-e1 transition-all duration-300 focus-within:border-accent focus-within:shadow-e2 max-w-2xl"
                style={{ animationDelay: "340ms" }}
              >
                <span className="ms-2 grid h-11 w-9 place-items-center text-ink-3">
                  <Search className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Une matière, un professeur, une ville…"
                  className="h-11 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
                  aria-label="Que voulez-vous apprendre ?"
                />
                <button
                  type="submit"
                  className="group inline-flex h-11 items-center gap-1.5 rounded-[var(--radius-xs)] bg-accent px-4 text-[14px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus"
                >
                  Rechercher
                  <ArrowRight
                    className="h-3.5 w-3.5 rtl-flip transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
              </form>

              {/* Popular chips */}
              <div
                className="anim-fade-up mt-4 flex flex-wrap items-center gap-1.5"
                style={{ animationDelay: "420ms" }}
              >
                <span className="text-[12px] font-medium text-ink-3 me-1">Populaire :</span>
                {POPULAR.map((p, i) => (
                  <Link
                    key={p.q}
                    href={`/browse?q=${encodeURIComponent(p.q)}` as never}
                    className="rounded-full border border-border bg-background px-3 py-1 text-[12.5px] font-medium text-ink-2 transition-all duration-200 hover:-translate-y-[1px] hover:border-accent hover:bg-accent-soft/60 hover:text-accent focus-visible:outline-none focus-visible:shadow-focus"
                    style={{ animationDelay: `${460 + i * 40}ms` }}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div
              className="anim-fade-up mt-4 max-w-2xl rounded-[var(--radius-lg)] border border-border-strong bg-card p-6 shadow-e1"
              style={{ animationDelay: "340ms" }}
            >
              <p className="text-[15px] leading-relaxed text-ink-2">
                Publiez vos cours en 10 minutes. Recevez des demandes d'élèves. Gérez réservations et
                paiements depuis un seul tableau de bord.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={routes.teachLanding()}
                  className="group inline-flex h-11 items-center gap-2 rounded-[var(--radius-xs)] bg-primary px-5 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:shadow-focus"
                >
                  Devenir enseignant
                  <ArrowRight
                    className="h-3.5 w-3.5 rtl-flip transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <Link
                  href={routes.teachPricing()}
                  className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-xs)] border border-border bg-background px-5 text-[14px] font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:shadow-focus"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — abstract brand mark (never stock photo) */}
        <div className="hidden lg:col-span-5 lg:block xl:col-span-5">
          <HeroBrandMark />
        </div>
      </div>
    </section>
  );
}

/** Editorial brand illustration — geometric, no stock, no gradient orbs. */
function HeroBrandMark() {
  return (
    <div
      className="anim-fade-up relative aspect-square w-full max-w-[520px]"
      style={{ animationDelay: "260ms", animationDuration: "900ms" }}
    >
      {/* Base surface tile */}
      <div className="absolute inset-0 rounded-[var(--radius-xl)] border border-border bg-surface shadow-e1" />
      {/* Grid pattern inside */}
      <div className="absolute inset-6 rounded-[var(--radius-lg)] bg-grid-sm opacity-60" />
      {/* Editorial corner mark */}
      <div className="absolute inset-x-6 top-6 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          darso · marketplace
        </span>
        <span className="h-[3px] w-10 bg-accent" />
      </div>
      {/* Central editorial number */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
        <p className="font-mono text-[13px] uppercase tracking-widest text-ink-3">
          À vous de jouer
        </p>
        <p
          className="anim-count-in mt-3 text-[92px] font-black leading-none tracking-tighter text-foreground/90"
          style={{ animationDelay: "480ms" }}
        >
          01
        </p>
        <p className="mt-3 max-w-[320px] mx-auto text-[13px] leading-relaxed text-ink-2">
          Cherchez, comparez, réservez, apprenez. Chaque étape est claire — jamais de mauvaise surprise.
        </p>
      </div>
      {/* Accent block bottom */}
      <div className="absolute inset-x-6 bottom-6 flex items-center gap-3">
        <span className="h-8 w-8 rounded-[var(--radius-xs)] bg-primary" />
        <span className="h-2 flex-1 rounded-full bg-border" />
        <span className="h-2 w-8 rounded-full bg-accent float-slow" />
      </div>
    </div>
  );
}
