"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, GraduationCap, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CommsLog } from "@/features/comms/CommsLog";
import {
  createBehaviorRecord,
  createHomework,
  fetchTeacherAssignments,
  fetchTeacherPortal,
  openAttendanceSession,
  saveAttendanceRecords,
  submitAttendanceSession,
  type ApiAttendanceStatus,
  type TeacherAssignment,
  type TeacherQuickPortal,
  type TeacherRosterStudent,
} from "@/lib/api";

type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT"];

export function TeacherQuickBoard() {
  const t = useTranslations("teacherQuick");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [portal, setPortal] = useState<TeacherQuickPortal | null>(null);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [busyStudentId, setBusyStudentId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [submitBusy, setSubmitBusy] = useState(false);
  const [sessionBusy, setSessionBusy] = useState(false);
  const [homeworkBusy, setHomeworkBusy] = useState(false);
  const [error, setError] = useState("");
  const [assignmentError, setAssignmentError] = useState(false);
  const [notice, setNotice] = useState("");
  const [homeworkForm, setHomeworkForm] = useState({
    assignmentId: "",
    title: "",
    dueAt: "",
    notes: "",
    notifyGuardians: true,
  });

  const loadPortal = useCallback(async (requestedLessonId?: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchTeacherPortal(requestedLessonId);
      setPortal(result);
      setSelectedLessonId(result.focusLessonId ?? "");
    } catch {
      setError("load");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAssignments = useCallback(async () => {
    setAssignmentsLoading(true);
    setAssignmentError(false);
    try {
      const result = await fetchTeacherAssignments();
      setAssignments(result);
      setHomeworkForm((current) => ({
        ...current,
        assignmentId: current.assignmentId || result[0]?.assignmentId || "",
      }));
    } catch {
      setAssignmentError(true);
    } finally {
      setAssignmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPortal();
    void loadAssignments();
  }, [loadPortal, loadAssignments]);


  const studentName = (student: TeacherRosterStudent) =>
    isArabic ? student.fullName : student.fullNameEn;

  const startSession = async () => {
    if (!portal?.focusLessonId) return;
    setSessionBusy(true);
    setError("");
    setNotice("");
    try {
      await openAttendanceSession(portal.focusLessonId);
      await loadPortal(portal.focusLessonId);
      setNotice("sessionOpened");
    } catch {
      setError("action");
    } finally {
      setSessionBusy(false);
    }
  };

  const changeStatus = async (studentId: string, status: AttendanceStatus) => {
    if (!portal?.session || portal.session.status !== "OPEN") return;
    setBusyStudentId(studentId);
    setError("");
    setNotice("");
    try {
      const student = portal.roster.find((item) => item.studentId === studentId);
      await saveAttendanceRecords(portal.session.id, [{
        studentId,
        status,
        ...(status !== "ABSENT" ? { arrivedAt: student?.attendance?.arrivedAt ?? new Date().toISOString() } : {}),
      }]);
      setNotice("attendanceSaved");
      await loadPortal(portal.focusLessonId ?? undefined);
    } catch {
      setError("action");
    } finally {
      setBusyStudentId(null);
    }
  };

  const markAllPresent = async () => {
    if (!portal?.session || portal.session.status !== "OPEN" || portal.roster.length === 0) return;
    setBulkBusy(true);
    setError("");
    setNotice("");
    try {
      await saveAttendanceRecords(portal.session.id, portal.roster.map((student) => ({
        studentId: student.studentId,
        status: "PRESENT" as ApiAttendanceStatus,
        arrivedAt: student.attendance?.arrivedAt ?? new Date().toISOString(),
      })));
      setNotice("attendanceSaved");
      await loadPortal(portal.focusLessonId ?? undefined);
    } catch {
      setError("action");
    } finally {
      setBulkBusy(false);
    }
  };

  const submitAttendance = async () => {
    if (!portal?.session || portal.session.status !== "OPEN" || portal.summary.unmarked > 0) return;
    if (!window.confirm(t("integration.submitConfirm"))) return;
    setSubmitBusy(true);
    setError("");
    setNotice("");
    try {
      await submitAttendanceSession(portal.session.id);
      setNotice("attendanceSubmitted");
      await loadPortal(portal.focusLessonId ?? undefined);
    } catch {
      setError("action");
    } finally {
      setSubmitBusy(false);
    }
  };

  const addBehavior = async (studentId: string, categoryId: string) => {
    setBusyStudentId(studentId);
    setError("");
    setNotice("");
    try {
      await createBehaviorRecord({
        studentId,
        categoryId,
        ...(portal?.session ? { sessionId: portal.session.id } : {}),
      });
      setNotice("behaviorSaved");
      await loadPortal(portal?.focusLessonId ?? undefined);
    } catch {
      setError("action");
    } finally {
      setBusyStudentId(null);
    }
  };

  const submitHomework = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHomeworkBusy(true);
    setError("");
    setNotice("");
    try {
      if (!homeworkForm.assignmentId || !homeworkForm.title.trim() || !homeworkForm.dueAt) {
        setError("homework");
        return;
      }
      const dueAt = new Date(homeworkForm.dueAt);
      if (Number.isNaN(dueAt.getTime()) || dueAt.getTime() <= Date.now()) {
        setError("homework");
        return;
      }
      const result = await createHomework({
        assignmentId: homeworkForm.assignmentId,
        title: homeworkForm.title.trim(),
        dueAt: dueAt.toISOString(),
        notes: homeworkForm.notes.trim() || undefined,
        notifyGuardians: homeworkForm.notifyGuardians,
      });
      setNotice(`homework:${result.queuedNotifications}`);
      setHomeworkForm((current) => ({ ...current, title: "", dueAt: "", notes: "" }));
    } catch {
      setError("homework");
    } finally {
      setHomeworkBusy(false);
    }
  };

  const focusedLesson = portal?.lessons.find((lesson) => lesson.timetableEntryId === portal.focusLessonId);
  const isSubmitted = portal?.session?.status === "SUBMITTED";
  const sessionOpen = portal?.session?.status === "OPEN";

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-soft text-brand">
                <GraduationCap size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold">{portal ? (isArabic ? portal.teacher.fullName : portal.teacher.fullNameEn ?? portal.teacher.fullName) : t("integration.teacher")}</h2>
                <p className="mt-1 text-sm text-mute">{portal ? `${portal.now.date} · ${portal.now.time} · ${portal.now.timezone}` : t("integration.loading")}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => void loadPortal(selectedLessonId || undefined)} disabled={loading}>
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />
              <span className="ms-2">{t("integration.refresh")}</span>
            </Button>
          </div>

          {portal && portal.lessons.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <label className="block text-sm font-semibold">
                {t("integration.selectLesson")}
                <select
                  value={selectedLessonId}
                  onChange={(event) => void loadPortal(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm font-normal text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  {portal.lessons.map((lesson) => (
                    <option key={lesson.timetableEntryId} value={lesson.timetableEntryId}>
                      {lesson.period.number}. {isArabic ? lesson.subject.name : lesson.subject.nameEn} — {isArabic ? lesson.class.name : lesson.class.nameEn} ({lesson.period.startTime}–{lesson.period.endTime})
                    </option>
                  ))}
                </select>
              </label>
              {focusedLesson && (
                <div className="rounded-lg bg-bg px-3 py-2 text-sm text-mute">
                  <p className="font-semibold text-ink">{isArabic ? focusedLesson.class.grade : focusedLesson.class.gradeEn}</p>
                  <p className="mt-0.5">{isArabic ? focusedLesson.subject.name : focusedLesson.subject.nameEn}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {loading ? (
          <div className="rounded-xl border border-line bg-surface p-8 text-sm text-mute" aria-busy="true">{t("integration.loading")}</div>
        ) : error === "load" ? (
          <section className="rounded-xl border border-line bg-surface p-8 text-center" role="alert">
            <p className="text-sm text-bad">{t("integration.loadError")}</p>
            <Button className="mt-4" onClick={() => void loadPortal(selectedLessonId || undefined)}>{t("integration.retry")}</Button>
          </section>
        ) : !portal || !portal.focusLessonId ? (
          <section className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-mute">{t("integration.noLessons")}</section>
        ) : (
          <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold">{t("integration.roster")}</h2>
                <p className="mt-1 text-sm text-mute">{t("attendance.rosterCount", { shown: portal.roster.length, total: portal.summary.total })}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-ok-bg px-2.5 py-1.5 text-ok">{t("integration.present")}: {portal.summary.present}</span>
                <span className="rounded-md bg-warn-bg px-2.5 py-1.5 text-warn">{t("integration.late")}: {portal.summary.late}</span>
                <span className="rounded-md bg-bad-bg px-2.5 py-1.5 text-bad">{t("integration.absent")}: {portal.summary.absent}</span>
                <span className="rounded-md bg-bg px-2.5 py-1.5 text-mute">{t("status.all")}: {portal.summary.unmarked} {isArabic ? "غير مسجل" : "unmarked"}</span>
              </div>
            </div>

            {isSubmitted && (
              <p className="mt-4 rounded-lg bg-ok-bg px-3 py-2 text-sm text-ok">{t("integration.sessionSubmitted")}</p>
            )}

            {portal.roster.length === 0 ? (
              <p className="py-8 text-center text-sm text-mute">{t("integration.noLessons")}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {portal.roster.map((student) => (
                  <li key={student.studentId} className="py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold">{studentName(student)}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-mute">
                          <Clock3 size={13} aria-hidden="true" />
                          {student.attendance?.arrivedAt
                            ? new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", { hour: "numeric", minute: "2-digit" }).format(new Date(student.attendance.arrivedAt))
                            : student.attendance?.status === "ABSENT" ? t("integration.absent") : t("integration.points") + ": " + student.points}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={!sessionOpen || busyStudentId === student.studentId || bulkBusy || submitBusy}
                            aria-pressed={student.attendance?.status === status}
                            onClick={() => void changeStatus(student.studentId, status)}
                            className={`min-h-9 rounded-lg border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${student.attendance?.status === status ? status === "PRESENT" ? "border-ok bg-ok-bg text-ok" : status === "LATE" ? "border-warn bg-warn-bg text-warn" : "border-bad bg-bad-bg text-bad" : "border-line bg-surface text-mute hover:bg-bg"}`}
                          >
                            {t(`status.${status.toLowerCase()}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="me-1 text-xs font-semibold text-mute">{t("integration.behaviorCategories")}:</span>
                      {portal.behaviorCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          disabled={busyStudentId === student.studentId}
                          onClick={() => void addBehavior(student.studentId, category.id)}
                          title={isArabic ? category.name : category.nameEn}
                          className={`min-h-8 rounded-full border px-3 text-xs font-medium transition-colors disabled:opacity-50 ${category.kind === "POSITIVE" ? "border-line text-ok hover:bg-ok-bg" : "border-line text-bad hover:bg-bad-bg"}`}
                        >
                          {isArabic ? category.name : category.nameEn} ({category.points > 0 ? "+" : ""}{category.points})
                        </button>
                      ))}
                      <span className="ms-auto rounded-md bg-soft px-2.5 py-1 text-xs font-bold text-brand">{t("integration.points")}: {student.points}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-between">
              {!portal.session ? (
                <Button onClick={() => void startSession()} disabled={sessionBusy || !portal.focusLessonId}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span className="ms-2">{sessionBusy ? t("integration.loading") : t("integration.openSession")}</span>
                </Button>
              ) : sessionOpen ? (
                <>
                  <Button variant="ghost" onClick={() => void markAllPresent()} disabled={bulkBusy || submitBusy || portal.roster.length === 0}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span className="ms-2">{bulkBusy ? t("integration.loading") : t("integration.markAllPresent")}</span>
                  </Button>
                  <Button onClick={() => void submitAttendance()} disabled={submitBusy || portal.summary.unmarked > 0}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span className="ms-2">{submitBusy ? t("integration.loading") : t("integration.submitAttendance")}</span>
                  </Button>
                </>
              ) : null}
            </div>
          </section>
        )}

        {notice && (
          <p role="status" className="rounded-lg border border-ok/20 bg-ok-bg px-3 py-2 text-sm text-ok">
            {notice === "sessionOpened" ? t("integration.sessionOpened")
              : notice === "attendanceSaved" ? t("integration.attendanceSaved")
              : notice === "attendanceSubmitted" ? t("integration.attendanceSubmitted")
              : notice === "behaviorSaved" ? t("integration.behaviorSaved")
              : notice.startsWith("homework:") ? t("integration.homeworkCreated", { count: Number(notice.split(":")[1]) })
              : ""}
          </p>
        )}
        {error === "action" && <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">{t("integration.saveError")}</p>}
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-soft text-brand"><BookOpen size={18} aria-hidden="true" /></div>
            <div>
              <h2 className="font-bold">{t("homework.title")}</h2>
              <p className="mt-1 text-xs text-mute">{t("homework.fieldNotes")}</p>
            </div>
          </div>
          {assignmentsLoading ? (
            <p className="py-4 text-sm text-mute">{t("integration.loading")}</p>
          ) : assignmentError ? (
            <p role="alert" className="rounded-lg bg-bad-bg p-3 text-sm text-bad">{t("integration.homeworkError")}</p>
          ) : assignments.length === 0 ? (
            <p className="py-4 text-sm text-mute">{t("integration.noAssignments")}</p>
          ) : (
            <form onSubmit={(event) => void submitHomework(event)} className="space-y-3">
              <label className="block text-sm font-semibold">
                {t("integration.homeworkAssignment")}
                <select
                  required
                  value={homeworkForm.assignmentId}
                  onChange={(event) => setHomeworkForm((current) => ({ ...current, assignmentId: event.target.value }))}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">{t("integration.chooseAssignment")}</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.assignmentId} value={assignment.assignmentId}>
                      {isArabic ? assignment.class.name : assignment.class.nameEn} — {isArabic ? assignment.subject.name : assignment.subject.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {t("homework.fieldTitle")}
                <input
                  required
                  maxLength={200}
                  value={homeworkForm.title}
                  onChange={(event) => setHomeworkForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block text-sm font-semibold">
                {t("integration.dueAt")}
                <input
                  required
                  type="datetime-local"
                  value={homeworkForm.dueAt}
                  min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                  onChange={(event) => setHomeworkForm((current) => ({ ...current, dueAt: event.target.value }))}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block text-sm font-semibold">
                {t("integration.notes")}
                <textarea
                  maxLength={2000}
                  value={homeworkForm.notes}
                  onChange={(event) => setHomeworkForm((current) => ({ ...current, notes: event.target.value }))}
                  className="mt-1.5 min-h-20 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm font-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={homeworkForm.notifyGuardians}
                  onChange={(event) => setHomeworkForm((current) => ({ ...current, notifyGuardians: event.target.checked }))}
                  className="mt-1 size-4 accent-brand"
                />
                <span>{t("integration.notifyGuardians")}</span>
              </label>
              {error === "homework" && <p role="alert" className="text-sm text-bad">{t("integration.homeworkError")}</p>}
              <Button type="submit" className="w-full" disabled={homeworkBusy || assignments.length === 0}>
                {homeworkBusy ? t("integration.loading") : t("integration.createHomework")}
              </Button>
            </form>
          )}
        </section>
        <CommsLog />
      </aside>
    </div>
  );
}
