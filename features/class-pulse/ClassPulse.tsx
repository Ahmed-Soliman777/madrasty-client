import { useTranslations } from "next-intl";

const PULSE = { percent: 94, active: 26, total: 28 };

export function ClassPulse() {
  const t = useTranslations("teacherQuick.pulse");

  return (
    <section className="rounded-xl border border-line bg-surface p-4" aria-labelledby="class-pulse-title">
      <h2 id="class-pulse-title" className="mb-4 text-base font-bold">{t("title")}</h2>
      <div className="flex items-center gap-3.5">
        <div className="grid size-[68px] shrink-0 place-items-center rounded-full border-4 border-brand bg-surface">
          <span className="text-lg font-bold text-navy">{PULSE.percent}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t("veryActive")}</p>
          <p className="mt-1 text-sm text-mute">{t("detail", { active: PULSE.active, total: PULSE.total })}</p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-soft"
            role="progressbar"
            aria-label={t("title")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={PULSE.percent}
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${PULSE.percent}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
