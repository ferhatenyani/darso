"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CornerDownRight, Loader2, MessageSquarePlus, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stars } from "@/components/teacher/stars";
import { reviews } from "@/lib/mock/reviews";
import { currentTeacher } from "@/lib/mock/dashboard";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Filter = "all" | "5" | "4" | "3-";

type Reply = { text: string; postedAt: string };

export function ReviewsList({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.reviews");
  const tt = useTranslations("teacher.reviews.toasts");
  const { show } = useToast();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [replying, setReplying] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [replies, setReplies] = React.useState<Record<string, Reply[]>>({});
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  const myReviews = reviews.filter((r) => r.teacherId === currentTeacher.id);

  const filtered = myReviews.filter((r) => {
    if (filter === "all") return true;
    if (filter === "5") return r.rating === 5;
    if (filter === "4") return r.rating === 4;
    if (filter === "3-") return r.rating <= 3;
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("filters.all") },
    { id: "5", label: t("filters.fiveStars") },
    { id: "4", label: t("filters.fourStars") },
    { id: "3-", label: t("filters.threeAndUnder") },
  ];

  const sendReply = (reviewId: string) => {
    const text = (drafts[reviewId] ?? "").trim();
    if (!text) {
      show({
        title: tt("replyEmpty.title"),
        description: tt("replyEmpty.desc"),
        variant: "warning",
      });
      return;
    }
    setPendingId(reviewId);
    startTransition(() => {
      const postedAt = locale === "ar" ? "الآن" : "à l'instant";
      setReplies((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] ?? []), { text, postedAt }],
      }));
      setDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      setReplying(null);
      setPendingId(null);
      show({
        title: tt("replyPosted.title"),
        description: tt("replyPosted.desc"),
        variant: "success",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="me-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
          <Star className="h-3 w-3" aria-hidden />
          {t("filter")}
        </span>
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-ink-2 hover:bg-surface",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Star}
          tone="warning"
          title={t("emptyState.title")}
          description={
            filter === "all"
              ? t("emptyState.bodyAll")
              : t("emptyState.bodyFiltered")
          }
          secondary={
            filter !== "all"
              ? { label: t("filters.all"), onClick: () => setFilter("all") }
              : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((rv, i) => {
            const myReplies = replies[rv.id] ?? [];
            return (
              <li key={rv.id} className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
                <div className="p-5">
                  <header className="flex items-start gap-3">
                    <span className="mt-1 font-mono text-[10px] font-semibold tabular text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className={cn("text-[12px] text-primary-foreground", `bg-gradient-to-br ${rv.studentAccent}`)}>
                        {rv.studentInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-foreground">{rv.studentName[locale]}</span>
                        <Stars value={rv.rating} size={13} />
                        <span className="text-[11px] tabular text-ink-3">{rv.date[locale]}</span>
                      </div>
                      {rv.subjectTag && <Badge variant="default" className="mt-1.5">{rv.subjectTag[locale]}</Badge>}
                    </div>
                    {replying !== rv.id && (
                      <Button size="sm" variant="ghost" onClick={() => setReplying(rv.id)}>
                        <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden />
                        {t("reply")}
                      </Button>
                    )}
                  </header>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{rv.body[locale]}</p>

                  {myReplies.length > 0 && (
                    <ul className="mt-4 ms-11 space-y-3">
                      {myReplies.map((rep, idx) => (
                        <li key={idx} className="rounded-[var(--radius-md)] bg-surface/60 p-3">
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                            {t("replyByLabel")}
                            <span className="ms-1.5 tabular text-ink-3/80">· {rep.postedAt}</span>
                          </p>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2 whitespace-pre-wrap">
                            {rep.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {replying === rv.id && (
                  <div className="border-t border-border bg-surface/50 p-5">
                    <div className="grid gap-2">
                      <Label htmlFor={`reply-${rv.id}`} className="flex items-center gap-2">
                        <CornerDownRight className="h-3.5 w-3.5 text-ink-3 rtl-flip" aria-hidden />
                        {t("yourReply")}
                      </Label>
                      <Textarea
                        id={`reply-${rv.id}`}
                        rows={3}
                        placeholder={t("yourReplyPlaceholder")}
                        value={drafts[rv.id] ?? ""}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [rv.id]: e.target.value }))}
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplying(null);
                          setDrafts((prev) => ({ ...prev, [rv.id]: "" }));
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => sendReply(rv.id)}
                        disabled={pendingId === rv.id}
                      >
                        {pendingId === rv.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                        <span className={pendingId === rv.id ? "opacity-0" : ""}>{t("send")}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
