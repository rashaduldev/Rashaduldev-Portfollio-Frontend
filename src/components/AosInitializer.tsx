"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInitializer() {
  useEffect(() => {
    // AOS mutates every `data-aos` element by adding classes. Defer that DOM
    // mutation until after React has had time to hydrate the whole page,
    // including its streamed/Suspense boundaries.
    const timeout = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
      });
      AOS.refresh();
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
