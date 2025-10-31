"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { LayoutContext } from "./context";
import { usePathname } from "next/navigation";

export default function Header() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("LayoutContext must be used within a LayoutContext.Provider");
  }

  const { language, setLanguage, translations, isRTL } = context;
  const { theme, setTheme } = useTheme();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 🔸 Header scroll background toggle
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔸 Scroll progress bar
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <>
      {/* 🔵 Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-[9999] h-[5px] bg-transparent">
        <div
          className="h-full transition-all duration-100 ease-linear bg-[#3f4144] dark:bg-orange-400"
          style={{
            width: `${scrollProgress}%`,
            opacity: scrollProgress > 0 ? 1 : 0,
          }}
        />
      </div>

      {/* 🔵 Header */}
      <header
        className={`w-full fixed top-0 z-50 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
          scrolled ? "bg-white dark:bg-gray-950" : ""
        }`}
      >
        <div className="relative flex items-center justify-between py-4 mx-5 max-w-7xl md:mx-auto">
          {/* Logo */}
          <div className={isRTL ? "absolute" : "absolute"}>
            <Link href="/" className="text-xl font-bold">
              {translations?.header?.brand || "My Brand"}
            </Link>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="flex-grow text-center">
            <div className="justify-center hidden gap-6 md:flex">
              <Link
                href="/"
                className={`hover:text-orange-500 ${
                  pathname === "/" ? "text-orange-500 font-semibold" : ""
                }`}
              >
                {translations?.header?.home || "Home"}
              </Link>
              <Link
                href="/projects"
                className={`hover:text-orange-500 ${
                  pathname === "/projects" ? "text-orange-500 font-semibold" : ""
                }`}
              >
                {translations?.header?.projects || "Projects"}
              </Link>
              <Link
                href="/contact"
                className={`hover:text-orange-500 ${
                  pathname === "/contact" ? "text-orange-500 font-semibold" : ""
                }`}
              >
                {translations?.header?.contact || "Contact"}
              </Link>
              <Link
                href="/github"
                className={`hover:text-orange-500 ${
                  pathname === "/github" ? "text-orange-500 font-semibold" : ""
                }`}
              >
                {translations?.header?.github || "Github"}
              </Link>
              <Link
                href="/articles"
                className={`hover:text-orange-500 ${
                  pathname === "/articles" ? "text-orange-500 font-semibold" : ""
                }`}
              >
                {translations?.header?.articles || "Articles"}
              </Link>
            </div>
          </nav>

          {/* Right-side Controls */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTheme("system")}>🖥 Device Default</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>☀️ Light Mode</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>🌙 Dark Mode</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Select language">
                  🌐 {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("bn")}>বাংলা</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 🔵 Mobile Drawer */}
        <div
          className={`fixed top-0 ${
            isRTL ? "right-0" : "left-0"
          } h-full w-64 bg-gray-200 dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isDrawerOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700">
            <Button variant="ghost" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col gap-4 p-4">
            <Link
              href="/"
              className={`hover:text-orange-500 ${
                pathname === "/" ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {translations?.header?.home || "Home"}
            </Link>
            <Link
              href="/projects"
              className={`hover:text-orange-500 ${
                pathname === "/projects" ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {translations?.header?.projects || "Projects"}
            </Link>
            <Link
              href="/contact"
              className={`hover:text-orange-500 ${
                pathname === "/contact" ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {translations?.header?.contact || "Contact"}
            </Link>
            <Link
              href="/github"
              className={`hover:text-orange-500 ${
                pathname === "/github" ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {translations?.header?.github || "Github"}
            </Link>
            <Link
              href="/articles"
              className={`hover:text-orange-500 ${
                pathname === "/articles" ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {translations?.header?.articles || "Articles"}
            </Link>
          </div>
        </div>

        {/* 🔵 Backdrop */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </header>
    </>
  );
}
