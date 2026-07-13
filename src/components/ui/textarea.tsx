import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3.5 py-2.5 text-base text-foreground",
          "transition-[box-shadow,border-color] duration-[150ms]",
          "placeholder:text-ink-3",
          "focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--ring-soft)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "scroll-thin resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
