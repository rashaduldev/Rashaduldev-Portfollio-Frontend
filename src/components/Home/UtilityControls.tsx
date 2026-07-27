"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { LayoutContext } from "../context";
import { MdLanguage } from "react-icons/md";
import { useState } from "react";
import Link from "next/link";
import BlobsButton from "../Common/Blobsbutton";

// -------- Types --------
type HeaderSection = {
  brand: string;
  home: string;
  projects: string;
  contact: string;
  github: string;
  articles: string;
  scrollMessage: string;
};

type PortfolioJSON = {
  header: HeaderSection;
  [key: string]: unknown;
};

type LayoutContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translations: PortfolioJSON | null;
  isRTL: boolean;
};

export default function UtilityControls({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const context = useContext(LayoutContext) as LayoutContextType | null;
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContext.Provider",
    );
  }

  const { language, setLanguage } = context;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div
        className={`flex items-center gap-3 ${
          isMobile
            ? "justify-center mt-4 border-t pt-4 border-gray-200 dark:border-gray-700"
            : ""
        }`}
      >
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
            <DropdownMenuItem
              onClick={() => {
                setLanguage("en");
                setOpenDropdownId(null);
              }}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setLanguage("bn");
                setOpenDropdownId(null);
              }}
            >
              বাংলা
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setLanguage("ar");
                setOpenDropdownId(null);
              }}
            >
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <BlobsButton asChild className="px-3 py-1.5 text-xs">
        <Link href="/login" aria-label="Admin login">
          Admin Login
        </Link>
      </BlobsButton>
    </div>
  );
}
