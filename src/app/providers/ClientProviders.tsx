"use client";

import { useState, useEffect, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { LayoutContext } from "@/components/context";
import defaultTranslations from "@/app/translations/en.json";
import { PortfolioJSON } from "@/types/translations";
import { SessionExpiredError } from "@/lib/errors";
import SessionExpiredDialog from "../../components/Common/SessionExpiredDialog";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
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

  // --- React Query / Session Expired ---
  const [sessionExpired, setSessionExpired] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
            networkMode: "always",
          },
          mutations: {
            networkMode: "always",
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              setSessionExpired(true);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              setSessionExpired(true);
            }
          },
        }),
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutContext.Provider
        value={{ language, setLanguage, translations, isRTL }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <SessionExpiredDialog open={sessionExpired} />
        </QueryClientProvider>
      </LayoutContext.Provider>
    </ThemeProvider>
  );
}
