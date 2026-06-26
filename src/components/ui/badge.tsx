import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
  {
    variants: {
      variant: {
        default: "bg-surface text-ink-2 border border-border",
        primary: "bg-primary/10 text-primary border border-primary/20",
        accent: "bg-accent/10 text-accent border border-accent/20",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-[#7a5610] border border-warning/30",
        danger: "bg-danger/10 text-danger border border-danger/20",
        info: "bg-info/10 text-info border border-info/20",
        solid: "bg-primary text-primary-foreground border border-primary",
        outline: "bg-transparent text-ink-2 border border-border",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
