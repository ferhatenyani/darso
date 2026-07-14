"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Paperclip, Smile, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileInput } from "@/components/ui/file-input";
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { commonEmojis } from "@/lib/mock/chats";

type ComposerProps = {
  onSend?: (text: string) => void;
  placeholder?: string;
};

export function Composer({ onSend, placeholder }: ComposerProps) {
  const t = useTranslations("app.messages.composer");
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onSend?.(v);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative border-t border-border bg-background"
    >
      {/* Accent rule on top */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-border">
        <span className="absolute start-0 top-0 h-px w-20 bg-accent" />
      </span>

      <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2 px-3 py-3">
        <div className="flex items-center">
          {/* Attach via Sheet (uses FileInput primitive) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label={t("attach")} title={t("attach")}>
                <Paperclip className="h-5 w-5 rtl-flip" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60dvh]">
              <SheetHeader>
                <SheetTitle>{t("attach")}</SheetTitle>
              </SheetHeader>
              <SheetBody>
                <FileInput multiple value={files} onValueChange={setFiles} />
              </SheetBody>
            </SheetContent>
          </Sheet>

          {/* Emoji popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label={t("emoji")} title={t("emoji")}>
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="grid grid-cols-7 gap-1">
                {commonEmojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    aria-label={e}
                    className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] text-lg transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => setText((s) => s + e)}
                  >
                    <span aria-hidden>{e}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={placeholder ?? t("placeholder")}
          className="min-h-11 resize-none py-2.5"
        />

        <Button type="submit" size="icon" variant="accent" aria-label={t("send")} disabled={!text.trim()}>
          <Send className="h-4 w-4 rtl-flip" />
        </Button>
      </div>
    </form>
  );
}
