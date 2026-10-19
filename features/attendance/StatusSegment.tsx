"use client";

import { useTranslations } from "next-intl";

const ITEMS: { id: StaffAttendanceStatus; activeClass: string }[] = [
  { id: "present", activeClass: "bg-ok-bg text-ok" },
  { id: "late", activeClass: "bg-warn-bg text-warn" },
  { id: "absent", activeClass: "bg-bad-bg text-bad" },
];

export function StatusSegment({
  name,
  value,
  onChange,
}: {
  name: string;
  value: StaffAttendanceStatus;
  onChange: (status: StaffAttendanceStatus) => void;
}) {
  const t = useTranslations("teacherQuick");

  return (
    <div
      role="group"
      aria-label={t("attendance.statusOf", { name })}
      className="flex max-w-full overflow-hidden rounded-lg border border-line [&>button+button]:border-s [&>button+button]:border-line"
    >
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={`min-h-9 px-2.5 text-xs transition-colors sm:px-3 sm:text-sm ${value === item.id ? `${item.activeClass} font-semibold` : "text-mute hover:bg-bg hover:text-ink"}`}
        >
          {t(`status.${item.id}`)}
        </button>
      ))}
    </div>
  );
}
