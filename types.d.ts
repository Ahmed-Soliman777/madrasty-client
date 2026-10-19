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

declare global {
  interface OTPVerificationProps {
    nationalId: string;
    phone: string;
    maskedPhone: string;
    timerSeconds: number;
    onOtpResent: (challenge: { phone: string; maskedPhone: string }) => void;
  }

  interface VerifyOtpResponse {
    message: string;
    accessToken: string;
    guardian: Record<string, unknown>;
  }

  interface RequestOtpResponse {
    message?: string;
    phone: string;
    maskedPhone: string;
  }

  interface GuardianChallenge {
    nationalId: string;
    phone: string;
    maskedPhone: string;
  }

  interface LoginPortalProps {
    onLoginSuccess: (challenge: GuardianChallenge) => void;
  }

  interface ParentLoginFormProps {
    onLoginSuccess: (challenge: GuardianChallenge) => void;
  }

  type StaffAttendanceStatus = "present" | "late" | "absent";
  type StaffStudentId = "ahmed" | "omar" | "yasser" | "fahd" | "karim" | "ziad";
  type StaffPointId = "participation" | "homework" | "distraction";
  type StaffCommsKind = "excellence" | "absence" | "homework";
  type StaffNavId = "quickPortal";

  interface StaffStudent {
    id: StaffStudentId;
    status: StaffAttendanceStatus;
    arrivedAt?: string;
    points: number;
    starBehavior?: boolean;
  }

  interface StaffPointAction {
    id: StaffPointId;
    delta: number;
  }

  interface StaffCommsItem {
    id: string;
    kind: StaffCommsKind;
    studentId?: StaffStudentId;
    text?: string;
    minutesAgo: number;
  }

  interface StaffNavItem {
    id: StaffNavId;
    href: string;
    badge?: number;
  }
}

export {};
