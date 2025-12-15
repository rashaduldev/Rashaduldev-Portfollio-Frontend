import React, { useEffect, useState, useContext } from "react";
import { ArrowUp } from "lucide-react";
import { LayoutContext } from "./context";

const ScrollToTopWithProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }

  const { isRTL } = context;

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    setScrollProgress(progress);
    setIsVisible(scrollTop > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 z-50 w-14 h-14 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex items-center justify-center group transition-transform hover:scale-110 ${
          isRTL ? "left-6" : "right-6"
        }`}
        aria-label="Scroll to top"
      >
        {/* Progress Layer with Wave */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          <div
            className="w-full relative"
            style={{ height: `${scrollProgress}%` }}
          >
            {/* Wave SVG */}
            <svg
              className="absolute bottom-0 w-full h-4 animate-wave"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20 Q 25 0 50 20 T 100 20 V 100 H 0 Z"
                fill="#fb923c"
                opacity="0.6"
              />
            </svg>
            <div className="bg-primary w-full h-full"></div>
          </div>
        </div>

        {/* Icon Layer */}
        <ArrowUp className="relative z-10 w-5 h-5 transition-colors duration-200 group-hover:text-black dark:group-hover:text-gray-100" />
      </button>
    )
  );
};

export default ScrollToTopWithProgress;
