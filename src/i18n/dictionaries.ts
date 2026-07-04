import type { Dictionary } from "./types";

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./locales/en.json").then((m) => m.default),
  id: () => import("./locales/id.json").then((m) => m.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";
