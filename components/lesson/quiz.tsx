"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type QuizProps = {
  slug?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const LETTERS = ["A", "B", "C", "D", "E"];

export function Quiz({
  slug,
  question,
  options,
  correct,
  explanation,
}: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const recordQuiz = useProgress((s) => s.recordQuiz);

  function choose(index: number) {
    if (selected != null) return;
    setSelected(index);
    if (slug) recordQuiz(slug, index === correct ? 100 : 40);
  }

  const isCorrect = selected === correct;

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
          <p className={cn("mb-1 text-[11px] font-semibold", isCorrect ? "text-up" : "text-down")}>
            {isCorrect ? "Correcto" : "No exactamente"}
          </p>
          {explanation}
        </div>
      )}

      {selected != null && (
        <button
          onClick={() => setSelected(null)}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-muted"
        >
          <RotateCcw className="h-3 w-3" />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
