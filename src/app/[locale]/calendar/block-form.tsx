"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Lock, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const HOURS = Array.from({ length: 14 }).map((_, i) => {
  const h = 8 + i;
  return `${String(h).padStart(2, "0")}:00`;
});

export function BlockTimeForm() {
  const t = useTranslations("app.calendar.block");
  const [from, setFrom] = React.useState("18:00");
  const [to, setTo] = React.useState("20:00");
  const [reason, setReason] = React.useState("");
  const [recurring, setRecurring] = React.useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="block-from">{t("start")}</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger id="block-from" size="md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  <span className="tabular">{h}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="block-to">{t("end")}</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger id="block-to" size="md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  <span className="tabular">{h}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="block-reason">{t("reason")}</Label>
        <Input
          id="block-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("reasonPlaceholder")}
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 p-3">
        <Label htmlFor="block-recurring" className="flex items-center gap-2 text-sm font-medium">
          <Repeat className="h-4 w-4 text-ink-2" />
          {t("recurring")}
        </Label>
        <Switch id="block-recurring" checked={recurring} onCheckedChange={setRecurring} />
      </div>

      <Button type="submit" variant="primary" size="md" className="mt-1">
        <Lock className="h-4 w-4" />
        {t("submit")}
      </Button>
    </form>
  );
}

export function Legend() {
  const t = useTranslations("app.calendar");
  return (
    <ul className="grid gap-2.5">
      <li className="flex items-center gap-3 text-[12px]">
        <span aria-hidden className="block h-2 w-6 rounded-full bg-accent" />
        <span className="text-foreground">{t("status.booked")}</span>
      </li>
      <li className="flex items-center gap-3 text-[12px]">
        <span aria-hidden className="block h-2 w-6 rounded-full bg-warning" />
        <span className="text-foreground">{t("status.pending")}</span>
      </li>
      <li className="flex items-center gap-3 text-[12px]">
        <span
          aria-hidden
          className="block h-2 w-6 rounded-full border border-dashed border-border-strong/70 bg-background"
        />
        <span className="text-foreground">{t("status.available")}</span>
      </li>
      <li className="flex items-center gap-3 text-[12px]">
        <span aria-hidden className="block h-2 w-6 rounded-full bg-ink-3/40" />
        <span className="text-foreground">{t("status.blocked")}</span>
      </li>
    </ul>
  );
}
