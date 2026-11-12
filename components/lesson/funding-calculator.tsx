"use client";

import { useMemo, useState } from "react";
import { Repeat } from "lucide-react";
import { formatNumber } from "@/lib/utils";

function num(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function FundingCalculator() {
  const [position, setPosition] = useState("1000");
  const [rate, setRate] = useState("0.01");
  const [periods, setPeriods] = useState("3");
  const [days, setDays] = useState("7");
  const [side, setSide] = useState<"long" | "short">("long");

  const result = useMemo(() => {
    const p = num(position);
    const r = num(rate) / 100;
    const perDay = Math.max(0, num(periods));
    const d = Math.max(0, num(days));
    const total = p * r * perDay * d;
    const pays =
      (side === "long" && r > 0) || (side === "short" && r < 0);
    return {
      total,
      perDay: p * r * perDay,
      pays,
      valid: p > 0 && perDay > 0 && d > 0,
    };
  }, [position, rate, periods, days, side]);

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2">
        <Repeat className="h-4 w-4 text-accent" />
        <p className="text-sm font-semibold">Calculadora de funding</p>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">
        En perpetuos, largos y cortos se pagan entre sí cada cierto número de
        horas. El signo de la tasa decide quién paga.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Field
          label="Valor de la posición"
          value={position}
          set={setPosition}
          suffix="$"
        />
        <Field label="Tasa por periodo" value={rate} set={setRate} suffix="%" />
        <Field
          label="Periodos al día"
          value={periods}
          set={setPeriods}
          suffix=""
        />
        <Field label="Días" value={days} set={setDays} suffix="" />
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
            Dirección
          </span>
          <select
            value={side}
            onChange={(event) => setSide(event.target.value as "long" | "short")}
            className="h-9 w-full rounded-lg border border-line bg-surface-2 px-2 text-[12px] text-fg outline-none focus:border-accent/40"
          >
            <option value="long">Largo</option>
            <option value="short">Corto</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-line bg-surface-2/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-faint">
            Por día
          </p>
          <p className="num mt-0.5 text-[15px] font-medium">
            ${formatNumber(Math.abs(result.perDay), 2)}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface-2/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-faint">
            Total ({num(days)} días)
          </p>
          <p
            className={`num mt-0.5 text-[15px] font-medium ${
              result.pays ? "text-down" : "text-up"
            }`}
          >
            {result.pays ? "−" : "+"}${formatNumber(Math.abs(result.total), 2)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        {result.valid
          ? result.pays
            ? "Con esta tasa, tu posición paga funding. Es un coste que se acumula aunque el precio no se mueva."
            : "Con esta tasa, tu posición cobra funding. No es dinero gratis: compensa el riesgo y la dirección del mercado."
          : "Introduce valores válidos."}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  set,
  suffix,
}: {
  label: string;
  value: string;
  set: (value: string) => void;
  suffix: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
        {label}
      </span>
      <div className="flex items-center rounded-lg border border-line bg-surface-2 px-2">
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => set(event.target.value)}
          className="num h-9 w-full min-w-0 bg-transparent text-[13px] text-fg outline-none"
        />
        {suffix && <span className="pl-1 text-[11px] text-faint">{suffix}</span>}
      </div>
    </label>
  );
}
