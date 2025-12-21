/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ThemeProvider } from "next-themes";
import { LayoutContext } from "@/components/context";
import { useState } from "react";
import defaultTranslations from "@/app/translations/en.json";
import { PortfolioJSON } from "@/types/translations";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] =
    useState<PortfolioJSON>(defaultTranslations);

  const isRTL = language === "ar";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutContext.Provider
        value={{ language, setLanguage, translations, isRTL }}
      >
        <ClientLayoutWrapper />
        {children}
      </LayoutContext.Provider>
    </ThemeProvider>
  );
}
