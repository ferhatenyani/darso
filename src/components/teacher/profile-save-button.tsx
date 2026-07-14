"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";

export function ProfileSaveButton() {
  const t = useTranslations("teacher.profile");
  const tt = useTranslations("teacher.toasts");
  const { show } = useToast();
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() =>
        show({
          title: tt("profileSaved.title"),
          description: tt("profileSaved.desc"),
          variant: "success",
        })
      }
    >
      {t("save")}
    </Button>
  );
}
