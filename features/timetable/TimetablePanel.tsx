"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, LoaderCircle, RefreshCw, Save, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  deleteTimetableDraft,
  deleteTimetableEntry,
  fetchGuardianTimetable,
  fetchStudents,
  fetchTimetable,
  fetchTeacherTimetable,
  fetchTimetables,
  generateTimetableDraft,
  publishTimetable,
  updateTimetableEntry,
  type GuardianTimetableResponse,
  type TimetableEntry,
  type TimetableRecord,
  type TimetableWeekday,
} from "@/lib/api";
import type { ParentStudentData } from "@/types";

type Role = "teacher" | "guardian" | "admin";
const DAYS: TimetableWeekday[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function messageFromError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    const code = "code" in error && typeof error.code === "string" ? error.code : "";
    if (code === "TIMETABLE_EDIT_CONFLICT" || code === "TIMETABLE_CONFLICTS_EXIST") return "conflict";
    if (code === "TIMETABLE_INCOMPLETE") return "incomplete";
    if (code === "TIMETABLE_NOT_DRAFT") return "notDraft";
    if (code === "TIMETABLE_ENTRY_HAS_ATTENDANCE" || code === "TIMETABLE_HAS_ATTENDANCE") return "attendanceProtected";
    if (code === "BACKEND_UNAVAILABLE") return "backendUnavailable";
    return error.message;
  }
  return fallback;
}

export function TimetablePanel({ role, studentId }: { role: Role; studentId?: string }) {
  const t = useTranslations("timetable");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [teacherEntries, setTeacherEntries] = useState<TimetableEntry[]>([]);
  const [guardianData, setGuardianData] = useState<GuardianTimetableResponse | null>(null);
  const [students, setStudents] = useState<ParentStudentData[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? "");
  const [timetables, setTimetables] = useState<TimetableRecord[]>([]);
  const [timetableDetails, setTimetableDetails] = useState<TimetableRecord | null>(null);
  const [selectedTimetableId, setSelectedTimetableId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draftChanges, setDraftChanges] = useState<Record<string, { weekday: TimetableWeekday; periodId: string }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (role === "teacher") {
        setTeacherEntries(await fetchTeacherTimetable());
      } else if (role === "guardian") {
        const children = await fetchStudents();
        setStudents(children);
        const preferred = children.some((child) => child.id === selectedStudentId) ? selectedStudentId : children[0]?.id ?? "";
        setSelectedStudentId(preferred);
        setGuardianData(preferred ? await fetchGuardianTimetable(preferred) : null);
      } else {
        const result = await fetchTimetables();
        setTimetables(result);
        setSelectedTimetableId((current) => result.some((item) => item.id === current) ? current : result[0]?.id ?? "");
      }
    } catch (caught) {
      setError(messageFromError(caught, "loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [role, selectedStudentId]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (role !== "guardian" || !selectedStudentId) return;
    let cancelled = false;
    fetchGuardianTimetable(selectedStudentId)
      .then((result) => { if (!cancelled) setGuardianData(result); })
      .catch((caught: unknown) => { if (!cancelled) setError(messageFromError(caught, "loadFailed")); });
    return () => { cancelled = true; };
  }, [role, selectedStudentId]);

  useEffect(() => {
    if (role !== "admin" || !selectedTimetableId) {
      setTimetableDetails(null);
      return;
    }
    let cancelled = false;
    fetchTimetable(selectedTimetableId)
      .then((result) => { if (!cancelled) setTimetableDetails(result); })
      .catch((caught: unknown) => { if (!cancelled) setError(messageFromError(caught, "loadFailed")); });
    return () => { cancelled = true; };
  }, [role, selectedTimetableId]);

  const activeTimetable = timetableDetails?.id === selectedTimetableId ? timetableDetails : timetables.find((item) => item.id === selectedTimetableId);
  const adminEntries = activeTimetable?.entries ?? [];
  const availablePeriods = useMemo(() => {
    const unique = new Map<string, TimetableEntry["period"]>();
    for (const entry of adminEntries) unique.set(entry.period.id, entry.period);
    return [...unique.values()].sort((a, b) => a.number - b.number);
  }, [adminEntries]);

  const handleGenerate = async () => {
    if (!academicYearId.trim()) { setError("yearRequired"); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await generateTimetableDraft(academicYearId.trim());
      setNotice(result.publishable ? "generated" : "generatedPartial");
      await load();
      if (result.id) setSelectedTimetableId(result.id);
    } catch (caught) {
      setError(messageFromError(caught, "generateFailed"));
    } finally { setBusy(false); }
  };

  const handlePublish = async () => {
    if (!activeTimetable || !window.confirm(t("confirmPublish"))) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await publishTimetable(activeTimetable.id);
      setNotice("published");
      await load();
    } catch (caught) {
      setError(messageFromError(caught, "publishFailed"));
    } finally { setBusy(false); }
  };

  const handleDeleteDraft = async () => {
    if (!activeTimetable || !window.confirm(t("confirmDeleteDraft"))) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await deleteTimetableDraft(activeTimetable.id);
      setNotice("deleted");
      await load();
    } catch (caught) {
      setError(messageFromError(caught, "deleteFailed"));
    } finally { setBusy(false); }
  };

  const handleSaveEntry = async (entry: TimetableEntry) => {
    const change = draftChanges[entry.id] ?? { weekday: entry.weekday, periodId: entry.period.id };
    setBusy(true); setError(""); setNotice("");
    try {
      await updateTimetableEntry(activeTimetable!.id, entry.id, change);
      setNotice("savedConflictCheck");
      setDraftChanges((current) => { const next = { ...current }; delete next[entry.id]; return next; });
      await load();
    } catch (caught) {
      setError(messageFromError(caught, "saveFailed"));
    } finally { setBusy(false); }
  };

  const handleDeleteEntry = async (entry: TimetableEntry) => {
    if (!activeTimetable || !window.confirm(t("confirmDeleteEntry"))) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await deleteTimetableEntry(activeTimetable.id, entry.id);
      setNotice(result.assignment.hasMissingLessons ? "deletedLessonMissing" : "entryDeleted");
      await load();
    } catch (caught) {
      setError(messageFromError(caught, "deleteFailed"));
    } finally { setBusy(false); }
  };

  const dayLabel = (day: TimetableWeekday) => t(`days.${day}`);
  const statusLabel = (status: string) => t(`status.${status}`);
  const subjectName = (entry: TimetableEntry) => isArabic ? entry.assignment.subject.name : entry.assignment.subject.nameEn;
  const className = (entry: TimetableEntry) => isArabic ? entry.assignment.class.name : entry.assignment.class.nameEn;
  const teacherName = (entry: TimetableEntry) => isArabic ? entry.assignment.staff.fullName : entry.assignment.staff.fullNameEn ?? entry.assignment.staff.fullName;
  const sortEntries = (entries: TimetableEntry[]) => [...entries].sort((a, b) => DAYS.indexOf(a.weekday) - DAYS.indexOf(b.weekday) || a.period.number - b.period.number);

  return (
    <section className="space-y-5" aria-busy={loading || busy}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays size={22} aria-hidden="true" /></div>
          <div>
            <h2 className="text-xl font-bold text-navy">{t(`titles.${role}`)}</h2>
            <p className="mt-1 text-sm leading-6 text-mute">{t(`descriptions.${role}`)}</p>
          </div>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading || busy} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold hover:border-brand disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} aria-hidden="true" />{t("refresh")}
        </button>
      </div>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{t(`errors.${error}`, { defaultValue: error })}</span></div>}
      {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{t(`notices.${notice}`)}</span></div>}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-3 rounded-xl border border-line bg-surface text-sm text-mute"><LoaderCircle size={20} className="animate-spin" aria-hidden="true" />{t("loading")}</div>
      ) : role === "guardian" ? (
        <>
          {students.length > 1 && <label className="block max-w-md text-sm font-semibold">{t("selectChild")}<select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface px-3"><option value="">{t("selectChildPlaceholder")}</option>{students.map((child) => <option key={child.id} value={child.id}>{isArabic ? child.fullName : child.fullNameEn}</option>)}</select></label>}
          {guardianData?.timetable ? <TimetableTable entries={sortEntries(guardianData.timetable.entries)} dayLabel={dayLabel} subjectName={subjectName} className={className} teacherName={teacherName} t={t} showClass={false} showTeacher /> : <EmptyState text={t("noPublished")} />}
        </>
      ) : role === "teacher" ? (
        teacherEntries.length ? <TimetableTable entries={sortEntries(teacherEntries)} dayLabel={dayLabel} subjectName={subjectName} className={className} teacherName={teacherName} t={t} showClass showTeacher={false} /> : <EmptyState text={t("noTeacherLessons")} />
      ) : (
        <div className="space-y-5">
          <form onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }} className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="text-sm font-semibold">{t("academicYearId")}<input value={academicYearId} onChange={(event) => setAcademicYearId(event.target.value)} placeholder={t("academicYearPlaceholder")} className="mt-2 min-h-11 w-full rounded-lg border border-line bg-bg px-3 font-normal" /></label>
            <button type="submit" disabled={busy || !academicYearId.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-50"><CalendarDays size={17} aria-hidden="true" />{busy ? t("working") : t("generateDraft")}</button>
            <p className="text-xs leading-5 text-mute sm:col-span-2">{t("academicYearHelp")}</p>
          </form>
          {timetables.length > 0 && <label className="block text-sm font-semibold">{t("chooseTimetable")}<select value={selectedTimetableId} onChange={(event) => { setSelectedTimetableId(event.target.value); setDraftChanges({}); }} className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface px-3">{timetables.map((item) => <option key={item.id} value={item.id}>{isArabic ? item.academicYear?.name ?? item.academicYearId : item.academicYear?.nameEn ?? item.academicYearId} · v{item.version} · {statusLabel(item.status)}</option>)}</select></label>}
          {activeTimetable ? <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
              <div><p className="font-bold">{t("versionLabel", { version: activeTimetable.version })}</p><p className="mt-1 text-sm text-mute">{t("entryCount", { count: activeTimetable.entries?.length ?? activeTimetable._count?.entries ?? 0 })}</p></div>
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${activeTimetable.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-800" : activeTimetable.status === "DRAFT" ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-700"}`}>{statusLabel(activeTimetable.status)}</span>
            </div>
            {activeTimetable.status === "DRAFT" && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void handlePublish()} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"><CheckCircle2 size={17} aria-hidden="true" />{t("approvePublish")}</button><button type="button" onClick={() => void handleDeleteDraft()} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={17} aria-hidden="true" />{t("deleteDraft")}</button></div>}
            {activeTimetable.entries?.length ? <div className="overflow-x-auto rounded-xl border border-line bg-surface"><table className="w-full min-w-[820px] text-start text-sm"><thead className="bg-bg text-xs text-mute"><tr><th className="px-3 py-3">{t("table.day")}</th><th className="px-3 py-3">{t("table.period")}</th><th className="px-3 py-3">{t("table.class")}</th><th className="px-3 py-3">{t("table.subject")}</th><th className="px-3 py-3">{t("table.teacher")}</th>{activeTimetable.status === "DRAFT" && <th className="px-3 py-3">{t("table.actions")}</th>}</tr></thead><tbody className="divide-y divide-line">{sortEntries(activeTimetable.entries).map((entry) => { const change = draftChanges[entry.id] ?? { weekday: entry.weekday, periodId: entry.period.id }; return <tr key={entry.id} className="align-middle"><td className="px-3 py-3">{activeTimetable.status === "DRAFT" ? <select aria-label={t("table.day")} value={change.weekday} onChange={(event) => setDraftChanges((current) => ({ ...current, [entry.id]: { ...change, weekday: event.target.value as TimetableWeekday } }))} className="min-h-9 rounded-md border border-line bg-surface px-2">{DAYS.map((day) => <option key={day} value={day}>{dayLabel(day)}</option>)}</select> : dayLabel(entry.weekday)}</td><td className="px-3 py-3">{activeTimetable.status === "DRAFT" ? <select aria-label={t("table.period")} value={change.periodId} onChange={(event) => setDraftChanges((current) => ({ ...current, [entry.id]: { ...change, periodId: event.target.value } }))} className="min-h-9 rounded-md border border-line bg-surface px-2">{availablePeriods.map((period) => <option key={period.id} value={period.id}>{t("periodLabel", { number: period.number })} · {period.startTime}–{period.endTime}</option>)}</select> : <span className="whitespace-nowrap">{t("periodLabel", { number: entry.period.number })} · {entry.period.startTime}–{entry.period.endTime}</span>}</td><td className="px-3 py-3">{className(entry)}</td><td className="px-3 py-3">{subjectName(entry)}</td><td className="px-3 py-3">{teacherName(entry)}</td>{activeTimetable.status === "DRAFT" && <td className="px-3 py-3"><div className="flex gap-2"><button type="button" onClick={() => void handleSaveEntry(entry)} disabled={busy || (change.weekday === entry.weekday && change.periodId === entry.period.id)} className="inline-flex min-h-9 items-center gap-1 rounded-md bg-navy px-2.5 text-xs font-semibold text-white disabled:opacity-40"><Save size={14} aria-hidden="true" />{t("save")}</button><button type="button" onClick={() => void handleDeleteEntry(entry)} disabled={busy} aria-label={t("deleteEntry")} className="inline-flex min-h-9 items-center rounded-md border border-red-200 px-2.5 text-red-700 hover:bg-red-50 disabled:opacity-40"><Trash2 size={14} aria-hidden="true" /></button></div></td>}</tr>; })}</tbody></table></div> : <EmptyState text={t("noEntries")} />}
          </> : <EmptyState text={t("noTimetables")} />}
        </div>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface px-5 text-center"><CalendarDays size={28} className="text-mute" aria-hidden="true" /><p className="mt-3 text-sm text-mute">{text}</p></div>;
}

function TimetableTable({
  entries, dayLabel, subjectName, className, teacherName, t, showClass, showTeacher,
}: {
  entries: TimetableEntry[];
  dayLabel: (day: TimetableWeekday) => string;
  subjectName: (entry: TimetableEntry) => string;
  className: (entry: TimetableEntry) => string;
  teacherName: (entry: TimetableEntry) => string;
  t: ReturnType<typeof useTranslations<"timetable">>;
  showClass: boolean;
  showTeacher: boolean;
}) {
  return <div className="overflow-x-auto rounded-xl border border-line bg-surface"><table className="w-full min-w-[620px] text-start text-sm"><thead className="bg-bg text-xs text-mute"><tr><th className="px-4 py-3">{t("table.day")}</th><th className="px-4 py-3">{t("table.period")}</th><th className="px-4 py-3">{t("table.subject")}</th>{showClass && <th className="px-4 py-3">{t("table.class")}</th>}{showTeacher && <th className="px-4 py-3">{t("table.teacher")}</th>}</tr></thead><tbody className="divide-y divide-line">{entries.map((entry) => <tr key={entry.id} className="hover:bg-bg/60"><td className="px-4 py-3 font-semibold">{dayLabel(entry.weekday)}</td><td className="px-4 py-3 whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-mute" aria-hidden="true" />{t("periodLabel", { number: entry.period.number })}<span className="text-mute">({entry.period.startTime}–{entry.period.endTime})</span></span></td><td className="px-4 py-3"><p className="font-semibold">{subjectName(entry)}</p></td>{showClass && <td className="px-4 py-3">{className(entry)}</td>}{showTeacher && <td className="px-4 py-3">{teacherName(entry)}</td>}</tr>)}</tbody></table></div>;
}
