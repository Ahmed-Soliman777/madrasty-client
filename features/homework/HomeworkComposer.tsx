"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const field = "w-full rounded-xl border border-line bg-bg px-3 py-2";

export function HomeworkComposer({ onSent }: { onSent: (title: string) => void }) {
  const t = useTranslations("teacherQuick.homework");
  const tt = useTranslations("teacherQuick.toast");
  const toast = useToast();
  const initial = { title: t("defaultTitle"), due: t("defaultDue"), notes: t("defaultNotes") };
  const [d, setD] = useState(initial);
  const set = (k: keyof typeof d) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });

  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-2 text-base font-bold">{t("title")}</h2>
      <label className="mt-2 block text-[13px] text-mute">{t("fieldTitle")}<input className={field} value={d.title} onChange={set("title")} /></label>
      <label className="mt-2 block text-[13px] text-mute">{t("fieldDue")}<input className={field} value={d.due} onChange={set("due")} /></label>
      <label className="mt-2 block text-[13px] text-mute">{t("fieldNotes")}<textarea className={`${field} min-h-20`} value={d.notes} onChange={set("notes")} /></label>
      <div className="mt-3 flex gap-2.5">
        <Button className="flex-1" onClick={() => { toast(tt("homeworkSent")); onSent(d.title); }}>{t("send")}</Button>
        <Button variant="ghost" onClick={() => setD(initial)}>{t("cancel")}</Button>
      </div>
    </section>
  );
}
