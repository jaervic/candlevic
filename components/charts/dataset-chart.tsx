"use client";

import { useEffect, useState } from "react";
import { Loader2, Table2 } from "lucide-react";
import { loadDataset, type DatasetId } from "@/lib/datasets";
import type { Candle } from "@/lib/indicators";
import { PriceChart, type ChartMarker, type Overlay } from "./price-chart";
import { cn, formatPercent, formatPrice } from "@/lib/utils";
import { ChartDataTable } from "./chart-data-table";

export type DatasetChartProps = {
  dataset: DatasetId;
  from?: number;
  to?: number;
  height?: number;
  overlays?: Overlay[];
  showVolume?: boolean;
  showRsi?: boolean;
  showBollinger?: boolean;
  showMacd?: boolean;
  markers?: ChartMarker[];
  priceLines?: number[];
  onPick?: (absoluteIndex: number) => void;
  className?: string;
  caption?: string;
};

export function DatasetChart({
  dataset,
  from = 0,
  to,
  height = 260,
  overlays,
  showVolume,
  showRsi,
  showBollinger,
  showMacd,
  markers,
  priceLines,
  onPick,
  className,
  caption,
}: DatasetChartProps) {
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [showData, setShowData] = useState(false);
  const [meta, setMeta] = useState<{
    symbol: string;
    interval: string;
    source: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    setCandles(null);
    loadDataset(dataset).then((data) => {
      if (!active) return;
      setMeta({
        symbol: data.symbol,
        interval: data.interval,
        source: data.source,
      });
      setCandles(data.candles);
    });
    return () => {
      active = false;
    };
  }, [dataset]);

  if (!candles) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-line bg-surface",
          className,
        )}
        style={{ height }}
      >
        <Loader2 className="h-5 w-5 animate-spin text-faint" />
      </div>
    );
  }

  const end = to ?? candles.length;
  const slice = candles.slice(from, end);
  const relativeMarkers = markers?.map((m) => ({ ...m, index: m.index - from }));

  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-line bg-surface", className)}>
      <PriceChart
        candles={slice}
        symbol={meta?.symbol}
        interval={meta?.interval}
        height={height}
        overlays={overlays}
        showVolume={showVolume}
        showRsi={showRsi}
        showBollinger={showBollinger}
        showMacd={showMacd}
        markers={relativeMarkers}
        priceLines={priceLines}
        onPick={onPick ? (rel) => onPick(rel + from) : undefined}
      />
      <figcaption className="border-t border-line/70 px-3 py-1.5">
        <div className="flex items-center justify-between gap-2 text-[10px] text-faint">
          <span>{caption ?? "Datos históricos reales"}</span>
          <span className="shrink-0">
            {meta?.symbol} · {meta?.interval} · {meta?.source}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[9px] text-faint">
          <span>
            Últimas {slice.length} velas · Máx{" "}
            {formatPrice(Math.max(...slice.map((candle) => candle.high)))} · Mín{" "}
            {formatPrice(Math.min(...slice.map((candle) => candle.low)))} ·{" "}
            {formatPercent(
              ((slice[slice.length - 1].close - slice[0].close) /
                slice[0].close) *
                100,
            )}
          </span>
          <button
            type="button"
            onClick={() => setShowData((value) => !value)}
            aria-expanded={showData}
            className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-[9px] text-muted transition-colors hover:text-fg"
          >
            <Table2 className="h-3 w-3" />
            {showData ? "Ocultar datos" : "Ver datos"}
          </button>
        </div>
      </figcaption>
      {showData && (
        <ChartDataTable candles={slice} interval={meta?.interval} />
      )}
    </figure>
  );
}
