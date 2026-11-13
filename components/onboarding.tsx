"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CandlestickChart,
  KeyRound,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "candlevic:onboarded:v1";

const STEPS = [
  {
    icon: Sparkles,
    title: "Aprende trading de verdad",
    body: "Conceptos cortos, gráficos reales y ejercicios. Sin humo, sin señales y sin promesas de rentabilidad.",
    points: [
      "Lecciones de 3–5 minutos, pensadas para el móvil",
      "Cada idea se ve en un gráfico interactivo",
      "Practicas con quizzes y calculadoras",
    ],
  },
  {
    icon: CandlestickChart,
    title: "Del concepto a la práctica",
    body: "No memorizas definiciones: lees el mercado, mides el riesgo y compruebas si lo has entendido en el laboratorio.",
    points: [
      "Indicadores y dibujos en el Lab",
      "Replay de velas para practicar sin dinero",
      "Estudios de casos reales: LUNA, COVID, FTX…",
    ],
  },
  {
    icon: KeyRound,
    title: "Tu progreso es tuyo",
    body: "Se guarda en tu dispositivo, sin registro. Si quieres, creas un código para recuperarlo en otro móvil.",
    points: [
      "Sin email ni contraseña",
      "Respaldo con un código de guardado o un archivo",
      "Exportable como archivo cuando quieras",
    ],
  },
];

export function Onboarding() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  function close() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida a Candlevic"
    >
      <div className="animate-fade-up w-full max-w-md rounded-t-3xl border border-line bg-surface p-5 pb-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-accent" : "w-1.5 bg-surface-3"
                }`}
              />
            ))}
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
          <Icon className="h-6 w-6 text-accent" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>

        <ul className="mt-4 space-y-2">
          {current.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-[13px] text-fg/90">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>

        {isLast && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-3 text-[11px] leading-relaxed text-faint">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
            Candlevic es contenido educativo. No es asesoramiento financiero ni una
            recomendación de inversión. Nunca inviertas dinero que no puedas permitirte
            perder.
          </p>
        )}

        <div className="mt-5 flex items-center gap-2">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Atrás
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={() => {
              if (isLast) {
                close();
                router.push("/aprender");
              } else {
                setStep((s) => s + 1);
              }
            }}
          >
            {isLast ? "Empezar la ruta" : "Siguiente"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {!isLast && (
          <button
            onClick={close}
            className="mt-3 w-full text-center text-[12px] text-faint hover:text-muted"
          >
            Saltar por ahora
          </button>
        )}

        {isLast && (
          <Link
            href="/progreso"
            onClick={close}
            className="mt-3 block text-center text-[12px] text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Crear mi código de guardado
          </Link>
        )}
      </div>
    </div>
  );
}
