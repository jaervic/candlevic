"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "noche" | "grafito" | "papel" | "sepia";
export type ResolvedTheme = "noche" | "grafito" | "papel" | "sepia";
export type AmbientMode = "auto" | "on" | "off";
export type MotionMode = "system" | "reduced";

export const THEME_OPTIONS: {
  id: ThemeMode;
  label: string;
  swatch: string;
  meta: string;
}[] = [
  {
    id: "system",
    label: "Sistema",
    swatch: "linear-gradient(135deg, #0b0f14 0 50%, #f7f5f0 50% 100%)",
    meta: "#0b0f14",
  },
  { id: "noche", label: "Noche", swatch: "#0b0f14", meta: "#0b0f14" },
  { id: "grafito", label: "Grafito", swatch: "#15181c", meta: "#15181c" },
  { id: "papel", label: "Papel", swatch: "#f7f5f0", meta: "#f7f5f0" },
  { id: "sepia", label: "Sepia", swatch: "#f3ead8", meta: "#f3ead8" },
];

export const THEME_META: Record<ResolvedTheme, string> = {
  noche: "#0b0f14",
  grafito: "#15181c",
  papel: "#f7f5f0",
  sepia: "#f3ead8",
};

export function resolveTheme(
  mode: ThemeMode,
  systemDark: boolean,
): ResolvedTheme {
  if (mode === "system") return systemDark ? "noche" : "papel";
  return mode;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Preferences = {
  theme: ThemeMode;
  readingSize: number | null;
  readingLeading: number;
  readingWidth: number;
  ambient: AmbientMode;
  motion: MotionMode;
  colorBlind: boolean;
};

type Actions = {
  setTheme: (theme: ThemeMode) => void;
  setReadingSize: (size: number | null) => void;
  setReadingLeading: (leading: number) => void;
  setReadingWidth: (width: number) => void;
  setAmbient: (ambient: AmbientMode) => void;
  setMotion: (motion: MotionMode) => void;
  setColorBlind: (value: boolean) => void;
  reset: () => void;
};

export type PreferencesStore = Preferences & Actions;

const defaults: Preferences = {
  theme: "system",
  readingSize: null,
  readingLeading: 1.75,
  readingWidth: 66,
  ambient: "auto",
  motion: "system",
  colorBlind: false,
};

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaults,
      setTheme: (theme) => set({ theme }),
      setReadingSize: (readingSize) => set({ readingSize }),
      setReadingLeading: (readingLeading) =>
        set({ readingLeading: clamp(readingLeading, 1.55, 1.95) }),
      setReadingWidth: (readingWidth) =>
        set({ readingWidth: clamp(readingWidth, 52, 78) }),
      setAmbient: (ambient) => set({ ambient }),
      setMotion: (motion) => set({ motion }),
      setColorBlind: (colorBlind) => set({ colorBlind }),
      reset: () => set({ ...defaults }),
    }),
    { name: "candlevic:prefs:v1", version: 1 },
  ),
);
