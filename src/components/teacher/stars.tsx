import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${value}/5`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={filled ? "fill-warning text-warning" : "text-border-strong"}
            aria-hidden
          />
        );
      })}
    </span>
  );
}
