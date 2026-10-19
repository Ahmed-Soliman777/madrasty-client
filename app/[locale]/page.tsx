import AuthenticationComponent from "@/components/auth/AuthenticationComponent";
import { GraduationCap, Landmark, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("landing");
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-2">
        <AuthenticationComponent />

        <section className="hidden min-h-screen flex-col justify-between bg-navy p-10 text-white lg:flex xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <Landmark size={23} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold sm:text-base">{t("schoolName")}</p>
              <p className="mt-0.5 text-xs text-slate-300">{t("brandName")}</p>
            </div>
          </div>

          <div className="max-w-xl py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold text-slate-100">
              <GraduationCap size={16} aria-hidden="true" />
              {t("certificateBadge")}
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-5xl">
              {t("welcome")} <span className="text-sky-300">{t("brandName")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-200">{t("intro")}</p>
            <div className="mt-8 flex items-start gap-3 border-t border-white/15 pt-5">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-300">{t("securityNotice")}</p>
            </div>
          </div>

          <footer className="border-t border-white/15 pt-4 text-xs text-slate-300">
            {t("copyright", { year })}
          </footer>
        </section>
      </div>
    </main>
  );
}
