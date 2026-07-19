"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const POPULAR: { label: string; q: string }[] = [
  { label: "Maths Bac", q: "Maths Bac" },
  { label: "IELTS", q: "IELTS" },
  { label: "Physique", q: "Physique" },
  { label: "Coran & tajwid", q: "Coran" },
  { label: "Programmation Web", q: "React" },
  { label: "Piano", q: "Piano" },
];

const WILAYAS = [
  "Toutes wilayas",
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Blida",
  "Sétif",
  "Tlemcen",
];

/**
 * The search surface, moved out of the hero and placed directly beneath it.
 * Full-bleed white band with a soft top-hairline separating it from the hero.
 */
export function HomeSearchBand() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [wilaya, setWilaya] = useState<string>(WILAYAS[0]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (wilaya && wilaya !== WILAYAS[0]) params.set("wilaya", wilaya);
    router.push(
      `/browse${params.toString() ? `?${params.toString()}` : ""}` as never,
    );
  }

  return (
    <section aria-labelledby="home-search-heading" className="relative">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-baseline justify-between gap-6">
            <h2
              id="home-search-heading"
              className="text-[15px] font-semibold uppercase tracking-[0.16em] text-ink-2"
            >
              Cherchez maintenant
            </h2>
            <span className="hidden text-[13px] text-ink-3 sm:inline">
              Une matière, un professeur, une wilaya
            </span>
          </div>

          <form
            onSubmit={onSubmit}
            role="search"
            aria-label="Rechercher un cours ou un professeur"
            className={cn(
              "mt-4 flex flex-col overflow-hidden rounded-[18px] border border-border-strong bg-card p-1.5",
              "shadow-[0_16px_40px_-24px_rgba(10,11,14,0.18),0_2px_6px_-2px_rgba(10,11,14,0.05)]",
              "transition-shadow duration-200 focus-within:border-accent focus-within:shadow-[0_18px_44px_-20px_rgba(47,111,235,0.30),0_0_0_4px_rgba(47,111,235,0.10)]",
              "sm:flex-row sm:items-stretch sm:gap-1",
            )}
          >
            <label className="flex flex-1 items-center gap-2 rounded-[12px] px-3 py-2">
              <Search
                className="h-[18px] w-[18px] shrink-0 text-ink-3"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex. « Maths Bac », « React », « Piano »"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
                aria-label="Que voulez-vous apprendre ?"
              />
            </label>

            <span className="hidden sm:block w-px self-stretch bg-border" aria-hidden />

            <label className="relative flex items-center gap-2 rounded-[12px] px-3 py-2 sm:min-w-[220px]">
              <MapPin
                className="h-[18px] w-[18px] shrink-0 text-ink-3"
                aria-hidden
              />
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="min-w-0 flex-1 appearance-none bg-transparent pr-6 text-[15px] font-medium text-foreground focus:outline-none"
                aria-label="Filtrer par wilaya"
              >
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute end-3 text-ink-3"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>

            <button
              type="submit"
              className="group mt-1.5 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-primary px-6 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:shadow-focus sm:mt-0"
            >
              Rechercher
              <ArrowRight
                aria-hidden
                className="rtl-flip h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </form>

          {/* Popular chips */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="me-1 text-[12px] font-medium text-ink-3">
              Populaire :
            </span>
            {POPULAR.map((p) => (
              <Link
                key={p.q}
                href={`/browse?q=${encodeURIComponent(p.q)}` as never}
                className="rounded-full border border-border bg-background px-3 py-1 text-[12.5px] font-medium text-ink-2 transition-all duration-200 hover:-translate-y-[1px] hover:border-accent hover:bg-accent-soft/50 hover:text-accent focus-visible:outline-none focus-visible:shadow-focus"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
