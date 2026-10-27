"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ApiError, fetchGuardianTimetable, type GuardianTimetableResponse } from "@/lib/api";
import { TimetableTable } from "./TimetableTable";

export function GuardianTimetablePanel({ studentId }: { studentId: string }) {
  const t = useTranslations("timetable");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [result, setResult] = useState<GuardianTimetableResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setResult(await fetchGuardianTimetable(studentId));
    } catch (caught) {
      setError(caught instanceof ApiError && caught.code === "BACKEND_UNAVAILABLE" ? "networkError" : "loadError");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="mt-5 space-y-5" aria-labelledby="guardian-timetable-title">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-brand"><CalendarDays size={22} aria-hidden="true" /></div>
          <div>
            <h2 id="guardian-timetable-title" className="text-lg font-bold">{t("guardianTitle")}</h2>
            <p className="mt-1 text-sm leading-6 text-mute">{t("guardianDescription")}</p>
            {result?.student && <p className="mt-2 text-xs font-semibold text-brand">{isArabic ? result.student.class.name : result.student.class.nameEn || result.student.class.name}</p>}
          </div>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold transition hover:border-brand disabled:cursor-not-allowed disabled:opacity-60">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />{t("refresh")}
        </button>
      </div>
      {loading ? (
        <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-mute" role="status">{t("loading")}</div>
      ) : error ? (
        <div className="rounded-xl border border-bad/30 bg-bad-bg p-5" role="alert">
          <p className="font-semibold text-bad">{t(`errors.${error}`)}</p>
          <button type="button" onClick={() => void load()} className="mt-3 rounded-lg border border-bad/30 px-3 py-2 text-sm font-semibold text-bad">{t("retry")}</button>
        </div>
      ) : result?.timetable ? (
        <>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">{t("publishedSchedule")}</p>
            <p className="mt-1 text-sm leading-6 text-mute">{t("publishedScheduleDescription", { version: result.timetable.version })}</p>
          </div>
          <TimetableTable entries={result.timetable.entries} mode="guardian" />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
          <CalendarDays className="mx-auto size-9 text-mute" aria-hidden="true" />
          <p className="mt-3 font-semibold">{t("notPublishedTitle")}</p>
          <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-mute">{t("notPublishedDescription")}</p>
        </div>
      )}
    </section>
  );
}
