"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Globe2,
  GraduationCap,
  LogOut,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { fetchStudents, logout as clearSession } from "@/lib/api";
import type { ParentStudentData } from "@/types";

const SELECTED_STUDENT_STORAGE_KEY = "madrasty:selectedStudentNationalId";

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

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = await fetchStudents();
      setStudents(result);
      const storedNationalId = window.sessionStorage.getItem(SELECTED_STUDENT_STORAGE_KEY) ?? "";
      const preferredStudent = result.find((student) => student.nationalId === storedNationalId);
      setSelectedId((current) =>
        result.some((student) => student.id === current)
          ? current
          : preferredStudent?.id ?? result[0]?.id ?? "",
      );
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    const selectedStudent = students.find((item) => item.id === selectedId);
    if (selectedStudent?.nationalId) {
      window.sessionStorage.setItem(SELECTED_STUDENT_STORAGE_KEY, selectedStudent.nationalId);
    }
  }, [selectedId, students]);

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
    () =>
      new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [isArabic],
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      hour: "numeric",
      minute: "2-digit",
    }),
    [isArabic],
  );
  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
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

  const logout = async () => {
    try {
      await clearSession();
    } finally {
      router.replace(`/auth`);
    }
  };

  const handleStudentChange = (studentId: string) => {
    setSelectedId(studentId);
    const selectedStudent = students.find((item) => item.id === studentId);
    if (selectedStudent?.nationalId) {
      window.sessionStorage.setItem(SELECTED_STUDENT_STORAGE_KEY, selectedStudent.nationalId);
    }
  };

  const studentName = (item: ParentStudentData) =>
    isArabic ? item.fullName : item.fullNameEn;

  return (
    <main className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
              <GraduationCap size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-navy sm:text-base">{t("schoolName")}</p>
              <p className="text-xs text-mute">{t("brand")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={switchLanguage}
              aria-label={t("switchLanguage")}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand focus-visible:outline-offset-2"
            >
              <Globe2 size={17} aria-hidden="true" />
              <span>{isArabic ? "EN" : "عربي"}</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              aria-label={t("logout")}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-mute transition-colors hover:border-bad hover:bg-bad-bg hover:text-bad"
            >
              <LogOut size={17} aria-hidden="true" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="rounded-2xl bg-navy p-5 text-white sm:p-7 lg:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                <GraduationCap size={15} aria-hidden="true" />
                {t("portalLabel")}
              </div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{t("welcome")}</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">{t("description")}</p>
            </div>
            <div className="flex w-full flex-col gap-2 md:max-w-xs">
              <label htmlFor="student-select" className="text-xs font-semibold text-slate-200">
                {t("selectStudent")}
              </label>
              <div className="relative">
                <UsersRound className="pointer-events-none absolute inset-y-0 inset-s-3 my-auto text-slate-300" size={18} aria-hidden="true" />
                <select
                  id="student-select"
                  value={student?.id ?? ""}
                  onChange={(event) => handleStudentChange(event.target.value)}
                  disabled={loading || students.length < 2}
                  className="min-h-12 w-full appearance-none rounded-lg border border-white/20 bg-white px-10 py-2 text-sm font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-75"
                >
                  {students.map((item) => (
                    <option key={item.id} value={item.id}>{studentName(item)}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto text-mute" size={17} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={t("loading")} aria-busy="true">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-xl border border-line bg-surface" />
            ))}
          </section>
        ) : loadError || !student ? (
          <section className="mt-6 rounded-xl border border-line bg-surface p-8 text-center" role="alert">
            <p className="font-semibold">{t("loadError")}</p>
            <button
              type="button"
              onClick={() => void loadStudents()}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              <RefreshCw size={16} aria-hidden="true" />
              {t("retry")}
            </button>
          </section>
        ) : (
          <>
            <section className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-soft text-brand">
                  <GraduationCap size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold">{studentName(student)}</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="rounded-lg bg-soft px-3 py-2 text-xs font-semibold text-brand">
                  {t("gradeLabel")}: {isArabic ? student.grade : student.gradeEn}
                </span>
                <span className="rounded-lg bg-bg px-3 py-2 text-xs font-semibold text-mute">
                  {t("classLabel")}: {isArabic ? student.className : student.classNameEn}
                </span>
              </div>
            </section>

            <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-brand">
                    <CalendarDays size={20} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-mute">{t("recentRecords")}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-mute">{t("attendanceTitle")}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{student.attendanceRecords.length}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-md bg-ok-bg px-2.5 py-1.5 text-ok">{t("present")}: {attendanceSummary.present}</span>
                  <span className="rounded-md bg-warn-bg px-2.5 py-1.5 text-warn">{t("late")}: {attendanceSummary.late}</span>
                  <span className="rounded-md bg-bad-bg px-2.5 py-1.5 text-bad">{t("absent")}: {attendanceSummary.absent}</span>
                </div>
              </article>

              <article className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-ok-bg text-ok">
                    <Check size={20} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-mute">{t("behaviorEntries", { count: student.behaviorRecords.length })}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-mute">{t("behaviorTitle")}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{behaviorPoints > 0 ? "+" : ""}{behaviorPoints}</p>
                <p className="mt-2 text-xs leading-5 text-mute">{t("behaviorPointsDescription")}</p>
              </article>

              <article className="rounded-xl border border-line bg-surface p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-warn-bg text-warn">
                    <BookOpen size={20} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-mute">{t("assignments", { count: student.homework.length })}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-mute">{t("homeworkTitle")}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{student.homework.length}</p>
                <p className="mt-2 text-xs leading-5 text-mute">{t("homeworkDescription")}</p>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 lg:grid-cols-2">
              <article className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-soft text-brand">
                      <CalendarDays size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold">{t("attendanceHistory")}</h2>
                      <p className="mt-0.5 text-xs text-mute">{t("attendanceSubtitle")}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.attendanceRecords.length}</span>
                </div>
                {student.attendanceRecords.length ? (
                  <ul className="divide-y divide-line">
                    {student.attendanceRecords.map((record) => (
                      <li key={record.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg text-mute">
                            <Clock3 size={16} aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">{dateFormatter.format(new Date(record.date))}</p>
                            <p className="mt-0.5 text-xs text-mute">{record.arrivedAt ? t("arrivalTime", { time: timeFormatter.format(new Date(record.arrivedAt)) }) : t("noArrivalTime")}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${record.status === "PRESENT" ? "bg-ok-bg text-ok" : record.status === "LATE" ? "bg-warn-bg text-warn" : "bg-bad-bg text-bad"}`}>
                          {t(`attendanceStatus.${record.status}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="p-5 text-sm text-mute">{t("noAttendance")}</p>}
              </article>

              <article className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-ok-bg text-ok">
                      <Check size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold">{t("behaviorHistory")}</h2>
                      <p className="mt-0.5 text-xs text-mute">{t("behaviorSubtitle")}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.behaviorRecords.length}</span>
                </div>
                {student.behaviorRecords.length ? (
                  <ul className="divide-y divide-line">
                    {student.behaviorRecords.map((record) => (
                      <li key={record.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${record.kind === "POSITIVE" ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad"}`}>
                            {record.kind === "POSITIVE" ? <Check size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{isArabic ? record.categoryName : record.categoryNameEn}</p>
                            <p className="mt-0.5 text-xs text-mute">{dateTimeFormatter.format(new Date(record.createdAt))}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${record.points >= 0 ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad"}`}>
                          {record.points > 0 ? "+" : ""}{record.points}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="p-5 text-sm text-mute">{t("noBehavior")}</p>}
              </article>

              <article className="overflow-hidden rounded-xl border border-line bg-surface lg:col-span-2">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-warn-bg text-warn">
                      <BookOpen size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold">{t("homeworkHistory")}</h2>
                      <p className="mt-0.5 text-xs text-mute">{t("homeworkSubtitle")}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-mute">{student.homework.length}</span>
                </div>
                {student.homework.length ? (
                  <ul className="grid gap-0 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse">
                    {student.homework.map((item) => (
                      <li key={item.id} className="flex items-start gap-3 p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg text-mute">
                          <BookOpen size={18} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-6">{item.title}</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-mute">
                            <Clock3 size={14} aria-hidden="true" />
                            {t("dueDate", { date: dateFormatter.format(new Date(item.dueAt)) })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="p-5 text-sm text-mute">{t("noHomework")}</p>}
              </article>
            </section>

            <footer className="mt-8 border-t border-line py-5 text-center text-xs text-mute sm:text-start">
              {t("footer")}
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
