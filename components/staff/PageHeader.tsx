import { useTranslations } from "next-intl";

export function PageHeader() {
  const t = useTranslations("teacherQuick.header");
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-bold">{t("teacherName")}</h1>
        <p className="text-sm text-mute">{t("subtitle")}</p>
      </div>
      <div role="status" className="rounded-2xl bg-navy px-5 py-3 text-white">
        <b className="block"><span className="me-1.5 inline-block size-2 rounded-full bg-[#3ddc97]" />{t("period")}</b>
        <small className="opacity-85">{t("periodTime")}</small>
      </div>
    </header>
  );
}
