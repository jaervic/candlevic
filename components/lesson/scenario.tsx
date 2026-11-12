"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type ScenarioOption = {
  label: string;
  feedback: string;
  quality: "good" | "bad" | "neutral";
};

export function Scenario({
  situation,
  options,
}: {
  situation: string;
  options: ScenarioOption[];
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
        Escenario
      </p>
      <p className="mt-1.5 text-[14px] font-medium leading-snug text-fg">
        {situation}
      </p>

      <div className="mt-3 space-y-2">
        {options.map((option, index) => {
          const chosen = picked === index;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setPicked(index)}
              disabled={picked != null}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors",
                chosen
                  ? option.quality === "good"
                    ? "border-up/40 bg-up/10"
                    : option.quality === "bad"
                      ? "border-down/40 bg-down/10"
                      : "border-accent/40 bg-accent/10"
                  : "border-line bg-surface-2/60 text-fg/90 hover:border-line-strong hover:bg-surface-2",
                picked != null && !chosen && "opacity-55",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {picked != null && (
        <div
          className={cn(
            "mt-3 rounded-xl border p-3 text-[12.5px] leading-relaxed",
            options[picked].quality === "good"
              ? "border-up/25 bg-up/10 text-fg/90"
              : options[picked].quality === "bad"
                ? "border-down/25 bg-down/10 text-fg/90"
                : "border-accent/25 bg-accent/10 text-fg/90",
          )}
        >
          {options[picked].feedback}
        </div>
      )}

      {picked != null && (
        <button
          type="button"
          onClick={() => setPicked(null)}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-muted"
        >
          <RotateCcw className="h-3 w-3" />
          Repetir el escenario
        </button>
      )}
    </div>
  );
}
