"use client";

import { createContext, useContext } from "react";
import type { ResolvedTheme } from "@/lib/preferences";

export const ThemeContext = createContext<ResolvedTheme>("noche");

export function useResolvedTheme() {
  return useContext(ThemeContext);
}
