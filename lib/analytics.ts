"use client";

type Umami = {
  track: (event: string, data?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    umami?: Umami;
  }
}

/**
 * Analítica agregada y sin cookies. Si el operador no configura Umami,
 * window.umami no existe y esta función no hace nada.
 */
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    /* nunca romper la app por analítica */
  }
}
