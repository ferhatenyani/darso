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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { TeacherCourse } from "@/lib/mock/teacher-courses-state";
import { deleteCourse, updateCourse } from "@/lib/mock/teacher-courses-state";
import { useToast } from "@/lib/toast";

/**
 * Editable client island for the course edit page. The parent server
 * component loads the course by id and hands the snapshot down here so
 * we keep the SSR-friendly fetch but get controlled inputs on the
 * client.
 *
 * Scope is the "inline-form" alternative path from the agent spec —
 * real fields for title, format, price, capacity, status, description,
 * but not a full re-implementation of every wizard substep. Saves go
 * through teacher-courses-state.updateCourse; Delete opens a confirm
 * dialog and routes back to /teach/courses.
 */
export function CourseEditForm({
  course,
  locale,
}: {
  course: TeacherCourse;
  locale: "fr" | "ar";
}) {
  const t = useTranslations("teacher.courses.edit");
  const router = useRouter();
  const { show } = useToast();

  const [titleFr, setTitleFr] = React.useState(course.title.fr);
  const [titleAr, setTitleAr] = React.useState(course.title.ar);
  const [format, setFormat] = React.useState<TeacherCourse["format"]>(course.format);
  const [status, setStatus] = React.useState<TeacherCourse["status"]>(course.status);
  const [priceDzd, setPriceDzd] = React.useState<number>(course.priceDzd);
  const [capacity, setCapacity] = React.useState<number>(course.capacity.total);
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleSave = React.useCallback(() => {
    if (!titleFr.trim() && !titleAr.trim()) {
      show({
        title: t("toasts.missingFields.title"),
        description: t("toasts.missingFields.desc"),
        variant: "danger",
      });
      return;
    }
    if (!Number.isFinite(priceDzd) || priceDzd <= 0) {
      show({
        title: t("toasts.missingFields.title"),
        description: t("toasts.missingFields.desc"),
        variant: "danger",
      });
      return;
    }

    setSaving(true);
    try {
      // Preserve the side we didn't edit by falling back to the other locale.
      const fr = titleFr.trim() || titleAr;
      const ar = titleAr.trim() || titleFr;
      const taken = Math.min(course.capacity.taken, capacity);
      updateCourse(course.id, {
        title: { fr, ar },
        format,
        status,
        priceDzd,
        capacity: { taken, total: capacity },
      });
      show({
        title: t("toasts.saved.title"),
        description: t("toasts.saved.desc"),
        variant: "success",
      });
      // Re-pull server data so any other surface that reads from the
      // server snapshot of this page picks up the new values.
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [titleFr, titleAr, priceDzd, format, status, capacity, course.id, course.capacity.taken, router, show, t]);

  const handleDelete = React.useCallback(() => {
    const removed = deleteCourse(course.id);
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
    router.push("/teach/courses");
  }, [course.id, router, show, t]);

  return (
    <>
      <Tabs defaultValue="basics" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-surface p-1">
          <TabsTrigger value="basics">{t("tabs.basic")}</TabsTrigger>
          <TabsTrigger value="format">{t("tabs.format")}</TabsTrigger>
          <TabsTrigger value="pricing">{t("tabs.pricing")}</TabsTrigger>
          <TabsTrigger value="description">{t("tabs.description")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="title-fr">{t("fields.titleFr")}</Label>
                <Input
                  id="title-fr"
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  placeholder="Math Bac · cohorte intensive"
                  dir="ltr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title-ar">{t("fields.titleAr")}</Label>
                <Input
                  id="title-ar"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="رياضيات الباك · فوج مكثّف"
                  dir="rtl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">{t("fields.status")}</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TeacherCourse["status"])}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("status.draft")}</SelectItem>
                    <SelectItem value="published">{t("status.published")}</SelectItem>
                    <SelectItem value="archived">{t("status.archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="format">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="format">{t("fields.format")}</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as TeacherCourse["format"])}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cohort">{t("format.cohort")}</SelectItem>
                    <SelectItem value="1to1">{t("format.oneToOne")}</SelectItem>
                    <SelectItem value="event">{t("format.event")}</SelectItem>
                    <SelectItem value="ondemand">{t("format.ondemand")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {format !== "1to1" && format !== "ondemand" && (
                <div className="grid gap-2">
                  <Label htmlFor="cap">{t("fields.capacity")}</Label>
                  <Input
                    id="cap"
                    type="number"
                    min={2}
                    max={200}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                    className="w-32"
                  />
                  <p className="text-[12px] text-ink-3">
                    {locale === "ar"
                      ? `الحالي: ${course.capacity.taken}/${course.capacity.total}`
                      : `Actuel : ${course.capacity.taken}/${course.capacity.total}`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="pricing">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-2 sm:max-w-xs">
              <Label htmlFor="price">{t("fields.price")}</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={priceDzd}
                  onChange={(e) => setPriceDzd(Number(e.target.value) || 0)}
                  className="w-40"
                />
                <span className="text-[12px] font-semibold tabular text-ink-3">DZD</span>
              </div>
              <p className="text-[11px] text-ink-3">{t("fields.priceHint")}</p>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="description">
          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
            <div className="grid gap-2">
              <Label htmlFor="desc">{t("fields.description")}</Label>
              <Textarea
                id="desc"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("fields.descriptionPlaceholder")}
              />
              <p className="text-[11px] text-ink-3">{t("fields.descriptionHint")}</p>
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
          <Button variant="outline" size="md" onClick={() => router.push("/teach/courses")}>
            {t("cancel")}
          </Button>
          <Button variant="primary" size="md" disabled={saving} onClick={handleSave}>
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </footer>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.body", { title: titleFr || titleAr })}
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
