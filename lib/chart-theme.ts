import type { ResolvedTheme } from "./preferences";

export type ChartPalette = {
  up: string;
  down: string;
  grid: string;
  text: string;
  crosshair: string;
  info: string;
  accent: string;
  volumeUp: string;
  volumeDown: string;
  rsi: string;
  rsiHigh: string;
  rsiLow: string;
};

export const CHART_PALETTES: Record<ResolvedTheme, ChartPalette> = {
  noche: {
    up: "#2fd47c",
    down: "#ff5c6c",
    grid: "rgba(34,43,54,0.45)",
    text: "#7f8b9c",
    crosshair: "#2e3946",
    info: "#5aa9ff",
    accent: "#f0b429",
    volumeUp: "rgba(47,212,124,0.28)",
    volumeDown: "rgba(255,92,108,0.28)",
    rsi: "#f0b429",
    rsiHigh: "rgba(255,92,108,0.35)",
    rsiLow: "rgba(47,212,124,0.35)",
  },
  grafito: {
    up: "#35c97a",
    down: "#f26b6b",
    grid: "rgba(44,51,59,0.5)",
    text: "#8b939d",
    crosshair: "#3a424c",
    info: "#6aa9f0",
    accent: "#e6a92e",
    volumeUp: "rgba(53,201,122,0.28)",
    volumeDown: "rgba(242,107,107,0.28)",
    rsi: "#e6a92e",
    rsiHigh: "rgba(242,107,107,0.35)",
    rsiLow: "rgba(53,201,122,0.35)",
  },
  papel: {
    up: "#0c8148",
    down: "#d52f24",
    grid: "rgba(31,41,51,0.08)",
    text: "#5b6776",
    crosshair: "#d3cbbd",
    info: "#2563eb",
    accent: "#98651a",
    volumeUp: "rgba(12,129,72,0.22)",
    volumeDown: "rgba(213,47,36,0.2)",
    rsi: "#98651a",
    rsiHigh: "rgba(213,47,36,0.4)",
    rsiLow: "rgba(12,129,72,0.4)",
  },
  sepia: {
    up: "#2d774b",
    down: "#b33a2b",
    grid: "rgba(59,47,36,0.09)",
    text: "#6f5f4d",
    crosshair: "#cdbd9f",
    info: "#2f5f9e",
    accent: "#8d621c",
    volumeUp: "rgba(45,119,75,0.22)",
    volumeDown: "rgba(179,58,43,0.2)",
    rsi: "#8d621c",
    rsiHigh: "rgba(179,58,43,0.4)",
    rsiLow: "rgba(45,119,75,0.4)",
  },
};

const LIGHT_COLOR_MAP: Record<string, string> = {
  "#f0b429": "#98651a",
  "#5aa9ff": "#2563eb",
  "#a78bfa": "#7c3aed",
  "#f472b6": "#be185d",
  "#34d399": "#0c8148",
  "#2fd47c": "#0c8148",
  "#ff5c6c": "#d52f24",
};

export function chartColor(
  color: string | undefined,
  theme: ResolvedTheme,
  fallback: string,
) {
  if (!color) return fallback;
  if (theme === "papel" || theme === "sepia") {
    return LIGHT_COLOR_MAP[color.toLowerCase()] ?? color;
  }
  return color;
}
