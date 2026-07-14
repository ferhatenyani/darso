"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeacherEvent, TeacherEventFormat } from "@/lib/mock/teacher-events-state";
import { deleteEvent, updateEvent } from "@/lib/mock/teacher-events-state";
import { useToast } from "@/lib/toast";

type AudienceKey = "students" | "parents" | "teachers";
const AUDIENCES: AudienceKey[] = ["students", "parents", "teachers"];

/** ISO → datetime-local input value (in the browser's local tz). */
function isoToLocalInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToISO(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

/**
 * Editable client island for the event edit page. Tabs-based form to
 * mirror the course edit pattern, but with event-specific fields:
 *   - Basics: bilingual title, format, description, status
 *   - Schedule: start/end datetime
 *   - Audience: capacity, target checkboxes, language
 *   - Pricing: free toggle + DZD price + refund policy
 */
export function EventEditForm({
  event,
  locale,
}: {
  event: TeacherEvent;
  locale: "fr" | "ar";
}) {
  const t = useTranslations("events.edit");
  const tw = useTranslations("events.wizard");
  const tb = useTranslations("events.wizard.basics");
  const ta = useTranslations("events.wizard.audience");
  const tp = useTranslations("events.wizard.pricing");
  const ts = useTranslations("events.wizard.schedule");
  const router = useRouter();
  const { show } = useToast();

  const [titleFr, setTitleFr] = React.useState(event.title.fr);
  const [titleAr, setTitleAr] = React.useState(event.title.ar);
  const [format, setFormat] = React.useState<TeacherEventFormat>(event.format);
  const [description, setDescription] = React.useState(event.description ?? "");
  const [start, setStart] = React.useState<string>(isoToLocalInput(event.start));
  const [end, setEnd] = React.useState<string>(isoToLocalInput(event.end));
  const [capacity, setCapacity] = React.useState<number>(event.capacity);
  const [language, setLanguage] = React.useState<string>(event.language);
  const [targetAudience, setTargetAudience] = React.useState<AudienceKey[]>(
    (event.targetAudience as AudienceKey[]) ?? ["students"],
  );
  const [isFree, setIsFree] = React.useState<boolean>(event.isFree);
  const [priceDzd, setPriceDzd] = React.useState<number>(event.priceDzd);
  const [refundPolicy, setRefundPolicy] = React.useState<string>(event.refundPolicy);
  const [status, setStatus] = React.useState<TeacherEvent["status"]>(event.status);

  const [saving, setSaving] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  function toggleAudience(key: AudienceKey) {
    setTargetAudience((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  const handleSave = React.useCallback(() => {
    if (!titleFr.trim() && !titleAr.trim()) {
      show({
        title: t("toasts.missing.title"),
        description: t("toasts.missing.desc"),
        variant: "danger",
      });
      return;
    }
    if (!start || !localInputToISO(start)) {
      show({
        title: t("toasts.missing.title"),
        description: t("toasts.missing.desc"),
        variant: "danger",
      });
      return;
    }
    if (!Number.isFinite(capacity) || capacity <= 0) {
      show({
        title: t("toasts.missing.title"),
        description: t("toasts.missing.desc"),
        variant: "danger",
      });
      return;
    }

    setSaving(true);
    try {
      updateEvent(event.id, {
        title: {
          fr: titleFr.trim() || titleAr.trim(),
          ar: titleAr.trim() || titleFr.trim(),
        },
        format,
        description: description.trim() || undefined,
        start: localInputToISO(start),
        end: localInputToISO(end) || undefined,
        capacity,
        targetAudience,
        language,
        isFree,
        priceDzd: isFree ? 0 : priceDzd,
        refundPolicy,
        status,
      });
      show({
        title: t("toasts.saved.title"),
        description: t("toasts.saved.desc"),
        variant: "success",
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [
    titleFr,
    titleAr,
    start,
    end,
    capacity,
    format,
    description,
    targetAudience,
    language,
    isFree,
    priceDzd,
    refundPolicy,
    status,
    event.id,
    router,
    show,
    t,
  ]);

  const handleDelete = React.useCallback(() => {
    const removed = deleteEvent(event.id);
    if (!removed) {
      show({
        title: t("toasts.deleteFailed.title"),
        description: t("toasts.deleteFailed.desc"),
        variant: "danger",
      });
      return;
    }
    show({
      title: t("toasts.deleted.title"),
      description: t("toasts.deleted.desc"),
      variant: "warning",
    });
    setConfirmOpen(false);
    router.push("/teach/events");
  }, [event.id, router, show, t]);

  return (
    <>
      <Tabs defaultValue="basics" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-surface p-1">
          <TabsTrigger value="basics">{t("tabs.basics")}</TabsTrigger>
          <TabsTrigger value="schedule">{t("tabs.schedule")}</TabsTrigger>
          <TabsTrigger value="audience">{t("tabs.audience")}</TabsTrigger>
          <TabsTrigger value="pricing">{t("tabs.pricing")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="t-fr">{tb("titleFr")}</Label>
                  <Input
                    id="t-fr"
                    dir="ltr"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="t-ar">{tb("titleAr")}</Label>
                  <Input
                    id="t-ar"
                    dir="rtl"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2 max-w-md">
                <Label>{tb("format")}</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as TeacherEventFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live-workshop">{tb("formatOptions.liveWorkshop")}</SelectItem>
                    <SelectItem value="cohort">{tb("formatOptions.cohort")}</SelectItem>
                    <SelectItem value="open-house">{tb("formatOptions.openHouse")}</SelectItem>
                    <SelectItem value="recording-premiere">{tb("formatOptions.recordingPremiere")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">{tb("description")}</Label>
                <Textarea
                  id="desc"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="status">{t("fields.status")}</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TeacherEvent["status"])}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("status.draft")}</SelectItem>
                    <SelectItem value="published">{t("status.published")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="schedule">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="start">{ts("start")}</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    dir="ltr"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">{ts("end")}</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    dir="ltr"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[12px] text-ink-3">
                {ts("timezoneNotice")}{" "}
                <span className="font-mono font-semibold text-foreground">Africa/Algiers</span>
              </p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="audience">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="cap">{ta("capacity")}</Label>
                <Input
                  id="cap"
                  type="number"
                  min={1}
                  max={500}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                />
              </div>
              <div className="grid gap-2">
                <Label>{ta("target")}</Label>
                <ul className="grid gap-2 sm:grid-cols-3">
                  {AUDIENCES.map((key) => {
                    const checked = targetAudience.includes(key);
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-md)] border border-border bg-background p-3 transition-colors hover:bg-surface">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleAudience(key)}
                            className="mt-0.5"
                          />
                          <span className="text-[13px] font-semibold text-foreground">
                            {ta(`audiences.${key}`)}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label>{ta("language")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="mixed">{ta("languageMixed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="pricing">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
                <div>
                  <p className="text-[14px] font-semibold text-foreground">{tp("free")}</p>
                  <p className="mt-0.5 text-[12px] text-ink-3">{tp("freeHint")}</p>
                </div>
                <Switch checked={isFree} onCheckedChange={setIsFree} />
              </label>
              <div className={`grid gap-2 max-w-xs ${isFree ? "pointer-events-none opacity-50" : ""}`}>
                <Label htmlFor="price">{tp("price")}</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={priceDzd}
                    onChange={(e) => setPriceDzd(Number(e.target.value) || 0)}
                    disabled={isFree}
                    className="w-40"
                  />
                  <span className="font-mono text-[12px] font-semibold tabular text-ink-3">DZD</span>
                </div>
              </div>
              <div className="grid gap-2 max-w-md">
                <Label>{tp("refundPolicy")}</Label>
                <Select value={refundPolicy} onValueChange={setRefundPolicy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">{tp("refundOptions.flexible")}</SelectItem>
                    <SelectItem value="moderate">{tp("refundOptions.moderate")}</SelectItem>
                    <SelectItem value="strict">{tp("refundOptions.strict")}</SelectItem>
                    <SelectItem value="none">{tp("refundOptions.none")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          variant="ghost"
          size="md"
          className="text-danger hover:text-danger"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="md" onClick={() => router.push("/teach/events")}>
            {t("cancel")}
          </Button>
          <Button variant="primary" size="md" disabled={saving} onClick={handleSave}>
            {saving ? tw("publish") : t("save")}
          </Button>
        </div>
      </footer>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.body", {
                title: locale === "ar" ? titleAr || titleFr : titleFr || titleAr,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("deleteDialog.cancel")}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {t("deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
