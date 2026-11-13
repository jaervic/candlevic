"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import {
  DATASETS,
  DATASET_IDS,
  isDatasetId,
  loadDataset,
  type DatasetId,
} from "@/lib/datasets";
import type { Candle } from "@/lib/indicators";
import {
  BACKTEST_STRATEGIES,
  STRATEGY_NAMES,
  runBacktest,
  runBacktests,
  type BacktestResult,
  type StrategyId,
} from "@/lib/backtest";
import { track } from "@/lib/analytics";
import {
  cn,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/utils";

const COLORS = [
  "var(--color-accent)",
  "var(--color-info)",
  "var(--color-up)",
  "var(--color-down)",
  "#a78bfa",
  "#f472b6",
  "#22d3ee",
];

export function Backtest() {
  const [datasetId, setDatasetId] = useState<DatasetId>("btc-1d");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [withFees, setWithFees] = useState(true);
  const [slippage, setSlippage] = useState(0);
  const [source, setSource] = useState("");
  const [selected, setSelected] = useState<StrategyId[]>([
    "hold",
    "sma",
    "dca",
  ]);
  const [params, setParams] = useState({
    fast: 20,
    slow: 50,
    rsiBuy: 30,
    rsiSell: 70,
    donchianEntry: 20,
    donchianExit: 10,
    rangeWindow: 20,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataset = params.get("dataset");
    if (dataset && isDatasetId(dataset)) setDatasetId(dataset);
    const strategy = params.get("strategy") as StrategyId | null;
    if (strategy && BACKTEST_STRATEGIES.includes(strategy)) {
      setSelected(strategy === "hold" ? ["hold"] : ["hold", strategy]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadDataset(datasetId).then((data) => {
      if (!active) return;
      setCandles(data.candles);
      setSource(data.source);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [datasetId]);

  const options = useMemo(
    () => ({
      fee: withFees ? 0.001 : 0,
      slippage,
      ...params,
    }),
    [withFees, slippage, params],
  );

  const results = useMemo(
    () =>
      candles.length > 0 ? runBacktests(candles, selected, options) : [],
    [candles, selected, options],
  );

  const benchmark = useMemo(
    () =>
      candles.length > 0 ? runBacktest(candles, "hold", options) : null,
    [candles, options],
  );

  useEffect(() => {
    if (candles.length > 0) {
      track("backtest_run", {
        dataset: datasetId,
        fees: withFees,
        slippage,
        strategies: selected,
      });
    }
  }, [candles.length, datasetId, withFees, slippage, selected]);

  function updateParam(key: keyof typeof params, value: string) {
    const parsed = Number(value.replace(",", "."));
    if (!Number.isFinite(parsed)) return;
    setParams((previous) => ({
      ...previous,
      [key]: Math.max(2, Math.min(300, Math.round(parsed))),
    }));
  }

  function toggleStrategy(id: StrategyId) {
    setSelected((previous) => {
      if (previous.includes(id)) {
        return previous.length > 1
          ? previous.filter((strategy) => strategy !== id)
          : previous;
      }
      if (previous.length >= 4) return previous;
      return [...previous, id];
    });
  }

  const entry = DATASETS[datasetId];

  return (
    <div className="space-y-5">
      <header>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-faint">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 hover:text-muted"
          >
            <ArrowLeft className="h-3 w-3" /> Laboratorio
          </Link>
          <Link href="/aprender/backtesting" className="hover:text-muted">
            Lección: qué es el backtesting
          </Link>
          <Link href="/aprender/estrategias" className="hover:text-muted">
            Biblioteca de estrategias
          </Link>
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Práctica
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Backtesting didáctico
        </h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Compara hasta cuatro estrategias sobre datos reales. No es una
          recomendación: es una forma de ver el efecto del timing, los costes y
          el drawdown.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-line bg-surface p-3">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-faint">
            Activo
          </p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
            {DATASET_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setDatasetId(id)}
                aria-pressed={id === datasetId}
                className={cn(
                  "shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                  id === datasetId
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line bg-surface-2/60 text-muted hover:text-fg",
                )}
              >
                {DATASETS[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line/70 pt-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-wider text-faint">
              Estrategias a comparar
            </p>
            <span className="text-[10px] text-faint">Máx. 4</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BACKTEST_STRATEGIES.map((id) => {
              const active = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleStrategy(id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                    active
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-line bg-surface-2/60 text-muted hover:text-fg",
                  )}
                >
                  {STRATEGY_NAMES[id]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3">
          <p className="text-[10px] uppercase tracking-wider text-faint">
            Costes
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setWithFees(false)}
              aria-pressed={!withFees}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-[11px]",
                !withFees
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              Sin costes
            </button>
            <button
              onClick={() => setWithFees(true)}
              aria-pressed={withFees}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-[11px]",
                withFees
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              Con 0,1 %
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3">
          <p className="text-[10px] uppercase tracking-wider text-faint">
            Slippage
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 0, label: "Sin slippage" },
              { value: 0.0005, label: "0,05 %" },
              { value: 0.001, label: "0,1 %" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSlippage(option.value)}
                aria-pressed={slippage === option.value}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px]",
                  slippage === option.value
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line text-muted hover:text-fg",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <details className="border-t border-line/70 pt-3">
          <summary className="cursor-pointer text-[10px] uppercase tracking-wider text-faint hover:text-muted">
            Parámetros de las estrategias
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { key: "fast" as const, label: "SMA rápida", value: params.fast },
              { key: "slow" as const, label: "SMA lenta", value: params.slow },
              {
                key: "rsiBuy" as const,
                label: "RSI compra",
                value: params.rsiBuy,
              },
              {
                key: "rsiSell" as const,
                label: "RSI venta",
                value: params.rsiSell,
              },
              {
                key: "donchianEntry" as const,
                label: "Donchian entrada",
                value: params.donchianEntry,
              },
              {
                key: "donchianExit" as const,
                label: "Donchian salida",
                value: params.donchianExit,
              },
              {
                key: "rangeWindow" as const,
                label: "Ventana de rango",
                value: params.rangeWindow,
              },
            ].map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1 block text-[9px] uppercase tracking-wider text-faint">
                  {field.label}
                </span>
                <input
                  type="number"
                  min={2}
                  max={300}
                  value={field.value}
                  onChange={(event) =>
                    updateParam(field.key, event.target.value)
                  }
                  className="num h-8 w-full rounded-lg border border-line bg-surface-2 px-2 text-[11px] text-fg outline-none focus:border-accent/40"
                />
              </label>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[9px] leading-relaxed text-faint">
              Cambiar parámetros es fácil; validar que funcionan fuera de la
              muestra, no. Evita ajustar hasta que el pasado quede perfecto.
            </p>
            <button
              onClick={() =>
                setParams({
                  fast: 20,
                  slow: 50,
                  rsiBuy: 30,
                  rsiSell: 70,
                  donchianEntry: 20,
                  donchianExit: 10,
                  rangeWindow: 20,
                })
              }
              className="shrink-0 rounded-lg border border-line px-2 py-1 text-[10px] text-faint hover:text-fg"
            >
              Restablecer
            </button>
          </div>
        </details>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">
              {entry.label} · {entry.interval}
            </h2>
            <p className="text-[10px] text-faint">
              {entry.kind === "crypto" ? "Cripto" : "Acciones"} · {source} ·
              capital inicial 10.000 $
            </p>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-faint" />}
        </div>

        {results.length > 0 && !loading ? (
          <>
            <div className="mt-3">
              <EquityChart results={results} />
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {results.map((result, index) => (
                <span
                  key={result.id}
                  className="inline-flex items-center gap-1.5 text-[10px] text-muted"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {result.name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[240px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-faint" />
          </div>
        )}
      </section>

      {results.length > 0 &&
        (candles.length < 200 ||
          results.some(
            (result) => result.id !== "hold" && result.trades < 10,
          )) && (
          <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 p-3">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <p className="text-[10.5px] leading-relaxed text-muted">
              <span className="font-medium text-fg">Muestra corta.</span>{" "}
              {candles.length < 200
                ? `${candles.length} velas es poco para concluir.`
                : "Alguna estrategia cierra menos de 10 operaciones."}{" "}
              Un resultado así describe este tramo, no una ventaja estadística.
              Prueba otros periodos antes de sacar conclusiones.
            </p>
          </div>
        )}

      {results.length > 0 && (
        <section className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="text-faint">
                <th className="px-4 py-2.5 font-medium">Estrategia</th>
                <th className="px-3 py-2.5 text-right font-medium">Final</th>
                <th className="px-3 py-2.5 text-right font-medium">
                  Rentabilidad
                </th>
                <th className="px-3 py-2.5 text-right font-medium">vs. hold</th>
                <th className="px-3 py-2.5 text-right font-medium">
                  Drawdown
                </th>
                <th className="px-3 py-2.5 text-right font-medium">
                  Operaciones
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const excess = benchmark
                  ? result.returnPct - benchmark.returnPct
                  : 0;
                return (
                  <tr key={result.id} className="border-t border-line/60">
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        {result.name}
                      </span>
                    </td>
                    <td className="num px-3 py-2.5 text-right">
                      ${formatNumber(result.finalValue, 0)}
                    </td>
                    <td
                      className={cn(
                        "num px-3 py-2.5 text-right",
                        result.returnPct >= 0 ? "text-up" : "text-down",
                      )}
                    >
                      {formatPercent(result.returnPct)}
                    </td>
                    <td
                      className={cn(
                        "num px-3 py-2.5 text-right",
                        result.id === "hold"
                          ? "text-faint"
                          : excess >= 0
                            ? "text-up"
                            : "text-down",
                      )}
                    >
                      {result.id === "hold"
                        ? "—"
                        : `${excess >= 0 ? "+" : "−"}${formatNumber(
                            Math.abs(excess),
                            1,
                          )} pp`}
                    </td>
                    <td className="num px-3 py-2.5 text-right text-muted">
                      {formatNumber(result.maxDrawdown, 1)}%
                    </td>
                    <td className="num px-3 py-2.5 text-right text-muted">
                      {result.trades}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      <section className="grid gap-2.5 sm:grid-cols-3">
        {[
          {
            title: "Comprar y mantener",
            body: "Un solo trade. La rentabilidad depende del activo y del drawdown que puedas soportar sin vender.",
          },
          {
            title: "Cruce de medias",
            body: "Entra cuando la media rápida supera a la lenta. Los cruces falsos y los costes pesan en rangos.",
          },
          {
            title: "DCA 500 $/mes",
            body: "Reparte el timing. No elimina el riesgo de mercado, pero reduce el impacto de entrar en un mal día.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-line bg-surface p-3"
          >
            <p className="text-[12px] font-medium">{item.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <p className="rounded-xl border border-line bg-surface p-3 text-[10.5px] leading-relaxed text-faint">
        Simulación sobre datos históricos. Incluye la comisión y el slippage
        seleccionados, pero no impuestos. Los resultados pasados no garantizan
        los futuros.{" "}
        <Link
          href="/aprender/estrategias"
          className="text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Ver qué hay detrás de cada estrategia
        </Link>
        .
      </p>
    </div>
  );
}

function EquityChart({ results }: { results: BacktestResult[] }) {
  const width = 600;
  const height = 240;
  const padLeft = 52;
  const padRight = 10;
  const padTop = 16;
  const padBottom = 28;

  const all = results.flatMap((result) =>
    result.equity.map((point) => point.value),
  );
  if (all.length === 0) return null;

  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const count = Math.max(...results.map((result) => result.equity.length), 1);

  const x = (index: number) =>
    padLeft + (index / Math.max(count - 1, 1)) * (width - padLeft - padRight);
  const y = (value: number) =>
    height - padBottom - ((value - min) / span) * (height - padTop - padBottom);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Curvas de equity de las estrategias seleccionadas"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((step) => {
        const value = min + step * span;
        const yy = y(value);
        return (
          <g key={step}>
            <line
              x1={padLeft}
              y1={yy}
              x2={width - padRight}
              y2={yy}
              stroke="var(--color-line)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x={padLeft - 6}
              y={yy + 3}
              textAnchor="end"
              fontSize="8"
              fill="var(--color-faint)"
            >
              {formatNumber(value, 0)}
            </text>
          </g>
        );
      })}

      {results.map((result, index) => (
        <polyline
          key={result.id}
          points={result.equity
            .map(
              (point, pointIndex) =>
                `${x(pointIndex).toFixed(1)},${y(point.value).toFixed(1)}`,
            )
            .join(" ")}
          fill="none"
          stroke={COLORS[index % COLORS.length]}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ))}

      {[0, Math.floor((count - 1) / 2), count - 1].map((index) => {
        const time = results[0]?.equity[index]?.time;
        if (!time) return null;
        const anchor =
          index === 0 ? "start" : index === count - 1 ? "end" : "middle";
        return (
          <text
            key={index}
            x={x(index)}
            y={height - 8}
            textAnchor={anchor}
            fontSize="8"
            fill="var(--color-faint)"
          >
            {formatDate(time * 1000)}
          </text>
        );
      })}
    </svg>
  );
}
