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
    onLoginSuccess: (challenge: { nationalId: string; phone: string; maskedPhone: string }) => void;
}

interface ParentLoginFormProps {
    onLoginSuccess: (challenge: { nationalId: string; phone: string; maskedPhone: string }) => void;
}

interface RequestOtpResponse {
    message: string;
    phone: string;
    maskedPhone: string;
}