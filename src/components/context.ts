"use client";

import React, { createContext } from "react";
import { PortfolioJSON } from "@/types/translations";

export interface LayoutContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translations: PortfolioJSON;
  isRTL: boolean;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
);
