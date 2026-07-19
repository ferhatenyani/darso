import { cn } from "@/lib/utils";

/**
 * Wordmark-only logo. Handwritten Caveat, subtly inclined —
 * warm, human, learning-brand cue rather than tech-marketplace cue.
 * `mark` prop kept for API compatibility but the wordmark is the mark.
 */
export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-block select-none font-bold leading-none tracking-[-0.005em] text-foreground",
        mark ? "text-[26px]" : "text-[30px] md:text-[32px]",
        className,
      )}
      style={{
        fontFamily: "var(--font-caveat), cursive",
        transform: "rotate(-4deg)",
        transformOrigin: "50% 60%",
      }}
      aria-label="darso"
    >
      {mark ? "d" : "darso"}
    </span>
  );
}
