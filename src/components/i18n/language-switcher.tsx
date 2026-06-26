"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeMeta, type Locale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error - next-intl typed-routes accepts dynamic params object
        { pathname, params },
        { locale: next as Locale },
      );
    });
  }

  const current = localeMeta[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={current?.label}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-surface focus-visible:border-accent",
          isPending && "opacity-70",
          className,
        )}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">{current?.nativeLabel}</span>
        <span className="text-xs uppercase tabular text-ink-3">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuRadioGroup value={locale} onValueChange={onSelect}>
          {routing.locales.map((l) => {
            const meta = localeMeta[l as Locale];
            return (
              <DropdownMenuRadioItem key={l} value={l}>
                <span className="flex flex-1 items-center justify-between">
                  <span className="font-medium" style={{ fontFamily: l === "ar" ? "var(--font-arabic)" : undefined }}>
                    {meta.nativeLabel}
                  </span>
                  <span className="text-xs uppercase tabular text-ink-3">{l}</span>
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
