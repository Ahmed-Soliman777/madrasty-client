"use client";
import { useTranslations } from "next-intl";

export function CommsLog({ items }: { items: StaffCommsItem[] }) {
  const t = useTranslations("teacherQuick");
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-2 text-base font-bold">{t("comms.title")}</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id} className="border-t border-line py-2.5 text-sm">
            <b>{t(`comms.heading.${i.kind}`, { subject: i.studentId ? t(`students.${i.studentId}`) : i.text ?? "" })}</b>
            <small className="block text-mute">
              {t(`comms.meta.${i.kind}`)} · {i.minutesAgo ? t("comms.minutesAgo", { minutes: i.minutesAgo }) : t("comms.now")}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
