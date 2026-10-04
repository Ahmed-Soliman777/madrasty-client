"use client";
import { useState } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { AttendanceBoard } from "@/features/attendance/AttendanceBoard";
import { ClassPulse } from "@/features/class-pulse/ClassPulse";
import { HomeworkComposer } from "@/features/homework/HomeworkComposer";
import { CommsLog } from "@/features/comms/CommsLog";

const INITIAL_LOG: StaffCommsItem[] = [
  { id: "c1", kind: "excellence", studentId: "ahmed", minutesAgo: 18 },
  { id: "c2", kind: "absence", studentId: "fahd", minutesAgo: 45 },
];

// الحاوية الوحيدة اللي فيها state مشترك (سجل التواصل + الـ toast)
export function TeacherQuickBoard() {
  const [log, setLog] = useState<StaffCommsItem[]>(INITIAL_LOG);
  const add = (item: Omit<StaffCommsItem, "id" | "minutesAgo">) =>
    setLog((p) => [{ ...item, id: crypto.randomUUID(), minutesAgo: 0 }, ...p]);

  return (
    <ToastProvider>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
        <AttendanceBoard onLog={(kind, studentId) => add({ kind, studentId })} />
        <aside className="flex flex-col gap-5">
          <ClassPulse />
          <HomeworkComposer onSent={(text) => add({ kind: "homework", text })} />
          <CommsLog items={log} />
        </aside>
      </div>
    </ToastProvider>
  );
}
