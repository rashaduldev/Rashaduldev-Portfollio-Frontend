"use client"

import { useContext } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,     // <-- নতুন import
  DropdownMenuContent,     // <-- নতুন import (যদি না থাকে)
} from "@/components/ui/dropdown-menu"   // আপনার কাস্টম path অনুযায়ী
import { LayoutContext } from "../context"
import { MdDarkMode, MdImportantDevices, MdLanguage } from "react-icons/md"
import { CiLight } from "react-icons/ci"
import { useState } from "react"
import Link from "next/link"

// -------- Types --------
interface HeaderSection {
  brand: string
  home: string
  projects: string
  contact: string
  github: string
  articles: string
  scrollMessage: string
}

type PortfolioJSON = {
  header: HeaderSection
  [key: string]: unknown
}

interface LayoutContextType {
  language: string
  setLanguage: (lang: string) => void
  translations: PortfolioJSON | null
  isRTL: boolean
}

interface UtilityControlsProps {
  isMobile?: boolean
}

export default function UtilityControls({ isMobile = false }: UtilityControlsProps) {
  const context = useContext(LayoutContext) as LayoutContextType | null
  if (!context) {
    throw new Error("LayoutContext must be used within a LayoutContext.Provider")
  }

  const { language, setLanguage } = context
  const { theme, setTheme } = useTheme()

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div
        className={`flex items-center gap-3 ${
          isMobile
            ? "justify-center mt-4 border-t pt-4 border-gray-200 dark:border-gray-700"
            : ""
        }`}
      >
        {/* -------- Theme Dropdown -------- */}
        <DropdownMenu
          id="theme"
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
        >
          <DropdownMenuTrigger asChild>   {/* <-- asChild দিয়ে Button কে trigger বানানো */}
            <Button
              variant="outline"
              size="icon"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <MdImportantDevices className="mr-2" /> Device Default
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <CiLight className="mr-2" /> Light Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <MdDarkMode className="mr-2" /> Dark Mode
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* -------- Language Dropdown -------- */}
        <DropdownMenu
          id="language"
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Select language">
              <MdLanguage className="mr-1" />
              {language.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("bn")}>
              বাংলা
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ar")}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button asChild size="sm"><Link href="/login" aria-label="Admin login">Admin Login</Link></Button>
    </div>
  )
}