"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatNumber } from "@/lib/utils";

function toNumber(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function RiskCalculator() {
  const [capital, setCapital] = useState("1000");
  const [risk, setRisk] = useState("1");
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("95");
  const [target, setTarget] = useState("112");

  const result = useMemo(() => {
    const c = toNumber(capital);
    const r = toNumber(risk);
    const e = toNumber(entry);
    const s = toNumber(stop);
    const t = toNumber(target);

    const riskAmount = (c * r) / 100;
    const perUnit = Math.abs(e - s);
    const size = perUnit > 0 ? riskAmount / perUnit : 0;
    const positionValue = size * e;
    const rewardPerUnit = Math.abs(t - e);
    const rr = perUnit > 0 ? rewardPerUnit / perUnit : 0;
    const profit = size * rewardPerUnit;
    const stopSide = s < e ? "largo" : "corto";

    return {
      riskAmount,
      perUnit,
      size,
      positionValue,
      rr,
      profit,
      stopSide,
      valid: c > 0 && r > 0 && perUnit > 0 && e > 0,
      leverage: c > 0 ? positionValue / c : 0,
    };
  }, [capital, risk, entry, stop, target]);

  const fields = [
    { label: "Capital", value: capital, set: setCapital, suffix: "$" },
    { label: "Riesgo por operación", value: risk, set: setRisk, suffix: "%" },
    { label: "Entrada", value: entry, set: setEntry, suffix: "$" },
    { label: "Stop loss", value: stop, set: setStop, suffix: "$" },
    { label: "Objetivo", value: target, set: setTarget, suffix: "$" },
  ];

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-accent" />
        <p className="text-sm font-semibold">Calculadora de posición</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
              {field.label}
            </span>
            <div className="flex items-center rounded-lg border border-line bg-surface-2 px-2">
              <input
                inputMode="decimal"
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className="num h-9 w-full min-w-0 bg-transparent text-[13px] text-fg outline-none"
              />
              <span className="pl-1 text-[11px] text-faint">{field.suffix}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Result label="Riesgo máximo" value={`$${formatNumber(result.riskAmount, 2)}`} tone="down" />
        <Result label="Tamaño" value={`${formatNumber(result.size, 4)} u.`} />
        <Result label="Valor posición" value={`$${formatNumber(result.positionValue, 2)}`} />
        <Result
          label="Ratio R:B"
          value={result.rr > 0 ? `1 : ${formatNumber(result.rr, 2)}` : "—"}
          tone={result.rr >= 2 ? "up" : result.rr >= 1 ? "accent" : "down"}
        />
      </div>

      <div className="mt-3 overflow-hidden rounded-lg">
        <div className="flex h-2">
          <div
            className="bg-down/70"
            style={{ width: `${(1 / (1 + Math.max(result.rr, 0.01))) * 100}%` }}
          />
          <div className="flex-1 bg-up/70" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-faint">
          <span>Riesgo ${formatNumber(result.riskAmount, 2)}</span>
          <span>Beneficio potencial ${formatNumber(result.profit, 2)}</span>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        {result.valid
          ? `Con un stop en ${formatNumber(toNumber(stop), 2)} comprarías ${formatNumber(result.size, 4)} unidades. ${
              result.leverage > 1
                ? "La posición supera tu capital: necesitarías apalancamiento, algo que no deberías usar al empezar."
                : "La posición cabe dentro de tu capital."
            }`
          : "Introduce valores válidos: el stop no puede ser igual a la entrada."}
      </p>
    </div>
  );
}

function Result({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "up" | "down" | "accent";
}) {
  const colors = {
    default: "text-fg",
    up: "text-up",
    down: "text-down",
    accent: "text-accent",
  };
  return (
    <div className="rounded-xl border border-line bg-surface-2/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-faint">{label}</p>
      <p className={`num mt-0.5 text-[15px] font-medium ${colors[tone]}`}>{value}</p>
    </div>
  );
}
