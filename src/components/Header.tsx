"use client";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutContext } from "./context"; 
import UtilityControls from "./Home/UtilityControls";
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
    // Handle header shadow/background on scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll progress effect
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);
  
  const getLabel = (key: keyof HeaderSection, fallback: string) => {
    return translations?.header?.[key] || fallback;
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-9999 h-1.25 bg-transparent">
        <div
          className="h-full transition-all duration-100 ease-linear bg-[#3f4144] dark:bg-primary"
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
        <div className="flex items-center justify-between py-1 section-container">
          {/* 1. Logo (Left) */}
          <div className="shrink-0">
            <Link href="/">
              <Image 
                src="https://res.cloudinary.com/de8yddexc/image/upload/v1765567136/vwleekmngplrdpdo1q9s.svg" 
                width={100} 
                height={20} 
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

            {/* Desktop Utility Controls */}
            <div className="hidden md:flex">
                <UtilityControls />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full overflow-hidden absolute top-full left-0 bg-white shadow-xl md:hidden dark:bg-gray-900"
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