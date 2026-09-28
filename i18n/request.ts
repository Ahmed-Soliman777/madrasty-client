import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale ?? routing.defaultLocale;

  const messageLoaders = {
    en: () => import("../messages/en.json"),
    ar: () => import("../messages/ar.json"),
  };

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
  };
});
