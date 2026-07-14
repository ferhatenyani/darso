import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { ProfileForm } from "@/components/teacher/profile-form";
import { ProfileSaveButton } from "@/components/teacher/profile-save-button";
import { getCurrentUser } from "@/lib/auth/server";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.profile");
  const user = await getCurrentUser();

  // Preview link points to the teacher's own public profile. Falls back to
  // the seeded Khalil teacher if no slug is bound to the current account
  // (e.g. brand-new teacher account from sign-up).
  const previewSlug = user?.teacherSlug ?? "khalil-bensaid";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionIndex num="01" label={t("title")} title={t("title")} description={t("subtitle")} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="md">
            <Link href={`/teachers/${previewSlug}`}>
              <ExternalLink className="h-4 w-4 rtl-flip" aria-hidden />
              {t("preview")}
            </Link>
          </Button>
          <ProfileSaveButton />
        </div>
      </div>

      <ProfileForm locale={locale as "fr" | "ar"} />
    </div>
  );
}
