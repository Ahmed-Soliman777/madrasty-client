import { students } from "@/mocks/data";
import type { AttendanceStatus } from "@/types/types";

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

const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
export const fetchStudents = async () => (await wait(), students);

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

export const saveStatus = async (_id: string, _s: AttendanceStatus) => {
  await wait();
};
export const sendHomework = async (_d: unknown) => {
  await wait(300);
};
