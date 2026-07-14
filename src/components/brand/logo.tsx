import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span
      dir="ltr"
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-label="darso"
    >
      <span
        className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-e1"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M4 18V6a2 2 0 0 1 2-2h7l5 5v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M13 4v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 13h6M8 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="absolute -bottom-1 -end-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
      </span>
      {!mark && (
        <span className="text-xl font-semibold tracking-tight text-foreground" style={{ letterSpacing: "-0.01em" }}>
          darso
        </span>
      )}
    </span>
  );
}
