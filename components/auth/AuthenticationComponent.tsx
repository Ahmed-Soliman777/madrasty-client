"use client";

import { useEffect, useState } from "react";
import { Globe2, GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import OTPVerification from "./OTPVerification";
import LoginPortal from "./LoginPortal";

const AuthenticationComponent = () => {
  const locale = useLocale();
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [challenge, setChallenge] = useState<GuardianChallenge | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(45);

  useEffect(() => {
    if (currentStep !== 2) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [currentStep]);

  const handleLoginSuccess = (nextChallenge: GuardianChallenge) => {
    setChallenge(nextChallenge);
    setTimerSeconds(45);
    setCurrentStep(2);
  };

  const switchLanguage = () => {
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" });
  };

  return (
    <section className="flex min-h-screen w-full flex-col bg-surface px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
            <GraduationCap size={21} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-navy">{t("brandName")}</span>
              <span className="rounded border border-line bg-soft px-1.5 py-0.5 text-[10px] font-bold text-brand">NEIS</span>
            </div>
            <p className="mt-0.5 text-xs text-mute">{t("schoolName")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={switchLanguage}
          aria-label={t("switchLanguage")}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <Globe2 size={17} aria-hidden="true" />
          <span>{locale === "ar" ? t("english") : t("arabic")}</span>
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm leading-6 text-mute">
            {currentStep === 1 ? t("nationalIdDescription") : t("otpDescription")}
          </p>
        </div>

        {currentStep === 1 && <LoginPortal onLoginSuccess={handleLoginSuccess} />}

        {currentStep === 2 && challenge && (
          <OTPVerification
            nationalId={challenge.nationalId}
            phone={challenge.phone}
            maskedPhone={challenge.maskedPhone}
            timerSeconds={timerSeconds}
            onOtpResent={(nextChallenge) => {
              setChallenge((current) => current ? { ...current, ...nextChallenge } : current);
              setTimerSeconds(45);
            }}
          />
        )}
      </div>

      <footer className="border-t border-line pt-5 text-center text-xs text-mute sm:text-start">
        {t("footer")}
      </footer>
    </section>
  );
};

export default AuthenticationComponent;
