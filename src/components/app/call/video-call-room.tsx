"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  PhoneOff,
  Send,
  MoreHorizontal,
  X,
} from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * Mock video-call room. Editorial dark UI — NOT SaaS template.
 *
 * Deliberately avoided tropes:
 *   • No purple gradient bg, no glassmorphism panels, no blurred-card stack.
 *   • No giant filled red "End call" button — End is plain red text on
 *     transparent so it reads as a destructive utility, not a CTA.
 *   • No bento, no accent-bar cards, no KPI grid.
 *   • No "Welcome to the meeting!" overlay, no confetti, no Lottie.
 *   • Single accent — `ring-1 ring-white/30` on the active speaker + the red
 *     End text. Everything else is a 9-step neutral ramp on `--call-bg`.
 *
 * The locale layout doesn't add SiteHeader/SiteFooter, so this island fills
 * the viewport (`fixed inset-0`) and visually covers anything the route
 * happens to inherit. The `fixed inset-0` approach also pins the bottom
 * action bar above the iOS safe area without per-route layout edits.
 */

type Participant = {
  id: string;
  name: string;
  initials: string;
  role: "host" | "coHost" | "student" | "self";
  accent: string;
  muted?: boolean;
  cameraOff?: boolean;
  speaking?: boolean;
};

type ChatMsg = {
  id: string;
  authorId: string;
  bodyKey: string;
  agoMin: number;
};

export type VideoCallRoomProps = {
  sessionId: string;
  /** Display title for the eyebrow — comes from the seeded session lookup
   *  on the server, falls back to the generic key when nothing matched. */
  sessionTitle?: string;
  isGeneric: boolean;
};

const PARTICIPANTS: Participant[] = [
  {
    id: "p-host",
    name: "teacher",
    initials: "KB",
    role: "host",
    accent: "from-[#1C3A5E] to-[#2F6BFF]",
    speaking: true,
  },
  {
    id: "p-co",
    name: "coTeacher",
    initials: "SB",
    role: "coHost",
    accent: "from-[#2E9E78] to-[#3E8FD0]",
    muted: true,
  },
  {
    id: "p-stud",
    name: "student",
    initials: "YR",
    role: "student",
    accent: "from-[#DDA13A] to-[#DD514D]",
    cameraOff: true,
  },
  {
    id: "p-self",
    name: "self",
    initials: "VO",
    role: "self",
    accent: "from-[#3E8FD0] to-[#2F6BFF]",
  },
];

const MOCK_MESSAGES: ChatMsg[] = [
  { id: "cm-1", authorId: "p-host", bodyKey: "m1", agoMin: 6 },
  { id: "cm-2", authorId: "p-self", bodyKey: "m2", agoMin: 5 },
  { id: "cm-3", authorId: "p-host", bodyKey: "m3", agoMin: 4 },
  { id: "cm-4", authorId: "p-self", bodyKey: "m4", agoMin: 3 },
  { id: "cm-5", authorId: "p-host", bodyKey: "m5", agoMin: 2 },
  { id: "cm-6", authorId: "p-stud", bodyKey: "m6", agoMin: 1 },
];

function formatHMS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function VideoCallRoom({
  sessionTitle,
  isGeneric,
}: VideoCallRoomProps) {
  const t = useTranslations("app.call");
  const locale = useLocale();
  const router = useRouter();
  const { show } = useToast();

  const [muted, setMuted] = React.useState(false);
  const [cameraOff, setCameraOff] = React.useState(false);
  const [sharing, setSharing] = React.useState(false);
  const [panel, setPanel] = React.useState<"chat" | "participants" | null>(
    null,
  );
  const [seconds, setSeconds] = React.useState(0);
  const [draft, setDraft] = React.useState("");

  // Mount-only timer. Doesn't restart on re-render. Skips the tick on
  // reduced-motion users? — no: tick is non-animated, just a counter, so
  // keep it.
  React.useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const nameFor = React.useCallback(
    (p: Participant) => {
      if (p.role === "self") return t("mockNames.self");
      if (p.role === "host") return t("mockNames.teacher");
      if (p.role === "coHost") return t("mockNames.coTeacher");
      return t("mockNames.student");
    },
    [t],
  );

  const roleLabel = (p: Participant) => {
    if (p.role === "self") return t("participants.you");
    if (p.role === "host") return t("participants.host");
    if (p.role === "coHost") return t("participants.coHost");
    return t("participants.student");
  };

  const onEnd = () => {
    show({
      title: t("end.toast.title"),
      description: t("end.toast.desc"),
      variant: "success",
    });
    router.push("/calendar");
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
    show({
      title: t("chat.sent.title"),
      description: t("chat.sent.desc"),
      variant: "default",
    });
  };

  // Self tile state mirror — keeps the "self" tile visuals in sync with the
  // control row.
  const renderedParticipants = PARTICIPANTS.map((p) =>
    p.role === "self"
      ? { ...p, muted, cameraOff }
      : p,
  );

  return (
    <TooltipProvider delayDuration={250}>
      <div
        className="fixed inset-0 z-50 flex flex-col text-white"
        style={{ background: "var(--call-bg, #0c0f12)" }}
        // The locale layout doesn't render SiteHeader/SiteFooter on this
        // route (we don't wrap it in those), and the (auth) group also
        // isn't used. `fixed inset-0 z-50` covers the bare layout flex
        // shell entirely so the call room is unmistakably modal.
      >
        {/* Top bar — quiet eyebrow + serif title, live clock, end button.
            Absolutely positioned over the grid so the tiles still own the
            full viewport. */}
        <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
              {t("header.eyebrow")}
            </p>
            <h1 className="mt-1 truncate text-[15px] font-medium tracking-tight text-white/90 sm:text-[17px]">
              {isGeneric ? t("generic.title") : sessionTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <p
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11.5px] tabular text-white/70"
              aria-live="polite"
              dir="ltr"
            >
              {formatHMS(seconds)}
            </p>
            <button
              type="button"
              onClick={onEnd}
              className={cn(
                "rounded-full border border-[#DD514D]/40 px-3.5 py-1.5 text-[12px] font-medium tracking-tight text-[#FF8A85]",
                "transition-colors hover:border-[#DD514D] hover:bg-[#DD514D]/10",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DD514D]",
              )}
            >
              {t("controls.end")}
            </button>
          </div>
        </header>

        {/* Participant grid. Centered with padding for top/bottom bars.
            Single column on mobile, 2 cols on sm+. */}
        <main className="flex-1 overflow-hidden px-3 pb-28 pt-20 sm:px-6 sm:pb-32 sm:pt-24">
          <div
            className={cn(
              "mx-auto grid h-full w-full max-w-6xl gap-2.5 sm:gap-3",
              sharing
                ? "grid-cols-1 lg:grid-cols-[1fr_280px]"
                : "grid-cols-1 sm:grid-cols-2",
            )}
          >
            {sharing ? (
              <>
                <ScreenShareTile label={t("screen.label")} hint={t("screen.placeholder")} />
                <div className="grid gap-2.5 lg:grid-cols-1 sm:grid-cols-2">
                  {renderedParticipants.slice(0, 3).map((p) => (
                    <ParticipantTile
                      key={p.id}
                      participant={p}
                      label={nameFor(p)}
                      speakingLabel={t("participants.speaking")}
                      compact
                    />
                  ))}
                </div>
              </>
            ) : (
              renderedParticipants.map((p) => (
                <ParticipantTile
                  key={p.id}
                  participant={p}
                  label={nameFor(p)}
                  speakingLabel={t("participants.speaking")}
                />
              ))
            )}
          </div>

          {isGeneric && (
            <p className="mx-auto mt-3 max-w-md text-center text-[11px] text-white/40">
              {t("generic.hint")}
            </p>
          )}
        </main>

        {/* Bottom action bar. Floating capsule, centered. Quiet circular
            buttons — no giant primary. */}
        <footer className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-5 sm:pb-6">
          <div
            className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-[28px] border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:flex-nowrap sm:rounded-full"
            role="toolbar"
            aria-label={t("controls.mute")}
          >
            <CallControl
              label={muted ? t("controls.unmute") : t("controls.mute")}
              icon={muted ? <MicOff /> : <Mic />}
              active={!muted}
              danger={muted}
              onClick={() => setMuted((v) => !v)}
            />
            <CallControl
              label={cameraOff ? t("controls.cameraOff") : t("controls.camera")}
              icon={cameraOff ? <VideoOff /> : <Video />}
              active={!cameraOff}
              danger={cameraOff}
              onClick={() => setCameraOff((v) => !v)}
            />
            <CallControl
              label={sharing ? t("controls.screenShareStop") : t("controls.screenShare")}
              icon={<MonitorUp />}
              active={sharing}
              onClick={() => setSharing((v) => !v)}
            />
            <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />
            <CallControl
              label={t("controls.chat")}
              icon={<MessageSquare />}
              active={panel === "chat"}
              onClick={() => setPanel((p) => (p === "chat" ? null : "chat"))}
            />
            <CallControl
              label={t("controls.participants")}
              icon={<Users />}
              active={panel === "participants"}
              onClick={() =>
                setPanel((p) =>
                  p === "participants" ? null : "participants",
                )
              }
            />
            <CallControl
              label={t("controls.more")}
              icon={<MoreHorizontal />}
              onClick={() =>
                show({
                  title: t("controls.more"),
                  description: t("generic.hint"),
                  variant: "default",
                })
              }
            />
            <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onEnd}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full text-[#FF8A85]",
                    "transition-colors hover:bg-[#DD514D]/15 hover:text-[#FFB8B4]",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DD514D]",
                  )}
                  aria-label={t("controls.end")}
                >
                  <PhoneOff className="h-4 w-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-white/10 text-[11px] text-white backdrop-blur-sm"
              >
                {t("controls.endTooltip")}
              </TooltipContent>
            </Tooltip>
          </div>
        </footer>

        {/* Sliding panel — chat / participants. Radix Sheet so focus
            trap, ESC, and overlay behaviour are correct. Restyled dark
            via className override. */}
        <Sheet
          open={panel !== null}
          onOpenChange={(open) => {
            if (!open) setPanel(null);
          }}
        >
          <SheetContent
            side={locale === "ar" ? "start" : "end"}
            className={cn(
              "w-full sm:max-w-sm border-l border-white/10 bg-[#0f1216] p-0 text-white",
              "[&>button]:hidden",
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <SheetTitle className="text-[14px] font-medium text-white">
                  {panel === "chat"
                    ? t("chat.title")
                    : t("participants.label")}
                </SheetTitle>
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={t("controls.end")}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              {/* Tab switcher inside the panel */}
              <div className="flex gap-1 border-b border-white/10 px-5 py-2">
                <PanelTab
                  active={panel === "chat"}
                  onClick={() => setPanel("chat")}
                  label={t("chat.tabChat")}
                />
                <PanelTab
                  active={panel === "participants"}
                  onClick={() => setPanel("participants")}
                  label={t("chat.tabParticipants")}
                />
              </div>

              {panel === "chat" ? (
                <>
                  <ul className="flex-1 space-y-4 overflow-y-auto scroll-thin px-5 py-5">
                    {MOCK_MESSAGES.map((m) => {
                      const author = renderedParticipants.find(
                        (p) => p.id === m.authorId,
                      );
                      const isSelf = author?.role === "self";
                      return (
                        <li
                          key={m.id}
                          className="grid grid-cols-[28px_1fr] gap-3"
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarFallback
                              className={cn(
                                "bg-gradient-to-br text-[10px] font-medium text-white",
                                author?.accent,
                              )}
                            >
                              {author?.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="flex items-baseline gap-2 text-[11.5px]">
                              <span
                                className={cn(
                                  "font-medium",
                                  isSelf ? "text-white" : "text-white/85",
                                )}
                              >
                                {author ? nameFor(author) : ""}
                              </span>
                              <span className="text-white/55 tabular">
                                {m.agoMin}m
                              </span>
                            </p>
                            <p className="mt-0.5 text-[13px] leading-relaxed text-white/75">
                              {t(`mockMessages.${m.bodyKey}` as never)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <form
                    onSubmit={onSend}
                    className="flex items-center gap-2 border-t border-white/10 p-4"
                  >
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={t("chat.placeholder")}
                      className={cn(
                        "h-10 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] text-white placeholder:text-white/55",
                        "focus:border-white/30 focus:outline-none",
                      )}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                      aria-label={t("chat.send")}
                    >
                      <Send className="h-4 w-4 rtl-flip" aria-hidden />
                    </Button>
                  </form>
                  <p className="px-5 pb-4 text-center text-[10.5px] text-white/55">
                    {t("chat.empty")}
                  </p>
                </>
              ) : (
                <ul className="flex-1 space-y-1 overflow-y-auto scroll-thin p-3">
                  {renderedParticipants.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={cn(
                            "bg-gradient-to-br text-[11px] font-medium text-white",
                            p.accent,
                          )}
                        >
                          {p.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-white/90">
                          {nameFor(p)}
                        </p>
                        <p className="text-[11px] text-white/45">
                          {roleLabel(p)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/45">
                        {p.muted ? (
                          <MicOff className="h-3.5 w-3.5" aria-hidden />
                        ) : null}
                        {p.cameraOff ? (
                          <VideoOff className="h-3.5 w-3.5" aria-hidden />
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

/* ============================================================
 * Subcomponents
 * ============================================================ */

function CallControl({
  label,
  icon,
  active,
  danger,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active ? true : undefined}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full text-white/80 transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
            !active && !danger && "hover:bg-white/10",
            active && "bg-white text-[#0c0f12] hover:bg-white/90",
            danger && "bg-white/10 text-[#FF8A85] hover:bg-white/15",
            "[&_svg]:h-4 [&_svg]:w-4",
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-white/10 text-[11px] text-white backdrop-blur-sm"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function PanelTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/[0.04] hover:text-white/80",
      )}
    >
      {label}
    </button>
  );
}

function ParticipantTile({
  participant,
  label,
  speakingLabel,
  compact = false,
}: {
  participant: Participant;
  label: string;
  speakingLabel: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-lg)] bg-[#15191f] transition-shadow",
        "ring-1 ring-white/[0.06]",
        participant.speaking && "ring-white/30",
        compact ? "aspect-video min-h-[120px]" : "aspect-video sm:aspect-[4/3]",
      )}
    >
      {/* Background — subtle radial so the avatar doesn't float on flat noise */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 35%, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />

      {/* Centered avatar — camera-off renders the fallback only, camera-on
          renders an "active" badge bottom-right. Both states use the same
          gradient palette so they read as the same person. */}
      <div className="relative flex h-full items-center justify-center">
        <Avatar
          className={cn(
            "shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
            compact ? "h-14 w-14" : "h-20 w-20",
          )}
        >
          <AvatarFallback
            className={cn(
              "bg-gradient-to-br font-medium text-white",
              participant.accent,
              compact ? "text-[14px]" : "text-[20px]",
            )}
          >
            {participant.initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Bottom-left: name + (You) */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
        <p className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur-[2px]">
          {participant.muted ? (
            <MicOff
              className="h-3 w-3 text-[#FF8A85]"
              aria-hidden
            />
          ) : null}
          <span className="font-medium">{label}</span>
        </p>
        {participant.speaking ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80">
            {speakingLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ScreenShareTile({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-lg)] bg-[#10141a] ring-1 ring-white/[0.06]">
      {/* Faux whiteboard — a subtle grid + caption, no real content. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-1 text-white/55">
        <MonitorUp className="h-6 w-6" aria-hidden />
        <p className="text-[12px] font-medium text-white/75">{label}</p>
        <p className="text-[11px] text-white/40">{hint}</p>
      </div>
    </div>
  );
}
