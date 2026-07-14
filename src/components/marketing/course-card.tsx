import { Users, Clock, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Course } from "@/lib/mock/courses";

const formatLabel: Record<Course["format"], string> = {
  "1to1": "Cours 1:1",
  cohort: "Cohorte",
  event: "Atelier",
  ondemand: "À la demande",
};

export function CourseCard({
  course,
  className,
}: {
  course: Course;
  className?: string;
}) {
  const nextDate = course.dates[0];
  const capacityLeft = nextDate ? nextDate.spotsTotal - nextDate.spotsTaken : null;
  const isTight = capacityLeft !== null && capacityLeft > 0 && capacityLeft <= 3;
  const isFull = capacityLeft === 0;

  return (
    <Link
      href={routes.course(course.slug)}
      aria-label={course.title.fr}
      className={cn(
        "group card-interactive block rounded-[var(--radius-lg)] border border-border bg-card shadow-e1 focus-visible:outline-none overflow-hidden",
        className,
      )}
    >
      {/* Cover strip — gradient placeholder using teacher accent; NOT stock photo */}
      <div className={cn("relative aspect-[16/9] w-full bg-gradient-to-br", course.teacher.accent)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
            {course.subject.fr}
          </span>
          <Badge variant="default" shape="square" className="bg-white/95 text-primary border-transparent">
            {formatLabel[course.format]}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
          {course.title.fr}
        </h3>

        {/* Teacher name */}
        <p className="mt-1 text-[13px] text-ink-2">
          par <span className="font-medium">{course.teacher.name.fr}</span>
        </p>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {course.durationLabel.fr}
          </span>
          {nextDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden />
              {nextDate.label.fr}
            </span>
          )}
        </div>

        {/* Capacity indicator */}
        {nextDate && (
          <div className="mt-3 flex items-center gap-2 text-[12px]">
            <Users className="h-3 w-3 text-ink-3" aria-hidden />
            <span className={cn(
              "tabular font-medium",
              isFull ? "text-danger" : isTight ? "text-warning-foreground" : "text-ink-2"
            )}>
              {isFull
                ? "Complet"
                : `${nextDate.spotsTaken}/${nextDate.spotsTotal} places prises`}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 h-px bg-border" aria-hidden />

        {/* Price + CTA */}
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-[15px] font-semibold text-foreground tabular">
            {course.priceDzd.toLocaleString("fr-FR")} <span className="text-[12px] font-medium text-ink-2">DA</span>
          </span>
          <span className="text-[13px] font-medium text-accent transition-colors group-hover:underline">
            {isFull ? "Liste d'attente →" : "Voir le cours →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
