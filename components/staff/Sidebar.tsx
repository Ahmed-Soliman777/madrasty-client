import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV: StaffNavItem[] = [
  { id: "quickPortal", href: "/staff" },
  { id: "schedule" },
  { id: "grades" },
  { id: "messages", badge: 5 },
  { id: "settings" },
];

export function Sidebar() {
  const t = useTranslations("teacherQuick.nav");
  return (
    <nav aria-label={t("ariaLabel")} className="sticky top-0 hidden h-screen flex-col gap-1 border-e border-line bg-surface p-4 lg:flex">
      <div className="px-3 pb-4 text-lg font-bold text-navy dark:text-ink">{t("brand")}</div>
      {NAV.map((n, i) => {
        const cls = `flex items-center justify-between rounded-xl px-3 py-2.5 ${i === 0 ? "bg-navy font-semibold text-white" : "text-mute"}`;
        const body = <>{t(n.id)}{n.badge && <span className="rounded-full bg-bad px-2 text-xs text-white">{n.badge}</span>}</>;
        return n.href
          ? <Link key={n.id} href={n.href} aria-current={i === 0 ? "page" : undefined} className={cls}>{body}</Link>
          : <a key={n.id} href="#" className={cls}>{body}</a>;
      })}
      <div className="mt-auto p-3 text-sm text-mute">{t("support")}<br />{t("version")}</div>
    </nav>
  );
}
