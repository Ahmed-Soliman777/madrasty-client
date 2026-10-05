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
  phone: string;
  maskedPhone: string;
}

interface GuardianChallenge {
  nationalId: string;
  phone: string;
  maskedPhone: string;
}

interface LoginPortalProps {
  onLoginSuccess: (challenge: {
    nationalId: string;
    phone: string;
    maskedPhone: string;
  }) => void;
}

interface ParentLoginFormProps {
  onLoginSuccess: (challenge: {
    nationalId: string;
    phone: string;
    maskedPhone: string;
  }) => void;
}

interface RequestOtpResponse {
  message: string;
  phone: string;
  maskedPhone: string;
}

// ---- Staff portal ----
type StaffAttendanceStatus = "present" | "late" | "absent";
type StaffStudentId = "ahmed" | "omar" | "yasser" | "fahd" | "karim" | "ziad";
type StaffPointId = "participation" | "homework" | "distraction";
type StaffCommsKind = "excellence" | "absence" | "homework";
type StaffNavId =
  | "quickPortal"
  | "schedule"
  | "grades"
  | "messages"
  | "settings";

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
  href?: string;
  badge?: number;
}
