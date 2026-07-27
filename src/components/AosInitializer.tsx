"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInitializer() {
  useEffect(() => {
    const initializeAos = () => {
      window.requestAnimationFrame(() => {
        AOS.init({
          duration: 800,
          once: true,
        });
      });
    };

    // AOS mutates `data-aos` elements. Waiting until the page has loaded
    // prevents those mutations from racing React hydration.
    if (document.readyState === "complete") {
      initializeAos();
      return;
    }

    window.addEventListener("load", initializeAos, { once: true });

    return () => window.removeEventListener("load", initializeAos);
  }, []);

  return null; 
}
