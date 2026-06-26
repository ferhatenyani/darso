import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const t = useTranslations("home.footer");
  const year = new Date().getFullYear();

  const columns: { titleKey: string; items: { label: string; href: string }[] }[] = [
    {
      titleKey: "learn",
      items: [
        { label: t("links.browseTeachers"), href: "/teachers" },
        { label: t("links.browseCourses"), href: "/browse" },
        { label: t("links.postRequest"), href: "/requests/new" },
        { label: t("links.howItWorksLearn"), href: "/how-it-works" },
      ],
    },
    {
      titleKey: "teach",
      items: [
        { label: t("links.becomeTeacher"), href: "/teach" },
        { label: t("links.pricing"), href: "/teach/pricing" },
        { label: t("links.agency"), href: "/teach/agency" },
        { label: t("links.teacherResources"), href: "/teach/resources" },
      ],
    },
    {
      titleKey: "company",
      items: [
        { label: t("links.about"), href: "/about" },
        { label: t("links.press"), href: "/press" },
        { label: t("links.careers"), href: "/careers" },
        { label: t("links.blog"), href: "/blog" },
      ],
    },
    {
      titleKey: "support",
      items: [
        { label: t("links.help"), href: "/help" },
        { label: t("links.trustSafety"), href: "/trust" },
        { label: t("links.contact"), href: "/contact" },
        { label: t("links.disputes"), href: "/disputes" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-narrow py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-2">{t("tagline")}</p>
            <p className="text-xs text-ink-3">{t("madeIn")}</p>
          </div>
          {columns.map((col) => (
            <div key={col.titleKey} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-3">{t(col.titleKey as never)}</h4>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it.href}>
                    <Link
                      href={it.href as never}
                      className="text-sm text-ink-2 hover:text-foreground"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-3">{t("legal.rights", { year })}</p>
          <ul className="flex items-center gap-5 text-xs text-ink-2">
            <li><Link href="/legal/terms" className="hover:text-foreground">{t("legal.terms")}</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-foreground">{t("legal.privacy")}</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-foreground">{t("legal.cookies")}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
