import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  default: "bg-surface-2 text-muted border-line",
  accent: "bg-accent/10 text-accent border-accent/25",
  up: "bg-up/10 text-up border-up/25",
  down: "bg-down/10 text-down border-down/25",
  info: "bg-info/10 text-info border-info/25",
  outline: "bg-transparent text-muted border-line-strong",
} as const;

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
