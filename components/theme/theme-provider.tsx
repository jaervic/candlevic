"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  resolveTheme,
  THEME_META,
  usePreferences,
} from "@/lib/preferences";
import { useUI } from "@/lib/ui";
import { ThemeContext } from "./theme-context";
import { SettingsSheet } from "./settings-sheet";
import { SearchDialog } from "@/components/search/search-dialog";

function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)", true);
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const prefersReduced = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    false,
  );

  const theme = usePreferences((s) => s.theme);
  const readingSize = usePreferences((s) => s.readingSize);
  const readingLeading = usePreferences((s) => s.readingLeading);
  const readingWidth = usePreferences((s) => s.readingWidth);
  const ambient = usePreferences((s) => s.ambient);
  const motion = usePreferences((s) => s.motion);

  const focusMode = useUI((s) => s.focusMode);
  const setFocus = useUI((s) => s.setFocus);
  const pathname = usePathname();

  const resolved = resolveTheme(theme, systemDark);
  const ambientOn = ambient === "on" || (ambient === "auto" && isDesktop);
  const reduced = motion === "reduced" || prefersReduced;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.ambient = ambientOn ? "on" : "off";
    root.dataset.reducedMotion = reduced ? "true" : "false";
    root.dataset.focus = focusMode ? "true" : "false";

    if (readingSize == null) {
      root.style.removeProperty("--cv-reading-size");
    } else {
      root.style.setProperty("--cv-reading-size", `${readingSize}px`);
    }
    root.style.setProperty("--cv-reading-leading", String(readingLeading));
    root.style.setProperty("--cv-reading-width", `${readingWidth}ch`);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_META[resolved]);
  }, [
    resolved,
    ambientOn,
    reduced,
    focusMode,
    readingSize,
    readingLeading,
    readingWidth,
  ]);

  useEffect(() => {
    if (!pathname.startsWith("/aprender/") && focusMode) setFocus(false);
  }, [pathname, focusMode, setFocus]);

  return (
    <ThemeContext.Provider value={resolved}>
      {children}
      <SettingsSheet />
      <SearchDialog />
    </ThemeContext.Provider>
  );
}
