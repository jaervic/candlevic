"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { useProgress, type Confidence } from "@/lib/progress";
import { cn } from "@/lib/utils";

type QuizProps = {
  slug?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  wrong?: string[];
};

const LETTERS = ["A", "B", "C", "D", "E"];

export function Quiz({
  slug,
  question,
  options,
  correct,
  explanation,
  wrong,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const recordConfidence = useProgress((s) => s.recordConfidence);

  function choose(index: number) {
    if (selected != null) return;
    setSelected(index);

    const isRight = index === correct;
    if (slug) {
      recordQuiz(slug, isRight ? 100 : 40);
      if (!isRight) {
        recordConfidence(slug, "low");
        setConfidence("low");
      }
    }
  }

  function retry() {
    setSelected(null);
    setConfidence(null);
  }

  const isCorrect = selected === correct;
  const wrongExplanation =
    selected != null && !isCorrect ? wrong?.[selected] : undefined;

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <p className="text-[14px] font-medium leading-snug text-fg">{question}</p>

      <div className="mt-3 space-y-2">
        {options.map((option, index) => {
          const chosen = selected === index;
          const revealCorrect = selected != null && index === correct;
          const revealWrong = chosen && index !== correct;
          return (
            <button
              key={option}
              onClick={() => choose(index)}
              disabled={selected != null}
              className={cn(
                "flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13.5px] transition-colors",
                revealCorrect
                  ? "border-up/40 bg-up/10 text-fg"
                  : revealWrong
                    ? "border-down/40 bg-down/10 text-fg"
                    : "border-line bg-surface-2/60 text-fg/90 hover:border-line-strong hover:bg-surface-2",
                selected != null && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "num mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold",
                  revealCorrect
                    ? "border-up/40 text-up"
                    : revealWrong
                      ? "border-down/40 text-down"
                      : "border-line-strong text-muted",
                )}
              >
                {revealCorrect ? (
                  <Check className="h-3 w-3" />
                ) : revealWrong ? (
                  <X className="h-3 w-3" />
                ) : (
                  LETTERS[index]
                )}
              </span>
              <span className="min-w-0">{option}</span>
            </button>
          );
        })}
      </div>

      {selected != null && (
        <div
          className={cn(
            "mt-3 rounded-xl border p-3 text-[12.5px] leading-relaxed",
            isCorrect
              ? "border-up/25 bg-up/10 text-fg/90"
              : "border-down/25 bg-down/10 text-fg/90",
          )}
        >
          <p
            className={cn(
              "mb-1 text-[11px] font-semibold",
              isCorrect ? "text-up" : "text-down",
            )}
          >
            {isCorrect ? "Correcto" : "No exactamente"}
          </p>
          {wrongExplanation && (
            <p className="mb-1.5 text-fg/80">{wrongExplanation}</p>
          )}
          <p className={cn(wrongExplanation && "text-muted")}>{explanation}</p>
        </div>
      )}

      {selected != null && isCorrect && slug && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {confidence == null ? (
            <>
              <span className="text-[11px] text-faint">
                ¿Lo tenías claro?
              </span>
              <button
                type="button"
                onClick={() => {
                  setConfidence("high");
                  recordConfidence(slug, "high");
                }}
                className="rounded-md border border-up/30 bg-up/10 px-2 py-1 text-[10.5px] text-up transition-colors hover:bg-up/15"
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfidence("low");
                  recordConfidence(slug, "low");
                }}
                className="rounded-md border border-line bg-surface-2 px-2 py-1 text-[10.5px] text-muted transition-colors hover:text-fg"
              >
                Dudaba
              </button>
            </>
          ) : (
            <span className="text-[10px] text-faint">
              {confidence === "high"
                ? "Anotado como dominado."
                : "Anotado para repasar pronto."}
            </span>
          )}
        </div>
      )}

      {selected != null && !isCorrect && slug && (
        <p className="mt-2 text-[10px] text-faint">
          Anotado para repasar pronto.
        </p>
      )}

      {selected != null && (
        <button
          onClick={retry}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-muted"
        >
          <RotateCcw className="h-3 w-3" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
