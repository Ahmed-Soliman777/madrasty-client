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
    authenticated: boolean;
    guardian: Record<string, unknown>;
  }

  interface RequestOtpResponse {
    message: string;
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

  type StaffNavId = "quickPortal";

  interface StaffNavItem {
    id: StaffNavId;
    href: string;
    badge?: number;
  }
}

export {};
