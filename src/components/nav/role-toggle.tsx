"use client";

import { useTranslations } from "next-intl";
import { GraduationCap, Briefcase } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function RoleToggle({ className }: { className?: string }) {
  const t = useTranslations("nav.switchRole");
  const pathname = usePathname();
  const onTeach = pathname.startsWith("/teach");

  return (
    <div
      className={cn(
        "relative inline-flex h-10 items-center rounded-full border border-border bg-surface p-1 text-sm font-medium",
        className,
      )}
      role="tablist"
      aria-label="Mode"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-e1 transition-transform duration-200 ease-out",
          onTeach ? "start-1 translate-x-full rtl:-translate-x-full" : "start-1 translate-x-0",
        )}
      />
      <Link
        href="/"
        role="tab"
        aria-selected={!onTeach}
        className={cn(
          "relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition-colors",
          onTeach ? "text-ink-3 hover:text-foreground" : "text-foreground",
        )}
      >
        <GraduationCap className="h-4 w-4" />
        {t("learn")}
      </Link>
      <Link
        href="/teach"
        role="tab"
        aria-selected={onTeach}
        className={cn(
          "relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition-colors",
          onTeach ? "text-foreground" : "text-ink-3 hover:text-foreground",
        )}
      >
        <Briefcase className="h-4 w-4" />
        {t("teach")}
      </Link>
    </div>
  );
}
