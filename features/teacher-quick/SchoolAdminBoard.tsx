import { getTranslations } from "next-intl/server";
import { CommsLog } from "@/features/comms/CommsLog";

export async function SchoolAdminBoard() {
  const t = await getTranslations("teacherQuick.integration");
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold">{t("adminPortalTitle")}</h2>
        <p className="mt-2 text-sm leading-6 text-mute">{t("adminPortalDescription")}</p>
      </section>
      <CommsLog />
    </div>
  );
}
