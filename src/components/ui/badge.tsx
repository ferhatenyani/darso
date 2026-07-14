import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-surface text-ink-2 border border-border",
        primary: "bg-primary/[0.08] text-primary border border-primary/15",
        accent: "bg-accent-soft text-accent border border-accent/20",
        success: "bg-success-soft text-success border border-success/25",
        warning: "bg-warning-soft text-warning-foreground border border-warning/30",
        danger: "bg-danger-soft text-danger border border-danger/25",
        info: "bg-info-soft text-info border border-info/25",
        solid: "bg-primary text-primary-foreground border border-primary",
        outline: "bg-transparent text-ink-2 border border-border",
        new: "bg-accent-soft text-accent border border-accent/25",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-[var(--radius-xs)]",
      },
    },
    defaultVariants: { variant: "default", shape: "pill" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, shape }), className)} {...props} />;
}

export { badgeVariants };
