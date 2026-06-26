import { setRequestLocale, getTranslations } from "next-intl/server";
import { Send } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";

type Props = { params: Promise<{ locale: string }> };

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <SectionIndex
        num="00"
        label={t("shell.nav.applications")}
        title={t("shell.nav.applications")}
        description={loc === "ar"
          ? "تصفّح طلبات الطلبة وتقدّم كأستاذ مناسب."
          : "Parcours les demandes des élèves et postule comme prof recommandé."}
        className="mb-8"
      />

      <div className="grid place-items-center rounded-[var(--radius-2xl)] border border-dashed border-border bg-card px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Send className="h-6 w-6 rtl-flip" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {loc === "ar" ? "اعرض الطلبات النشطة" : "Voir les demandes ouvertes"}
        </h3>
        <p className="mt-1 max-w-sm text-[13px] text-ink-3">
          {loc === "ar"
            ? "بمجرد توفر طلبات الطلبة، ستجد هنا الترشيحات الممكنة."
            : "Dès que des élèves publieront leurs demandes, tu pourras y postuler depuis ici."}
        </p>
        <Button asChild variant="primary" size="md" className="mt-5">
          <Link href="/requests">{loc === "ar" ? "تصفّح المنصة" : "Parcourir le marché"}</Link>
        </Button>
      </div>
    </div>
  );
}
