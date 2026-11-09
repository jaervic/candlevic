"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { DatasetChart } from "./dataset-chart";
import type { DatasetId } from "@/lib/datasets";
import { useProgress } from "@/lib/progress";

type ChartQuizProps = {
  slug?: string;
  dataset: DatasetId;
  from?: number;
  to?: number;
  question: string;
  answerIndex: number;
  explanation: string;
  height?: number;
  showVolume?: boolean;
};

export function ChartQuiz({
  slug,
  dataset,
  from = 0,
  to,
  question,
  answerIndex,
  explanation,
  height = 240,
  showVolume = true,
}: ChartQuizProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const recordQuiz = useProgress((s) => s.recordQuiz);

  function handlePick(index: number) {
    if (correct) return;
    setPicked(index);
    if (index === answerIndex) {
      setCorrect(true);
      if (slug) recordQuiz(slug, attempts === 0 ? 100 : 50);
    } else {
      setAttempts((a) => a + 1);
    }
  }

  function reset() {
    setPicked(null);
    setCorrect(false);
    setAttempts(0);
  }

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <div className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/15 text-[11px] font-semibold text-accent">
          ?
        </span>
        <p className="text-sm font-medium leading-snug text-fg">{question}</p>
      </div>

      <DatasetChart
        dataset={dataset}
        from={from}
        to={to}
        height={height}
        showVolume={showVolume}
        onPick={handlePick}
        caption={correct ? "Correcto" : "Toca la vela que responde la pregunta"}
        markers={
          picked != null
            ? [
                {
                  index: picked,
                  text: correct ? "✓" : "✕",
                  color: correct ? "#2fd47c" : "#ff5c6c",
                  position: "aboveBar",
                  shape: "circle",
                },
              ]
            : undefined
        }
      />

      {picked != null && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-[13px] leading-relaxed ${
            correct
              ? "border-up/25 bg-up/10 text-up"
              : "border-down/25 bg-down/10 text-down"
          }`}
        >
          {correct ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <X className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>
            <p className="font-medium">
              {correct ? "¡Correcto!" : "Todavía no. Fíjate en la mecha y el cierre."}
            </p>
            {correct && (
              <p className="mt-1 text-fg/85">{explanation}</p>
            )}
          </div>
        </div>
      )}

      {picked != null && (
        <button
          onClick={reset}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-muted"
        >
          <RotateCcw className="h-3 w-3" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
