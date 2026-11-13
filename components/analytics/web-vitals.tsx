"use client";

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics";

/**
 * Envía métricas agregadas a Umami si está configurado. Sin Umami, no hace nada.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    track("web_vital", {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      path: window.location.pathname,
    });
  });

  return null;
}
