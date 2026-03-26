"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import defaultTranslations from "@/app/translations/en.json";
import { PortfolioJSON } from "@/types/translations";
import { LayoutContext } from "../context";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] =
    useState<PortfolioJSON>(defaultTranslations);

  const isRTL = language === "ar";

  useEffect(() => {
    const loadTranslation = async () => {
      try {
        const data = await import(`@/app/translations/${language}.json`);
        setTranslations(data.default);
      } catch {
        setTranslations(defaultTranslations);
      }
    };
    loadTranslation();
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutContext.Provider
        value={{ language, setLanguage, translations, isRTL }}
      >
        {children}
      </LayoutContext.Provider>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
