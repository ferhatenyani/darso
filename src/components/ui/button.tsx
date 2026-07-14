import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-[var(--radius-xs)] font-medium",
    "transition-[background,color,box-shadow,border-color,transform] duration-[180ms] ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:shadow-focus",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-e1 hover:bg-primary-dark active:translate-y-px",
        accent:
          "bg-accent text-accent-foreground shadow-e1 hover:bg-accent-hover active:translate-y-px",
        secondary:
          "bg-background text-foreground border border-border hover:border-border-strong hover:bg-surface",
        outline:
          "border border-border bg-background text-foreground hover:border-border-strong hover:bg-surface",
        ghost: "text-foreground hover:bg-surface",
        subtle: "bg-surface text-foreground hover:bg-surface-2",
        link: "text-accent underline-offset-4 hover:underline",
        danger:
          "bg-danger text-danger-foreground shadow-e1 hover:brightness-95 active:translate-y-px",
        success:
          "bg-success text-success-foreground shadow-e1 hover:brightness-95 active:translate-y-px",
      },
      size: {
        // Note: md 40 does not meet the 44px touch target on its own.
        // For primary CTAs on mobile use `lg` (h-11) or wrap in a larger tap region.
        sm: "h-9 px-3 text-sm [&_svg]:size-4",
        md: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-11 px-5 text-sm [&_svg]:size-[18px]",
        xl: "h-12 px-6 text-base [&_svg]:size-5",
        "2xl": "h-14 px-7 text-base [&_svg]:size-5",
        icon: "h-10 w-10 [&_svg]:size-4",
        "icon-sm": "h-9 w-9 [&_svg]:size-4",
        "icon-lg": "h-11 w-11 [&_svg]:size-[18px]",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, block, className }))}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span className="sr-only">Chargement…</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
