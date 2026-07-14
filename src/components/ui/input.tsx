import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full rounded-[var(--radius-sm)] border bg-background",
    "text-foreground placeholder:text-ink-3",
    "transition-[box-shadow,border-color] duration-[150ms]",
    "focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring-soft)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-3.5 text-base",     // 44px — meets touch target, 16px avoids iOS zoom
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "border-input",
        error: "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_var(--ring-danger-soft)]",
        success: "border-success focus-visible:border-success focus-visible:shadow-[0_0_0_3px_var(--ring-success-soft)]",
      },
    },
    defaultVariants: { size: "md", state: "default" },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, state, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ size, state }), className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
