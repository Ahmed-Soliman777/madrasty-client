"use client";

import { ArrowLeft, IdCard, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, requestGuardianOtp } from "@/lib/api";

const inputClass =
  "h-12 w-full rounded-lg border border-line bg-bg pe-11 ps-4 text-sm text-ink transition-colors placeholder:text-mute focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20";

const ParentLoginForm = ({ onLoginSuccess }: ParentLoginFormProps) => {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handlePortalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await requestGuardianOtp(nationalId);
      if (!data.studentId) {
        throw new ApiError("Selected student was not returned by the server", 502, "MISSING_STUDENT_ID");
      }

      onLoginSuccess({
        nationalId,
        phone: data.phone,
        maskedPhone: data.maskedPhone,
        studentId: data.studentId,
      });
    } catch (error) {
      setError(error instanceof ApiError && error.status > 0 ? t("requestOtpError") : t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePortalSubmit} className="space-y-3">
      <div>
        <label htmlFor="nationalIdInput" className="mb-2 block text-sm font-semibold text-ink">
          {t("nationalIdLabel")} <span className="text-bad" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <IdCard className="pointer-events-none absolute inset-y-0 inset-e-3.5 my-auto size-5 text-mute" aria-hidden="true" />
          <input
            type="text"
            id="nationalIdInput"
            autoComplete="off"
            maxLength={14}
            inputMode="numeric"
            pattern="[0-9]{14}"
            value={nationalId}
            onChange={(event) => setNationalId(event.target.value.replace(/\D/g, "").slice(0, 14))}
            placeholder={t("nationalIdPlaceholder")}
            required
            aria-describedby="national-id-help"
            className={inputClass}
          />
        </div>
        <p id="national-id-help" className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-mute">
          <Info className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
          <span>{t("nationalIdHelp")}</span>
        </p>
      </div>

      {error && <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">{error}</p>}

      <button
        type="submit"
        disabled={loading || nationalId.length !== 14}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-brand focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{loading ? t("confirmLoginButtonLoading") : t("sendOtp")}</span>
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  );
};

export default ParentLoginForm;
