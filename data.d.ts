export type ParentAttendanceStatus = "PRESENT" | "LATE" | "ABSENT";
export type ParentBehaviorKind = "POSITIVE" | "NEGATIVE";

export interface ParentAttendanceRecord {
  id: string;
  date: string;
  status: ParentAttendanceStatus;
  arrivedAt: string | null;
}

export interface ParentBehaviorRecord {
  id: string;
  categoryName: string;
  categoryNameEn: string;
  kind: ParentBehaviorKind;
  points: number;
  createdAt: string;
}

export interface ParentHomeworkItem {
  id: string;
  title: string;
  dueAt: string;
  createdAt: string;
}

export interface ParentStudentData {
  id: string;
  fullName: string;
  fullNameEn: string;
  grade: string;
  gradeEn: string;
  className: string;
  classNameEn: string;
  attendanceRecords: ParentAttendanceRecord[];
  behaviorRecords: ParentBehaviorRecord[];
  homework: ParentHomeworkItem[];
}
