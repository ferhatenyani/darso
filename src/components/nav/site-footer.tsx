import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  const t = useTranslations("home.footer");
  const year = new Date().getFullYear();

  const columns: { titleKey: string; items: { label: string; href: string }[] }[] = [
    {
      titleKey: "learn",
      items: [
        { label: t("links.browseTeachers"), href: routes.teachers() },
        { label: t("links.browseCourses"), href: routes.browse() },
        { label: t("links.postRequest"), href: routes.requestNew() },
        { label: t("links.howItWorksLearn"), href: routes.howItWorks() },
      ],
    },
    {
      titleKey: "teach",
      items: [
        { label: t("links.becomeTeacher"), href: routes.teachLanding() },
        { label: t("links.pricing"), href: routes.teachPricing() },
        { label: t("links.teacherResources"), href: routes.teachResources() },
      ],
    },
    {
      titleKey: "company",
      items: [
        { label: t("links.about"), href: routes.about() },
        { label: t("links.press"), href: routes.press() },
        { label: t("links.careers"), href: routes.careers() },
        { label: t("links.blog"), href: routes.blog() },
      ],
    },
    {
      titleKey: "support",
      items: [
        { label: t("links.help"), href: routes.help() },
        { label: t("links.trustSafety"), href: routes.trust() },
        { label: t("links.contact"), href: routes.contact() },
        { label: t("links.disputes"), href: routes.disputes() },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-narrow py-14">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
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
                      href={it.href as never /* mixed route literal types */}
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
            <li><Link href={routes.legalTerms()} className="hover:text-foreground">{t("legal.terms")}</Link></li>
            <li><Link href={routes.legalPrivacy()} className="hover:text-foreground">{t("legal.privacy")}</Link></li>
            <li><Link href={routes.legalCookies()} className="hover:text-foreground">{t("legal.cookies")}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
