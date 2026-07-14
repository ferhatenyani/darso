import { Star, MapPin, Verified, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Teacher } from "@/lib/mock/teachers";

/**
 * Reusable teacher card. Densities:
 * - compact  : browse grid, dense lists.
 * - standard : homepage carousel, category pages.
 * - feature  : hero placements (rare).
 */
export type TeacherCardDensity = "compact" | "standard" | "feature";

export function TeacherCard({
  teacher,
  density = "standard",
  className,
}: {
  teacher: Teacher;
  density?: TeacherCardDensity;
  className?: string;
}) {
  const hasReviews = teacher.reviews > 0;
  const isVerified = teacher.idVerified && teacher.contactVerified;
  const isNew = !hasReviews || teacher.tier === "rising";
  const avatarSize = density === "compact" ? "h-12 w-12" : density === "feature" ? "h-16 w-16" : "h-14 w-14";
  const nameSize = density === "compact" ? "text-[14.5px]" : "text-[15.5px]";

  return (
    <Link
      href={routes.teacher(teacher.slug)}
      aria-label={`${teacher.name.fr} · ${teacher.subject.fr}`}
      className={cn(
        "group card-interactive block rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-e1 focus-visible:outline-none",
        className,
      )}
    >
      {/* Header row: avatar + name + tier badge */}
      <div className="flex items-start gap-3">
        <Avatar className={cn(avatarSize, "shrink-0")}>
          <AvatarFallback className={cn("bg-gradient-to-br text-white font-semibold", teacher.accent)}>
            {teacher.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className={cn("truncate font-semibold text-foreground", nameSize)}>{teacher.name.fr}</h3>
            {isVerified && (
              <Verified className="h-4 w-4 shrink-0 text-accent" aria-label="Profil vérifié" />
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-ink-2">{teacher.subject.fr}</p>
          <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-3">
            <MapPin className="h-3 w-3" aria-hidden />
            <span className="truncate">{teacher.city.fr}</span>
          </div>
        </div>
      </div>

      {/* Headline bio */}
      {density !== "compact" && (
        <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-ink-2">{teacher.headline.fr}</p>
      )}

      {/* Rating / new marker */}
      <div className="mt-3 flex items-center gap-2 text-[12.5px]">
        {hasReviews ? (
          <>
            <span className="inline-flex items-center gap-1 font-medium text-foreground tabular">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden />
              {teacher.rating.toFixed(1)}
            </span>
            <span className="text-ink-3">·</span>
            <span className="text-ink-3 tabular">{teacher.reviews} avis</span>
          </>
        ) : (
          <Badge variant="new" shape="square">Nouveau</Badge>
        )}
        {teacher.responseHours <= 3 && (
          <>
            <span className="text-ink-3">·</span>
            <span className="inline-flex items-center gap-1 text-ink-3">
              <MessageCircle className="h-3 w-3" aria-hidden />
              Répond en {teacher.responseHours} h
            </span>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-border" aria-hidden />

      {/* Price + CTA row */}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.08em] text-ink-3">à partir de</span>
          <span className="text-[15px] font-semibold text-foreground tabular">
            {teacher.hourlyRate.toLocaleString("fr-FR")} <span className="text-[12px] font-medium text-ink-2">DA / h</span>
          </span>
        </div>
        <span className="text-[13px] font-medium text-accent transition-colors group-hover:underline">
          Voir le profil →
        </span>
      </div>
    </Link>
  );
}
