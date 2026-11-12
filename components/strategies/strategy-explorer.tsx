"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
import {
  STRATEGY_DIFFICULTIES,
  STRATEGY_FAMILIES,
  type Strategy,
  type StrategyDifficulty,
  type StrategyFamily,
} from "@/content/estrategias";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StrategyExplorer({ strategies }: { strategies: Strategy[] }) {
  const [family, setFamily] = useState<StrategyFamily | "todas">("todas");
  const [difficulty, setDifficulty] = useState<StrategyDifficulty | "todas">(
    "todas",
  );

  const filtered = useMemo(
    () =>
      strategies.filter(
        (strategy) =>
          (family === "todas" || strategy.family === family) &&
          (difficulty === "todas" || strategy.difficulty === difficulty),
      ),
    [strategies, family, difficulty],
  );

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-2xl border border-line bg-surface p-3">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            Filtrar
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STRATEGY_FAMILIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFamily(item.id)}
              aria-pressed={family === item.id}
              className={cn(
                "shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                family === item.id
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line bg-surface-2/60 text-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STRATEGY_DIFFICULTIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDifficulty(item.id)}
              aria-pressed={difficulty === item.id}
              className={cn(
                "shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                difficulty === item.id
                  ? "border-info/30 bg-info/10 text-info"
                  : "border-line bg-surface-2/60 text-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((strategy) => (
          <StrategyCard key={strategy.slug} strategy={strategy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-4 text-[12px] text-muted">
          No hay estrategias con esos filtros. Prueba con otra combinación.
        </p>
      )}

      {filtered.length > 0 && <ComparisonTable strategies={filtered} />}
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: Strategy }) {
  return (
    <Link
      href={`/aprender/estrategias/${strategy.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2/40"
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: strategy.accent }}
      />
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="default">{strategy.familyLabel}</Badge>
        <Badge tone="outline">{strategy.difficulty}</Badge>
        <span className="ml-auto text-[10px] text-faint">
          {strategy.horizon}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-semibold">{strategy.name}</p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
        {strategy.tagline}
      </p>
      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-faint">
        {strategy.context[0]}
      </p>
      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-accent">
        Ver ficha <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function ComparisonTable({ strategies }: { strategies: Strategy[] }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold">Comparativa rápida</h2>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-faint">
              <th className="px-3 py-2 font-medium">Estrategia</th>
              <th className="px-3 py-2 font-medium">Familia</th>
              <th className="px-3 py-2 font-medium">Horizonte</th>
              <th className="px-3 py-2 font-medium">Dificultad</th>
              <th className="px-3 py-2 font-medium">R:B orientativo</th>
              <th className="px-3 py-2 font-medium">Cuándo</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((strategy) => (
              <tr key={strategy.slug} className="border-t border-line/60">
                <td className="px-3 py-2">
                  <Link
                    href={`/aprender/estrategias/${strategy.slug}`}
                    className="inline-flex items-center gap-1.5 font-medium hover:text-accent"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: strategy.accent }}
                    />
                    {strategy.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-muted">{strategy.familyLabel}</td>
                <td className="px-3 py-2 text-muted">{strategy.horizon}</td>
                <td className="px-3 py-2 text-muted">{strategy.difficulty}</td>
                <td className="num px-3 py-2 text-muted">{strategy.risk.rr}</td>
                <td className="max-w-[220px] px-3 py-2 text-faint">
                  <span className="line-clamp-1">{strategy.context[0]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
