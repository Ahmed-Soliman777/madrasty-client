import { useTranslations } from "next-intl";

const PULSE = { percent: 94, active: 26, total: 28 };

export function ClassPulse() {
  const t = useTranslations("teacherQuick.pulse");
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-3 text-base font-bold">{t("title")}</h2>
      <div className="flex items-center gap-3.5">
        <div className="grid size-[72px] shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(rgb(var(--brand)) ${PULSE.percent}%, rgb(var(--soft)) 0)` }}>
          <span className="grid size-14 place-items-center rounded-full bg-surface font-bold">{PULSE.percent}%</span>
        </div>
        <div><b>{t("veryActive")}</b><p className="text-sm text-mute">{t("detail", { active: PULSE.active, total: PULSE.total })}</p></div>
      </div>
    </section>
  );
}
