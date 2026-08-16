"use client";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutContext } from "./context"; 
import UtilityControls from "./Home/UtilityControls";
import DayNightToggle from "./Home/DayNightToggle";
import { HeaderSection } from "@/types/translations";

type PortfolioJSON = {
    header: HeaderSection;
    [key: string]: unknown;
};
interface LayoutContextType {
    language: string;
    setLanguage: (lang: string) => void;
    translations: PortfolioJSON | null;
    isRTL: boolean;
}

const navLinks = [
  {
    id: "home",
    href: "/",
    labelKey: "home", 
  },
  {
    id: "projects",
    href: "/projects",
    labelKey: "projects", 
  },
  {
    id: "contact",
    href: "/contact",
    labelKey: "contact", 
  },
  {
    id: "github",
    href: "/github",
    labelKey: "github", 
  },
  {
    id: "articles",
    href: "/articles",
    labelKey: "articles", 
  },
];

export default function Header() {
  const context = useContext(LayoutContext) as LayoutContextType | null; 

  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider"
    );
  }
  const { translations } = context; 

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let rafId = 0;
    let lastProgress = -1;

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Only re-render when the value changed by ~1% — caps re-renders at ~100/full scroll.
        const rounded = Math.round(progress);
        if (rounded !== lastProgress) {
          lastProgress = rounded;
          setScrollProgress(rounded);
        }
        setScrolled(scrollTop > 20);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  
  const getLabel = (key: keyof HeaderSection, fallback: string) => {
    return translations?.header?.[key] || fallback;
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-9999 h-1.25 bg-transparent">
        <div
          className="h-full transition-all duration-100 ease-linear bg-(--text-primary) dark:bg-primary"
          style={{
            width: `${scrollProgress}%`,
            opacity: scrollProgress > 0 && scrollProgress < 100 ? 1 : 0, 
          }}
        />
      </div>

      <header
        className={`w-full fixed top-0 z-50 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-md"
            : ""
        }`}
      >
        <div className="flex items-center justify-between py-2 section-container">
          {/* Logo (Left) */}
          <div className="shrink-0">
            <Link href="/">
              <Image 
                src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg" 
                width={110}
                height={18}
                // style={{ width: 140, height: 28 }}
                alt={getLabel("brand", "My Brand Logo")}
                priority
              />
            </Link>
          </div>
          
          <div className="grow hidden md:block" />
          
          <div className="flex items-center gap-4 md:gap-10">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex">
              <div className="flex gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`hover:text-primary transition-colors duration-200 ${
                      pathname === link.href ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {getLabel(link.labelKey as keyof HeaderSection, link.labelKey)}
                  </Link>
                ))}
              </div>
            </nav>

            <DayNightToggle size={36} />

            {/* Desktop Utility Controls */}
            <div className="hidden md:flex">
                <UtilityControls />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="relative h-10 w-10"
              >
                <span className="sr-only">Toggle navigation menu</span>
                <span
                  aria-hidden="true"
                  className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
                    isMobileMenuOpen
                      ? "translate-y-0 rotate-45"
                      : "-translate-y-1.5"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out ${
                    isMobileMenuOpen ? "scale-x-0 opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
                    isMobileMenuOpen
                      ? "translate-y-0 -rotate-45"
                      : "translate-y-1.5"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      {/* mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full absolute top-full left-0 bg-white shadow-xl md:hidden dark:bg-gray-900"
            >
              <div className="section-container">
                <div className="flex flex-col py-4">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        className={`block py-2 px-3 text-base transition-colors duration-200 rounded-md ${
                          pathname === link.href 
                            ? "text-primary font-semibold bg-primary/10 dark:bg-primary/20" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getLabel(link.labelKey as keyof HeaderSection, link.labelKey)}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Utility Controls */}
                  <UtilityControls isMobile={true} /> 
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
