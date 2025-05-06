"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider navigate={router.push}>
        <div className="min-h-screen bg-white dark:bg-[#3D2548]">
          {children}
        </div>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
