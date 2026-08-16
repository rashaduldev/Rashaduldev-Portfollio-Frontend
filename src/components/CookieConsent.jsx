"use client";

import { useState, useEffect, useContext } from "react";
import { LayoutContext } from "@/components/context";
import { useRouter } from "next/navigation";
import AppButton from "@/components/Common/AppButton";
import BlobsButton from "./Common/Blobsbutton";
import Link from "next/link";

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
        <BlobsButton asChild onClick={acceptCookies}
          variant="default"
          className="px-5 py-1"
        >
          {translations.cookieConsent.accept}
              </BlobsButton>
               <BlobsButton onClick={goToTerms} asChild
          variant="default"
          className="px-5 py-1"
        >
          <Link href="/cookies-policy" className="w-full h-full flex items-center justify-center">
          {translations.cookieConsent.terms || "Terms & Conditions"}
          </Link>
              </BlobsButton>
      </div>
    </div>
  );
};

export default CookieConsent;
