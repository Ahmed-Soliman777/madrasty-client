"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { useAttendance } from "./useAttendance";
import { StudentRow } from "./StudentRow";

type Filter = "all" | StaffAttendanceStatus;
const TOTAL_STUDENTS = 28;
const FILTERS: Filter[] = ["all", "present", "late", "absent"];

export function AttendanceBoard({ onLog }: { onLog: (kind: StaffCommsKind, studentId: StaffStudentId) => void }) {
  const t = useTranslations("teacherQuick");
  const toast = useToast();
  const { students, setStatus, addPoints, markAllPresent } = useAttendance();
  const [filter, setFilter] = useState<Filter>("all");

  const count = (f: Filter) => (f === "all" ? students.length : students.filter((s) => s.status === f).length);
  const tabs = FILTERS.map((id) => ({ id, label: t("attendance.tab", { label: t(`status.${id}`), count: count(id) }) }));

  const changeStatus = (id: StaffStudentId, status: StaffAttendanceStatus) => {
    setStatus(id, status);
    toast(t("toast.statusChanged", { name: t(`students.${id}`), status: t(`status.${status}`) }));
    if (status === "absent") onLog("absence", id);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-4" aria-labelledby="roster">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <h2 id="roster" className="text-base font-bold">
          {t("attendance.title")} <span className="font-normal text-mute">· {t("attendance.rosterCount", { shown: students.length, total: TOTAL_STUDENTS })}</span>
        </h2>
        <Button onClick={() => { markAllPresent(); toast(t("toast.allPresent")); }}>{t("attendance.markAllPresent")}</Button>
      </div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2.5">
        <Tabs items={tabs} value={filter} onChange={setFilter} />
        <Button variant="ghost" onClick={() => toast(t("toast.exporting"))}>{t("attendance.exportReport")}</Button>
      </div>
      {students.filter((s) => filter === "all" || s.status === filter).map((s) => (
        <StudentRow
          key={s.id}
          s={s}
          onStatus={changeStatus}
          onPoints={(st, a) => { addPoints(st.id, a.delta); toast(t("toast.pointsAwarded", { reason: t(`points.reason.${a.id}`), name: t(`students.${st.id}`) })); }}
        />
      ))}
    </section>
  );
}
