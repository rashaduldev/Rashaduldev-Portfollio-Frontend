/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { PortfolioJSON } from "@/types/translations";
import defaultTranslations from "@/app/translations/en.json";
import { usePathname } from "next/navigation";
import NormalRoute from "./NormalRoute/NormalRoute";

export default function ClientLayoutWrapper() {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<PortfolioJSON>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isRTL = language === "ar";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadTranslation = async () => {
      try {
        setIsLoading(true);
        const translationModule = (await import(
          `@/app/translations/${language}.json`
        )) as { default: PortfolioJSON };
        setTranslations(translationModule.default);
      } catch {
        setTranslations(defaultTranslations);
      } finally {
        setIsLoading(false);
      }
    };
    loadTranslation();
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);

  if (!isMounted || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    
        <>
        
        <main className="bg-white/60 text-gray-900 dark:bg-black/70 dark:text-gray-100">
          {isHome && <NormalRoute />}
        </main>
        </>
     
  );
}
