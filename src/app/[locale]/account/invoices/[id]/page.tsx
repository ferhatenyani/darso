import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { findBookingByIdForAccount } from "@/lib/mock/bookings-state";
import { Logo } from "@/components/brand/logo";
import { InvoiceToolbar } from "@/components/student/invoice-toolbar";
import { localeMeta, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

/**
 * Algerian invoice view — printable, single-column, monochrome with one
 * accent rule (the issue/total band). Lives under the /account layout so
 * SiteHeader / SiteFooter wrap it for navigation context; the document is
 * boxed in a centered `max-w-3xl` so it reads like an A4 sheet in the
 * viewport and prints to a single page.
 *
 * `id` resolves in two ways:
 *   1. `bk-…` → live bookings store (created at checkout). Looked up via
 *      `findBookingByIdForAccount` so a booking never leaks across accounts.
 *   2. Anything else (e.g. seeded `h-1` history rows) → a stable fallback
 *      receipt derived from `id` alone. We don't 404 on those because the
 *      seeded payment history rows in /account use them.
 */

type LineItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

type InvoiceData = {
  number: string;
  issueDate: Date;
  dueDate: Date;
  status: "paid" | "pending";
  customer: { name: string; line2?: string };
  paymentMethod: string;
  paidAtNote?: string;
  items: LineItem[];
};

const VAT_RATE = 19; // Algerian standard VAT

function fmtDate(d: Date, _locale: Locale) {
  return new Intl.DateTimeFormat("fr-DZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function fmtInvoiceNumber(seed: string) {
  // Stable deterministic transform: bk-xyz123 → INV-2026-XYZ123
  const year = new Date().getFullYear();
  const tail = seed
    .replace(/^bk-/i, "")
    .replace(/^h-/i, "")
    .replace(/[^a-z0-9-]/gi, "")
    .toUpperCase()
    .padStart(6, "0")
    .slice(-8);
  return `INV-${year}-${tail}`;
}

function priceLatin(value: number) {
  // Always render amounts in Latin numerals + DZD code so the money column
  // reads identically in FR / AR and the tabular alignment holds. We don't
  // localise the invoice totals — Algerian commercial law expects the
  // document to be readable across both scripts unambiguously.
  return new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
    currencyDisplay: "code",
  }).format(value);
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({
    locale,
    namespace: "student.account.invoice",
  });
  return {
    title: `${t("documentTitle")} ${fmtInvoiceNumber(id)}`,
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Auth gate — invoices are private. Bounce to sign-in carrying the return path.
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: `/sign-in?next=/account/invoices/${id}`, locale });
    return null;
  }

  const t = await getTranslations("student.account.invoice");
  const loc = locale as Locale;
  const dir = localeMeta[loc].dir;

  // Resolve invoice data. Booking ids → real store lookup. Anything else
  // (seeded h-* history rows or arbitrary INV-* ids) → derived fallback so
  // the seeded payments table keeps working without bk-* writeback.
  const booking = id.startsWith("bk-")
    ? findBookingByIdForAccount(id, user.id)
    : null;

  if (id.startsWith("bk-") && !booking) {
    notFound();
  }

  const customerName = user.studentName ?? "Client darso";

  const data: InvoiceData = booking
    ? {
        number: fmtInvoiceNumber(booking.id),
        issueDate: new Date(booking.bookedAt),
        dueDate: new Date(booking.bookedAt),
        status: booking.status === "confirmed" ? "paid" : "pending",
        customer: { name: customerName },
        paymentMethod: booking.paymentLabel ?? t("status.paid"),
        paidAtNote: booking.paymentLabel,
        items: [
          {
            description: `${booking.subjectTitle[loc] ?? booking.subjectTitle.fr} — ${t(
              "items.withTeacher",
              { teacher: booking.teacherName[loc] ?? booking.teacherName.fr },
            )}`,
            qty:
              booking.kind === "course"
                ? 6
                : booking.kind === "event"
                  ? 1
                  : 1,
            unitPrice:
              booking.kind === "course"
                ? Math.round(booking.priceDzd / 6)
                : booking.priceDzd,
          },
        ],
      }
    : {
        // Stable seeded fallback so the existing payments-history rows have
        // a coherent invoice. Number is derived from the id; everything else
        // is a sensible default. We don't render the booking-only fields.
        number: fmtInvoiceNumber(id),
        issueDate: new Date(),
        dueDate: new Date(),
        status: "paid",
        customer: { name: customerName },
        paymentMethod: "Carte Edahabia ****1234",
        items: [
          {
            description: "Séance d'apprentissage sur darso",
            qty: 1,
            unitPrice: 4500,
          },
        ],
      };

  const subtotal = data.items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const vat = Math.round((subtotal * VAT_RATE) / 100);
  const total = subtotal + vat;

  return (
    <section className="bg-surface/30 print:bg-white">
      <div className="container-narrow py-10 print:py-0">
        <div className="mx-auto max-w-3xl">
          <InvoiceToolbar dir={dir} />

          {/* Document — A4-friendly. Renders as a single column so the
              browser's print engine handles pagination cleanly. */}
          <article
            dir="ltr"
            className={cn(
              "mt-6 bg-card text-foreground shadow-e1 print:mt-0 print:shadow-none",
              "border border-border print:border-0",
              "p-8 sm:p-12 print:p-10",
            )}
            // Force LTR for the invoice body so the tabular money column and
            // RC/NIF/NIS numbers don't break in AR. Customer / item names
            // still render in their own script — we don't translate them.
          >
            {/* Letterhead */}
            <header className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
              <div className="space-y-2">
                <Logo />
                <p className="text-[11.5px] text-ink-3">{t("tagline")}</p>
                <address className="not-italic text-[11.5px] leading-relaxed text-ink-2">
                  darso SARL
                  <br />
                  Rue Hassiba Ben Bouali, Alger 16000
                  <br />
                  RC : 16/00-12345678 · NIF : 198516000123456
                  <br />
                  NIS : 098516001234567
                </address>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {t("eyebrow")}
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-foreground">
                  {t("title")}
                </h1>
                <p className="mt-2 font-mono text-[12.5px] tabular text-ink-2">
                  {data.number}
                </p>
                <span
                  className={cn(
                    "mt-3 inline-flex items-center rounded-[var(--radius-sm)] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em]",
                    data.status === "paid"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning",
                  )}
                >
                  {data.status === "paid"
                    ? t("status.paid")
                    : t("status.pending")}
                </span>
              </div>
            </header>

            {/* Meta block — issue / due / customer / method, 2x2 */}
            <section className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t("billTo")}
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-foreground">
                  {data.customer.name}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
                  {user.studentCity
                    ? `${user.studentCity.charAt(0).toUpperCase()}${user.studentCity.slice(1)}, Algérie`
                    : "Algérie"}
                  {user.studentPhone ? (
                    <>
                      <br />
                      <span className="font-mono tabular">{user.studentPhone}</span>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 self-start sm:justify-self-end">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t("issueDate")}
                </p>
                <p className="text-[12.5px] tabular text-foreground">
                  {fmtDate(data.issueDate, loc)}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t("dueDate")}
                </p>
                <p className="text-[12.5px] tabular text-foreground">
                  {fmtDate(data.dueDate, loc)}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t("paymentMethod")}
                </p>
                <p className="text-[12.5px] text-foreground">{data.paymentMethod}</p>
              </div>
            </section>

            {/* Line items — hairline rules, tabular money column */}
            <section className="mt-8">
              <table className="w-full border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-y border-border text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                    <th className="py-2 text-left font-semibold">
                      {t("items.th.description")}
                    </th>
                    <th className="w-16 py-2 text-right font-semibold">
                      {t("items.th.quantity")}
                    </th>
                    <th className="w-32 py-2 text-right font-semibold">
                      {t("items.th.unitPrice")}
                    </th>
                    <th className="w-32 py-2 text-right font-semibold">
                      {t("items.th.total")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((it, i) => (
                    <tr key={i} className="border-b border-border align-top">
                      <td className="py-3 text-foreground">{it.description}</td>
                      <td className="py-3 text-right tabular">{it.qty}</td>
                      <td className="py-3 text-right font-mono tabular">
                        {priceLatin(it.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-mono tabular">
                        {priceLatin(it.unitPrice * it.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Totals — right-aligned, hairline rule above the grand total */}
            <section className="mt-6 flex justify-end">
              <dl className="w-72 space-y-2 text-[12.5px]">
                <div className="flex justify-between text-ink-2">
                  <dt>{t("subtotal")}</dt>
                  <dd className="font-mono tabular">{priceLatin(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-2">
                  <dt>{t("vat", { rate: VAT_RATE })}</dt>
                  <dd className="font-mono tabular">{priceLatin(vat)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-foreground pt-2 text-[14px]">
                  <dt className="font-semibold text-foreground">
                    {t("total")}
                  </dt>
                  <dd className="font-mono font-semibold tabular text-foreground">
                    {priceLatin(total)}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Payment terms */}
            <section className="mt-8 rounded-[var(--radius-md)] bg-surface/60 p-4 text-[12px] leading-relaxed text-ink-2 print:bg-transparent print:px-0 print:pt-6 print:border-t print:border-border">
              <p className="font-semibold text-foreground">
                {t("paymentTerms")}
              </p>
              <p className="mt-1">
                {data.status === "paid"
                  ? t("paidBy", {
                      method: data.paymentMethod,
                      date: fmtDate(data.issueDate, loc),
                    })
                  : t("dueIn", { days: 7 })}
              </p>
            </section>

            {/* Legal footer */}
            <footer className="mt-10 border-t border-border pt-4 text-[10.5px] leading-relaxed text-ink-3">
              {/* Render with the active locale so AR readers get the AR
                  legal blurb. We don't pin it to FR. */}
              <p dir={dir}>{t("legalFooter")}</p>
              <p className="mt-2 font-mono tabular text-ink-3">DZD · darso.dz</p>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
