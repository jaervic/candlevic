"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  RotateCcw,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import {
  PROFILE_QUESTIONS,
  STYLES,
  scoreProfile,
  type TraderStyle,
} from "@/lib/profile";
import { useProgress } from "@/lib/progress";

export function ProfileTest() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<TraderStyle | null>(null);
  const setProfile = useProgress((s) => s.setProfile);

  function answer(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);

    if (step === PROFILE_QUESTIONS.length - 1) {
      const style = scoreProfile(next);
      setResult(style);
      setProfile(style);
    } else {
      setStep((s) => s + 1);
    }
  }

  function restart() {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setResult(null);
  }

  if (result) {
    const style = STYLES[result];
    return (
      <div className="space-y-5">
        <header>
          <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
            Test
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Tu perfil: {style.name}
          </h1>
          <p className="mt-1 text-[13px] text-muted">{style.tagline}</p>
        </header>

        <section
          className="rounded-2xl border p-4"
          style={{
            borderColor: `${style.accent}33`,
            backgroundColor: `${style.accent}0f`,
          }}
        >
          <p className="text-[13px] leading-relaxed text-fg/90">{style.description}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Fact label="Horizonte" value={style.horizon} />
            <Fact label="Tiempo en pantalla" value={style.screenTime} />
            <Fact label="Estrés" value={style.stress} />
            <Fact label="Capital" value={style.capital} />
          </div>
        </section>

        <section className="rounded-2xl border border-accent/25 bg-accent/10 p-4">
          <div className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                Lo que hay que vigilar
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-fg/85">
                {style.watchOut}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold">Tu plan de 30 días</h2>
          </div>
          <div className="space-y-2">
            {style.plan.map((week) => (
              <div
                key={week.week}
                className="rounded-xl border border-line bg-surface p-3.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium">{week.week}</p>
                  <span className="text-[10px] text-accent">{week.focus}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {week.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex items-start gap-2 text-[11.5px] leading-snug text-muted"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold">Lecciones para empezar</h2>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {style.lessons.map((slug, i) => (
              <Link
                key={slug}
                href={`/aprender/${slug}`}
                className={`flex items-center gap-2 px-4 py-3 text-[12.5px] transition-colors hover:bg-surface-2/60 ${
                  i > 0 ? "border-t border-line/70" : ""
                }`}
              >
                <Check className="h-3.5 w-3.5 text-up" />
                <span className="capitalize">{slug.replaceAll("-", " ")}</span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-faint" />
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={restart}>
            <RotateCcw className="h-4 w-4" /> Repetir el test
          </Button>
          <Link
            href="/aprender"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-[#1b1405]"
          >
            Ir a la ruta <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="space-y-5">
        <header>
          <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
            Test
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            ¿Qué trader eres?
          </h1>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
            Cinco preguntas para recomendarte un estilo y un plan de 30 días.
            No es una evaluación de tu valía: es una brújula.
          </p>
        </header>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <ul className="mt-4 space-y-2 text-[13px] text-muted">
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-accent" /> 2 minutos
            </li>
            <li className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-accent" /> Resultado con plan de
              30 días
            </li>
          </ul>
          <Button className="mt-5 w-full" onClick={() => setStarted(true)}>
            Empezar el test <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-[10.5px] leading-relaxed text-faint">
          El resultado es orientativo y educativo. No es asesoramiento financiero.
          Puedes repetirlo cuando quieras.
        </p>
      </div>
    );
  }

  const question = PROFILE_QUESTIONS[step];

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between text-[10px] text-faint">
          <span>
            Pregunta {step + 1} de {PROFILE_QUESTIONS.length}
          </span>
          <button onClick={restart} className="hover:text-muted">
            Reiniciar
          </button>
        </div>
        <ProgressBar value={step + 1} max={PROFILE_QUESTIONS.length} />
      </div>

      <h1 className="text-xl font-semibold leading-snug tracking-tight">
        {question.question}
      </h1>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={option.label}
            onClick={() => answer(index)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-left text-[13px] transition-colors hover:border-accent/30 hover:bg-accent/5"
          >
            {option.label}
            <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
          </button>
        ))}
      </div>

      {step > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep((s) => s - 1)}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Atrás
        </Button>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line/70 bg-surface/60 px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-fg/90">{value}</p>
    </div>
  );
}
