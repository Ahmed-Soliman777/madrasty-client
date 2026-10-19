"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { AttendanceBoard } from "@/features/attendance/AttendanceBoard";
import { HomeworkComposer } from "@/features/homework/HomeworkComposer";
import { CommsLog } from "@/features/comms/CommsLog";

export function TeacherQuickBoard() {
  return (
    <ToastProvider>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AttendanceBoard />
        <aside className="flex min-w-0 flex-col gap-5">
          <HomeworkComposer onSent={() => undefined} />
          <CommsLog />
        </aside>
      </div>
    </ToastProvider>
  );
}
