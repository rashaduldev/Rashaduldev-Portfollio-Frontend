"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInitializer() {
  useEffect(() => {
    // 1. Initialize AOS without injecting global classes on startup
    AOS.init({
      duration: 800,
      once: true,
      // Prevents AOS from injecting `aos-init` synchronously before hydration finishes
      initClassName: "aos-init",
      animatedClassName: "aos-animate",
    });

    // 2. Refresh AOS after React has completely painted and hydrated
    const timeout = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}