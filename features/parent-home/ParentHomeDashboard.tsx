"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  GraduationCap,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { fetchStudents } from "@/lib/api";
import type { ParentStudentData } from "@/data";

export function ParentHomeDashboard() {
  const t = useTranslations("parentHome");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const [students, setStudents] = useState<ParentStudentData[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchStudents()
      .then((result) => {
        if (!active) return;
        setStudents(result);
        setSelectedId((current) => current || result[0]?.id || "");
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const student = students.find((item) => item.id === selectedId) ?? students[0];
  const attendanceSummary = useMemo(() => {
    const records = student?.attendanceRecords ?? [];
    return {
      present: records.filter((record) => record.status === "PRESENT").length,
      late: records.filter((record) => record.status === "LATE").length,
      absent: records.filter((record) => record.status === "ABSENT").length,
    };
  }, [student]);
  const behaviorPoints = useMemo(
    () => (student?.behaviorRecords ?? []).reduce((total, record) => total + record.points, 0),
    [student],
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    [isArabic],
  );
  const dateTimeFormatter = useMemo(
    () => new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }),
    [isArabic],
  );

  const switchLanguage = () => {
    router.replace(pathname, { locale: isArabic ? "en" : "ar" });
  };
  const logout = () => {
    window.localStorage.removeItem("accessToken");
    router.replace("/");
  };
  const studentName = (item: ParentStudentData) => isArabic ? item.fullName : item.fullNameEn;

  return (
    <main className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-sm">
              <GraduationCap size={23} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-navy sm:text-base">{t("schoolName")}</p>
              <p className="text-xs text-mute">{t("brand")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={switchLanguage} aria-label={t("switchLanguage")} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-semibold transition hover:border-brand hover:bg-soft">
              <Globe2 size={17} />
              <span>{isArabic ? "EN" : "عربي"}</span>
            </button>
            <button type="button" onClick={logout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm font-semibold text-mute transition hover:border-bad hover:bg-bad-bg hover:text-bad">
              <LogOut size={17} />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#0A2540] via-[#0A3964] to-[#0077C6] p-5 text-white shadow-lg shadow-[#0A2540]/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -end-10 -top-20 size-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -end-2 -top-12 size-48 rounded-full border border-white/10" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
                <ShieldCheck size={15} />
                {t("portalLabel")}
              </div>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{t("welcome")}</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-sky-100 sm:text-base">{t("description")}</p>
            </div>
            <div className="flex w-full flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:max-w-sm sm:p-4">
              <label htmlFor="student-select" className="text-xs font-semibold text-sky-100">{t("selectStudent")}</label>
              <div className="relative">
                <UsersRound className="pointer-events-none absolute inset-y-0 start-3 my-auto text-sky-200" size={18} />
                <select id="student-select" value={student?.id ?? ""} onChange={(event) => setSelectedId(event.target.value)} disabled={loading || students.length < 2} className="min-h-12 w-full appearance-none rounded-xl border border-white/20 bg-[#0A2540]/70 py-2 pe-10 ps-10 text-sm font-bold text-white outline-none transition focus:ring-2 focus:ring-white/70 disabled:opacity-80">
                  {students.map((item) => <option key={item.id} value={item.id} className="bg-white text-ink">{studentName(item)}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 end-3 my-auto text-sky-200" size={17} />
              </div>
            </div>
          </div>
        </section>

        {!loading && !loadError && student && (
          <section className="mt-5 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-soft text-brand"><GraduationCap size={23} /></div>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold">{studentName(student)}</p>
                <p className="mt-1 text-sm text-mute">{isArabic ? student.grade : student.gradeEn}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="rounded-xl bg-soft px-3 py-2 text-xs font-bold text-brand">{t("gradeLabel")}: {isArabic ? student.grade : student.gradeEn}</span>
              <span className="rounded-xl bg-bg px-3 py-2 text-xs font-bold text-mute">{t("classLabel")}: {isArabic ? student.className : student.classNameEn}</span>
            </div>
          </section>
        )}

        {loading ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={t("loading")}>
            {[0, 1, 2].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-line bg-surface" />)}
          </section>
        ) : loadError || !student ? (
          <section className="mt-6 rounded-2xl border border-line bg-surface p-6 text-center">
            <p className="font-semibold">{t("loadError")}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-navy px-4 text-sm font-bold text-white hover:bg-brand">
              <RefreshCw size={16} />{t("retry")}
            </button>
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-soft text-brand"><CalendarDays size={21} /></div>
                  <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-bold text-brand">{t("recentRecords")}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-mute">{t("attendanceTitle")}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">{attendanceSummary.present + attendanceSummary.late + attendanceSummary.absent}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-lg bg-ok-bg px-2.5 py-1.5 text-ok">{t("present")}: {attendanceSummary.present}</span>
                  <span className="rounded-lg bg-warn-bg px-2.5 py-1.5 text-warn">{t("late")}: {attendanceSummary.late}</span>
                  <span className="rounded-lg bg-bad-bg px-2.5 py-1.5 text-bad">{t("absent")}: {attendanceSummary.absent}</span>
                </div>
              </article>
              <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#E9F8F0] text-[#07804A]"><Sparkles size={21} /></div>
                  <span className="rounded-full bg-[#E9F8F0] px-2.5 py-1 text-xs font-bold text-[#07804A]">{t("behaviorEntries", { count: student.behaviorRecords.length })}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-mute">{t("behaviorTitle")}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">{behaviorPoints > 0 ? "+" : ""}{behaviorPoints}</p>
                <p className="mt-2 text-xs text-mute">{t("behaviorPointsDescription")}</p>
              </article>
              <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm shadow-slate-900/[0.02] sm:col-span-2 xl:col-span-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#FFF4DF] text-[#9A5B00]"><BookOpen size={21} /></div>
                  <span className="rounded-full bg-[#FFF4DF] px-2.5 py-1 text-xs font-bold text-[#9A5B00]">{t("assignments", { count: student.homework.length })}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-mute">{t("homeworkTitle")}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">{student.homework.length}</p>
                <p className="mt-2 text-xs text-mute">{t("homeworkDescription")}</p>
              </article>
            </section>

            <section className="mt-6 grid items-start gap-5 lg:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-soft text-brand"><CalendarDays size={19} /></div>
                    <div><h2 className="font-bold">{t("attendanceHistory")}</h2><p className="mt-0.5 text-xs text-mute">{t("attendanceSubtitle")}</p></div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.attendanceRecords.length}</span>
                </div>
                {student.attendanceRecords.length ? <ul className="divide-y divide-line">
                  {student.attendanceRecords.map((record) => <li key={record.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-mute"><Clock3 size={17} /></div>
                      <div className="min-w-0"><p className="text-sm font-semibold">{dateFormatter.format(new Date(record.date))}</p><p className="mt-0.5 text-xs text-mute">{record.arrivedAt ? t("arrivalTime", { time: record.arrivedAt }) : t("noArrivalTime")}</p></div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${record.status === "PRESENT" ? "bg-ok-bg text-ok" : record.status === "LATE" ? "bg-warn-bg text-warn" : "bg-bad-bg text-bad"}`}>{t(`attendanceStatus.${record.status}`)}</span>
                  </li>)}
                </ul> : <p className="p-5 text-sm text-mute">{t("noAttendance")}</p>}
              </article>

              <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-slate-900/[0.02]">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#E9F8F0] text-[#07804A]"><Sparkles size={19} /></div>
                    <div><h2 className="font-bold">{t("behaviorHistory")}</h2><p className="mt-0.5 text-xs text-mute">{t("behaviorSubtitle")}</p></div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.behaviorRecords.length}</span>
                </div>
                {student.behaviorRecords.length ? <ul className="divide-y divide-line">
                  {student.behaviorRecords.map((record) => <li key={record.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${record.kind === "POSITIVE" ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad"}`}>{record.kind === "POSITIVE" ? <Check size={17} /> : <Sparkles size={17} />}</div>
                      <div className="min-w-0"><p className="truncate text-sm font-semibold">{isArabic ? record.categoryName : record.categoryNameEn}</p><p className="mt-0.5 text-xs text-mute">{dateTimeFormatter.format(new Date(record.createdAt))}</p></div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${record.points >= 0 ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad"}`}>{record.points > 0 ? "+" : ""}{record.points}</span>
                  </li>)}
                </ul> : <p className="p-5 text-sm text-mute">{t("noBehavior")}</p>}
              </article>

              <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm shadow-slate-900/[0.02] lg:col-span-2">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#FFF4DF] text-[#9A5B00]"><BookOpen size={19} /></div>
                    <div><h2 className="font-bold">{t("homeworkHistory")}</h2><p className="mt-0.5 text-xs text-mute">{t("homeworkSubtitle")}</p></div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.homework.length}</span>
                </div>
                {student.homework.length ? <ul className="grid gap-0 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse">
                  {student.homework.map((item) => <li key={item.id} className="flex items-start gap-3 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg text-mute"><BookOpen size={18} /></div>
                    <div className="min-w-0"><p className="text-sm font-bold leading-6">{item.title}</p><p className="mt-1.5 flex items-center gap-1.5 text-xs text-mute"><Clock3 size={14} />{t("dueDate", { date: dateFormatter.format(new Date(item.dueAt)) })}</p></div>
                  </li>)}
                </ul> : <p className="p-5 text-sm text-mute">{t("noHomework")}</p>}
              </article>
            </section>

            <footer className="mt-8 flex flex-col gap-2 border-t border-line py-5 text-center text-xs text-mute sm:flex-row sm:items-center sm:justify-between sm:text-start">
              <span>{t("footer")}</span>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
