import { cn } from "@/lib/utils";

type SectionIndexProps = {
  num: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
  rule?: boolean;
};

/**
 * Editorial section header used across teacher pages.
 * Avoids the standard "h1 + subtitle" pattern by exposing a numbered index
 * and an inline accent rule.
 */
export function SectionIndex({ num, label, title, description, className, rule = true }: SectionIndexProps) {
  return (
    <header className={cn("relative flex items-start gap-4", className)}>
      <span
        aria-hidden
        className="mt-1 flex h-8 w-12 items-center justify-center rounded-[3px] border border-border bg-surface font-mono text-[11px] font-semibold tracking-[0.16em] text-ink-3 tabular"
      >
        {num}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          {rule && <span className="ink-rule" aria-hidden />}
          {label}
        </span>
        <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-pretty text-sm text-ink-2 sm:text-[15px]">{description}</p>
        )}
      </div>
    </header>
  );
}
