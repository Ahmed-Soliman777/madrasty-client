import type { Teacher, Period } from "@/types/types";
export function PageHeader({ teacher, period }: { teacher: Teacher; period: Period }) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-[22px] font-bold">{teacher.name}</h1><p className="text-sm text-mute">{teacher.subject} · {teacher.classLabel}</p></div>
      <div role="status" className="rounded-2xl bg-navy px-5 py-3 text-white">
        <b className="block"><span className="me-1.5 inline-block size-2 rounded-full bg-[#3ddc97]" />{period.label}</b>
        <small className="opacity-85">{period.time} · {period.classroom}</small>
      </div>
    </header>
  );
}
