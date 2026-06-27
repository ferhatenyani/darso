"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { Button } from "@/components/ui/button";
import { agency } from "@/lib/mock/agency";
import { useToast } from "@/lib/toast";

export function AgencyProfileEditor({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.agency.profile");
  const tt = useTranslations("teacher.agency.toasts");
  const { show } = useToast();
  const [files, setFiles] = React.useState<File[]>([]);
  const [name, setName] = React.useState(agency.name[locale]);
  const [bio, setBio] = React.useState(agency.bio[locale]);

  return (
    <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-card p-6">
      <div className="grid gap-2">
        <Label>{t("logo")}</Label>
        <FileInput accept="image/*" value={files} onValueChange={setFiles} label={t("logo")} hint={t("logoHint")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ag-name">{t("name")}</Label>
        <Input id="ag-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ag-bio">{t("bio")}</Label>
        <Textarea id="ag-bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="flex justify-end">
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
          {locale === "ar" ? "حفظ" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
