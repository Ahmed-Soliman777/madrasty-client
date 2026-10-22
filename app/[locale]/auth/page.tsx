import AuthenticationComponent from "@/components/auth/AuthenticationComponent";
import { BookOpenCheck, CalendarCheck2, GraduationCap, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AuthenticationPage() {
  const t = await getTranslations("landing");

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-2">
        <AuthenticationComponent />

        <section className="hidden min-h-screen flex-col justify-between bg-navy p-10 text-white lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <GraduationCap size={23} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold sm:text-base">{t("schoolName")}</p>
              <p className="mt-0.5 text-xs text-slate-300">{t("brandName")}</p>
            </div>
          </div>

          <div className="max-w-xl py-12">
            <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-5xl">
              {t("authSideTitle")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-200">{t("authSideDescription")}</p>
            <div className="mt-8 space-y-4 border-t border-white/15 pt-6">
              <div className="flex items-start gap-3">
                <CalendarCheck2 size={20} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-200">{t("featureAttendance")}</p>
              </div>
              <div className="flex items-start gap-3">
                <BookOpenCheck size={20} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-200">{t("featureHomework")}</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-200">{t("privacyNote")}</p>
              </div>
            </div>
          </div>

          <footer className="border-t border-white/15 pt-4 text-xs text-slate-300">
            {t("footerNote")}
          </footer>
        </section>
      </div>
    </main>
  );
}
