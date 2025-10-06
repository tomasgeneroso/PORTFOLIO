"use client";
import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { locales, localeNames, localeFlags, Locale } from "@/lib/i18n/locales";

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
          text-gray-700 bg-amber-100 ring-1 ring-amber-100
          hover:bg-white focus:ring-4 focus:outline-white focus:ring-amber-100
          dark:bg-[#3D2548] dark:text-gray-300 dark:ring-[#777272]
          dark:hover:ring-[#777272] dark:hover:bg-[#777272]
          transition-all duration-300"
        aria-label="Select language"
      >
        <span className="text-sm font-medium uppercase">
          {locale}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50
              bg-amber-50 dark:bg-[#2B1A33]
              border border-amber-200 dark:border-[#777272]
              overflow-hidden"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left
                  transition-all duration-200
                  ${
                    locale === loc
                      ? "bg-amber-100 dark:bg-[#3D2548] text-gray-900 dark:text-gray-100 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-amber-100/50 dark:hover:bg-[#3D2548]/50"
                  }`}
              >
                <span className="text-xl">{localeFlags[loc]}</span>
                <span className="text-sm">{localeNames[loc]}</span>
                {locale === loc && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-auto text-gray-700 dark:text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
