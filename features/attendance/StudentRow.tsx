"use client";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { StatusSegment } from "./StatusSegment";
import { PointChips } from "./PointChips";

export const StudentRow = memo(function StudentRow({ s, onStatus, onPoints }: {
  s: StaffStudent;
  onStatus: (id: StaffStudentId, v: StaffAttendanceStatus) => void;
  onPoints: (s: StaffStudent, a: StaffPointAction) => void;
}) {
  const t = useTranslations("teacherQuick");
  const name = t(`students.${s.id}`);
  const sub =
    (s.status === "absent" ? t("attendance.absentNoExcuse") : t(s.status === "late" ? "attendance.arrivedLate" : "attendance.arrived", { time: s.arrivedAt ?? "" })) +
    (s.starBehavior ? ` · ${t("attendance.starBehavior")}` : "");
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-line py-3 sm:grid-cols-[minmax(150px,1.2fr)_auto_1fr]">
      <div className="flex items-center gap-2.5">
        <div className="grid size-10 place-items-center rounded-full bg-soft font-bold text-brand">{name[0]}</div>
        <div><b className="block leading-tight">{name}</b><small className="text-mute">{sub}</small></div>
      </div>
      <StatusSegment name={name} value={s.status} onChange={(v) => onStatus(s.id, v)} />
      <div className="col-span-full sm:col-span-1">{s.status !== "absent" && <PointChips points={s.points} onAction={(a) => onPoints(s, a)} />}</div>
      {s.status === "absent" && <div className="col-span-full rounded-xl bg-bad-bg px-3 py-1.5 text-[13px] text-bad">{t("attendance.absenceAlert")}</div>}
    </div>
  );
});
