"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale } from "./locales";
import type { TranslationKeys } from "./locales/en";

interface TranslatorContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translator: TranslationKeys;
  t: TranslationKeys;
}

const TranslatorContext = createContext<TranslatorContextType | undefined>(undefined);

export function TranslatorProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const translator = translations[locale];
  const t = translator; // Alias for backward compatibility

  if (!mounted) {
    // Prevent hydration mismatch by returning default locale during SSR
    return (
      <TranslatorContext.Provider
        value={{
          locale: "en",
          setLocale,
          translator: translations.en,
          t: translations.en,
        }}
      >
        {children}
      </TranslatorContext.Provider>
    );
  }

  return (
    <TranslatorContext.Provider value={{ locale, setLocale, translator, t }}>
      {children}
    </TranslatorContext.Provider>
  );
}

export function useTranslator() {
  const context = useContext(TranslatorContext);
  if (context === undefined) {
    throw new Error("useTranslator must be used within a TranslatorProvider");
  }
  return context;
}

// Backward compatibility
export const I18nProvider = TranslatorProvider;
export const useI18n = useTranslator;
