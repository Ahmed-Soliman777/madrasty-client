import { nav } from "@/mocks/data";
export function Sidebar() {
  return (
    <nav aria-label="القائمة الرئيسية" className="sticky top-0 hidden h-screen flex-col gap-1 border-e border-line bg-surface p-4 lg:flex">
      <div className="px-3 pb-4 text-lg font-bold text-navy dark:text-ink">NEIS · نظام المدرسة</div>
      {nav.map((n, i) => (
        <a key={n.label} href={n.href} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${i === 0 ? "bg-navy font-semibold text-white" : "text-mute"}`}>
          {n.label}{n.badge && <span className="rounded-full bg-bad px-2 text-xs text-white">{n.badge}</span>}
        </a>
      ))}
      <div className="mt-auto p-3 text-sm text-mute">الدعم الفني والأكاديمي<br />الإصدار v3.1</div>
    </nav>
  );
}
