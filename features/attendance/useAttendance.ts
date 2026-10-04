"use client";
import { useState } from "react";

// بيانات العرض الابتدائية (UI فقط) — الأسماء من messages عن طريق الـ id
const INITIAL: StaffStudent[] = [
  { id: "ahmed", status: "present", arrivedAt: "7:45", points: 15, starBehavior: true },
  { id: "omar", status: "present", arrivedAt: "7:50", points: 5 },
  { id: "yasser", status: "late", arrivedAt: "10:05", points: 0 },
  { id: "fahd", status: "absent", points: 0 },
  { id: "karim", status: "present", arrivedAt: "7:42", points: 5 },
  { id: "ziad", status: "present", arrivedAt: "7:40", points: 10 },
];

export function useAttendance() {
  const [students, setStudents] = useState<StaffStudent[]>(INITIAL);
  const patch = (id: StaffStudentId, f: (s: StaffStudent) => StaffStudent) =>
    setStudents((p) => p.map((s) => (s.id === id ? f(s) : s)));

  const setStatus = (id: StaffStudentId, status: StaffAttendanceStatus) =>
    patch(id, (s) => ({ ...s, status, arrivedAt: status !== "absent" ? s.arrivedAt ?? "10:02" : s.arrivedAt }));
  const addPoints = (id: StaffStudentId, d: number) => patch(id, (s) => ({ ...s, points: Math.max(0, s.points + d) }));
  const markAllPresent = () => setStudents((p) => p.map((s) => ({ ...s, status: "present", arrivedAt: s.arrivedAt ?? "10:00" })));

  return { students, setStatus, addPoints, markAllPresent };
}
