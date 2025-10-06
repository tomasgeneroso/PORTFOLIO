"use client";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

export function LanguageMetadata() {
  const { locale } = useI18n();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
