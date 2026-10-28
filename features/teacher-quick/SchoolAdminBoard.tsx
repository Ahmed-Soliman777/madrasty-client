"use client";

import { useState } from "react";
import { CalendarDays, MessageSquareText } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommsLog } from "@/features/comms/CommsLog";
import { AdminTimetableManager } from "@/features/timetable/AdminTimetableManager";

export function SchoolAdminBoard() {
  const t = useTranslations("teacherQuick.integration");
  const timetableT = useTranslations("timetable");
  const [activeTab, setActiveTab] = useState<"timetable" | "comms">("timetable");

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label={timetableT("adminTabsLabel")} className="flex gap-2 overflow-x-auto border-b border-line">
        <button type="button" role="tab" aria-selected={activeTab === "timetable"} onClick={() => setActiveTab("timetable")} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${activeTab === "timetable" ? "border-brand text-brand" : "border-transparent text-mute hover:text-ink"}`}>
          <CalendarDays size={16} aria-hidden="true" />{timetableT("adminTab")}
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "comms"} onClick={() => setActiveTab("comms")} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${activeTab === "comms" ? "border-brand text-brand" : "border-transparent text-mute hover:text-ink"}`}>
          <MessageSquareText size={16} aria-hidden="true" />{t("adminPortalTitle")}
        </button>
      </div>
      {activeTab === "timetable" ? <AdminTimetableManager /> : (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-lg font-bold">{t("adminPortalTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-mute">{t("adminPortalDescription")}</p>
          </section>
          <CommsLog />
        </div>
      )}
    </div>
  );
}
