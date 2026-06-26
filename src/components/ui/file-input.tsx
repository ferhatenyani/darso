"use client";

import * as React from "react";
import { Upload, X, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FileInputProps = {
  accept?: string;
  multiple?: boolean;
  value?: File[];
  onValueChange?: (files: File[]) => void;
  className?: string;
  label?: string;
  hint?: string;
};

export function FileInput({ accept, multiple, value, onValueChange, className, label, hint }: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);
  const files = value ?? [];

  function add(list: FileList | null) {
    if (!list) return;
    const next = multiple ? [...files, ...Array.from(list)] : Array.from(list).slice(0, 1);
    onValueChange?.(next);
  }
  function remove(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    onValueChange?.(next);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "group relative flex w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface px-6 py-8 text-center transition-colors",
          drag && "border-accent bg-accent-soft/60",
          "hover:border-accent",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-background text-accent shadow-e1">
          <Upload className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-foreground">{label ?? "Glisser un fichier ou cliquer"}</span>
        {hint && <span className="text-xs text-ink-3">{hint}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => add(e.target.files)}
          className="sr-only"
          tabIndex={-1}
        />
      </button>
      {files.length > 0 && (
        <ul className="grid gap-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4 text-ink-3" />
              <span className="flex-1 truncate text-foreground">{f.name}</span>
              <span className="text-xs text-ink-3 tabular">{Math.ceil(f.size / 1024)} Ko</span>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
