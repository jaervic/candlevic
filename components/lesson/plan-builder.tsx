"use client";

import { useEffect, useState } from "react";
import { ClipboardCopy, Download } from "lucide-react";

type Plan = {
  horizonte: string;
  activos: string;
  riesgo: string;
  maxOps: string;
  entrada: string;
  stop: string;
  objetivo: string;
  reglaExtra: string;
};

const DEFAULTS: Plan = {
  horizonte: "Semanas",
  activos: "BTC/USDT, SPY",
  riesgo: "1",
  maxOps: "2",
  entrada: "Pullback a la media de 50 dentro de una tendencia alcista",
  stop: "Por debajo del último mínimo relevante",
  objetivo: "2R",
  reglaExtra: "No operar durante los 15 minutos posteriores a una noticia macro",
};

const KEY = "candlevic:plan:v1";

function toMarkdown(plan: Plan) {
  return `# Mi plan de trading

- **Horizonte:** ${plan.horizonte}
- **Activos:** ${plan.activos}
- **Riesgo por operación:** ${plan.riesgo}%
- **Máximo de operaciones:** ${plan.maxOps} al día
- **Entrada:** ${plan.entrada}
- **Stop:** ${plan.stop}
- **Objetivo:** ${plan.objetivo}
- **Regla extra:** ${plan.reglaExtra}

## Checklist antes de entrar
- [ ] Tengo un stop definido y sé cuánto pierdo.
- [ ] El tamaño respeta mi ${plan.riesgo}% de riesgo.
- [ ] No estoy operando por FOMO ni por venganza.
- [ ] La operación encaja con mi plan escrito.

> Regla de oro: si no puedo explicar la operación en una frase, no la hago.
`;
}

export function PlanBuilder() {
  const [plan, setPlan] = useState<Plan>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPlan({ ...DEFAULTS, ...(JSON.parse(raw) as Plan) });
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  function update<K extends keyof Plan>(key: K, value: Plan[K]) {
    setPlan((current) => {
      const next = { ...current, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setSaved(true);
  }

  function copy() {
    navigator.clipboard
      .writeText(toMarkdown(plan))
      .then(() => setSaved(true))
      .catch(() => setSaved(false));
  }

  function download() {
    const blob = new Blob([toMarkdown(plan)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-plan-de-trading.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  const fields: {
    key: keyof Plan;
    label: string;
    type?: string;
    options?: string[];
  }[] = [
    {
      key: "horizonte",
      label: "Horizonte",
      options: ["Intradía", "Días", "Semanas", "Meses"],
    },
    { key: "activos", label: "Activos" },
    { key: "riesgo", label: "Riesgo por operación (%)", type: "number" },
    { key: "maxOps", label: "Máximo de operaciones al día", type: "number" },
    { key: "entrada", label: "Regla de entrada" },
    { key: "stop", label: "Stop" },
    { key: "objetivo", label: "Objetivo" },
    { key: "reglaExtra", label: "Regla extra" },
  ];

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold">Tu plan en una página</p>
        <span className="text-[10px] text-faint">
          {saved ? "Guardado en este dispositivo" : "Se guarda solo"}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
              {field.label}
            </span>
            {field.options ? (
              <select
                value={plan[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                className="h-9 w-full rounded-lg border border-line bg-surface-2 px-2 text-[12px] text-fg outline-none focus:border-accent/40"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                inputMode={field.type === "number" ? "decimal" : undefined}
                value={plan[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                className="h-9 w-full rounded-lg border border-line bg-surface-2 px-2 text-[12px] text-fg outline-none focus:border-accent/40"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-3 text-[12px] leading-relaxed text-fg/90">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
          Resumen
        </p>
        <p className="mt-1">
          Opero en <strong>{plan.horizonte.toLowerCase()}</strong> con{" "}
          <strong>{plan.activos}</strong>. Arriesgo{" "}
          <strong>{plan.riesgo}%</strong> por operación y hago como máximo{" "}
          <strong>{plan.maxOps}</strong> al día. Entro cuando{" "}
          {plan.entrada.toLowerCase()}, pongo el stop{" "}
          {plan.stop.toLowerCase()} y busco {plan.objetivo}.{" "}
          {plan.reglaExtra}.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 text-[11px] text-muted transition-colors hover:text-fg"
        >
          <ClipboardCopy className="h-3.5 w-3.5" /> Copiar
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 text-[11px] text-muted transition-colors hover:text-fg"
        >
          <Download className="h-3.5 w-3.5" /> Descargar .md
        </button>
      </div>
    </div>
  );
}
