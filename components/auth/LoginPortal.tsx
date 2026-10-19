"use client";

import { BriefcaseBusiness, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ParentLoginForm from "./ParentLoginForm";
import StaffLoginForm from "./StaffLoginForm";

type LoginRole = "parent" | "staff";

const STORAGE_KEY = "login-role";

const LoginPortal = ({ onLoginSuccess }: LoginPortalProps) => {
  const t = useTranslations("auth");

  const [selectedRole, setSelectedRole] = useState<LoginRole>(() => {
    if (typeof window === "undefined") {
      return "parent";
    }

    const savedRole = sessionStorage.getItem(STORAGE_KEY);
    return savedRole === "parent" || savedRole === "staff" ? savedRole : "parent";
  });

  // Save the role whenever it changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, selectedRole);
  }, [selectedRole]);

  return (
    <section className="space-y-6">
      {selectedRole === "parent" ? (
        <ParentLoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <StaffLoginForm />
      )}

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-ink">
          {t("loginAs")}
        </legend>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <label
            className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-3 transition-colors ${
              selectedRole === "parent"
                ? "border-brand bg-soft"
                : "border-line bg-surface hover:border-brand"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="login-role"
                value="parent"
                checked={selectedRole === "parent"}
                onChange={() => setSelectedRole("parent")}
                className="size-4 accent-brand"
              />
              <span className="text-sm font-semibold text-ink">
                {t("parentRole")}
              </span>
            </span>

            <UsersRound
              size={18}
              className="shrink-0 text-brand"
              aria-hidden="true"
            />
          </label>

          <label
            className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-3 transition-colors ${
              selectedRole === "staff"
                ? "border-brand bg-soft"
                : "border-line bg-surface hover:border-brand"
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="login-role"
                value="staff"
                checked={selectedRole === "staff"}
                onChange={() => setSelectedRole("staff")}
                className="size-4 accent-brand"
              />
              <span className="text-sm font-semibold text-ink">
                {t("staffRole")}
              </span>
            </span>

            <BriefcaseBusiness
              size={18}
              className="shrink-0 text-brand"
              aria-hidden="true"
            />
          </label>
        </div>
      </fieldset>
    </section>
  );
};

export default LoginPortal;