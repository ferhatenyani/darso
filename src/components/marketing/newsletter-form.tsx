"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";

type Props = {
  placeholder: string;
  cta: string;
  successTitle: string;
  successBody: string;
};

export function NewsletterForm({ placeholder, cta, successTitle, successBody }: Props) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const { show } = useToast();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    setSubmitted(true);
    show({ title: successTitle, description: successBody, variant: "success" });
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-background p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <Check className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-foreground">{successTitle}</p>
          <p className="text-[12.5px] text-ink-2">{successBody}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="h-12 flex-1 rounded-[var(--radius-md)] border border-border bg-background px-4 text-[14px] text-foreground placeholder:text-ink-3 focus:border-accent focus:outline-none"
      />
      <Button type="submit" variant="primary" size="lg">
        {cta}
      </Button>
    </form>
  );
}
