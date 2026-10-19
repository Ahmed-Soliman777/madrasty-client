import { LayoutDashboard, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV: StaffNavItem[] = [{ id: "quickPortal", href: "/staff" }];

export function Sidebar() {
  const t = useTranslations("teacherQuick.nav");

  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-e border-line bg-surface p-4 lg:flex">
      <div className="flex items-center gap-3 border-b border-line px-2 pb-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-navy text-white">
          <GraduationCap size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">{t("brand")}</p>
          <p className="mt-0.5 text-xs text-mute">{t("quickPortal")}</p>
        </div>
      </div>

      <nav aria-label={t("ariaLabel")} className="mt-5 flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current="page"
            className="flex min-h-11 items-center gap-3 rounded-lg bg-navy px-3 py-2.5 text-sm font-semibold text-white"
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            {t(item.id)}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-line px-2 pt-4 text-xs leading-5 text-mute">
        {t("support")}
        <p className="mt-1">{t("version")}</p>
      </div>
    </aside>
  );
}
