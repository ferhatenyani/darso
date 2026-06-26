import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { ProfileForm } from "@/components/teacher/profile-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.profile");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionIndex num="00" label={t("title")} title={t("title")} description={t("subtitle")} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="md">
            <Link href={`/teachers/${"khalil-bensaid"}`}>
              <ExternalLink className="h-4 w-4 rtl-flip" aria-hidden />
              {t("preview")}
            </Link>
          </Button>
          <Button variant="primary" size="md">{t("save")}</Button>
        </div>
      </div>

      <ProfileForm locale={locale as "fr" | "ar"} />
    </div>
  );
}
