"use client";

import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";

type SubjectOption = { value: string; label: string };

export type ContactFormLabels = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  subjectOptions: SubjectOption[];
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacyNote: string;
  errors: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  toastTitle: string;
  /** Raw template containing `{email}`. */
  toastDescriptionTemplate: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const { show } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const validate = React.useCallback((): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = labels.errors.name;
    if (!EMAIL_RE.test(email.trim())) next.email = labels.errors.email;
    if (!subject) next.subject = labels.errors.subject;
    if (message.trim().length < 20) next.message = labels.errors.message;
    return next;
  }, [name, email, subject, message, labels.errors]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Simulate a tiny network roundtrip so the button feels alive.
    window.setTimeout(() => {
      show({
        variant: "success",
        title: labels.toastTitle,
        description: labels.toastDescriptionTemplate.replace("{email}", email.trim()),
      });
      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
      setSubmitting(false);
    }, 350);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={labels.name}
          error={errors.name}
        >
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder={labels.namePlaceholder}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={cn(
              errors.name && "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_rgba(221,81,77,0.18)]",
            )}
          />
        </Field>

        <Field
          id="contact-email"
          label={labels.email}
          error={errors.email}
        >
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder={labels.emailPlaceholder}
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            className={cn(
              errors.email && "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_rgba(221,81,77,0.18)]",
            )}
          />
        </Field>
      </div>

      <Field
        id="contact-subject"
        label={labels.subject}
        error={errors.subject}
      >
        <Select
          value={subject}
          onValueChange={(v) => {
            setSubject(v);
            if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
          }}
        >
          <SelectTrigger
            id="contact-subject"
            aria-invalid={!!errors.subject}
            className={cn(
              errors.subject &&
                "border-danger data-[state=open]:border-danger data-[state=open]:shadow-[0_0_0_3px_rgba(221,81,77,0.18)]",
            )}
          >
            <SelectValue placeholder={labels.subjectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {labels.subjectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        id="contact-message"
        label={labels.message}
        error={errors.message}
      >
        <Textarea
          id="contact-message"
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message && e.target.value.trim().length >= 20) {
              setErrors((p) => ({ ...p, message: undefined }));
            }
          }}
          placeholder={labels.messagePlaceholder}
          aria-invalid={!!errors.message}
          className={cn(
            errors.message && "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_rgba(221,81,77,0.18)]",
          )}
        />
      </Field>

      <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-3">{labels.privacyNote}</p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="sm:min-w-[180px]"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={submitting ? "opacity-0" : ""}>{labels.submit}</span>
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px]">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-danger">
          <AlertCircle className="h-3 w-3" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
