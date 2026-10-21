import type { ParentStudentData } from "@/types";

export type NotificationStatus = "PENDING" | "SENDING" | "SENT" | "FAILED" | "CANCELLED";
export type NotificationType = "HOMEWORK_ASSIGNED" | "STUDENT_ABSENT";
export type ApiAttendanceStatus = "PRESENT" | "LATE" | "ABSENT";
export type ApiBehaviorKind = "POSITIVE" | "NEGATIVE";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

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
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CommunicationLogFilters {
  page?: number;
  limit?: number;
  status?: NotificationStatus | "";
  type?: NotificationType;
}

export interface TeacherLesson {
  timetableEntryId: string;
  assignmentId: string;
  state: "PAST" | "CURRENT" | "UPCOMING";
  period: { number: number; startTime: string; endTime: string };
  class: { id: string; name: string; nameEn: string; grade: string; gradeEn: string };
  subject: { id: string; name: string; nameEn: string };
}

export interface TeacherBehaviorCategory {
  id: string;
  code: string;
  kind: ApiBehaviorKind;
  points: number;
  name: string;
  nameEn: string;
}

export interface TeacherRosterStudent {
  studentId: string;
  fullName: string;
  fullNameEn: string;
  attendance: { status: ApiAttendanceStatus; arrivedAt: string | null; isExcused: boolean } | null;
  points: number;
}

export interface TeacherQuickPortal {
  teacher: { id: string; fullName: string; fullNameEn: string | null };
  now: { date: string; weekday: string; time: string; timezone: string };
  lessons: TeacherLesson[];
  behaviorCategories: TeacherBehaviorCategory[];
  focusLessonId: string | null;
  session: { id: string; status: "OPEN" | "SUBMITTED"; submittedAt: string | null } | null;
  roster: TeacherRosterStudent[];
  summary: { total: number; present: number; late: number; absent: number; unmarked: number };
}

export interface TeacherAssignment {
  assignmentId: string;
  class: { id: string; name: string; nameEn: string; grade: string; gradeEn: string };
  subject: { id: string; name: string; nameEn: string };
}

export interface HomeworkCreateInput {
  assignmentId: string;
  title: string;
  notes?: string;
  dueAt: string;
  notifyGuardians?: boolean;
}

async function apiRequest<T>(path: string, init: RequestInit = {}, redirectOnUnauthorized = true): Promise<T> {
  try {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${API_BASE_URL}/api/${path}`, {
      ...init,
      headers,
      credentials: "include",
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null) as
      | { message?: string | string[]; code?: string }
      | T
      | null;

    if (!response.ok) {
      if (response.status === 401 && redirectOnUnauthorized && typeof window !== "undefined") {
        window.location.assign("/");
      }
      const body = payload as { message?: string | string[]; code?: string } | null;
      const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
      throw new ApiError(message ?? "Request failed", response.status, body?.code);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("BACKEND_UNAVAILABLE", 0, "BACKEND_UNAVAILABLE");
  }
}

export async function requestGuardianOtp(NationalId: string): Promise<{ phone: string; maskedPhone: string }> {
  return apiRequest("auth/guardian/request-otp", {
    method: "POST",
    body: JSON.stringify({ NationalId }),
  }, false);
}

export async function verifyGuardianOtp(phone: string, LoginOTP: string): Promise<{ authenticated?: boolean }> {
  return apiRequest("auth/guardian/verify-otp", {
    method: "POST",
    headers: { "X-Client-Type": "web" },
    body: JSON.stringify({ phone, LoginOTP }),
  }, false);
}

export async function staffLogin(email: string, password: string): Promise<{ authenticated?: boolean; staff?: { role: string } }> {
  return apiRequest("auth/staff/login", {
    method: "POST",
    headers: { "X-Client-Type": "web" },
    body: JSON.stringify({ email, password }),
  }, false);
}

export async function fetchStudents(): Promise<ParentStudentData[]> {
  const result = await apiRequest<{ students: ParentStudentData[] }>("auth/guardian/portal");
  return result.students;
}

export async function fetchTeacherPortal(timetableEntryId?: string): Promise<TeacherQuickPortal> {
  const query = timetableEntryId ? `?timetableEntryId=${encodeURIComponent(timetableEntryId)}` : "";
  return apiRequest<TeacherQuickPortal>(`staff/me/quick-portal${query}`);
}

export async function openAttendanceSession(timetableEntryId: string) {
  return apiRequest<{ id: string; status: "OPEN" | "SUBMITTED"; date: string }>(
    "attendance-sessions",
    { method: "POST", body: JSON.stringify({ timetableEntryId }) },
  );
}

export async function saveAttendanceRecords(
  sessionId: string,
  records: { studentId: string; status: ApiAttendanceStatus; arrivedAt?: string }[],
) {
  return apiRequest<{ records: { studentId: string; status: ApiAttendanceStatus; arrivedAt: string | null; isExcused: boolean; markedAt: string }[] }>(
    `attendance-sessions/${encodeURIComponent(sessionId)}/records`,
    { method: "PUT", body: JSON.stringify({ records }) },
  );
}

export async function submitAttendanceSession(sessionId: string) {
  return apiRequest<{
    session: { id: string; status: "OPEN" | "SUBMITTED"; date: string; submittedAt: string | null };
    summary: { total: number; present: number; late: number; absent: number };
    queuedNotifications: number;
  }>(`attendance-sessions/${encodeURIComponent(sessionId)}/submit`, { method: "POST" });
}

export async function createBehaviorRecord(input: { studentId: string; categoryId: string; sessionId?: string }) {
  return apiRequest<{ record: { id: string; studentId: string; categoryId: string; points: number; createdAt: string }; studentPoints: number }>(
    "behavior-records",
    { method: "POST", body: JSON.stringify(input) },
  );
}

export async function fetchTeacherAssignments(): Promise<TeacherAssignment[]> {
  const result = await apiRequest<{ assignments: TeacherAssignment[] }>("homework/assignments");
  return result.assignments;
}

export async function createHomework(input: HomeworkCreateInput) {
  return apiRequest<{
    homework: { id: string; assignmentId: string; title: string; dueAt: string; createdAt: string };
    created: boolean;
    queuedNotifications: number;
  }>("homework", { method: "POST", body: JSON.stringify(input) });
}

export async function fetchComms(filters: CommunicationLogFilters = {}): Promise<CommunicationLogResponse> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  return apiRequest<CommunicationLogResponse>(`notifications/communication-log?${params.toString()}`);
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "X-Client-Type": "web" },
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) throw new ApiError("Unable to clear session cookie", response.status);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Unable to clear session cookie", 0, "LOGOUT_FAILED");
  }
}
