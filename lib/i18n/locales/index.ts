import { en } from "./en";
import { es } from "./es";
import { it } from "./it";
import { fr } from "./fr";
import { de } from "./de";

export const translations = {
  en,
  es,
  it,
  fr,
  de,
} as const;

export type Locale = keyof typeof translations;

export const locales: Locale[] = ["en", "es", "it", "fr", "de"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  it: "🇮🇹",
  fr: "🇫🇷",
  de: "🇩🇪",
};
