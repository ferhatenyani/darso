import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-medium transition-[background,color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-e1 hover:bg-primary-dark active:translate-y-px",
        accent:
          "bg-accent text-accent-foreground shadow-e1 hover:brightness-110 active:translate-y-px",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface-2",
        outline:
          "border border-border bg-background text-foreground hover:bg-surface",
        ghost: "text-foreground hover:bg-surface",
        link: "text-accent underline-offset-4 hover:underline",
        danger:
          "bg-danger text-danger-foreground shadow-e1 hover:brightness-110 active:translate-y-px",
        success:
          "bg-success text-success-foreground shadow-e1 hover:brightness-110",
      },
      size: {
        sm: "h-9 px-3 text-sm [&_svg]:size-4",
        md: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        xl: "h-14 px-7 text-base [&_svg]:size-5",
        icon: "h-10 w-10 [&_svg]:size-4",
        "icon-sm": "h-9 w-9 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
