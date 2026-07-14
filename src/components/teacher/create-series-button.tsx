"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";

export function CreateSeriesButton({ locale }: { locale: "fr" | "ar" }) {
  const tt = useTranslations("teacher.ondemand.toasts");
  const { show } = useToast();
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() =>
        show({
          title: tt("comingSoon.title"),
          description: tt("comingSoon.desc"),
          variant: "default",
        })
      }
    >
      <Plus className="h-4 w-4" aria-hidden />
      {locale === "ar" ? "إنشاء سلسلة" : "Créer une série"}
    </Button>
  );
}
