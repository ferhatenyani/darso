import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[var(--radius-md)] border border-input bg-background px-3.5 text-sm text-foreground transition-[box-shadow,border-color] placeholder:text-ink-3 focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_0_4px_rgba(47,107,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
