"use client";

import { Globe2, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { logout as clearSession } from "@/lib/api";

export function PageHeader({ role = "teacher" }: { role?: "teacher" | "admin" }) {
  const t = useTranslations("teacherQuick.header");
  const auth = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" });
  };

  const logout = async () => {
    try {
      await clearSession();
    } finally {
      router.replace(`/auth`);
    }
  };

  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">{role === "admin" ? t("adminName") : t("teacherName")}</h1>
        <p className="mt-1 text-sm text-mute">{role === "admin" ? t("adminSubtitle") : t("subtitle")}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={switchLanguage}
          aria-label={auth("switchLanguage")}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
        >
          <Globe2 size={17} aria-hidden="true" />
          <span>{locale === "ar" ? "EN" : "عربي"}</span>
        </button>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-mute transition-colors hover:border-bad hover:bg-bad-bg hover:text-bad"
        >
          <LogOut size={17} aria-hidden="true" />
          <span>{auth("logout")}</span>
        </button>
      </div>
    </header>
  );
}
