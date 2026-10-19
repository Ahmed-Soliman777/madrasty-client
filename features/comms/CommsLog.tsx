"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  fetchComms,
  type CommunicationLogItem,
  type NotificationStatus,
} from "@/lib/api";

const statuses: (NotificationStatus | "")[] = [
  "",
  "PENDING",
  "SENDING",
  "SENT",
  "FAILED",
  "CANCELLED",
];

export function CommsLog() {
  const t = useTranslations("teacherQuick.comms");
  const locale = useLocale();
  const [items, setItems] = useState<CommunicationLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<NotificationStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const result = await fetchComms({ page, status });
      setItems(result.items);
      setTotalPages(result.pagination.totalPages);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message === "AUTH_REQUIRED"
          ? "auth"
          : "load",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const heading = (item: CommunicationLogItem) => {
    if (item.type === "STUDENT_ABSENT") {
      return t("absenceHeading", {
        student: locale === "ar"
          ? item.student?.name ?? t("unknownStudent")
          : item.student?.nameEn ?? t("unknownStudent"),
      });
    }
    return t("homeworkHeading", {
      title: item.homework?.title ?? t("unknownHomework"),
      subject: locale === "ar"
        ? item.homework?.subjectName ?? ""
        : item.homework?.subjectNameEn ?? "",
    });
  };

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold">{t("title")}</h2>
        <button
          type="button"
          onClick={() => void load(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? t("refreshing") : t("refresh")}
        </button>
      </div>

      <label className="mb-3 flex items-center gap-2 text-sm text-mute">
        <span>{t("filterStatus")}</span>
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as NotificationStatus | "");
          }}
          className="min-w-0 rounded-lg border border-line bg-bg px-2 py-1.5 text-ink"
        >
          {statuses.map((value) => (
            <option key={value || "ALL"} value={value}>
              {value ? t(`status.${value}`) : t("allStatuses")}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">
          {error === "auth" ? t("authError") : t("loadError")}
        </p>
      )}

      {loading && !refreshing ? (
        <p className="py-6 text-sm text-mute">{t("loading")}</p>
      ) : !error && items.length === 0 ? (
        <p className="py-6 text-sm text-mute">{t("empty")}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="border-t border-line py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <b>{heading(item)}</b>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === "SENT"
                      ? "bg-ok-bg text-ok"
                      : item.status === "FAILED"
                        ? "bg-bad-bg text-bad"
                        : item.status === "CANCELLED"
                          ? "bg-bg text-mute"
                          : "bg-warn-bg text-warn"
                  }`}
                >
                  {t(`status.${item.status}`)}
                </span>
              </div>
              <small className="mt-1 block text-mute">
                {t(`type.${item.type}`)} · {t("channelWhatsApp")} ·{" "}
                {dateFormatter.format(new Date(item.createdAt))}
              </small>
              <small className="mt-1 block text-mute">
                {t("attempts", { count: item.attempts })}
                {item.sentAt
                  ? ` · ${t("sentAt", { date: dateFormatter.format(new Date(item.sentAt)) })}`
                  : ""}
              </small>
              {item.status === "FAILED" && (
                <small className="mt-1 block font-medium text-rose-700">
                  {t("failureReason")}
                </small>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40"
          >
            {t("previous")}
          </button>
          <span className="text-mute">{t("page", { page, totalPages })}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40"
          >
            {t("next")}
          </button>
        </div>
      )}
    </section>
  );
}
