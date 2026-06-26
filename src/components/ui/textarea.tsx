import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-[var(--radius-md)] border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-[box-shadow,border-color] placeholder:text-ink-3 focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring-soft)] disabled:cursor-not-allowed disabled:opacity-50 scroll-thin",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
