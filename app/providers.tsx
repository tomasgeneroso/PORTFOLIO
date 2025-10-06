"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { VisitTracker } from "@/app/analytics/analytics";
import { ConnectionIndicator } from "@/components/ConnectionIndicator";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider navigate={router.push}>
        <VisitTracker />
        <ConnectionIndicator />
        <div className="min-h-screen">{children}</div>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
