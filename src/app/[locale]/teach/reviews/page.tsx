import { setRequestLocale, getTranslations } from "next-intl/server";

import { SectionIndex } from "@/components/teacher/section-index";
import { ReviewsList } from "@/components/teacher/reviews-list";

type Props = { params: Promise<{ locale: string }> };

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.reviews");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <SectionIndex num="00" label={t("title")} title={t("title")} description={t("subtitle")} className="mb-8" />
      <ReviewsList locale={locale as "fr" | "ar"} />
    </div>
  );
}
