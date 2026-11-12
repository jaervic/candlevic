"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

function num(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function LiquidationCalculator() {
  const [capital, setCapital] = useState("1000");
  const [leverage, setLeverage] = useState("10");
  const [entry, setEntry] = useState("75000");
  const [mmr, setMmr] = useState("0.5");
  const [side, setSide] = useState<"long" | "short">("long");

  const result = useMemo(() => {
    const c = num(capital);
    const lev = Math.max(1, num(leverage));
    const e = num(entry);
    const margin = Math.max(0, num(mmr)) / 100;

    const liquidation =
      side === "long"
        ? e * (1 - 1 / lev + margin)
        : e * (1 + 1 / lev - margin);
    const distance = e > 0 ? ((liquidation - e) / e) * 100 : 0;
    const positionValue = c * lev;
    const units = e > 0 ? positionValue / e : 0;

    return {
      liquidation,
      distance,
      positionValue,
      units,
      valid: c > 0 && e > 0 && lev >= 1,
      leverage: lev,
    };
  }, [capital, leverage, entry, mmr, side]);

  return (
    <div className="my-6 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-down" />
        <p className="text-sm font-semibold">Calculadora de liquidación</p>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">
        Margen aislado, sin comisiones ni funding. Sirve para entender la
        distancia, no para operar con apalancamiento.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Field label="Capital" value={capital} set={setCapital} suffix="$" />
        <Field label="Apalancamiento" value={leverage} set={setLeverage} suffix="x" />
        <Field label="Entrada" value={entry} set={setEntry} suffix="$" />
        <Field
          label="Margen de mantenimiento"
          value={mmr}
          set={setMmr}
          suffix="%"
        />
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
        <Result
          label="Precio de liquidación"
          value={
            result.valid
              ? `$${formatNumber(result.liquidation, 2)}`
              : "—"
          }
          tone="down"
        />
        <Result
          label="Distancia"
          value={
            result.valid
              ? `${formatNumber(result.distance, 2)}%`
              : "—"
          }
          tone={Math.abs(result.distance) < 10 ? "down" : "default"}
        />
        <Result
          label="Valor de la posición"
          value={`$${formatNumber(result.positionValue, 2)}`}
        />
        <Result label="Unidades" value={formatNumber(result.units, 4)} />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        {result.valid
          ? `Con ${formatNumber(result.leverage, 0)}x, un movimiento del ${formatNumber(
              Math.abs(result.distance),
              2,
            )}% en contra te liquida. En un mercado 24/7, eso puede ocurrir mientras duermes.`
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
        <span className="pl-1 text-[11px] text-faint">{suffix}</span>
      </div>
    </label>
  );
}

function Result({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "down";
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-faint">{label}</p>
      <p
        className={`num mt-0.5 text-[15px] font-medium ${
          tone === "down" ? "text-down" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
