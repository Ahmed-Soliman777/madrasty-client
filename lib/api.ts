import type { ParentStudentData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export type NotificationStatus =
  | "PENDING"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "CANCELLED";

export type NotificationType = "HOMEWORK_ASSIGNED" | "STUDENT_ABSENT";

export interface CommunicationLogItem {
  id: string;
  type: NotificationType;
  channel: "WHATSAPP";
  status: NotificationStatus;
  attempts: number;
  createdAt: string;
  sentAt: string | null;
  student: { id: string; name: string; nameEn: string } | null;
  homework: {
    title: string;
    className: string;
    classNameEn: string;
    subjectName: string;
    subjectNameEn: string;
  } | null;
  failureReason: "SEND_FAILED" | null;
}

export interface CommunicationLogResponse {
  items: CommunicationLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CommunicationLogFilters {
  page?: number;
  status?: NotificationStatus | "";
}

const students: ParentStudentData[] = [
  {
    id: "student-001",
    fullName: "أحمد سليمان",
    fullNameEn: "Ahmed Soliman",
    grade: "الصف الرابع الابتدائي",
    gradeEn: "Grade 4 Primary",
    className: "4 / أ",
    classNameEn: "4 / A",
    attendanceRecords: [
      { id: "attendance-001", date: "2026-10-19", status: "PRESENT", arrivedAt: "07:42" },
      { id: "attendance-002", date: "2026-10-18", status: "LATE", arrivedAt: "08:11" },
      { id: "attendance-003", date: "2026-10-15", status: "PRESENT", arrivedAt: "07:48" },
      { id: "attendance-004", date: "2026-10-14", status: "ABSENT", arrivedAt: null },
    ],
    behaviorRecords: [
      { id: "behavior-001", categoryName: "مشاركة متميزة", categoryNameEn: "Great participation", kind: "POSITIVE", points: 5, createdAt: "2026-10-19T09:30:00.000Z" },
      { id: "behavior-002", categoryName: "إنجاز الواجب", categoryNameEn: "Homework completed", kind: "POSITIVE", points: 5, createdAt: "2026-10-17T10:15:00.000Z" },
      { id: "behavior-003", categoryName: "تشتت", categoryNameEn: "Distracted", kind: "NEGATIVE", points: -3, createdAt: "2026-10-16T08:45:00.000Z" },
    ],
    homework: [
      { id: "homework-001", title: "تمارين صفحة 45 – الضرب في عدد من رقمين", dueAt: "2026-10-21T08:00:00.000Z", createdAt: "2026-10-19T10:00:00.000Z" },
      { id: "homework-002", title: "حل الأسئلة من 1 إلى 10", dueAt: "2026-10-22T08:00:00.000Z", createdAt: "2026-10-18T09:00:00.000Z" },
    ],
  },
  {
    id: "student-002",
    fullName: "عمر سليمان",
    fullNameEn: "Omar Soliman",
    grade: "الصف الثاني الابتدائي",
    gradeEn: "Grade 2 Primary",
    className: "2 / ب",
    classNameEn: "2 / B",
    attendanceRecords: [
      { id: "attendance-005", date: "2026-10-19", status: "PRESENT", arrivedAt: "07:50" },
      { id: "attendance-006", date: "2026-10-18", status: "PRESENT", arrivedAt: "07:46" },
      { id: "attendance-007", date: "2026-10-15", status: "ABSENT", arrivedAt: null },
    ],
    behaviorRecords: [
      { id: "behavior-004", categoryName: "مشاركة متميزة", categoryNameEn: "Great participation", kind: "POSITIVE", points: 5, createdAt: "2026-10-19T08:50:00.000Z" },
      { id: "behavior-005", categoryName: "تشتت", categoryNameEn: "Distracted", kind: "NEGATIVE", points: -3, createdAt: "2026-10-17T08:20:00.000Z" },
    ],
    homework: [
      { id: "homework-003", title: "مراجعة درس الجمع", dueAt: "2026-10-21T08:00:00.000Z", createdAt: "2026-10-19T09:15:00.000Z" },
    ],
  },
];

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchStudents(): Promise<ParentStudentData[]> {
  await wait();
  return students;
}

export async function fetchComms(
  filters: CommunicationLogFilters = {},
): Promise<CommunicationLogResponse> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", "10");
  if (filters.status) params.set("status", filters.status);

  const token =
    typeof window === "undefined" ? null : window.localStorage.getItem("accessToken");
  if (!token) throw new Error("AUTH_REQUIRED");

  const response = await fetch(
    `${API_BASE_URL}/api/notifications/communication-log?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("AUTH_REQUIRED");
    }
    throw new Error("COMMUNICATION_LOG_UNAVAILABLE");
  }

  return (await response.json()) as CommunicationLogResponse;
}

export const saveStatus = async (_id: string, _s: StaffAttendanceStatus) => {
  await wait();
};
export const sendHomework = async (_d: unknown) => {
  await wait(300);
};
