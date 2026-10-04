"use client";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";

export const POINT_ACTIONS: StaffPointAction[] = [
  { id: "participation", delta: 5 },
  { id: "homework", delta: 5 },
  { id: "distraction", delta: -3 },
];

export function PointChips({ points, onAction }: { points: number; onAction: (a: StaffPointAction) => void }) {
  const t = useTranslations("teacherQuick.points");
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
      <span className="min-w-14 rounded-full bg-soft px-2.5 py-0.5 text-center font-bold">{t("count", { count: points })}</span>
      {POINT_ACTIONS.map((a) => <Chip key={a.id} tone={a.delta > 0 ? "pos" : "neg"} onClick={() => onAction(a)}>{t(a.id)}</Chip>)}
    </div>
  );
}
