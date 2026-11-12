"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eye,
  Minus,
  Monitor,
  Moon,
  Plus,
  RotateCcw,
  Sun,
  Type,
  Waves,
  X,
} from "lucide-react";
import {
  THEME_OPTIONS,
  usePreferences,
  type AmbientMode,
  type MotionMode,
  type ThemeMode,
} from "@/lib/preferences";
import { useUI } from "@/lib/ui";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-medium transition-colors",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-line bg-surface-2/60 text-muted hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Type;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
        {children}
      </p>
    </div>
  );
}

export function SettingsSheet() {
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const theme = usePreferences((s) => s.theme);
  const readingSize = usePreferences((s) => s.readingSize);
  const readingLeading = usePreferences((s) => s.readingLeading);
  const readingWidth = usePreferences((s) => s.readingWidth);
  const ambient = usePreferences((s) => s.ambient);
  const motion = usePreferences((s) => s.motion);
  const colorBlind = usePreferences((s) => s.colorBlind);
  const isDesktop = useIsDesktop();

  const setTheme = usePreferences((s) => s.setTheme);
  const setReadingSize = usePreferences((s) => s.setReadingSize);
  const setReadingLeading = usePreferences((s) => s.setReadingLeading);
  const setReadingWidth = usePreferences((s) => s.setReadingWidth);
  const setAmbient = usePreferences((s) => s.setAmbient);
  const setMotion = usePreferences((s) => s.setMotion);
  const setColorBlind = usePreferences((s) => s.setColorBlind);
  const reset = usePreferences((s) => s.reset);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  const autoSize = isDesktop ? 18 : 17;
  const effectiveSize = readingSize ?? autoSize;
  const previewSize = readingSize ?? autoSize;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="animate-fade-up max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="settings-title" className="text-[15px] font-semibold">
              Ajustes de lectura
            </h2>
            <p className="mt-0.5 text-[11px] text-faint">
              Se guarda en este dispositivo.
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label="Cerrar ajustes"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mb-5">
          <SectionLabel icon={Monitor}>Tema</SectionLabel>
          <div className="grid grid-cols-5 gap-1.5">
            {THEME_OPTIONS.map((option) => {
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTheme(option.id as ThemeMode);
                    track("theme_change", { theme: option.id });
                  }}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors",
                    active
                      ? "border-accent/50 bg-accent/10"
                      : "border-line bg-surface-2/50 hover:border-line-strong",
                  )}
                >
                  <span
                    className="relative flex h-7 w-7 items-center justify-center rounded-full border border-line-strong/60 shadow-inner"
                    style={{ background: option.swatch }}
                  >
                    {active && (
                      <Check
                        className={cn(
                          "h-3.5 w-3.5",
                          option.id === "papel" || option.id === "sepia"
                            ? "text-[#1f2933]"
                            : "text-white",
                        )}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[9.5px] font-medium",
                      active ? "text-accent" : "text-muted",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel icon={Type}>Texto</SectionLabel>
          <div className="rounded-xl border border-line bg-surface-2/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">Tamaño</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setReadingSize(Math.max(15, effectiveSize - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-muted hover:text-fg"
                  aria-label="Reducir tamaño de letra"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="num w-12 text-center text-[12px] text-fg">
                  {effectiveSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setReadingSize(Math.min(21, effectiveSize + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-muted hover:text-fg"
                  aria-label="Aumentar tamaño de letra"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setReadingSize(null)}
                  className={cn(
                    "ml-1 rounded-lg border px-2 py-1.5 text-[10px]",
                    readingSize == null
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-line text-muted hover:text-fg",
                  )}
                >
                  Auto
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">Interlineado</span>
              <div className="flex gap-1">
                {[
                  { value: 1.6, label: "Compacto" },
                  { value: 1.75, label: "Normal" },
                  { value: 1.9, label: "Amplio" },
                ].map((option) => (
                  <Chip
                    key={option.value}
                    active={Math.abs(readingLeading - option.value) < 0.01}
                    onClick={() => setReadingLeading(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">Ancho</span>
              <div className="flex gap-1">
                {[
                  { value: 58, label: "Estrecho" },
                  { value: 66, label: "Normal" },
                  { value: 74, label: "Amplio" },
                ].map((option) => (
                  <Chip
                    key={option.value}
                    active={Math.abs(readingWidth - option.value) < 0.5}
                    onClick={() => setReadingWidth(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>

            <p
              className="mt-3 border-t border-line/70 pt-3 text-fg/90"
              style={{
                fontSize: previewSize,
                lineHeight: readingLeading,
                maxWidth: `${readingWidth}ch`,
              }}
            >
              El precio no sube porque lo deseemos: sube cuando la demanda supera
              a la oferta. Leer bien es la primera ventaja.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel icon={Waves}>Ambiente y movimiento</SectionLabel>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">Fondo animado</span>
              <div className="flex gap-1">
                {(
                  [
                    { value: "auto", label: "Auto" },
                    { value: "on", label: "Sí" },
                    { value: "off", label: "No" },
                  ] as { value: AmbientMode; label: string }[]
                ).map((option) => (
                  <Chip
                    key={option.value}
                    active={ambient === option.value}
                    onClick={() => setAmbient(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">Movimiento</span>
              <div className="flex gap-1">
                {(
                  [
                    { value: "system", label: "Sistema" },
                    { value: "reduced", label: "Reducido" },
                  ] as { value: MotionMode; label: string }[]
                ).map((option) => (
                  <Chip
                    key={option.value}
                    active={motion === option.value}
                    onClick={() => setMotion(option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel icon={Eye}>Accesibilidad</SectionLabel>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] text-muted">Velas huecas (daltónico)</p>
              <p className="text-[10px] text-faint">
                Forma además de color: alcista hueca, bajista rellena.
              </p>
            </div>
            <div className="flex gap-1">
              <Chip active={!colorBlind} onClick={() => setColorBlind(false)}>
                No
              </Chip>
              <Chip active={colorBlind} onClick={() => setColorBlind(true)}>
                Sí
              </Chip>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-line pt-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-fg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restablecer
          </button>
          <div className="flex items-center gap-2 text-[10px] text-faint">
            <Sun className="h-3 w-3" />
            <Moon className="h-3 w-3" />
            Claro y oscuro
          </div>
        </div>
      </div>
    </div>
  );
}
