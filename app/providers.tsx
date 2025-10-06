"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { VisitTracker } from "@/app/analytics/analytics";
import { ConnectionIndicator } from "@/components/ConnectionIndicator";
import { I18nProvider } from "@/lib/i18n/context";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider navigate={router.push}>
        <I18nProvider>
          <VisitTracker />
          <ConnectionIndicator />
          <div className="min-h-screen">{children}</div>
        </I18nProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
