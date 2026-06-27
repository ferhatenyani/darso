"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Download, Printer } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";

/**
 * Client island for the invoice page. Renders the print:hidden toolbar above
 * the document. Print uses `window.print()` so the surrounding chrome
 * (SiteHeader / SiteFooter / toolbar itself) drops out via `print:hidden`
 * utilities, leaving the document on the page.
 *
 * `dir` is passed in so the back-arrow icon flips for AR without needing the
 * client to call `useLocale()`.
 */
export function InvoiceToolbar({ dir }: { dir: "ltr" | "rtl" }) {
  const t = useTranslations("student.account.invoice.toolbar");
  const { show } = useToast();
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div
      className="print:hidden flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"
      aria-label="Invoice actions"
    >
      <Button asChild variant="ghost" size="sm" className="text-ink-2">
        <Link href="/account">
          <Back className="h-3.5 w-3.5" aria-hidden />
          <span>{t("back")}</span>
        </Link>
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            show({
              title: t("downloadPdf"),
              description: t("downloadComingSoon"),
              variant: "default",
            })
          }
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          {t("downloadPdf")}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
