"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ApiError, fetchTeacherTimetable, type TimetableEntry } from "@/lib/api";
import { TimetableTable } from "./TimetableTable";

export function TeacherTimetablePanel() {
  const t = useTranslations("timetable");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEntries(await fetchTeacherTimetable());
    } catch (caught) {
      setError(caught instanceof ApiError && caught.code === "BACKEND_UNAVAILABLE" ? "network" : "load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="space-y-5" aria-labelledby="teacher-timetable-title">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-brand"><CalendarDays size={22} aria-hidden="true" /></div>
          <div>
            <h2 id="teacher-timetable-title" className="text-lg font-bold">{t("teacherTitle")}</h2>
            <p className="mt-1 text-sm leading-6 text-mute">{t("teacherDescription")}</p>
          </div>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold transition hover:border-brand disabled:cursor-not-allowed disabled:opacity-60">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          {t("refresh")}
        </button>
      </div>
      {loading ? (
        <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-mute" role="status">{t("loading")}</div>
      ) : error ? (
        <div className="rounded-xl border border-bad/30 bg-bad-bg p-5" role="alert">
          <p className="font-semibold text-bad">{t(error === "network" ? "networkError" : "loadError")}</p>
          <button type="button" onClick={() => void load()} className="mt-3 rounded-lg border border-bad/30 px-3 py-2 text-sm font-semibold text-bad">{t("retry")}</button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-4"><p className="text-sm text-mute">{t("totalLessons")}</p><p className="mt-1 text-2xl font-bold">{entries.length}</p></div>
            <div className="rounded-xl border border-line bg-surface p-4"><p className="text-sm text-mute">{t("classesCovered")}</p><p className="mt-1 text-2xl font-bold">{new Set(entries.map((entry) => entry.classId)).size}</p></div>
            <div className="rounded-xl border border-line bg-surface p-4"><p className="text-sm text-mute">{t("subjectsCovered")}</p><p className="mt-1 text-2xl font-bold">{new Set(entries.map((entry) => entry.assignment.subject.name)).size}</p></div>
          </div>
          <TimetableTable entries={entries} mode="teacher" />
        </>
      )}
    </section>
  );
}
