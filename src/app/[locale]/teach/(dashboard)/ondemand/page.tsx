import { setRequestLocale, getTranslations } from "next-intl/server";
import { PlayCircle } from "lucide-react";

import { SectionIndex } from "@/components/teacher/section-index";
import { CreateSeriesButton } from "@/components/teacher/create-series-button";

type Props = { params: Promise<{ locale: string }> };

export default async function OnDemandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionIndex
          num="01"
          label={t("shell.nav.onDemand")}
          title={t("shell.nav.onDemand")}
          description={loc === "ar"
            ? "أعِدّ مسلسلات الفيديو والوحدات للوصول الدائم."
            : "Prépare des séries vidéo et des modules accessibles à vie."}
        />
        <CreateSeriesButton locale={loc} />
      </div>

      <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-card px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <PlayCircle className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {loc === "ar" ? "اقتراب وحدة الفيديو" : "Module vidéo en préparation"}
        </h3>
        <p className="mt-1 max-w-sm text-[13px] text-ink-3">
          {loc === "ar"
            ? "ستتمكّن قريبًا من رفع الفيديوهات وبيع الوصول للمحتوى المسجّل."
            : "Tu pourras bientôt importer tes vidéos et vendre l'accès à du contenu enregistré."}
        </p>
      </div>
    </div>
  );
}
