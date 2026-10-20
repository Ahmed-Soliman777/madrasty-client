"use client";

import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

const inputClass =
  "h-12 w-full rounded-lg border border-line bg-bg pe-11 ps-4 text-sm text-ink transition-colors placeholder:text-mute focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20";

const StaffLoginForm = () => {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePortalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/staff/login", {
        method: "POST",
        body: JSON.stringify({ email: staffEmail, password: staffPassword }),
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as { authenticated?: boolean; staff?: { role: string } };

      if (!response.ok || !data.authenticated || !data.staff) {
        setError(t("staffLoginError"));
        return;
      }

      if (!["TEACHER", "SCHOOL_ADMIN"].includes(data.staff.role)) {
        await fetch("/api/auth/logout", { method: "POST" });
        setError(t("staffPortalUnavailable"));
        return;
      }
      router.replace("/staff");
    } catch {
      setError(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePortalSubmit} className="space-y-4">
      <div>
        <label htmlFor="staffEmailInput" className="mb-2 block text-sm font-semibold text-ink">
          {t("emailLabel")} <span className="text-bad" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute inset-y-0 end-3.5 my-auto size-5 text-mute" aria-hidden="true" />
          <input
            type="email"
            id="staffEmailInput"
            autoComplete="username"
            value={staffEmail}
            onChange={(event) => setStaffEmail(event.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="staffPasswordInput" className="mb-2 block text-sm font-semibold text-ink">
          {t("passwordLabel")} <span className="text-bad" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 end-3.5 my-auto size-5 text-mute" aria-hidden="true" />
          <input
            type="password"
            id="staffPasswordInput"
            autoComplete="current-password"
            value={staffPassword}
            onChange={(event) => setStaffPassword(event.target.value)}
            placeholder={t("passwordPlaceholder")}
            required
            className={inputClass}
          />
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-brand focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{loading ? t("confirmLoginButtonLoading") : t("loginTitle")}</span>
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  );
};

export default StaffLoginForm;
