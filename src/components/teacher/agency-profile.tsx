"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { Button } from "@/components/ui/button";
import { agency } from "@/lib/mock/agency";

export function AgencyProfileEditor({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.agency.profile");
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-card p-6">
      <div className="grid gap-2">
        <Label>{t("logo")}</Label>
        <FileInput accept="image/*" value={files} onValueChange={setFiles} label={t("logo")} hint={t("logoHint")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ag-name">{t("name")}</Label>
        <Input id="ag-name" defaultValue={agency.name[locale]} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ag-bio">{t("bio")}</Label>
        <Textarea id="ag-bio" rows={5} defaultValue={agency.bio[locale]} />
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="md">{locale === "ar" ? "حفظ" : "Enregistrer"}</Button>
      </div>
    </div>
  );
}
