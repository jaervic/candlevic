"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Type } from "lucide-react";
import { useUI } from "@/lib/ui";
import { cn } from "@/lib/utils";

export function LessonReadingBar() {
  const [progress, setProgress] = useState(0);
  const openSettings = useUI((s) => s.openSettings);
  const focusMode = useUI((s) => s.focusMode);
  const toggleFocus = useUI((s) => s.toggleFocus);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(
        max > 0 ? Math.min(100, Math.max(0, (root.scrollTop / max) * 100)) : 0,
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
        role="progressbar"
        aria-label="Progreso de lectura"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.14em] text-faint">
          Lectura
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
            aria-label="Ajustes de lectura"
          >
            <Type className="h-3.5 w-3.5" />
            Aa
          </button>
          <button
            type="button"
            onClick={toggleFocus}
            aria-pressed={focusMode}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] transition-colors",
              focusMode
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {focusMode ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            {focusMode ? "Salir" : "Enfoque"}
          </button>
        </div>
      </div>
    </>
  );
}
