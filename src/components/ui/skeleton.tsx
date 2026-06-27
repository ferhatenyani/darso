import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Low-fi placeholder primitive. Used inside `loading.tsx` files to mirror
 * the shape of long-rendering routes while their server work resolves.
 *
 * Design intent: editorial wireframe — restrained pulse on `--surface-2`,
 * `--radius-md` corners to match form controls / buttons. For
 * larger shapes (cards, headers), pass `rounded-[var(--radius-lg)]` or
 * `rounded-[var(--radius-xl)]` to keep rhythm with the real page.
 *
 * The pulse honors `prefers-reduced-motion` via a media-query override
 * (see `globals.css`).
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton-pulse rounded-[var(--radius-md)] bg-surface-2/80",
        className,
      )}
      {...props}
    />
  );
}
