"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DisputeState } from "@/lib/mock/disputes";

const variantFor: Record<DisputeState, React.ComponentProps<typeof Badge>["variant"]> = {
  open: "warning",
  "awaiting-response": "info",
  "in-mediation": "primary",
  resolved: "success",
  refunded: "success",
  rejected: "danger",
};

export function StateBadge({
  state,
  size = "md",
  className,
}: {
  state: DisputeState;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const t = useTranslations("app.disputes.state");
  const variant = variantFor[state];
  return (
    <Badge
      variant={variant}
      className={cn(
        "uppercase tracking-[0.12em]",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-[11px]",
        size === "lg" && "px-3 py-1 text-xs",
        className,
      )}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {t(state)}
    </Badge>
  );
}
