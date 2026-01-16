"use client";

import { useState, useEffect, useContext } from "react";
import { LayoutContext } from "@/components/context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const CookieConsent = () => {
  const context = useContext(LayoutContext);
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    try {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === "accepted") {
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch {
      // Silently fail without logging
    }
  }, [hasMounted]);

  const acceptCookies = () => {
    try {
      localStorage.setItem("cookieConsent", "accepted");
      setVisible(false);
    } catch {
      // Silently fail without logging
    }
  };

  const goToTerms = () => {
    router.push("/cookies-policy");
  };

  if (!context || !visible) return null;

  const { translations, isRTL } = context;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg rounded-lg p-6 z-50 transition-all duration-300"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
    >
      <h2 className="text-xl font-semibold mb-2">
        {translations.cookieConsent.title}
      </h2>
      <p className="mb-4 text-sm">{translations.cookieConsent.message}</p>
      <div
        className={`flex flex-wrap gap-3 ${
          isRTL ? "justify-start flex-row-reverse" : "justify-between"
        }`}
      >
        <Button
          onClick={acceptCookies}
          className="bg-primary hover:bg-primary text-white dark:bg-primary dark:hover:bg-primary dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {translations.cookieConsent.accept}
        </Button>

        <Button
          onClick={goToTerms}
          className="bg-gray-700 hover:bg-gray-800 text-white dark:bg-gray-200 dark:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
        >
          {translations.cookieConsent.terms || "Terms & Conditions"}
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
