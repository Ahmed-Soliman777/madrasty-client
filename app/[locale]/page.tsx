import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("landing");
  const isArabic = locale === "ar";
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className="min-h-screen overflow-hidden bg-bg text-ink">
      <header className="relative z-10 border-b border-line/80 bg-surface/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label={t("navigationLabel")}>
          <Link href="/" locale={locale} className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-offset-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-sm">
              <GraduationCap size={25} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-extrabold tracking-tight text-navy">{t("brandName")}</span>
              <span className="hidden text-xs text-mute sm:block">{t("schoolName")}</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              locale={isArabic ? "en" : "ar"}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
              aria-label={t("switchLanguage")}
            >
              <Globe2 size={17} aria-hidden="true" />
              <span>{isArabic ? "English" : "العربية"}</span>
            </Link>
            <Link
              href="/auth"
              locale={locale}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-offset-4 sm:px-5"
            >
              <span>{t("signIn")}</span>
              <Arrow size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate">
        <div className="pointer-events-none absolute -end-28 -top-20 -z-10 size-80 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="landing-enter">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">
              <Sparkles size={16} aria-hidden="true" />
              <span>{t("eyebrow")}</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.2] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
              <span className="mt-2 block text-brand">{t("heroHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-mute sm:text-lg">
              {t("heroDescription")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth"
                locale={locale}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-brand px-6 text-base font-bold text-white shadow-lg shadow-brand/15 transition-all hover:-translate-y-0.5 hover:bg-navy focus-visible:outline-offset-4"
              >
                {t("getStarted")}
                <Arrow size={18} aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-line bg-white px-6 text-base font-bold text-navy transition-colors hover:border-brand hover:text-brand"
              >
                {t("howItWorksLink")}
              </a>
            </div>
            <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-mute">
              <ShieldCheck size={19} className="mt-0.5 shrink-0 text-ok" aria-hidden="true" />
              <p>{t("privacyNote")}</p>
            </div>
          </div>

          <div className="landing-enter landing-enter-delay relative mx-auto w-full max-w-xl">
            <div className="absolute -start-5 top-12 size-24 rounded-3xl bg-sky-200/50 landing-float" aria-hidden="true" />
            <div className="absolute -end-3 bottom-10 size-20 rounded-full bg-amber-100 landing-float-delayed" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-navy/10 sm:p-6">
              <div className="rounded-[1.5rem] bg-bg p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-white">
                      <GraduationCap size={23} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-extrabold text-navy">{t("portalPreviewTitle")}</p>
                      <p className="mt-1 text-xs text-mute">{t("portalPreviewSubtitle")}</p>
                    </div>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-ok-bg text-ok">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-brand">
                      <CalendarCheck2 size={20} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-navy">{t("featureAttendance")}</p>
                    <p className="mt-1 text-xs leading-5 text-mute">{t("featureAttendanceShort")}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-ok">
                      <CheckCircle2 size={20} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-navy">{t("featureBehavior")}</p>
                    <p className="mt-1 text-xs leading-5 text-mute">{t("featureBehaviorShort")}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <BookOpenCheck size={20} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-navy">{t("featureHomework")}</p>
                    <p className="mt-1 text-xs leading-5 text-mute">{t("featureHomeworkShort")}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand/10 bg-sky-50 p-4">
                  <MessageCircle size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-navy">{t("whatsappTitle")}</p>
                    <p className="mt-1 text-xs leading-5 text-mute">{t("whatsappDescription")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-mute">
                <ShieldCheck size={14} aria-hidden="true" />
                {t("illustrationCaption")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-brand">{t("featuresEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{t("featuresTitle")}</h2>
            <p className="mt-4 text-base leading-7 text-mute">{t("featuresDescription")}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-line bg-bg p-6 transition-transform duration-200 hover:-translate-y-1">
              <CalendarCheck2 size={25} className="text-brand" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-navy">{t("featureAttendance")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("attendanceDescription")}</p>
            </article>
            <article className="rounded-2xl border border-line bg-bg p-6 transition-transform duration-200 hover:-translate-y-1">
              <CheckCircle2 size={25} className="text-ok" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-navy">{t("featureBehavior")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("behaviorDescription")}</p>
            </article>
            <article className="rounded-2xl border border-line bg-bg p-6 transition-transform duration-200 hover:-translate-y-1">
              <BookOpenCheck size={25} className="text-amber-700" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-navy">{t("featureHomework")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("homeworkDescription")}</p>
            </article>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sky-50 p-5 text-sm leading-7 text-navy">
            <MessageCircle size={21} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
            <p>{t("notificationsDescription")}</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-brand">{t("stepsEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{t("stepsTitle")}</h2>
            <p className="mt-4 text-base leading-7 text-mute">{t("stepsDescription")}</p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            <li className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-soft text-lg font-black text-brand">1</span>
              <h3 className="mt-4 text-lg font-bold text-navy">{t("stepOneTitle")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("stepOneDescription")}</p>
            </li>
            <li className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-soft text-lg font-black text-brand">2</span>
              <h3 className="mt-4 text-lg font-bold text-navy">{t("stepTwoTitle")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("stepTwoDescription")}</p>
            </li>
            <li className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-soft text-lg font-black text-brand">3</span>
              <h3 className="mt-4 text-lg font-bold text-navy">{t("stepThreeTitle")}</h3>
              <p className="mt-2 text-sm leading-7 text-mute">{t("stepThreeDescription")}</p>
            </li>
          </ol>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-navy px-6 py-7 text-white sm:flex-row sm:px-8">
            <div className="flex items-start gap-3">
              <UsersRound size={23} className="mt-1 shrink-0 text-sky-300" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-bold">{t("multiStudentTitle")}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-200">{t("multiStudentDescription")}</p>
              </div>
            </div>
            <Link href="/auth" locale={locale} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-navy transition-colors hover:bg-sky-100">
              {t("signIn")}
              <Arrow size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-mute sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-navy">{t("brandName")} · {t("schoolName")}</p>
          <p>{t("footerNote")}</p>
        </div>
      </footer>
    </main>
  );
}
