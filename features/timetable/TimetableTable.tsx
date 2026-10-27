"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { TimetableEntry } from "@/lib/api";

const WEEKDAY_ORDER = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export function TimetableTable({
  entries,
  mode,
}: {
  entries: TimetableEntry[];
  mode: "teacher" | "guardian";
}) {
  const t = useTranslations("timetable");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const sortedEntries = [...entries].sort((a, b) => {
    const dayDifference = WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday);
    return dayDifference || a.period.number - b.period.number;
  });

  if (sortedEntries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-bg px-5 py-10 text-center">
        <CalendarDays className="mx-auto size-9 text-mute" aria-hidden="true" />
        <p className="mt-3 font-semibold">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm leading-6 text-mute">{t(mode === "guardian" ? "guardianEmptyDescription" : "teacherEmptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-start text-sm">
          <thead className="bg-bg text-xs text-mute">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{t("day")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t("period")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t("time")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t("subject")}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t(mode === "guardian" ? "teacher" : "class")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="transition-colors hover:bg-bg/70">
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold">{t(`days.${entry.weekday}`)}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-soft px-2 py-1 font-bold text-brand">{entry.period.number}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-mute">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} aria-hidden="true" />{entry.period.startTime}–{entry.period.endTime}</span>
                </td>
                <td className="px-4 py-3.5 font-semibold">{isArabic ? entry.assignment.subject.name : entry.assignment.subject.nameEn || entry.assignment.subject.name}</td>
                <td className="px-4 py-3.5 text-mute">
                  {mode === "guardian"
                    ? (isArabic ? entry.assignment.staff.fullName : entry.assignment.staff.fullNameEn || entry.assignment.staff.fullName)
                    : (isArabic ? entry.assignment.class.name : entry.assignment.class.nameEn || entry.assignment.class.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-4 py-3 text-xs text-mute">{t("lessonCount", { count: sortedEntries.length })}</p>
    </div>
  );
}
