import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = {
  info: {
    wrap: "border-info/25 bg-info/10",
    icon: "text-info",
    Icon: Info,
  },
  tip: {
    wrap: "border-accent/25 bg-accent/10",
    icon: "text-accent",
    Icon: Lightbulb,
  },
  warning: {
    wrap: "border-accent/30 bg-accent/10",
    icon: "text-accent",
    Icon: AlertTriangle,
  },
  danger: {
    wrap: "border-down/30 bg-down/10",
    icon: "text-down",
    Icon: ShieldAlert,
  },
} as const;

export function Callout({
  children,
  type = "info",
  title,
}: {
  children: ReactNode;
  type?: keyof typeof styles;
  title?: string;
}) {
  const style = styles[type];
  const Icon = style.Icon;
  return (
    <div className={cn("my-5 flex gap-3 rounded-2xl border p-4", style.wrap)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", style.icon)} />
      <div className="min-w-0 text-[13.5px] leading-relaxed text-fg/90">
        {title && <p className="mb-1 font-semibold text-fg">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function KeyIdea({
  children,
  label = "Idea clave",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="my-5 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/12 to-transparent p-4">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
        {label}
      </p>
      <div className="text-[14.5px] font-medium leading-relaxed text-fg">
        {children}
      </div>
    </div>
  );
}

export function StepList({
  steps,
}: {
  steps: { title: string; body?: ReactNode }[];
}) {
  return (
    <ol className="my-5 space-y-3">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span className="num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-[11px] font-semibold text-accent">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-fg">{step.title}</p>
            {step.body && (
              <div className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
                {step.body}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
