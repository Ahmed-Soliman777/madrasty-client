"use client";
import { useTranslations } from "next-intl";

const ITEMS: { id: StaffAttendanceStatus; on: string }[] = [
  { id: "present", on: "bg-ok-bg text-ok" },
  { id: "late", on: "bg-warn-bg text-warn" },
  { id: "absent", on: "bg-bad-bg text-bad" },
];

export function StatusSegment({ name, value, onChange }: { name: string; value: StaffAttendanceStatus; onChange: (s: StaffAttendanceStatus) => void }) {
  const t = useTranslations("teacherQuick");
  return (
    <div role="group" aria-label={t("attendance.statusOf", { name })} className="flex overflow-hidden rounded-xl border border-line [&>button+button]:border-s [&>button+button]:border-line">
      {ITEMS.map((i) => (
        <button key={i.id} aria-pressed={value === i.id} onClick={() => onChange(i.id)} className={`px-3.5 py-1.5 text-mute ${value === i.id ? `${i.on} font-bold` : ""}`}>{t(`status.${i.id}`)}</button>
      ))}
    </div>
  );
}
