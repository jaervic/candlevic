"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/progress";
import { saveBackup } from "@/lib/backup";

/**
 * Guarda el progreso cifrado en segundo plano cuando existe un código
 * de respaldo. Sin código no hace nada: todo queda en el dispositivo.
 */
export function ProgressSync() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = useProgress.subscribe((state, prev) => {
      const code = state.savedCode;
      if (!code || code.startsWith("CNDL1")) return;
      if (state.lessons === prev.lessons) return;

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const { lessons, streak, confidence, profile, startedAt } = useProgress.getState();
        void saveBackup(code, {
          lessons,
          streak,
          confidence,
          profile,
          startedAt,
          savedCode: code,
        });
      }, 2500);
    });

    return () => {
      unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return null;
}
