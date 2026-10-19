"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { AttendanceBoard } from "@/features/attendance/AttendanceBoard";
import { ClassPulse } from "@/features/class-pulse/ClassPulse";
import { HomeworkComposer } from "@/features/homework/HomeworkComposer";
import { CommsLog } from "@/features/comms/CommsLog";

export function TeacherQuickBoard() {
  return (
    <ToastProvider>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_340px]">
        <AttendanceBoard onLog={() => undefined} />
        <aside className="flex flex-col gap-5">
          <ClassPulse />
          <HomeworkComposer onSent={() => undefined} />
          <CommsLog />
        </aside>
      </div>
    </ToastProvider>
  );
}
