"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInitializer() {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const initialize = () => {
      // Waiting until the load event prevents AOS from mutating streamed HTML
      // while React is still hydrating it.
      timeout = setTimeout(() => {
        AOS.init({ duration: 800, once: true });
        AOS.refresh();
      }, 2000);
    };

    if (document.readyState === "complete") initialize();
    else window.addEventListener("load", initialize, { once: true });

    return () => {
      window.removeEventListener("load", initialize);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return null;
}
