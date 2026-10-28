"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronDown, CircleHelp, RefreshCw, WandSparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  ApiError,
  deleteSchoolTimetable,
  deleteTimetableEntry,
  fetchAcademicYears,
  fetchSchoolPeriods,
  fetchSchoolTimetable,
  fetchSchoolTimetables,
  generateSchoolTimetable,
  publishSchoolTimetable,
  updateTimetableEntry,
  type AcademicYearOption,
  type SchoolPeriodOption,
  type TimetableEntry,
  type TimetableSummary,
  type TimetableWeekday,
} from "@/lib/api";
import { TimetableTable } from "./TimetableTable";

const DAYS: TimetableWeekday[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];

export function AdminTimetableManager() {
  const t = useTranslations("timetable");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [versions, setVersions] = useState<TimetableSummary[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [schoolPeriods, setSchoolPeriods] = useState<SchoolPeriodOption[]>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState<TimetableSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editValues, setEditValues] = useState<Record<string, { weekday: TimetableWeekday; periodId: string }>>({});
  const [conflictDetails, setConflictDetails] = useState<string[]>([]);
  const selectedIdRef = useRef("");

  const periods = schoolPeriods;
  const filteredVersions = selectedAcademicYearId ? versions.filter((item) => item.academicYearId === selectedAcademicYearId) : versions;

  const loadVersions = useCallback(async (preferredId?: string) => {
    setLoading(true);
    setError("");
    try {
      const [result, years, availablePeriods] = await Promise.all([
        fetchSchoolTimetables(),
        fetchAcademicYears(),
        fetchSchoolPeriods(),
      ]);
      setVersions(result);
      setAcademicYears(years);
      setSchoolPeriods(availablePeriods);
      const currentId = selectedIdRef.current;
      const nextId = (preferredId && result.some((item) => item.id === preferredId) ? preferredId : undefined)
        ?? (currentId && result.some((item) => item.id === currentId) ? currentId : undefined)
        ?? result[0]?.id
        ?? "";
      setSelectedId(nextId);
      selectedIdRef.current = nextId;
      const selectedVersion = result.find((item) => item.id === nextId);
      const yearId = selectedVersion?.academicYearId ?? years.find((year) => year.isCurrent)?.id ?? years[0]?.id ?? "";
      setSelectedAcademicYearId(yearId);
      if (nextId) {
        setDetailLoading(true);
        const detail = await fetchSchoolTimetable(nextId);
        setSelected(detail);
        setEditValues(Object.fromEntries((detail.entries ?? []).map((entry) => [entry.id, { weekday: entry.weekday, periodId: entry.periodId }])));
      } else {
        setSelected(null);
      }
    } catch (caught) {
      setError(caught instanceof ApiError && caught.code === "BACKEND_UNAVAILABLE" ? "networkError" : "loadError");
    } finally {
      setLoading(false);
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => { void loadVersions(); }, [loadVersions]);

  const loadSelected = async (id: string) => {
    setSelectedId(id);
    selectedIdRef.current = id;
    setError("");
    setConflictDetails([]);
    setNotice("");
    if (!id) {
      setSelected(null);
      return;
    }
    setDetailLoading(true);
    try {
      const detail = await fetchSchoolTimetable(id);
      setSelected(detail);
      setSelectedAcademicYearId(detail.academicYearId);
      setEditValues(Object.fromEntries((detail.entries ?? []).map((entry) => [entry.id, { weekday: entry.weekday, periodId: entry.periodId }])));
    } catch {
      setError("loadError");
    } finally {
      setDetailLoading(false);
    }
  };

  const selectAcademicYear = (academicYearId: string) => {
    setSelectedAcademicYearId(academicYearId);
    const matchingVersions = versions.filter((item) => item.academicYearId === academicYearId);
    const nextId = matchingVersions[0]?.id ?? "";
    if (nextId) {
      void loadSelected(nextId);
    } else {
      setSelectedId("");
      selectedIdRef.current = "";
      setSelected(null);
      setEditValues({});
      setError("");
      setNotice("");
      setConflictDetails([]);
    }
  };

  const generate = async () => {
    const academicYearId = selectedAcademicYearId || selected?.academicYearId || versions.find((item) => item.id === selectedId)?.academicYearId;
    if (!academicYearId) {
      setError("noAcademicYear");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    setConflictDetails([]);
    try {
      const result = await generateSchoolTimetable(academicYearId);
      await loadVersions(result.timetable.id);
      setNotice(result.publishable ? "generatedSuccess" : "generatedPartial");
      if (!result.publishable) {
        setError("missingLessons");
        setConflictDetails(result.missing.map((item) => t("missingAssignment", { subject: item.subject, requested: item.requested, placed: item.placed })));
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? errorKey(caught.code) : "networkError");
      setConflictDetails(readConflictDetails(caught));
    } finally {
      setBusy(false);
    }
  };

  const saveEntry = async (entry: TimetableEntry) => {
    const value = editValues[entry.id] ?? { weekday: entry.weekday, periodId: entry.periodId };
    if (value.weekday === entry.weekday && value.periodId === entry.periodId) return;
    setBusy(true);
    setError("");
    setNotice("");
    setConflictDetails([]);
    try {
      await updateTimetableEntry(entry.timetableId, entry.id, value);
      await loadVersions(selectedId);
      setNotice("editSuccess");
    } catch (caught) {
      setError(caught instanceof ApiError ? errorKey(caught.code) : "networkError");
      setConflictDetails(readConflictDetails(caught));
    } finally {
      setBusy(false);
    }
  };

  const removeEntry = async (entry: TimetableEntry) => {
    if (!window.confirm(t("confirmDeleteEntry"))) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await deleteTimetableEntry(entry.timetableId, entry.id);
      await loadVersions(selectedId);
      setNotice(result.assignment.hasMissingLessons ? "entryDeletedMissing" : "entryDeleted");
    } catch (caught) {
      setError(caught instanceof ApiError ? errorKey(caught.code) : "networkError");
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!selected || selected.status !== "DRAFT") return;
    if (!window.confirm(t("confirmPublish"))) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await publishSchoolTimetable(selected.id);
      await loadVersions(selected.id);
      setNotice("publishSuccess");
    } catch (caught) {
      setError(caught instanceof ApiError ? errorKey(caught.code) : "networkError");
    } finally {
      setBusy(false);
    }
  };

  const deleteDraft = async () => {
    if (!selected || selected.status !== "DRAFT") return;
    if (!window.confirm(t("confirmDeleteDraft"))) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteSchoolTimetable(selected.id);
      await loadVersions();
      setNotice("draftDeleted");
    } catch (caught) {
      setError(caught instanceof ApiError ? errorKey(caught.code) : "networkError");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5" aria-labelledby="admin-timetable-title">
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-brand"><CalendarDays size={22} aria-hidden="true" /></div>
          <div>
            <h2 id="admin-timetable-title" className="text-lg font-bold">{t("adminTitle")}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-mute">{t("adminDescription")}</p>
          </div>
        </div>
        <button type="button" onClick={() => void loadVersions(selectedId)} disabled={loading || busy} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold hover:border-brand disabled:opacity-60">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />{t("refresh")}
        </button>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="block min-w-0 flex-1 text-sm font-semibold">
            {t("chooseAcademicYear")}
            <span className="relative mt-1.5 block">
              <select value={selectedAcademicYearId} onChange={(event) => selectAcademicYear(event.target.value)} disabled={loading || busy || academicYears.length === 0} className="min-h-11 w-full appearance-none rounded-lg border border-line bg-bg px-3 pe-9 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                {academicYears.length === 0 && <option value="">{t("noAcademicYears")}</option>}
                {academicYears.map((year) => <option key={year.id} value={year.id}>{isArabic ? year.name : year.nameEn || year.name}{year.isCurrent ? ` · ${t("currentAcademicYear")}` : ""}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute end-3 top-3.5 text-mute" aria-hidden="true" />
            </span>
          </label>
          <label className="block min-w-0 flex-1 text-sm font-semibold">
            {t("chooseVersion")}
            <span className="relative mt-1.5 block">
              <select value={selectedId} onChange={(event) => void loadSelected(event.target.value)} disabled={loading || filteredVersions.length === 0} className="min-h-11 w-full appearance-none rounded-lg border border-line bg-bg px-3 pe-9 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                {filteredVersions.length === 0 && <option value="">{t("noVersions")}</option>}
                {filteredVersions.map((version) => <option key={version.id} value={version.id}>{isArabic ? version.academicYear?.name : version.academicYear?.nameEn || version.academicYear?.name} · v{version.version} · {t(`statuses.${version.status}`)}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute end-3 top-3.5 text-mute" aria-hidden="true" />
            </span>
          </label>
          <button type="button" onClick={() => void generate()} disabled={busy || loading || academicYears.length === 0 || !selectedAcademicYearId} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            <WandSparkles size={16} aria-hidden="true" />{busy ? t("working") : t("generateDraft")}
          </button>
        </div>
        {filteredVersions.length === 0 && !loading && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-dashed border-line bg-bg p-4 text-sm leading-6 text-mute">
            <CircleHelp size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{academicYears.length === 0 ? t("noAcademicYearsDescription") : t("noVersionsDescription")}</p>
          </div>
        )}
      </div>

      {error && <div className="flex items-start gap-3 rounded-xl border border-bad/30 bg-bad-bg p-4 text-sm leading-6 text-bad" role="alert"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><div><p>{t(`errors.${error}`)}</p>{conflictDetails.length > 0 && <ul className="mt-2 list-disc space-y-1 ps-5">{conflictDetails.map((detail, index) => <li key={`${detail}-${index}`}>{detail}</li>)}</ul>}</div></div>}
      {notice && <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-soft p-4 text-sm leading-6 text-brand" role="status"><CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{t(`notices.${notice}`)}</p></div>}

      {loading || detailLoading ? (
        <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-mute" role="status">{t("loading")}</div>
      ) : selected ? (
        <>
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{isArabic ? selected.academicYear?.name : selected.academicYear?.nameEn || selected.academicYear?.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selected.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : selected.status === "DRAFT" ? "bg-amber-50 text-amber-800" : "bg-bg text-mute"}`}>{t(`statuses.${selected.status}`)}</span>
                <span className="rounded-full bg-bg px-2.5 py-1 text-xs font-semibold text-mute">{t("versionLabel", { version: selected.version })}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{t("entryCount", { count: selected.entries?.length ?? 0 })}</p>
            </div>
            {selected.status === "DRAFT" && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void deleteDraft()} disabled={busy} className="min-h-10 rounded-lg border border-bad/30 px-3 text-sm font-semibold text-bad disabled:opacity-50">{t("deleteDraft")}</button>
                <button type="button" onClick={() => void publish()} disabled={busy || (selected.entries?.length ?? 0) === 0} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{busy ? t("working") : t("approvePublish")}</button>
              </div>
            )}
          </div>

          {selected.status === "DRAFT" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>{t("draftWarning")}</p>
            </div>
          )}

          {selected.entries && selected.entries.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="border-b border-line p-4">
                <h3 className="font-bold">{t("editLessons")}</h3>
                <p className="mt-1 text-sm leading-6 text-mute">{t("editDescription")}</p>
              </div>
              <div className="divide-y divide-line">
                {selected.entries.map((entry) => {
                  const value = editValues[entry.id] ?? { weekday: entry.weekday, periodId: entry.periodId };
                  const changed = value.weekday !== entry.weekday || value.periodId !== entry.periodId;
                  return (
                    <div key={entry.id} className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_150px_140px_auto] lg:items-center">
                      <div className="min-w-0">
                        <p className="font-semibold">{isArabic ? entry.assignment.subject.name : entry.assignment.subject.nameEn || entry.assignment.subject.name}</p>
                        <p className="mt-1 text-sm text-mute">{isArabic ? entry.assignment.class.name : entry.assignment.class.nameEn || entry.assignment.class.name} · {isArabic ? entry.assignment.staff.fullName : entry.assignment.staff.fullNameEn || entry.assignment.staff.fullName}</p>
                        <p className="mt-1 text-xs text-mute">{t(`days.${entry.weekday}`)} · {t("periodLabel", { period: entry.period.number })} · {entry.period.startTime}–{entry.period.endTime}</p>
                      </div>
                      <label className="block text-xs font-semibold text-mute">{t("day")}
                        <select value={value.weekday} disabled={selected.status !== "DRAFT" || busy} onChange={(event) => setEditValues((current) => ({ ...current, [entry.id]: { ...value, weekday: event.target.value as TimetableWeekday } }))} className="mt-1 min-h-10 w-full rounded-lg border border-line bg-bg px-2 text-sm font-normal text-ink disabled:opacity-60">
                          {DAYS.map((day) => <option key={day} value={day}>{t(`days.${day}`)}</option>)}
                        </select>
                      </label>
                      <label className="block text-xs font-semibold text-mute">{t("period")}
                        <select value={value.periodId} disabled={selected.status !== "DRAFT" || busy || periods.length === 0} onChange={(event) => setEditValues((current) => ({ ...current, [entry.id]: { ...value, periodId: event.target.value } }))} className="mt-1 min-h-10 w-full rounded-lg border border-line bg-bg px-2 text-sm font-normal text-ink disabled:opacity-60">
                          {periods.map((period) => <option key={period.id} value={period.id}>{period.number} · {period.startTime}–{period.endTime}</option>)}
                        </select>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {changed && <button type="button" onClick={() => void saveEntry(entry)} disabled={busy} className="min-h-10 rounded-lg bg-brand px-3 text-sm font-semibold text-white disabled:opacity-50">{t("saveChange")}</button>}
                        {selected.status === "DRAFT" && <button type="button" onClick={() => void removeEntry(entry)} disabled={busy} className="min-h-10 rounded-lg border border-line px-3 text-sm font-semibold text-bad disabled:opacity-50">{t("removeLesson")}</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selected.entries && <TimetableTable entries={selected.entries} mode="admin" />}
        </>
      ) : null}
    </section>
  );
}

function readConflictDetails(error: unknown): string[] {
  if (!(error instanceof ApiError) || !error.details) return [];
  const conflicts = error.details.conflicts;
  if (!Array.isArray(conflicts)) return [];
  return conflicts.map((item) => {
    if (!item || typeof item !== "object") return "";
    const conflict = item as { teacher?: string; className?: string; period?: number; weekday?: string };
    return [conflict.teacher, conflict.className, conflict.weekday, conflict.period ? `P${conflict.period}` : undefined].filter(Boolean).join(" · ");
  }).filter(Boolean);
}

function errorKey(code?: string): string {
  switch (code) {
    case "TIMETABLE_EDIT_CONFLICT": return "conflict";
    case "TIMETABLE_ENTRY_HAS_ATTENDANCE":
    case "TIMETABLE_HAS_ATTENDANCE": return "attendanceProtected";
    case "TIMETABLE_INCOMPLETE": return "missingLessons";
    case "TIMETABLE_CONFLICTS_EXIST": return "publishConflict";
    case "TIMETABLE_CAPACITY_EXCEEDED": return "capacityExceeded";
    case "TIMETABLE_LESSON_COUNTS_MISSING": return "lessonCountsMissing";
    case "TIMETABLE_NO_ASSIGNMENTS": return "noAssignments";
    case "TIMETABLE_NO_PERIODS": return "noPeriods";
    case "TIMETABLE_NOT_DRAFT": return "notDraft";
    case "ACADEMIC_YEAR_NOT_FOUND": return "yearNotFound";
    case "TIMETABLE_NOT_FOUND": return "loadError";
    default: return "actionFailed";
  }
}
